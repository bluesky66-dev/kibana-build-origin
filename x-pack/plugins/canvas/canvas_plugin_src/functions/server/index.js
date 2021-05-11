"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.functions = void 0;

var _demodata = require("./demodata");

var _escount = require("./escount");

var _esdocs = require("./esdocs");

var _pointseries = require("./pointseries");

var _essql = require("./essql");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const functions = [_demodata.demodata, _esdocs.esdocs, _escount.escount, _essql.essql, _pointseries.pointseries];
exports.functions = functions;