"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.topHitsTimeToSort = topHitsTimeToSort;

var _lodash = _interopRequireDefault(require("lodash"));

var _constants = require("../constants");

var _search = require("../../../../../src/plugins/data/common/search");

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

function topHitsTimeToSort({
  attributes
}) {
  if (!attributes.layerListJSON) {
    return attributes;
  }

  const layerList = JSON.parse(attributes.layerListJSON);
  layerList.forEach(layerDescriptor => {
    if (isEsDocumentSource(layerDescriptor)) {
      if (_lodash.default.has(layerDescriptor, 'sourceDescriptor.topHitsTimeField')) {
        layerDescriptor.sourceDescriptor.sortField = layerDescriptor.sourceDescriptor.topHitsTimeField;
        layerDescriptor.sourceDescriptor.sortOrder = _search.SortDirection.desc;
        delete layerDescriptor.sourceDescriptor.topHitsTimeField;
      }
    }
  });
  return { ...attributes,
    layerListJSON: JSON.stringify(layerList)
  };
}