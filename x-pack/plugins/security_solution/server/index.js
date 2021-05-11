"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Plugin", {
  enumerable: true,
  get: function () {
    return _plugin.Plugin;
  }
});
Object.defineProperty(exports, "PluginSetup", {
  enumerable: true,
  get: function () {
    return _plugin.PluginSetup;
  }
});
Object.defineProperty(exports, "PluginStart", {
  enumerable: true,
  get: function () {
    return _plugin.PluginStart;
  }
});
Object.defineProperty(exports, "ConfigType", {
  enumerable: true,
  get: function () {
    return _config.ConfigType;
  }
});
Object.defineProperty(exports, "AppClient", {
  enumerable: true,
  get: function () {
    return _types.AppClient;
  }
});
Object.defineProperty(exports, "deleteTemplate", {
  enumerable: true,
  get: function () {
    return _delete_template.deleteTemplate;
  }
});
Object.defineProperty(exports, "deletePolicy", {
  enumerable: true,
  get: function () {
    return _delete_policy.deletePolicy;
  }
});
Object.defineProperty(exports, "deleteAllIndex", {
  enumerable: true,
  get: function () {
    return _delete_all_index.deleteAllIndex;
  }
});
Object.defineProperty(exports, "setPolicy", {
  enumerable: true,
  get: function () {
    return _set_policy.setPolicy;
  }
});
Object.defineProperty(exports, "setTemplate", {
  enumerable: true,
  get: function () {
    return _set_template.setTemplate;
  }
});
Object.defineProperty(exports, "getTemplateExists", {
  enumerable: true,
  get: function () {
    return _get_template_exists.getTemplateExists;
  }
});
Object.defineProperty(exports, "getPolicyExists", {
  enumerable: true,
  get: function () {
    return _get_policy_exists.getPolicyExists;
  }
});
Object.defineProperty(exports, "createBootstrapIndex", {
  enumerable: true,
  get: function () {
    return _create_bootstrap_index.createBootstrapIndex;
  }
});
Object.defineProperty(exports, "getIndexExists", {
  enumerable: true,
  get: function () {
    return _get_index_exists.getIndexExists;
  }
});
Object.defineProperty(exports, "buildRouteValidation", {
  enumerable: true,
  get: function () {
    return _route_validation.buildRouteValidation;
  }
});
Object.defineProperty(exports, "transformError", {
  enumerable: true,
  get: function () {
    return _utils.transformError;
  }
});
Object.defineProperty(exports, "buildSiemResponse", {
  enumerable: true,
  get: function () {
    return _utils.buildSiemResponse;
  }
});
Object.defineProperty(exports, "readPrivileges", {
  enumerable: true,
  get: function () {
    return _read_privileges.readPrivileges;
  }
});
exports.config = exports.plugin = void 0;

var _plugin = require("./plugin");

var _config = require("./config");

var _constants = require("../common/constants");

var _types = require("./types");

var _delete_template = require("./lib/detection_engine/index/delete_template");

var _delete_policy = require("./lib/detection_engine/index/delete_policy");

var _delete_all_index = require("./lib/detection_engine/index/delete_all_index");

var _set_policy = require("./lib/detection_engine/index/set_policy");

var _set_template = require("./lib/detection_engine/index/set_template");

var _get_template_exists = require("./lib/detection_engine/index/get_template_exists");

var _get_policy_exists = require("./lib/detection_engine/index/get_policy_exists");

var _create_bootstrap_index = require("./lib/detection_engine/index/create_bootstrap_index");

var _get_index_exists = require("./lib/detection_engine/index/get_index_exists");

var _route_validation = require("./utils/build_validation/route_validation");

var _utils = require("./lib/detection_engine/routes/utils");

var _read_privileges = require("./lib/detection_engine/privileges/read_privileges");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const plugin = context => {
  return new _plugin.Plugin(context);
};

exports.plugin = plugin;
const config = {
  schema: _config.configSchema,
  deprecations: ({
    renameFromRoot
  }) => [renameFromRoot('xpack.siem.enabled', 'xpack.securitySolution.enabled'), renameFromRoot('xpack.siem.maxRuleImportExportSize', 'xpack.securitySolution.maxRuleImportExportSize'), renameFromRoot('xpack.siem.maxRuleImportPayloadBytes', 'xpack.securitySolution.maxRuleImportPayloadBytes'), renameFromRoot('xpack.siem.maxTimelineImportExportSize', 'xpack.securitySolution.maxTimelineImportExportSize'), renameFromRoot('xpack.siem.maxTimelineImportPayloadBytes', 'xpack.securitySolution.maxTimelineImportPayloadBytes'), renameFromRoot(`xpack.siem.${_constants.SIGNALS_INDEX_KEY}`, `xpack.securitySolution.${_constants.SIGNALS_INDEX_KEY}`)]
};
exports.config = config;