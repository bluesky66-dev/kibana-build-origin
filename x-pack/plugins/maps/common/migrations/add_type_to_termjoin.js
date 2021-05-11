"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addTypeToTermJoin = addTypeToTermJoin;

var _constants = require("../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// enforce type property on joins. It's possible older saved-objects do not have this correctly filled in
// e.g. sample-data was missing the right.type field.
// This is just to be safe.


function addTypeToTermJoin({
  attributes
}) {
  if (!attributes || !attributes.layerListJSON) {
    return attributes;
  }

  const layerList = JSON.parse(attributes.layerListJSON);
  layerList.forEach(layer => {
    if (layer.type !== _constants.LAYER_TYPE.VECTOR) {
      return;
    }

    if (!layer.joins) {
      return;
    }

    layer.joins.forEach(join => {
      if (!join.right) {
        return;
      }

      if (typeof join.right.type === 'undefined') {
        join.right.type = _constants.SOURCE_TYPES.ES_TERM_SOURCE;
      }
    });
  });
  return { ...attributes,
    layerListJSON: JSON.stringify(layerList)
  };
}