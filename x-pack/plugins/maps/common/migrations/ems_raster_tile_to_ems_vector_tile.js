"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.emsRasterTileToEmsVectorTile = emsRasterTileToEmsVectorTile;

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


function isEmsTileSource(layerDescriptor) {
  const sourceType = _lodash.default.get(layerDescriptor, 'sourceDescriptor.type');

  return sourceType === _constants.SOURCE_TYPES.EMS_TMS;
}

function isTileLayer(layerDescriptor) {
  const layerType = _lodash.default.get(layerDescriptor, 'type');

  return layerType === _constants.LAYER_TYPE.TILE;
}

function emsRasterTileToEmsVectorTile({
  attributes
}) {
  if (!attributes.layerListJSON) {
    return attributes;
  }

  const layerList = JSON.parse(attributes.layerListJSON);
  layerList.forEach(layer => {
    if (isTileLayer(layer) && isEmsTileSource(layer)) {
      // Just need to switch layer type to migrate TILE layer to VECTOR_TILE layer
      layer.type = _constants.LAYER_TYPE.VECTOR_TILE;
    }
  });
  return { ...attributes,
    layerListJSON: JSON.stringify(layerList)
  };
}