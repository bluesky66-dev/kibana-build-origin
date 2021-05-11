"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getInputIndex = void 0;

var _constants = require("../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getInputIndex = async (services, version, inputIndex) => {
  if (inputIndex != null) {
    return inputIndex;
  } else {
    const configuration = await services.savedObjectsClient.get('config', version);

    if (configuration.attributes != null && configuration.attributes[_constants.DEFAULT_INDEX_KEY] != null) {
      return configuration.attributes[_constants.DEFAULT_INDEX_KEY];
    } else {
      return _constants.DEFAULT_INDEX_PATTERN;
    }
  }
};

exports.getInputIndex = getInputIndex;