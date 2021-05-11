"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serializeRepositorySettings = exports.deserializeRepositorySettings = void 0;

var _lodash = require("lodash");

var _lib = require("../../common/lib");

var _clean_settings = require("./clean_settings");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const booleanizeValue = value => {
  if (value === 'true') {
    return true;
  } else if (value === 'false') {
    return false;
  }

  return value;
};

const deserializeRepositorySettings = settings => {
  // HDFS repositories return settings like:
  // `{ security: { principal: 'some_value'}, conf: { foo: { bar: 'another_value' }}}`
  // Flattening such settings makes it easier to consume in the UI, for both viewing and updating
  const flattenedSettings = (0, _lib.flatten)(settings);
  const deserializedSettings = {};
  Object.entries(flattenedSettings).forEach(([key, value]) => {
    // Avoid camel casing keys that are the result of being flattened, such as `security.principal` and `conf.*`
    if (key.includes('.')) {
      deserializedSettings[key] = booleanizeValue(value);
    } else {
      deserializedSettings[(0, _lodash.camelCase)(key)] = booleanizeValue(value);
    }
  });
  return deserializedSettings;
};

exports.deserializeRepositorySettings = deserializeRepositorySettings;

const serializeRepositorySettings = settings => {
  const serializedSettings = {};
  Object.entries(settings).forEach(([key, value]) => {
    // Avoid snake casing keys that are the result of being flattened, such as `security.principal` and `conf.*`
    if (key.includes('.')) {
      serializedSettings[key] = value;
    } else {
      serializedSettings[(0, _lodash.snakeCase)(key)] = value;
    }
  });
  return (0, _clean_settings.cleanSettings)(serializedSettings);
};

exports.serializeRepositorySettings = serializeRepositorySettings;