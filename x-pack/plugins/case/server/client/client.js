"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CaseClientHandler = void 0;

var _create = require("./cases/create");

var _update = require("./cases/update");

var _add = require("./comments/add");

var _get_fields = require("./configure/get_fields");

var _get_mappings = require("./configure/get_mappings");

var _update_status = require("./alerts/update_status");

var _get = require("./cases/get");

var _get2 = require("./user_actions/get");

var _get3 = require("./alerts/get");

var _push = require("./cases/push");

var _error = require("../common/error");

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}
/**
 * This class is a pass through for common case functionality (like creating, get a case).
 */


class CaseClientHandler {
  constructor(clientArgs) {
    _defineProperty(this, "_scopedClusterClient", void 0);

    _defineProperty(this, "_caseConfigureService", void 0);

    _defineProperty(this, "_caseService", void 0);

    _defineProperty(this, "_connectorMappingsService", void 0);

    _defineProperty(this, "user", void 0);

    _defineProperty(this, "_savedObjectsClient", void 0);

    _defineProperty(this, "_userActionService", void 0);

    _defineProperty(this, "_alertsService", void 0);

    _defineProperty(this, "logger", void 0);

    this._scopedClusterClient = clientArgs.scopedClusterClient;
    this._caseConfigureService = clientArgs.caseConfigureService;
    this._caseService = clientArgs.caseService;
    this._connectorMappingsService = clientArgs.connectorMappingsService;
    this.user = clientArgs.user;
    this._savedObjectsClient = clientArgs.savedObjectsClient;
    this._userActionService = clientArgs.userActionService;
    this._alertsService = clientArgs.alertsService;
    this.logger = clientArgs.logger;
  }

  async create(caseInfo) {
    try {
      return (0, _create.create)({
        savedObjectsClient: this._savedObjectsClient,
        caseService: this._caseService,
        caseConfigureService: this._caseConfigureService,
        userActionService: this._userActionService,
        user: this.user,
        theCase: caseInfo,
        logger: this.logger
      });
    } catch (error) {
      throw (0, _error.createCaseError)({
        message: `Failed to create a new case using client: ${error}`,
        error,
        logger: this.logger
      });
    }
  }

  async update(cases) {
    try {
      return (0, _update.update)({
        savedObjectsClient: this._savedObjectsClient,
        caseService: this._caseService,
        userActionService: this._userActionService,
        user: this.user,
        cases,
        caseClient: this,
        logger: this.logger
      });
    } catch (error) {
      const caseIDVersions = cases.cases.map(caseInfo => ({
        id: caseInfo.id,
        version: caseInfo.version
      }));
      throw (0, _error.createCaseError)({
        message: `Failed to update cases using client: ${JSON.stringify(caseIDVersions)}: ${error}`,
        error,
        logger: this.logger
      });
    }
  }

  async addComment({
    caseId,
    comment
  }) {
    try {
      return (0, _add.addComment)({
        savedObjectsClient: this._savedObjectsClient,
        caseService: this._caseService,
        userActionService: this._userActionService,
        caseClient: this,
        caseId,
        comment,
        user: this.user,
        logger: this.logger
      });
    } catch (error) {
      throw (0, _error.createCaseError)({
        message: `Failed to add comment using client case id: ${caseId}: ${error}`,
        error,
        logger: this.logger
      });
    }
  }

  async getFields(fields) {
    try {
      return (0, _get_fields.getFields)(fields);
    } catch (error) {
      throw (0, _error.createCaseError)({
        message: `Failed to retrieve fields using client: ${error}`,
        error,
        logger: this.logger
      });
    }
  }

  async getMappings(args) {
    try {
      return (0, _get_mappings.getMappings)({ ...args,
        savedObjectsClient: this._savedObjectsClient,
        connectorMappingsService: this._connectorMappingsService,
        caseClient: this,
        logger: this.logger
      });
    } catch (error) {
      throw (0, _error.createCaseError)({
        message: `Failed to get mappings using client: ${error}`,
        error,
        logger: this.logger
      });
    }
  }

  async updateAlertsStatus(args) {
    try {
      return (0, _update_status.updateAlertsStatus)({ ...args,
        alertsService: this._alertsService,
        scopedClusterClient: this._scopedClusterClient,
        logger: this.logger
      });
    } catch (error) {
      throw (0, _error.createCaseError)({
        message: `Failed to update alerts status using client alerts: ${JSON.stringify(args.alerts)}: ${error}`,
        error,
        logger: this.logger
      });
    }
  }

  async get(args) {
    try {
      return (0, _get.get)({ ...args,
        caseService: this._caseService,
        savedObjectsClient: this._savedObjectsClient,
        logger: this.logger
      });
    } catch (error) {
      this.logger.error(`Failed to get case using client id: ${args.id}: ${error}`);
      throw error;
    }
  }

  async getUserActions(args) {
    try {
      return (0, _get2.get)({ ...args,
        savedObjectsClient: this._savedObjectsClient,
        userActionService: this._userActionService
      });
    } catch (error) {
      throw (0, _error.createCaseError)({
        message: `Failed to get user actions using client id: ${args.caseId}: ${error}`,
        error,
        logger: this.logger
      });
    }
  }

  async getAlerts(args) {
    try {
      return (0, _get3.get)({ ...args,
        alertsService: this._alertsService,
        scopedClusterClient: this._scopedClusterClient,
        logger: this.logger
      });
    } catch (error) {
      throw (0, _error.createCaseError)({
        message: `Failed to get alerts using client requested alerts: ${JSON.stringify(args.alertsInfo)}: ${error}`,
        error,
        logger: this.logger
      });
    }
  }

  async push(args) {
    try {
      return (0, _push.push)({ ...args,
        savedObjectsClient: this._savedObjectsClient,
        caseService: this._caseService,
        userActionService: this._userActionService,
        user: this.user,
        caseClient: this,
        caseConfigureService: this._caseConfigureService,
        logger: this.logger
      });
    } catch (error) {
      throw (0, _error.createCaseError)({
        message: `Failed to push case using client id: ${args.caseId}: ${error}`,
        error,
        logger: this.logger
      });
    }
  }

}

exports.CaseClientHandler = CaseClientHandler;