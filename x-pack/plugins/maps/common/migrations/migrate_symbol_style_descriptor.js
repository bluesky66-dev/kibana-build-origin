"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.migrateSymbolStyleDescriptor = migrateSymbolStyleDescriptor;

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


function isVectorLayer(layerDescriptor) {
  const layerType = _lodash.default.get(layerDescriptor, 'type');

  return layerType === _constants.LAYER_TYPE.VECTOR;
}

function migrateSymbolStyleDescriptor({
  attributes
}) {
  if (!attributes.layerListJSON) {
    return attributes;
  }

  const layerList = JSON.parse(attributes.layerListJSON);
  layerList.forEach(layerDescriptor => {
    if (!isVectorLayer(layerDescriptor) || !_lodash.default.has(layerDescriptor, 'style.properties')) {
      return;
    }

    const symbolizeAs = _lodash.default.get(layerDescriptor, 'style.properties.symbol.options.symbolizeAs', _constants.SYMBOLIZE_AS_TYPES.CIRCLE);

    layerDescriptor.style.properties.symbolizeAs = {
      options: {
        value: symbolizeAs
      }
    };

    const iconId = _lodash.default.get(layerDescriptor, 'style.properties.symbol.options.symbolId', _constants.DEFAULT_ICON);

    layerDescriptor.style.properties.icon = {
      type: _constants.STYLE_TYPE.STATIC,
      options: {
        value: iconId
      }
    };
    delete layerDescriptor.style.properties.symbol;
  });
  return { ...attributes,
    layerListJSON: JSON.stringify(layerList)
  };
}