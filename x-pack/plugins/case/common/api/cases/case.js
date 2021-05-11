"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExternalServiceResponseRt = exports.CasePushRequestParamsRt = exports.CasesResponseRt = exports.CasesPatchRequestRt = exports.CasePatchRequestRt = exports.CasesFindResponseRt = exports.CaseResponseRt = exports.CasesFindRequestRt = exports.CasePostRequestRt = exports.CaseClientPostRequestRt = exports.CaseAttributesRt = exports.caseTypeField = exports.CaseType = void 0;

var rt = _interopRequireWildcard(require("io-ts"));

var _saved_object = require("../saved_object");

var _user = require("../user");

var _comment = require("./comment");

var _status = require("./status");

var _connectors = require("../connectors");

var _sub_case = require("./sub_case");

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


let CaseType;
/**
 * Exposing the field used to define the case type so that it can be used for filtering in saved object find queries.
 */

exports.CaseType = CaseType;

(function (CaseType) {
  CaseType["collection"] = "collection";
  CaseType["individual"] = "individual";
})(CaseType || (exports.CaseType = CaseType = {}));

const caseTypeField = 'type';
exports.caseTypeField = caseTypeField;
const CaseTypeRt = rt.union([rt.literal(CaseType.collection), rt.literal(CaseType.individual)]);
const SettingsRt = rt.type({
  syncAlerts: rt.boolean
});
const CaseBasicRt = rt.type({
  description: rt.string,
  status: _status.CaseStatusRt,
  tags: rt.array(rt.string),
  title: rt.string,
  [caseTypeField]: CaseTypeRt,
  connector: _connectors.CaseConnectorRt,
  settings: SettingsRt
});
const CaseExternalServiceBasicRt = rt.type({
  connector_id: rt.string,
  connector_name: rt.string,
  external_id: rt.string,
  external_title: rt.string,
  external_url: rt.string
});
const CaseFullExternalServiceRt = rt.union([rt.intersection([CaseExternalServiceBasicRt, rt.type({
  pushed_at: rt.string,
  pushed_by: _user.UserRT
})]), rt.null]);
const CaseAttributesRt = rt.intersection([CaseBasicRt, rt.type({
  closed_at: rt.union([rt.string, rt.null]),
  closed_by: rt.union([_user.UserRT, rt.null]),
  created_at: rt.string,
  created_by: _user.UserRT,
  external_service: CaseFullExternalServiceRt,
  updated_at: rt.union([rt.string, rt.null]),
  updated_by: rt.union([_user.UserRT, rt.null])
})]);
exports.CaseAttributesRt = CaseAttributesRt;
const CasePostRequestNoTypeRt = rt.type({
  description: rt.string,
  tags: rt.array(rt.string),
  title: rt.string,
  connector: _connectors.CaseConnectorRt,
  settings: SettingsRt
});
/**
 * This type is used for validating a create case request. It requires that the type field be defined.
 */

const CaseClientPostRequestRt = rt.type({ ...CasePostRequestNoTypeRt.props,
  [caseTypeField]: CaseTypeRt
});
/**
 * This type is not used for validation when decoding a request because intersection does not have props defined which
 * required for the excess function. Instead we use this as the type used by the UI. This allows the type field to be
 * optional and the server will handle setting it to a default value before validating that the request
 * has all the necessary fields. CaseClientPostRequestRt is used for validation.
 */

exports.CaseClientPostRequestRt = CaseClientPostRequestRt;
const CasePostRequestRt = rt.intersection([rt.partial({
  type: CaseTypeRt
}), CasePostRequestNoTypeRt]);
exports.CasePostRequestRt = CasePostRequestRt;
const CasesFindRequestRt = rt.partial({
  type: CaseTypeRt,
  tags: rt.union([rt.array(rt.string), rt.string]),
  status: _status.CaseStatusRt,
  reporters: rt.union([rt.array(rt.string), rt.string]),
  defaultSearchOperator: rt.union([rt.literal('AND'), rt.literal('OR')]),
  fields: rt.array(rt.string),
  page: _saved_object.NumberFromString,
  perPage: _saved_object.NumberFromString,
  search: rt.string,
  searchFields: rt.array(rt.string),
  sortField: rt.string,
  sortOrder: rt.union([rt.literal('desc'), rt.literal('asc')])
});
exports.CasesFindRequestRt = CasesFindRequestRt;
const CaseResponseRt = rt.intersection([CaseAttributesRt, rt.type({
  id: rt.string,
  totalComment: rt.number,
  totalAlerts: rt.number,
  version: rt.string
}), rt.partial({
  subCaseIds: rt.array(rt.string),
  subCases: rt.array(_sub_case.SubCaseResponseRt),
  comments: rt.array(_comment.CommentResponseRt)
})]);
exports.CaseResponseRt = CaseResponseRt;
const CasesFindResponseRt = rt.intersection([rt.type({
  cases: rt.array(CaseResponseRt),
  page: rt.number,
  per_page: rt.number,
  total: rt.number
}), _status.CasesStatusResponseRt]);
exports.CasesFindResponseRt = CasesFindResponseRt;
const CasePatchRequestRt = rt.intersection([rt.partial(CaseBasicRt.props), rt.type({
  id: rt.string,
  version: rt.string
})]);
exports.CasePatchRequestRt = CasePatchRequestRt;
const CasesPatchRequestRt = rt.type({
  cases: rt.array(CasePatchRequestRt)
});
exports.CasesPatchRequestRt = CasesPatchRequestRt;
const CasesResponseRt = rt.array(CaseResponseRt);
exports.CasesResponseRt = CasesResponseRt;
const CasePushRequestParamsRt = rt.type({
  case_id: rt.string,
  connector_id: rt.string
});
exports.CasePushRequestParamsRt = CasePushRequestParamsRt;
const ExternalServiceResponseRt = rt.intersection([rt.type({
  title: rt.string,
  id: rt.string,
  pushedDate: rt.string,
  url: rt.string
}), rt.partial({
  comments: rt.array(rt.intersection([rt.type({
    commentId: rt.string,
    pushedDate: rt.string
  }), rt.partial({
    externalCommentId: rt.string
  })]))
})]);
exports.ExternalServiceResponseRt = ExternalServiceResponseRt;