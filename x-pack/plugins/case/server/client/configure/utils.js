"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createDefaultMapping = exports.formatFields = void 0;

var _connectors = require("../../../common/api/connectors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const normalizeJiraFields = jiraFields => Object.keys(jiraFields).reduce((acc, data) => jiraFields[data].schema.type === 'string' ? [...acc, {
  id: data,
  name: jiraFields[data].name,
  required: jiraFields[data].required,
  type: 'text'
}] : acc, []);

const normalizeResilientFields = resilientFields => resilientFields.reduce((acc, data) => (data.input_type === 'textarea' || data.input_type === 'text') && !data.read_only ? [...acc, {
  id: data.name,
  name: data.text,
  required: data.required === 'always',
  type: data.input_type
}] : acc, []);

const normalizeServiceNowFields = snFields => snFields.reduce((acc, data) => [...acc, {
  id: data.element,
  name: data.column_label,
  required: data.mandatory === 'true',
  type: parseFloat(data.max_length) > 160 ? 'textarea' : 'text'
}], []);

const formatFields = (theData, theType) => {
  switch (theType) {
    case _connectors.ConnectorTypes.jira:
      return normalizeJiraFields(theData);

    case _connectors.ConnectorTypes.resilient:
      return normalizeResilientFields(theData);

    case _connectors.ConnectorTypes.serviceNowITSM:
      return normalizeServiceNowFields(theData);

    case _connectors.ConnectorTypes.serviceNowSIR:
      return normalizeServiceNowFields(theData);

    default:
      return [];
  }
};

exports.formatFields = formatFields;

const findTextField = fields => {
  var _id, _ref, _fields$find;

  return (_id = (_ref = (_fields$find = fields.find(field => field.type === 'text' && field.required)) !== null && _fields$find !== void 0 ? _fields$find : fields.find(field => field.type === 'text')) === null || _ref === void 0 ? void 0 : _ref.id) !== null && _id !== void 0 ? _id : '';
};

const findTextAreaField = fields => {
  var _id2, _ref2, _ref3, _fields$find2;

  return (_id2 = (_ref2 = (_ref3 = (_fields$find2 = fields.find(field => field.type === 'textarea' && field.required)) !== null && _fields$find2 !== void 0 ? _fields$find2 : fields.find(field => field.type === 'textarea')) !== null && _ref3 !== void 0 ? _ref3 : fields.find(field => field.type === 'text')) === null || _ref2 === void 0 ? void 0 : _ref2.id) !== null && _id2 !== void 0 ? _id2 : '';
};

const getPreferredFields = theType => {
  let title = '';
  let description = '';
  let comments = '';

  if (theType === _connectors.ConnectorTypes.jira) {
    title = 'summary';
    description = 'description';
    comments = 'comments';
  } else if (theType === _connectors.ConnectorTypes.resilient) {
    title = 'name';
    description = 'description';
    comments = 'comments';
  } else if (theType === _connectors.ConnectorTypes.serviceNowITSM || theType === _connectors.ConnectorTypes.serviceNowSIR) {
    title = 'short_description';
    description = 'description';
    comments = 'work_notes';
  }

  return {
    title,
    description,
    comments
  };
};

const getRemainingFields = (fields, titleTarget) => fields.filter(field => field.id !== titleTarget);

const getDynamicFields = (fields, dynamicTitle = findTextField(fields)) => {
  const remainingFields = getRemainingFields(fields, dynamicTitle);
  const dynamicDescription = findTextAreaField(remainingFields);
  return {
    description: dynamicDescription,
    title: dynamicTitle
  };
};

const getField = (fields, fieldId) => fields.find(field => field.id === fieldId); // if dynamic title is not required and preferred is, true


const shouldTargetBePreferred = (fields, dynamic, preferred) => {
  if (dynamic !== preferred) {
    const dynamicT = getField(fields, dynamic);
    const preferredT = getField(fields, preferred);
    return preferredT != null && !(dynamicT !== null && dynamicT !== void 0 && dynamicT.required && !preferredT.required);
  }

  return false;
};

const createDefaultMapping = (fields, theType) => {
  const {
    description: dynamicDescription,
    title: dynamicTitle
  } = getDynamicFields(fields);
  const {
    description: preferredDescription,
    title: preferredTitle,
    comments: preferredComments
  } = getPreferredFields(theType);
  let titleTarget = dynamicTitle;
  let descriptionTarget = dynamicDescription;

  if (preferredTitle.length > 0 && preferredDescription.length > 0) {
    if (shouldTargetBePreferred(fields, dynamicTitle, preferredTitle)) {
      const {
        description: dynamicDescriptionOverwrite
      } = getDynamicFields(fields, preferredTitle);
      titleTarget = preferredTitle;
      descriptionTarget = dynamicDescriptionOverwrite;
    }

    if (shouldTargetBePreferred(fields, descriptionTarget, preferredDescription)) {
      descriptionTarget = preferredDescription;
    }
  }

  return [{
    source: 'title',
    target: titleTarget,
    action_type: 'overwrite'
  }, {
    source: 'description',
    target: descriptionTarget,
    action_type: 'overwrite'
  }, {
    source: 'comments',
    target: preferredComments,
    action_type: 'append'
  }];
};

exports.createDefaultMapping = createDefaultMapping;