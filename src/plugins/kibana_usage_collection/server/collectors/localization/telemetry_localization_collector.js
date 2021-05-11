"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTranslationCount = getTranslationCount;
exports.createCollectorFetch = createCollectorFetch;
exports.registerLocalizationUsageCollector = registerLocalizationUsageCollector;

var _i18n = require("@kbn/i18n");

var _lodash = require("lodash");

var _file_integrity = require("./file_integrity");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
async function getTranslationCount(loader, locale) {
  const translations = await loader.getTranslationsByLocale(locale);
  return (0, _lodash.size)(translations.messages);
}

function createCollectorFetch({
  getLocale,
  getTranslationFiles
}) {
  return async function fetchUsageStats() {
    const locale = getLocale();
    const translationFilePaths = getTranslationFiles();
    const [labelsCount, integrities] = await Promise.all([getTranslationCount(_i18n.i18nLoader, locale), (0, _file_integrity.getIntegrityHashes)(translationFilePaths)]);
    return {
      locale,
      integrities,
      labelsCount
    };
  };
}

function registerLocalizationUsageCollector(usageCollection, i18n) {
  const collector = usageCollection.makeUsageCollector({
    type: 'localization',
    isReady: () => true,
    fetch: createCollectorFetch(i18n),
    schema: {
      locale: {
        type: 'keyword'
      },
      integrities: {
        DYNAMIC_KEY: {
          type: 'text'
        }
      },
      labelsCount: {
        type: 'long'
      }
    }
  });
  usageCollection.registerCollector(collector);
}