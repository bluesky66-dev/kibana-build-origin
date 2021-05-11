"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EncryptedSavedObjectsPlugin = void 0;

var _nodeCrypto = _interopRequireDefault(require("@elastic/node-crypto"));

var _crypto = require("./crypto");

var _audit = require("./audit");

var _saved_objects = require("./saved_objects");

var _create_migration = require("./create_migration");

var _routes = require("./routes");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
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
/**
 * Represents EncryptedSavedObjects Plugin instance that will be managed by the Kibana plugin system.
 */


class EncryptedSavedObjectsPlugin {
  constructor(initializerContext) {
    this.initializerContext = initializerContext;

    _defineProperty(this, "logger", void 0);

    _defineProperty(this, "savedObjectsSetup", void 0);

    this.logger = this.initializerContext.logger.get();
  }

  setup(core, deps) {
    var _deps$security;

    const config = this.initializerContext.config.get();
    const canEncrypt = config.encryptionKey !== undefined;

    if (!canEncrypt) {
      this.logger.warn('Saved objects encryption key is not set. This will severely limit Kibana functionality. ' + 'Please set xpack.encryptedSavedObjects.encryptionKey in the kibana.yml or use the bin/kibana-encryption-keys command.');
    }

    const primaryCrypto = config.encryptionKey ? (0, _nodeCrypto.default)({
      encryptionKey: config.encryptionKey
    }) : undefined;
    const decryptionOnlyCryptos = config.keyRotation.decryptionOnlyKeys.map(decryptionKey => (0, _nodeCrypto.default)({
      encryptionKey: decryptionKey
    }));
    const auditLogger = new _audit.EncryptedSavedObjectsAuditLogger((_deps$security = deps.security) === null || _deps$security === void 0 ? void 0 : _deps$security.audit.getLogger('encryptedSavedObjects'));
    const service = Object.freeze(new _crypto.EncryptedSavedObjectsService({
      primaryCrypto,
      decryptionOnlyCryptos,
      logger: this.logger,
      audit: auditLogger
    }));
    this.savedObjectsSetup = (0, _saved_objects.setupSavedObjects)({
      service,
      savedObjects: core.savedObjects,
      security: deps.security,
      getStartServices: core.getStartServices
    });
    (0, _routes.defineRoutes)({
      router: core.http.createRouter(),
      logger: this.initializerContext.logger.get('routes'),
      encryptionKeyRotationService: Object.freeze(new _crypto.EncryptionKeyRotationService({
        logger: this.logger.get('key-rotation-service'),
        service,
        getStartServices: core.getStartServices,
        security: deps.security
      })),
      config
    });
    return {
      canEncrypt,
      registerType: typeRegistration => service.registerType(typeRegistration),
      createMigration: (0, _create_migration.getCreateMigration)(service, typeRegistration => {
        const serviceForMigration = new _crypto.EncryptedSavedObjectsService({
          primaryCrypto,
          decryptionOnlyCryptos,
          logger: this.logger,
          audit: auditLogger
        });
        serviceForMigration.registerType(typeRegistration);
        return serviceForMigration;
      })
    };
  }

  start() {
    this.logger.debug('Starting plugin');
    return {
      isEncryptionError: error => error instanceof _crypto.EncryptionError,
      getClient: (options = {}) => this.savedObjectsSetup(options)
    };
  }

  stop() {
    this.logger.debug('Stopping plugin');
  }

}

exports.EncryptedSavedObjectsPlugin = EncryptedSavedObjectsPlugin;