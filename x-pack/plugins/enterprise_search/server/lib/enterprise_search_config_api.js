"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.callEnterpriseSearchConfigAPI = void 0;

var _abortController = _interopRequireDefault(require("abort-controller"));

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _strip_slashes = require("../../common/strip_slashes");

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

/**
 * Calls an internal Enterprise Search API endpoint which returns
 * useful various settings (e.g. product access, external URL)
 * needed by the Kibana plugin at the setup stage
 */


const ENDPOINT = '/api/ent/v2/internal/client_config';

const callEnterpriseSearchConfigAPI = async ({
  config,
  log,
  request
}) => {
  if (!config.host) return {};
  const TIMEOUT_WARNING = `Enterprise Search access check took over ${config.accessCheckTimeoutWarning}ms. Please ensure your Enterprise Search server is responding normally and not adversely impacting Kibana load speeds.`;
  const TIMEOUT_MESSAGE = `Exceeded ${config.accessCheckTimeout}ms timeout while checking ${config.host}. Please consider increasing your enterpriseSearch.accessCheckTimeout value so that users aren't prevented from accessing Enterprise Search plugins due to slow responses.`;
  const CONNECTION_ERROR = 'Could not perform access check to Enterprise Search';
  const warningTimeout = setTimeout(() => {
    log.warn(TIMEOUT_WARNING);
  }, config.accessCheckTimeoutWarning);
  const controller = new _abortController.default();
  const timeout = setTimeout(() => {
    controller.abort();
  }, config.accessCheckTimeout);

  try {
    var _data$current_user, _data$current_user$ac, _data$current_user2, _data$current_user2$a, _data$settings, _data$settings2, _data$settings3, _data$settings4, _data$settings5, _data$settings5$confi, _data$settings5$confi2, _data$settings5$confi3, _data$settings6, _data$settings6$confi, _data$settings6$confi2, _data$settings6$confi3, _data$settings7, _data$settings7$confi, _data$settings7$confi2, _data$settings7$confi3, _data$settings8, _data$settings8$confi, _data$settings8$confi2, _data$settings8$confi3, _data$current_user3, _data$current_user3$a, _data$current_user3$a2, _data$current_user4, _data$current_user4$a, _data$current_user4$a2, _data$current_user5, _data$current_user5$a, _data$current_user5$a2, _data$current_user6, _data$current_user6$a, _data$current_user6$a2, _data$current_user7, _data$current_user7$a, _data$current_user7$a2, _data$current_user7$a3, _data$current_user8, _data$current_user8$a, _data$current_user8$a2, _data$current_user8$a3, _data$current_user9, _data$current_user9$a, _data$current_user9$a2, _data$current_user9$a3, _data$current_user10, _data$current_user10$, _data$current_user10$2, _data$current_user10$3, _data$current_user11, _data$current_user11$, _data$current_user11$2, _data$current_user11$3, _data$current_user12, _data$current_user12$, _data$current_user12$2, _data$current_user12$3, _data$current_user13, _data$current_user13$, _data$current_user13$2, _data$current_user14, _data$current_user14$, _data$current_user14$2, _data$current_user15, _data$current_user15$, _data$current_user15$2, _data$current_user16, _data$current_user16$, _data$current_user16$2, _data$current_user17, _data$current_user17$, _data$current_user17$2, _data$current_user18, _data$current_user18$, _data$current_user18$2, _data$current_user19, _data$current_user19$, _data$current_user19$2, _data$current_user20, _data$current_user20$, _data$current_user20$2, _data$current_user21, _data$current_user21$, _data$current_user21$2;

    const enterpriseSearchUrl = encodeURI(`${config.host}${ENDPOINT}`);
    const response = await (0, _nodeFetch.default)(enterpriseSearchUrl, {
      headers: {
        Authorization: request.headers.authorization
      },
      signal: controller.signal
    });
    const data = await response.json();
    return {
      access: {
        hasAppSearchAccess: !!(data !== null && data !== void 0 && (_data$current_user = data.current_user) !== null && _data$current_user !== void 0 && (_data$current_user$ac = _data$current_user.access) !== null && _data$current_user$ac !== void 0 && _data$current_user$ac.app_search),
        hasWorkplaceSearchAccess: !!(data !== null && data !== void 0 && (_data$current_user2 = data.current_user) !== null && _data$current_user2 !== void 0 && (_data$current_user2$a = _data$current_user2.access) !== null && _data$current_user2$a !== void 0 && _data$current_user2$a.workplace_search)
      },
      publicUrl: (0, _strip_slashes.stripTrailingSlash)(data === null || data === void 0 ? void 0 : (_data$settings = data.settings) === null || _data$settings === void 0 ? void 0 : _data$settings.external_url),
      readOnlyMode: !!(data !== null && data !== void 0 && (_data$settings2 = data.settings) !== null && _data$settings2 !== void 0 && _data$settings2.read_only_mode),
      ilmEnabled: !!(data !== null && data !== void 0 && (_data$settings3 = data.settings) !== null && _data$settings3 !== void 0 && _data$settings3.ilm_enabled),
      isFederatedAuth: !!(data !== null && data !== void 0 && (_data$settings4 = data.settings) !== null && _data$settings4 !== void 0 && _data$settings4.is_federated_auth),
      // i.e., not standard auth
      configuredLimits: {
        appSearch: {
          engine: {
            maxDocumentByteSize: data === null || data === void 0 ? void 0 : (_data$settings5 = data.settings) === null || _data$settings5 === void 0 ? void 0 : (_data$settings5$confi = _data$settings5.configured_limits) === null || _data$settings5$confi === void 0 ? void 0 : (_data$settings5$confi2 = _data$settings5$confi.app_search) === null || _data$settings5$confi2 === void 0 ? void 0 : (_data$settings5$confi3 = _data$settings5$confi2.engine) === null || _data$settings5$confi3 === void 0 ? void 0 : _data$settings5$confi3.document_size_in_bytes,
            maxEnginesPerMetaEngine: data === null || data === void 0 ? void 0 : (_data$settings6 = data.settings) === null || _data$settings6 === void 0 ? void 0 : (_data$settings6$confi = _data$settings6.configured_limits) === null || _data$settings6$confi === void 0 ? void 0 : (_data$settings6$confi2 = _data$settings6$confi.app_search) === null || _data$settings6$confi2 === void 0 ? void 0 : (_data$settings6$confi3 = _data$settings6$confi2.engine) === null || _data$settings6$confi3 === void 0 ? void 0 : _data$settings6$confi3.source_engines_per_meta_engine
          }
        },
        workplaceSearch: {
          customApiSource: {
            maxDocumentByteSize: data === null || data === void 0 ? void 0 : (_data$settings7 = data.settings) === null || _data$settings7 === void 0 ? void 0 : (_data$settings7$confi = _data$settings7.configured_limits) === null || _data$settings7$confi === void 0 ? void 0 : (_data$settings7$confi2 = _data$settings7$confi.workplace_search) === null || _data$settings7$confi2 === void 0 ? void 0 : (_data$settings7$confi3 = _data$settings7$confi2.custom_api_source) === null || _data$settings7$confi3 === void 0 ? void 0 : _data$settings7$confi3.document_size_in_bytes,
            totalFields: data === null || data === void 0 ? void 0 : (_data$settings8 = data.settings) === null || _data$settings8 === void 0 ? void 0 : (_data$settings8$confi = _data$settings8.configured_limits) === null || _data$settings8$confi === void 0 ? void 0 : (_data$settings8$confi2 = _data$settings8$confi.workplace_search) === null || _data$settings8$confi2 === void 0 ? void 0 : (_data$settings8$confi3 = _data$settings8$confi2.custom_api_source) === null || _data$settings8$confi3 === void 0 ? void 0 : _data$settings8$confi3.total_fields
          }
        }
      },
      appSearch: {
        accountId: data === null || data === void 0 ? void 0 : (_data$current_user3 = data.current_user) === null || _data$current_user3 === void 0 ? void 0 : (_data$current_user3$a = _data$current_user3.app_search) === null || _data$current_user3$a === void 0 ? void 0 : (_data$current_user3$a2 = _data$current_user3$a.account) === null || _data$current_user3$a2 === void 0 ? void 0 : _data$current_user3$a2.id,
        onboardingComplete: !!(data !== null && data !== void 0 && (_data$current_user4 = data.current_user) !== null && _data$current_user4 !== void 0 && (_data$current_user4$a = _data$current_user4.app_search) !== null && _data$current_user4$a !== void 0 && (_data$current_user4$a2 = _data$current_user4$a.account) !== null && _data$current_user4$a2 !== void 0 && _data$current_user4$a2.onboarding_complete),
        role: {
          id: data === null || data === void 0 ? void 0 : (_data$current_user5 = data.current_user) === null || _data$current_user5 === void 0 ? void 0 : (_data$current_user5$a = _data$current_user5.app_search) === null || _data$current_user5$a === void 0 ? void 0 : (_data$current_user5$a2 = _data$current_user5$a.role) === null || _data$current_user5$a2 === void 0 ? void 0 : _data$current_user5$a2.id,
          roleType: data === null || data === void 0 ? void 0 : (_data$current_user6 = data.current_user) === null || _data$current_user6 === void 0 ? void 0 : (_data$current_user6$a = _data$current_user6.app_search) === null || _data$current_user6$a === void 0 ? void 0 : (_data$current_user6$a2 = _data$current_user6$a.role) === null || _data$current_user6$a2 === void 0 ? void 0 : _data$current_user6$a2.role_type,
          ability: {
            accessAllEngines: !!(data !== null && data !== void 0 && (_data$current_user7 = data.current_user) !== null && _data$current_user7 !== void 0 && (_data$current_user7$a = _data$current_user7.app_search) !== null && _data$current_user7$a !== void 0 && (_data$current_user7$a2 = _data$current_user7$a.role) !== null && _data$current_user7$a2 !== void 0 && (_data$current_user7$a3 = _data$current_user7$a2.ability) !== null && _data$current_user7$a3 !== void 0 && _data$current_user7$a3.access_all_engines),
            manage: (data === null || data === void 0 ? void 0 : (_data$current_user8 = data.current_user) === null || _data$current_user8 === void 0 ? void 0 : (_data$current_user8$a = _data$current_user8.app_search) === null || _data$current_user8$a === void 0 ? void 0 : (_data$current_user8$a2 = _data$current_user8$a.role) === null || _data$current_user8$a2 === void 0 ? void 0 : (_data$current_user8$a3 = _data$current_user8$a2.ability) === null || _data$current_user8$a3 === void 0 ? void 0 : _data$current_user8$a3.manage) || [],
            edit: (data === null || data === void 0 ? void 0 : (_data$current_user9 = data.current_user) === null || _data$current_user9 === void 0 ? void 0 : (_data$current_user9$a = _data$current_user9.app_search) === null || _data$current_user9$a === void 0 ? void 0 : (_data$current_user9$a2 = _data$current_user9$a.role) === null || _data$current_user9$a2 === void 0 ? void 0 : (_data$current_user9$a3 = _data$current_user9$a2.ability) === null || _data$current_user9$a3 === void 0 ? void 0 : _data$current_user9$a3.edit) || [],
            view: (data === null || data === void 0 ? void 0 : (_data$current_user10 = data.current_user) === null || _data$current_user10 === void 0 ? void 0 : (_data$current_user10$ = _data$current_user10.app_search) === null || _data$current_user10$ === void 0 ? void 0 : (_data$current_user10$2 = _data$current_user10$.role) === null || _data$current_user10$2 === void 0 ? void 0 : (_data$current_user10$3 = _data$current_user10$2.ability) === null || _data$current_user10$3 === void 0 ? void 0 : _data$current_user10$3.view) || [],
            credentialTypes: (data === null || data === void 0 ? void 0 : (_data$current_user11 = data.current_user) === null || _data$current_user11 === void 0 ? void 0 : (_data$current_user11$ = _data$current_user11.app_search) === null || _data$current_user11$ === void 0 ? void 0 : (_data$current_user11$2 = _data$current_user11$.role) === null || _data$current_user11$2 === void 0 ? void 0 : (_data$current_user11$3 = _data$current_user11$2.ability) === null || _data$current_user11$3 === void 0 ? void 0 : _data$current_user11$3.credential_types) || [],
            availableRoleTypes: (data === null || data === void 0 ? void 0 : (_data$current_user12 = data.current_user) === null || _data$current_user12 === void 0 ? void 0 : (_data$current_user12$ = _data$current_user12.app_search) === null || _data$current_user12$ === void 0 ? void 0 : (_data$current_user12$2 = _data$current_user12$.role) === null || _data$current_user12$2 === void 0 ? void 0 : (_data$current_user12$3 = _data$current_user12$2.ability) === null || _data$current_user12$3 === void 0 ? void 0 : _data$current_user12$3.available_role_types) || []
          }
        }
      },
      workplaceSearch: {
        organization: {
          name: data === null || data === void 0 ? void 0 : (_data$current_user13 = data.current_user) === null || _data$current_user13 === void 0 ? void 0 : (_data$current_user13$ = _data$current_user13.workplace_search) === null || _data$current_user13$ === void 0 ? void 0 : (_data$current_user13$2 = _data$current_user13$.organization) === null || _data$current_user13$2 === void 0 ? void 0 : _data$current_user13$2.name,
          defaultOrgName: data === null || data === void 0 ? void 0 : (_data$current_user14 = data.current_user) === null || _data$current_user14 === void 0 ? void 0 : (_data$current_user14$ = _data$current_user14.workplace_search) === null || _data$current_user14$ === void 0 ? void 0 : (_data$current_user14$2 = _data$current_user14$.organization) === null || _data$current_user14$2 === void 0 ? void 0 : _data$current_user14$2.default_org_name
        },
        account: {
          id: data === null || data === void 0 ? void 0 : (_data$current_user15 = data.current_user) === null || _data$current_user15 === void 0 ? void 0 : (_data$current_user15$ = _data$current_user15.workplace_search) === null || _data$current_user15$ === void 0 ? void 0 : (_data$current_user15$2 = _data$current_user15$.account) === null || _data$current_user15$2 === void 0 ? void 0 : _data$current_user15$2.id,
          groups: (data === null || data === void 0 ? void 0 : (_data$current_user16 = data.current_user) === null || _data$current_user16 === void 0 ? void 0 : (_data$current_user16$ = _data$current_user16.workplace_search) === null || _data$current_user16$ === void 0 ? void 0 : (_data$current_user16$2 = _data$current_user16$.account) === null || _data$current_user16$2 === void 0 ? void 0 : _data$current_user16$2.groups) || [],
          isAdmin: !!(data !== null && data !== void 0 && (_data$current_user17 = data.current_user) !== null && _data$current_user17 !== void 0 && (_data$current_user17$ = _data$current_user17.workplace_search) !== null && _data$current_user17$ !== void 0 && (_data$current_user17$2 = _data$current_user17$.account) !== null && _data$current_user17$2 !== void 0 && _data$current_user17$2.is_admin),
          canCreatePersonalSources: !!(data !== null && data !== void 0 && (_data$current_user18 = data.current_user) !== null && _data$current_user18 !== void 0 && (_data$current_user18$ = _data$current_user18.workplace_search) !== null && _data$current_user18$ !== void 0 && (_data$current_user18$2 = _data$current_user18$.account) !== null && _data$current_user18$2 !== void 0 && _data$current_user18$2.can_create_personal_sources),
          canCreateInvitations: !!(data !== null && data !== void 0 && (_data$current_user19 = data.current_user) !== null && _data$current_user19 !== void 0 && (_data$current_user19$ = _data$current_user19.workplace_search) !== null && _data$current_user19$ !== void 0 && (_data$current_user19$2 = _data$current_user19$.account) !== null && _data$current_user19$2 !== void 0 && _data$current_user19$2.can_create_invitations),
          isCurated: !!(data !== null && data !== void 0 && (_data$current_user20 = data.current_user) !== null && _data$current_user20 !== void 0 && (_data$current_user20$ = _data$current_user20.workplace_search) !== null && _data$current_user20$ !== void 0 && (_data$current_user20$2 = _data$current_user20$.account) !== null && _data$current_user20$2 !== void 0 && _data$current_user20$2.is_curated),
          viewedOnboardingPage: !!(data !== null && data !== void 0 && (_data$current_user21 = data.current_user) !== null && _data$current_user21 !== void 0 && (_data$current_user21$ = _data$current_user21.workplace_search) !== null && _data$current_user21$ !== void 0 && (_data$current_user21$2 = _data$current_user21$.account) !== null && _data$current_user21$2 !== void 0 && _data$current_user21$2.viewed_onboarding_page)
        }
      }
    };
  } catch (err) {
    if (err.name === 'AbortError') {
      log.warn(TIMEOUT_MESSAGE);
    } else {
      log.error(`${CONNECTION_ERROR}: ${err.toString()}`);
      if (err instanceof Error) log.debug(err.stack);
    }

    return {};
  } finally {
    clearTimeout(warningTimeout);
    clearTimeout(timeout);
  }
};

exports.callEnterpriseSearchConfigAPI = callEnterpriseSearchConfigAPI;