"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unset = unset;

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function unset(object, rawPath) {
  if (!object) return;

  const path = _lodash.default.toPath(rawPath);

  switch (path.length) {
    case 0:
      return;

    case 1:
      delete object[rawPath];
      break;

    default:
      const leaf = path.pop();
      const parentPath = path.slice();

      const parent = _lodash.default.get(object, parentPath);

      unset(parent, leaf);

      if (!_lodash.default.size(parent)) {
        unset(object, parentPath);
      }

      break;
  }
}