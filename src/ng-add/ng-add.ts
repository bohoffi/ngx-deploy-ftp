import {
    SchematicContext,
    SchematicsException,
    Tree
} from '@angular-devkit/schematics';
import { workspaces } from '@angular-devkit/core';
import { NgAddOptions } from '../schema/ng-add-schema';
import { createWorkspaceHost } from '../utils/workspace';
import { addProjectTarget, checkTargetOption, checkProjectType } from '../utils/project';

export const ngAdd = (options: NgAddOptions) =>
    async (tree: Tree, context: SchematicContext) => {

        const workspaceHost = createWorkspaceHost(tree);
        const { workspace } = await workspaces.readWorkspace('/', workspaceHost);

        if (!options.project) {
            if (workspace.extensions.defaultProject) {
                options.project = workspace.extensions.defaultProject as string;
            } else {
                throw new SchematicsException(
                    'No Angular project selected and no default project in the workspace'
                );
            }
        }

        const project = workspace.projects.get(options.project);
        if (!project) {
            throw new SchematicsException(`Invalid project name: ${options.project}`);
        }

        if (!checkProjectType(project, 'application')) {
            throw new SchematicsException(
                `Deploy requires an Angular project type of "application" in angular.json`
            );
        }

        if (!checkTargetOption(project, 'build', 'outputPath')) {
            throw new SchematicsException(
                `Cannot read the output path (architect.build.options.outputPath) of the Angular project "${options.project}" in angular.json`
            );
        }

        addProjectTarget(project, 'deploy', 'ngx-deploy-ftp:deploy', {});

        // Apply changes
        await workspaces.writeWorkspace(workspace, workspaceHost);
        return tree;
    };