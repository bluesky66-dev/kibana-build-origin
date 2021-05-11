"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CaseConfigureResponseRt = exports.CaseConfigureAttributesRt = exports.CasesConfigurePatchRt = exports.CasesConfigureRequestRt = void 0;

var rt = _interopRequireWildcard(require("io-ts"));

var _user = require("../user");

var _connectors = require("../connectors");

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
// TODO: we will need to add this type rt.literal('close-by-third-party')


const ClosureTypeRT = rt.union([rt.literal('close-by-user'), rt.literal('close-by-pushing')]);
const CasesConfigureBasicRt = rt.type({
  connector: _connectors.CaseConnectorRt,
  closure_type: ClosureTypeRT
});
const CasesConfigureRequestRt = CasesConfigureBasicRt;
exports.CasesConfigureRequestRt = CasesConfigureRequestRt;
const CasesConfigurePatchRt = rt.intersection([rt.partial(CasesConfigureBasicRt.props), rt.type({
  version: rt.string
})]);
exports.CasesConfigurePatchRt = CasesConfigurePatchRt;
const CaseConfigureAttributesRt = rt.intersection([CasesConfigureBasicRt, rt.type({
  created_at: rt.string,
  created_by: _user.UserRT,
  updated_at: rt.union([rt.string, rt.null]),
  updated_by: rt.union([_user.UserRT, rt.null])
})]);
exports.CaseConfigureAttributesRt = CaseConfigureAttributesRt;
const CaseConfigureResponseRt = rt.intersection([CaseConfigureAttributesRt, _connectors.ConnectorMappingsRt, rt.type({
  version: rt.string,
  error: rt.union([rt.string, rt.null])
})]);
exports.CaseConfigureResponseRt = CaseConfigureResponseRt;