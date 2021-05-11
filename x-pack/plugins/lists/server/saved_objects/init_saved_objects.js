"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initSavedObjects = void 0;

var _exception_list = require("./exception_list");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const initSavedObjects = savedObjects => {
  savedObjects.registerType(_exception_list.exceptionListAgnosticType);
  savedObjects.registerType(_exception_list.exceptionListType);
};

exports.initSavedObjects = initSavedObjects;