"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformDataToNdjson = exports.createLimitStream = exports.validateRules = exports.filterExportedCounts = exports.parseNdjsonStrings = void 0;

var _stream = require("stream");

var _fp = require("lodash/fp");

var _pipeable = require("fp-ts/lib/pipeable");

var _Either = require("fp-ts/lib/Either");

var _utils = require("@kbn/utils");

var _format_errors = require("../../../common/format_errors");

var _import_rules_type_dependents = require("../../../common/detection_engine/schemas/request/import_rules_type_dependents");

var _import_rules_schema = require("../../../common/detection_engine/schemas/request/import_rules_schema");

var _exact_check = require("../../../common/exact_check");

var _bad_request_error = require("../../lib/detection_engine/errors/bad_request_error");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const parseNdjsonStrings = () => {
  return (0, _utils.createMapStream)(ndJsonStr => {
    if ((0, _fp.isString)(ndJsonStr) && ndJsonStr.trim() !== '') {
      try {
        return JSON.parse(ndJsonStr);
      } catch (err) {
        return err;
      }
    }
  });
};

exports.parseNdjsonStrings = parseNdjsonStrings;

const filterExportedCounts = () => {
  return (0, _utils.createFilterStream)(obj => obj != null && !(0, _fp.has)('exported_count', obj));
};

exports.filterExportedCounts = filterExportedCounts;

const validateRules = () => {
  return (0, _utils.createMapStream)(obj => {
    if (!(obj instanceof Error)) {
      const decoded = _import_rules_schema.importRulesSchema.decode(obj);

      const checked = (0, _exact_check.exactCheck)(obj, decoded);

      const onLeft = errors => {
        return new _bad_request_error.BadRequestError((0, _format_errors.formatErrors)(errors).join());
      };

      const onRight = schema => {
        const validationErrors = (0, _import_rules_type_dependents.importRuleValidateTypeDependents)(schema);

        if (validationErrors.length) {
          return new _bad_request_error.BadRequestError(validationErrors.join());
        } else {
          return schema;
        }
      };

      return (0, _pipeable.pipe)(checked, (0, _Either.fold)(onLeft, onRight));
    } else {
      return obj;
    }
  });
}; // Adaptation from: saved_objects/import/create_limit_stream.ts


exports.validateRules = validateRules;

const createLimitStream = limit => {
  let counter = 0;
  return new _stream.Transform({
    objectMode: true,

    async transform(obj, _, done) {
      if (counter >= limit) {
        return done(new Error(`Can't import more than ${limit} rules`));
      }

      counter++;
      done(undefined, obj);
    }

  });
};

exports.createLimitStream = createLimitStream;

const transformDataToNdjson = data => {
  if (data.length !== 0) {
    const dataString = data.map(rule => JSON.stringify(rule)).join('\n');
    return `${dataString}\n`;
  } else {
    return '';
  }
};

exports.transformDataToNdjson = transformDataToNdjson;