"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerDiagnoseScreenshot = void 0;

var _i18n = require("@kbn/i18n");

var _constants = require("../../../common/constants");

var _common = require("../../export_types/common");

var _get_absolute_url = require("../../export_types/common/get_absolute_url");

var _generate_png = require("../../export_types/png/lib/generate_png");

var _authorized_user_pre_routing = require("../lib/authorized_user_pre_routing");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const registerDiagnoseScreenshot = (reporting, logger) => {
  const setupDeps = reporting.getPluginSetupDeps();
  const userHandler = (0, _authorized_user_pre_routing.authorizedUserPreRoutingFactory)(reporting);
  const {
    router
  } = setupDeps;
  router.post({
    path: `${_constants.API_DIAGNOSE_URL}/screenshot`,
    validate: {}
  }, userHandler(async (user, context, req, res) => {
    const generatePngObservable = await (0, _generate_png.generatePngObservableFactory)(reporting);
    const config = reporting.getConfig();
    const decryptedHeaders = req.headers;
    const [basePath, protocol, hostname, port] = [config.kbnConfig.get('server', 'basePath'), config.get('kibanaServer', 'protocol'), config.get('kibanaServer', 'hostname'), config.get('kibanaServer', 'port')];
    const getAbsoluteUrl = (0, _get_absolute_url.getAbsoluteUrlFactory)({
      basePath,
      protocol,
      hostname,
      port
    });
    const hashUrl = getAbsoluteUrl({
      path: '/',
      hash: '',
      search: ''
    }); // Hack the layout to make the base/login page work

    const layout = {
      id: 'png',
      dimensions: {
        width: 1440,
        height: 2024
      },
      selectors: {
        screenshot: '.application',
        renderComplete: '.application',
        itemsCountAttribute: 'data-test-subj="kibanaChrome"',
        timefilterDurationAttribute: 'data-test-subj="kibanaChrome"'
      }
    };
    const headers = {
      headers: (0, _common.omitBlockedHeaders)(decryptedHeaders),
      conditions: {
        hostname,
        port: +port,
        basePath,
        protocol
      }
    };
    return generatePngObservable(logger, hashUrl, 'America/Los_Angeles', headers, layout).pipe().toPromise().then(screenshot => {
      if (screenshot.warnings.length) {
        return res.ok({
          body: {
            success: false,
            help: [],
            logs: screenshot.warnings
          }
        });
      }

      return res.ok({
        body: {
          success: true,
          help: [],
          logs: ''
        }
      });
    }).catch(error => res.ok({
      body: {
        success: false,
        help: [_i18n.i18n.translate('xpack.reporting.diagnostic.screenshotFailureMessage', {
          defaultMessage: `We couldn't screenshot your Kibana install.`
        })],
        logs: error.message
      }
    }));
  }));
};

exports.registerDiagnoseScreenshot = registerDiagnoseScreenshot;