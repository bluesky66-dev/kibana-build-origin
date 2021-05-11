"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.indexHostsAndAlerts = indexHostsAndAlerts;

var _seedrandom = _interopRequireDefault(require("seedrandom"));

var _generate_data = require("./generate_data");

var _ecs_safety_helpers = require("./models/ecs_safety_helpers");

var _common = require("../../../fleet/common");

var _policy_config = require("./models/policy_config");

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


async function indexHostsAndAlerts(client, kbnClient, seed, numHosts, numDocs, metadataIndex, policyResponseIndex, eventIndex, alertIndex, alertsPerHost, fleet, options = {}) {
  const random = (0, _seedrandom.default)(seed);
  const epmEndpointPackage = await getEndpointPackageInfo(kbnClient); // Keep a map of host applied policy ids (fake) to real ingest package configs (policy record)

  const realPolicies = {};

  for (let i = 0; i < numHosts; i++) {
    const generator = new _generate_data.EndpointDocGenerator(random);
    await indexHostDocs({
      numDocs,
      client,
      kbnClient,
      realPolicies,
      epmEndpointPackage,
      metadataIndex,
      policyResponseIndex,
      enrollFleet: fleet,
      generator
    });
    await indexAlerts({
      client,
      eventIndex,
      alertIndex,
      generator,
      numAlerts: alertsPerHost,
      options
    });
  }

  await client.indices.refresh({
    index: eventIndex
  }); // TODO: Unclear why the documents are not showing up after the call to refresh.
  // Waiting 5 seconds allows the indices to refresh automatically and
  // the documents become available in API/integration tests.

  await delay(5000);
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function indexHostDocs({
  numDocs,
  client,
  kbnClient,
  realPolicies,
  epmEndpointPackage,
  metadataIndex,
  policyResponseIndex,
  enrollFleet,
  generator
}) {
  const timeBetweenDocs = 6 * 3600 * 1000; // 6 hours between metadata documents

  const timestamp = new Date().getTime();
  let hostMetadata;
  let wasAgentEnrolled = false;
  let enrolledAgent;

  for (let j = 0; j < numDocs; j++) {
    generator.updateHostData();
    generator.updateHostPolicyData();
    hostMetadata = generator.generateHostMetadata(timestamp - timeBetweenDocs * (numDocs - j - 1), _generate_data.EndpointDocGenerator.createDataStreamFromIndex(metadataIndex));

    if (enrollFleet) {
      var _enrolledAgent$id, _enrolledAgent;

      const {
        id: appliedPolicyId,
        name: appliedPolicyName
      } = hostMetadata.Endpoint.policy.applied; // If we don't yet have a "real" policy record, then create it now in ingest (package config)

      if (!realPolicies[appliedPolicyId]) {
        // eslint-disable-next-line require-atomic-updates
        realPolicies[appliedPolicyId] = await createPolicy(kbnClient, appliedPolicyName, epmEndpointPackage.version);
      } // If we did not yet enroll an agent for this Host, do it now that we have good policy id


      if (!wasAgentEnrolled) {
        wasAgentEnrolled = true;
        enrolledAgent = await fleetEnrollAgentForHost(kbnClient, hostMetadata, realPolicies[appliedPolicyId].policy_id);
      } // Update the Host metadata record with the ID of the "real" policy along with the enrolled agent id


      hostMetadata = { ...hostMetadata,
        elastic: { ...hostMetadata.elastic,
          agent: { ...hostMetadata.elastic.agent,
            id: (_enrolledAgent$id = (_enrolledAgent = enrolledAgent) === null || _enrolledAgent === void 0 ? void 0 : _enrolledAgent.id) !== null && _enrolledAgent$id !== void 0 ? _enrolledAgent$id : hostMetadata.elastic.agent.id
          }
        },
        Endpoint: { ...hostMetadata.Endpoint,
          policy: { ...hostMetadata.Endpoint.policy,
            applied: { ...hostMetadata.Endpoint.policy.applied,
              id: realPolicies[appliedPolicyId].id
            }
          }
        }
      };
    }

    await client.index({
      index: metadataIndex,
      body: hostMetadata,
      op_type: 'create'
    });
    await client.index({
      index: policyResponseIndex,
      body: generator.generatePolicyResponse({
        ts: timestamp - timeBetweenDocs * (numDocs - j - 1),
        policyDataStream: _generate_data.EndpointDocGenerator.createDataStreamFromIndex(policyResponseIndex)
      }),
      op_type: 'create'
    });
  }
}

async function indexAlerts({
  client,
  eventIndex,
  alertIndex,
  generator,
  numAlerts,
  options = {}
}) {
  const alertGenerator = generator.alertsGenerator(numAlerts, options);
  let result = alertGenerator.next();

  while (!result.done) {
    let k = 0;
    const resolverDocs = [];

    while (k < 1000 && !result.done) {
      resolverDocs.push(result.value);
      result = alertGenerator.next();
      k++;
    }

    const body = resolverDocs.reduce( // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (array, doc) => {
      var _doc$event;

      let index = eventIndex;

      if ((0, _ecs_safety_helpers.firstNonNullValue)((_doc$event = doc.event) === null || _doc$event === void 0 ? void 0 : _doc$event.kind) === 'alert') {
        index = alertIndex;
      }

      array.push({
        create: {
          _index: index
        }
      }, doc);
      return array;
    }, []);
    await client.bulk({
      body,
      refresh: true
    });
  }
}

