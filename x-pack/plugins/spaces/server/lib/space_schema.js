"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.spaceSchema = exports.SPACE_ID_REGEX = void 0;

var _configSchema = require("@kbn/config-schema");

var _common = require("../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const SPACE_ID_REGEX = /^[a-z0-9_\-]+$/;
exports.SPACE_ID_REGEX = SPACE_ID_REGEX;

const spaceSchema = _configSchema.schema.object({
  id: _configSchema.schema.string({
    validate: value => {
      if (!SPACE_ID_REGEX.test(value)) {
        return `must be lower case, a-z, 0-9, '_', and '-' are allowed`;
      }
    }
  }),
  name: _configSchema.schema.string({
    minLength: 1
  }),
  description: _configSchema.schema.maybe(_configSchema.schema.string()),
  initials: _configSchema.schema.maybe(_configSchema.schema.string({
    maxLength: _common.MAX_SPACE_INITIALS
  })),
  color: _configSchema.schema.maybe(_configSchema.schema.string({
    validate: value => {
      if (!/^#[a-zA-Z0-9]{6}$/.test(value)) {
        return `must be a 6 digit hex color, starting with a #`;
      }
    }
  })),
  disabledFeatures: _configSchema.schema.arrayOf(_configSchema.schema.string(), {
    defaultValue: []
  }),
  _reserved: _configSchema.schema.maybe(_configSchema.schema.boolean()),
  imageUrl: _configSchema.schema.maybe(_configSchema.schema.string({
    validate: value => {
      if (value !== '' && !/^data:image.*$/.test(value)) {
        return `must start with 'data:image'`;
      }
    }
  }))
});

exports.spaceSchema = spaceSchema;