"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  SavedObjectsRepository: true,
  SavedObjectsClientProvider: true,
  ISavedObjectsClientProvider: true,
  SavedObjectsClientProviderOptions: true,
  SavedObjectsClientWrapperFactory: true,
  SavedObjectsClientWrapperOptions: true,
  SavedObjectsErrorHelpers: true,
  SavedObjectsClientFactory: true,
  SavedObjectsClientFactoryProvider: true,
  SavedObjectsUtils: true
};
Object.defineProperty(exports, "SavedObjectsRepository", {
  enumerable: true,
  get: function () {
    return _lib.SavedObjectsRepository;
  }
});
Object.defineProperty(exports, "SavedObjectsClientProvider", {
  enumerable: true,
  get: function () {
    return _lib.SavedObjectsClientProvider;
  }
});
Object.defineProperty(exports, "ISavedObjectsClientProvider", {
  enumerable: true,
  get: function () {
    return _lib.ISavedObjectsClientProvider;
  }
});
Object.defineProperty(exports, "SavedObjectsClientProviderOptions", {
  enumerable: true,
  get: function () {
    return _lib.SavedObjectsClientProviderOptions;
  }
});
Object.defineProperty(exports, "SavedObjectsClientWrapperFactory", {
  enumerable: true,
  get: function () {
    return _lib.SavedObjectsClientWrapperFactory;
  }
});
Object.defineProperty(exports, "SavedObjectsClientWrapperOptions", {
  enumerable: true,
  get: function () {
    return _lib.SavedObjectsClientWrapperOptions;
  }
});
Object.defineProperty(exports, "SavedObjectsErrorHelpers", {
  enumerable: true,
  get: function () {
    return _lib.SavedObjectsErrorHelpers;
  }
});
Object.defineProperty(exports, "SavedObjectsClientFactory", {
  enumerable: true,
  get: function () {
    return _lib.SavedObjectsClientFactory;
  }
});
Object.defineProperty(exports, "SavedObjectsClientFactoryProvider", {
  enumerable: true,
  get: function () {
    return _lib.SavedObjectsClientFactoryProvider;
  }
});
Object.defineProperty(exports, "SavedObjectsUtils", {
  enumerable: true,
  get: function () {
    return _lib.SavedObjectsUtils;
  }
});

var _lib = require("./lib");

var _saved_objects_client = require("./saved_objects_client");

Object.keys(_saved_objects_client).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _saved_objects_client[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _saved_objects_client[key];
    }
  });
});