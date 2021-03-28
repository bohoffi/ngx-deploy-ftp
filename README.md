<img src="https://raw.githubusercontent.com/bohoffi/ngx-deploy-ftp/develop/assets/logo.svg" width="150">

# ngx-deploy-ftp 🚀 📤

Deploy Angular apps to an FTP remote using the Angular CLI

[![npm version](https://img.shields.io/npm/v/ngx-deploy-ftp.svg)](https://www.npmjs.com/package/ngx-deploy-ftp)
[![Apache 2.0](https://img.shields.io/badge/license-Apache%202.0-blue.svg?color=blue)](https://opensource.org/licenses/Apache-2.0)
![PR-builder](https://github.com/bohoffi/ngx-deploy-ftp/workflows/PR-builder/badge.svg)

* [⚠️ Prerequisites](#prerequisites)
* [📕 Usage](#usage)
* [📖 Options](#options)
  * [--base-href](#base-href)
  * [--configuration](#configuration)
  * [--no-build](#no-build)
  * [--host](#host)
  * [--port](#port)
  * [--tls](#tls)
  * [--username](#username)
  * [--password](#password)
  * [--remote-dir](#remote-dir)
  * [--clean-remote](#clean-remote)
  * [--verbose](#verbose)
  * [--dry-run](#dry-run)
* [Credits](#credits)

## ⚠️ Prerequisites

This package has the following prerequisites:
* Angular project created via [Angular CLI](https://github.com/angular/angular-cli) v9.0.0 or higher (or upgraded using `ng update`)

## 📕 Usage

1. Add `ngx-deploy-ftp` to your workspace (this command either requires a project passed using the `--project <PROJECT_NAME>` or a `defaultProject` present in your `angular.json`)
   ```sh
   ng add ngx-deploy-ftp
   ```

2. Deploy your app
   ```sh
   ng deploy <OPTIONS>
   ```

## 📖 Options

#### --base-href <a name="base-href"></a>

- **optional**
- Default: `undefined` (string)
- Example:
  - `ng deploy` – The tag `<base href="/">` remains unchanged in your `index.html`
  - `ng deploy --base-href=/sub-directory/` – The tag `<base href="/sub-directory/">` is added to your `index.html`

Specifies the base URL for the application being built. Same as `ng build --base-href=/XXX/`

#### --configuration <a name="configuration"></a>

- **optional**
- Default: `production` (string)
- Example:
  - `ng deploy` – Angular project is build in production mode
  - `ng deploy --configuration=test` – Angular project is using the configuration `test` (this configuration must exist in the `angular.json` file)

A named build target, as specified in the `configurations` section of `angular.json`.
Each named target is accompanied by a configuration of option defaults for that target.
Same as `ng build --configuration=XXX`.
This command has no effect if the option `--no-build` option is active.

#### --no-build <a name="no-build"></a>

- **optional**
- Default: `false` (boolean)
- Example:
  - `ng deploy` – Angular project is build in production mode before the deployment
  - `ng deploy --no-build` – Angular project is NOT build

Skip build process during deployment.
This can be used when you are sure that you haven't changed anything and want to deploy with the latest artifact.
This command causes the `--configuration` setting to have no effect.

#### --host <a name="host"></a>

- **required**
- Example:
  - `ng deploy --host myftpserver.com`

Specifies the target FTP host to use for deployment.

#### --port <a name="port"></a>

- **optional**
- Default: `21` (number)
- Example:
  - `ng deploy --port 1234`

Specifies the FTPs port to use for deployment.

#### --tls <a name="tls"></a>

- **optional**
- Default: `true` (boolean)
- Example:
  - `ng deploy --tls false` - turns off TLS for FTP

Indicates to connect to the FTP server using TLS or not.

#### --username <a name="username"></a>

- **required**
- Example:
  - `ng deploy --username bob`

Specifies the username to login on the FTP host.

#### --password <a name="password"></a>

- **required**
- Example:
  - `ng deploy --password passw0rd`

Specifies the password to login on the FTP host.

#### --remote-dir <a name="remote-dir"></a>

- **optional**
- Example:
  - `ng deploy --remote-dir 'sub-dir-a/sub-dir-aa'` - Deploys the app to remotes `sub-dir-a/sub-dir-aa`

Specifies the remotes directory path to deploy the app to.

#### --clean-remote <a name="clean-remote"></a>

- **optional**
- Default: `false` (boolean)
- Example:
  - `ng deploy --clean-remote` - Cleans the remotes working directory before deploying

Indicates if the remotes working directory should be cleaned before deployment.

#### --verbose <a name="verbose"></a>

- **optional**
- Default: `false` (boolean)
- Example:
  - `ng deploy --verbose`

Will increase the FTP clients log output. (using `--dry-run` will set this to true by default)

#### --dry-run <a name="dry-run"></a>

- **optional**
- Default: `false` (boolean)
- Example:
  - `ng deploy --dry-run`

For testing: Run through **without** making any changes. Will connect to the FTP, change the working directory (if passed) and disconnect.

## Configuration File TODO??

## Credits <a name="credits"></a>

Props to following repositorys for inspiration and deeper understanding:
- [ngx-deploy-starter](https://github.com/angular-schule/ngx-deploy-starter)
- [angular-cli-ghpages](https://github.com/angular-schule/angular-cli-ghpages)
- [ngx-deploy-docker](https://github.com/kauppfbi/ngx-deploy-docker)
- [ngx-deploy-npm](https://github.com/bikecoders/ngx-deploy-npm)