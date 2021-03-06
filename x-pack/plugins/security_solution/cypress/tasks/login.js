"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.waitForPageWithoutDateRange = exports.loginAndWaitForTimeline = exports.loginAndWaitForPageWithoutDateRange = exports.loginAndWaitForPage = exports.login = exports.loginWithRole = exports.deleteRoleAndUser = exports.postRoleAndUser = exports.getCurlScriptEnvVars = exports.getUrlWithRoute = void 0;

var yaml = _interopRequireWildcard(require("js-yaml"));

var _url = _interopRequireDefault(require("url"));

var _timeline = require("../screens/timeline");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();

  _getRequireWildcardCache = function () {
    return cache;
  };

  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache();

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Credentials in the `kibana.dev.yml` config file will be used to authenticate
 * with Kibana when credentials are not provided via environment variables
 */


const KIBANA_DEV_YML_PATH = '../../../config/kibana.dev.yml';
/**
 * The configuration path in `kibana.dev.yml` to the username to be used when
 * authenticating with Kibana.
 */

const ELASTICSEARCH_USERNAME_CONFIG_PATH = 'config.elasticsearch.username';
/**
 * The configuration path in `kibana.dev.yml` to the password to be used when
 * authenticating with Kibana.
 */

const ELASTICSEARCH_PASSWORD_CONFIG_PATH = 'config.elasticsearch.password';
/**
 * The `CYPRESS_ELASTICSEARCH_USERNAME` environment variable specifies the
 * username to be used when authenticating with Kibana
 */

const ELASTICSEARCH_USERNAME = 'ELASTICSEARCH_USERNAME';
/**
 * The `CYPRESS_ELASTICSEARCH_PASSWORD` environment variable specifies the
 * username to be used when authenticating with Kibana
 */

const ELASTICSEARCH_PASSWORD = 'ELASTICSEARCH_PASSWORD';
/**
 * The Kibana server endpoint used for authentication
 */

const LOGIN_API_ENDPOINT = '/internal/security/login';
/**
 * cy.visit will default to the baseUrl which uses the default kibana test user
 * This function will override that functionality in cy.visit by building the baseUrl
 * directly from the environment variables set up in x-pack/test/security_solution_cypress/runner.ts
 *
 * @param role string role/user to log in with
 * @param route string route to visit
 */

const getUrlWithRoute = (role, route) => {
  const theUrl = `${_url.default.format({
    auth: `${role}:changeme`,
    username: role,
    password: 'changeme',
    protocol: Cypress.env('protocol'),
    hostname: Cypress.env('hostname'),
    port: Cypress.env('configport')
  })}${route.startsWith('/') ? '' : '/'}${route}`;
  cy.log(`origin: ${theUrl}`);
  return theUrl;
};

exports.getUrlWithRoute = getUrlWithRoute;

const getCurlScriptEnvVars = () => ({
  ELASTICSEARCH_URL: Cypress.env('ELASTICSEARCH_URL'),
  ELASTICSEARCH_USERNAME: Cypress.env('ELASTICSEARCH_USERNAME'),
  ELASTICSEARCH_PASSWORD: Cypress.env('ELASTICSEARCH_PASSWORD'),
  KIBANA_URL: Cypress.env('KIBANA_URL')
});

exports.getCurlScriptEnvVars = getCurlScriptEnvVars;

const postRoleAndUser = role => {
  const env = getCurlScriptEnvVars();
  const detectionsRoleScriptPath = `./server/lib/detection_engine/scripts/roles_users/${role}/post_detections_role.sh`;
  const detectionsRoleJsonPath = `./server/lib/detection_engine/scripts/roles_users/${role}/detections_role.json`;
  const detectionsUserScriptPath = `./server/lib/detection_engine/scripts/roles_users/${role}/post_detections_user.sh`;
  const detectionsUserJsonPath = `./server/lib/detection_engine/scripts/roles_users/${role}/detections_user.json`; // post the role

  cy.exec(`bash ${detectionsRoleScriptPath} ${detectionsRoleJsonPath}`, {
    env
  }); // post the user associated with the role to elasticsearch

  cy.exec(`bash ${detectionsUserScriptPath} ${detectionsUserJsonPath}`, {
    env
  });
};

exports.postRoleAndUser = postRoleAndUser;

const deleteRoleAndUser = role => {
  const env = getCurlScriptEnvVars();
  const detectionsUserDeleteScriptPath = `./server/lib/detection_engine/scripts/roles_users/${role}/delete_detections_user.sh`; // delete the role

  cy.exec(`bash ${detectionsUserDeleteScriptPath}`, {
    env
  });
};

exports.deleteRoleAndUser = deleteRoleAndUser;

const loginWithRole = async role => {
  postRoleAndUser(role);

  const theUrl = _url.default.format({
    auth: `${role}:changeme`,
    username: role,
    password: 'changeme',
    protocol: Cypress.env('protocol'),
    hostname: Cypress.env('hostname'),
    port: Cypress.env('configport')
  });

  cy.log(`origin: ${theUrl}`);
  cy.request({
    body: {
      providerType: 'basic',
      providerName: 'basic',
      currentURL: '/',
      params: {
        username: role,
        password: 'changeme'
      }
    },
    headers: {
      'kbn-xsrf': 'cypress-creds-via-config'
    },
    method: 'POST',
    url: getUrlWithRoute(role, LOGIN_API_ENDPOINT)
  });
};
/**
 * Authenticates with Kibana using, if specified, credentials specified by
 * environment variables. The credentials in `kibana.dev.yml` will be used
 * for authentication when the environment variables are unset.
 *
 * To speed the execution of tests, prefer this non-interactive authentication,
 * which is faster than authentication via Kibana's interactive login page.
 */


