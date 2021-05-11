"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.localizedDate = localizedDate;

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function localizedDate(dateTime, locale = _i18n.i18n.getLocale()) {
  const formatter = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  return formatter.format(dateTime);
}