"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _cypress_start = require("./cypress_start");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function openE2ETests({
  readConfigFile
}) {
  const cypressConfig = await readConfigFile(require.resolve('./config.ts'));
  return { ...cypressConfig.getAll(),
    testRunner: _cypress_start.cypressOpenTests
  };
} // eslint-disable-next-line import/no-default-export


var _default = openE2ETests;
exports.default = _default;
module.exports = exports.default;