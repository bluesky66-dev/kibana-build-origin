"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deletePackagePolicyHandler = exports.updatePackagePolicyHandler = exports.createPackagePolicyHandler = exports.getOnePackagePolicyHandler = exports.getPackagePoliciesHandler = void 0;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _server = require("../../../../../../src/core/server");

var _services = require("../../services");

var _errors = require("../../errors");

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


const getPackagePoliciesHandler = async (context, request, response) => {
  const soClient = context.core.savedObjects.client;

  try {
    const {
      items,
      total,
      page,
      perPage
    } = await _services.packagePolicyService.list(soClient, request.query);
    return response.ok({
      body: {
        items,
        total,
        page,
        perPage
      }
    });
  } catch (error) {
    return (0, _errors.defaultIngestErrorHandler)({
      error,
      response
    });
  }
};

exports.getPackagePoliciesHandler = getPackagePoliciesHandler;

const getOnePackagePolicyHandler = async (context, request, response) => {
  const soClient = context.core.savedObjects.client;
  const {
    packagePolicyId
  } = request.params;

  const notFoundResponse = () => response.notFound({
    body: {
      message: `Package policy ${packagePolicyId} not found`
    }
  });

  try {
    const packagePolicy = await _services.packagePolicyService.get(soClient, packagePolicyId);

    if (packagePolicy) {
      return response.ok({
        body: {
          item: packagePolicy
        }
      });
    } else {
      return notFoundResponse();
    }
  } catch (error) {
    if (_server.SavedObjectsErrorHelpers.isNotFoundError(error)) {
      return notFoundResponse();
    } else {
      return (0, _errors.defaultIngestErrorHandler)({
        error,
        response
      });
    }
  }
};

exports.getOnePackagePolicyHandler = getOnePackagePolicyHandler;

const createPackagePolicyHandler = async (context, request, response) => {
  var _appContextService$ge;

  const soClient = context.core.savedObjects.client;
  const esClient = context.core.elasticsearch.client.asCurrentUser;
  const callCluster = context.core.elasticsearch.legacy.client.callAsCurrentUser;
  const user = (await ((_appContextService$ge = _services.appContextService.getSecurity()) === null || _appContextService$ge === void 0 ? void 0 : _appContextService$ge.authc.getCurrentUser(request))) || undefined;

  try {
    const newData = await _services.packagePolicyService.runExternalCallbacks('packagePolicyCreate', { ...request.body
    }, context, request); // Create package policy

    const packagePolicy = await _services.packagePolicyService.create(soClient, esClient, callCluster, newData, {
      user
    });
    const body = {
      item: packagePolicy
    };
    return response.ok({
      body
    });
  } catch (error) {
    if (error.statusCode) {
      return response.customError({
        statusCode: error.statusCode,
        body: {
          message: error.message
        }
      });
    }

    return (0, _errors.defaultIngestErrorHandler)({
      error,
      response
    });
  }
};

exports.createPackagePolicyHandler = createPackagePolicyHandler;

const updatePackagePolicyHandler = async (context, request, response) => {
  var _appContextService$ge2;

  const soClient = context.core.savedObjects.client;
  const esClient = context.core.elasticsearch.client.asCurrentUser;
  const user = (await ((_appContextService$ge2 = _services.appContextService.getSecurity()) === null || _appContextService$ge2 === void 0 ? void 0 : _appContextService$ge2.authc.getCurrentUser(request))) || undefined;
  const packagePolicy = await _services.packagePolicyService.get(soClient, request.params.packagePolicyId);

  if (!packagePolicy) {
    throw _boom.default.notFound('Package policy not found');
  }

  let newData = { ...request.body
  };
  const pkg = newData.package || packagePolicy.package;
  const inputs = newData.inputs || packagePolicy.inputs;

  try {
    newData = await _services.packagePolicyService.runExternalCallbacks('packagePolicyUpdate', newData, context, request);
    const updatedPackagePolicy = await _services.packagePolicyService.update(soClient, esClient, request.params.packagePolicyId, { ...newData,
      package: pkg,
      inputs
    }, {
      user
    });
    return response.ok({
      body: {
        item: updatedPackagePolicy
      }
    });
  } catch (error) {
    return (0, _errors.defaultIngestErrorHandler)({
      error,
      response
    });
  }
};

exports.updatePackagePolicyHandler = updatePackagePolicyHandler;

const deletePackagePolicyHandler = async (context, request, response) => {
  var _appContextService$ge3;

  const soClient = context.core.savedObjects.client;
  const esClient = context.core.elasticsearch.client.asCurrentUser;
  const user = (await ((_appContextService$ge3 = _services.appContextService.getSecurity()) === null || _appContextService$ge3 === void 0 ? void 0 : _appContextService$ge3.authc.getCurrentUser(request))) || undefined;

  try {
    const body = await _services.packagePolicyService.delete(soClient, esClient, request.body.packagePolicyIds, {
      user
    });
    return response.ok({
      body
    });
  } catch (error) {
    return (0, _errors.defaultIngestErrorHandler)({
      error,
      response
    });
  }
};

exports.deletePackagePolicyHandler = deletePackagePolicyHandler;