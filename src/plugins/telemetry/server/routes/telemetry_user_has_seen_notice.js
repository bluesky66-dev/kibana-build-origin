"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerTelemetryUserHasSeenNotice = registerTelemetryUserHasSeenNotice;

var _telemetry_repository = require("../telemetry_repository");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function registerTelemetryUserHasSeenNotice(router) {
  router.put({
    path: '/api/telemetry/v2/userHasSeenNotice',
    validate: false
  }, async (context, req, res) => {
    const internalRepository = context.core.savedObjects.client;
    const telemetrySavedObject = await (0, _telemetry_repository.getTelemetrySavedObject)(internalRepository); // update the object with a flag stating that the opt-in notice has been seen

    const updatedAttributes = { ...telemetrySavedObject,
      userHasSeenNotice: true
    };
    await (0, _telemetry_repository.updateTelemetrySavedObject)(internalRepository, updatedAttributes);
    return res.ok({
      body: updatedAttributes
    });
  });
}