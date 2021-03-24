import { workspaces } from '@angular-devkit/core';

export const checkProjectType = (project: workspaces.ProjectDefinition, checkType: string): boolean => {
    return project.extensions.projectType === checkType;
};

// export const checkOutputPath = (project: workspaces.ProjectDefinition): boolean => {
//     return !!project.extensions.architect
//         && !!(project.extensions.architect as JsonObject).build
//         && !!((project.extensions.architect as JsonObject).build as JsonObject).options
//         && !!(((project.extensions.architect as JsonObject).build as JsonObject).options as JsonObject).outputPath;
// };
export const checkTargetOption = (project: workspaces.ProjectDefinition, target: string, option: string): boolean => {
    return !!project.targets.get(target)?.options && !!project.targets.get(target)?.options[option];
};

// export const addArchitect = (project: workspaces.ProjectDefinition, architect: string, builder: string, options: any): void => {
//     (project.extensions.architect as JsonObject)[architect] = {
//         builder,
//         options
//     };
// };
export const addProjectTarget = (project: workspaces.ProjectDefinition, target: string, builder: string, options: any): void => {
    project.targets.add({
        name: target,
        builder,
        options
    });
};
