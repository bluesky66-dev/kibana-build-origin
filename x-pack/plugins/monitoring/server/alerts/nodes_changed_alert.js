"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NodesChangedAlert = void 0;

var _i18n = require("@kbn/i18n");

var _base_alert = require("./base_alert");

var _constants = require("../../common/constants");

var _alert_helpers = require("./alert_helpers");

var _static_globals = require("../static_globals");

var _fetch_nodes_from_cluster_stats = require("../lib/alerts/fetch_nodes_from_cluster_stats");

var _get_ccs_index_pattern = require("../lib/alerts/get_ccs_index_pattern");

var _append_mb_index = require("../lib/alerts/append_mb_index");

var _enums = require("../../common/enums");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getNodeStates(nodes) {
  const removed = nodes.priorNodes.filter(priorNode => !nodes.recentNodes.find(recentNode => priorNode.nodeUuid === recentNode.nodeUuid));
  const added = nodes.recentNodes.filter(recentNode => !nodes.priorNodes.find(priorNode => priorNode.nodeUuid === recentNode.nodeUuid));
  const restarted = nodes.recentNodes.filter(recentNode => nodes.priorNodes.find(priorNode => priorNode.nodeUuid === recentNode.nodeUuid) && !nodes.priorNodes.find(priorNode => priorNode.nodeEphemeralId === recentNode.nodeEphemeralId));
  return {
    removed,
    added,
    restarted
  };
}

class NodesChangedAlert extends _base_alert.BaseAlert {
  constructor(rawAlert) {
    super(rawAlert, {
      id: _constants.ALERT_NODES_CHANGED,
      name: _constants.LEGACY_ALERT_DETAILS[_constants.ALERT_NODES_CHANGED].label,
      actionVariables: [{
        name: 'added',
        description: _i18n.i18n.translate('xpack.monitoring.alerts.nodesChanged.actionVariables.added', {
          defaultMessage: 'The list of nodes added to the cluster.'
        })
      }, {
        name: 'removed',
        description: _i18n.i18n.translate('xpack.monitoring.alerts.nodesChanged.actionVariables.removed', {
          defaultMessage: 'The list of nodes removed from the cluster.'
        })
      }, {
        name: 'restarted',
        description: _i18n.i18n.translate('xpack.monitoring.alerts.nodesChanged.actionVariables.restarted', {
          defaultMessage: 'The list of nodes restarted in the cluster.'
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

    const nodesFromClusterStats = await (0, _fetch_nodes_from_cluster_stats.fetchNodesFromClusterStats)(callCluster, clusters, esIndexPattern);
    return nodesFromClusterStats.map(nodes => {
      const {
        removed,
        added,
        restarted
      } = getNodeStates(nodes);
      const shouldFire = removed.length > 0 || added.length > 0 || restarted.length > 0;
      const severity = _enums.AlertSeverity.Warning;
      return {
        shouldFire,
        severity,
        meta: nodes,
        clusterUuid: nodes.clusterUuid,
        ccs: nodes.ccs
      };
    });
  }

  getUiMessage(alertState, item) {
    const nodes = item.meta;
    const states = getNodeStates(nodes);

    if (!alertState.ui.isFiring) {
      return {
        text: _i18n.i18n.translate('xpack.monitoring.alerts.nodesChanged.ui.resolvedMessage', {
          defaultMessage: `No changes in Elasticsearch nodes for this cluster.`
        })
      };
    }

    if (states.added.length === 0 && states.removed.length === 0 && states.restarted.length === 0) {
      return {
        text: _i18n.i18n.translate('xpack.monitoring.alerts.nodesChanged.ui.nothingDetectedFiringMessage', {
          defaultMessage: `Elasticsearch nodes have changed`
        })
      };
    }

    const addedText = states.added.length > 0 ? _i18n.i18n.translate('xpack.monitoring.alerts.nodesChanged.ui.addedFiringMessage', {
      defaultMessage: `Elasticsearch nodes '{added}' added to this cluster.`,
      values: {
        added: states.added.map(n => n.nodeName).join(',')
      }
    }) : null;
    const removedText = states.removed.length > 0 ? _i18n.i18n.translate('xpack.monitoring.alerts.nodesChanged.ui.removedFiringMessage', {
      defaultMessage: `Elasticsearch nodes '{removed}' removed from this cluster.`,
      values: {
        removed: states.removed.map(n => n.nodeName).join(',')
      }
    }) : null;
    const restartedText = states.restarted.length > 0 ? _i18n.i18n.translate('xpack.monitoring.alerts.nodesChanged.ui.restartedFiringMessage', {
      defaultMessage: `Elasticsearch nodes '{restarted}' restarted in this cluster.`,
      values: {
        restarted: states.restarted.map(n => n.nodeName).join(',')
      }
    }) : null;
    return {
      text: [addedText, removedText, restartedText].filter(Boolean).join(' ')
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
    const nodes = state.meta;

    const shortActionText = _i18n.i18n.translate('xpack.monitoring.alerts.nodesChanged.shortAction', {
      defaultMessage: 'Verify that you added, removed, or restarted nodes.'
    });

    const fullActionText = _i18n.i18n.translate('xpack.monitoring.alerts.nodesChanged.fullAction', {
      defaultMessage: 'View nodes'
    });

    const action = `[${fullActionText}](elasticsearch/nodes)`;
    const states = getNodeStates(nodes);
    const added = states.added.map(node => node.nodeName).join(',');
    const removed = states.removed.map(node => node.nodeName).join(',');
    const restarted = states.restarted.map(node => node.nodeName).join(',');
    instance.scheduleActions('default', {
      internalShortMessage: _i18n.i18n.translate('xpack.monitoring.alerts.nodesChanged.firing.internalShortMessage', {
        defaultMessage: `Nodes changed alert is firing for {clusterName}. {shortActionText}`,
        values: {
          clusterName: cluster.clusterName,
          shortActionText
        }
      }),
      internalFullMessage: _i18n.i18n.translate('xpack.monitoring.alerts.nodesChanged.firing.internalFullMessage', {
        defaultMessage: `Nodes changed alert is firing for {clusterName}. The following Elasticsearch nodes have been added:{added} removed:{removed} restarted:{restarted}. {action}`,
        values: {
          clusterName: cluster.clusterName,
          added,
          removed,
          restarted,
          action
        }
      }),
      state: _alert_helpers.AlertingDefaults.ALERT_STATE.firing,
      clusterName: cluster.clusterName,
      added,
      removed,
      restarted,
      action,
      actionPlain: shortActionText
    });
  }

}

exports.NodesChangedAlert = NodesChangedAlert;