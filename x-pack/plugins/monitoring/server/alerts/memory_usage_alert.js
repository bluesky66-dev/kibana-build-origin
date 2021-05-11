"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MemoryUsageAlert = void 0;

var _i18n = require("@kbn/i18n");

var _numeral = _interopRequireDefault(require("@elastic/numeral"));

var _base_alert = require("./base_alert");

var _constants = require("../../common/constants");

var _formatting = require("../../common/formatting");

var _fetch_memory_usage_node_stats = require("../lib/alerts/fetch_memory_usage_node_stats");

var _get_ccs_index_pattern = require("../lib/alerts/get_ccs_index_pattern");

var _enums = require("../../common/enums");

var _alert_helpers = require("./alert_helpers");

var _append_mb_index = require("../lib/alerts/append_mb_index");

var _parse_duration = require("../../../alerts/common/parse_duration");

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


class MemoryUsageAlert extends _base_alert.BaseAlert {
  constructor(rawAlert) {
    super(rawAlert, {
      id: _constants.ALERT_MEMORY_USAGE,
      name: _constants.ALERT_DETAILS[_constants.ALERT_MEMORY_USAGE].label,
      accessorKey: 'memoryUsage',
      defaultParams: {
        threshold: 85,
        duration: '5m'
      },
      actionVariables: [{
        name: 'nodes',
        description: _i18n.i18n.translate('xpack.monitoring.alerts.memoryUsage.actionVariables.nodes', {
          defaultMessage: 'The list of nodes reporting high memory usage.'
        })
      }, {
        name: 'count',
        description: _i18n.i18n.translate('xpack.monitoring.alerts.memoryUsage.actionVariables.count', {
          defaultMessage: 'The number of nodes reporting high memory usage.'
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

    const {
      duration,
      threshold
    } = params;
    const parsedDuration = (0, _parse_duration.parseDuration)(duration);
    const endMs = +new Date();
    const startMs = endMs - parsedDuration;
    const stats = await (0, _fetch_memory_usage_node_stats.fetchMemoryUsageNodeStats)(callCluster, clusters, esIndexPattern, startMs, endMs, _static_globals.Globals.app.config.ui.max_bucket_size);
    return stats.map(stat => {
      const {
        clusterUuid,
        memoryUsage,
        ccs
      } = stat;
      return {
        shouldFire: memoryUsage > threshold,
        severity: _enums.AlertSeverity.Danger,
        meta: stat,
        clusterUuid,
        ccs
      };
    });
  }

  filterAlertInstance(alertInstance, filters) {
    return super.filterAlertInstance(alertInstance, filters, true);
  }

  getDefaultAlertState(cluster, item) {
    const currentState = super.getDefaultAlertState(cluster, item);
    currentState.ui.severity = _enums.AlertSeverity.Warning;
    return currentState;
  }

  getUiMessage(alertState, item) {
    const stat = item.meta;
    return {
      text: _i18n.i18n.translate('xpack.monitoring.alerts.memoryUsage.ui.firingMessage', {
        defaultMessage: `Node #start_link{nodeName}#end_link is reporting JVM memory usage of {memoryUsage}% at #absolute`,
        values: {
          nodeName: stat.nodeName,
          memoryUsage: (0, _numeral.default)(stat.memoryUsage).format(_formatting.ROUNDED_FLOAT)
        }
      }),
      nextSteps: [(0, _alert_helpers.createLink)(_i18n.i18n.translate('xpack.monitoring.alerts.memoryUsage.ui.nextSteps.tuneThreadPools', {
        defaultMessage: '#start_linkTune thread pools#end_link'
      }), `{elasticWebsiteUrl}guide/en/elasticsearch/reference/{docLinkVersion}/modules-threadpool.html`), (0, _alert_helpers.createLink)(_i18n.i18n.translate('xpack.monitoring.alerts.memoryUsage.ui.nextSteps.managingHeap', {
        defaultMessage: '#start_linkManaging ES Heap#end_link'
      }), `{elasticWebsiteUrl}blog/a-heap-of-trouble`), (0, _alert_helpers.createLink)(_i18n.i18n.translate('xpack.monitoring.alerts.memoryUsage.ui.nextSteps.identifyIndicesShards', {
        defaultMessage: '#start_linkIdentify large indices/shards#end_link'
      }), 'elasticsearch/indices', _enums.AlertMessageTokenType.Link), (0, _alert_helpers.createLink)(_i18n.i18n.translate('xpack.monitoring.alerts.memoryUsage.ui.nextSteps.addMoreNodes', {
        defaultMessage: '#start_linkAdd more data nodes#end_link'
      }), `{elasticWebsiteUrl}guide/en/elasticsearch/reference/{docLinkVersion}/add-elasticsearch-nodes.html`), (0, _alert_helpers.createLink)(_i18n.i18n.translate('xpack.monitoring.alerts.memoryUsage.ui.nextSteps.resizeYourDeployment', {
        defaultMessage: '#start_linkResize your deployment (ECE)#end_link'
      }), `{elasticWebsiteUrl}guide/en/cloud-enterprise/current/ece-resize-deployment.html`)],
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
    const firingNodes = alertStates.filter(alertState => alertState.ui.isFiring);
    const firingCount = firingNodes.length;

    if (firingCount > 0) {
      var _alertStates$find;

      const shortActionText = _i18n.i18n.translate('xpack.monitoring.alerts.memoryUsage.shortAction', {
        defaultMessage: 'Verify memory usage levels across affected nodes.'
      });

      const fullActionText = _i18n.i18n.translate('xpack.monitoring.alerts.memoryUsage.fullAction', {
        defaultMessage: 'View nodes'
      });

      const ccs = (_alertStates$find = alertStates.find(state => state.ccs)) === null || _alertStates$find === void 0 ? void 0 : _alertStates$find.ccs;
      const globalStateLink = this.createGlobalStateLink('elasticsearch/nodes', cluster.clusterUuid, ccs);
      const action = `[${fullActionText}](${globalStateLink})`;

      const internalShortMessage = _i18n.i18n.translate('xpack.monitoring.alerts.memoryUsage.firing.internalShortMessage', {
        defaultMessage: `Memory usage alert is firing for {count} node(s) in cluster: {clusterName}. {shortActionText}`,
        values: {
          count: firingCount,
          clusterName: cluster.clusterName,
          shortActionText
        }
      });

      const internalFullMessage = _i18n.i18n.translate('xpack.monitoring.alerts.memoryUsage.firing.internalFullMessage', {
        defaultMessage: `Memory usage alert is firing for {count} node(s) in cluster: {clusterName}. {action}`,
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
        nodes: firingNodes.map(state => `${state.nodeName}:${state.memoryUsage.toFixed(2)}`).join(','),
        count: firingCount,
        clusterName: cluster.clusterName,
        action,
        actionPlain: shortActionText
      });
    }
  }

}

exports.MemoryUsageAlert = MemoryUsageAlert;