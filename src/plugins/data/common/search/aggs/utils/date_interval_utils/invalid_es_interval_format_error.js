"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InvalidEsIntervalFormatError = void 0;

var _i18n = require("@kbn/i18n");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class InvalidEsIntervalFormatError extends Error {
  constructor(interval) {
    super(_i18n.i18n.translate('data.parseEsInterval.invalidEsIntervalFormatErrorMessage', {
      defaultMessage: 'Invalid interval format: {interval}',
      values: {
        interval
      }
    }));
    this.interval = interval;
    this.name = 'InvalidEsIntervalFormatError'; // captureStackTrace is only available in the V8 engine, so any browser using
    // a different JS engine won't have access to this method.

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidEsIntervalFormatError);
    } // Babel doesn't support traditional `extends` syntax for built-in classes.
    // https://babeljs.io/docs/en/caveats/#classes


    Object.setPrototypeOf(this, InvalidEsIntervalFormatError.prototype);
  }

}

exports.InvalidEsIntervalFormatError = InvalidEsIntervalFormatError;