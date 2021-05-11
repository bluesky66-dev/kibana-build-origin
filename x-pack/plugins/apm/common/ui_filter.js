"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filtersByName = void 0;

var _i18n = require("@kbn/i18n");

var _elasticsearch_fieldnames = require("./elasticsearch_fieldnames");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const filtersByName = {
  host: {
    title: _i18n.i18n.translate('xpack.apm.localFilters.titles.host', {
      defaultMessage: 'Host'
    }),
    fieldName: _elasticsearch_fieldnames.HOST_NAME
  },
  agentName: {
    title: _i18n.i18n.translate('xpack.apm.localFilters.titles.agentName', {
      defaultMessage: 'Agent name'
    }),
    fieldName: _elasticsearch_fieldnames.AGENT_NAME
  },
  containerId: {
    title: _i18n.i18n.translate('xpack.apm.localFilters.titles.containerId', {
      defaultMessage: 'Container ID'
    }),
    fieldName: _elasticsearch_fieldnames.CONTAINER_ID
  },
  podName: {
    title: _i18n.i18n.translate('xpack.apm.localFilters.titles.podName', {
      defaultMessage: 'Kubernetes pod'
    }),
    fieldName: _elasticsearch_fieldnames.POD_NAME
  },
  transactionResult: {
    title: _i18n.i18n.translate('xpack.apm.localFilters.titles.transactionResult', {
      defaultMessage: 'Transaction result'
    }),
    fieldName: _elasticsearch_fieldnames.TRANSACTION_RESULT
  },
  serviceVersion: {
    title: _i18n.i18n.translate('xpack.apm.localFilters.titles.serviceVersion', {
      defaultMessage: 'Service version'
    }),
    fieldName: _elasticsearch_fieldnames.SERVICE_VERSION
  },
  transactionUrl: {
    title: _i18n.i18n.translate('xpack.apm.localFilters.titles.transactionUrl', {
      defaultMessage: 'Url'
    }),
    fieldName: _elasticsearch_fieldnames.TRANSACTION_URL
  },
  browser: {
    title: _i18n.i18n.translate('xpack.apm.localFilters.titles.browser', {
      defaultMessage: 'Browser'
    }),
    fieldName: _elasticsearch_fieldnames.USER_AGENT_NAME
  },
  device: {
    title: _i18n.i18n.translate('xpack.apm.localFilters.titles.device', {
      defaultMessage: 'Device'
    }),
    fieldName: _elasticsearch_fieldnames.USER_AGENT_DEVICE
  },
  location: {
    title: _i18n.i18n.translate('xpack.apm.localFilters.titles.location', {
      defaultMessage: 'Location'
    }),
    fieldName: _elasticsearch_fieldnames.CLIENT_GEO_COUNTRY_ISO_CODE
  },
  os: {
    title: _i18n.i18n.translate('xpack.apm.localFilters.titles.os', {
      defaultMessage: 'OS'
    }),
    fieldName: _elasticsearch_fieldnames.USER_AGENT_OS
  },
  serviceName: {
    title: _i18n.i18n.translate('xpack.apm.localFilters.titles.serviceName', {
      defaultMessage: 'Service name'
    }),
    fieldName: _elasticsearch_fieldnames.SERVICE_NAME
  }
};
exports.filtersByName = filtersByName;