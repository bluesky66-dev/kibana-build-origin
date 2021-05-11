"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  BASE_PATH: true,
  API_BASE_PATH: true,
  INVALID_INDEX_PATTERN_CHARS: true,
  INVALID_TEMPLATE_NAME_CHARS: true,
  UIM_APP_NAME: true,
  UIM_APP_LOAD: true,
  UIM_UPDATE_SETTINGS: true,
  UIM_INDEX_CLEAR_CACHE: true,
  UIM_INDEX_CLEAR_CACHE_MANY: true,
  UIM_INDEX_CLOSE: true,
  UIM_INDEX_CLOSE_MANY: true,
  UIM_INDEX_DELETE: true,
  UIM_INDEX_DELETE_MANY: true,
  UIM_INDEX_FLUSH: true,
  UIM_INDEX_FLUSH_MANY: true,
  UIM_INDEX_FORCE_MERGE: true,
  UIM_INDEX_FORCE_MERGE_MANY: true,
  UIM_INDEX_FREEZE: true,
  UIM_INDEX_FREEZE_MANY: true,
  UIM_INDEX_OPEN: true,
  UIM_INDEX_OPEN_MANY: true,
  UIM_INDEX_REFRESH: true,
  UIM_INDEX_REFRESH_MANY: true,
  UIM_INDEX_UNFREEZE: true,
  UIM_INDEX_UNFREEZE_MANY: true,
  UIM_INDEX_SETTINGS_EDIT: true,
  UIM_SHOW_DETAILS_CLICK: true,
  UIM_DETAIL_PANEL_SUMMARY_TAB: true,
  UIM_DETAIL_PANEL_SETTINGS_TAB: true,
  UIM_DETAIL_PANEL_MAPPING_TAB: true,
  UIM_DETAIL_PANEL_STATS_TAB: true,
  UIM_DETAIL_PANEL_EDIT_SETTINGS_TAB: true,
  UIM_TEMPLATE_LIST_LOAD: true,
  UIM_TEMPLATE_DELETE: true,
  UIM_TEMPLATE_DELETE_MANY: true,
  UIM_TEMPLATE_SHOW_DETAILS_CLICK: true,
  UIM_TEMPLATE_DETAIL_PANEL_SUMMARY_TAB: true,
  UIM_TEMPLATE_DETAIL_PANEL_SETTINGS_TAB: true,
  UIM_TEMPLATE_DETAIL_PANEL_MAPPINGS_TAB: true,
  UIM_TEMPLATE_DETAIL_PANEL_ALIASES_TAB: true,
  UIM_TEMPLATE_DETAIL_PANEL_PREVIEW_TAB: true,
  UIM_TEMPLATE_CREATE: true,
  UIM_TEMPLATE_UPDATE: true,
  UIM_TEMPLATE_CLONE: true,
  UIM_TEMPLATE_SIMULATE: true
};
Object.defineProperty(exports, "BASE_PATH", {
  enumerable: true,
  get: function () {
    return _base_path.BASE_PATH;
  }
});
Object.defineProperty(exports, "API_BASE_PATH", {
  enumerable: true,
  get: function () {
    return _api_base_path.API_BASE_PATH;
  }
});
Object.defineProperty(exports, "INVALID_INDEX_PATTERN_CHARS", {
  enumerable: true,
  get: function () {
    return _invalid_characters.INVALID_INDEX_PATTERN_CHARS;
  }
});
Object.defineProperty(exports, "INVALID_TEMPLATE_NAME_CHARS", {
  enumerable: true,
  get: function () {
    return _invalid_characters.INVALID_TEMPLATE_NAME_CHARS;
  }
});
Object.defineProperty(exports, "UIM_APP_NAME", {
  enumerable: true,
  get: function () {
    return _ui_metric.UIM_APP_NAME;
  }
});
Object.defineProperty(exports, "UIM_APP_LOAD", {
  enumerable: true,
  get: function () {
    return _ui_metric.UIM_APP_LOAD;
  }
});
Object.defineProperty(exports, "UIM_UPDATE_SETTINGS", {
  enumerable: true,
  get: function () {
    return _ui_metric.UIM_UPDATE_SETTINGS;
  }
});
Object.defineProperty(exports, "UIM_INDEX_CLEAR_CACHE", {
  enumerable: true,
  get: function () {
    return _ui_metric.UIM_INDEX_CLEAR_CACHE;
  }
});
Object.defineProperty(exports, "UIM_INDEX_CLEAR_CACHE_MANY", {
  enumerable: true,
  get: function () {
    return _ui_metric.UIM_INDEX_CLEAR_CACHE_MANY;
  }
});
Object.defineProperty(exports, "UIM_INDEX_CLOSE", {
  enumerable: true,
  get: function () {
    return _ui_metric.UIM_INDEX_CLOSE;
  }
});
Object.defineProperty(exports, "UIM_INDEX_CLOSE_MANY", {
  enumerable: true,
  get: function () {
    return _ui_metric.UIM_INDEX_CLOSE_MANY;
  }
});
Object.defineProperty(exports, "UIM_INDEX_DELETE", {
  enumerable: true,
  get: function () {
    return _ui_metric.UIM_INDEX_DELETE;
  }
});
Object.defineProperty(exports, "UIM_INDEX_DELETE_MANY", {
  enumerable: true,
  get: function () {
    return _ui_metric.UIM_INDEX_DELETE_MANY;
  }
});
Object.defineProperty(exports, "UIM_INDEX_FLUSH", {
  enumerable: true,
  get: function () {
    return _ui_metric.UIM_INDEX_FLUSH;
  }
});
Object.defineProperty(exports, "UIM_INDEX_FLUSH_MANY", {
  enumerable: true,
  get: function () {
    return _ui_metric.UIM_INDEX_FLUSH_MANY;
  }
});
Object.defineProperty(exports, "UIM_INDEX_FORCE_MERGE", {
  enumerable: true,
  get: function () {
    return _ui_metric.UIM_INDEX_FORCE_MERGE;
  }
});
Object.defineProperty(exports, "UIM_INDEX_FORCE_MERGE_MANY", {
  enumerable: true,
  get: function () {
    return _ui_metric.UIM_INDEX_FORCE_MERGE_MANY;
  }
});
Object.defineProperty(exports, "UIM_INDEX_FREEZE", {
  enumerable: true,
  get: function () {
    return _ui_metric.UIM_INDEX_FREEZE;
  }
});
Object.defineProperty(exports, "UIM_INDEX_FREEZE_MANY", {
  enumerable: true,
  get: function () {
    return _ui_metric.UIM_INDEX_FREEZE_MANY;
  }
});
Object.defineProperty(exports, "UIM_INDEX_OPEN", {
  enumerable: true,
  get: function () {
    return _ui_metric.UIM_INDEX_OPEN;
  }
});
Object.defineProperty(exports, "UIM_INDEX_OPEN_MANY", {
  enumerable: true,
  get: function () {
    return _ui_metric.UIM_INDEX_OPEN_MANY;
  }
});
Object.defineProperty(exports, "UIM_INDEX_REFRESH", {
  enumerable: true,
  get: function () {
    return _ui_metric.UIM_INDEX_REFRESH;
  }
});
Object.defineProperty(exports, "UIM_INDEX_REFRESH_MANY", {
  enumerable: true,
  get: function () {
    return _ui_metric.UIM_INDEX_REFRESH_MANY;
  }
});
Object.defineProperty(exports, "UIM_INDEX_UNFREEZE", {
  enumerable: true,
  get: function () {
    return _ui_metric.UIM_INDEX_UNFREEZE;
  }
});
Object.defineProperty(exports, "UIM_INDEX_UNFREEZE_MANY", {
  enumerable: true,
  get: function () {
    return _ui_metric.UIM_INDEX_UNFREEZE_MANY;
  }
});
Object.defineProperty(exports, "UIM_INDEX_SETTINGS_EDIT", {
  enumerable: true,
  get: function () {
    return _ui_metric.UIM_INDEX_SETTINGS_EDIT;
  }
});
Object.defineProperty(exports, "UIM_SHOW_DETAILS_CLICK", {
  enumerable: true,
  get: function () {
    return _ui_metric.UIM_SHOW_DETAILS_CLICK;
  }
});
Object.defineProperty(exports, "UIM_DETAIL_PANEL_SUMMARY_TAB", {
  enumerable: true,
  get: function () {
    return _ui_metric.UIM_DETAIL_PANEL_SUMMARY_TAB;
  }
});
Object.defineProperty(exports, "UIM_DETAIL_PANEL_SETTINGS_TAB", {
  enumerable: true,
  get: function () {
    return _ui_metric.UIM_DETAIL_PANEL_SETTINGS_TAB;
  }
});
Object.defineProperty(exports, "UIM_DETAIL_PANEL_MAPPING_TAB", {
  enumerable: true,
  get: function () {
    return _ui_metric.UIM_DETAIL_PANEL_MAPPING_TAB;
  }
});
Object.defineProperty(exports, "UIM_DETAIL_PANEL_STATS_TAB", {
  enumerable: true,
  get: function () {
    return _ui_metric.UIM_DETAIL_PANEL_STATS_TAB;
  }
});
Object.defineProperty(exports, "UIM_DETAIL_PANEL_EDIT_SETTINGS_TAB", {
  enumerable: true,
  get: function () {
    return _ui_metric.UIM_DETAIL_PANEL_EDIT_SETTINGS_TAB;
  }
});
Object.defineProperty(exports, "UIM_TEMPLATE_LIST_LOAD", {
  enumerable: true,
  get: function () {
    return _ui_metric.UIM_TEMPLATE_LIST_LOAD;
  }
});
Object.defineProperty(exports, "UIM_TEMPLATE_DELETE", {
  enumerable: true,
  get: function () {
    return _ui_metric.UIM_TEMPLATE_DELETE;
  }
});
Object.defineProperty(exports, "UIM_TEMPLATE_DELETE_MANY", {
  enumerable: true,
  get: function () {
    return _ui_metric.UIM_TEMPLATE_DELETE_MANY;
  }
});
Object.defineProperty(exports, "UIM_TEMPLATE_SHOW_DETAILS_CLICK", {
  enumerable: true,
  get: function () {
    return _ui_metric.UIM_TEMPLATE_SHOW_DETAILS_CLICK;
  }
});
Object.defineProperty(exports, "UIM_TEMPLATE_DETAIL_PANEL_SUMMARY_TAB", {
  enumerable: true,
  get: function () {
    return _ui_metric.UIM_TEMPLATE_DETAIL_PANEL_SUMMARY_TAB;
  }
});
Object.defineProperty(exports, "UIM_TEMPLATE_DETAIL_PANEL_SETTINGS_TAB", {
  enumerable: true,
  get: function () {
    return _ui_metric.UIM_TEMPLATE_DETAIL_PANEL_SETTINGS_TAB;
  }
});
Object.defineProperty(exports, "UIM_TEMPLATE_DETAIL_PANEL_MAPPINGS_TAB", {
  enumerable: true,
  get: function () {
    return _ui_metric.UIM_TEMPLATE_DETAIL_PANEL_MAPPINGS_TAB;
  }
});
Object.defineProperty(exports, "UIM_TEMPLATE_DETAIL_PANEL_ALIASES_TAB", {
  enumerable: true,
  get: function () {
    return _ui_metric.UIM_TEMPLATE_DETAIL_PANEL_ALIASES_TAB;
  }
});
Object.defineProperty(exports, "UIM_TEMPLATE_DETAIL_PANEL_PREVIEW_TAB", {
  enumerable: true,
  get: function () {
    return _ui_metric.UIM_TEMPLATE_DETAIL_PANEL_PREVIEW_TAB;
  }
});
Object.defineProperty(exports, "UIM_TEMPLATE_CREATE", {
  enumerable: true,
  get: function () {
    return _ui_metric.UIM_TEMPLATE_CREATE;
  }
});
Object.defineProperty(exports, "UIM_TEMPLATE_UPDATE", {
  enumerable: true,
  get: function () {
    return _ui_metric.UIM_TEMPLATE_UPDATE;
  }
});
Object.defineProperty(exports, "UIM_TEMPLATE_CLONE", {
  enumerable: true,
  get: function () {
    return _ui_metric.UIM_TEMPLATE_CLONE;
  }
});
Object.defineProperty(exports, "UIM_TEMPLATE_SIMULATE", {
  enumerable: true,
  get: function () {
    return _ui_metric.UIM_TEMPLATE_SIMULATE;
  }
});

var _base_path = require("./base_path");

var _api_base_path = require("./api_base_path");

var _invalid_characters = require("./invalid_characters");

var _index_statuses = require("./index_statuses");

Object.keys(_index_statuses).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _index_statuses[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index_statuses[key];
    }
  });
});

var _ui_metric = require("./ui_metric");