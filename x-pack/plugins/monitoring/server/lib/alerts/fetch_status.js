"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchStatus = fetchStatus;

var _alerts = require("../../alerts");

var _constants = require("../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function fetchStatus(alertsClient, licenseService, alertTypes, clusterUuids, filters = []) {
  const types = [];
  const byType = {};
  await Promise.all((alertTypes || _constants.ALERTS).map(async type => {
    const alert = await _alerts.AlertsFactory.getByType(type, alertsClient);

    if (!alert || !alert.rawAlert) {
      return;
    }

    const result = {
      states: [],
      rawAlert: alert.rawAlert
    };
    types.push({
      type,
      result
    });
    const id = alert.getId();

    if (!id) {
      return result;
    } // Now that we have the id, we can get the state


    const states = await alert.getStates(alertsClient, id, filters);

    if (!states) {
      return result;
    }

    result.states = Object.values(states).reduce((accum, instance) => {
      const alertInstanceState = instance.state;

      if (!alertInstanceState.alertStates) {
        return accum;
      }

      for (const state of alertInstanceState.alertStates) {
        const meta = instance.meta;

        if (clusterUuids && !clusterUuids.includes(state.cluster.clusterUuid)) {
          return accum;
        }

        let firing = false;

        if (state.ui.isFiring) {
          firing = true;
        }

        accum.push({
          firing,
          state,
          meta
        });
      }

      return accum;
    }, []);
  }));
  types.sort((a, b) => a.type === b.type ? 0 : a.type.length > b.type.length ? 1 : -1);

  for (const {
    type,
    result
  } of types) {
    byType[type] = result;
  }

  return byType;
}