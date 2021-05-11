"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InvalidEsCalendarIntervalError = void 0;

var _i18n = require("@kbn/i18n");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class InvalidEsCalendarIntervalError extends Error {
  constructor(interval, value, unit, type) {
    super(_i18n.i18n.translate('data.parseEsInterval.invalidEsCalendarIntervalErrorMessage', {
      defaultMessage: 'Invalid calendar interval: {interval}, value must be 1',
      values: {
        interval
      }
    }));
    this.interval = interval;
    this.value = value;
    this.unit = unit;
    this.type = type;
    this.name = 'InvalidEsCalendarIntervalError';
    this.value = value;
    this.unit = unit;
    this.type = type; // captureStackTrace is only available in the V8 engine, so any browser using
    // a different JS engine won't have access to this method.

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidEsCalendarIntervalError);
    } // Babel doesn't support traditional `extends` syntax for built-in classes.
    // https://babeljs.io/docs/en/caveats/#classes


    Object.setPrototypeOf(this, InvalidEsCalendarIntervalError.prototype);
  }

}

exports.InvalidEsCalendarIntervalError = InvalidEsCalendarIntervalError;