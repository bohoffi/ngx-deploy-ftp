import { logging } from '@angular-devkit/core';

import { Client } from 'basic-ftp';

import { DeployOptions } from '../schema/deploy-schema';

export const run = async (
    sourceDirectory: string,
    options: DeployOptions,
    logger: logging.LoggerApi
) => {

    try {

        logger.info('🔍 Verifying passed options...');
        verifyRequiredOptions(options);
        logger.info('✔️ Verified passed options');

        if (options.dryRun) {
            logger.warn('As --dry-Run was used nothing will get changed on the remote.');
        }

        const client = new Client();
        client.ftp.verbose = options.verbose || options.dryRun || false;

        logger.info('🌐 Connecting to remote...');

        await client.access({
            host: options.host,
            port: options.port || 21,
            user: options.username,
            password: options.password,
            secure: options.tls ?? true
        })

        logger.info(`✔️ Connected to remote ${options.host}`);

        if (options.remoteDir) {
            logger.info(`🖲️ Changing to remote directory "${options.remoteDir}"`);
            const cdResult = await client.cd(options.remoteDir);
            // a code outside the 2xx range is considered as unsuccessful
            if (cdResult.code < 200 || cdResult.code >= 300) {
                throw new Error('Could not navigate to remote directory');
            }
            logger.info('✔️ Changed to remote directory');
        }

        if (options.cleanRemote) {
            logger.info('🧹 Cleaning the remote directory...');

            if (!options.dryRun) {
                await client.clearWorkingDir();
            }

            logger.info('✔️ Remote directory cleaned');
        }

        logger.info('📤 Uploading the application...');

        if (!options.dryRun) {
            await client.uploadFromDir(sourceDirectory);
        }

        logger.info('✔️ Application uploaded');

        client.close();

        logger.info('🚀 Successfully deployed via ngx-deploy-ftp!');

        if (options.dryRun) {
            logger.warn('As --dry-Run was used nothing was changed on the remote.');
        }

    } catch (error) {
        logger.error('❌ An error occurred!');
        throw error;
    }
};

export const verifyRequiredOptions = (options: DeployOptions): void => {

    if (!options.host) {
        throw new Error('Cannot deploy the application without a host');
    }
    if (!options.username) {
        throw new Error('Cannot deploy the application without a username');
    }
    if (!options.password) {
        throw new Error('Cannot deploy the application without a password');
    }
};
