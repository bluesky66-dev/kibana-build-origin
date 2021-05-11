"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isMlAdmin = exports.hasMlLicense = exports.validateMlAuthz = exports.buildMlAuthz = void 0;

var _i18n = require("@kbn/i18n");

var _constants = require("../../../common/constants");

var _has_ml_admin_permissions = require("../../../common/machine_learning/has_ml_admin_permissions");

var _helpers = require("../../../common/machine_learning/helpers");

var _cache = require("./cache");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Builds ML authz services
 *
 * @param license A {@link ILicense} representing the user license
 * @param ml {@link MlPluginSetup} ML services to fetch ML capabilities
 * @param request A {@link KibanaRequest} representing the authenticated user
 *
 * @returns A {@link MLAuthz} service object
 */


const buildMlAuthz = ({
  license,
  ml,
  request,
  savedObjectsClient
}) => {
  const cachedValidate = (0, _cache.cache)(() => validateMlAuthz({
    license,
    ml,
    request,
    savedObjectsClient
  }));

  const validateRuleType = async type => {
    if (!(0, _helpers.isMlRule)(type)) {
      return {
        valid: true,
        message: undefined
      };
    } else {
      return cachedValidate();
    }
  };

  return {
    validateRuleType
  };
};
/**
 * Validates ML authorization for the current request
 *
 * @param license A {@link ILicense} representing the user license
 * @param ml {@link MlPluginSetup} ML services to fetch ML capabilities
 * @param request A {@link KibanaRequest} representing the authenticated user
 *
 * @returns A {@link Validation} validation
 */


exports.buildMlAuthz = buildMlAuthz;

const validateMlAuthz = async ({
  license,
  ml,
  request,
  savedObjectsClient
}) => {
  let message;

  if (ml == null) {
    message = _i18n.i18n.translate('xpack.securitySolution.authz.mlUnavailable', {
      defaultMessage: 'The machine learning plugin is not available. Try enabling the plugin.'
    });
  } else if (!hasMlLicense(license)) {
    message = _i18n.i18n.translate('xpack.securitySolution.licensing.unsupportedMachineLearningMessage', {
      defaultMessage: 'Your license does not support machine learning. Please upgrade your license.'
    });
  } else if (!(await isMlAdmin({
    ml,
    request,
    savedObjectsClient
  }))) {
    message = _i18n.i18n.translate('xpack.securitySolution.authz.userIsNotMlAdminMessage', {
      defaultMessage: 'The current user is not a machine learning administrator.'
    });
  }

  return {
    valid: message === undefined,
    message
  };
};
/**
 * Whether the license allows ML usage
 *
 * @param license A {@link ILicense} representing the user license
 *
 */


exports.validateMlAuthz = validateMlAuthz;

const hasMlLicense = license => license.hasAtLeast(_constants.MINIMUM_ML_LICENSE);
/**
 * Whether the requesting user is an ML Admin
 *
 * @param request A {@link KibanaRequest} representing the authenticated user
 * @param ml {@link MlPluginSetup} ML services to fetch ML capabilities
 *
 */


exports.hasMlLicense = hasMlLicense;

const isMlAdmin = async ({
  request,
  savedObjectsClient,
  ml
}) => {
  const mlCapabilities = await ml.mlSystemProvider(request, savedObjectsClient).mlCapabilities();
  return (0, _has_ml_admin_permissions.hasMlAdminPermissions)(mlCapabilities);
};

exports.isMlAdmin = isMlAdmin;