"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEndpointTelemetryFromFleet = exports.updateEndpointPolicyTelemetry = exports.updateEndpointDailyActiveCount = exports.updateEndpointOSTelemetry = exports.getDefaultEndpointTelemetry = void 0;

var _lodash = require("lodash");

var _fleet_saved_objects = require("./fleet_saved_objects");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * @description returns an empty telemetry object to be incrmented and updated within the `getEndpointTelemetryFromFleet` fn
 */


const getDefaultEndpointTelemetry = () => ({
  total_installed: 0,
  active_within_last_24_hours: 0,
  os: [],
  policies: {
    malware: {
      active: 0,
      inactive: 0,
      failure: 0
    }
  }
});
/**
 * @description this function updates the os telemetry. We use the fullName field as the key as it contains the name and version details.
 * If it has already been tracked, the count will be updated, otherwise a tracker will be initialized for that fullName.
 */


exports.getDefaultEndpointTelemetry = getDefaultEndpointTelemetry;

const updateEndpointOSTelemetry = (os, osTracker) => {
  let updatedOSTracker = osTracker;

  if (os && typeof os === 'object') {
    updatedOSTracker = (0, _lodash.cloneDeep)(osTracker);
    const {
      version: osVersion,
      platform: osPlatform,
      full: osFullName
    } = os;

    if (osFullName && osVersion) {
      if (updatedOSTracker[osFullName]) updatedOSTracker[osFullName].count += 1;else {
        updatedOSTracker[osFullName] = {
          full_name: osFullName,
          platform: osPlatform,
          version: osVersion,
          count: 1
        };
      }
    }
  }

  return updatedOSTracker;
};
/**
 * @description we take the latest endpoint specific agent event, get the status of the endpoint, and if it is running
 * and the agent itself has been active within the last 24 hours, we can safely assume the endpoint has been active within
 * the same time span.
 */


exports.updateEndpointOSTelemetry = updateEndpointOSTelemetry;

const updateEndpointDailyActiveCount = (latestEndpointEvent, lastAgentCheckin, currentCount) => {
  const aDayAgo = new Date();
  aDayAgo.setDate(aDayAgo.getDate() - 1);
  const agentWasActiveOverLastDay = !!lastAgentCheckin && new Date(lastAgentCheckin) > aDayAgo;
  return agentWasActiveOverLastDay && latestEndpointEvent.attributes.subtype === 'RUNNING' ? currentCount + 1 : currentCount;
};
/**
 * @description We take the latest endpoint specific agent event, and as long as it provides the payload with policy details, we will parse that policy
 * to populate the success of it's application. The policy is provided in the agent health checks.
 */


exports.updateEndpointDailyActiveCount = updateEndpointDailyActiveCount;

