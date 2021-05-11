"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EmbeddableTypes = void 0;

var _public = require("../../../../plugins/maps/public");

var _public2 = require("../../../../../src/plugins/visualizations/public");

var _constants = require("../../../../plugins/lens/common/constants");

var _public3 = require("../../../../../src/plugins/discover/public");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const EmbeddableTypes = {
  lens: _constants.LENS_EMBEDDABLE_TYPE,
  map: _public.MAP_SAVED_OBJECT_TYPE,
  search: _public3.SEARCH_EMBEDDABLE_TYPE,
  visualization: _public2.VISUALIZE_EMBEDDABLE_TYPE
};
exports.EmbeddableTypes = EmbeddableTypes;