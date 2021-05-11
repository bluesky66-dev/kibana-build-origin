"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generatePdfObservableFactory = generatePdfObservableFactory;

var _lodash = require("lodash");

var _operators = require("rxjs/operators");

var _layouts = require("../../../lib/layouts");

var _pdf = require("./pdf");

var _tracker = require("./tracker");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getTimeRange = urlScreenshots => {
  const grouped = (0, _lodash.groupBy)(urlScreenshots.map(u => u.timeRange));
  const values = Object.values(grouped);

  if (values.length === 1) {
    return values[0][0];
  }

  return null;
};

async function generatePdfObservableFactory(reporting) {
  const config = reporting.getConfig();
  const captureConfig = config.get('capture');
  const getScreenshots = await reporting.getScreenshotsObservable();
  return function generatePdfObservable(logger, title, urls, browserTimezone, conditionalHeaders, layoutParams, logo) {
    const tracker = (0, _tracker.getTracker)();
    tracker.startLayout();
    const layout = (0, _layouts.createLayout)(captureConfig, layoutParams);
    logger.debug(`Layout: width=${layout.width} height=${layout.height}`);
    tracker.endLayout();
    tracker.startScreenshots();
    const screenshots$ = getScreenshots({
      logger,
      urls,
      conditionalHeaders,
      layout,
      browserTimezone
    }).pipe((0, _operators.mergeMap)(async results => {
      tracker.endScreenshots();
      tracker.startSetup();
      const pdfOutput = new _pdf.PdfMaker(layout, logo);

      if (title) {
        const timeRange = getTimeRange(results);
        title += timeRange ? ` - ${timeRange}` : '';
        pdfOutput.setTitle(title);
      }

      tracker.endSetup();
      results.forEach(r => {
        r.screenshots.forEach(screenshot => {
          var _screenshot$base64Enc;

          logger.debug(`Adding image to PDF. Image base64 size: ${((_screenshot$base64Enc = screenshot.base64EncodedData) === null || _screenshot$base64Enc === void 0 ? void 0 : _screenshot$base64Enc.length) || 0}`); // prettier-ignore

          tracker.startAddImage();
          tracker.endAddImage();
          pdfOutput.addImage(screenshot.base64EncodedData, {
            title: screenshot.title,
            description: screenshot.description
          });
        });
      });
      let buffer = null;

      try {
        var _buffer;

        tracker.startCompile();
        logger.debug(`Compiling PDF using "${layout.id}" layout...`);
        pdfOutput.generate();
        tracker.endCompile();
        tracker.startGetBuffer();
        logger.debug(`Generating PDF Buffer...`);
        buffer = await pdfOutput.getBuffer();
        logger.debug(`PDF buffer byte length: ${((_buffer = buffer) === null || _buffer === void 0 ? void 0 : _buffer.byteLength) || 0}`);
        tracker.endGetBuffer();
      } catch (err) {
        logger.error(`Could not generate the PDF buffer!`);
        logger.error(err);
      }

      tracker.end();
      return {
        buffer,
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