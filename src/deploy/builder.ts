import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';

import { DeployOptions } from 'schema/deploy-schema';
import * as engine from '../engine/ftp-engine';
import { ftpDeploy } from './ftp-deploy';

const deployBuilder = async (options: DeployOptions, context: BuilderContext): Promise<BuilderOutput> => {

    if (!context.target) {
        throw new Error('Cannot deploy the application without a target');
    }

    if (!options.configuration) {
        options.configuration = 'production';
    }

    try {
        await ftpDeploy(engine, context, options);
    } catch (e) {
        context.logger.error('❌ An error occurred when trying to deploy:');
        context.logger.error(e.message);
        return { success: false };
    }

    return { success: true };
};

export default createBuilder(deployBuilder)