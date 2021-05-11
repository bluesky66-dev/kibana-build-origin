"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UNGROUPED_FACTORY_KEY = exports.validateIsStringElasticsearchJSONFilter = exports.oneOfLiterals = void 0;

var _lodash = require("lodash");

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const oneOfLiterals = arrayOfLiterals => _configSchema.schema.string({
  validate: value => arrayOfLiterals.includes(value) ? undefined : `must be one of ${arrayOfLiterals.join(' | ')}`
});

exports.oneOfLiterals = oneOfLiterals;

const validateIsStringElasticsearchJSONFilter = value => {
  if (value === '') {
    // Allow clearing the filter.
    return;
  }

  const errorMessage = 'filterQuery must be a valid Elasticsearch filter expressed in JSON';

  try {
    const parsedValue = JSON.parse(value);

    if (!(0, _lodash.isEmpty)(parsedValue.bool)) {
      return undefined;
    }

    return errorMessage;
  } catch (e) {
    return errorMessage;
  }
};

exports.validateIsStringElasticsearchJSONFilter = validateIsStringElasticsearchJSONFilter;
const UNGROUPED_FACTORY_KEY = '*';
exports.UNGROUPED_FACTORY_KEY = UNGROUPED_FACTORY_KEY;