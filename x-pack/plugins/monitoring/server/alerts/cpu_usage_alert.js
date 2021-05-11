"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CpuUsageAlert = void 0;

var _i18n = require("@kbn/i18n");

var _numeral = _interopRequireDefault(require("@elastic/numeral"));

var _base_alert = require("./base_alert");

var _constants = require("../../common/constants");

var _formatting = require("../../common/formatting");

var _fetch_cpu_usage_node_stats = require("../lib/alerts/fetch_cpu_usage_node_stats");

var _get_ccs_index_pattern = require("../lib/alerts/get_ccs_index_pattern");

var _enums = require("../../common/enums");

var _parse_duration = require("../../../alerts/common/parse_duration");

var _alert_helpers = require("./alert_helpers");

var _append_mb_index = require("../lib/alerts/append_mb_index");

var _static_globals = require("../static_globals");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-ignore


class CpuUsageAlert extends _base_alert.BaseAlert {
  constructor(rawAlert) {
    super(rawAlert, {
      id: _constants.ALERT_CPU_USAGE,
      name: _constants.ALERT_DETAILS[_constants.ALERT_CPU_USAGE].label,
      accessorKey: 'cpuUsage',
      defaultParams: {
        threshold: 85,
        duration: '5m'
      },
      actionVariables: [{
        name: 'nodes',
        description: _i18n.i18n.translate('xpack.monitoring.alerts.cpuUsage.actionVariables.nodes', {
          defaultMessage: 'The list of nodes reporting high cpu usage.'
        })
      }, {
        name: 'count',
        description: _i18n.i18n.translate('xpack.monitoring.alerts.cpuUsage.actionVariables.count', {
          defaultMessage: 'The number of nodes reporting high cpu usage.'
        })
      }, ...Object.values(_alert_helpers.AlertingDefaults.ALERT_TYPE.context)]
    });
    this.rawAlert = rawAlert;
  }

  async fetchData(params, callCluster, clusters, availableCcs) {
    let esIndexPattern = (0, _append_mb_index.appendMetricbeatIndex)(_static_globals.Globals.app.config, _constants.INDEX_PATTERN_ELASTICSEARCH);

    if (availableCcs) {
      esIndexPattern = (0, _get_ccs_index_pattern.getCcsIndexPattern)(esIndexPattern, availableCcs);
    }

    const duration = (0, _parse_duration.parseDuration)(params.duration);
    const endMs = +new Date();
    const startMs = endMs - duration;
    const stats = await (0, _fetch_cpu_usage_node_stats.fetchCpuUsageNodeStats)(callCluster, clusters, esIndexPattern, startMs, endMs, _static_globals.Globals.app.config.ui.max_bucket_size);
    return stats.map(stat => {
      if (_static_globals.Globals.app.config.ui.container.elasticsearch.enabled) {
        stat.cpuUsage = stat.containerUsage / (stat.containerPeriods * stat.containerQuota * 1000) * 100;
      }

      return {
        clusterUuid: stat.clusterUuid,
        shouldFire: stat.cpuUsage > params.threshold,
        severity: _enums.AlertSeverity.Danger,
        meta: stat,
        ccs: stat.ccs
      };
    });
  }

  filterAlertInstance(alertInstance, filters) {
    return super.filterAlertInstance(alertInstance, filters, true);
  }

  getDefaultAlertState(cluster, item) {
    const base = super.getDefaultAlertState(cluster, item);
    return { ...base,
      ui: { ...base.ui,
        severity: _enums.AlertSeverity.Danger
      }
    };
  }

  getUiMessage(alertState, item) {
    const stat = item.meta;
    return {
      text: _i18n.i18n.translate('xpack.monitoring.alerts.cpuUsage.ui.firingMessage', {
        defaultMessage: `Node #start_link{nodeName}#end_link is reporting cpu usage of {cpuUsage}% at #absolute`,
        values: {
          nodeName: stat.nodeName,
          cpuUsage: (0, _numeral.default)(stat.cpuUsage).format(_formatting.ROUNDED_FLOAT)
        }
      }),
      nextSteps: [(0, _alert_helpers.createLink)(_i18n.i18n.translate('xpack.monitoring.alerts.cpuUsage.ui.nextSteps.hotThreads', {
        defaultMessage: '#start_linkCheck hot threads#end_link'
      }), `{elasticWebsiteUrl}guide/en/elasticsearch/reference/{docLinkVersion}/cluster-nodes-hot-threads.html`), (0, _alert_helpers.createLink)(_i18n.i18n.translate('xpack.monitoring.alerts.cpuUsage.ui.nextSteps.runningTasks', {
        defaultMessage: '#start_linkCheck long running tasks#end_link'
      }), `{elasticWebsiteUrl}guide/en/elasticsearch/reference/{docLinkVersion}/tasks.html`)],
      tokens: [{
        startToken: '#absolute',
        type: _enums.AlertMessageTokenType.Time,
        isAbsolute: true,
        isRelative: false,
        timestamp: alertState.ui.triggeredMS
      }, {
        startToken: '#start_link',
        endToken: '#end_link',
        type: _enums.AlertMessageTokenType.Link,
        url: `elasticsearch/nodes/${stat.nodeId}`
      }]
    };
  }

  executeActions(instance, {
    alertStates
  }, item, cluster) {
    if (alertStates.length === 0) {
      return;
    }

    const firingNodes = alertStates.filter(alertState => alertState.ui.isFiring);
    const firingCount = firingNodes.length;

    if (firingCount > 0) {
      const shortActionText = _i18n.i18n.translate('xpack.monitoring.alerts.cpuUsage.shortAction', {
        defaultMessage: 'Verify CPU levels across affected nodes.'
      });

      const fullActionText = _i18n.i18n.translate('xpack.monitoring.alerts.cpuUsage.fullAction', {
        defaultMessage: 'View nodes'
      });

      const action = `[${fullActionText}](elasticsearch/nodes)`;

      const internalShortMessage = _i18n.i18n.translate('xpack.monitoring.alerts.cpuUsage.firing.internalShortMessage', {
        defaultMessage: `CPU usage alert is firing for {count} node(s) in cluster: {clusterName}. {shortActionText}`,
        values: {
          count: firingCount,
          clusterName: cluster.clusterName,
          shortActionText
        }
      });

      const internalFullMessage = _i18n.i18n.translate('xpack.monitoring.alerts.cpuUsage.firing.internalFullMessage', {
        defaultMessage: `CPU usage alert is firing for {count} node(s) in cluster: {clusterName}. {action}`,
        values: {
          count: firingCount,
          clusterName: cluster.clusterName,
          action
        }
      });

      instance.scheduleActions('default', {
        internalShortMessage,
        internalFullMessage: _static_globals.Globals.app.isCloud ? internalShortMessage : internalFullMessage,
        state: _alert_helpers.AlertingDefaults.ALERT_STATE.firing,
        nodes: firingNodes.map(({
          nodeName,
          cpuUsage
        }) => `${nodeName}:${cpuUsage}`).toString(),
        count: firingCount,
        clusterName: cluster.clusterName,
        action,
        actionPlain: shortActionText
      });
    }
  }

}

exports.CpuUsageAlert = CpuUsageAlert;