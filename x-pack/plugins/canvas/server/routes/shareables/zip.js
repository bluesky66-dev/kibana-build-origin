"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initializeZipShareableWorkpadRoute = initializeZipShareableWorkpadRoute;

var _archiver = _interopRequireDefault(require("archiver"));

var _lib = require("../../../common/lib");

var _constants = require("../../../shareable_runtime/constants");

var _rendered_workpad_schema = require("./rendered_workpad_schema");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function initializeZipShareableWorkpadRoute(deps) {
  const {
    router
  } = deps;
  router.post({
    path: _lib.API_ROUTE_SHAREABLE_ZIP,
    validate: {
      body: _rendered_workpad_schema.RenderedWorkpadSchema
    }
  }, async (_context, request, response) => {
    const workpad = request.body;
    const archive = (0, _archiver.default)('zip');
    archive.append(JSON.stringify(workpad), {
      name: 'workpad.json'
    });
    archive.file(`${_constants.SHAREABLE_RUNTIME_SRC}/template.html`, {
      name: 'index.html'
    });
    archive.file(_constants.SHAREABLE_RUNTIME_FILE, {
      name: `${_constants.SHAREABLE_RUNTIME_NAME}.js`
    });
    const result = {
      headers: {
        'content-type': 'application/zip'
      },
      body: archive
    };
    archive.finalize();
    return response.ok(result);
  });
}