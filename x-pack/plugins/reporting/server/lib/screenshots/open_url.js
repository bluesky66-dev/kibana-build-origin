"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.openUrl = void 0;

var _i18n = require("@kbn/i18n");

var _ = require("../");

var _schema_utils = require("../../../common/schema_utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const openUrl = async (captureConfig, browser, url, pageLoadSelector, conditionalHeaders, logger) => {
  const endTrace = (0, _.startTrace)('open_url', 'wait');

  try {
    const timeout = (0, _schema_utils.durationToNumber)(captureConfig.timeouts.openUrl);
    await browser.open(url, {
      conditionalHeaders,
      waitForSelector: pageLoadSelector,
      timeout
    }, logger);
  } catch (err) {
    logger.error(err);
    throw new Error(_i18n.i18n.translate('xpack.reporting.screencapture.couldntLoadKibana', {
      defaultMessage: `An error occurred when trying to open the Kibana URL. You may need to increase '{configKey}'. {error}`,
      values: {
        configKey: 'xpack.reporting.capture.timeouts.openUrl',
        error: err
      }
    }));
  }

  endTrace();
};

exports.openUrl = openUrl;