"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UiSettingsClient = void 0;

var _lodash = require("lodash");

var _saved_objects = require("../saved_objects");

var _create_or_upgrade_saved_config = require("./create_or_upgrade_saved_config");

var _ui_settings_errors = require("./ui_settings_errors");

var _cache = require("./cache");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class UiSettingsClient {
  constructor(options) {
    _defineProperty(this, "type", void 0);

    _defineProperty(this, "id", void 0);

    _defineProperty(this, "buildNum", void 0);

    _defineProperty(this, "savedObjectsClient", void 0);

    _defineProperty(this, "overrides", void 0);

    _defineProperty(this, "defaults", void 0);

    _defineProperty(this, "log", void 0);

    _defineProperty(this, "cache", void 0);

    const {
      type,
      id,
      buildNum,
      savedObjectsClient,
      log,
      defaults = {},
      overrides = {}
    } = options;
    this.type = type;
    this.id = id;
    this.buildNum = buildNum;
    this.savedObjectsClient = savedObjectsClient;
    this.defaults = defaults;
    this.overrides = overrides;
    this.log = log;
    this.cache = new _cache.Cache();
  }

  getRegistered() {
    const copiedDefaults = {};

    for (const [key, value] of Object.entries(this.defaults)) {
      copiedDefaults[key] = (0, _lodash.omit)(value, 'schema');
    }

    return copiedDefaults;
  }

  async get(key) {
    const all = await this.getAll();
    return all[key];
  }

  async getAll() {
    const raw = await this.getRaw();
    return Object.keys(raw).reduce((all, key) => {
      const item = raw[key];
      all[key] = 'userValue' in item ? item.userValue : item.value;
      return all;
    }, {});
  }

  async getUserProvided() {
    const cachedValue = this.cache.get();

    if (cachedValue) {
      return cachedValue;
    }

    const userProvided = this.onReadHook(await this.read()); // write all overridden keys, dropping the userValue is override is null and
    // adding keys for overrides that are not in saved object

    for (const [key, value] of Object.entries(this.overrides)) {
      userProvided[key] = value === null ? {
        isOverridden: true
      } : {
        isOverridden: true,
        userValue: value
      };
    }

    this.cache.set(userProvided);
    return userProvided;
  }

  async setMany(changes) {
    this.cache.del();
    this.onWriteHook(changes);
    await this.write({
      changes
    });
  }

  async set(key, value) {
    await this.setMany({
      [key]: value
    });
  }

  async remove(key) {
    await this.set(key, null);
  }

  async removeMany(keys) {
    const changes = {};
    keys.forEach(key => {
      changes[key] = null;
    });
    await this.setMany(changes);
  }

  isOverridden(key) {
    return this.overrides.hasOwnProperty(key);
  }

  isSensitive(key) {
    const definition = this.defaults[key];
    return !!(definition !== null && definition !== void 0 && definition.sensitive);
  }

  assertUpdateAllowed(key) {
    if (this.isOverridden(key)) {
      throw new _ui_settings_errors.CannotOverrideError(`Unable to update "${key}" because it is overridden`);
    }
  }

  async getRaw() {
    const userProvided = await this.getUserProvided();
    return (0, _lodash.defaultsDeep)({}, userProvided, this.defaults);
  }

  validateKey(key, value) {
    const definition = this.defaults[key];
    if (value === null || definition === undefined) return;

    if (definition.schema) {
      definition.schema.validate(value, {}, `validation [${key}]`);
    }
  }

  onWriteHook(changes) {
    for (const key of Object.keys(changes)) {
      this.assertUpdateAllowed(key);
    }

    for (const [key, value] of Object.entries(changes)) {
      this.validateKey(key, value);
    }
  }

  onReadHook(values) {
    // write the userValue for each key stored in the saved object that is not overridden
    // validate value read from saved objects as it can be changed via SO API
    const filteredValues = {};

    for (const [key, userValue] of Object.entries(values)) {
      if (userValue === null || this.isOverridden(key)) continue;

      try {
        this.validateKey(key, userValue);
        filteredValues[key] = {
          userValue: userValue
        };
      } catch (error) {
        this.log.warn(`Ignore invalid UiSettings value. ${error}.`);
      }
    }

    return filteredValues;
  }

  async write({
    changes,
    autoCreateOrUpgradeIfMissing = true
  }) {
    try {
      await this.savedObjectsClient.update(this.type, this.id, changes);
    } catch (error) {
      if (!_saved_objects.SavedObjectsErrorHelpers.isNotFoundError(error) || !autoCreateOrUpgradeIfMissing) {
        throw error;
      }

      await (0, _create_or_upgrade_saved_config.createOrUpgradeSavedConfig)({
        savedObjectsClient: this.savedObjectsClient,
        version: this.id,
        buildNum: this.buildNum,
        log: this.log,
        handleWriteErrors: false
      });
      await this.write({
        changes,
        autoCreateOrUpgradeIfMissing: false
      });
    }
  }

  async read({
    autoCreateOrUpgradeIfMissing = true
  } = {}) {
    try {
      const resp = await this.savedObjectsClient.get(this.type, this.id);
      return resp.attributes;
    } catch (error) {
      if (_saved_objects.SavedObjectsErrorHelpers.isNotFoundError(error) && autoCreateOrUpgradeIfMissing) {
        const failedUpgradeAttributes = await (0, _create_or_upgrade_saved_config.createOrUpgradeSavedConfig)({
          savedObjectsClient: this.savedObjectsClient,
          version: this.id,
          buildNum: this.buildNum,
          log: this.log,
          handleWriteErrors: true
        });

        if (!failedUpgradeAttributes) {
          return await this.read({
            autoCreateOrUpgradeIfMissing: false
          });
        }

        return failedUpgradeAttributes;
      }

      if (this.isIgnorableError(error)) {
        return {};
      }

      throw error;
    }
  }

  isIgnorableError(error) {
    const {
      isForbiddenError,
      isEsUnavailableError
    } = this.savedObjectsClient.errors;
    return isForbiddenError(error) || isEsUnavailableError(error);
  }

}

exports.UiSettingsClient = UiSettingsClient;