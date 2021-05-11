"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readKibanaConfig = void 0;

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _jsYaml = _interopRequireDefault(require("js-yaml"));

var _lodash = require("lodash");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const readKibanaConfig = () => {
  const kibanaConfigDir = _path.default.join(__filename, '../../../../../../config');

  const kibanaDevConfig = _path.default.join(kibanaConfigDir, 'kibana.dev.yml');

  const kibanaConfig = _path.default.join(kibanaConfigDir, 'kibana.yml');

  const loadedKibanaConfig = _jsYaml.default.safeLoad(_fs.default.readFileSync(_fs.default.existsSync(kibanaDevConfig) ? kibanaDevConfig : kibanaConfig, 'utf8')) || {};
  const cliEsCredentials = (0, _lodash.pickBy)({
    'elasticsearch.username': process.env.ELASTICSEARCH_USERNAME,
    'elasticsearch.password': process.env.ELASTICSEARCH_PASSWORD,
    'elasticsearch.hosts': process.env.ELASTICSEARCH_HOST
  }, _lodash.identity);
  return {
    /* eslint-disable @typescript-eslint/naming-convention */
    'apm_oss.transactionIndices': 'apm-*',
    'apm_oss.metricsIndices': 'apm-*',
    'apm_oss.errorIndices': 'apm-*',
    'apm_oss.spanIndices': 'apm-*',
    'apm_oss.onboardingIndices': 'apm-*',
    'apm_oss.sourcemapIndices': 'apm-*',

    /* eslint-enable @typescript-eslint/naming-convention */
    'elasticsearch.hosts': 'http://localhost:9200',
    ...loadedKibanaConfig,
    ...cliEsCredentials
  };
};

exports.readKibanaConfig = readKibanaConfig;