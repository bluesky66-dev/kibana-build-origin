"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isConfigVersionUpgradeable = isConfigVersionUpgradeable;

var _semver = _interopRequireDefault(require("semver"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const rcVersionRegex = /^(\d+\.\d+\.\d+)\-rc(\d+)$/i;

function extractRcNumber(version) {
  const match = version.match(rcVersionRegex);
  return match ? [match[1], parseInt(match[2], 10)] : [version, Infinity];
}

function isConfigVersionUpgradeable(savedVersion, kibanaVersion) {
  if (typeof savedVersion !== 'string' || typeof kibanaVersion !== 'string' || savedVersion === kibanaVersion || /alpha|beta|snapshot/i.test(savedVersion)) {
    return false;
  }

  const [savedReleaseVersion, savedRcNumber] = extractRcNumber(savedVersion);
  const [kibanaReleaseVersion, kibanaRcNumber] = extractRcNumber(kibanaVersion); // ensure that both release versions are valid, if not then abort

  if (!_semver.default.valid(savedReleaseVersion) || !_semver.default.valid(kibanaReleaseVersion)) {
    return false;
  } // ultimately if the saved config is from a previous kibana version
  // or from an earlier rc of the same version, then we can upgrade


  const savedIsLessThanKibana = _semver.default.lt(savedReleaseVersion, kibanaReleaseVersion);

  const savedIsSameAsKibana = _semver.default.eq(savedReleaseVersion, kibanaReleaseVersion);

  const savedRcIsLessThanKibana = savedRcNumber < kibanaRcNumber;
  return savedIsLessThanKibana || savedIsSameAsKibana && savedRcIsLessThanKibana;
}