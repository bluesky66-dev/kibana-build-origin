"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.htmlTags = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
// These are the html tags that will replace the highlight tags.
const htmlTags = {
  pre: '<mark>',
  post: '</mark>'
};
exports.htmlTags = htmlTags;