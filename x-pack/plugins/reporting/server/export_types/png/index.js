"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getExportType = void 0;

var _constants = require("../../../common/constants");

var _create_job = require("./create_job");

var _execute_job = require("./execute_job");

var _metadata = require("./metadata");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getExportType = () => ({ ..._metadata.metadata,
  jobType: _constants.PNG_JOB_TYPE,
  jobContentEncoding: 'base64',
  jobContentExtension: 'PNG',
  createJobFnFactory: _create_job.createJobFnFactory,
  runTaskFnFactory: _execute_job.runTaskFnFactory,
  validLicenses: [_constants.LICENSE_TYPE_TRIAL, _constants.LICENSE_TYPE_STANDARD, _constants.LICENSE_TYPE_GOLD, _constants.LICENSE_TYPE_PLATINUM, _constants.LICENSE_TYPE_ENTERPRISE]
});

exports.getExportType = getExportType;