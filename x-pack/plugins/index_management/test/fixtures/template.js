"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTemplate = exports.getComposableTemplate = void 0;

var _jest = require("@kbn/test/jest");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const objHasProperties = obj => {
  return obj === undefined || Object.keys(obj).length === 0 ? false : true;
};

const getComposableTemplate = ({
  name = (0, _jest.getRandomString)(),
  version = (0, _jest.getRandomNumber)(),
  priority = (0, _jest.getRandomNumber)(),
  indexPatterns = [],
  template: {
    settings,
    aliases,
    mappings
  } = {},
  hasDatastream = false,
  isLegacy = false,
  type = 'default'
} = {}) => {
  const indexTemplate = {
    name,
    version,
    priority,
    indexPatterns,
    template: {
      aliases,
      mappings,
      settings
    },
    _kbnMeta: {
      type,
      hasDatastream,
      isLegacy
    }
  };
  return indexTemplate;
};

exports.getComposableTemplate = getComposableTemplate;

const getTemplate = ({
  name = (0, _jest.getRandomString)(),
  version = (0, _jest.getRandomNumber)(),
  order = (0, _jest.getRandomNumber)(),
  indexPatterns = [],
  template: {
    settings,
    aliases,
    mappings
  } = {},
  dataStream,
  hasDatastream = false,
  isLegacy = false,
  type = 'default'
} = {}) => {
  const indexTemplate = {
    name,
    version,
    order,
    indexPatterns,
    template: {
      aliases,
      mappings,
      settings
    },
    dataStream,
    hasSettings: objHasProperties(settings),
    hasMappings: objHasProperties(mappings),
    hasAliases: objHasProperties(aliases),
    _kbnMeta: {
      type,
      hasDatastream: dataStream !== undefined ? true : hasDatastream,
      isLegacy
    }
  };
  return indexTemplate;
};

exports.getTemplate = getTemplate;