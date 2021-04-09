import { BuilderContext, BuilderOutput, BuilderRun, ScheduleOptions, Target } from '@angular-devkit/architect';
import { JsonObject, logging } from '@angular-devkit/core';
import { DeployOptions } from '../schema/deploy-schema';
import { ftpDeploy } from './ftp-deploy';

const deployOptions: DeployOptions = {
    configuration: 'production'
};

const mockFtpEngine: {
    run: (
        sourceDirectory: string,
        options: DeployOptions,
        logger: logging.LoggerApi
    ) => Promise<void>;
} = {
    run: (_: string, __: DeployOptions, __2: logging.LoggerApi) => Promise.resolve()
};

const targetOutputPath = 'dist';

let builderContextMock: BuilderContext;

describe('ngx-deploy-ftp ftp-deploy', () => {

    beforeEach(() => initMockContext(true));

    it('should build the project', async () => {
        const spy = spyOn(builderContextMock, 'scheduleTarget').and.callThrough();
        await ftpDeploy(mockFtpEngine, builderContextMock, deployOptions);

        expect(spy).toHaveBeenCalledWith(
            {
                target: builderContextMock.target?.target,
                configuration: deployOptions.configuration,
                project: builderContextMock.target?.project
            },
            {}
        );
    });

    it('should build the project with specified baseHref', async () => {
        const spy = spyOn(builderContextMock, 'scheduleTarget').and.callThrough();
        await ftpDeploy(mockFtpEngine, builderContextMock, {
            ...deployOptions,
            ...{
                baseHref: '/another-href'
            }
        });

        expect(spy).toHaveBeenCalledWith(
            {
                target: builderContextMock.target?.target,
                configuration: deployOptions.configuration,
                project: builderContextMock.target?.project
            },
            { baseHref: '/another-href' }
        );
    });

    it('should invoke the engine', async () => {
        const spy = spyOn(mockFtpEngine, 'run').and.callThrough();
        await ftpDeploy(mockFtpEngine, builderContextMock, deployOptions);

        expect(spy).toHaveBeenCalledWith(targetOutputPath, deployOptions, builderContextMock.logger);
    });

    describe('ngx-deploy-ftp ftp-deploy error handling', () => {

        it('throws if there is no target', async () => {
            builderContextMock.target = undefined;

            await expect(ftpDeploy(mockFtpEngine, builderContextMock, deployOptions)).rejects.toThrowError('❌ Cannot execute the build target');
        });

        it('throws if app building fails', async () => {
            builderContextMock.scheduleTarget = (
                _: Target,
                __?: JsonObject,
                ___?: ScheduleOptions
            ) =>
                Promise.resolve({
                    result: Promise.resolve(builderOutput(false))
                } as BuilderRun);

            await expect(ftpDeploy(mockFtpEngine, builderContextMock, deployOptions)).rejects.toThrowError('❌ Error while building the app.');
        });

        it('throws if there is no outputPath', async () => {
            builderContextMock.getTargetOptions = (_: Target) =>
                Promise.resolve({
                    outputPath: null
                });

            await expect(ftpDeploy(mockFtpEngine, builderContextMock, deployOptions)).rejects
            .toThrowError(`Cannot read the output path option of the Angular project '${builderContextMock.target?.project}' in angular.json`);
        });
    });
});

const initMockContext = (buildResult: boolean, target: Target = {
    project: 'mockProject',
    target: 'build'
}): void => {
    builderContextMock = {
        id: 1,
        analytics: null as any,
        builder: {
            builderName: 'builderName',
            description: 'Description for builder',
            optionSchema: false
        },
        logger: new logging.NullLogger(),
        target: target,
        workspaceRoot: 'cwd',
        currentDirectory: 'cwd',
        addTeardown: _ => { },
        getBuilderNameForTarget: () => Promise.resolve(''),
        getProjectMetadata: (_: string | Target) => Promise.resolve({} as JsonObject),
        getTargetOptions: (_: Target) =>
            Promise.resolve({
                outputPath: targetOutputPath
            }),
        reportProgress: (_: number, __?: number, ___?: string) => { },
        reportRunning: () => { },
        reportStatus: (_: string) => { },
        scheduleBuilder: (_: string, __?: JsonObject, ___?: ScheduleOptions) =>
            Promise.resolve({} as BuilderRun),
        scheduleTarget: (_: Target, __?: JsonObject, ___?: ScheduleOptions) =>
            Promise.resolve({
                result: Promise.resolve(builderOutput(buildResult))
            } as BuilderRun),
        validateOptions: _ => Promise.resolve({} as any),
    };
};

const builderOutput = (success: boolean): BuilderOutput => {
    return {
        success: success
    };
};
