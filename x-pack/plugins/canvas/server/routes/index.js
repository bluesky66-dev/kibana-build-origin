"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initRoutes = initRoutes;

var _custom_elements = require("./custom_elements");

var _es_fields = require("./es_fields");

var _shareables = require("./shareables");

var _workpad = require("./workpad");

var _templates = require("./templates");

var _functions = require("./functions");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function initRoutes(deps) {
  (0, _custom_elements.initCustomElementsRoutes)(deps);
  (0, _es_fields.initESFieldsRoutes)(deps);
  (0, _shareables.initShareablesRoutes)(deps);
  (0, _workpad.initWorkpadRoutes)(deps);
  (0, _templates.initTemplateRoutes)(deps);
  (0, _functions.initFunctionsRoutes)(deps);
}