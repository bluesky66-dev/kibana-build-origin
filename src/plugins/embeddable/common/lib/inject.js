"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getInjectFunction = void 0;

var _migrate_base_input = require("./migrate_base_input");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const getInjectFunction = embeddables => {
  return (state, references) => {
    const enhancements = state.enhancements || {};
    const factory = embeddables.getEmbeddableFactory(state.type);
    let updatedInput = (0, _migrate_base_input.injectBaseEmbeddableInput)(state, references);

    if (factory) {
      updatedInput = factory.inject(updatedInput, references);
    }

    updatedInput.enhancements = {};
    Object.keys(enhancements).forEach(key => {
      if (!enhancements[key]) return;
      updatedInput.enhancements[key] = embeddables.getEnhancement(key).inject(enhancements[key], references);
    });
    return updatedInput;
  };
};

exports.getInjectFunction = getInjectFunction;