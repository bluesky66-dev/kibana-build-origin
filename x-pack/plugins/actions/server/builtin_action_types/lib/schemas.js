"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.portSchema = void 0;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const PORT_MAX = 256 * 256 - 1;

const portSchema = () => _configSchema.schema.number({
  min: 1,
  max: PORT_MAX
});

exports.portSchema = portSchema;