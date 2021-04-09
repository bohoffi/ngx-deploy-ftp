import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';
import { Schema as ApplicationOptions } from '@schematics/angular/application/schema';

import { NgAddOptions } from '../schema/ng-add-schema';

const collectionPath = require.resolve('../collection.json');

const workspaceOptions: WorkspaceOptions = {
  name: 'workspace',
  newProjectRoot: 'tests',
  version: '9.1.4',
};

const appOptions: ApplicationOptions = { name: 'test-app' };

const addOptions: NgAddOptions = {
  project: appOptions.name
};

const emptyAddOptions: NgAddOptions = {};

const corruptAddOptions: NgAddOptions = {
  project: 'i-am-not-existing'
};

describe('ng add ngx-deploy-ftp', () => {
  const testRunner = new SchematicTestRunner('schematics', collectionPath);

  async function initAngularProject(): Promise<UnitTestTree> {
    const appTree = await testRunner
      .runExternalSchematicAsync('@schematics/angular', 'workspace', workspaceOptions)
      .toPromise();
    return await testRunner
      .runExternalSchematicAsync('@schematics/angular', 'application', appOptions, appTree)
      .toPromise();
  }

  it('fails with a missing tree', async () => {
    await expect(testRunner.runSchematicAsync('ng-add', {}, Tree.empty()).toPromise()).rejects.toThrow();
  });

  it('fails with a non-existing project', async () => {
    await expect(testRunner.runSchematicAsync('ng-add', corruptAddOptions, Tree.empty()).toPromise()).rejects.toThrow();
  });

  it('adds ngx-deploy-ftp to the default project', async () => {
    let appTree = await initAngularProject();
    appTree = await testRunner.runSchematicAsync('ng-add', emptyAddOptions, appTree).toPromise();
    const angularJson = JSON.parse(appTree.readContent('/angular.json'));

    expect(angularJson.projects[appOptions.name].architect.deploy).toBeDefined();
    expect(angularJson.projects[appOptions.name].architect.deploy.builder).toBe('ngx-deploy-ftp:deploy');
  });

  it('adds ngx-deploy-ftp to an existing project', async () => {
    let appTree = await initAngularProject();
    appTree = await testRunner.runSchematicAsync('ng-add', addOptions, appTree).toPromise();
    const angularJson = JSON.parse(appTree.readContent('/angular.json'));

    expect(angularJson.projects[appOptions.name].architect.deploy).toBeDefined();
    expect(angularJson.projects[appOptions.name].architect.deploy.builder).toBe('ngx-deploy-ftp:deploy');
  });
});