import { logging } from '@angular-devkit/core';

import { DeployOptions } from 'schema/deploy-schema';

export const run = async (
    sourceDirectory: string,
    options: DeployOptions,
    logger: logging.LoggerApi
) => {

    try {

        // TODO do the actual FTP

    } catch (error) {
        logger.error('❌ An error occurred!');
        throw error;
    }
};
