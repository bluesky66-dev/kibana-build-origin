"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CasesStatusResponseRt = exports.caseStatuses = exports.CaseStatusRt = exports.CaseStatuses = void 0;

var rt = _interopRequireWildcard(require("io-ts"));

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();

  _getRequireWildcardCache = function () {
    return cache;
  };

  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache();

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


let CaseStatuses;
exports.CaseStatuses = CaseStatuses;

(function (CaseStatuses) {
  CaseStatuses["open"] = "open";
  CaseStatuses["in-progress"] = "in-progress";
  CaseStatuses["closed"] = "closed";
})(CaseStatuses || (exports.CaseStatuses = CaseStatuses = {}));

const CaseStatusRt = rt.union([rt.literal(CaseStatuses.open), rt.literal(CaseStatuses['in-progress']), rt.literal(CaseStatuses.closed)]);
exports.CaseStatusRt = CaseStatusRt;
const caseStatuses = Object.values(CaseStatuses);
exports.caseStatuses = caseStatuses;
const CasesStatusResponseRt = rt.type({
  count_open_cases: rt.number,
  count_in_progress_cases: rt.number,
  count_closed_cases: rt.number
});
exports.CasesStatusResponseRt = CasesStatusResponseRt;