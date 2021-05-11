"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNumberOfItems = void 0;

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


const getNumberOfItems = async (captureConfig, browser, layout, logger) => {
  const endTrace = (0, _.startTrace)('get_number_of_items', 'read');
  const {
    renderComplete: renderCompleteSelector,
    itemsCountAttribute
  } = layout.selectors;
  let itemsCount;
  logger.debug(_i18n.i18n.translate('xpack.reporting.screencapture.logWaitingForElements', {
    defaultMessage: 'waiting for elements or items count attribute; or not found to interrupt'
  }));

  try {
    // the dashboard is using the `itemsCountAttribute` attribute to let us
    // know how many items to expect since gridster incrementally adds panels
    // we have to use this hint to wait for all of them
    const timeout = (0, _schema_utils.durationToNumber)(captureConfig.timeouts.waitForElements);
    await browser.waitForSelector(`${renderCompleteSelector},[${itemsCountAttribute}]`, {
      timeout
    }, {
      context: _constants.CONTEXT_READMETADATA
    }, logger); // returns the value of the `itemsCountAttribute` if it's there, otherwise
    // we just count the number of `itemSelector`: the number of items already rendered

    itemsCount = await browser.evaluate({
      fn: (selector, countAttribute) => {
        const elementWithCount = document.querySelector(`[${countAttribute}]`);

        if (elementWithCount && elementWithCount != null) {
          const count = elementWithCount.getAttribute(countAttribute);

          if (count && count != null) {
            return parseInt(count, 10);
          }
        }

        return document.querySelectorAll(selector).length;
      },
      args: [renderCompleteSelector, itemsCountAttribute]
    }, {
      context: _constants.CONTEXT_GETNUMBEROFITEMS
    }, logger);
  } catch (err) {
    logger.error(err);
    throw new Error(_i18n.i18n.translate('xpack.reporting.screencapture.readVisualizationsError', {
      defaultMessage: `An error occurred when trying to read the page for visualization panel info. You may need to increase '{configKey}'. {error}`,
      values: {
        error: err,
        configKey: 'xpack.reporting.capture.timeouts.waitForElements'
      }
    }));
  }

  endTrace();
  return itemsCount;
};

exports.getNumberOfItems = getNumberOfItems;