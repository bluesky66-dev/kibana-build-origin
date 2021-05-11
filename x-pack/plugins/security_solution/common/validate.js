"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateTaskEither = exports.validateEither = exports.validate = void 0;

var _Either = require("fp-ts/lib/Either");

var _pipeable = require("fp-ts/lib/pipeable");

var _TaskEither = require("fp-ts/lib/TaskEither");

var t = _interopRequireWildcard(require("io-ts"));

var _exact_check = require("./exact_check");

var _format_errors = require("./format_errors");

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


const validate = (obj, schema) => {
  const decoded = schema.decode(obj);
  const checked = (0, _exact_check.exactCheck)(obj, decoded);

  const left = errors => [null, (0, _format_errors.formatErrors)(errors).join(',')];

  const right = output => [output, null];

  return (0, _pipeable.pipe)(checked, (0, _Either.fold)(left, right));
};

exports.validate = validate;

const validateEither = (schema, obj) => (0, _pipeable.pipe)(obj, a => schema.validate(a, t.getDefaultContext(schema.asDecoder())), (0, _Either.mapLeft)(errors => new Error((0, _format_errors.formatErrors)(errors).join(','))));

exports.validateEither = validateEither;

const validateTaskEither = (schema, obj) => (0, _TaskEither.fromEither)(validateEither(schema, obj));

exports.validateTaskEither = validateTaskEither;