exports.loginWithRole = loginWithRole;

const login = role => {
  if (role != null) {
    loginWithRole(role);
  } else if (credentialsProvidedByEnvironment()) {
    loginViaEnvironmentCredentials();
  } else {
    loginViaConfig();
  }
};
/**
 * Returns `true` if the credentials used to login to Kibana are provided
 * via environment variables
 */


exports.login = login;

const credentialsProvidedByEnvironment = () => Cypress.env(ELASTICSEARCH_USERNAME) != null && Cypress.env(ELASTICSEARCH_PASSWORD) != null;
/**
 * Authenticates with Kibana by reading credentials from the
 * `CYPRESS_ELASTICSEARCH_USERNAME` and `CYPRESS_ELASTICSEARCH_PASSWORD`
 * environment variables, and POSTing the username and password directly to
 * Kibana's `/internal/security/login` endpoint, bypassing the login page (for speed).
 */


const loginViaEnvironmentCredentials = () => {
  cy.log(`Authenticating via environment credentials from the \`CYPRESS_${ELASTICSEARCH_USERNAME}\` and \`CYPRESS_${ELASTICSEARCH_PASSWORD}\` environment variables`); // programmatically authenticate without interacting with the Kibana login page

  cy.request({
    body: {
      providerType: 'basic',
      providerName: 'basic',
      currentURL: '/',
      params: {
        username: Cypress.env(ELASTICSEARCH_USERNAME),
        password: Cypress.env(ELASTICSEARCH_PASSWORD)
      }
    },
    headers: {
      'kbn-xsrf': 'cypress-creds-via-env'
    },
    method: 'POST',
    url: `${Cypress.config().baseUrl}${LOGIN_API_ENDPOINT}`
  });
};
/**
 * Authenticates with Kibana by reading credentials from the
 * `kibana.dev.yml` file and POSTing the username and password directly to
 * Kibana's `/internal/security/login` endpoint, bypassing the login page (for speed).
 */


const loginViaConfig = () => {
  cy.log(`Authenticating via config credentials \`${ELASTICSEARCH_USERNAME_CONFIG_PATH}\` and \`${ELASTICSEARCH_PASSWORD_CONFIG_PATH}\` from \`${KIBANA_DEV_YML_PATH}\``); // read the login details from `kibana.dev.yaml`

  cy.readFile(KIBANA_DEV_YML_PATH).then(kibanaDevYml => {
    const config = yaml.safeLoad(kibanaDevYml); // programmatically authenticate without interacting with the Kibana login page

    cy.request({
      body: {
        providerType: 'basic',
        providerName: 'basic',
        currentURL: '/',
        params: {
          username: config.elasticsearch.username,
          password: config.elasticsearch.password
        }
      },
      headers: {
        'kbn-xsrf': 'cypress-creds-via-config'
      },
      method: 'POST',
      url: `${Cypress.config().baseUrl}${LOGIN_API_ENDPOINT}`
    });
  });
};
/**
 * Authenticates with Kibana, visits the specified `url`, and waits for the
 * Kibana global nav to be displayed before continuing
 */


const loginAndWaitForPage = (url, role) => {
  login(role);
  cy.visit(`${url}?timerange=(global:(linkTo:!(timeline),timerange:(from:1547914976217,fromStr:'2019-01-19T16:22:56.217Z',kind:relative,to:1579537385745,toStr:now)),timeline:(linkTo:!(global),timerange:(from:1547914976217,fromStr:'2019-01-19T16:22:56.217Z',kind:relative,to:1579537385745,toStr:now)))`);
  cy.get('[data-test-subj="headerGlobalNav"]');
};

exports.loginAndWaitForPage = loginAndWaitForPage;

const loginAndWaitForPageWithoutDateRange = (url, role) => {
  login(role);
  cy.visit(role ? getUrlWithRoute(role, url) : url);
  cy.get('[data-test-subj="headerGlobalNav"]', {
    timeout: 120000
  });
};

exports.loginAndWaitForPageWithoutDateRange = loginAndWaitForPageWithoutDateRange;

const loginAndWaitForTimeline = (timelineId, role) => {
  const route = `/app/security/timelines?timeline=(id:'${timelineId}',isOpen:!t)`;
  login(role);
  cy.visit(role ? getUrlWithRoute(role, route) : route);
  cy.get('[data-test-subj="headerGlobalNav"]');
  cy.get(_timeline.TIMELINE_FLYOUT_BODY).should('be.visible');
};

exports.loginAndWaitForTimeline = loginAndWaitForTimeline;

const waitForPageWithoutDateRange = (url, role) => {
  cy.visit(role ? getUrlWithRoute(role, url) : url);
  cy.get('[data-test-subj="headerGlobalNav"]', {
    timeout: 120000
  });
};

exports.waitForPageWithoutDateRange = waitForPageWithoutDateRange;