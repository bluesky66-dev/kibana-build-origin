"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AdvancedUiActionsServerPlugin = void 0;

var _lodash = require("lodash");

var _dynamic_action_enhancement = require("./dynamic_action_enhancement");

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

class AdvancedUiActionsServerPlugin {
  constructor() {
    _defineProperty(this, "actionFactories", new Map());

    _defineProperty(this, "registerActionFactory", definition => {
      if (this.actionFactories.has(definition.id)) {
        throw new Error(`ActionFactory [actionFactory.id = ${definition.id}] already registered.`);
      }

      this.actionFactories.set(definition.id, {
        id: definition.id,
        telemetry: definition.telemetry || (() => ({})),
        inject: definition.inject || _lodash.identity,
        extract: definition.extract || (state => {
          return {
            state,
            references: []
          };
        }),
        migrations: definition.migrations || {}
      });
    });
  }

  setup(core, {
    embeddable
  }) {
    const getActionFactory = actionFactoryId => this.actionFactories.get(actionFactoryId);

    embeddable.registerEnhancement((0, _dynamic_action_enhancement.dynamicActionEnhancement)(getActionFactory));
    return {
      registerActionFactory: this.registerActionFactory
    };
  }

  start() {}

  stop() {}
  /**
   * Register an action factory. Action factories are used to configure and
   * serialize/deserialize dynamic actions.
   */


}

exports.AdvancedUiActionsServerPlugin = AdvancedUiActionsServerPlugin;