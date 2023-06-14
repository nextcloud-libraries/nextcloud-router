# Changelog

All notable changes to this project will be documented in this file.

## 2.1.2 – 2023-06-13

[Full Changelog](https://github.com/nextcloud/nextcloud-router/compare/v2.1.1...v2.1.2)

### Fixed
- Do not export the declaration of `window.OC` to prevent typing clashes with applications

## 2.1.1 – 2023-04-21

[Full Changelog](https://github.com/nextcloud/nextcloud-router/compare/v2.1.0...v2.1.1)

### Fixed
- Moved @nextcloud/typings from dev to production dependency

## 2.1.0 – 2023-04-20

[Full Changelog](https://github.com/nextcloud/nextcloud-router/compare/v2.0.1...v2.1.0)

### Changed
- Dependency updates

## 2.0.1 - 2022-12-28

[Full Changelog](https://github.com/nextcloud/nextcloud-router/compare/v2.0.0...v2.0.1)

### Fixed
- fix: fix window variable definition

### Changed
- Add documentation link to Readme
- Add NPM image to readme
- chore: upgrade lockfile to version 2
- Dependency updates
- feat: add node test
- feat: fixup commits check
- fix: fix docs generation

## 2.0.0 - 2021-04-07
### Changed
- generateOcsUrl can now replace routing parameters like generateUrl
- generateOcsUrl no longer contains a trailing slash unless given in the URL
- Browserslist config updated, which means some older browsers are no longer supported
- Dependency updates

## 1.2.0 - 2020-08-20
### Added
- Nextcloud 20 support
### Changed
- Dependency updates

## 1.1.0 - 2020-03-19
### Added
- Typings for Nextcloud 19
### Changed
- Dependency updates
### Fixed
- Loosened version restrictions to allow better npm deduplication

## 1.0.2 - 2020-03-19
### Changed
- Dependency updates
### Fixed
- Update vulnerable packages
