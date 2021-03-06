"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dynamicActionFactoriesCollector = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const dynamicActionFactoriesCollector = (getActionFactory, state, stats) => {
  for (const event of state.events) {
    const factory = getActionFactory(event.action.factoryId);

    if (factory) {
      stats = factory.telemetry(event, stats);
    }
  }

  return stats;
};

exports.dynamicActionFactoriesCollector = dynamicActionFactoriesCollector;