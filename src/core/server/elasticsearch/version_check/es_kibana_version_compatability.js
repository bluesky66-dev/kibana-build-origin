"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.esVersionCompatibleWithKibana = esVersionCompatibleWithKibana;
exports.esVersionEqualsKibana = esVersionEqualsKibana;

var _semver = _interopRequireWildcard(require("semver"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Checks for the compatibilitiy between Elasticsearch and Kibana versions
 * 1. Major version differences will never work together.
 * 2. Older versions of ES won't work with newer versions of Kibana.
 */
function esVersionCompatibleWithKibana(esVersion, kibanaVersion) {
  const esVersionNumbers = {
    major: _semver.default.major(esVersion),
    minor: _semver.default.minor(esVersion),
    patch: _semver.default.patch(esVersion)
  };
  const kibanaVersionNumbers = {
    major: _semver.default.major(kibanaVersion),
    minor: _semver.default.minor(kibanaVersion),
    patch: _semver.default.patch(kibanaVersion)
  }; // Reject mismatching major version numbers.

  if (esVersionNumbers.major !== kibanaVersionNumbers.major) {
    return false;
  } // Reject older minor versions of ES.


  if (esVersionNumbers.minor < kibanaVersionNumbers.minor) {
    return false;
  }

  return true;
}

function esVersionEqualsKibana(nodeVersion, kibanaVersion) {
  const nodeSemVer = (0, _semver.coerce)(nodeVersion);
  const kibanaSemver = (0, _semver.coerce)(kibanaVersion);
  return nodeSemVer && kibanaSemver && nodeSemVer.version === kibanaSemver.version;
}