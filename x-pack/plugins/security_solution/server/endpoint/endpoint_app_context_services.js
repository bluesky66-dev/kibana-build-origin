"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EndpointAppContextService = exports.createMetadataService = void 0;

var _ingest_integration = require("./ingest_integration");

var _types = require("../../common/endpoint/types");

var _query_strategies = require("./routes/metadata/support/query_strategies");

var _models = require("../../../fleet/common/types/models");

var _constants = require("../../common/endpoint/constants");

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

const createMetadataService = packageService => {
  return {
    async queryStrategy(savedObjectsClient, version) {
      if (version === _types.MetadataQueryStrategyVersions.VERSION_1) {
        return (0, _query_strategies.metadataQueryStrategyV1)();
      }

      if (!packageService) {
        throw new Error('package service is uninitialized');
      }

      if (version === _types.MetadataQueryStrategyVersions.VERSION_2 || !version) {
        const assets = await packageService.getInstalledEsAssetReferences(savedObjectsClient, 'endpoint');
        const expectedTransformAssets = assets.filter(ref => ref.type === _models.ElasticsearchAssetType.transform && ref.id.startsWith(_constants.metadataTransformPrefix));

        if (expectedTransformAssets && expectedTransformAssets.length === 1) {
          return (0, _query_strategies.metadataQueryStrategyV2)();
        }

        return (0, _query_strategies.metadataQueryStrategyV1)();
      }

      return (0, _query_strategies.metadataQueryStrategyV1)();
    }

  };
};

exports.createMetadataService = createMetadataService;
/**
 * A singleton that holds shared services that are initialized during the start up phase
 * of the plugin lifecycle. And stop during the stop phase, if needed.
 */

class EndpointAppContextService {
  constructor() {
    _defineProperty(this, "agentService", void 0);

    _defineProperty(this, "manifestManager", void 0);

    _defineProperty(this, "packagePolicyService", void 0);

    _defineProperty(this, "agentPolicyService", void 0);

    _defineProperty(this, "savedObjectsStart", void 0);

    _defineProperty(this, "metadataService", void 0);
  }

  start(dependencies) {
    this.agentService = dependencies.agentService;
    this.packagePolicyService = dependencies.packagePolicyService;
    this.agentPolicyService = dependencies.agentPolicyService;
    this.manifestManager = dependencies.manifestManager;
    this.savedObjectsStart = dependencies.savedObjectsStart;
    this.metadataService = createMetadataService(dependencies.packageService);

    if (this.manifestManager && dependencies.registerIngestCallback) {
      dependencies.registerIngestCallback('packagePolicyCreate', (0, _ingest_integration.getPackagePolicyCreateCallback)(dependencies.logger, this.manifestManager, dependencies.appClientFactory, dependencies.config.maxTimelineImportExportSize, dependencies.security, dependencies.alerts, dependencies.licenseService, dependencies.exceptionListsClient));
      dependencies.registerIngestCallback('packagePolicyUpdate', (0, _ingest_integration.getPackagePolicyUpdateCallback)(dependencies.logger, dependencies.licenseService));
    }
  }

  stop() {}

  getAgentService() {
    return this.agentService;
  }

  getPackagePolicyService() {
    return this.packagePolicyService;
  }

  getAgentPolicyService() {
    return this.agentPolicyService;
  }

  getMetadataService() {
    return this.metadataService;
  }

  getManifestManager() {
    return this.manifestManager;
  }

  getScopedSavedObjectsClient(req) {
    if (!this.savedObjectsStart) {
      throw new Error(`must call start on ${EndpointAppContextService.name} to call getter`);
    }

    return this.savedObjectsStart.getScopedClient(req, {
      excludedWrappers: ['security']
    });
  }

}

exports.EndpointAppContextService = EndpointAppContextService;