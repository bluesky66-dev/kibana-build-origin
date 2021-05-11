"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isSecurityJob = void 0;

var _constants = require("../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const isSecurityJob = job => job.groups.some(group => _constants.ML_GROUP_IDS.includes(group));

exports.isSecurityJob = isSecurityJob;