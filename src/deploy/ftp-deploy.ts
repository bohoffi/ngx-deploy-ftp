import { BuilderContext, BuilderOutput, targetFromTargetString } from '@angular-devkit/architect';
import { logging } from '@angular-devkit/core';

import { DeployOptions } from 'schema/deploy-schema';

export const ftpDeploy = async (
    engine: {
        run: (
            sourceDirectory: string,
            options: DeployOptions,
            logger: logging.LoggerApi
        ) => Promise<void>;
    },
    context: BuilderContext,
    options: DeployOptions
): Promise<void> => {

    if (options.noBuild) {
        context.logger.info(`📦 Skipping build`);
    } else {
        await build(context, options);
    }

    await deploy(engine, context, options);
};

const build = async (
    context: BuilderContext,
    options: DeployOptions
): Promise<BuilderOutput> => {

    if (!context.target) {
        throw new Error('❌ Cannot execute the build target');
    }

    const overrides = {
        ...(options.baseHref && { baseHref: options.baseHref })
    };

    context.logger.info(`🔨 Building "${context.target.project}"`);
    context.logger.info(`🔨 Build target "${options.buildTarget}"`);

    const build = await context.scheduleTarget(
        targetFromTargetString(`${options.buildTarget}`),
        {
            ...{},
            ...overrides
        }
    );
    const buildResult = await build.result;

    if (!buildResult.success) {
        throw new Error('Error while building the app.');
    }

    return buildResult;
};

const deploy = async (
    engine: {
        run: (
            sourceDirectory: string,
            options: DeployOptions,
            logger: logging.LoggerApi
        ) => Promise<void>;
    },
    context: BuilderContext,
    options: DeployOptions
): Promise<void> => {

    const buildOptions = await context.getTargetOptions(
        targetFromTargetString(`${options.buildTarget}`)
    );
    if (!buildOptions.outputPath || typeof buildOptions.outputPath !== 'string') {
        throw new Error(
            `Cannot read the output path option of the Angular project '${options.buildTarget}' in angular.json`
        );
    }

    await engine.run(
        buildOptions.outputPath,
        options,
        (context.logger as unknown) as logging.LoggerApi
    );
}
