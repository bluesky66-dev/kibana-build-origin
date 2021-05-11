"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchAllFromScroll = fetchAllFromScroll;

var _lodash = require("lodash");

var _constants = require("../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function fetchAllFromScroll(searchResuls, dataClient, hits = []) {
  const newHits = (0, _lodash.get)(searchResuls, 'hits.hits', []);
  const scrollId = (0, _lodash.get)(searchResuls, '_scroll_id');

  if (newHits.length > 0) {
    hits.push(...newHits);
    return dataClient.callAsCurrentUser('scroll', {
      body: {
        scroll: _constants.ES_SCROLL_SETTINGS.KEEPALIVE,
        scroll_id: scrollId
      }
    }).then(innerResponse => {
      return fetchAllFromScroll(innerResponse, dataClient, hits);
    });
  }

  return Promise.resolve(hits);
}