const updateEndpointPolicyTelemetry = (latestEndpointEvent, policiesTracker) => {
  var _endpointPolicyPayloa, _endpointPolicyPayloa2, _endpointPolicyPayloa3, _endpointPolicyPayloa4, _endpointPolicyPayloa5, _endpointPolicyPayloa6, _endpointPolicyPayloa7, _endpointPolicyPayloa8, _endpointPolicyPayloa9, _endpointPolicyPayloa10, _endpointPolicyPayloa11, _endpointPolicyPayloa12, _endpointPolicyPayloa13, _endpointPolicyPayloa14;

  const policyHostTypeToPolicyType = {
    Linux: 'linux',
    macOS: 'mac',
    Windows: 'windows'
  };
  const enabledMalwarePolicyTypes = ['prevent', 'detect']; // The policy details are sent as a string on the 'payload' attribute of the agent event

  const {
    payload
  } = latestEndpointEvent.attributes;

  if (!payload) {
    // This payload may not always be provided depending on the state of the endpoint. Guard again situations where it is not sent
    return policiesTracker;
  }

  let endpointPolicyPayload;

  try {
    endpointPolicyPayload = JSON.parse(latestEndpointEvent.attributes.payload);
  } catch (error) {
    return policiesTracker;
  } // Get the platform: windows, mac, or linux


  const hostType = policyHostTypeToPolicyType[(_endpointPolicyPayloa = endpointPolicyPayload['endpoint-security']) === null || _endpointPolicyPayloa === void 0 ? void 0 : (_endpointPolicyPayloa2 = _endpointPolicyPayloa.host) === null || _endpointPolicyPayloa2 === void 0 ? void 0 : (_endpointPolicyPayloa3 = _endpointPolicyPayloa2.os) === null || _endpointPolicyPayloa3 === void 0 ? void 0 : _endpointPolicyPayloa3.name]; // Get whether the malware setting for the platform on the most recently provided config is active (prevent or detect is on) or off

  const userDesiredMalwareState = (_endpointPolicyPayloa4 = endpointPolicyPayload['endpoint-security'].Endpoint) === null || _endpointPolicyPayloa4 === void 0 ? void 0 : (_endpointPolicyPayloa5 = _endpointPolicyPayloa4.configuration) === null || _endpointPolicyPayloa5 === void 0 ? void 0 : (_endpointPolicyPayloa6 = _endpointPolicyPayloa5.inputs[0]) === null || _endpointPolicyPayloa6 === void 0 ? void 0 : (_endpointPolicyPayloa7 = _endpointPolicyPayloa6.policy[hostType]) === null || _endpointPolicyPayloa7 === void 0 ? void 0 : (_endpointPolicyPayloa8 = _endpointPolicyPayloa7.malware) === null || _endpointPolicyPayloa8 === void 0 ? void 0 : _endpointPolicyPayloa8.mode; // Get the status of the application of the malware protection

  const malwareStatus = (_endpointPolicyPayloa9 = endpointPolicyPayload['endpoint-security'].Endpoint) === null || _endpointPolicyPayloa9 === void 0 ? void 0 : (_endpointPolicyPayloa10 = _endpointPolicyPayloa9.policy) === null || _endpointPolicyPayloa10 === void 0 ? void 0 : (_endpointPolicyPayloa11 = _endpointPolicyPayloa10.applied) === null || _endpointPolicyPayloa11 === void 0 ? void 0 : (_endpointPolicyPayloa12 = _endpointPolicyPayloa11.response) === null || _endpointPolicyPayloa12 === void 0 ? void 0 : (_endpointPolicyPayloa13 = _endpointPolicyPayloa12.configurations) === null || _endpointPolicyPayloa13 === void 0 ? void 0 : (_endpointPolicyPayloa14 = _endpointPolicyPayloa13.malware) === null || _endpointPolicyPayloa14 === void 0 ? void 0 : _endpointPolicyPayloa14.status;

  if (!userDesiredMalwareState || !malwareStatus) {
    // If we get policy information without the mode or status, then nothing to track or update
    return policiesTracker;
  }

  const updatedPoliciesTracker = {
    malware: { ...policiesTracker.malware
    }
  };
  const isAnActiveMalwareState = enabledMalwarePolicyTypes.includes(userDesiredMalwareState); // we only check for 'not failure' as the 'warning' state for malware is still technically actively enabled (with warnings)

  const successfullyEnabled = !!malwareStatus && malwareStatus !== 'failure';
  const failedToEnable = !!malwareStatus && malwareStatus === 'failure';

  if (isAnActiveMalwareState && successfullyEnabled) {
    updatedPoliciesTracker.malware.active += 1;
  } else if (!isAnActiveMalwareState && successfullyEnabled) {
    updatedPoliciesTracker.malware.inactive += 1;
  } else if (isAnActiveMalwareState && failedToEnable) {
    updatedPoliciesTracker.malware.failure += 1;
  }

  return updatedPoliciesTracker;
};
/**
 * @description This aggregates the telemetry details from the two fleet savedObject sources, `fleet-agents` and `fleet-agent-events` to populate
 * the telemetry details for endpoint. Since we cannot access our own indices due to `kibana_system` not having access, this is the best alternative.
 * Once the data is requested, we iterate over all agents with endpoints registered, and then request the events for each active agent (within last 24 hours)
 * to confirm whether or not the endpoint is still active
 */


