"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addFieldMetaOptions = addFieldMetaOptions;

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

function addFieldMetaOptions({
  attributes
}) {
  if (!attributes.layerListJSON) {
    return attributes;
  }

  const layerList = JSON.parse(attributes.layerListJSON);
  layerList.forEach(layerDescriptor => {
    if (isVectorLayer(layerDescriptor) && _lodash.default.has(layerDescriptor, 'style.properties')) {
      Object.values(layerDescriptor.style.properties).forEach(stylePropertyDescriptor => {
        if (stylePropertyDescriptor.type === _constants.STYLE_TYPE.DYNAMIC) {
          stylePropertyDescriptor.options.fieldMetaOptions = {
            isEnabled: false,
            // turn off field metadata to avoid changing behavior of existing saved objects
            sigma: 3
          };
        }
      });
    }
  });
  return { ...attributes,
    layerListJSON: JSON.stringify(layerList)
  };
}