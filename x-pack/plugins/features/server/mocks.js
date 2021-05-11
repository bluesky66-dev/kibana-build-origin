"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.featuresPluginMock = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createSetup = () => {
  return {
    getKibanaFeatures: jest.fn(),
    getElasticsearchFeatures: jest.fn(),
    getFeaturesUICapabilities: jest.fn(),
    registerKibanaFeature: jest.fn(),
    registerElasticsearchFeature: jest.fn()
  };
};

const createStart = () => {
  return {
    getKibanaFeatures: jest.fn(),
    getElasticsearchFeatures: jest.fn()
  };
};

const featuresPluginMock = {
  createSetup,
  createStart
};
exports.featuresPluginMock = featuresPluginMock;