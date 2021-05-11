"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createJourneyScreenshotRoute = void 0;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createJourneyScreenshotRoute = libs => ({
  method: 'GET',
  path: '/api/uptime/journey/screenshot/{checkGroup}/{stepIndex}',
  validate: {
    params: _configSchema.schema.object({
      checkGroup: _configSchema.schema.string(),
      stepIndex: _configSchema.schema.number(),
      _debug: _configSchema.schema.maybe(_configSchema.schema.boolean())
    })
  },
  handler: async ({
    uptimeEsClient,
    request,
    response
  }) => {
    const {
      checkGroup,
      stepIndex
    } = request.params;
    const result = await libs.requests.getJourneyScreenshot({
      uptimeEsClient,
      checkGroup,
      stepIndex
    });

    if (result === null) {
      return response.notFound();
    }

    return response.ok({
      body: Buffer.from(result.blob, 'base64'),
      headers: {
        'content-type': 'image/png',
        'cache-control': 'max-age=600',
        'caption-name': result.stepName,
        'max-steps': result.totalSteps
      }
    });
  }
});

exports.createJourneyScreenshotRoute = createJourneyScreenshotRoute;