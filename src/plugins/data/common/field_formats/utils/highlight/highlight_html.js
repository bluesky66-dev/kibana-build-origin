"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHighlightHtml = getHighlightHtml;

var _lodash = _interopRequireDefault(require("lodash"));

var _highlight_tags = require("./highlight_tags");

var _html_tags = require("./html_tags");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function getHighlightHtml(fieldValue, highlights) {
  let highlightHtml = typeof fieldValue === 'object' ? JSON.stringify(fieldValue) : fieldValue;

  _lodash.default.each(highlights, function (highlight) {
    const escapedHighlight = _lodash.default.escape(highlight); // Strip out the highlight tags to compare against the field text


    const untaggedHighlight = escapedHighlight.split(_highlight_tags.highlightTags.pre).join('').split(_highlight_tags.highlightTags.post).join(''); // Replace all highlight tags with proper html tags

    const taggedHighlight = escapedHighlight.split(_highlight_tags.highlightTags.pre).join(_html_tags.htmlTags.pre).split(_highlight_tags.highlightTags.post).join(_html_tags.htmlTags.post); // Replace all instances of the untagged string with the properly tagged string

    highlightHtml = highlightHtml.split(untaggedHighlight).join(taggedHighlight);
  });

  return highlightHtml;
}