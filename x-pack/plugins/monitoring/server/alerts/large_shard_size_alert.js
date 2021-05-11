"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LargeShardSizeAlert = void 0;

var _i18n = require("@kbn/i18n");

var _base_alert = require("./base_alert");

var _constants = require("../../common/constants");

var _fetch_index_shard_size = require("../lib/alerts/fetch_index_shard_size");

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


const MAX_INDICES_LIST = 10;

class LargeShardSizeAlert extends _base_alert.BaseAlert {
  constructor(rawAlert) {
    super(rawAlert, {
      id: _constants.ALERT_LARGE_SHARD_SIZE,
      name: _constants.ALERT_DETAILS[_constants.ALERT_LARGE_SHARD_SIZE].label,
      throttle: '12h',
      defaultParams: {
        indexPattern: '*',
        threshold: 55
      },
      actionVariables: [{
        name: 'shardIndices',
        description: _i18n.i18n.translate('xpack.monitoring.alerts.shardSize.actionVariables.shardIndex', {
          defaultMessage: 'List of indices which are experiencing large average shard size.'
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
      threshold,
      indexPattern: shardIndexPatterns
    } = params;
    const stats = await (0, _fetch_index_shard_size.fetchIndexShardSize)(callCluster, clusters, esIndexPattern, threshold, shardIndexPatterns, _static_globals.Globals.app.config.ui.max_bucket_size);
    return stats.map(stat => {
      const {
        shardIndex,
        shardSize,
        clusterUuid,
        ccs
      } = stat;
      return {
        shouldFire: true,
        severity: _enums.AlertSeverity.Danger,
        meta: {
          shardIndex,
          shardSize,
          instanceId: `${clusterUuid}:${shardIndex}`,
          itemLabel: shardIndex
        },
        clusterUuid,
        ccs
      };
    });
  }

  getUiMessage(alertState, item) {
    const {
      shardIndex,
      shardSize
    } = item.meta;
    return {
      text: _i18n.i18n.translate('xpack.monitoring.alerts.shardSize.ui.firingMessage', {
        defaultMessage: `The following index: #start_link{shardIndex}#end_link has a large average shard size of: {shardSize}GB at #absolute`,
        values: {
          shardIndex,
          shardSize
        }
      }),
      nextSteps: [(0, _alert_helpers.createLink)(_i18n.i18n.translate('xpack.monitoring.alerts.shardSize.ui.nextSteps.investigateIndex', {
        defaultMessage: '#start_linkInvestigate detailed index stats#end_link'
      }), `elasticsearch/indices/${shardIndex}/advanced`, _enums.AlertMessageTokenType.Link), (0, _alert_helpers.createLink)(_i18n.i18n.translate('xpack.monitoring.alerts.shardSize.ui.nextSteps.sizeYourShards', {
        defaultMessage: '#start_linkHow to size your shards (Docs)#end_link'
      }), `{elasticWebsiteUrl}guide/en/elasticsearch/reference/current/size-your-shards.html`), (0, _alert_helpers.createLink)(_i18n.i18n.translate('xpack.monitoring.alerts.shardSize.ui.nextSteps.shardSizingBlog', {
        defaultMessage: '#start_linkShard sizing tips (Blog)#end_link'
      }), `{elasticWebsiteUrl}blog/how-many-shards-should-i-have-in-my-elasticsearch-cluster`)],
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
        url: `elasticsearch/indices/${shardIndex}`
      }]
    };
  }

  filterAlertInstance(alertInstance, filters) {
    var _alertInstance$state;

    const alertInstanceStates = (_alertInstance$state = alertInstance.state) === null || _alertInstance$state === void 0 ? void 0 : _alertInstance$state.alertStates;
    const alertFilter = filters === null || filters === void 0 ? void 0 : filters.find(filter => filter.shardIndex);

    if (!filters || !filters.length || !(alertInstanceStates !== null && alertInstanceStates !== void 0 && alertInstanceStates.length) || !(alertFilter !== null && alertFilter !== void 0 && alertFilter.shardIndex)) {
      return alertInstance;
    }

    const alertStates = alertInstanceStates.filter(({
      meta
    }) => meta.shardIndex === alertFilter.shardIndex);
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

    let sortedAlertStates = alertStates.slice(0).sort((alertStateA, alertStateB) => {
      const {
        meta: metaA
      } = alertStateA;
      const {
        meta: metaB
      } = alertStateB;
      return metaB.shardSize - metaA.shardSize;
    });
    let suffix = '';

    if (sortedAlertStates.length > MAX_INDICES_LIST) {
      const diff = sortedAlertStates.length - MAX_INDICES_LIST;
      sortedAlertStates = sortedAlertStates.slice(0, MAX_INDICES_LIST);
      suffix = `, and ${diff} more`;
    }

    const shardIndices = sortedAlertStates.map(alertState => alertState.meta.shardIndex).join(', ') + suffix;

    const shortActionText = _i18n.i18n.translate('xpack.monitoring.alerts.shardSize.shortAction', {
      defaultMessage: 'Investigate indices with large shard sizes.'
    });

    const fullActionText = _i18n.i18n.translate('xpack.monitoring.alerts.shardSize.fullAction', {
      defaultMessage: 'View index shard size stats'
    });

    const ccs = (_alertStates$find = alertStates.find(state => state.ccs)) === null || _alertStates$find === void 0 ? void 0 : _alertStates$find.ccs;
    const globalStateLink = this.createGlobalStateLink('elasticsearch/indices', cluster.clusterUuid, ccs);
    const action = `[${fullActionText}](${globalStateLink})`;

    const internalShortMessage = _i18n.i18n.translate('xpack.monitoring.alerts.shardSize.firing.internalShortMessage', {
      defaultMessage: `Large shard size alert is firing for the following indices: {shardIndices}. {shortActionText}`,
      values: {
        shardIndices,
        shortActionText
      }
    });

    const internalFullMessage = _i18n.i18n.translate('xpack.monitoring.alerts.shardSize.firing.internalFullMessage', {
      defaultMessage: `Large shard size alert is firing for the following indices: {shardIndices}. {action}`,
      values: {
        action,
        shardIndices
      }
    });

    instance.scheduleActions('default', {
      internalShortMessage,
      internalFullMessage,
      state: _alert_helpers.AlertingDefaults.ALERT_STATE.firing,
      shardIndices,
      clusterName: cluster.clusterName,
      action,
      actionPlain: shortActionText
    });
  }

}

exports.LargeShardSizeAlert = LargeShardSizeAlert;