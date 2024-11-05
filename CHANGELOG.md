# Changelog

## [0.8.0+20231031](https://github.com/elastic/elasticsearch-serverless-js/compare/v0.7.0+20231031...v0.8.0+20231031) (2024-11-05)


### Features

* Apache Arrow support ([#98](https://github.com/elastic/elasticsearch-serverless-js/issues/98)) ([490538c](https://github.com/elastic/elasticsearch-serverless-js/commit/490538c5b491135617390493bd945819000aa49f))
* Latest serverless specification changes ([#95](https://github.com/elastic/elasticsearch-serverless-js/issues/95)) ([8ed1f3e](https://github.com/elastic/elasticsearch-serverless-js/commit/8ed1f3ed367964c4ee7ccd1e0b1d993a0dd00190))
* Respect disablePrototypePoisoningProtection option ([#99](https://github.com/elastic/elasticsearch-serverless-js/issues/99)) ([d28ebfb](https://github.com/elastic/elasticsearch-serverless-js/commit/d28ebfbb17f612120e5ddf11b24fdf6408887102))

## [0.7.0+20231031](https://github.com/elastic/elasticsearch-serverless-js/compare/v0.6.0+20231031...v0.7.0+20231031) (2024-09-30)


### Features

* Latest serverless specification changes ([4d307f1](https://github.com/elastic/elasticsearch-serverless-js/commit/4d307f1d366988c69a0ea915bb12ba6b01c1eecb))
* Make client more ESM-friendly ([#91](https://github.com/elastic/elasticsearch-serverless-js/issues/91)) ([f0ba994](https://github.com/elastic/elasticsearch-serverless-js/commit/f0ba9947eeff767b8e3ca7d5f954f6a239de703e))

## [0.6.0+20231031](https://github.com/elastic/elasticsearch-serverless-js/compare/v0.5.1+20231031...v0.6.0+20231031) (2024-08-28)


### Features

* Latest serverless specification changes ([#83](https://github.com/elastic/elasticsearch-serverless-js/issues/83)) ([a187581](https://github.com/elastic/elasticsearch-serverless-js/commit/a187581b485a9eb74a24ea26d75babb0344c5778))

## [0.5.1+20231031](https://github.com/elastic/elasticsearch-serverless-js/compare/v0.5.0+20231031...v0.5.1+20231031) (2024-08-14)


### Bug Fixes

* Update user-agent to clarify serverless ([#85](https://github.com/elastic/elasticsearch-serverless-js/issues/85)) ([6979b17](https://github.com/elastic/elasticsearch-serverless-js/commit/6979b17236466075cb7dc22453c606cc8d0f809d))

## [0.5.0+20231031](https://github.com/elastic/elasticsearch-serverless-js/compare/v0.4.0+20231031...v0.5.0+20231031) (2024-07-29)


### Features

* Latest serverless specification changes ([#77](https://github.com/elastic/elasticsearch-serverless-js/issues/77)) ([e47967a](https://github.com/elastic/elasticsearch-serverless-js/commit/e47967a27f61a4a5c3bd2c8d55c0f0af005fdcf5))
* OpenTelemetry support ([#80](https://github.com/elastic/elasticsearch-serverless-js/issues/80)) ([8b9e7d3](https://github.com/elastic/elasticsearch-serverless-js/commit/8b9e7d325ec29f5090bf266ff486c5513f8ae39b))

## [0.4.0+20231031](https://github.com/elastic/elasticsearch-serverless-js/compare/v0.3.0+20231031...v0.4.0+20231031) (2024-06-25)


### Features

* ES|QL object API helper ([#57](https://github.com/elastic/elasticsearch-serverless-js/issues/57)) ([6ce1ff1](https://github.com/elastic/elasticsearch-serverless-js/commit/6ce1ff11ae753c3ceda285272a94884fab6c0701))
* Latest Elasticsearch serverless specification changes


### Bug Fixes

* Bump transport to 8.6.1 ([#73](https://github.com/elastic/elasticsearch-serverless-js/issues/73)) ([67d185b](https://github.com/elastic/elasticsearch-serverless-js/commit/67d185bf7eb4323b5ba9f914ef1077e1b06b7715))
* ES|QL queries no longer require a version ([#64](https://github.com/elastic/elasticsearch-serverless-js/issues/64)) ([24fa939](https://github.com/elastic/elasticsearch-serverless-js/commit/24fa9398d7e5592c341f2e183aeca71760f372ae))
* Use unique name for serverless client ([#75](https://github.com/elastic/elasticsearch-serverless-js/issues/75)) ([d716e2e](https://github.com/elastic/elasticsearch-serverless-js/commit/d716e2e0a0b9e420d7a427a2a16170a34e638c7b))

## [0.3.0+20231031](https://github.com/elastic/elasticsearch-serverless-js/compare/v0.2.0+20231031...v0.3.0+20231031) (2024-04-03)


### Features

* Latest Elasticsearch serverless specification changes
* bulk helper improvements ([#51](https://github.com/elastic/elasticsearch-serverless-js/issues/51)) ([eb7d29c](https://github.com/elastic/elasticsearch-serverless-js/commit/eb7d29c9426e6d3671d11c4e082e058e79196647))


### Bug Fixes

* Integration test improvements ([#41](https://github.com/elastic/elasticsearch-serverless-js/issues/41)) ([a6a1944](https://github.com/elastic/elasticsearch-serverless-js/commit/a6a1944b896df5cdff86c03e31ef2d846668a0dc))
* Ensure new connections inherit client's set defaults ([3360c03](https://github.com/elastic/elasticsearch-serverless-js/commit/3360c0356c756c5c3a8e527afa3e9630435eb127))
* Bump transport to 8.4.1 ([#49](https://github.com/elastic/elasticsearch-serverless-js/issues/49)) ([5784f02](https://github.com/elastic/elasticsearch-serverless-js/commit/5784f02b15b3102a92dfd3b5aa67b4f0be374f63))

## [0.2.0+20231031](https://github.com/elastic/elasticsearch-serverless-js/compare/v0.1.0+20231031...v0.2.0+20231031) (2023-12-14)


### Features

* Drop support for Node v16 ([#34](https://github.com/elastic/elasticsearch-serverless-js/issues/34)) ([85ac77b](https://github.com/elastic/elasticsearch-serverless-js/commit/85ac77b3de2ad1c305efff01b938dfb53706fa92))
* Throw an explicit error when asStream is used with bulk helper ([#37](https://github.com/elastic/elasticsearch-serverless-js/issues/37)) ([9ee3a11](https://github.com/elastic/elasticsearch-serverless-js/commit/9ee3a1177871512a618d467c5dcaeacf26a98692))
* Upgrade transport to 8.4.0 ([#40](https://github.com/elastic/elasticsearch-serverless-js/issues/40)) ([9858727](https://github.com/elastic/elasticsearch-serverless-js/commit/9858727f98679dd0d82db21e4533990c3124e5f1))


### Bug Fixes

* Add Elastic-Api-Version, fix MIME types ([#28](https://github.com/elastic/elasticsearch-serverless-js/issues/28)) ([3bf1bd0](https://github.com/elastic/elasticsearch-serverless-js/commit/3bf1bd0cb9ac30222a7114b5888e4d2b2aec7690))
* **http:** Serverless-optimized HTTP options ([#18](https://github.com/elastic/elasticsearch-serverless-js/issues/18)) ([7ef4666](https://github.com/elastic/elasticsearch-serverless-js/commit/7ef46666287d57da051a23f38eb0d4e9eb2a1f06))


## [0.1.0](https://github.com/elastic/elasticsearch-serverless-js/compare/%40{2023-05-01}...v0.1.0+20231031) (2023-10-17)

Initial release
