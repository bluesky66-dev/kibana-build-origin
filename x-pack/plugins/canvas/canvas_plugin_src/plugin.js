"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CanvasSrcPlugin = void 0;

var _browser = require("./functions/browser");

var _expression_types = require("./expression_types");

var _renderers = require("./renderers");

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
/** @internal */


class CanvasSrcPlugin {
  setup(core, plugins) {
    plugins.canvas.addFunctions(_browser.functions);
    plugins.canvas.addTypes(_expression_types.typeFunctions);
    plugins.canvas.addRenderers(_renderers.renderFunctions);
    core.getStartServices().then(([coreStart, depsStart]) => {
      plugins.canvas.addRenderers(_renderers.renderFunctionFactories.map(factory => factory(coreStart, depsStart)));
    });
    plugins.canvas.addDatasourceUIs(async () => {
      // @ts-expect-error
      const {
        datasourceSpecs
      } = await Promise.resolve().then(() => _interopRequireWildcard(require('./canvas_addons')));
      return datasourceSpecs;
    });
    plugins.canvas.addElements(async () => {
      const {
        initializeElements
      } = await Promise.resolve().then(() => _interopRequireWildcard(require('./canvas_addons')));
      return initializeElements(core, plugins);
    });
    plugins.canvas.addModelUIs(async () => {
      // @ts-expect-error Untyped local
      const {
        modelSpecs
      } = await Promise.resolve().then(() => _interopRequireWildcard(require('./canvas_addons')));
      return modelSpecs;
    });
    plugins.canvas.addViewUIs(async () => {
      const {
        initializeViews
      } = await Promise.resolve().then(() => _interopRequireWildcard(require('./canvas_addons')));
      return initializeViews(core, plugins);
    });
    plugins.canvas.addArgumentUIs(async () => {
      const {
        initializeArgs
      } = await Promise.resolve().then(() => _interopRequireWildcard(require('./canvas_addons')));
      return initializeArgs(core, plugins);
    });
    plugins.canvas.addTagUIs(async () => {
      const {
        tagSpecs
      } = await Promise.resolve().then(() => _interopRequireWildcard(require('./canvas_addons')));
      return tagSpecs;
    });
    plugins.canvas.addTransformUIs(async () => {
      // @ts-expect-error Untyped local
      const {
        transformSpecs
      } = await Promise.resolve().then(() => _interopRequireWildcard(require('./canvas_addons')));
      return transformSpecs;
    });
  }

  start(core, plugins) {}

}

exports.CanvasSrcPlugin = CanvasSrcPlugin;