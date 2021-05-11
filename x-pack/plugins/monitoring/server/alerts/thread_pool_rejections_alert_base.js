"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ThreadPoolRejectionsAlertBase = void 0;

var _i18n = require("@kbn/i18n");

var _base_alert = require("./base_alert");

var _constants = require("../../common/constants");

var _fetch_thread_pool_rejections_stats = require("../lib/alerts/fetch_thread_pool_rejections_stats");

var _get_ccs_index_pattern = require("../lib/alerts/get_ccs_index_pattern");

var _enums = require("../../common/enums");

var _alert_helpers = require("./alert_helpers");

var _append_mb_index = require("../lib/alerts/append_mb_index");

var _static_globals = require("../static_globals");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class ThreadPoolRejectionsAlertBase extends _base_alert.BaseAlert {
  static createActionVariables(type) {
    return [{
      name: 'count',
      description: _i18n.i18n.translate('xpack.monitoring.alerts.threadPoolRejections.actionVariables.count', {
        defaultMessage: 'The number of nodes reporting high thread pool {type} rejections.',
        values: {
          type
        }
      })
    }, ...Object.values(_alert_helpers.AlertingDefaults.ALERT_TYPE.context)];
  }

  constructor(rawAlert = undefined, id, threadPoolType, name, actionVariables) {
    super(rawAlert, {
      id,
      name,
      defaultParams: {
        threshold: 300,
        duration: '5m'
      },
      actionVariables
    });
    this.id = id;
    this.threadPoolType = threadPoolType;
    this.name = name;
    this.actionVariables = actionVariables;
  }

  async fetchData(params, callCluster, clusters, availableCcs) {
    let esIndexPattern = (0, _append_mb_index.appendMetricbeatIndex)(_static_globals.Globals.app.config, _constants.INDEX_PATTERN_ELASTICSEARCH);

    if (availableCcs) {
      esIndexPattern = (0, _get_ccs_index_pattern.getCcsIndexPattern)(esIndexPattern, availableCcs);
    }

    const {
      threshold,
      duration
    } = params;
    const stats = await (0, _fetch_thread_pool_rejections_stats.fetchThreadPoolRejectionStats)(callCluster, clusters, esIndexPattern, _static_globals.Globals.app.config.ui.max_bucket_size, this.threadPoolType, duration);
    return stats.map(stat => {
      const {
        clusterUuid,
        rejectionCount,
        ccs
      } = stat;
      return {
        shouldFire: rejectionCount > threshold,
        rejectionCount,
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

  getUiMessage(alertState) {
    const {
      nodeName,
      nodeId,
      rejectionCount
    } = alertState;
    return {
      text: _i18n.i18n.translate('xpack.monitoring.alerts.threadPoolRejections.ui.firingMessage', {
        defaultMessage: `Node #start_link{nodeName}#end_link is reporting {rejectionCount} {type} rejections at #absolute`,
        values: {
          nodeName,
          type: this.threadPoolType,
          rejectionCount
        }
      }),
      nextSteps: [(0, _alert_helpers.createLink)(_i18n.i18n.translate('xpack.monitoring.alerts.threadPoolRejections.ui.nextSteps.monitorThisNode', {
        defaultMessage: `#start_linkMonitor this node#end_link`
      }), `elasticsearch/nodes/${nodeId}/advanced`, _enums.AlertMessageTokenType.Link), (0, _alert_helpers.createLink)(_i18n.i18n.translate('xpack.monitoring.alerts.threadPoolRejections.ui.nextSteps.optimizeQueries', {
        defaultMessage: '#start_linkOptimize complex queries#end_link'
      }), `{elasticWebsiteUrl}blog/advanced-tuning-finding-and-fixing-slow-elasticsearch-queries`), (0, _alert_helpers.createLink)(_i18n.i18n.translate('xpack.monitoring.alerts.threadPoolRejections.ui.nextSteps.addMoreNodes', {
        defaultMessage: '#start_linkAdd more nodes#end_link'
      }), `{elasticWebsiteUrl}guide/en/elasticsearch/reference/{docLinkVersion}/add-elasticsearch-nodes.html`), (0, _alert_helpers.createLink)(_i18n.i18n.translate('xpack.monitoring.alerts.threadPoolRejections.ui.nextSteps.resizeYourDeployment', {
        defaultMessage: '#start_linkResize your deployment (ECE)#end_link'
      }), `{elasticWebsiteUrl}guide/en/cloud-enterprise/current/ece-resize-deployment.html`), (0, _alert_helpers.createLink)(_i18n.i18n.translate('xpack.monitoring.alerts.threadPoolRejections.ui.nextSteps.threadPoolSettings', {
        defaultMessage: '#start_linkThread pool settings#end_link'
      }), `{elasticWebsiteUrl}guide/en/elasticsearch/reference/{docLinkVersion}/modules-threadpool.html`)],
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
        url: `elasticsearch/nodes/${nodeId}`
      }]
    };
  }

  executeActions(instance, alertStates, cluster) {
    var _alertStates$find;

    const type = this.threadPoolType;
    const count = alertStates.length;
    const {
      clusterName: clusterKnownName,
      clusterUuid
    } = cluster;
    const clusterName = clusterKnownName || clusterUuid;

    const shortActionText = _i18n.i18n.translate('xpack.monitoring.alerts.threadPoolRejections.shortAction', {
      defaultMessage: 'Verify thread pool {type} rejections across affected nodes.',
      values: {
        type
      }
    });

    const fullActionText = _i18n.i18n.translate('xpack.monitoring.alerts.threadPoolRejections.fullAction', {
      defaultMessage: 'View nodes'
    });

    const ccs = (_alertStates$find = alertStates.find(state => state.ccs)) === null || _alertStates$find === void 0 ? void 0 : _alertStates$find.ccs;
    const globalStateLink = this.createGlobalStateLink('elasticsearch/nodes', clusterUuid, ccs);
    const action = `[${fullActionText}](${globalStateLink})`;

    const internalShortMessage = _i18n.i18n.translate('xpack.monitoring.alerts.threadPoolRejections.firing.internalShortMessage', {
      defaultMessage: `Thread pool {type} rejections alert is firing for {count} node(s) in cluster: {clusterName}. {shortActionText}`,
      values: {
        count,
        clusterName,
        shortActionText,
        type
      }
    });

    const internalFullMessage = _i18n.i18n.translate('xpack.monitoring.alerts.threadPoolRejections.firing.internalFullMessage', {
      defaultMessage: `Thread pool {type} rejections alert is firing for {count} node(s) in cluster: {clusterName}. {action}`,
      values: {
        count,
        clusterName,
        action,
        type
      }
    });

    instance.scheduleActions('default', {
      internalShortMessage,
      internalFullMessage: _static_globals.Globals.app.isCloud ? internalShortMessage : internalFullMessage,
      threadPoolType: type,
      state: _alert_helpers.AlertingDefaults.ALERT_STATE.firing,
      count,
      clusterName,
      action,
      actionPlain: shortActionText
    });
  }

}

exports.ThreadPoolRejectionsAlertBase = ThreadPoolRejectionsAlertBase;