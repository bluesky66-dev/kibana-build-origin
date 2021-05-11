"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mockGetFieldFormatsStart = mockGetFieldFormatsStart;
exports.mockAggTypesRegistry = mockAggTypesRegistry;
exports.mockAggTypesDependencies = void 0;

var _mocks = require("../../../field_formats/mocks");

var _agg_types_registry = require("../agg_types_registry");

var _agg_types = require("../agg_types");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
// Mocked uiSettings shared among aggs unit tests
const mockGetConfig = jest.fn().mockImplementation(key => {
  var _config$key;

  const config = {
    'histogram:maxBars': 4,
    'histogram:barTarget': 3,
    dateFormat: 'YYYY-MM-DD',
    'dateFormat:scaled': [['', 'HH:mm:ss.SSS'], ['PT1S', 'HH:mm:ss'], ['PT1M', 'HH:mm'], ['PT1H', 'YYYY-MM-DD HH:mm'], ['P1DT', 'YYYY-MM-DD'], ['P1YT', 'YYYY']],
    'query:queryString:options': {}
  };
  return (_config$key = config[key]) !== null && _config$key !== void 0 ? _config$key : key;
});
/** @internal */

function mockGetFieldFormatsStart() {
  const {
    deserialize,
    getDefaultInstance
  } = _mocks.fieldFormatsMock;
  return {
    deserialize,
    getDefaultInstance
  };
}
/** @internal */


const mockAggTypesDependencies = {
  calculateBounds: jest.fn(),
  getFieldFormatsStart: mockGetFieldFormatsStart,
  getConfig: mockGetConfig,
  isDefaultTimezone: () => true
};
/**
 * Testing utility which creates a new instance of AggTypesRegistry,
 * registers the provided agg types, and returns AggTypesRegistry.start()
 *
 * This is useful if your test depends on a certain agg type to be present
 * in the registry.
 *
 * @param [types] - Optional array of AggTypes to register.
 * If no value is provided, all default types will be registered.
 *
 * @internal
 */

exports.mockAggTypesDependencies = mockAggTypesDependencies;

function mockAggTypesRegistry(deps) {
  const registry = new _agg_types_registry.AggTypesRegistry();
  const initializedAggTypes = new Map();
  const registrySetup = registry.setup();
  const aggTypes = (0, _agg_types.getAggTypes)();
  aggTypes.buckets.forEach(({
    name,
    fn
  }) => registrySetup.registerBucket(name, fn));
  aggTypes.metrics.forEach(({
    name,
    fn
  }) => registrySetup.registerMetric(name, fn));
  const registryStart = registry.start(); // initialize each agg type and store in memory

  registryStart.getAll().buckets.forEach(type => {
    const agg = type(deps !== null && deps !== void 0 ? deps : mockAggTypesDependencies);
    initializedAggTypes.set(agg.name, agg);
  });
  registryStart.getAll().metrics.forEach(type => {
    const agg = type(deps !== null && deps !== void 0 ? deps : mockAggTypesDependencies);
    initializedAggTypes.set(agg.name, agg);
  });
  return {
    get: name => {
      return initializedAggTypes.get(name);
    },
    getAll: () => {
      return {
        buckets: Array.from(initializedAggTypes.values()).filter(agg => agg.type === 'buckets'),
        metrics: Array.from(initializedAggTypes.values()).filter(agg => agg.type === 'metrics')
      };
    }
  };
}