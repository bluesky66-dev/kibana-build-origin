"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.screenshotsObservableFactory = screenshotsObservableFactory;

var _elasticApmNode = _interopRequireDefault(require("elastic-apm-node"));

var Rx = _interopRequireWildcard(require("rxjs"));

var _operators = require("rxjs/operators");

var _check_browser_open = require("./check_browser_open");

var _constants = require("./constants");

var _get_element_position_data = require("./get_element_position_data");

var _get_number_of_items = require("./get_number_of_items");

var _get_screenshots = require("./get_screenshots");

var _get_time_range = require("./get_time_range");

var _inject_css = require("./inject_css");

var _open_url = require("./open_url");

var _wait_for_render = require("./wait_for_render");

var _wait_for_visualizations = require("./wait_for_visualizations");

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();

  _getRequireWildcardCache = function () {
    return cache;
  };

  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache();

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}

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


const DEFAULT_SCREENSHOT_CLIP_HEIGHT = 1200;
const DEFAULT_SCREENSHOT_CLIP_WIDTH = 1800;

function screenshotsObservableFactory(captureConfig, browserDriverFactory) {
  return function screenshotsObservable({
    logger,
    urls,
    conditionalHeaders,
    layout,
    browserTimezone
  }) {
    const apmTrans = _elasticApmNode.default.startTransaction(`reporting screenshot pipeline`, 'reporting');

    const apmCreatePage = apmTrans === null || apmTrans === void 0 ? void 0 : apmTrans.startSpan('create_page', 'wait');
    const create$ = browserDriverFactory.createPage({
      viewport: layout.getBrowserViewport(),
      browserTimezone
    }, logger);
    return create$.pipe((0, _operators.mergeMap)(({
      driver,
      exit$
    }) => {
      if (apmCreatePage) apmCreatePage.end();
      return Rx.from(urls).pipe((0, _operators.concatMap)((url, index) => {
        const setup$ = Rx.of(1).pipe((0, _operators.mergeMap)(() => {
          // If we're moving to another page in the app, we'll want to wait for the app to tell us
          // it's loaded the next page.
          const page = index + 1;
          const pageLoadSelector = page > 1 ? `[data-shared-page="${page}"]` : _constants.DEFAULT_PAGELOAD_SELECTOR;
          return (0, _open_url.openUrl)(captureConfig, driver, url, pageLoadSelector, conditionalHeaders, logger);
        }), (0, _operators.mergeMap)(() => (0, _get_number_of_items.getNumberOfItems)(captureConfig, driver, layout, logger)), (0, _operators.mergeMap)(async itemsCount => {
          // set the viewport to the dimentions from the job, to allow elements to flow into the expected layout
          const viewport = layout.getViewport(itemsCount) || getDefaultViewPort();
          await Promise.all([driver.setViewport(viewport, logger), (0, _wait_for_visualizations.waitForVisualizations)(captureConfig, driver, itemsCount, layout, logger)]);
        }), (0, _operators.mergeMap)(async () => {
          // Waiting till _after_ elements have rendered before injecting our CSS
          // allows for them to be displayed properly in many cases
          await (0, _inject_css.injectCustomCss)(driver, layout, logger);
          const apmPositionElements = apmTrans === null || apmTrans === void 0 ? void 0 : apmTrans.startSpan('position_elements', 'correction');

          if (layout.positionElements) {
            // position panel elements for print layout
            await layout.positionElements(driver, logger);
          }

          if (apmPositionElements) apmPositionElements.end();
          await (0, _wait_for_render.waitForRenderComplete)(captureConfig, driver, layout, logger);
        }), (0, _operators.mergeMap)(async () => {
          return await Promise.all([(0, _get_time_range.getTimeRange)(driver, layout, logger), (0, _get_element_position_data.getElementPositionAndAttributes)(driver, layout, logger)]).then(([timeRange, elementsPositionAndAttributes]) => ({
            elementsPositionAndAttributes,
            timeRange
          }));
        }), (0, _operators.catchError)(err => {
          (0, _check_browser_open.checkPageIsOpen)(driver); // if browser has closed, throw a relevant error about it

          logger.error(err);
          return Rx.of({
            elementsPositionAndAttributes: null,
            timeRange: null,
            error: err
          });
        }));
        return setup$.pipe((0, _operators.takeUntil)(exit$), (0, _operators.mergeMap)(async data => {
          (0, _check_browser_open.checkPageIsOpen)(driver); // re-check that the browser has not closed

          const elements = data.elementsPositionAndAttributes ? data.elementsPositionAndAttributes : getDefaultElementPosition(layout.getViewport(1));
          const screenshots = await (0, _get_screenshots.getScreenshots)(driver, layout, elements, logger);
          const {
            timeRange,
            error: setupError
          } = data;
          return {
            timeRange,
            screenshots,
            error: setupError,
            elementsPositionAndAttributes: elements
          };
        }));
      }), (0, _operators.take)(urls.length), (0, _operators.toArray)());
    }), (0, _operators.first)(), (0, _operators.tap)(() => {
      if (apmTrans) apmTrans.end();
    }));
  };
}
/*
 * If Kibana is showing a non-HTML error message, the viewport might not be
 * provided by the browser.
 */


const getDefaultViewPort = () => ({
  height: DEFAULT_SCREENSHOT_CLIP_HEIGHT,
  width: DEFAULT_SCREENSHOT_CLIP_WIDTH,
  zoom: 1
});
/*
 * If an error happens setting up the page, we don't know if there actually
 * are any visualizations showing. These defaults should help capture the page
 * enough for the user to see the error themselves
 */


const getDefaultElementPosition = dimensions => {
  const height = (dimensions === null || dimensions === void 0 ? void 0 : dimensions.height) || DEFAULT_SCREENSHOT_CLIP_HEIGHT;
  const width = (dimensions === null || dimensions === void 0 ? void 0 : dimensions.width) || DEFAULT_SCREENSHOT_CLIP_WIDTH;
  const defaultObject = {
    position: {
      boundingClientRect: {
        top: 0,
        left: 0,
        height,
        width
      },
      scroll: {
        x: 0,
        y: 0
      }
    },
    attributes: {}
  };
  return [defaultObject];
};