exports.updateEndpointPolicyTelemetry = updateEndpointPolicyTelemetry;

const getEndpointTelemetryFromFleet = async soClient => {
  // Retrieve every agent (max 10000) that references the endpoint as an installed package. It will not be listed if it was never installed
  let endpointAgents;

  try {
    const response = await (0, _fleet_saved_objects.getFleetSavedObjectsMetadata)(soClient);
    endpointAgents = response.saved_objects;
  } catch (error) {
    // Better to provide an empty object rather than default telemetry as this better informs us of an error
    return {};
  }

  const endpointAgentsCount = endpointAgents.length;
  const endpointTelemetry = getDefaultEndpointTelemetry(); // If there are no installed endpoints return the default telemetry object

  if (!endpointAgents || endpointAgentsCount < 1) return endpointTelemetry; // Use unique hosts to prevent any potential duplicates

  const uniqueHosts = new Set();
  let osTracker = {};
  let dailyActiveCount = 0;
  let policyTracker = {
    malware: {
      active: 0,
      inactive: 0,
      failure: 0
    }
  };

  for (let i = 0; i < endpointAgentsCount; i += 1) {
    try {
      const {
        attributes: metadataAttributes
      } = endpointAgents[i];
      const {
        last_checkin: lastCheckin,
        local_metadata: localMetadata
      } = metadataAttributes;
      const {
        host,
        os,
        elastic
      } = localMetadata; // Although not perfect, the goal is to dedupe hosts to get the most recent data for a host
      // An agent re-installed on the same host will have the same id and hostname
      // A cloned VM will have the same id, but "may" have the same hostname, but it's really up to the user.

      const compoundUniqueId = `${host === null || host === void 0 ? void 0 : host.id}-${host === null || host === void 0 ? void 0 : host.hostname}`;

      if (!uniqueHosts.has(compoundUniqueId)) {
        var _elastic$agent;

        uniqueHosts.add(compoundUniqueId);
        const agentId = elastic === null || elastic === void 0 ? void 0 : (_elastic$agent = elastic.agent) === null || _elastic$agent === void 0 ? void 0 : _elastic$agent.id;
        osTracker = updateEndpointOSTelemetry(os, osTracker);

        if (agentId) {
          const {
            saved_objects: agentEvents
          } = await (0, _fleet_saved_objects.getLatestFleetEndpointEvent)(soClient, agentId); // AgentEvents will have a max length of 1

          if (agentEvents && agentEvents.length > 0) {
            const latestEndpointEvent = agentEvents[0];
            dailyActiveCount = updateEndpointDailyActiveCount(latestEndpointEvent, lastCheckin, dailyActiveCount);
            policyTracker = updateEndpointPolicyTelemetry(latestEndpointEvent, policyTracker);
          }
        }
      }
    } catch (error) {// All errors thrown in the loop would be handled here
      // Not logging any errors to avoid leaking any potential PII
      // Depending on when the error is thrown in the loop some specifics may be missing, but it allows the loop to continue
    }
  } // All unique hosts with an endpoint installed, thus all unique endpoint installs


  endpointTelemetry.total_installed = uniqueHosts.size; // Set the daily active count for the endpoints

  endpointTelemetry.active_within_last_24_hours = dailyActiveCount; // Get the objects to populate our OS Telemetry

  endpointTelemetry.os = Object.values(osTracker); // Provide the updated policy information

  endpointTelemetry.policies = policyTracker;
  return endpointTelemetry;
};

exports.getEndpointTelemetryFromFleet = getEndpointTelemetryFromFleet;