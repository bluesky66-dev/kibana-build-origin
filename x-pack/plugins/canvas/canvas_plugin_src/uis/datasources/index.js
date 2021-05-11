"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.datasourceSpecs = void 0;

var _essql = require("./essql");

var _esdocs = require("./esdocs");

var _demodata = require("./demodata");

var _timelion = require("./timelion");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const datasourceSpecs = [_essql.essql, _esdocs.esdocs, _demodata.demodata, _timelion.timelion];
exports.datasourceSpecs = datasourceSpecs;