"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UsageStatsMappings = exports.SpacesSavedObjectMappings = void 0;

var _std = require("@kbn/std");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const SpacesSavedObjectMappings = (0, _std.deepFreeze)({
  properties: {
    name: {
      type: 'text',
      fields: {
        keyword: {
          type: 'keyword',
          ignore_above: 2048
        }
      }
    },
    description: {
      type: 'text'
    },
    initials: {
      type: 'keyword'
    },
    color: {
      type: 'keyword'
    },
    disabledFeatures: {
      type: 'keyword'
    },
    imageUrl: {
      type: 'text',
      index: false
    },
    _reserved: {
      type: 'boolean'
    }
  }
});
exports.SpacesSavedObjectMappings = SpacesSavedObjectMappings;
const UsageStatsMappings = (0, _std.deepFreeze)({
  dynamic: false,
  // we aren't querying or aggregating over this data, so we don't need to specify any fields
  properties: {}
});
exports.UsageStatsMappings = UsageStatsMappings;