"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTimelinesStreamFromNdJson = exports.validateTimelines = exports.decodeOrThrow = exports.throwErrors = exports.createPlainError = void 0;

var _pipeable = require("fp-ts/lib/pipeable");

var _Either = require("fp-ts/lib/Either");

var _PathReporter = require("io-ts/lib/PathReporter");

var _function = require("fp-ts/lib/function");

var _utils = require("@kbn/utils");

var _create_stream_from_ndjson = require("../../utils/read_stream/create_stream_from_ndjson");

var _import_timelines_schema = require("./routes/schemas/import_timelines_schema");

var _bad_request_error = require("../detection_engine/errors/bad_request_error");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createPlainError = message => new Error(message);

exports.createPlainError = createPlainError;

const throwErrors = createError => errors => {
  throw createError((0, _PathReporter.failure)(errors).join('\n'));
};

exports.throwErrors = throwErrors;

const decodeOrThrow = (runtimeType, createError = createPlainError) => inputValue => (0, _pipeable.pipe)(runtimeType.decode(inputValue), (0, _Either.fold)(throwErrors(createError), _function.identity));

exports.decodeOrThrow = decodeOrThrow;

const validateTimelines = () => (0, _utils.createMapStream)(obj => obj instanceof Error ? new _bad_request_error.BadRequestError(obj.message) : decodeOrThrow(_import_timelines_schema.ImportTimelinesSchemaRt)(obj));

exports.validateTimelines = validateTimelines;

const createTimelinesStreamFromNdJson = ruleLimit => {
  return [(0, _utils.createSplitStream)('\n'), (0, _create_stream_from_ndjson.parseNdjsonStrings)(), (0, _create_stream_from_ndjson.filterExportedCounts)(), validateTimelines(), (0, _create_stream_from_ndjson.createLimitStream)(ruleLimit), (0, _utils.createConcatStream)([])];
};

exports.createTimelinesStreamFromNdJson = createTimelinesStreamFromNdJson;