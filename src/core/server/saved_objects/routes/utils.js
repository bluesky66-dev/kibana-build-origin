"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSavedObjectsStreamFromNdJson = createSavedObjectsStreamFromNdJson;
exports.validateTypes = validateTypes;
exports.validateObjects = validateObjects;
exports.catchAndReturnBoomErrors = void 0;

var _utils = require("@kbn/utils");

var _boom = _interopRequireDefault(require("@hapi/boom"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
async function createSavedObjectsStreamFromNdJson(ndJsonStream) {
  const savedObjects = await (0, _utils.createPromiseFromStreams)([ndJsonStream, (0, _utils.createSplitStream)('\n'), (0, _utils.createMapStream)(str => {
    if (str && str.trim() !== '') {
      return JSON.parse(str);
    }
  }), (0, _utils.createFilterStream)(obj => !!obj && !obj.exportedCount), (0, _utils.createConcatStream)([])]);
  return (0, _utils.createListStream)(savedObjects);
}

function validateTypes(types, supportedTypes) {
  const invalidTypes = types.filter(t => !supportedTypes.includes(t));

  if (invalidTypes.length) {
    return `Trying to export non-exportable type(s): ${invalidTypes.join(', ')}`;
  }
}

function validateObjects(objects, supportedTypes) {
  const invalidObjects = objects.filter(obj => !supportedTypes.includes(obj.type));

  if (invalidObjects.length) {
    return `Trying to export object(s) with non-exportable types: ${invalidObjects.map(obj => `${obj.type}:${obj.id}`).join(', ')}`;
  }
}
/**
 * Catches errors thrown by saved object route handlers and returns an error
 * with the payload and statusCode of the boom error.
 *
 * This is very close to the core `router.handleLegacyErrors` except that it
 * throws internal errors (statusCode: 500) so that the internal error's
 * message get logged by Core.
 *
 * TODO: Remove once https://github.com/elastic/kibana/issues/65291 is fixed.
 */


const catchAndReturnBoomErrors = handler => {
  return async (context, request, response) => {
    try {
      return await handler(context, request, response);
    } catch (e) {
      if (_boom.default.isBoom(e) && e.output.statusCode !== 500) {
        return response.customError({
          body: e.output.payload,
          statusCode: e.output.statusCode,
          headers: e.output.headers
        });
      }

      throw e;
    }
  };
};

exports.catchAndReturnBoomErrors = catchAndReturnBoomErrors;