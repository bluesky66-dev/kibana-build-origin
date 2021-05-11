"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SNAPSHOT_METRIC_TRANSLATIONS = exports.fieldToName = void 0;

var _i18n = require("@kbn/i18n");

var _snapshot_metric_i18n = require("../snapshot_metric_i18n");

var _types = require("./types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const fieldToName = field => {
  const LOOKUP = {
    'kubernetes.namespace': _i18n.i18n.translate('xpack.infra.groupByDisplayNames.kubernetesNamespace', {
      defaultMessage: 'Namespace'
    }),
    'kubernetes.node.name': _i18n.i18n.translate('xpack.infra.groupByDisplayNames.kubernetesNodeName', {
      defaultMessage: 'Node'
    }),
    'host.name': _i18n.i18n.translate('xpack.infra.groupByDisplayNames.hostName', {
      defaultMessage: 'Host'
    }),
    'cloud.availability_zone': _i18n.i18n.translate('xpack.infra.groupByDisplayNames.availabilityZone', {
      defaultMessage: 'Availability zone'
    }),
    'cloud.machine.type': _i18n.i18n.translate('xpack.infra.groupByDisplayNames.machineType', {
      defaultMessage: 'Machine type'
    }),
    'cloud.project.id': _i18n.i18n.translate('xpack.infra.groupByDisplayNames.projectID', {
      defaultMessage: 'Project ID'
    }),
    'cloud.provider': _i18n.i18n.translate('xpack.infra.groupByDisplayNames.provider', {
      defaultMessage: 'Cloud provider'
    }),
    'service.type': _i18n.i18n.translate('xpack.infra.groupByDisplayNames.serviceType', {
      defaultMessage: 'Service type'
    })
  };
  return LOOKUP[field] || field;
};

exports.fieldToName = fieldToName;
const snapshotTypeKeys = Object.keys(_types.SnapshotMetricTypeKeys);
const SNAPSHOT_METRIC_TRANSLATIONS = snapshotTypeKeys.reduce((result, metric) => {
  var _toMetricOpt;

  const text = (_toMetricOpt = (0, _snapshot_metric_i18n.toMetricOpt)(metric)) === null || _toMetricOpt === void 0 ? void 0 : _toMetricOpt.text;
  if (text) return { ...result,
    [metric]: text
  };
  return result;
}, {});
exports.SNAPSHOT_METRIC_TRANSLATIONS = SNAPSHOT_METRIC_TRANSLATIONS;