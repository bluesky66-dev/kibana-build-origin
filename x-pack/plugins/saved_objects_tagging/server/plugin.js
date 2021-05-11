"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SavedObjectTaggingPlugin = void 0;

var _features = require("./features");

var _saved_objects = require("./saved_objects");

var _request_handler_context = require("./request_handler_context");

var _routes = require("./routes");

var _usage = require("./usage");

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

class SavedObjectTaggingPlugin {
  constructor(context) {
    _defineProperty(this, "legacyConfig$", void 0);

    this.legacyConfig$ = context.config.legacy.globalConfig$;
  }

  setup({
    savedObjects,
    http
  }, {
    features,
    usageCollection,
    security
  }) {
    savedObjects.registerType(_saved_objects.tagType);
    const router = http.createRouter();
    (0, _routes.registerRoutes)({
      router
    });
    http.registerRouteHandlerContext('tags', async (context, req, res) => {
      return new _request_handler_context.TagsRequestHandlerContext(req, context.core, security);
    });
    features.registerKibanaFeature(_features.savedObjectsTaggingFeature);

    if (usageCollection) {
      usageCollection.registerCollector((0, _usage.createTagUsageCollector)({
        usageCollection,
        legacyConfig$: this.legacyConfig$
      }));
    }

    return {};
  }

  start(core) {
    return {};
  }

}

exports.SavedObjectTaggingPlugin = SavedObjectTaggingPlugin;