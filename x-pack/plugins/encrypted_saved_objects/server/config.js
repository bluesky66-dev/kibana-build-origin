"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConfigSchema = void 0;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const ConfigSchema = _configSchema.schema.object({
  enabled: _configSchema.schema.boolean({
    defaultValue: true
  }),
  encryptionKey: _configSchema.schema.conditional(_configSchema.schema.contextRef('dist'), true, _configSchema.schema.maybe(_configSchema.schema.string({
    minLength: 32
  })), _configSchema.schema.string({
    minLength: 32,
    defaultValue: 'a'.repeat(32)
  })),
  keyRotation: _configSchema.schema.object({
    decryptionOnlyKeys: _configSchema.schema.arrayOf(_configSchema.schema.string({
      minLength: 32
    }), {
      defaultValue: []
    })
  })
}, {
  validate(value) {
    var _value$keyRotation$de, _value$keyRotation;

    const decryptionOnlyKeys = (_value$keyRotation$de = (_value$keyRotation = value.keyRotation) === null || _value$keyRotation === void 0 ? void 0 : _value$keyRotation.decryptionOnlyKeys) !== null && _value$keyRotation$de !== void 0 ? _value$keyRotation$de : [];

    if (value.encryptionKey && decryptionOnlyKeys.includes(value.encryptionKey)) {
      return '`keyRotation.decryptionOnlyKeys` cannot contain primary encryption key specified in `encryptionKey`.';
    }
  }

});

exports.ConfigSchema = ConfigSchema;