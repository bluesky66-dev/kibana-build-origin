"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.annotationRoutes = annotationRoutes;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _i18n = require("@kbn/i18n");

var _check_annotations = require("../lib/check_annotations");

var _annotation_service = require("../models/annotation_service");

var _error_wrapper = require("../client/error_wrapper");

var _annotations_schema = require("./schemas/annotations_schema");

var _annotations = require("../../common/constants/annotations");

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


function getAnnotationsFeatureUnavailableErrorMessage() {
  return _boom.default.badRequest(_i18n.i18n.translate('xpack.ml.routes.annotations.annotationsFeatureUnavailableErrorMessage', {
    defaultMessage: 'Index and aliases required for the annotations feature have not been' + ' created or are not accessible for the current user.'
  }));
}
/**
 * Routes for annotations
 */


function annotationRoutes({
  router,
  routeGuard
}, securityPlugin) {
  /**
   * @apiGroup Annotations
   *
   * @api {post} /api/ml/annotations Gets annotations
   * @apiName GetAnnotations
   * @apiDescription Gets annotations.
   *
   * @apiSchema (body) getAnnotationsSchema
   *
   * @apiSuccess {Boolean} success
   * @apiSuccess {Object} annotations
   */
  router.post({
    path: '/api/ml/annotations',
    validate: {
      body: _annotations_schema.getAnnotationsSchema
    },
    options: {
      tags: ['access:ml:canGetAnnotations']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    client,
    request,
    response
  }) => {
    try {
      const {
        getAnnotations
      } = (0, _annotation_service.annotationServiceProvider)(client);
      const resp = await getAnnotations(request.body);
      return response.ok({
        body: resp
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
  /**
   * @apiGroup Annotations
   *
   * @api {put} /api/ml/annotations/index Index annotation
   * @apiName IndexAnnotations
   * @apiDescription Index the annotation.
   *
   * @apiSchema (body) indexAnnotationSchema
   */

  router.put({
    path: '/api/ml/annotations/index',
    validate: {
      body: _annotations_schema.indexAnnotationSchema
    },
    options: {
      tags: ['access:ml:canCreateAnnotation']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    client,
    request,
    response
  }) => {
    try {
      var _currentUser$username;

      const annotationsFeatureAvailable = await (0, _check_annotations.isAnnotationsFeatureAvailable)(client);

      if (annotationsFeatureAvailable === false) {
        throw getAnnotationsFeatureUnavailableErrorMessage();
      }

      const {
        indexAnnotation
      } = (0, _annotation_service.annotationServiceProvider)(client);
      const currentUser = securityPlugin !== undefined ? securityPlugin.authc.getCurrentUser(request) : {}; // @ts-expect-error username doesn't exist on {}

      const username = (_currentUser$username = currentUser === null || currentUser === void 0 ? void 0 : currentUser.username) !== null && _currentUser$username !== void 0 ? _currentUser$username : _annotations.ANNOTATION_USER_UNKNOWN;
      const resp = await indexAnnotation(request.body, username);
      return response.ok({
        body: resp
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
  /**
   * @apiGroup Annotations
   *
   * @api {delete} /api/ml/annotations/delete/:annotationId Deletes annotation
   * @apiName DeleteAnnotation
   * @apiDescription Deletes specified annotation
   *
   * @apiSchema (params) deleteAnnotationSchema
   */

  router.delete({
    path: '/api/ml/annotations/delete/{annotationId}',
    validate: {
      params: _annotations_schema.deleteAnnotationSchema
    },
    options: {
      tags: ['access:ml:canDeleteAnnotation']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    client,
    request,
    response
  }) => {
    try {
      const annotationsFeatureAvailable = await (0, _check_annotations.isAnnotationsFeatureAvailable)(client);

      if (annotationsFeatureAvailable === false) {
        throw getAnnotationsFeatureUnavailableErrorMessage();
      }

      const annotationId = request.params.annotationId;
      const {
        deleteAnnotation
      } = (0, _annotation_service.annotationServiceProvider)(client);
      const resp = await deleteAnnotation(annotationId);
      return response.ok({
        body: resp
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
}