"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createHitIterator = createHitIterator;

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function parseResponse(request) {
  const response = request;

  if (!response || !response._scroll_id) {
    throw new Error(_i18n.i18n.translate('xpack.reporting.exportTypes.csv.hitIterator.expectedScrollIdErrorMessage', {
      defaultMessage: 'Expected {scrollId} in the following Elasticsearch response: {response}',
      values: {
        response: JSON.stringify(response),
        scrollId: '_scroll_id'
      }
    }));
  }

  if (!response.hits) {
    throw new Error(_i18n.i18n.translate('xpack.reporting.exportTypes.csv.hitIterator.expectedHitsErrorMessage', {
      defaultMessage: 'Expected {hits} in the following Elasticsearch response: {response}',
      values: {
        response: JSON.stringify(response),
        hits: 'hits'
      }
    }));
  }

  return {
    scrollId: response._scroll_id,
    hits: response.hits.hits
  };
}

function createHitIterator(logger) {
  return async function* hitIterator(scrollSettings, callEndpoint, searchRequest, cancellationToken) {
    logger.debug('executing search request');

    async function search(index, body) {
      return parseResponse(await callEndpoint('search', {
        ignore_unavailable: true,
        // ignores if the index pattern contains any aliases that point to closed indices
        index,
        body,
        scroll: scrollSettings.duration,
        size: scrollSettings.size
      }));
    }

    async function scroll(scrollId) {
      logger.debug('executing scroll request');
      return parseResponse(await callEndpoint('scroll', {
        scrollId,
        scroll: scrollSettings.duration
      }));
    }

    async function clearScroll(scrollId) {
      logger.debug('executing clearScroll request');

      try {
        await callEndpoint('clearScroll', {
          scrollId: [scrollId]
        });
      } catch (err) {
        // Do not throw the error, as the job can still be completed successfully
        logger.warn('Scroll context can not be cleared!');
        logger.error(err);
      }
    }

    try {
      let {
        scrollId,
        hits
      } = await search(searchRequest.index, searchRequest.body);

      try {
        while (hits && hits.length && !cancellationToken.isCancelled()) {
          for (const hit of hits) {
            yield hit;
          }

          ({
            scrollId,
            hits
          } = await scroll(scrollId));

          if (cancellationToken.isCancelled()) {
            logger.warn('Any remaining scrolling searches have been cancelled by the cancellation token.');
          }
        }
      } finally {
        await clearScroll(scrollId);
      }
    } catch (err) {
      logger.error(err);
      throw err;
    }
  };
}