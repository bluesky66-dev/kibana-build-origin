"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LicensingPlugin = void 0;

var _rxjs = require("rxjs");

var _moment = _interopRequireDefault(require("moment"));

var _crypto = require("crypto");

var _jsonStableStringify = _interopRequireDefault(require("json-stable-stringify"));

var _license = require("../common/license");

var _license_update = require("../common/license_update");

var _routes = require("./routes");

var _services = require("./services");

var _licensing_route_handler_context = require("./licensing_route_handler_context");

var _on_pre_response_handler = require("./on_pre_response_handler");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

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

function normalizeServerLicense(license) {
  return {
    uid: license.uid,
    type: license.type,
    mode: license.mode,
    expiryDateInMillis: license.expiry_date_in_millis,
    status: license.status
  };
}

function normalizeFeatures(rawFeatures) {
  const features = {};

  for (const [name, feature] of Object.entries(rawFeatures)) {
    features[name] = {
      isAvailable: feature.available,
      isEnabled: feature.enabled
    };
  }

  return features;
}

function sign({
  license,
  features,
  error
}) {
  return (0, _crypto.createHash)('sha256').update((0, _jsonStableStringify.default)({
    license,
    features,
    error
  })).digest('hex');
}
/**
 * @public
 * A plugin for fetching, refreshing, and receiving information about the license for the
 * current Kibana instance.
 */


class LicensingPlugin {
  constructor(context) {
    this.context = context;

    _defineProperty(this, "stop$", new _rxjs.Subject());

    _defineProperty(this, "logger", void 0);

    _defineProperty(this, "config", void 0);

    _defineProperty(this, "loggingSubscription", void 0);

    _defineProperty(this, "featureUsage", new _services.FeatureUsageService());

    _defineProperty(this, "refresh", void 0);

    _defineProperty(this, "license$", void 0);

    _defineProperty(this, "fetchLicense", async clusterClient => {
      try {
        const response = await clusterClient.callAsInternalUser('transport.request', {
          method: 'GET',
          path: '/_xpack?accept_enterprise=true'
        });
        const normalizedLicense = response.license ? normalizeServerLicense(response.license) : undefined;
        const normalizedFeatures = response.features ? normalizeFeatures(response.features) : undefined;
        const signature = sign({
          license: normalizedLicense,
          features: normalizedFeatures,
          error: ''
        });
        return new _license.License({
          license: normalizedLicense,
          features: normalizedFeatures,
          signature
        });
      } catch (error) {
        this.logger.warn(`License information could not be obtained from Elasticsearch due to ${error} error`);
        const errorMessage = this.getErrorMessage(error);
        const signature = sign({
          error: errorMessage
        });
        return new _license.License({
          error: this.getErrorMessage(error),
          signature
        });
      }
    });

    this.logger = this.context.logger.get();
    this.config = this.context.config.get();
  }

  setup(core) {
    this.logger.debug('Setting up Licensing plugin');
    const pollingFrequency = this.config.api_polling_frequency;

    async function callAsInternalUser(...args) {
      const [coreStart] = await core.getStartServices();
      const client = coreStart.elasticsearch.legacy.client;
      return await client.callAsInternalUser(...args);
    }

    const client = {
      callAsInternalUser,

      asScoped(request) {
        return {
          async callAsCurrentUser(...args) {
            const [coreStart] = await core.getStartServices();
            const _client = coreStart.elasticsearch.legacy.client;
            return await _client.asScoped(request).callAsCurrentUser(...args);
          },

          callAsInternalUser
        };
      }

    };
    const {
      refresh,
      license$
    } = this.createLicensePoller(client, pollingFrequency.asMilliseconds());
    core.http.registerRouteHandlerContext('licensing', (0, _licensing_route_handler_context.createRouteHandlerContext)(license$, core.getStartServices));
    const featureUsageSetup = this.featureUsage.setup();
    (0, _routes.registerRoutes)(core.http.createRouter(), featureUsageSetup, core.getStartServices);
    core.http.registerOnPreResponse((0, _on_pre_response_handler.createOnPreResponseHandler)(refresh, license$));
    this.refresh = refresh;
    this.license$ = license$;
    return {
      refresh,
      license$,
      createLicensePoller: this.createLicensePoller.bind(this),
      featureUsage: featureUsageSetup
    };
  }

  createLicensePoller(clusterClient, pollingFrequency) {
    this.logger.debug(`Polling Elasticsearch License API with frequency ${pollingFrequency}ms.`);
    const intervalRefresh$ = (0, _rxjs.timer)(0, pollingFrequency);
    const {
      license$,
      refreshManually
    } = (0, _license_update.createLicenseUpdate)(intervalRefresh$, this.stop$, () => this.fetchLicense(clusterClient));
    this.loggingSubscription = license$.subscribe(license => this.logger.debug('Imported license information from Elasticsearch:' + [`type: ${license.type}`, `status: ${license.status}`, `expiry date: ${(0, _moment.default)(license.expiryDateInMillis, 'x').format()}`].join(' | ')));
    return {
      refresh: async () => {
        this.logger.debug('Requesting Elasticsearch licensing API');
        return await refreshManually();
      },
      license$
    };
  }

  getErrorMessage(error) {
    if (error.status === 400) {
      return 'X-Pack plugin is not installed on the Elasticsearch cluster.';
    }

    return error.message;
  }

  start() {
    if (!this.refresh || !this.license$) {
      throw new Error('Setup has not been completed');
    }

    return {
      refresh: this.refresh,
      license$: this.license$,
      featureUsage: this.featureUsage.start(),
      createLicensePoller: this.createLicensePoller.bind(this)
    };
  }

  stop() {
    this.stop$.next();
    this.stop$.complete();

    if (this.loggingSubscription !== undefined) {
      this.loggingSubscription.unsubscribe();
      this.loggingSubscription = undefined;
    }
  }

}

exports.LicensingPlugin = LicensingPlugin;