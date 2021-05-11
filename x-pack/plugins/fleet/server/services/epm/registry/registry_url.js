"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRegistryUrl = void 0;

var _ = require("../../");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// from https://github.com/elastic/package-registry#docker (maybe from OpenAPI one day)
// the unused variables cause a TS warning about unused values
// chose to comment them out vs @ts-ignore or @ts-expect-error on each line


const PRODUCTION_REGISTRY_URL_CDN = 'https://epr.elastic.co';
const STAGING_REGISTRY_URL_CDN = 'https://epr-staging.elastic.co';
const SNAPSHOT_REGISTRY_URL_CDN = 'https://epr-snapshot.elastic.co'; // const PRODUCTION_REGISTRY_URL_NO_CDN = 'https://epr.ea-web.elastic.dev';
// const STAGING_REGISTRY_URL_NO_CDN = 'https://epr-staging.ea-web.elastic.dev';
// const SNAPSHOT_REGISTRY_URL_NO_CDN = 'https://epr-snapshot.ea-web.elastic.dev';

const getDefaultRegistryUrl = () => {
  const branch = _.appContextService.getKibanaBranch();

  if (branch === 'master') {
    return SNAPSHOT_REGISTRY_URL_CDN;
  } else if (_.appContextService.getKibanaVersion().includes('-SNAPSHOT')) {
    return STAGING_REGISTRY_URL_CDN;
  } else {
    return PRODUCTION_REGISTRY_URL_CDN;
  }
};

const getRegistryUrl = () => {
  var _appContextService$ge;

  const customUrl = (_appContextService$ge = _.appContextService.getConfig()) === null || _appContextService$ge === void 0 ? void 0 : _appContextService$ge.registryUrl;

  const isEnterprise = _.licenseService.isEnterprise();

  if (customUrl && isEnterprise) {
    _.appContextService.getLogger().info('Custom registry url is an experimental feature and is unsupported.');

    return customUrl;
  }

  if (customUrl) {
    _.appContextService.getLogger().warn('Enterprise license is required to use a custom registry url.');
  }

  return getDefaultRegistryUrl();
};

exports.getRegistryUrl = getRegistryUrl;