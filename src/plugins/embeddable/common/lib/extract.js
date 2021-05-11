"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getExtractFunction = void 0;

var _migrate_base_input = require("./migrate_base_input");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const getExtractFunction = embeddables => {
  return state => {
    const enhancements = state.enhancements || {};
    const factory = embeddables.getEmbeddableFactory(state.type);
    const baseResponse = (0, _migrate_base_input.extractBaseEmbeddableInput)(state);
    let updatedInput = baseResponse.state;
    const refs = baseResponse.references;

    if (factory) {
      const factoryResponse = factory.extract(state);
      updatedInput = factoryResponse.state;
      refs.push(...factoryResponse.references);
    }

    updatedInput.enhancements = {};
    Object.keys(enhancements).forEach(key => {
      if (!enhancements[key]) return;
      const enhancementResult = embeddables.getEnhancement(key).extract(enhancements[key]);
      refs.push(...enhancementResult.references);
      updatedInput.enhancements[key] = enhancementResult.state;
    });
    return {
      state: updatedInput,
      references: refs
    };
  };
};

exports.getExtractFunction = getExtractFunction;