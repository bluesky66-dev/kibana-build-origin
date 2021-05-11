"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.alertInstanceSummaryFromEventLog = alertInstanceSummaryFromEventLog;

var _plugin = require("../plugin");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function alertInstanceSummaryFromEventLog(params) {
  var _event$kibana2, _event$kibana2$alerti, _event$kibana3, _event$kibana3$alerti; // initialize the  result


  const {
    alert,
    events,
    dateStart,
    dateEnd
  } = params;
  const alertInstanceSummary = {
    id: alert.id,
    name: alert.name,
    tags: alert.tags,
    alertTypeId: alert.alertTypeId,
    consumer: alert.consumer,
    statusStartDate: dateStart,
    statusEndDate: dateEnd,
    status: 'OK',
    muteAll: alert.muteAll,
    throttle: alert.throttle,
    enabled: alert.enabled,
    lastRun: undefined,
    errorMessages: [],
    instances: {}
  };
  const instances = new Map(); // loop through the events
  // should be sorted newest to oldest, we want oldest to newest, so reverse

  for (const event of events.reverse()) {
    var _event$event, _event$event2, _event$kibana, _event$kibana$alertin;

    const timeStamp = event === null || event === void 0 ? void 0 : event['@timestamp'];
    if (timeStamp === undefined) continue;
    const provider = event === null || event === void 0 ? void 0 : (_event$event = event.event) === null || _event$event === void 0 ? void 0 : _event$event.provider;
    if (provider !== _plugin.EVENT_LOG_PROVIDER) continue;
    const action = event === null || event === void 0 ? void 0 : (_event$event2 = event.event) === null || _event$event2 === void 0 ? void 0 : _event$event2.action;
    if (action === undefined) continue;

    if (action === _plugin.EVENT_LOG_ACTIONS.execute) {
      var _event$error;

      alertInstanceSummary.lastRun = timeStamp;
      const errorMessage = event === null || event === void 0 ? void 0 : (_event$error = event.error) === null || _event$error === void 0 ? void 0 : _event$error.message;

      if (errorMessage !== undefined) {
        alertInstanceSummary.status = 'Error';
        alertInstanceSummary.errorMessages.push({
          date: timeStamp,
          message: errorMessage
        });
      } else {
        alertInstanceSummary.status = 'OK';
      }

      continue;
    }

    const instanceId = event === null || event === void 0 ? void 0 : (_event$kibana = event.kibana) === null || _event$kibana === void 0 ? void 0 : (_event$kibana$alertin = _event$kibana.alerting) === null || _event$kibana$alertin === void 0 ? void 0 : _event$kibana$alertin.instance_id;
    if (instanceId === undefined) continue;
    const status = getAlertInstanceStatus(instances, instanceId);

    switch (action) {
      case _plugin.EVENT_LOG_ACTIONS.newInstance:
        status.activeStartDate = timeStamp;
      // intentionally no break here

      case _plugin.EVENT_LOG_ACTIONS.activeInstance:
        status.status = 'Active';
        status.actionGroupId = event === null || event === void 0 ? void 0 : (_event$kibana2 = event.kibana) === null || _event$kibana2 === void 0 ? void 0 : (_event$kibana2$alerti = _event$kibana2.alerting) === null || _event$kibana2$alerti === void 0 ? void 0 : _event$kibana2$alerti.action_group_id;
        status.actionSubgroup = event === null || event === void 0 ? void 0 : (_event$kibana3 = event.kibana) === null || _event$kibana3 === void 0 ? void 0 : (_event$kibana3$alerti = _event$kibana3.alerting) === null || _event$kibana3$alerti === void 0 ? void 0 : _event$kibana3$alerti.action_subgroup;
        break;

      case _plugin.LEGACY_EVENT_LOG_ACTIONS.resolvedInstance:
      case _plugin.EVENT_LOG_ACTIONS.recoveredInstance:
        status.status = 'OK';
        status.activeStartDate = undefined;
        status.actionGroupId = undefined;
        status.actionSubgroup = undefined;
    }
  } // set the muted status of instances


  for (const instanceId of alert.mutedInstanceIds) {
    getAlertInstanceStatus(instances, instanceId).muted = true;
  } // convert the instances map to object form


  const instanceIds = Array.from(instances.keys()).sort();

  for (const instanceId of instanceIds) {
    alertInstanceSummary.instances[instanceId] = instances.get(instanceId);
  } // set the overall alert status to Active if appropriate


  if (alertInstanceSummary.status !== 'Error') {
    if (Array.from(instances.values()).some(instance => instance.status === 'Active')) {
      alertInstanceSummary.status = 'Active';
    }
  }

  alertInstanceSummary.errorMessages.sort((a, b) => a.date.localeCompare(b.date));
  return alertInstanceSummary;
} // return an instance status object, creating and adding to the map if needed


function getAlertInstanceStatus(instances, instanceId) {
  if (instances.has(instanceId)) return instances.get(instanceId);
  const status = {
    status: 'OK',
    muted: false,
    actionGroupId: undefined,
    actionSubgroup: undefined,
    activeStartDate: undefined
  };
  instances.set(instanceId, status);
  return status;
}