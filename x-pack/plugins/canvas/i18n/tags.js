"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TagStrings = void 0;

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const TagStrings = {
  presentation: () => _i18n.i18n.translate('xpack.canvas.tags.presentationTag', {
    defaultMessage: 'presentation'
  }),
  report: () => _i18n.i18n.translate('xpack.canvas.tags.reportTag', {
    defaultMessage: 'report'
  })
};
exports.TagStrings = TagStrings;