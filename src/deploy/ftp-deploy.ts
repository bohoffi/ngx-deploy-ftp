import { BuilderContext, BuilderOutput } from '@angular-devkit/architect';
import { JsonObject, logging } from '@angular-devkit/core';

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

    context.logger.info(
        `🔨 Building "${context.target.project}". Configuration: "${options.configuration}". ${options.baseHref ? ' Your base-href: "' + options.baseHref + '"' : ''}`
      );

      const build = await context.scheduleTarget(
        {
          target: 'build',
          project: context.target.project,
          configuration: options.configuration as string
        },
        overrides as JsonObject
      );
    const buildResult = await build.result;

    if (!buildResult.success) {
        throw new Error('❌ Error while building the app.');
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

    if (!context.target) {
        throw new Error('❌ Cannot read the target options');
    }

    const buildOptions = await context.getTargetOptions(
        {
            target: 'build',
            project: context.target.project,
            configuration: options.configuration as string
          }
    );
    if (!buildOptions.outputPath || typeof buildOptions.outputPath !== 'string') {
        throw new Error(
            `Cannot read the output path option of the Angular project '${context.target.project}' in angular.json`
        );
    }

    await engine.run(
        buildOptions.outputPath,
        options,
        (context.logger as unknown) as logging.LoggerApi
    );
}
