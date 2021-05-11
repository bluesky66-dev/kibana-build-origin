"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyExportTransforms = void 0;

var _errors = require("./errors");

var _utils = require("./utils");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const applyExportTransforms = async ({
  objects,
  request,
  transforms,
  sortFunction
}) => {
  const context = createContext(request);
  const byType = splitByType(objects);
  let finalObjects = [];

  for (const [type, typeObjs] of Object.entries(byType)) {
    const typeTransformFn = transforms[type];

    if (typeTransformFn) {
      finalObjects = [...finalObjects, ...(await applyTransform(typeObjs, typeTransformFn, context))];
    } else {
      finalObjects = [...finalObjects, ...typeObjs];
    }
  }

  if (sortFunction) {
    finalObjects.sort(sortFunction);
  }

  return finalObjects;
};

exports.applyExportTransforms = applyExportTransforms;

const applyTransform = async (objs, transformFn, context) => {
  const objKeys = objs.map(_utils.getObjKey);
  let transformedObjects;

  try {
    transformedObjects = await transformFn(context, objs);
  } catch (e) {
    throw _errors.SavedObjectsExportError.objectTransformError(objs, e);
  }

  assertValidTransform(transformedObjects, objKeys);
  return transformedObjects;
};

const createContext = request => {
  return {
    request
  };
};

const splitByType = objects => {
  return objects.reduce((memo, obj) => {
    var _memo$obj$type;

    memo[obj.type] = [...((_memo$obj$type = memo[obj.type]) !== null && _memo$obj$type !== void 0 ? _memo$obj$type : []), obj];
    return memo;
  }, {});
};

const assertValidTransform = (transformedObjects, initialKeys) => {
  const transformedKeys = transformedObjects.map(_utils.getObjKey);
  const missingKeys = [];
  initialKeys.forEach(initialKey => {
    if (!transformedKeys.includes(initialKey)) {
      missingKeys.push(initialKey);
    }
  });

  if (missingKeys.length) {
    throw _errors.SavedObjectsExportError.invalidTransformError(missingKeys);
  }
};