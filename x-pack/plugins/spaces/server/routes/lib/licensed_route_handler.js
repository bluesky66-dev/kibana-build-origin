"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createLicensedRouteHandler = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createLicensedRouteHandler = handler => {
  const licensedRouteHandler = (context, request, responseToolkit) => {
    const {
      license
    } = context.licensing;
    const licenseCheck = license.check('spaces', 'basic');

    if (licenseCheck.state === 'unavailable' || licenseCheck.state === 'invalid') {
      return responseToolkit.forbidden({
        body: {
          message: licenseCheck.message
        }
      });
    }

    return handler(context, request, responseToolkit);
  };

  return licensedRouteHandler;
};

exports.createLicensedRouteHandler = createLicensedRouteHandler;