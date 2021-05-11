"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AlertsFactory = void 0;

var _ = require("./");

var _constants = require("../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const BY_TYPE = {
  [_constants.ALERT_CLUSTER_HEALTH]: _.ClusterHealthAlert,
  [_constants.ALERT_LICENSE_EXPIRATION]: _.LicenseExpirationAlert,
  [_constants.ALERT_CPU_USAGE]: _.CpuUsageAlert,
  [_constants.ALERT_MISSING_MONITORING_DATA]: _.MissingMonitoringDataAlert,
  [_constants.ALERT_DISK_USAGE]: _.DiskUsageAlert,
  [_constants.ALERT_THREAD_POOL_SEARCH_REJECTIONS]: _.ThreadPoolSearchRejectionsAlert,
  [_constants.ALERT_THREAD_POOL_WRITE_REJECTIONS]: _.ThreadPoolWriteRejectionsAlert,
  [_constants.ALERT_MEMORY_USAGE]: _.MemoryUsageAlert,
  [_constants.ALERT_NODES_CHANGED]: _.NodesChangedAlert,
  [_constants.ALERT_LOGSTASH_VERSION_MISMATCH]: _.LogstashVersionMismatchAlert,
  [_constants.ALERT_KIBANA_VERSION_MISMATCH]: _.KibanaVersionMismatchAlert,
  [_constants.ALERT_ELASTICSEARCH_VERSION_MISMATCH]: _.ElasticsearchVersionMismatchAlert,
  [_constants.ALERT_CCR_READ_EXCEPTIONS]: _.CCRReadExceptionsAlert,
  [_constants.ALERT_LARGE_SHARD_SIZE]: _.LargeShardSizeAlert
};

class AlertsFactory {
  static async getByType(type, alertsClient) {
    var _alertClientAlerts$da;

    const alertCls = BY_TYPE[type];

    if (!alertCls || !alertsClient) {
      return;
    }

    const alertClientAlerts = await alertsClient.find({
      options: {
        filter: `alert.attributes.alertTypeId:${type}`
      }
    });

    if (!alertClientAlerts.total || !((_alertClientAlerts$da = alertClientAlerts.data) !== null && _alertClientAlerts$da !== void 0 && _alertClientAlerts$da.length)) {
      return;
    }

    const [rawAlert] = alertClientAlerts.data;
    return new alertCls(rawAlert);
  }

  static getAll() {
    return Object.values(BY_TYPE).map(alert => new alert());
  }

}

exports.AlertsFactory = AlertsFactory;