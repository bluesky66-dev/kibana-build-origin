"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMockVersionInfo = exports.MOCK_VERSION_STRING = void 0;

var _semver = require("semver");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const MOCK_VERSION_STRING = '8.0.0';
exports.MOCK_VERSION_STRING = MOCK_VERSION_STRING;

const getMockVersionInfo = (versionString = MOCK_VERSION_STRING) => {
  const currentVersion = new _semver.SemVer(versionString);
  const currentMajor = currentVersion.major;
  return {
    currentVersion,
    currentMajor,
    prevMajor: currentMajor - 1,
    nextMajor: currentMajor + 1
  };
};

exports.getMockVersionInfo = getMockVersionInfo;