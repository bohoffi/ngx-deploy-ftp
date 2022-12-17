<a name="2.0.0"></a>

# [2.0.0](https://github.com/bohoffi/ngx-deploy-ftp/compare/1.1.0...2.0.0) (2022-12-18)

### Features

- update Angular compatibility

### BREAKING CHANGES

- the `ng-add` schematic will add the `deploy` target to the first `application` project in the workspace when the `project` parameter is omitted ([582dccc](https://github.com/bohoffi/ngx-deploy-ftp/commit/582dccc677c7b10ddb8f584ef56129a8de99a2c7))
  - this change was made due to the removal of the `defaultProject` property in the workspace file

<a name="1.1.0"></a>

# [1.1.0](https://github.com/bohoffi/ngx-deploy-ftp/compare/1.0.0-next.1...1.1.0) (2022-01-26)

### Features

- increase information output when loggin error ([4ad0e17](https://github.com/bohoffi/ngx-deploy-ftp/commit/4ad0e171978fb7687a8a033873568a60f609bfd9))

<a name="1.0.0-next.1"></a>

# [1.0.0-next.1](https://github.com/bohoffi/ngx-deploy-ftp/compare/1.0.0-next.0...1.0.0-next.1) (2021-04-09)

### Bug fixes

- respect setting `--tls false` ([ffe7137](https://github.com/bohoffi/ngx-deploy-ftp/commit/ffe71377ecb01d4a14f09a5393ac921b3cfbf473))

<a name="1.0.0-next.0"></a>

# 1.0.0-next.0 (2021-04-09)

Initial pre-release

### Features

- ng-add support
  - adds the deploy builder to passed or default project
- dry-run support
  - test preparations, FTP connection without changing anything on the remote
- FTP deploy your angular application
