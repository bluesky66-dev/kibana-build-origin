"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.notificationRoutes = notificationRoutes;

var _error_wrapper = require("../client/error_wrapper");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Routes for notification settings
 */


function notificationRoutes({
  router,
  routeGuard
}) {
  /**
   * @apiGroup NotificationSettings
   *
   * @api {get} /api/ml/notification_settings Get notification settings
   * @apiName GetNotificationSettings
   * @apiDescription Returns cluster notification settings
   */
  router.get({
    path: '/api/ml/notification_settings',
    validate: false,
    options: {
      tags: ['access:ml:canAccessML']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    client,
    response
  }) => {
    try {
      const {
        body
      } = await client.asCurrentUser.cluster.getSettings({
        include_defaults: true,
        filter_path: '**.xpack.notification'
      });
      return response.ok({
        body
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
}