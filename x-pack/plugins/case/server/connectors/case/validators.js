"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateConnector = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const validateConnector = connector => {
  if (connector.type === '.none' && connector.fields !== null) {
    return 'Fields must be set to null for connectors of type .none';
  }
};

exports.validateConnector = validateConnector;