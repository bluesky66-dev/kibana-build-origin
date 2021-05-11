"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RouteGuard = void 0;

var _saved_objects = require("../saved_objects");

var _ml_client = require("../lib/ml_client");

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

class RouteGuard {
  constructor(mlLicense, getSavedObject, getInternalSavedObject, spacesPlugin, authorization, isMlReady) {
    _defineProperty(this, "_mlLicense", void 0);

    _defineProperty(this, "_getMlSavedObjectClient", void 0);

    _defineProperty(this, "_getInternalSavedObjectClient", void 0);

    _defineProperty(this, "_spacesPlugin", void 0);

    _defineProperty(this, "_authorization", void 0);

    _defineProperty(this, "_isMlReady", void 0);

    this._mlLicense = mlLicense;
    this._getMlSavedObjectClient = getSavedObject;
    this._getInternalSavedObjectClient = getInternalSavedObject;
    this._spacesPlugin = spacesPlugin;
    this._authorization = authorization;
    this._isMlReady = isMlReady;
  }

  fullLicenseAPIGuard(handler) {
    return this._guard(() => this._mlLicense.isFullLicense(), handler);
  }

  basicLicenseAPIGuard(handler) {
    return this._guard(() => this._mlLicense.isMinimumLicense(), handler);
  }

  _guard(check, handler) {
    return (context, request, response) => {
      if (check() === false) {
        return response.forbidden();
      }

      const mlSavedObjectClient = this._getMlSavedObjectClient(request);

      const internalSavedObjectsClient = this._getInternalSavedObjectClient();

      if (mlSavedObjectClient === null || internalSavedObjectsClient === null) {
        return response.badRequest({
          body: {
            message: 'saved object client has not been initialized'
          }
        });
      }

      const jobSavedObjectService = (0, _saved_objects.jobSavedObjectServiceFactory)(mlSavedObjectClient, internalSavedObjectsClient, this._spacesPlugin !== undefined, this._authorization, this._isMlReady);
      const client = context.core.elasticsearch.client;
      return handler({
        client,
        request,
        response,
        context,
        jobSavedObjectService,
        mlClient: (0, _ml_client.getMlClient)(client, jobSavedObjectService)
      });
    };
  }

}

exports.RouteGuard = RouteGuard;