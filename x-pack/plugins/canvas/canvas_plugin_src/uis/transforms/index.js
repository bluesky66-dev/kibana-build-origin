"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformSpecs = void 0;

var _formatdate = require("./formatdate");

var _formatnumber = require("./formatnumber");

var _rounddate = require("./rounddate");

var _sort = require("./sort");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const transformSpecs = [_formatdate.formatdate, _formatnumber.formatnumber, _rounddate.rounddate, _sort.sort];
exports.transformSpecs = transformSpecs;