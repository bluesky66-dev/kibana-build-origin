"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nodeTypeLabel = exports.nodeTypeClass = void 0;

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * Note: currently only `node` and `master` are supported due to
 * https://github.com/elastic/x-pack-kibana/issues/608
 */


const nodeTypeClass = {
  invalid: 'alert',
  node: 'storage',
  master: 'starFilled',
  master_only: 'starEmpty',
  data: 'database',
  client: 'glasses'
};
exports.nodeTypeClass = nodeTypeClass;
const nodeTypeLabel = {
  invalid: _i18n.i18n.translate('xpack.monitoring.es.nodeType.invalidNodeLabel', {
    defaultMessage: 'Invalid Node'
  }),
  node: _i18n.i18n.translate('xpack.monitoring.es.nodeType.nodeLabel', {
    defaultMessage: 'Node'
  }),
  master: _i18n.i18n.translate('xpack.monitoring.es.nodeType.masterNodeLabel', {
    defaultMessage: 'Master Node'
  }),
  master_only: _i18n.i18n.translate('xpack.monitoring.es.nodeType.masterOnlyNodeLabel', {
    defaultMessage: 'Master Only Node'
  }),
  data: _i18n.i18n.translate('xpack.monitoring.es.nodeType.dataOnlyNodeLabel', {
    defaultMessage: 'Data Only Node'
  }),
  client: _i18n.i18n.translate('xpack.monitoring.es.nodeType.clientNodeLabel', {
    defaultMessage: 'Client Node'
  })
};
exports.nodeTypeLabel = nodeTypeLabel;