const createPolicy = async (kbnClient, policyName, endpointPackageVersion) => {
  // Create Agent Policy first
  const newAgentPolicyData = {
    name: `Policy for ${policyName} (${Math.random().toString(36).substr(2, 5)})`,
    description: `Policy created with endpoint data generator (${policyName})`,
    namespace: 'default'
  };
  let agentPolicy;

  try {
    agentPolicy = await kbnClient.request({
      path: _common.AGENT_POLICY_API_ROUTES.CREATE_PATTERN,
      method: 'POST',
      body: newAgentPolicyData
    });
  } catch (error) {
    throw new Error(`create policy ${error}`);
  } // Create Package Configuration


  const newPackagePolicyData = {
    name: policyName,
    description: 'Protect the worlds data',
    policy_id: agentPolicy.data.item.id,
    enabled: true,
    output_id: '',
    inputs: [{
      type: 'endpoint',
      enabled: true,
      streams: [],
      config: {
        policy: {
          value: (0, _policy_config.policyFactory)()
        }
      }
    }],
    namespace: 'default',
    package: {
      name: 'endpoint',
      title: 'endpoint',
      version: endpointPackageVersion
    }
  };
  const packagePolicy = await kbnClient.request({
    path: _common.PACKAGE_POLICY_API_ROUTES.CREATE_PATTERN,
    method: 'POST',
    body: newPackagePolicyData
  });
  return packagePolicy.data.item;
};

const getEndpointPackageInfo = async kbnClient => {
  const endpointPackage = (await kbnClient.request({
    path: `${_common.EPM_API_ROUTES.LIST_PATTERN}?category=security`,
    method: 'GET'
  })).data.response.find(epmPackage => epmPackage.name === 'endpoint');

  if (!endpointPackage) {
    throw new Error('EPM Endpoint package was not found!');
  }

  return endpointPackage;
};

