"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bootstrapAnnotations = bootstrapAnnotations;

var _create_annotations_client = require("./create_annotations_client");

var _register_annotation_apis = require("./register_annotation_apis");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function bootstrapAnnotations({
  index,
  core,
  context
}) {
  const logger = context.logger.get('annotations');
  (0, _register_annotation_apis.registerAnnotationAPIs)({
    core,
    index,
    logger
  });
  return {
    getScopedAnnotationsClient: (requestContext, request) => {
      var _requestContext$licen;

      return (0, _create_annotations_client.createAnnotationsClient)({
        index,
        esClient: requestContext.core.elasticsearch.client.asCurrentUser,
        logger,
        license: (_requestContext$licen = requestContext.licensing) === null || _requestContext$licen === void 0 ? void 0 : _requestContext$licen.license
      });
    }
  };
}