"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.waitForVisualizations = void 0;

var _i18n = require("@kbn/i18n");

var _schema_utils = require("../../../common/schema_utils");

var _ = require("../");

var _constants = require("./constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getCompletedItemsCount = ({
  renderCompleteSelector
}) => {
  return document.querySelectorAll(renderCompleteSelector).length;
};
/*
 * 1. Wait for the visualization metadata to be found in the DOM
 * 2. Read the metadata for the number of visualization items
 * 3. Wait for the render complete event to be fired once for each item
 */


const waitForVisualizations = async (captureConfig, browser, toEqual, layout, logger) => {
  const endTrace = (0, _.startTrace)('wait_for_visualizations', 'wait');
  const {
    renderComplete: renderCompleteSelector
  } = layout.selectors;
  logger.debug(_i18n.i18n.translate('xpack.reporting.screencapture.waitingForRenderedElements', {
    defaultMessage: `waiting for {itemsCount} rendered elements to be in the DOM`,
    values: {
      itemsCount: toEqual
    }
  }));

  try {
    const timeout = (0, _schema_utils.durationToNumber)(captureConfig.timeouts.renderComplete);
    await browser.waitFor({
      fn: getCompletedItemsCount,
      args: [{
        renderCompleteSelector
      }],
      toEqual,
      timeout
    }, {
      context: _constants.CONTEXT_WAITFORELEMENTSTOBEINDOM
    }, logger);
    logger.debug(`found ${toEqual} rendered elements in the DOM`);
  } catch (err) {
    logger.error(err);
    throw new Error(_i18n.i18n.translate('xpack.reporting.screencapture.couldntFinishRendering', {
      defaultMessage: `An error occurred when trying to wait for {count} visualizations to finish rendering. You may need to increase '{configKey}'. {error}`,
      values: {
        count: toEqual,
        configKey: 'xpack.reporting.capture.timeouts.renderComplete',
        error: err
      }
    }));
  }

  endTrace();
};

exports.waitForVisualizations = waitForVisualizations;