"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEsQueryConfig = getEsQueryConfig;

var _ = require("../../");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function getEsQueryConfig(config) {
  const allowLeadingWildcards = config.get(_.UI_SETTINGS.QUERY_ALLOW_LEADING_WILDCARDS);
  const queryStringOptions = config.get(_.UI_SETTINGS.QUERY_STRING_OPTIONS);
  const ignoreFilterIfFieldNotInIndex = config.get(_.UI_SETTINGS.COURIER_IGNORE_FILTER_IF_FIELD_NOT_IN_INDEX);
  const dateFormatTZ = config.get('dateFormat:tz');
  return {
    allowLeadingWildcards,
    queryStringOptions,
    ignoreFilterIfFieldNotInIndex,
    dateFormatTZ
  };
}