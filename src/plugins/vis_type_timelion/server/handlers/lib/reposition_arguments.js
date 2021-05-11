"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = repositionArguments;

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
// Applies to unresolved arguments in the AST
function repositionArguments(functionDef, unorderedArgs) {
  const args = [];

  _lodash.default.each(unorderedArgs, function (unorderedArg, i) {
    let argDef;
    let targetIndex;
    let value;
    let storeAsArray;

    if (_lodash.default.isObject(unorderedArg) && unorderedArg.type === 'namedArg') {
      argDef = functionDef.argsByName[unorderedArg.name];

      if (!argDef) {
        if (functionDef.extended) {
          const namesIndex = functionDef.args.length;
          targetIndex = functionDef.args.length + 1;
          args[namesIndex] = args[namesIndex] || [];
          args[namesIndex].push(unorderedArg.name);
          argDef = functionDef.extended;
          storeAsArray = true;
        }
      } else {
        targetIndex = _lodash.default.findIndex(functionDef.args, function (orderedArg) {
          return unorderedArg.name === orderedArg.name;
        });
        storeAsArray = argDef.multi;
      }

      value = unorderedArg.value;
    } else {
      argDef = functionDef.args[i];
      storeAsArray = argDef.multi;
      targetIndex = i;
      value = unorderedArg;
    }

    if (!argDef) {
      throw new Error(_i18n.i18n.translate('timelion.serverSideErrors.unknownArgumentErrorMessage', {
        defaultMessage: 'Unknown argument to {functionName}: {argumentName}',
        values: {
          functionName: functionDef.name,
          argumentName: unorderedArg.name || '#' + i
        }
      }));
    }

    if (storeAsArray) {
      args[targetIndex] = args[targetIndex] || [];
      args[targetIndex].push(value);
    } else {
      args[targetIndex] = value;
    }
  });

  return args;
}

module.exports = exports.default;