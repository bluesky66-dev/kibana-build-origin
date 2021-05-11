"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DiskUsageAlert = void 0;

var _i18n = require("@kbn/i18n");

var _numeral = _interopRequireDefault(require("@elastic/numeral"));

var _base_alert = require("./base_alert");

var _constants = require("../../common/constants");

var _formatting = require("../../common/formatting");

var _fetch_disk_usage_node_stats = require("../lib/alerts/fetch_disk_usage_node_stats");

var _get_ccs_index_pattern = require("../lib/alerts/get_ccs_index_pattern");

var _enums = require("../../common/enums");

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


class DiskUsageAlert extends _base_alert.BaseAlert {
  constructor(rawAlert) {
    super(rawAlert, {
      id: _constants.ALERT_DISK_USAGE,
      name: _constants.ALERT_DETAILS[_constants.ALERT_DISK_USAGE].label,
      accessorKey: 'diskUsage',
      defaultParams: {
        threshold: 80,
        duration: '5m'
      },
      actionVariables: [{
        name: 'nodes',
        description: _i18n.i18n.translate('xpack.monitoring.alerts.diskUsage.actionVariables.nodes', {
          defaultMessage: 'The list of nodes reporting high disk usage.'
        })
      }, {
        name: 'count',
        description: _i18n.i18n.translate('xpack.monitoring.alerts.diskUsage.actionVariables.count', {
          defaultMessage: 'The number of nodes reporting high disk usage.'
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
    const stats = await (0, _fetch_disk_usage_node_stats.fetchDiskUsageNodeStats)(callCluster, clusters, esIndexPattern, duration, _static_globals.Globals.app.config.ui.max_bucket_size);
    return stats.map(stat => {
      const {
        clusterUuid,
        diskUsage,
        ccs
      } = stat;
      return {
        shouldFire: diskUsage > threshold,
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
      text: _i18n.i18n.translate('xpack.monitoring.alerts.diskUsage.ui.firingMessage', {
        defaultMessage: `Node #start_link{nodeName}#end_link is reporting disk usage of {diskUsage}% at #absolute`,
        values: {
          nodeName: stat.nodeName,
          diskUsage: (0, _numeral.default)(stat.diskUsage).format(_formatting.ROUNDED_FLOAT)
        }
      }),
      nextSteps: [(0, _alert_helpers.createLink)(_i18n.i18n.translate('xpack.monitoring.alerts.diskUsage.ui.nextSteps.tuneDisk', {
        defaultMessage: '#start_linkTune for disk usage#end_link'
      }), `{elasticWebsiteUrl}guide/en/elasticsearch/reference/{docLinkVersion}/tune-for-disk-usage.html`), (0, _alert_helpers.createLink)(_i18n.i18n.translate('xpack.monitoring.alerts.diskUsage.ui.nextSteps.identifyIndices', {
        defaultMessage: '#start_linkIdentify large indices#end_link'
      }), 'elasticsearch/indices', _enums.AlertMessageTokenType.Link), (0, _alert_helpers.createLink)(_i18n.i18n.translate('xpack.monitoring.alerts.diskUsage.ui.nextSteps.ilmPolicies', {
        defaultMessage: '#start_linkImplement ILM policies#end_link'
      }), `{elasticWebsiteUrl}guide/en/elasticsearch/reference/{docLinkVersion}/index-lifecycle-management.html`), (0, _alert_helpers.createLink)(_i18n.i18n.translate('xpack.monitoring.alerts.diskUsage.ui.nextSteps.addMoreNodes', {
        defaultMessage: '#start_linkAdd more data nodes#end_link'
      }), `{elasticWebsiteUrl}guide/en/elasticsearch/reference/{docLinkVersion}/add-elasticsearch-nodes.html`), (0, _alert_helpers.createLink)(_i18n.i18n.translate('xpack.monitoring.alerts.diskUsage.ui.nextSteps.resizeYourDeployment', {
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
      const shortActionText = _i18n.i18n.translate('xpack.monitoring.alerts.diskUsage.shortAction', {
        defaultMessage: 'Verify disk usage levels across affected nodes.'
      });

      const fullActionText = _i18n.i18n.translate('xpack.monitoring.alerts.diskUsage.fullAction', {
        defaultMessage: 'View nodes'
      });

      const action = `[${fullActionText}](elasticsearch/nodes)`;

      const internalShortMessage = _i18n.i18n.translate('xpack.monitoring.alerts.diskUsage.firing.internalShortMessage', {
        defaultMessage: `Disk usage alert is firing for {count} node(s) in cluster: {clusterName}. {shortActionText}`,
        values: {
          count: firingCount,
          clusterName: cluster.clusterName,
          shortActionText
        }
      });

      const internalFullMessage = _i18n.i18n.translate('xpack.monitoring.alerts.diskUsage.firing.internalFullMessage', {
        defaultMessage: `Disk usage alert is firing for {count} node(s) in cluster: {clusterName}. {action}`,
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
        nodes: firingNodes.map(state => `${state.nodeName}:${state.diskUsage}`).join(','),
        count: firingCount,
        clusterName: cluster.clusterName,
        action,
        actionPlain: shortActionText
      });
    }
  }

}

exports.DiskUsageAlert = DiskUsageAlert;