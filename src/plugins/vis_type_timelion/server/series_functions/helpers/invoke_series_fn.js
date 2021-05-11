"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = invokeSeriesFn;

var _lodash = _interopRequireDefault(require("lodash"));

var _index_arguments = _interopRequireDefault(require("../../handlers/lib/index_arguments"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
// invokes a series_function with the specified arguments
function invokeSeriesFn(fnDef, args, tlConfigOverrides) {
  const tlConfig = _lodash.default.merge(require('../fixtures/tl_config')(), tlConfigOverrides);

  return Promise.all(args).then(function (args) {
    args.byName = (0, _index_arguments.default)(fnDef, args);

    const input = _lodash.default.cloneDeep(args);

    return Promise.resolve(fnDef.originalFn(args, tlConfig)).then(function (output) {
      const result = {
        output: output,
        input: input
      };
      return result;
    });
  });
}

module.exports = exports.default;