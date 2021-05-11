"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.executeImportHooks = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const executeImportHooks = async ({
  objects,
  importHooks
}) => {
  const objsByType = splitByType(objects);
  let warnings = [];

  for (const [type, typeObjs] of Object.entries(objsByType)) {
    var _importHooks$type;

    const hooks = (_importHooks$type = importHooks[type]) !== null && _importHooks$type !== void 0 ? _importHooks$type : [];

    for (const hook of hooks) {
      const hookResult = await hook(typeObjs);

      if (hookResult.warnings) {
        warnings = [...warnings, ...hookResult.warnings];
      }
    }
  }

  return warnings;
};

exports.executeImportHooks = executeImportHooks;

const splitByType = objects => {
  return objects.reduce((memo, obj) => {
    var _memo$obj$type;

    memo[obj.type] = [...((_memo$obj$type = memo[obj.type]) !== null && _memo$obj$type !== void 0 ? _memo$obj$type : []), obj];
    return memo;
  }, {});
};