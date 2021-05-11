"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "SpacesPluginSetup", {
  enumerable: true,
  get: function () {
    return _plugin.SpacesPluginSetup;
  }
});
Object.defineProperty(exports, "SpacesPluginStart", {
  enumerable: true,
  get: function () {
    return _plugin.SpacesPluginStart;
  }
});
Object.defineProperty(exports, "addSpaceIdToPath", {
  enumerable: true,
  get: function () {
    return _common.addSpaceIdToPath;
  }
});
Object.defineProperty(exports, "GetAllSpacesOptions", {
  enumerable: true,
  get: function () {
    return _common.GetAllSpacesOptions;
  }
});
Object.defineProperty(exports, "GetAllSpacesPurpose", {
  enumerable: true,
  get: function () {
    return _common.GetAllSpacesPurpose;
  }
});
Object.defineProperty(exports, "GetSpaceResult", {
  enumerable: true,
  get: function () {
    return _common.GetSpaceResult;
  }
});
Object.defineProperty(exports, "SpacesServiceSetup", {
  enumerable: true,
  get: function () {
    return _spaces_service.SpacesServiceSetup;
  }
});
Object.defineProperty(exports, "SpacesServiceStart", {
  enumerable: true,
  get: function () {
    return _spaces_service.SpacesServiceStart;
  }
});
Object.defineProperty(exports, "ISpacesClient", {
  enumerable: true,
  get: function () {
    return _spaces_client.ISpacesClient;
  }
});
Object.defineProperty(exports, "Space", {
  enumerable: true,
  get: function () {
    return _common2.Space;
  }
});
exports.plugin = exports.config = void 0;

var _config = require("./config");

var _plugin = require("./plugin");

var _common = require("../common");

var _spaces_service = require("./spaces_service");

var _spaces_client = require("./spaces_client");

var _common2 = require("../../../../src/plugins/spaces_oss/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// These exports are part of public Spaces plugin contract, any change in signature of exported
// functions or removal of exports should be considered as a breaking change. Ideally we should
// reduce number of such exports to zero and provide everything we want to expose via Setup/Start
// run-time contracts.
// end public contract exports
// re-export types from oss definition


const config = {
  schema: _config.ConfigSchema,
  deprecations: _config.spacesConfigDeprecationProvider
};
exports.config = config;

const plugin = initializerContext => new _plugin.SpacesPlugin(initializerContext);

exports.plugin = plugin;