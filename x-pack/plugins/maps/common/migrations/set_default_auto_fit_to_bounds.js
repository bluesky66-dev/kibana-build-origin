"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setDefaultAutoFitToBounds = setDefaultAutoFitToBounds;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function setDefaultAutoFitToBounds({
  attributes
}) {
  if (!attributes || !attributes.mapStateJSON) {
    return attributes;
  } // MapState type is defined in public, no need to bring all of that to common for this migration


  const mapState = JSON.parse(attributes.mapStateJSON);

  if ('settings' in mapState) {
    mapState.settings.autoFitToDataBounds = false;
  } else {
    mapState.settings = {
      autoFitToDataBounds: false
    };
  }

  return { ...attributes,
    mapStateJSON: JSON.stringify(mapState)
  };
}