const fleetEnrollAgentForHost = async (kbnClient, endpointHost, agentPolicyId) => {
  // Get Enrollement key for host's applied policy
  const enrollmentApiKey = await kbnClient.request({
    path: _common.ENROLLMENT_API_KEY_ROUTES.LIST_PATTERN,
    method: 'GET',
    query: {
      kuery: `fleet-enrollment-api-keys.policy_id:"${agentPolicyId}"`
    }
  }).then(apiKeysResponse => {
    const apiKey = apiKeysResponse.data.list[0];

    if (!apiKey) {
      return Promise.reject(new Error(`no API enrollment key found for agent policy id ${agentPolicyId}`));
    }

    return kbnClient.request({
      path: _common.ENROLLMENT_API_KEY_ROUTES.INFO_PATTERN.replace('{keyId}', apiKey.id),
      method: 'GET'
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log('unable to retrieve enrollment api key for policy');
      return Promise.reject(error);
    });
  }).then(apiKeyDetailsResponse => {
    return apiKeyDetailsResponse.data.item.api_key;
  }).catch(error => {
    // eslint-disable-next-line no-console
    console.error(error);
    return '';
  });

  if (enrollmentApiKey.length === 0) {
    return;
  }

  const fetchKibanaVersion = async () => {
    const version = (await kbnClient.request({
      path: '/api/status',
      method: 'GET'
    })).data.version.number;

    if (!version) {
      // eslint-disable-next-line no-console
      console.log('failed to retrieve kibana version');
    }

    return version;
  }; // Enroll an agent for the Host


  const body = {
    type: 'PERMANENT',
    metadata: {
      local: {
        elastic: {
          agent: {
            version: await fetchKibanaVersion()
          }
        },
        host: { ...endpointHost.host
        },
        os: {
          family: 'windows',
          kernel: '10.0.19041.388 (WinBuild.160101.0800)',
          platform: 'windows',
          version: '10.0',
          name: 'Windows 10 Pro',
          full: 'Windows 10 Pro(10.0)'
        }
      },
      user_provided: {
        dev_agent_version: '0.0.1',
        region: 'us-east'
      }
    }
  };

  try {
    // First enroll the agent
    const res = await kbnClient.requestWithApiKey(_common.AGENT_API_ROUTES.ENROLL_PATTERN, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'kbn-xsrf': 'xxx',
        Authorization: `ApiKey ${enrollmentApiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (res) {
      const enrollObj = await res.json();

      if (!res.ok) {
        // eslint-disable-next-line no-console
        console.error('unable to enroll agent', enrollObj);
        return;
      } // ------------------------------------------------
      // now check the agent in so that it can complete enrollment


      const checkinBody = {
        events: [{
          type: 'STATE',
          subtype: 'RUNNING',
          message: 'state changed from STOPPED to RUNNING',
          timestamp: new Date().toISOString(),
          payload: {
            random: 'data',
            state: 'RUNNING',
            previous_state: 'STOPPED'
          },
          agent_id: enrollObj.item.id
        }]
      };
      const checkinRes = await kbnClient.requestWithApiKey(_common.AGENT_API_ROUTES.CHECKIN_PATTERN.replace('{agentId}', enrollObj.item.id), {
        method: 'POST',
        body: JSON.stringify(checkinBody),
        headers: {
          'kbn-xsrf': 'xxx',
          Authorization: `ApiKey ${enrollObj.item.access_api_key}`,
          'Content-Type': 'application/json'
        }
      }).catch(error => {
        return Promise.reject(error);
      }); // Agent unenrolling?

      if (checkinRes.status === 403) {
        return;
      }

      const checkinObj = await checkinRes.json();

      if (!checkinRes.ok) {
        // eslint-disable-next-line no-console
        console.error(`failed to checkin agent [${enrollObj.item.id}] for endpoint [${endpointHost.host.id}]`);
        return enrollObj.item;
      } // ------------------------------------------------
      // If we have an action to ack(), then do it now


      if (checkinObj.actions.length) {
        const ackActionBody = {
          // @ts-ignore
          events: checkinObj.actions.map(action => {
            return {
              action_id: action.id,
              type: 'ACTION_RESULT',
              subtype: 'CONFIG',
              timestamp: new Date().toISOString(),
              agent_id: action.agent_id,
              policy_id: agentPolicyId,
              message: `endpoint generator: Endpoint Started`
            };
          })
        };
        const ackActionResp = await kbnClient.requestWithApiKey(_common.AGENT_API_ROUTES.ACKS_PATTERN.replace('{agentId}', enrollObj.item.id), {
          method: 'POST',
          body: JSON.stringify(ackActionBody),
          headers: {
            'kbn-xsrf': 'xxx',
            Authorization: `ApiKey ${enrollObj.item.access_api_key}`,
            'Content-Type': 'application/json'
          }
        });
        const ackActionObj = await ackActionResp.json();

        if (!ackActionResp.ok) {
          // eslint-disable-next-line no-console
          console.error(`failed to ACK Actions provided to agent [${enrollObj.item.id}] for endpoint [${endpointHost.host.id}]`); // eslint-disable-next-line no-console

          console.error(JSON.stringify(ackActionObj, null, 2));
          return enrollObj.item;
        }
      }

      return enrollObj.item;
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};