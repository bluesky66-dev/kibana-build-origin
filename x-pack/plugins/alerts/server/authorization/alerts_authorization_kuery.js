"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.asFiltersByAlertTypeAndConsumer = asFiltersByAlertTypeAndConsumer;
exports.ensureFieldIsSafeForQuery = ensureFieldIsSafeForQuery;

var _lodash = require("lodash");

var _common = require("../../../../../src/plugins/data/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function asFiltersByAlertTypeAndConsumer(alertTypes) {
  return _common.nodeBuilder.or(Array.from(alertTypes).reduce((filters, {
    id,
    authorizedConsumers
  }) => {
    ensureFieldIsSafeForQuery('alertTypeId', id);
    filters.push(_common.nodeBuilder.and([_common.nodeBuilder.is(`alert.attributes.alertTypeId`, id), _common.nodeBuilder.or(Object.keys(authorizedConsumers).map(consumer => {
      ensureFieldIsSafeForQuery('consumer', consumer);
      return _common.nodeBuilder.is(`alert.attributes.consumer`, consumer);
    }))]));
    return filters;
  }, []));
}

function ensureFieldIsSafeForQuery(field, value) {
  const invalid = value.match(/([>=<\*:()]+|\s+)/g);

  if (invalid) {
    const whitespace = (0, _lodash.remove)(invalid, chars => chars.trim().length === 0);
    const errors = [];

    if (whitespace.length) {
      errors.push(`whitespace`);
    }

    if (invalid.length) {
      errors.push(`invalid character${invalid.length > 1 ? `s` : ``}: ${invalid === null || invalid === void 0 ? void 0 : invalid.join(`, `)}`);
    }

    throw new Error(`expected ${field} not to include ${errors.join(' and ')}`);
  }

  return true;
}