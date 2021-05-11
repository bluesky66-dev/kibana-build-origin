"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initExternalSpacesApi = initExternalSpacesApi;

var _delete = require("./delete");

var _get = require("./get");

var _get_all = require("./get_all");

var _post = require("./post");

var _put = require("./put");

var _copy_to_space = require("./copy_to_space");

var _share_to_space = require("./share_to_space");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function initExternalSpacesApi(deps) {
  (0, _delete.initDeleteSpacesApi)(deps);
  (0, _get.initGetSpaceApi)(deps);
  (0, _get_all.initGetAllSpacesApi)(deps);
  (0, _post.initPostSpacesApi)(deps);
  (0, _put.initPutSpacesApi)(deps);
  (0, _copy_to_space.initCopyToSpacesApi)(deps);
  (0, _share_to_space.initShareToSpacesApi)(deps);
}