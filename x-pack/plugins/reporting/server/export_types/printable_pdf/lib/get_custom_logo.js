"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCustomLogo = void 0;

var _constants = require("../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getCustomLogo = async (reporting, conditionalHeaders, spaceId, logger) => {
  const fakeRequest = reporting.getFakeRequest({
    headers: conditionalHeaders.headers
  }, spaceId, logger);
  const uiSettingsClient = await reporting.getUiSettingsClient(fakeRequest, logger);
  const logo = await uiSettingsClient.get(_constants.UI_SETTINGS_CUSTOM_PDF_LOGO); // continue the pipeline

  return {
    conditionalHeaders,
    logo
  };
};

exports.getCustomLogo = getCustomLogo;