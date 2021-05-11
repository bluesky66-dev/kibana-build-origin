"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CLOUD_SERVICES = void 0;

var _aws = require("./aws");

var _azure = require("./azure");

var _gcp = require("./gcp");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * An iteratable that can be used to loop across all known cloud services to detect them.
 *
 * @type {Array}
 */


const CLOUD_SERVICES = [_aws.AWS, _gcp.GCP, _azure.AZURE];
exports.CLOUD_SERVICES = CLOUD_SERVICES;