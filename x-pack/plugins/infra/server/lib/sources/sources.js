"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertSavedObjectToSavedSourceConfiguration = exports.InfraSources = void 0;

var runtimeTypes = _interopRequireWildcard(require("io-ts"));

var _PathReporter = require("io-ts/lib/PathReporter");

var _function = require("fp-ts/lib/function");

var _pipeable = require("fp-ts/lib/pipeable");

var _Either = require("fp-ts/lib/Either");

var _lodash = require("lodash");

var _defaults = require("./defaults");

var _errors = require("./errors");

var _saved_object_type = require("./saved_object_type");

var _source_api = require("../../../common/http_api/source_api");

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();

  _getRequireWildcardCache = function () {
    return cache;
  };

  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache();

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}

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

class InfraSources {
  constructor(libs) {
    _defineProperty(this, "internalSourceConfigurations", new Map());

    _defineProperty(this, "libs", void 0);

    this.libs = libs;
  }

  async getSourceConfiguration(savedObjectsClient, sourceId) {
    const staticDefaultSourceConfiguration = await this.getStaticDefaultSourceConfiguration();
    const savedSourceConfiguration = await this.getInternalSourceConfiguration(sourceId).then(internalSourceConfiguration => ({
      id: sourceId,
      version: undefined,
      updatedAt: undefined,
      origin: 'internal',
      configuration: mergeSourceConfiguration(staticDefaultSourceConfiguration, internalSourceConfiguration)
    })).catch(err => err instanceof _errors.NotFoundError ? this.getSavedSourceConfiguration(savedObjectsClient, sourceId).then(result => ({ ...result,
      configuration: mergeSourceConfiguration(staticDefaultSourceConfiguration, result.configuration)
    })) : Promise.reject(err)).catch(err => savedObjectsClient.errors.isNotFoundError(err) ? Promise.resolve({
      id: sourceId,
      version: undefined,
      updatedAt: undefined,
      origin: 'fallback',
      configuration: staticDefaultSourceConfiguration
    }) : Promise.reject(err));
    return savedSourceConfiguration;
  }

  async getAllSourceConfigurations(savedObjectsClient) {
    const staticDefaultSourceConfiguration = await this.getStaticDefaultSourceConfiguration();
    const savedSourceConfigurations = await this.getAllSavedSourceConfigurations(savedObjectsClient);
    return savedSourceConfigurations.map(savedSourceConfiguration => ({ ...savedSourceConfiguration,
      configuration: mergeSourceConfiguration(staticDefaultSourceConfiguration, savedSourceConfiguration.configuration)
    }));
  }

  async createSourceConfiguration(savedObjectsClient, sourceId, source) {
    const staticDefaultSourceConfiguration = await this.getStaticDefaultSourceConfiguration();
    const {
      anomalyThreshold
    } = source;
    if (anomalyThreshold && !(0, _lodash.inRange)(anomalyThreshold, 0, 101)) throw new _errors.AnomalyThresholdRangeError('anomalyThreshold must be 1-100');
    const newSourceConfiguration = mergeSourceConfiguration(staticDefaultSourceConfiguration, source);
    const createdSourceConfiguration = convertSavedObjectToSavedSourceConfiguration(await savedObjectsClient.create(_saved_object_type.infraSourceConfigurationSavedObjectName, (0, _source_api.pickSavedSourceConfiguration)(newSourceConfiguration), {
      id: sourceId
    }));
    return { ...createdSourceConfiguration,
      configuration: mergeSourceConfiguration(staticDefaultSourceConfiguration, createdSourceConfiguration.configuration)
    };
  }

  async deleteSourceConfiguration(savedObjectsClient, sourceId) {
    await savedObjectsClient.delete(_saved_object_type.infraSourceConfigurationSavedObjectName, sourceId);
  }

