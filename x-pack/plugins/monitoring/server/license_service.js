"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LicenseService = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const defaultLicenseFeature = {
  isAvailable: false,
  isEnabled: false
};

class LicenseService {
  setup({
    licensing,
    monitoringClient,
    config,
    log
  }) {
    const {
      refresh,
      license$
    } = licensing.createLicensePoller(monitoringClient, config.licensing.api_polling_frequency.asMilliseconds());
    let rawLicense;
    let licenseSubscription = license$.subscribe(nextRawLicense => {
      var _rawLicense;

      rawLicense = nextRawLicense;

      if (!((_rawLicense = rawLicense) !== null && _rawLicense !== void 0 && _rawLicense.isAvailable)) {
        var _rawLicense2;

        log.warn(`X-Pack Monitoring Cluster Alerts will not be available: ${(_rawLicense2 = rawLicense) === null || _rawLicense2 === void 0 ? void 0 : _rawLicense2.getUnavailableReason()}`);
      }
    });
    return {
      refresh,
      license$,
      getMessage: () => {
        var _rawLicense3;

        return ((_rawLicense3 = rawLicense) === null || _rawLicense3 === void 0 ? void 0 : _rawLicense3.getUnavailableReason()) || 'N/A';
      },
      getMonitoringFeature: () => {
        var _rawLicense4;

        return ((_rawLicense4 = rawLicense) === null || _rawLicense4 === void 0 ? void 0 : _rawLicense4.getFeature('monitoring')) || defaultLicenseFeature;
      },
      getWatcherFeature: () => {
        var _rawLicense5;

        return ((_rawLicense5 = rawLicense) === null || _rawLicense5 === void 0 ? void 0 : _rawLicense5.getFeature('watcher')) || defaultLicenseFeature;
      },
      getSecurityFeature: () => {
        var _rawLicense6;

        return ((_rawLicense6 = rawLicense) === null || _rawLicense6 === void 0 ? void 0 : _rawLicense6.getFeature('security')) || defaultLicenseFeature;
      },
      stop: () => {
        if (licenseSubscription) {
          licenseSubscription.unsubscribe();
          licenseSubscription = undefined;
        }
      }
    };
  }

}

exports.LicenseService = LicenseService;