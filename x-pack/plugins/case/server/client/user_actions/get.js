"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = void 0;

var _saved_object_types = require("../../saved_object_types");

var _api = require("../../../common/api");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const get = async ({
  savedObjectsClient,
  userActionService,
  caseId,
  subCaseId
}) => {
  const userActions = await userActionService.getUserActions({
    client: savedObjectsClient,
    caseId,
    subCaseId
  });
  return _api.CaseUserActionsResponseRt.encode(userActions.saved_objects.reduce((acc, ua) => {
    var _ua$references$find$i, _ua$references$find, _ua$references$find$i2, _ua$references$find2, _ua$references$find$i3, _ua$references$find3;

    if (subCaseId == null && ua.references.some(uar => uar.type === _saved_object_types.SUB_CASE_SAVED_OBJECT)) {
      return acc;
    }

    return [...acc, { ...ua.attributes,
      action_id: ua.id,
      case_id: (_ua$references$find$i = (_ua$references$find = ua.references.find(r => r.type === _saved_object_types.CASE_SAVED_OBJECT)) === null || _ua$references$find === void 0 ? void 0 : _ua$references$find.id) !== null && _ua$references$find$i !== void 0 ? _ua$references$find$i : '',
      comment_id: (_ua$references$find$i2 = (_ua$references$find2 = ua.references.find(r => r.type === _saved_object_types.CASE_COMMENT_SAVED_OBJECT)) === null || _ua$references$find2 === void 0 ? void 0 : _ua$references$find2.id) !== null && _ua$references$find$i2 !== void 0 ? _ua$references$find$i2 : null,
      sub_case_id: (_ua$references$find$i3 = (_ua$references$find3 = ua.references.find(r => r.type === _saved_object_types.SUB_CASE_SAVED_OBJECT)) === null || _ua$references$find3 === void 0 ? void 0 : _ua$references$find3.id) !== null && _ua$references$find$i3 !== void 0 ? _ua$references$find$i3 : ''
    }];
  }, []));
};

exports.get = get;