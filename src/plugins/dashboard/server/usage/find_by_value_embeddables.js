"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findByValueEmbeddables = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const findByValueEmbeddables = async (savedObjectClient, embeddableType) => {
  const dashboards = await savedObjectClient.find({
    type: 'dashboard'
  });
  return dashboards.saved_objects.map(dashboard => {
    try {
      return JSON.parse(dashboard.attributes.panelsJSON);
    } catch (exception) {
      return [];
    }
  }).flat().filter(panel => panel.panelRefName === undefined).filter(panel => panel.type === embeddableType).map(panel => panel.embeddableConfig);
};

exports.findByValueEmbeddables = findByValueEmbeddables;