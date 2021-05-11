"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  cleanFilter: true,
  isFilterDisabled: true
};
exports.isFilterDisabled = exports.cleanFilter = void 0;

var _lodash = require("lodash");

var _build_filters = require("./build_filters");

Object.keys(_build_filters).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _build_filters[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _build_filters[key];
    }
  });
});

var _custom_filter = require("./custom_filter");

Object.keys(_custom_filter).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _custom_filter[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _custom_filter[key];
    }
  });
});

var _exists_filter = require("./exists_filter");

Object.keys(_exists_filter).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _exists_filter[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _exists_filter[key];
    }
  });
});

var _geo_bounding_box_filter = require("./geo_bounding_box_filter");

Object.keys(_geo_bounding_box_filter).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _geo_bounding_box_filter[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _geo_bounding_box_filter[key];
    }
  });
});

var _geo_polygon_filter = require("./geo_polygon_filter");

Object.keys(_geo_polygon_filter).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _geo_polygon_filter[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _geo_polygon_filter[key];
    }
  });
});

var _get_display_value = require("./get_display_value");

Object.keys(_get_display_value).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _get_display_value[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _get_display_value[key];
    }
  });
});

var _get_filter_field = require("./get_filter_field");

Object.keys(_get_filter_field).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _get_filter_field[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _get_filter_field[key];
    }
  });
});

var _get_filter_params = require("./get_filter_params");

Object.keys(_get_filter_params).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _get_filter_params[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _get_filter_params[key];
    }
  });
});

var _get_index_pattern_from_filter = require("./get_index_pattern_from_filter");

Object.keys(_get_index_pattern_from_filter).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _get_index_pattern_from_filter[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _get_index_pattern_from_filter[key];
    }
  });
});

var _match_all_filter = require("./match_all_filter");

Object.keys(_match_all_filter).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _match_all_filter[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _match_all_filter[key];
    }
  });
});

var _meta_filter = require("./meta_filter");

Object.keys(_meta_filter).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _meta_filter[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _meta_filter[key];
    }
  });
});

var _missing_filter = require("./missing_filter");

Object.keys(_missing_filter).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _missing_filter[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _missing_filter[key];
    }
  });
});

var _phrase_filter = require("./phrase_filter");

Object.keys(_phrase_filter).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _phrase_filter[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _phrase_filter[key];
    }
  });
});

var _phrases_filter = require("./phrases_filter");

Object.keys(_phrases_filter).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _phrases_filter[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _phrases_filter[key];
    }
  });
});

var _query_string_filter = require("./query_string_filter");

Object.keys(_query_string_filter).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _query_string_filter[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _query_string_filter[key];
    }
  });
});

var _range_filter = require("./range_filter");

Object.keys(_range_filter).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _range_filter[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _range_filter[key];
    }
  });
});

var _types = require("./types");

Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types[key];
    }
  });
});

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Clean out any invalid attributes from the filters
 * @param {object} filter The filter to clean
 * @returns {object}
 */
const cleanFilter = filter => (0, _lodash.omit)(filter, ['meta', '$state']);

exports.cleanFilter = cleanFilter;

const isFilterDisabled = filter => (0, _lodash.get)(filter, 'meta.disabled', false);

exports.isFilterDisabled = isFilterDisabled;