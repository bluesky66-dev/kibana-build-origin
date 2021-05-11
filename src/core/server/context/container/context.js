"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ContextContainer = void 0;

var _lodash = require("lodash");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/** @internal */
class ContextContainer {
  /**
   * Used to map contexts to their providers and associated plugin. In registration order which is tightly coupled to
   * plugin load order.
   */

  /** Used to keep track of which plugins registered which contexts for dependency resolution. */

  /**
   * @param pluginDependencies - A map of plugins to an array of their dependencies.
   */
  constructor(pluginDependencies, coreId) {
    this.pluginDependencies = pluginDependencies;
    this.coreId = coreId;

    _defineProperty(this, "contextProviders", new Map());

    _defineProperty(this, "contextNamesBySource", void 0);

    _defineProperty(this, "registerContext", (source, name, provider) => {
      const contextName = name;

      if (this.contextProviders.has(contextName)) {
        throw new Error(`Context provider for ${contextName} has already been registered.`);
      }

      if (source !== this.coreId && !this.pluginDependencies.has(source)) {
        throw new Error(`Cannot register context for unknown plugin: ${source.toString()}`);
      }

      this.contextProviders.set(contextName, {
        provider,
        source
      });
      this.contextNamesBySource.set(source, [...(this.contextNamesBySource.get(source) || []), contextName]);
      return this;
    });

    _defineProperty(this, "createHandler", (source, handler) => {
      if (source !== this.coreId && !this.pluginDependencies.has(source)) {
        throw new Error(`Cannot create handler for unknown plugin: ${source.toString()}`);
      }

      return async (...args) => {
        const context = await this.buildContext(source, ...args); // @ts-expect-error requires explicit handler arity

        return handler(context, ...args);
      };
    });

    this.contextNamesBySource = new Map([[coreId, []]]);
  }

  async buildContext(source, ...contextArgs) {
    const contextsToBuild = new Set(this.getContextNamesForSource(source));
    return [...this.contextProviders].sort(sortByCoreFirst(this.coreId)).filter(([contextName]) => contextsToBuild.has(contextName)).reduce(async (contextPromise, [contextName, {
      provider,
      source: providerSource
    }]) => {
      const resolvedContext = await contextPromise; // For the next provider, only expose the context available based on the dependencies of the plugin that
      // registered that provider.

      const exposedContext = (0, _lodash.pick)(resolvedContext, [...this.getContextNamesForSource(providerSource)]);
      return { ...resolvedContext,
        // @ts-expect-error requires explicit provider arity
        [contextName]: await provider(exposedContext, ...contextArgs)
      };
    }, Promise.resolve({}));
  }

  getContextNamesForSource(source) {
    if (source === this.coreId) {
      return this.getContextNamesForCore();
    } else {
      return this.getContextNamesForPluginId(source);
    }
  }

  getContextNamesForCore() {
    return new Set(this.contextNamesBySource.get(this.coreId));
  }

  getContextNamesForPluginId(pluginId) {
    // If the source is a plugin...
    const pluginDeps = this.pluginDependencies.get(pluginId);

    if (!pluginDeps) {
      // This case should never be hit, but let's be safe.
      throw new Error(`Cannot create context for unknown plugin: ${pluginId.toString()}`);
    }

    return new Set([// Core contexts
    ...this.contextNamesBySource.get(this.coreId), // Contexts source created
    ...(this.contextNamesBySource.get(pluginId) || []), // Contexts sources's dependencies created
    ...(0, _lodash.flatten)(pluginDeps.map(p => this.contextNamesBySource.get(p) || []))]);
  }

}
/** Sorts context provider pairs by core pairs first. */


exports.ContextContainer = ContextContainer;

const sortByCoreFirst = coreId => ([leftName, leftProvider], [rightName, rightProvider]) => {
  if (leftProvider.source === coreId) {
    return rightProvider.source === coreId ? 0 : -1;
  } else {
    return rightProvider.source === coreId ? 1 : 0;
  }
};