"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ENGINES_PAGE_SIZE = exports.READ_ONLY_MODE_HEADER = exports.JSON_HEADER = exports.LICENSED_SUPPORT_URL = exports.WORKPLACE_SEARCH_PLUGIN = exports.APP_SEARCH_PLUGIN = exports.ENTERPRISE_SEARCH_PLUGIN = void 0;

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const ENTERPRISE_SEARCH_PLUGIN = {
  ID: 'enterpriseSearch',
  NAME: _i18n.i18n.translate('xpack.enterpriseSearch.productName', {
    defaultMessage: 'Enterprise Search'
  }),
  NAV_TITLE: _i18n.i18n.translate('xpack.enterpriseSearch.navTitle', {
    defaultMessage: 'Overview'
  }),
  SUBTITLE: _i18n.i18n.translate('xpack.enterpriseSearch.featureCatalogue.subtitle', {
    defaultMessage: 'Search everything'
  }),
  DESCRIPTION: _i18n.i18n.translate('xpack.enterpriseSearch.FeatureCatalogue.description', {
    defaultMessage: 'Create search experiences with a refined set of APIs and tools.'
  }),
  APP_DESCRIPTIONS: [_i18n.i18n.translate('xpack.enterpriseSearch.featureCatalogueDescription1', {
    defaultMessage: 'Build a powerful search experience.'
  }), _i18n.i18n.translate('xpack.enterpriseSearch.featureCatalogueDescription2', {
    defaultMessage: 'Connect your users to relevant data.'
  }), _i18n.i18n.translate('xpack.enterpriseSearch.featureCatalogueDescription3', {
    defaultMessage: 'Unify your team content.'
  })],
  URL: '/app/enterprise_search/overview',
  LOGO: 'logoEnterpriseSearch'
};
exports.ENTERPRISE_SEARCH_PLUGIN = ENTERPRISE_SEARCH_PLUGIN;
const APP_SEARCH_PLUGIN = {
  ID: 'appSearch',
  NAME: _i18n.i18n.translate('xpack.enterpriseSearch.appSearch.productName', {
    defaultMessage: 'App Search'
  }),
  DESCRIPTION: _i18n.i18n.translate('xpack.enterpriseSearch.appSearch.productDescription', {
    defaultMessage: 'Leverage dashboards, analytics, and APIs for advanced application search made simple.'
  }),
  CARD_DESCRIPTION: _i18n.i18n.translate('xpack.enterpriseSearch.appSearch.productCardDescription', {
    defaultMessage: 'Elastic App Search provides user-friendly tools to design and deploy a powerful search to your websites or web/mobile applications.'
  }),
  URL: '/app/enterprise_search/app_search',
  SUPPORT_URL: 'https://discuss.elastic.co/c/enterprise-search/app-search/'
};
exports.APP_SEARCH_PLUGIN = APP_SEARCH_PLUGIN;
const WORKPLACE_SEARCH_PLUGIN = {
  ID: 'workplaceSearch',
  NAME: _i18n.i18n.translate('xpack.enterpriseSearch.workplaceSearch.productName', {
    defaultMessage: 'Workplace Search'
  }),
  DESCRIPTION: _i18n.i18n.translate('xpack.enterpriseSearch.workplaceSearch.productDescription', {
    defaultMessage: 'Search all documents, files, and sources available across your virtual workplace.'
  }),
  CARD_DESCRIPTION: _i18n.i18n.translate('xpack.enterpriseSearch.workplaceSearch.productCardDescription', {
    defaultMessage: "Unify all your team's content in one place, with instant connectivity to popular productivity and collaboration tools."
  }),
  URL: '/app/enterprise_search/workplace_search',
  SUPPORT_URL: 'https://discuss.elastic.co/c/enterprise-search/workplace-search/'
};
exports.WORKPLACE_SEARCH_PLUGIN = WORKPLACE_SEARCH_PLUGIN;
const LICENSED_SUPPORT_URL = 'https://support.elastic.co';
exports.LICENSED_SUPPORT_URL = LICENSED_SUPPORT_URL;
const JSON_HEADER = {
  'Content-Type': 'application/json',
  // This needs specific casing or Chrome throws a 415 error
  Accept: 'application/json' // Required for Enterprise Search APIs

};
exports.JSON_HEADER = JSON_HEADER;
const READ_ONLY_MODE_HEADER = 'x-ent-search-read-only-mode';
exports.READ_ONLY_MODE_HEADER = READ_ONLY_MODE_HEADER;
const ENGINES_PAGE_SIZE = 10;
exports.ENGINES_PAGE_SIZE = ENGINES_PAGE_SIZE;