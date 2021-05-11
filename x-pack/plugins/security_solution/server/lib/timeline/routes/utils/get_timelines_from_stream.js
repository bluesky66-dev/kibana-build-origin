"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTupleDuplicateErrorsAndUniqueTimeline = void 0;

var _uuid = _interopRequireDefault(require("uuid"));

var _utils = require("../../../detection_engine/routes/utils");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getTupleDuplicateErrorsAndUniqueTimeline = (timelines, isOverwrite) => {
  const {
    errors,
    timelinesAcc
  } = timelines.reduce((acc, parsedTimeline) => {
    if (parsedTimeline instanceof Error) {
      acc.timelinesAcc.set(_uuid.default.v4(), parsedTimeline);
    } else {
      const {
        savedObjectId
      } = parsedTimeline;

      if (savedObjectId != null) {
        if (acc.timelinesAcc.has(savedObjectId) && !isOverwrite) {
          acc.errors.set(_uuid.default.v4(), (0, _utils.createBulkErrorObject)({
            id: savedObjectId,
            statusCode: 400,
            message: `More than one timeline with savedObjectId: "${savedObjectId}" found`
          }));
        }

        acc.timelinesAcc.set(savedObjectId, parsedTimeline);
      } else {
        acc.timelinesAcc.set(_uuid.default.v4(), parsedTimeline);
      }
    }

    return acc;
  }, // using map (preserves ordering)
  {
    errors: new Map(),
    timelinesAcc: new Map()
  });
  return [Array.from(errors.values()), Array.from(timelinesAcc.values())];
};

exports.getTupleDuplicateErrorsAndUniqueTimeline = getTupleDuplicateErrorsAndUniqueTimeline;