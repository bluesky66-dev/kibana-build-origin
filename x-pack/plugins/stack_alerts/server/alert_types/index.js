"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerBuiltInAlertTypes = registerBuiltInAlertTypes;

var _index_threshold = require("./index_threshold");

var _geo_containment = require("./geo_containment");

var _es_query = require("./es_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerBuiltInAlertTypes(params) {
  (0, _index_threshold.register)(params);
  (0, _geo_containment.register)(params);
  (0, _es_query.register)(params);
}