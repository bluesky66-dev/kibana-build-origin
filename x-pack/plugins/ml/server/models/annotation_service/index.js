"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.annotationServiceProvider = annotationServiceProvider;

var _annotation = require("./annotation");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function annotationServiceProvider(client) {
  return { ...(0, _annotation.annotationProvider)(client)
  };
}