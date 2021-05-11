"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ClusterHealthAlert = void 0;

var _i18n = require("@kbn/i18n");

var _base_alert = require("./base_alert");

var _constants = require("../../common/constants");

var _enums = require("../../common/enums");

var _alert_helpers = require("./alert_helpers");

var _static_globals = require("../static_globals");

var _get_ccs_index_pattern = require("../lib/alerts/get_ccs_index_pattern");

var _append_mb_index = require("../lib/alerts/append_mb_index");

var _fetch_cluster_health = require("../lib/alerts/fetch_cluster_health");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const RED_STATUS_MESSAGE = _i18n.i18n.translate('xpack.monitoring.alerts.clusterHealth.redMessage', {
  defaultMessage: 'Allocate missing primary and replica shards'
});

const YELLOW_STATUS_MESSAGE = _i18n.i18n.translate('xpack.monitoring.alerts.clusterHealth.yellowMessage', {
  defaultMessage: 'Allocate missing replica shards'
});

class ClusterHealthAlert extends _base_alert.BaseAlert {
  constructor(rawAlert) {
    super(rawAlert, {
      id: _constants.ALERT_CLUSTER_HEALTH,
      name: _constants.LEGACY_ALERT_DETAILS[_constants.ALERT_CLUSTER_HEALTH].label,
      actionVariables: [{
        name: 'clusterHealth',
        description: _i18n.i18n.translate('xpack.monitoring.alerts.clusterHealth.actionVariables.clusterHealth', {
          defaultMessage: 'The health of the cluster.'
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

    const healths = await (0, _fetch_cluster_health.fetchClusterHealth)(callCluster, clusters, esIndexPattern);
    return healths.map(clusterHealth => {
      const shouldFire = clusterHealth.health !== _enums.AlertClusterHealthType.Green;
      const severity = clusterHealth.health === _enums.AlertClusterHealthType.Red ? _enums.AlertSeverity.Danger : _enums.AlertSeverity.Warning;
      return {
        shouldFire,
        severity,
        meta: clusterHealth,
        clusterUuid: clusterHealth.clusterUuid,
        ccs: clusterHealth.ccs
      };
    });
  }

  getUiMessage(alertState, item) {
    const {
      health
    } = item.meta;
    return {
      text: _i18n.i18n.translate('xpack.monitoring.alerts.clusterHealth.ui.firingMessage', {
        defaultMessage: `Elasticsearch cluster health is {health}.`,
        values: {
          health
        }
      }),
      nextSteps: [{
        text: _i18n.i18n.translate('xpack.monitoring.alerts.clusterHealth.ui.nextSteps.message1', {
          defaultMessage: `{message}. #start_linkView now#end_link`,
          values: {
            message: health === _enums.AlertClusterHealthType.Red ? RED_STATUS_MESSAGE : YELLOW_STATUS_MESSAGE
          }
        }),
        tokens: [{
          startToken: '#start_link',
          endToken: '#end_link',
          type: _enums.AlertMessageTokenType.Link,
          url: 'elasticsearch/indices'
        }]
      }]
    };
  }

  async executeActions(instance, {
    alertStates
  }, item, cluster) {
    if (alertStates.length === 0) {
      return;
    } // Logic in the base alert assumes that all alerts will operate against multiple nodes/instances (such as a CPU alert against ES nodes)
    // However, some alerts operate on the state of the cluster itself and are only concerned with a single state


    const state = alertStates[0];
    const {
      health
    } = state.meta;
    const actionText = health === _enums.AlertClusterHealthType.Red ? _i18n.i18n.translate('xpack.monitoring.alerts.clusterHealth.action.danger', {
      defaultMessage: `Allocate missing primary and replica shards.`
    }) : _i18n.i18n.translate('xpack.monitoring.alerts.clusterHealth.action.warning', {
      defaultMessage: `Allocate missing replica shards.`
    });
    const action = `[${actionText}](elasticsearch/indices)`;
    instance.scheduleActions('default', {
      internalShortMessage: _i18n.i18n.translate('xpack.monitoring.alerts.clusterHealth.firing.internalShortMessage', {
        defaultMessage: `Cluster health alert is firing for {clusterName}. Current health is {health}. {actionText}`,
        values: {
          clusterName: cluster.clusterName,
          health,
          actionText
        }
      }),
      internalFullMessage: _i18n.i18n.translate('xpack.monitoring.alerts.clusterHealth.firing.internalFullMessage', {
        defaultMessage: `Cluster health alert is firing for {clusterName}. Current health is {health}. {action}`,
        values: {
          clusterName: cluster.clusterName,
          health,
          action
        }
      }),
      state: _alert_helpers.AlertingDefaults.ALERT_STATE.firing,
      clusterHealth: health,
      clusterName: cluster.clusterName,
      action,
      actionPlain: actionText
    });
  }

}

exports.ClusterHealthAlert = ClusterHealthAlert;