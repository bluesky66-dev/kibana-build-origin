"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerDownloadArtifactRoute = registerDownloadArtifactRoute;

var _authenticate = require("../../../../../fleet/server/services/agents/authenticate");

var _constants = require("../../../../common/endpoint/constants");

var _route_validation = require("../../../utils/build_validation/route_validation");

var _artifacts = require("../../lib/artifacts");

var _artifacts2 = require("../../schemas/artifacts");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// eslint-disable-next-line @kbn/eslint/no-restricted-paths


const allowlistBaseRoute = '/api/endpoint/artifacts';
/**
 * Registers the artifact download route to enable sensors to download an allowlist artifact
 */

function registerDownloadArtifactRoute(router, endpointContext, cache) {
  router.get({
    path: `${allowlistBaseRoute}/download/{identifier}/{sha256}`,
    validate: {
      params: (0, _route_validation.buildRouteValidation)(_artifacts2.downloadArtifactRequestParamsSchema)
    },
    options: {
      tags: [_constants.LIMITED_CONCURRENCY_ENDPOINT_ROUTE_TAG]
    }
  }, async (context, req, res) => {
    let scopedSOClient;
    const logger = endpointContext.logFactory.get('download_artifact'); // The ApiKey must be associated with an enrolled Fleet agent

    try {
      scopedSOClient = endpointContext.service.getScopedSavedObjectsClient(req);
      await (0, _authenticate.authenticateAgentWithAccessToken)(scopedSOClient, context.core.elasticsearch.client.asInternalUser, req);
    } catch (err) {
      if ((err.isBoom ? err.output.statusCode : err.statusCode) === 401) {
        return res.unauthorized();
      } else {
        return res.notFound();
      }
    }

    const validateDownload = (await endpointContext.config()).validateArtifactDownloads;

    const buildAndValidateResponse = (artName, body) => {
      const artifact = {
        body,
        headers: {
          'content-encoding': 'identity',
          'content-disposition': `attachment; filename=${artName}.zz`
        }
      };

      if (validateDownload && !_artifacts2.downloadArtifactResponseSchema.is(artifact)) {
        return res.internalError({
          body: 'Artifact failed to validate.'
        });
      } else {
        return res.ok(artifact);
      }
    };

    const id = `${req.params.identifier}-${req.params.sha256}`;
    const cacheResp = cache.get(id);

    if (cacheResp) {
      logger.debug(`Cache HIT artifact ${id}`);
      return buildAndValidateResponse(req.params.identifier, cacheResp);
    } else {
      logger.debug(`Cache MISS artifact ${id}`);
      return scopedSOClient.get(_artifacts.ArtifactConstants.SAVED_OBJECT_TYPE, id).then(artifact => {
        const body = Buffer.from(artifact.attributes.body, 'base64');
        cache.set(id, body);
        return buildAndValidateResponse(artifact.attributes.identifier, body);
      }).catch(err => {
        var _err$output;

        if ((err === null || err === void 0 ? void 0 : (_err$output = err.output) === null || _err$output === void 0 ? void 0 : _err$output.statusCode) === 404) {
          return res.notFound({
            body: `No artifact found for ${id}`
          });
        } else {
          return res.internalError({
            body: err
          });
        }
      });
    }
  });
}