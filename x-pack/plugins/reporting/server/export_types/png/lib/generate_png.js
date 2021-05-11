"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generatePngObservableFactory = generatePngObservableFactory;

var _elasticApmNode = _interopRequireDefault(require("elastic-apm-node"));

var _operators = require("rxjs/operators");

var _layouts = require("../../../lib/layouts");

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


async function generatePngObservableFactory(reporting) {
  const getScreenshots = await reporting.getScreenshotsObservable();
  return function generatePngObservable(logger, url, browserTimezone, conditionalHeaders, layoutParams) {
    const apmTrans = _elasticApmNode.default.startTransaction('reporting generate_png', 'reporting');

    const apmLayout = apmTrans === null || apmTrans === void 0 ? void 0 : apmTrans.startSpan('create_layout', 'setup');

    if (!layoutParams || !layoutParams.dimensions) {
      throw new Error(`LayoutParams.Dimensions is undefined.`);
    }

    const layout = new _layouts.PreserveLayout(layoutParams.dimensions, layoutParams.selectors);
    if (apmLayout) apmLayout.end();
    const apmScreenshots = apmTrans === null || apmTrans === void 0 ? void 0 : apmTrans.startSpan('screenshots_pipeline', 'setup');
    const screenshots$ = getScreenshots({
      logger,
      urls: [url],
      conditionalHeaders,
      layout,
      browserTimezone
    }).pipe((0, _operators.map)(results => {
      if (apmScreenshots) apmScreenshots.end();
      if (apmTrans) apmTrans.end();
      return {
        base64: results[0].screenshots[0].base64EncodedData,
        warnings: results.reduce((found, current) => {
          if (current.error) {
            found.push(current.error.message);
          }

          return found;
        }, [])
      };
    }));
    return screenshots$;
  };
}