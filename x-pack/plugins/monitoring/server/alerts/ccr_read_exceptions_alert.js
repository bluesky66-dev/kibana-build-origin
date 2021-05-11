"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CCRReadExceptionsAlert = void 0;

var _i18n = require("@kbn/i18n");

var _base_alert = require("./base_alert");

var _constants = require("../../common/constants");

var _fetch_ccr_read_exceptions = require("../lib/alerts/fetch_ccr_read_exceptions");

var _get_ccs_index_pattern = require("../lib/alerts/get_ccs_index_pattern");

var _enums = require("../../common/enums");

var _parse_duration = require("../../../alerts/common/parse_duration");

var _alert_helpers = require("./alert_helpers");

var _append_mb_index = require("../lib/alerts/append_mb_index");

var _static_globals = require("../static_globals");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class CCRReadExceptionsAlert extends _base_alert.BaseAlert {
  constructor(rawAlert) {
    super(rawAlert, {
      id: _constants.ALERT_CCR_READ_EXCEPTIONS,
      name: _constants.ALERT_DETAILS[_constants.ALERT_CCR_READ_EXCEPTIONS].label,
      throttle: '6h',
      defaultParams: {
        duration: '1h'
      },
      actionVariables: [{
        name: 'remoteClusters',
        description: _i18n.i18n.translate('xpack.monitoring.alerts.ccrReadExceptions.actionVariables.remoteClusters', {
          defaultMessage: 'List of remote clusters that are experiencing CCR read exceptions.'
        })
      }, {
        name: 'followerIndices',
        description: _i18n.i18n.translate('xpack.monitoring.alerts.ccrReadExceptions.actionVariables.followerIndices', {
          defaultMessage: 'List of follower indices reporting CCR read exceptions.'
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
      duration: durationString
    } = params;
    const duration = (0, _parse_duration.parseDuration)(durationString);
    const endMs = +new Date();
    const startMs = endMs - duration;
    const stats = await (0, _fetch_ccr_read_exceptions.fetchCCRReadExceptions)(callCluster, esIndexPattern, startMs, endMs, _static_globals.Globals.app.config.ui.max_bucket_size);
    return stats.map(stat => {
      const {
        remoteCluster,
        followerIndex,
        shardId,
        leaderIndex,
        lastReadException,
        clusterUuid,
        ccs
      } = stat;
      return {
        shouldFire: true,
        severity: _enums.AlertSeverity.Danger,
        meta: {
          remoteCluster,
          followerIndex,
          shardId,
          leaderIndex,
          lastReadException,
          instanceId: `${remoteCluster}:${followerIndex}`,
          itemLabel: followerIndex
        },
        clusterUuid,
        ccs
      };
    });
  }

  getUiMessage(alertState, item) {
    const {
      remoteCluster,
      followerIndex,
      shardId,
      lastReadException
    } = item.meta;
    return {
      text: _i18n.i18n.translate('xpack.monitoring.alerts.ccrReadExceptions.ui.firingMessage', {
        defaultMessage: `Follower index #start_link{followerIndex}#end_link is reporting CCR read exceptions on remote cluster: {remoteCluster} at #absolute`,
        values: {
          remoteCluster,
          followerIndex
        }
      }),
      code: JSON.stringify(lastReadException, null, 2),
      nextSteps: [(0, _alert_helpers.createLink)(_i18n.i18n.translate('xpack.monitoring.alerts.ccrReadExceptions.ui.nextSteps.identifyCCRStats', {
        defaultMessage: '#start_linkIdentify CCR usage/stats#end_link'
      }), 'elasticsearch/ccr', _enums.AlertMessageTokenType.Link), (0, _alert_helpers.createLink)(_i18n.i18n.translate('xpack.monitoring.alerts.ccrReadExceptions.ui.nextSteps.stackManagmentFollow', {
        defaultMessage: '#start_linkManage CCR follower indices#end_link'
      }), `{basePath}management/data/cross_cluster_replication/follower_indices`), (0, _alert_helpers.createLink)(_i18n.i18n.translate('xpack.monitoring.alerts.ccrReadExceptions.ui.nextSteps.stackManagmentAutoFollow', {
        defaultMessage: '#start_linkCreate auto-follow patterns#end_link'
      }), `{basePath}management/data/cross_cluster_replication/auto_follow_patterns`), (0, _alert_helpers.createLink)(_i18n.i18n.translate('xpack.monitoring.alerts.ccrReadExceptions.ui.nextSteps.followerAPIDoc', {
        defaultMessage: '#start_linkAdd follower index API (Docs)#end_link'
      }), `{elasticWebsiteUrl}guide/en/elasticsearch/reference/{docLinkVersion}/ccr-put-follow.html`), (0, _alert_helpers.createLink)(_i18n.i18n.translate('xpack.monitoring.alerts.ccrReadExceptions.ui.nextSteps.ccrDocs', {
        defaultMessage: '#start_linkCross-cluster replication (Docs)#end_link'
      }), `{elasticWebsiteUrl}guide/en/elasticsearch/reference/{docLinkVersion}/xpack-ccr.html`), (0, _alert_helpers.createLink)(_i18n.i18n.translate('xpack.monitoring.alerts.ccrReadExceptions.ui.nextSteps.biDirectionalReplication', {
        defaultMessage: '#start_linkBi-directional replication (Blog)#end_link'
      }), `{elasticWebsiteUrl}blog/bi-directional-replication-with-elasticsearch-cross-cluster-replication-ccr`), (0, _alert_helpers.createLink)(_i18n.i18n.translate('xpack.monitoring.alerts.ccrReadExceptions.ui.nextSteps.followTheLeader', {
        defaultMessage: '#start_linkFollow the Leader (Blog)#end_link'
      }), `{elasticWebsiteUrl}blog/follow-the-leader-an-introduction-to-cross-cluster-replication-in-elasticsearch`)],
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
        url: `elasticsearch/ccr/${followerIndex}/shard/${shardId}`
      }]
    };
  }

  filterAlertInstance(alertInstance, filters) {
    var _alertInstance$state;

    const alertInstanceStates = (_alertInstance$state = alertInstance.state) === null || _alertInstance$state === void 0 ? void 0 : _alertInstance$state.alertStates;
    const alertFilter = filters === null || filters === void 0 ? void 0 : filters.find(filter => filter.shardId);

    if (!filters || !filters.length || !(alertInstanceStates !== null && alertInstanceStates !== void 0 && alertInstanceStates.length) || !(alertFilter !== null && alertFilter !== void 0 && alertFilter.shardId)) {
      return alertInstance;
    }

    const shardIdInt = parseInt(alertFilter.shardId, 10);
    const alertStates = alertInstanceStates.filter(({
      meta
    }) => meta.shardId === shardIdInt);
    return {
      state: {
        alertStates
      }
    };
  }

  executeActions(instance, {
    alertStates
  }, item, cluster) {
    var _alertStates$find;

    const remoteClustersList = alertStates.map(alertState => alertState.meta.remoteCluster).join(', ');
    const followerIndicesList = alertStates.map(alertState => alertState.meta.followerIndex).join(', ');

    const shortActionText = _i18n.i18n.translate('xpack.monitoring.alerts.ccrReadExceptions.shortAction', {
      defaultMessage: 'Verify follower and leader index relationships across the affected remote clusters.'
    });

    const fullActionText = _i18n.i18n.translate('xpack.monitoring.alerts.ccrReadExceptions.fullAction', {
      defaultMessage: 'View CCR stats'
    });

    const ccs = (_alertStates$find = alertStates.find(state => state.ccs)) === null || _alertStates$find === void 0 ? void 0 : _alertStates$find.ccs;
    const globalStateLink = this.createGlobalStateLink('elasticsearch/ccr', cluster.clusterUuid, ccs);
    const action = `[${fullActionText}](${globalStateLink})`;

    const internalShortMessage = _i18n.i18n.translate('xpack.monitoring.alerts.ccrReadExceptions.firing.internalShortMessage', {
      defaultMessage: `CCR read exceptions alert is firing for the following remote clusters: {remoteClustersList}. {shortActionText}`,
      values: {
        remoteClustersList,
        shortActionText
      }
    });

    const internalFullMessage = _i18n.i18n.translate('xpack.monitoring.alerts.ccrReadExceptions.firing.internalFullMessage', {
      defaultMessage: `CCR read exceptions alert is firing for the following remote clusters: {remoteClustersList}. Current 'follower_index' indices are affected: {followerIndicesList}. {action}`,
      values: {
        action,
        remoteClustersList,
        followerIndicesList
      }
    });

    instance.scheduleActions('default', {
      internalShortMessage,
      internalFullMessage,
      state: _alert_helpers.AlertingDefaults.ALERT_STATE.firing,
      remoteClusters: remoteClustersList,
      followerIndices: followerIndicesList,
      clusterName: cluster.clusterName,
      action,
      actionPlain: shortActionText
    });
  }

}

exports.CCRReadExceptionsAlert = CCRReadExceptionsAlert;