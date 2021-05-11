"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHighlightRequest = getHighlightRequest;

var _highlight_tags = require("./highlight_tags");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const FRAGMENT_SIZE = Math.pow(2, 31) - 1; // Max allowed value for fragment_size (limit of a java int)

function getHighlightRequest(query, shouldHighlight) {
  if (!shouldHighlight) return;
  return {
    pre_tags: [_highlight_tags.highlightTags.pre],
    post_tags: [_highlight_tags.highlightTags.post],
    fields: {
      '*': {}
    },
    fragment_size: FRAGMENT_SIZE
  };
}