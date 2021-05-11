"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = validateArgFn;

var _arg_type = _interopRequireDefault(require("./arg_type"));

var _lodash = _interopRequireDefault(require("lodash"));

var _i18n = require("@kbn/i18n");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function validateArgFn(functionDef) {
  return function validateArg(value, name, argDef) {
    const type = (0, _arg_type.default)(value);
    const required = argDef.types;
    const multi = argDef.multi;

    const isCorrectType = function () {
      // If argument is not allow to be specified multiple times, we're dealing with a plain value for type
      if (!multi) return _lodash.default.includes(required, type); // If it is, we'll get an array for type

      return _lodash.default.difference(type, required).length === 0;
    }();

    if (isCorrectType) return true;else return false;

    if (!isCorrectType) {
      throw new Error(_i18n.i18n.translate('timelion.serverSideErrors.wrongFunctionArgumentTypeErrorMessage', {
        defaultMessage: '{functionName}({argumentName}) must be one of {requiredTypes}. Got: {actualType}',
        values: {
          functionName: functionDef.name,
          argumentName: name,
          requiredTypes: JSON.stringify(required),
          actualType: type
        }
      }));
    }
  };
}

module.exports = exports.default;