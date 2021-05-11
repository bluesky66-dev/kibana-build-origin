"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupIngestManager = setupIngestManager;
exports.setupFleet = setupFleet;

var _uuid = _interopRequireDefault(require("uuid"));

var _agent_policy = require("./agent_policy");

var _output = require("./output");

var _install = require("./epm/packages/install");

var _common = require("../../common");

var _constants = require("../constants");

var _packages = require("./epm/packages");

var _package_policy = require("./package_policy");

var _api_keys = require("./api_keys");

var _ = require(".");

var _setup_utils = require("./setup_utils");

var _settings = require("./settings");

var _agents = require("./agents");

var _app_context = require("./app_context");

var _fleet_server = require("./fleet_server");

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


const FLEET_ENROLL_USERNAME = 'fleet_enroll';
const FLEET_ENROLL_ROLE = 'fleet_enroll';

async function setupIngestManager(soClient, esClient, callCluster) {
  return (0, _setup_utils.awaitIfPending)(async () => createSetupSideEffects(soClient, esClient, callCluster));
}

async function createSetupSideEffects(soClient, esClient, callCluster) {
  var _appContextService$ge;

  const isFleetServerEnabled = (_appContextService$ge = _app_context.appContextService.getConfig()) === null || _appContextService$ge === void 0 ? void 0 : _appContextService$ge.agents.fleetServerEnabled;
  const [installedPackages, defaultOutput, {
    created: defaultAgentPolicyCreated,
    defaultAgentPolicy
  }, {
    created: defaultFleetServerPolicyCreated,
    policy: defaultFleetServerPolicy
  }] = await Promise.all([// packages installed by default
  (0, _install.ensureInstalledDefaultPackages)(soClient, callCluster), _output.outputService.ensureDefaultOutput(soClient), _agent_policy.agentPolicyService.ensureDefaultAgentPolicy(soClient, esClient), isFleetServerEnabled ? _agent_policy.agentPolicyService.ensureDefaultFleetServerAgentPolicy(soClient, esClient) : {}, updateFleetRoleIfExists(callCluster), _.settingsService.getSettings(soClient).catch(e => {
    if (e.isBoom && e.output.statusCode === 404) {
      const defaultSettings = (0, _settings.createDefaultSettings)();
      return _.settingsService.saveSettings(soClient, defaultSettings);
    }

    return Promise.reject(e);
  })]); // Keeping this outside of the Promise.all because it introduces a race condition.
  // If one of the required packages fails to install/upgrade it might get stuck in the installing state.
  // On the next call to the /setup API, if there is a upgrade available for one of the required packages a race condition
  // will occur between upgrading the package and reinstalling the previously failed package.
  // By moving this outside of the Promise.all, the upgrade will occur first, and then we'll attempt to reinstall any
  // packages that are stuck in the installing state.

  await (0, _install.ensurePackagesCompletedInstall)(soClient, callCluster);

  if (isFleetServerEnabled) {
    await (0, _fleet_server.awaitIfFleetServerSetupPending)();
    const fleetServerPackage = await (0, _install.ensureInstalledPackage)({
      savedObjectsClient: soClient,
      pkgName: _common.FLEET_SERVER_PACKAGE,
      callCluster
    });

    if (defaultFleetServerPolicyCreated) {
      await addPackageToAgentPolicy(soClient, esClient, callCluster, fleetServerPackage, defaultFleetServerPolicy, defaultOutput);
    }
  } // If we just created the default fleet server policy add the fleet server package
  // If we just created the default policy, ensure default packages are added to it


  if (defaultAgentPolicyCreated) {
    const agentPolicyWithPackagePolicies = await _agent_policy.agentPolicyService.get(soClient, defaultAgentPolicy.id, true);

    if (!agentPolicyWithPackagePolicies) {
      throw new Error('Policy not found');
    }

    if (agentPolicyWithPackagePolicies.package_policies.length && typeof agentPolicyWithPackagePolicies.package_policies[0] === 'string') {
      throw new Error('Policy not found');
    }

    for (const installedPackage of installedPackages) {
      const packageShouldBeInstalled = _common.DEFAULT_AGENT_POLICIES_PACKAGES.some(packageName => installedPackage.name === packageName);

      if (!packageShouldBeInstalled) {
        continue;
      }

      const isInstalled = agentPolicyWithPackagePolicies.package_policies.some(d => {
        var _d$package;

        return typeof d !== 'string' && ((_d$package = d.package) === null || _d$package === void 0 ? void 0 : _d$package.name) === installedPackage.name;
      });

      if (!isInstalled) {
        await addPackageToAgentPolicy(soClient, esClient, callCluster, installedPackage, agentPolicyWithPackagePolicies, defaultOutput);
      }
    }
  }

  await (0, _agents.ensureAgentActionPolicyChangeExists)(soClient);
  return {
    isIntialized: true
  };
}

