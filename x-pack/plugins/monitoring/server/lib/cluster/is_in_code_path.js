"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isInCodePath = isInCodePath;

var _constants = require("../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function isInCodePath(codePaths, codePathsToTest) {
  if (codePaths.includes(_constants.CODE_PATH_ALL)) {
    return true;
  }

  for (const codePath of codePathsToTest) {
    if (codePaths.includes(codePath)) {
      return true;
    }
  }

  return false;
}