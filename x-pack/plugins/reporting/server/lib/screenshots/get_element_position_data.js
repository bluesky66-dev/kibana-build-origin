"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getElementPositionAndAttributes = void 0;

var _i18n = require("@kbn/i18n");

var _ = require("../");

var _constants = require("./constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getElementPositionAndAttributes = async (browser, layout, logger) => {
  const endTrace = (0, _.startTrace)('get_element_position_data', 'read');
  const {
    screenshot: screenshotSelector
  } = layout.selectors; // data-shared-items-container

  let elementsPositionAndAttributes;

  try {
    elementsPositionAndAttributes = await browser.evaluate({
      fn: (selector, attributes) => {
        const elements = document.querySelectorAll(selector); // NodeList isn't an array, just an iterator, unable to use .map/.forEach

        const results = [];

        for (let i = 0; i < elements.length; i++) {
          const element = elements[i];
          const boundingClientRect = element.getBoundingClientRect();
          results.push({
            position: {
              boundingClientRect: {
                // modern browsers support x/y, but older ones don't
                top: boundingClientRect.y || boundingClientRect.top,
                left: boundingClientRect.x || boundingClientRect.left,
                width: boundingClientRect.width,
                height: boundingClientRect.height
              },
              scroll: {
                x: window.scrollX,
                y: window.scrollY
              }
            },
            attributes: Object.keys(attributes).reduce((result, key) => {
              const attribute = attributes[key];
              result[key] = element.getAttribute(attribute);
              return result;
            }, {})
          });
        }

        return results;
      },
      args: [screenshotSelector, {
        title: 'data-title',
        description: 'data-description'
      }]
    }, {
      context: _constants.CONTEXT_ELEMENTATTRIBUTES
    }, logger);

    if (!elementsPositionAndAttributes || elementsPositionAndAttributes.length === 0) {
      throw new Error(_i18n.i18n.translate('xpack.reporting.screencapture.noElements', {
        defaultMessage: `An error occurred while reading the page for visualization panels: no panels were found.`
      }));
    }
  } catch (err) {
    elementsPositionAndAttributes = null;
  }

  endTrace();
  return elementsPositionAndAttributes;
};

exports.getElementPositionAndAttributes = getElementPositionAndAttributes;