  async updateSourceConfiguration(savedObjectsClient, sourceId, sourceProperties) {
    const staticDefaultSourceConfiguration = await this.getStaticDefaultSourceConfiguration();
    const {
      anomalyThreshold
    } = sourceProperties;
    if (anomalyThreshold && !(0, _lodash.inRange)(anomalyThreshold, 0, 101)) throw new _errors.AnomalyThresholdRangeError('anomalyThreshold must be 1-100');
    const {
      configuration,
      version
    } = await this.getSourceConfiguration(savedObjectsClient, sourceId);
    const updatedSourceConfigurationAttributes = mergeSourceConfiguration(configuration, sourceProperties);
    const updatedSourceConfiguration = convertSavedObjectToSavedSourceConfiguration(await savedObjectsClient.update(_saved_object_type.infraSourceConfigurationSavedObjectName, sourceId, (0, _source_api.pickSavedSourceConfiguration)(updatedSourceConfigurationAttributes), {
      version
    }));
    return { ...updatedSourceConfiguration,
      configuration: mergeSourceConfiguration(staticDefaultSourceConfiguration, updatedSourceConfiguration.configuration)
    };
  }

  async defineInternalSourceConfiguration(sourceId, sourceProperties) {
    this.internalSourceConfigurations.set(sourceId, sourceProperties);
  }

  async getInternalSourceConfiguration(sourceId) {
    const internalSourceConfiguration = this.internalSourceConfigurations.get(sourceId);

    if (!internalSourceConfiguration) {
      throw new _errors.NotFoundError(`Failed to load internal source configuration: no configuration "${sourceId}" found.`);
    }

    return internalSourceConfiguration;
  }

  async getStaticDefaultSourceConfiguration() {
    const staticSourceConfiguration = (0, _pipeable.pipe)(runtimeTypes.type({
      sources: runtimeTypes.type({
        default: _source_api.StaticSourceConfigurationRuntimeType
      })
    }).decode(this.libs.config), (0, _Either.map)(({
      sources: {
        default: defaultConfiguration
      }
    }) => defaultConfiguration), (0, _Either.fold)((0, _function.constant)({}), _function.identity));
    return mergeSourceConfiguration(_defaults.defaultSourceConfiguration, staticSourceConfiguration);
  }

  async getSavedSourceConfiguration(savedObjectsClient, sourceId) {
    const savedObject = await savedObjectsClient.get(_saved_object_type.infraSourceConfigurationSavedObjectName, sourceId);
    return convertSavedObjectToSavedSourceConfiguration(savedObject);
  }

  async getAllSavedSourceConfigurations(savedObjectsClient) {
    const savedObjects = await savedObjectsClient.find({
      type: _saved_object_type.infraSourceConfigurationSavedObjectName
    });
    return savedObjects.saved_objects.map(convertSavedObjectToSavedSourceConfiguration);
  }

}

exports.InfraSources = InfraSources;

const mergeSourceConfiguration = (first, ...others) => others.reduce((previousSourceConfiguration, currentSourceConfiguration) => ({ ...previousSourceConfiguration,
  ...currentSourceConfiguration,
  fields: { ...previousSourceConfiguration.fields,
    ...currentSourceConfiguration.fields
  }
}), first);

const convertSavedObjectToSavedSourceConfiguration = savedObject => (0, _pipeable.pipe)(_source_api.SourceConfigurationSavedObjectRuntimeType.decode(savedObject), (0, _Either.map)(savedSourceConfiguration => ({
  id: savedSourceConfiguration.id,
  version: savedSourceConfiguration.version,
  updatedAt: savedSourceConfiguration.updated_at,
  origin: 'stored',
  configuration: savedSourceConfiguration.attributes
})), (0, _Either.fold)(errors => {
  throw new Error((0, _PathReporter.failure)(errors).join('\n'));
}, _function.identity));

exports.convertSavedObjectToSavedSourceConfiguration = convertSavedObjectToSavedSourceConfiguration;