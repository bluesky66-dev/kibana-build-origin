"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMigrateFunction = void 0;

var _migrate_base_input = require("./migrate_base_input");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const getMigrateFunction = embeddables => {
  return (state, version) => {
    const enhancements = state.enhancements || {};
    const factory = embeddables.getEmbeddableFactory(state.type);
    let updatedInput = _migrate_base_input.baseEmbeddableMigrations[version] ? _migrate_base_input.baseEmbeddableMigrations[version](state) : state;

    if (factory && factory.migrations[version]) {
      updatedInput = factory.migrations[version](updatedInput);
    }

    updatedInput.enhancements = {};
    Object.keys(enhancements).forEach(key => {
      if (!enhancements[key]) return;
      updatedInput.enhancements[key] = embeddables.getEnhancement(key).migrations[version](enhancements[key]);
    });
    return updatedInput;
  };
};

exports.getMigrateFunction = getMigrateFunction;