"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EmbeddableServerPlugin = void 0;

var _lodash = require("lodash");

var _lib = require("../common/lib");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class EmbeddableServerPlugin {
  constructor() {
    _defineProperty(this, "embeddableFactories", new Map());

    _defineProperty(this, "enhancements", new Map());

    _defineProperty(this, "registerEnhancement", enhancement => {
      if (this.enhancements.has(enhancement.id)) {
        throw new Error(`enhancement with id ${enhancement.id} already exists in the registry`);
      }

      this.enhancements.set(enhancement.id, {
        id: enhancement.id,
        telemetry: enhancement.telemetry || (() => ({})),
        inject: enhancement.inject || _lodash.identity,
        extract: enhancement.extract || (state => {
          return {
            state,
            references: []
          };
        }),
        migrations: enhancement.migrations || {}
      });
    });

    _defineProperty(this, "getEnhancement", id => {
      return this.enhancements.get(id) || {
        id: 'unknown',
        telemetry: () => ({}),
        inject: _lodash.identity,
        extract: state => {
          return {
            state,
            references: []
          };
        },
        migrations: {}
      };
    });

    _defineProperty(this, "registerEmbeddableFactory", factory => {
      if (this.embeddableFactories.has(factory.id)) {
        throw new Error(`Embeddable factory [embeddableFactoryId = ${factory.id}] already registered in Embeddables API.`);
      }

      this.embeddableFactories.set(factory.id, {
        id: factory.id,
        telemetry: factory.telemetry || (() => ({})),
        inject: factory.inject || _lodash.identity,
        extract: factory.extract || (state => ({
          state,
          references: []
        })),
        migrations: factory.migrations || {}
      });
    });

    _defineProperty(this, "getEmbeddableFactory", embeddableFactoryId => {
      return this.embeddableFactories.get(embeddableFactoryId) || {
        id: 'unknown',
        telemetry: () => ({}),
        inject: state => state,
        extract: state => {
          return {
            state,
            references: []
          };
        },
        migrations: {}
      };
    });
  }

  setup(core) {
    const commonContract = {
      getEmbeddableFactory: this.getEmbeddableFactory,
      getEnhancement: this.getEnhancement
    };
    return {
      registerEmbeddableFactory: this.registerEmbeddableFactory,
      registerEnhancement: this.registerEnhancement,
      telemetry: (0, _lib.getTelemetryFunction)(commonContract),
      extract: (0, _lib.getExtractFunction)(commonContract),
      inject: (0, _lib.getInjectFunction)(commonContract),
      migrate: (0, _lib.getMigrateFunction)(commonContract)
    };
  }

  start(core) {
    const commonContract = {
      getEmbeddableFactory: this.getEmbeddableFactory,
      getEnhancement: this.getEnhancement
    };
    return {
      telemetry: (0, _lib.getTelemetryFunction)(commonContract),
      extract: (0, _lib.getExtractFunction)(commonContract),
      inject: (0, _lib.getInjectFunction)(commonContract),
      migrate: (0, _lib.getMigrateFunction)(commonContract)
    };
  }

  stop() {}

}

exports.EmbeddableServerPlugin = EmbeddableServerPlugin;