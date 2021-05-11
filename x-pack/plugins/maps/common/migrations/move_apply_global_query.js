"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.moveApplyGlobalQueryToSources = moveApplyGlobalQueryToSources;

var _lodash = _interopRequireDefault(require("lodash"));

var _constants = require("../constants");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function isEsSource(layerDescriptor) {
  const sourceType = _lodash.default.get(layerDescriptor, 'sourceDescriptor.type');

  return [_constants.SOURCE_TYPES.ES_GEO_GRID, _constants.SOURCE_TYPES.ES_PEW_PEW, _constants.SOURCE_TYPES.ES_SEARCH].includes(sourceType);
} // Migration to move applyGlobalQuery from layer to sources.
// Moving to source to provide user the granularity needed to apply global filter per source.


function moveApplyGlobalQueryToSources({
  attributes
}) {
  if (!attributes.layerListJSON) {
    return attributes;
  }

  const layerList = JSON.parse(attributes.layerListJSON);
  layerList.forEach(layerDescriptor => {
    const applyGlobalQuery = _lodash.default.get(layerDescriptor, 'applyGlobalQuery', true);

    delete layerDescriptor.applyGlobalQuery;

    if (isEsSource(layerDescriptor)) {
      layerDescriptor.sourceDescriptor.applyGlobalQuery = applyGlobalQuery;
    }

    if (_lodash.default.has(layerDescriptor, 'joins')) {
      layerDescriptor.joins.forEach(joinDescriptor => {
        if (_lodash.default.has(joinDescriptor, 'right')) {
          // joinDescriptor.right is ES_TERM_SOURCE source descriptor
          joinDescriptor.right.applyGlobalQuery = applyGlobalQuery;
        }
      });
    }
  });
  return { ...attributes,
    layerListJSON: JSON.stringify(layerList)
  };
}