"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.migrateUseTopHitsToScalingType = migrateUseTopHitsToScalingType;

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


function isEsDocumentSource(layerDescriptor) {
  const sourceType = _lodash.default.get(layerDescriptor, 'sourceDescriptor.type');

  return sourceType === _constants.SOURCE_TYPES.ES_SEARCH;
}

function migrateUseTopHitsToScalingType({
  attributes
}) {
  if (!attributes || !attributes.layerListJSON) {
    return attributes;
  }

  const layerList = JSON.parse(attributes.layerListJSON);
  layerList.forEach(layerDescriptor => {
    if (isEsDocumentSource(layerDescriptor)) {
      const sourceDescriptor = layerDescriptor.sourceDescriptor;
      sourceDescriptor.scalingType = _lodash.default.get(layerDescriptor, 'sourceDescriptor.useTopHits', false) ? _constants.SCALING_TYPES.TOP_HITS : _constants.SCALING_TYPES.LIMIT; // @ts-expect-error
      // useTopHits no longer in type definition but that does not mean its not in live data
      // hence the entire point of this method

      delete sourceDescriptor.useTopHits;
    }
  });
  return { ...attributes,
    layerListJSON: JSON.stringify(layerList)
  };
}