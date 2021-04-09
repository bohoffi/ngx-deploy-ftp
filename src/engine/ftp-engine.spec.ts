import { DeployOptions } from '../schema/deploy-schema';

import * as engine from './ftp-engine';

const minRequiredOptions: DeployOptions = {
    host: 'i-am-the-host',
    username: 'user',
    password: 'passw0rd'
};

const missingHostOptions: DeployOptions = {
    username: 'user',
    password: 'passw0rd'
};

const missingUsernameOptions: DeployOptions = {
    host: 'i-am-the-host',
    password: 'passw0rd'
};

const missingPasswordOptions: DeployOptions = {
    host: 'i-am-the-host',
    username: 'user'
};

describe('ngx-deploy-ftp ftp-engine', () => {

    it('should pass option verification', () => {

        const spy = spyOn(engine, 'verifyRequiredOptions').and.callThrough();

        engine.verifyRequiredOptions(minRequiredOptions);

        expect(spy).toHaveBeenCalled();
    });

    it('should fail on missing host options', () => {
        expect(() => engine.verifyRequiredOptions(missingHostOptions)).toThrowError('Cannot deploy the application without a host');
    });

    it('should fail on missing username options', () => {
        expect(() => engine.verifyRequiredOptions(missingUsernameOptions)).toThrowError('Cannot deploy the application without a username');
    });

    it('should fail on missing password options', () => {
        expect(() => engine.verifyRequiredOptions(missingPasswordOptions)).toThrowError('Cannot deploy the application without a password');
    });
});
