"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildCaseUserActions = exports.buildSubCaseUserActions = exports.buildCaseUserActionItem = exports.buildCommentUserActionItem = exports.transformNewUserAction = void 0;

var _lodash = require("lodash");

var _fastDeepEqual = _interopRequireDefault(require("fast-deep-equal"));

var _helpers = require("../../routes/api/cases/helpers");

var _saved_object_types = require("../../saved_object_types");

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


const transformNewUserAction = ({
  actionField,
  action,
  actionAt,
  email,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  full_name,
  newValue = null,
  oldValue = null,
  username
}) => ({
  action_field: actionField,
  action,
  action_at: actionAt,
  action_by: {
    email,
    full_name,
    username
  },
  new_value: newValue,
  old_value: oldValue
});

exports.transformNewUserAction = transformNewUserAction;

const buildCommentUserActionItem = ({
  action,
  actionAt,
  actionBy,
  caseId,
  commentId,
  fields,
  newValue,
  oldValue,
  subCaseId
}) => ({
  attributes: transformNewUserAction({
    actionField: fields,
    action,
    actionAt,
    ...actionBy,
    newValue: newValue,
    oldValue: oldValue
  }),
  references: [{
    type: _saved_object_types.CASE_SAVED_OBJECT,
    name: `associated-${_saved_object_types.CASE_SAVED_OBJECT}`,
    id: caseId
  }, {
    type: _saved_object_types.CASE_COMMENT_SAVED_OBJECT,
    name: `associated-${_saved_object_types.CASE_COMMENT_SAVED_OBJECT}`,
    id: commentId
  }, ...(subCaseId ? [{
    type: _saved_object_types.SUB_CASE_SAVED_OBJECT,
    id: subCaseId,
    name: `associated-${_saved_object_types.SUB_CASE_SAVED_OBJECT}`
  }] : [])]
});

exports.buildCommentUserActionItem = buildCommentUserActionItem;

const buildCaseUserActionItem = ({
  action,
  actionAt,
  actionBy,
  caseId,
  fields,
  newValue,
  oldValue,
  subCaseId
}) => ({
  attributes: transformNewUserAction({
    actionField: fields,
    action,
    actionAt,
    ...actionBy,
    newValue: newValue,
    oldValue: oldValue
  }),
  references: [{
    type: _saved_object_types.CASE_SAVED_OBJECT,
    name: `associated-${_saved_object_types.CASE_SAVED_OBJECT}`,
    id: caseId
  }, ...(subCaseId ? [{
    type: _saved_object_types.SUB_CASE_SAVED_OBJECT,
    name: `associated-${_saved_object_types.SUB_CASE_SAVED_OBJECT}`,
    id: subCaseId
  }] : [])]
});

exports.buildCaseUserActionItem = buildCaseUserActionItem;
const userActionFieldsAllowed = ['comment', 'connector', 'description', 'tags', 'title', 'status', 'settings', 'sub_case'];

const buildGenericCaseUserActions = ({
  actionDate,
  actionBy,
  originalCases,
  updatedCases,
  allowedFields,
  getters
}) => {
  const {
    getCaseAndSubID,
    getField
  } = getters;
  return updatedCases.reduce((acc, updatedItem) => {
    const {
      caseId,
      subCaseId
    } = getCaseAndSubID(updatedItem); // regardless of whether we're looking at a sub case or case, the id field will always be used to match between
    // the original and the updated saved object

    const originalItem = originalCases.find(oItem => oItem.id === updatedItem.id);

    if (originalItem != null) {
      let userActions = [];
      const updatedFields = Object.keys(updatedItem.attributes);
      updatedFields.forEach(field => {
        if (allowedFields.includes(field)) {
          const origValue = getField(originalItem, field);
          const updatedValue = getField(updatedItem, field);

          if ((0, _lodash.isString)(origValue) && (0, _lodash.isString)(updatedValue) && origValue !== updatedValue) {
            userActions = [...userActions, buildCaseUserActionItem({
              action: 'update',
              actionAt: actionDate,
              actionBy,
              caseId,
              subCaseId,
              fields: [field],
              newValue: updatedValue,
              oldValue: origValue
            })];
          } else if (Array.isArray(origValue) && Array.isArray(updatedValue)) {
            const compareValues = (0, _helpers.isTwoArraysDifference)(origValue, updatedValue);

            if (compareValues && compareValues.addedItems.length > 0) {
              userActions = [...userActions, buildCaseUserActionItem({
                action: 'add',
                actionAt: actionDate,
                actionBy,
                caseId,
                subCaseId,
                fields: [field],
                newValue: compareValues.addedItems.join(', ')
              })];
            }

            if (compareValues && compareValues.deletedItems.length > 0) {
              userActions = [...userActions, buildCaseUserActionItem({
                action: 'delete',
                actionAt: actionDate,
                actionBy,
                caseId,
                subCaseId,
                fields: [field],
                newValue: compareValues.deletedItems.join(', ')
              })];
            }
          } else if ((0, _lodash.isPlainObject)(origValue) && (0, _lodash.isPlainObject)(updatedValue) && !(0, _fastDeepEqual.default)(origValue, updatedValue)) {
            userActions = [...userActions, buildCaseUserActionItem({
              action: 'update',
              actionAt: actionDate,
              actionBy,
              caseId,
              subCaseId,
              fields: [field],
              newValue: JSON.stringify(updatedValue),
              oldValue: JSON.stringify(origValue)
            })];
          }
        }
      });
      return [...acc, ...userActions];
    }

    return acc;
  }, []);
};
/**
 * Create a user action for an updated sub case.
 */


const buildSubCaseUserActions = args => {
  const getField = (so, field) => (0, _lodash.get)(so, ['attributes', field]);

  const getCaseAndSubID = so => {
    var _so$references$find$i, _so$references, _so$references$find;

    const caseId = (_so$references$find$i = (_so$references = so.references) === null || _so$references === void 0 ? void 0 : (_so$references$find = _so$references.find(ref => ref.type === _saved_object_types.CASE_SAVED_OBJECT)) === null || _so$references$find === void 0 ? void 0 : _so$references$find.id) !== null && _so$references$find$i !== void 0 ? _so$references$find$i : '';
    return {
      caseId,
      subCaseId: so.id
    };
  };

  const getters = {
    getField,
    getCaseAndSubID
  };
  return buildGenericCaseUserActions({
    actionDate: args.actionDate,
    actionBy: args.actionBy,
    originalCases: args.originalSubCases,
    updatedCases: args.updatedSubCases,
    allowedFields: ['status'],
    getters
  });
};
/**
 * Create a user action for an updated case.
 */


exports.buildSubCaseUserActions = buildSubCaseUserActions;

const buildCaseUserActions = args => {
  const getField = (so, field) => {
    return field === 'connector' && so.attributes.connector ? (0, _helpers.transformESConnectorToCaseConnector)(so.attributes.connector) : (0, _lodash.get)(so, ['attributes', field]);
  };

  const caseGetIds = so => {
    return {
      caseId: so.id
    };
  };

  const getters = {
    getField,
    getCaseAndSubID: caseGetIds
  };
  return buildGenericCaseUserActions({ ...args,
    allowedFields: userActionFieldsAllowed,
    getters
  });
};

exports.buildCaseUserActions = buildCaseUserActions;