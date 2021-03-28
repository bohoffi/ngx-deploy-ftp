import { JsonObject, workspaces } from '@angular-devkit/core';

export const checkProjectType = (project: workspaces.ProjectDefinition, checkType: string): boolean => {
    return project.extensions.projectType === checkType;
};

export const checkTargetOption = (project: workspaces.ProjectDefinition, target: string, option: string): boolean => {
    if (project.targets.get(target)?.options === null) {
        return false;
    }
    const options = (project.targets.get(target)?.options as JsonObject);
    return options.option !== null;
};

export const addProjectTarget = (project: workspaces.ProjectDefinition, target: string, builder: string, options: any): void => {
    project.targets.add({
        name: target,
        builder,
        options
    });
};
