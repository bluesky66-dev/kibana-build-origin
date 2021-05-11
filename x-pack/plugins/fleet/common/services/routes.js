"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupRouteService = exports.enrollmentAPIKeyRouteService = exports.appRoutesService = exports.settingsRoutesService = exports.outputRoutesService = exports.agentRouteService = exports.fleetSetupRouteService = exports.dataStreamRouteService = exports.agentPolicyRouteService = exports.packagePolicyRouteService = exports.epmRouteService = void 0;

var _constants = require("../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const epmRouteService = {
  getCategoriesPath: () => {
    return _constants.EPM_API_ROUTES.CATEGORIES_PATTERN;
  },
  getListPath: () => {
    return _constants.EPM_API_ROUTES.LIST_PATTERN;
  },
  getListLimitedPath: () => {
    return _constants.EPM_API_ROUTES.LIMITED_LIST_PATTERN;
  },
  getInfoPath: pkgkey => {
    return _constants.EPM_API_ROUTES.INFO_PATTERN.replace('{pkgkey}', pkgkey);
  },
  getStatsPath: pkgName => {
    return _constants.EPM_API_ROUTES.STATS_PATTERN.replace('{pkgName}', pkgName);
  },
  getFilePath: filePath => {
    return `${_constants.EPM_API_ROOT}${filePath.replace('/package', '/packages')}`;
  },
  getInstallPath: pkgkey => {
    return _constants.EPM_API_ROUTES.INSTALL_FROM_REGISTRY_PATTERN.replace('{pkgkey}', pkgkey).replace(/\/$/, ''); // trim trailing slash
  },
  getBulkInstallPath: () => {
    return _constants.EPM_API_ROUTES.BULK_INSTALL_PATTERN;
  },
  getRemovePath: pkgkey => {
    return _constants.EPM_API_ROUTES.DELETE_PATTERN.replace('{pkgkey}', pkgkey).replace(/\/$/, ''); // trim trailing slash
  }
};
exports.epmRouteService = epmRouteService;
const packagePolicyRouteService = {
  getListPath: () => {
    return _constants.PACKAGE_POLICY_API_ROUTES.LIST_PATTERN;
  },
  getInfoPath: packagePolicyId => {
    return _constants.PACKAGE_POLICY_API_ROUTES.INFO_PATTERN.replace('{packagePolicyId}', packagePolicyId);
  },
  getCreatePath: () => {
    return _constants.PACKAGE_POLICY_API_ROUTES.CREATE_PATTERN;
  },
  getUpdatePath: packagePolicyId => {
    return _constants.PACKAGE_POLICY_API_ROUTES.UPDATE_PATTERN.replace('{packagePolicyId}', packagePolicyId);
  },
  getDeletePath: () => {
    return _constants.PACKAGE_POLICY_API_ROUTES.DELETE_PATTERN;
  }
};
exports.packagePolicyRouteService = packagePolicyRouteService;
const agentPolicyRouteService = {
  getListPath: () => {
    return _constants.AGENT_POLICY_API_ROUTES.LIST_PATTERN;
  },
  getInfoPath: agentPolicyId => {
    return _constants.AGENT_POLICY_API_ROUTES.INFO_PATTERN.replace('{agentPolicyId}', agentPolicyId);
  },
  getCreatePath: () => {
    return _constants.AGENT_POLICY_API_ROUTES.CREATE_PATTERN;
  },
  getUpdatePath: agentPolicyId => {
    return _constants.AGENT_POLICY_API_ROUTES.UPDATE_PATTERN.replace('{agentPolicyId}', agentPolicyId);
  },
  getCopyPath: agentPolicyId => {
    return _constants.AGENT_POLICY_API_ROUTES.COPY_PATTERN.replace('{agentPolicyId}', agentPolicyId);
  },
  getDeletePath: () => {
    return _constants.AGENT_POLICY_API_ROUTES.DELETE_PATTERN;
  },
  getInfoFullPath: agentPolicyId => {
    return _constants.AGENT_POLICY_API_ROUTES.FULL_INFO_PATTERN.replace('{agentPolicyId}', agentPolicyId);
  },
  getInfoFullDownloadPath: agentPolicyId => {
    return _constants.AGENT_POLICY_API_ROUTES.FULL_INFO_DOWNLOAD_PATTERN.replace('{agentPolicyId}', agentPolicyId);
  }
};
exports.agentPolicyRouteService = agentPolicyRouteService;
const dataStreamRouteService = {
  getListPath: () => {
    return _constants.DATA_STREAM_API_ROUTES.LIST_PATTERN;
  }
};
exports.dataStreamRouteService = dataStreamRouteService;
const fleetSetupRouteService = {
  getFleetSetupPath: () => _constants.AGENTS_SETUP_API_ROUTES.INFO_PATTERN,
  postFleetSetupPath: () => _constants.AGENTS_SETUP_API_ROUTES.CREATE_PATTERN
};
exports.fleetSetupRouteService = fleetSetupRouteService;
const agentRouteService = {
  getInfoPath: agentId => _constants.AGENT_API_ROUTES.INFO_PATTERN.replace('{agentId}', agentId),
  getUpdatePath: agentId => _constants.AGENT_API_ROUTES.UPDATE_PATTERN.replace('{agentId}', agentId),
  getEventsPath: agentId => _constants.AGENT_API_ROUTES.EVENTS_PATTERN.replace('{agentId}', agentId),
  getUnenrollPath: agentId => _constants.AGENT_API_ROUTES.UNENROLL_PATTERN.replace('{agentId}', agentId),
  getBulkUnenrollPath: () => _constants.AGENT_API_ROUTES.BULK_UNENROLL_PATTERN,
  getReassignPath: agentId => _constants.AGENT_API_ROUTES.REASSIGN_PATTERN.replace('{agentId}', agentId),
  getBulkReassignPath: () => _constants.AGENT_API_ROUTES.BULK_REASSIGN_PATTERN,
  getUpgradePath: agentId => _constants.AGENT_API_ROUTES.UPGRADE_PATTERN.replace('{agentId}', agentId),
  getBulkUpgradePath: () => _constants.AGENT_API_ROUTES.BULK_UPGRADE_PATTERN,
  getListPath: () => _constants.AGENT_API_ROUTES.LIST_PATTERN,
  getStatusPath: () => _constants.AGENT_API_ROUTES.STATUS_PATTERN,
  getCreateActionPath: agentId => _constants.AGENT_API_ROUTES.ACTIONS_PATTERN.replace('{agentId}', agentId)
};
exports.agentRouteService = agentRouteService;
const outputRoutesService = {
  getInfoPath: outputId => _constants.OUTPUT_API_ROUTES.INFO_PATTERN.replace('{outputId}', outputId),
  getUpdatePath: outputId => _constants.OUTPUT_API_ROUTES.UPDATE_PATTERN.replace('{outputId}', outputId),
  getListPath: () => _constants.OUTPUT_API_ROUTES.LIST_PATTERN
};
exports.outputRoutesService = outputRoutesService;
const settingsRoutesService = {
  getInfoPath: () => _constants.SETTINGS_API_ROUTES.INFO_PATTERN,
  getUpdatePath: () => _constants.SETTINGS_API_ROUTES.UPDATE_PATTERN
};
exports.settingsRoutesService = settingsRoutesService;
const appRoutesService = {
  getCheckPermissionsPath: () => _constants.APP_API_ROUTES.CHECK_PERMISSIONS_PATTERN
};
exports.appRoutesService = appRoutesService;
const enrollmentAPIKeyRouteService = {
  getListPath: () => _constants.ENROLLMENT_API_KEY_ROUTES.LIST_PATTERN,
  getCreatePath: () => _constants.ENROLLMENT_API_KEY_ROUTES.CREATE_PATTERN,
  getInfoPath: keyId => _constants.ENROLLMENT_API_KEY_ROUTES.INFO_PATTERN.replace('{keyId}', keyId),
  getDeletePath: keyId => _constants.ENROLLMENT_API_KEY_ROUTES.DELETE_PATTERN.replace('{keyId}', keyId)
};
exports.enrollmentAPIKeyRouteService = enrollmentAPIKeyRouteService;
const setupRouteService = {
  getSetupPath: () => _constants.SETUP_API_ROUTE
};
exports.setupRouteService = setupRouteService;