async function updateFleetRoleIfExists(callCluster) {
  try {
    await callCluster('transport.request', {
      method: 'GET',
      path: `/_security/role/${FLEET_ENROLL_ROLE}`
    });
  } catch (e) {
    if (e.status === 404) {
      return;
    }

    throw e;
  }

  return putFleetRole(callCluster);
}

async function putFleetRole(callCluster) {
  return callCluster('transport.request', {
    method: 'PUT',
    path: `/_security/role/${FLEET_ENROLL_ROLE}`,
    body: {
      cluster: ['monitor', 'manage_api_key'],
      indices: [{
        names: ['logs-*', 'metrics-*', 'traces-*', '.logs-endpoint.diagnostic.collection-*'],
        privileges: ['auto_configure', 'create_doc']
      }]
    }
  });
}

async function setupFleet(soClient, esClient, callCluster, options) {
  // Create fleet_enroll role
  // This should be done directly in ES at some point
  const res = await putFleetRole(callCluster); // If the role is already created skip the rest unless you have forceRecreate set to true

  if ((options === null || options === void 0 ? void 0 : options.forceRecreate) !== true && res.role.created === false) {
    return;
  }

  const password = generateRandomPassword(); // Create fleet enroll user

  await callCluster('transport.request', {
    method: 'PUT',
    path: `/_security/user/${FLEET_ENROLL_USERNAME}`,
    body: {
      password,
      roles: [FLEET_ENROLL_ROLE],
      metadata: {
        updated_at: new Date().toISOString()
      }
    }
  });

  _output.outputService.invalidateCache(); // save fleet admin user


  const defaultOutputId = await _output.outputService.getDefaultOutputId(soClient);

  if (!defaultOutputId) {
    throw new Error('Default output does not exist');
  }

  await _output.outputService.updateOutput(soClient, defaultOutputId, {
    fleet_enroll_username: FLEET_ENROLL_USERNAME,
    fleet_enroll_password: password
  });
  const {
    items: agentPolicies
  } = await _agent_policy.agentPolicyService.list(soClient, {
    perPage: _constants.SO_SEARCH_LIMIT
  });
  await Promise.all(agentPolicies.map(agentPolicy => {
    return (0, _api_keys.generateEnrollmentAPIKey)(soClient, esClient, {
      name: `Default`,
      agentPolicyId: agentPolicy.id
    });
  }));
  await Promise.all(agentPolicies.map(agentPolicy => _agent_policy.agentPolicyService.createFleetPolicyChangeAction(soClient, agentPolicy.id)));
}

function generateRandomPassword() {
  return Buffer.from(_uuid.default.v4()).toString('base64');
}

async function addPackageToAgentPolicy(soClient, esClient, callCluster, packageToInstall, agentPolicy, defaultOutput) {
  const packageInfo = await (0, _packages.getPackageInfo)({
    savedObjectsClient: soClient,
    pkgName: packageToInstall.name,
    pkgVersion: packageToInstall.version
  });
  const newPackagePolicy = (0, _common.packageToPackagePolicy)(packageInfo, agentPolicy.id, defaultOutput.id, agentPolicy.namespace);
  await _package_policy.packagePolicyService.create(soClient, esClient, callCluster, newPackagePolicy, {
    bumpRevision: false
  });
}