"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PolicyWatcher = void 0;

var _common = require("../../../../../fleet/common");

var _policy_config = require("../../../../common/license/policy_config");

var _license = require("../../../../common/license/license");

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

class PolicyWatcher {
  constructor(policyService, soStart, esStart, logger) {
    _defineProperty(this, "logger", void 0);

    _defineProperty(this, "esClient", void 0);

    _defineProperty(this, "policyService", void 0);

    _defineProperty(this, "subscription", void 0);

    _defineProperty(this, "soStart", void 0);

    this.policyService = policyService;
    this.esClient = esStart.client.asInternalUser;
    this.logger = logger;
    this.soStart = soStart;
  }
  /**
   * The policy watcher is not called as part of a HTTP request chain, where the
   * request-scoped SOClient could be passed down. It is called via license observable
   * changes. We are acting as the 'system' in response to license changes, so we are
   * intentionally using the system user here. Be very aware of what you are using this
   * client to do
   */


  makeInternalSOClient(soStart) {
    const fakeRequest = {
      headers: {},
      getBasePath: () => '',
      path: '/',
      route: {
        settings: {}
      },
      url: {
        href: {}
      },
      raw: {
        req: {
          url: '/'
        }
      }
    };
    return soStart.getScopedClient(fakeRequest, {
      excludedWrappers: ['security']
    });
  }

  start(licenseService) {
    var _licenseService$getLi;

    this.subscription = (_licenseService$getLi = licenseService.getLicenseInformation$()) === null || _licenseService$getLi === void 0 ? void 0 : _licenseService$getLi.subscribe(this.watch.bind(this));
  }

  stop() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  async watch(license) {
    if ((0, _license.isAtLeast)(license, 'platinum')) {
      return;
    }

    let page = 1;
    let response;

    do {
      try {
        response = await this.policyService.list(this.makeInternalSOClient(this.soStart), {
          page: page++,
          perPage: 100,
          kuery: `${_common.PACKAGE_POLICY_SAVED_OBJECT_TYPE}.package.name: endpoint`
        });
      } catch (e) {
        this.logger.warn(`Unable to verify endpoint policies in line with license change: failed to fetch package policies: ${e.message}`);
        return;
      }

      response.items.forEach(async policy => {
        var _updatePolicy$inputs$;

        const updatePolicy = {
          name: policy.name,
          description: policy.description,
          namespace: policy.namespace,
          enabled: policy.enabled,
          policy_id: policy.policy_id,
          output_id: policy.output_id,
          package: policy.package,
          inputs: policy.inputs,
          version: policy.version
        };
        const policyConfig = (_updatePolicy$inputs$ = updatePolicy.inputs[0].config) === null || _updatePolicy$inputs$ === void 0 ? void 0 : _updatePolicy$inputs$.policy.value;

        if (!(0, _policy_config.isEndpointPolicyValidForLicense)(policyConfig, license)) {
          updatePolicy.inputs[0].config.policy.value = (0, _policy_config.unsetPolicyFeaturesAboveLicenseLevel)(policyConfig, license);

          try {
            await this.policyService.update(this.makeInternalSOClient(this.soStart), this.esClient, policy.id, updatePolicy);
          } catch (e) {
            // try again for transient issues
            try {
              await this.policyService.update(this.makeInternalSOClient(this.soStart), this.esClient, policy.id, updatePolicy);
            } catch (ee) {
              this.logger.warn(`Unable to remove platinum features from policy ${policy.id}: ${ee.message}`);
            }
          }
        }
      });
    } while (response.page * response.perPage < response.total);
  }

}

exports.PolicyWatcher = PolicyWatcher;