"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initTranslations = void 0;

var _i18n = require("@kbn/i18n");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const initTranslations = async (locale, translationFiles) => {
  _i18n.i18nLoader.registerTranslationFiles(translationFiles);

  const translations = await _i18n.i18nLoader.getTranslationsByLocale(locale);

  _i18n.i18n.init(Object.freeze({
    locale,
    ...translations
  }));
};

exports.initTranslations = initTranslations;