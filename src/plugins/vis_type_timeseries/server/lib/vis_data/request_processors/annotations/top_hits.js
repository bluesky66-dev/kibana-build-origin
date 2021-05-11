"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.topHits = topHits;

var _helpers = require("../../helpers");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function topHits(req, panel, annotation) {
  return next => doc => {
    const fields = annotation.fields && annotation.fields.split(/[,\s]+/) || [];
    const timeField = annotation.time_field;
    (0, _helpers.overwrite)(doc, `aggs.${annotation.id}.aggs.hits.top_hits`, {
      sort: [{
        [timeField]: {
          order: 'desc'
        }
      }],
      _source: {
        includes: [...fields, timeField]
      },
      size: 5
    });
    return next(doc);
  };
}