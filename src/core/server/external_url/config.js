"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = void 0;

var _configSchema = require("@kbn/config-schema");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const allowSchema = _configSchema.schema.boolean();

const hostSchema = _configSchema.schema.string();

const protocolSchema = _configSchema.schema.string({
  validate: value => {
    // tools.ietf.org/html/rfc3986#section-3.1
    // scheme = ALPHA *( ALPHA / DIGIT / "+" / "-" / "." )
    const schemaRegex = /^[a-zA-Z][a-zA-Z0-9\+\-\.]*$/;
    if (!schemaRegex.test(value)) throw new Error('Protocol must begin with a letter, and can only contain letters, numbers, and the following characters: `+ - .`');
  }
});

const policySchema = _configSchema.schema.object({
  allow: allowSchema,
  protocol: _configSchema.schema.maybe(protocolSchema),
  host: _configSchema.schema.maybe(hostSchema)
});

const config = {
  path: 'externalUrl',
  schema: _configSchema.schema.object({
    policy: _configSchema.schema.arrayOf(policySchema, {
      defaultValue: [{
        allow: true
      }]
    })
  })
};
exports.config = config;