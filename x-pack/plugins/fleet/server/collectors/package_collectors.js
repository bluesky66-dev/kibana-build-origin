"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPackageUsage = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _get = require("../services/epm/packages/get");

var _services = require("../services");

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


const getPackageUsage = async soClient => {
  if (!soClient) {
    return [];
  }

  const packagesSavedObjects = await (0, _get.getPackageSavedObjects)(soClient);
  const agentPolicies = await _services.agentPolicyService.list(soClient, {
    perPage: 1000,
    // avoiding pagination
    withPackagePolicies: true
  }); // Once we provide detailed telemetry on agent policies, this logic should probably be moved
  // to the (then to be created) agent policy collector, so we only query and loop over these
  // objects once.

  const packagesInAgentPolicies = agentPolicies.items.map(agentPolicy => {
    const packagePolicies = agentPolicy.package_policies;
    return packagePolicies.map(packagePolicy => {
      var _packagePolicy$packag;

      return (_packagePolicy$packag = packagePolicy.package) === null || _packagePolicy$packag === void 0 ? void 0 : _packagePolicy$packag.name;
    }).filter(packageName => packageName !== undefined);
  });

  const enabledPackages = _lodash.default.uniq(_lodash.default.flatten(packagesInAgentPolicies));

  return packagesSavedObjects.saved_objects.map(p => {
    return {
      name: p.attributes.name,
      version: p.attributes.version,
      enabled: enabledPackages.includes(p.attributes.name)
    };
  });
};

exports.getPackageUsage = getPackageUsage;