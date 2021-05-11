"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CaseUserActionsResponseRt = exports.CaseUserActionAttributesRt = void 0;

var rt = _interopRequireWildcard(require("io-ts"));

var _user = require("../user");

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

/* To the next developer, if you add/removed fields here
 * make sure to check this file (x-pack/plugins/case/server/services/user_actions/helpers.ts) too
 */


const UserActionFieldTypeRt = rt.union([rt.literal('comment'), rt.literal('connector'), rt.literal('description'), rt.literal('pushed'), rt.literal('tags'), rt.literal('title'), rt.literal('status'), rt.literal('settings'), rt.literal('sub_case')]);
const UserActionFieldRt = rt.array(UserActionFieldTypeRt);
const UserActionRt = rt.union([rt.literal('add'), rt.literal('create'), rt.literal('delete'), rt.literal('update'), rt.literal('push-to-service')]); // TO DO change state to status

const CaseUserActionBasicRT = rt.type({
  action_field: UserActionFieldRt,
  action: UserActionRt,
  action_at: rt.string,
  action_by: _user.UserRT,
  new_value: rt.union([rt.string, rt.null]),
  old_value: rt.union([rt.string, rt.null])
});
const CaseUserActionResponseRT = rt.intersection([CaseUserActionBasicRT, rt.type({
  action_id: rt.string,
  case_id: rt.string,
  comment_id: rt.union([rt.string, rt.null])
}), rt.partial({
  sub_case_id: rt.string
})]);
const CaseUserActionAttributesRt = CaseUserActionBasicRT;
exports.CaseUserActionAttributesRt = CaseUserActionAttributesRt;
const CaseUserActionsResponseRt = rt.array(CaseUserActionResponseRT);
exports.CaseUserActionsResponseRt = CaseUserActionsResponseRt;