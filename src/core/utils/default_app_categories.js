"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULT_APP_CATEGORIES = void 0;

var _i18n = require("@kbn/i18n");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/** @internal */
const DEFAULT_APP_CATEGORIES = Object.freeze({
  kibana: {
    id: 'kibana',
    label: _i18n.i18n.translate('core.ui.kibanaNavList.label', {
      defaultMessage: 'Analytics'
    }),
    euiIconType: 'logoKibana',
    order: 1000
  },
  enterpriseSearch: {
    id: 'enterpriseSearch',
    label: _i18n.i18n.translate('core.ui.enterpriseSearchNavList.label', {
      defaultMessage: 'Enterprise Search'
    }),
    order: 2000,
    euiIconType: 'logoEnterpriseSearch'
  },
  observability: {
    id: 'observability',
    label: _i18n.i18n.translate('core.ui.observabilityNavList.label', {
      defaultMessage: 'Observability'
    }),
    euiIconType: 'logoObservability',
    order: 3000
  },
  security: {
    id: 'securitySolution',
    label: _i18n.i18n.translate('core.ui.securityNavList.label', {
      defaultMessage: 'Security'
    }),
    order: 4000,
    euiIconType: 'logoSecurity'
  },
  management: {
    id: 'management',
    label: _i18n.i18n.translate('core.ui.managementNavList.label', {
      defaultMessage: 'Management'
    }),
    order: 5000,
    euiIconType: 'managementApp'
  }
});
exports.DEFAULT_APP_CATEGORIES = DEFAULT_APP_CATEGORIES;