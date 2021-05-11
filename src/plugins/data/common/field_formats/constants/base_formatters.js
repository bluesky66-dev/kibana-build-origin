"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.baseFormatters = void 0;

var _converters = require("../converters");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const baseFormatters = [_converters.BoolFormat, _converters.BytesFormat, _converters.ColorFormat, _converters.DurationFormat, _converters.IpFormat, _converters.NumberFormat, _converters.PercentFormat, _converters.RelativeDateFormat, _converters.SourceFormat, _converters.StaticLookupFormat, _converters.StringFormat, _converters.TruncateFormat, _converters.UrlFormat];
exports.baseFormatters = baseFormatters;