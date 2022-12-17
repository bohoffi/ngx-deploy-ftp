import {
  SchematicContext,
  SchematicsException,
  Tree,
} from "@angular-devkit/schematics";
import { workspaces } from "@angular-devkit/core";
import { NgAddOptions } from "../schema/ng-add-schema";
import { createWorkspaceHost } from "../utils/workspace";
import {
  addProjectTarget,
  checkTargetOption,
  checkProjectType,
} from "../utils/project";

export const ngAdd = (options: NgAddOptions) => async (tree: Tree) => {
  const workspaceHost = createWorkspaceHost(tree);
  const { workspace } = await workspaces.readWorkspace("/", workspaceHost);

  if (!options.project) {
    const firstApplicationProjectIndex = Array.from(
      workspace.projects.values()
    ).findIndex(
      (projectDefinition) =>
        (projectDefinition.extensions.projectType as string) === "application"
    );
    if (firstApplicationProjectIndex >= 0) {
      options.project = Array.from(workspace.projects.keys()).at(
        firstApplicationProjectIndex
      );
    }
  }

  if (!options.project) {
    throw new SchematicsException(
      "No project selected and no application project in workspace"
    );
  }

  const project = workspace.projects.get(options.project);
  if (!project) {
    throw new SchematicsException(`Invalid project name: ${options.project}`);
  }

  if (!checkProjectType(project, "application")) {
    throw new SchematicsException(
      `Deploy requires an Angular project type of "application" in angular.json`
    );
  }

  if (!checkTargetOption(project, "build", "outputPath")) {
    throw new SchematicsException(
      `Cannot read the output path (architect.build.options.outputPath) of the Angular project "${options.project}" in angular.json`
    );
  }

  addProjectTarget(project, "deploy", "ngx-deploy-ftp:deploy", {});

  // Apply changes
  await workspaces.writeWorkspace(workspace, workspaceHost);
  return tree;
};
