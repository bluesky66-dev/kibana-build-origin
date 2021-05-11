"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MAPPINGS = exports.ALIASES = exports.SETTINGS = exports.INDEX_PATTERNS = exports.TEMPLATE_NAME = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const TEMPLATE_NAME = 'my_template';
exports.TEMPLATE_NAME = TEMPLATE_NAME;
const INDEX_PATTERNS = ['my_index_pattern'];
exports.INDEX_PATTERNS = INDEX_PATTERNS;
const SETTINGS = {
  number_of_shards: 1,
  index: {
    lifecycle: {
      name: 'my_policy'
    }
  }
};
exports.SETTINGS = SETTINGS;
const ALIASES = {
  alias: {
    filter: {
      term: {
        user: 'my_user'
      }
    }
  }
};
exports.ALIASES = ALIASES;
const MAPPINGS = {
  properties: {}
};
exports.MAPPINGS = MAPPINGS;