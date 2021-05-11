"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isStopTransformsResponseSchema = exports.isStartTransformsResponseSchema = exports.isPutTransformsResponseSchema = exports.isPostTransformsUpdateResponseSchema = exports.isPostTransformsPreviewResponseSchema = exports.isGetTransformsAuditMessagesResponseSchema = exports.isFieldHistogramsResponseSchema = exports.isEsSearchResponse = exports.isEsIndices = exports.isDeleteTransformsResponseSchema = exports.isGetTransformsStatsResponseSchema = exports.isGetTransformsResponseSchema = exports.isGetTransformNodesResponseSchema = void 0;

var _object_utils = require("../utils/object_utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const isGenericResponseSchema = arg => {
  return (0, _object_utils.isPopulatedObject)(arg) && {}.hasOwnProperty.call(arg, 'count') && {}.hasOwnProperty.call(arg, 'transforms') && Array.isArray(arg.transforms);
};

const isGetTransformNodesResponseSchema = arg => {
  return (0, _object_utils.isPopulatedObject)(arg) && {}.hasOwnProperty.call(arg, 'count') && typeof arg.count === 'number';
};

exports.isGetTransformNodesResponseSchema = isGetTransformNodesResponseSchema;

const isGetTransformsResponseSchema = arg => {
  return isGenericResponseSchema(arg);
};

exports.isGetTransformsResponseSchema = isGetTransformsResponseSchema;

const isGetTransformsStatsResponseSchema = arg => {
  return isGenericResponseSchema(arg);
};

exports.isGetTransformsStatsResponseSchema = isGetTransformsStatsResponseSchema;

const isDeleteTransformsResponseSchema = arg => {
  return (0, _object_utils.isPopulatedObject)(arg) && Object.values(arg).every(d => ({}).hasOwnProperty.call(d, 'transformDeleted'));
};

exports.isDeleteTransformsResponseSchema = isDeleteTransformsResponseSchema;

const isEsIndices = arg => {
  return Array.isArray(arg);
};

exports.isEsIndices = isEsIndices;

const isEsSearchResponse = arg => {
  return (0, _object_utils.isPopulatedObject)(arg) && {}.hasOwnProperty.call(arg, 'hits');
};

exports.isEsSearchResponse = isEsSearchResponse;

const isFieldHistogramsResponseSchema = arg => {
  return Array.isArray(arg);
};

exports.isFieldHistogramsResponseSchema = isFieldHistogramsResponseSchema;

const isGetTransformsAuditMessagesResponseSchema = arg => {
  return Array.isArray(arg);
};

exports.isGetTransformsAuditMessagesResponseSchema = isGetTransformsAuditMessagesResponseSchema;

const isPostTransformsPreviewResponseSchema = arg => {
  return (0, _object_utils.isPopulatedObject)(arg) && {}.hasOwnProperty.call(arg, 'generated_dest_index') && {}.hasOwnProperty.call(arg, 'preview') && typeof arg.generated_dest_index !== undefined && Array.isArray(arg.preview);
};

exports.isPostTransformsPreviewResponseSchema = isPostTransformsPreviewResponseSchema;

const isPostTransformsUpdateResponseSchema = arg => {
  return (0, _object_utils.isPopulatedObject)(arg) && {}.hasOwnProperty.call(arg, 'id') && typeof arg.id === 'string';
};

exports.isPostTransformsUpdateResponseSchema = isPostTransformsUpdateResponseSchema;

const isPutTransformsResponseSchema = arg => {
  return (0, _object_utils.isPopulatedObject)(arg) && {}.hasOwnProperty.call(arg, 'transformsCreated') && {}.hasOwnProperty.call(arg, 'errors') && Array.isArray(arg.transformsCreated) && Array.isArray(arg.errors);
};

exports.isPutTransformsResponseSchema = isPutTransformsResponseSchema;

const isGenericSuccessResponseSchema = arg => (0, _object_utils.isPopulatedObject)(arg) && Object.values(arg).every(d => ({}).hasOwnProperty.call(d, 'success'));

const isStartTransformsResponseSchema = arg => {
  return isGenericSuccessResponseSchema(arg);
};

exports.isStartTransformsResponseSchema = isStartTransformsResponseSchema;

const isStopTransformsResponseSchema = arg => {
  return isGenericSuccessResponseSchema(arg);
};

exports.isStopTransformsResponseSchema = isStopTransformsResponseSchema;