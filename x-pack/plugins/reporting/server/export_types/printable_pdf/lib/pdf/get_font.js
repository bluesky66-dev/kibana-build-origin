"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFont = getFont;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function getFont(text) {
  // We are matching Han characters which is one of the supported unicode scripts
  // (you can see the full list of supported scripts here: http://www.unicode.org/standard/supported.html).
  // This will match Chinese, Japanese, Korean and some other Asian languages.
  const isCKJ = /\p{Script=Han}/gu.test(text);

  if (isCKJ) {
    return 'noto-cjk';
  } else {
    return 'Roboto';
  }
}