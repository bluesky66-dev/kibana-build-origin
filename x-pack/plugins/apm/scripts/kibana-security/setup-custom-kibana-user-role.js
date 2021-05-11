"use strict";

var _axios = _interopRequireDefault(require("axios"));

var _lodash = require("lodash");

var _yargs = require("yargs");

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

/* eslint-disable no-console */


const KIBANA_ROLE_SUFFIX = _yargs.argv.roleSuffix;
const ELASTICSEARCH_USERNAME = _yargs.argv.username || 'elastic';
const ELASTICSEARCH_PASSWORD = _yargs.argv.password;
const KIBANA_BASE_URL = _yargs.argv.kibanaUrl;
console.log({
  KIBANA_ROLE_SUFFIX,
  ELASTICSEARCH_USERNAME,
  ELASTICSEARCH_PASSWORD,
  KIBANA_BASE_URL
});
const getKibanaBasePath = (0, _lodash.once)(async () => {
  try {
    await _axios.default.request({
      url: KIBANA_BASE_URL,
      maxRedirects: 0
    });
  } catch (e) {
    if (isAxiosError(e)) {
      var _e$response, _e$response$headers;

      const location = (_e$response = e.response) === null || _e$response === void 0 ? void 0 : (_e$response$headers = _e$response.headers) === null || _e$response$headers === void 0 ? void 0 : _e$response$headers.location;
      const isBasePath = RegExp(/^\/\w{3}$/).test(location);
      return isBasePath ? location : '';
    }

    throw e;
  }

  return '';
});
init().catch(e => {
  if (e instanceof AbortError) {
    console.error(e.message);
  } else if (isAxiosError(e)) {
    var _e$config$method, _e$response2;

    console.error(`${((_e$config$method = e.config.method) === null || _e$config$method === void 0 ? void 0 : _e$config$method.toUpperCase()) || 'GET'} ${e.config.url} (Code: ${(_e$response2 = e.response) === null || _e$response2 === void 0 ? void 0 : _e$response2.status})`);

    if (e.response) {
      console.error(JSON.stringify({
        request: e.config,
        response: e.response.data
      }, null, 2));
    }
  } else {
    console.error(e);
  }
});

async function init() {
  if (!ELASTICSEARCH_PASSWORD) {
    console.log('Please specify credentials for elasticsearch: `--username elastic --password abcd` ');
    return;
  }

  if (!KIBANA_BASE_URL) {
    console.log('Please specify the url for Kibana: `--kibana-url http://localhost:5601` ');
    return;
  }

  if (!KIBANA_BASE_URL.startsWith('https://') && !KIBANA_BASE_URL.startsWith('http://')) {
    console.log('Kibana url must be prefixed with http(s):// `--kibana-url http://localhost:5601`');
    return;
  }

  if (!KIBANA_ROLE_SUFFIX) {
    console.log('Please specify a unique suffix that will be added to your roles with `--role-suffix <suffix>` ');
    return;
  }

  const version = await getKibanaVersion();
  console.log(`Connected to Kibana ${version}`);
  const isEnabled = await isSecurityEnabled();

  if (!isEnabled) {
    console.log('Security must be enabled!');
    return;
  }

  const APM_READ_ROLE = `apm_read_${KIBANA_ROLE_SUFFIX}`;
  const KIBANA_READ_ROLE = `kibana_read_${KIBANA_ROLE_SUFFIX}`;
  const KIBANA_WRITE_ROLE = `kibana_write_${KIBANA_ROLE_SUFFIX}`;
  const APM_USER_ROLE = 'apm_user'; // create roles

  await createRole({
    roleName: APM_READ_ROLE,
    kibanaPrivileges: {
      feature: {
        apm: ['read']
      }
    }
  });
  await createRole({
    roleName: KIBANA_READ_ROLE,
    kibanaPrivileges: {
      feature: {
        // core
        discover: ['read'],
        dashboard: ['read'],
        canvas: ['read'],
        ml: ['read'],
        maps: ['read'],
        graph: ['read'],
        visualize: ['read'],
        // observability
        logs: ['read'],
        infrastructure: ['read'],
        apm: ['read'],
        uptime: ['read'],
        // security
        siem: ['read'],
        // management
        dev_tools: ['read'],
        advancedSettings: ['read'],
        indexPatterns: ['read'],
        savedObjectsManagement: ['read'],
        stackAlerts: ['read'],
        fleet: ['read'],
        actions: ['read']
      }
    }
  });
  await createRole({
    roleName: KIBANA_WRITE_ROLE,
    kibanaPrivileges: {
      feature: {
        // core
        discover: ['all'],
        dashboard: ['all'],
        canvas: ['all'],
        ml: ['all'],
        maps: ['all'],
        graph: ['all'],
        visualize: ['all'],
        // observability
        logs: ['all'],
        infrastructure: ['all'],
        apm: ['all'],
        uptime: ['all'],
        // security
        siem: ['all'],
        // management
        dev_tools: ['all'],
        advancedSettings: ['all'],
        indexPatterns: ['all'],
        savedObjectsManagement: ['all'],
        stackAlerts: ['all'],
        fleet: ['all'],
        actions: ['all']
      }
    }
  }); // read access only to APM + apm index access

  await createOrUpdateUser({
    username: 'apm_read_user',
    roles: [APM_USER_ROLE, APM_READ_ROLE]
  }); // read access to all apps + apm index access

  await createOrUpdateUser({
    username: 'kibana_read_user',
    roles: [APM_USER_ROLE, KIBANA_READ_ROLE]
  }); // read/write access to all apps + apm index access

  await createOrUpdateUser({
    username: 'kibana_write_user',
    roles: [APM_USER_ROLE, KIBANA_WRITE_ROLE]
  });
}

async function isSecurityEnabled() {
  try {
    await callKibana({
      url: `/internal/security/me`
    });
    return true;
  } catch (err) {
    return false;
  }
}

async function callKibana(options) {
  const kibanaBasePath = await getKibanaBasePath();

  if (!ELASTICSEARCH_PASSWORD) {
    throw new Error('Missing `--password`');
  }

  const {
    data
  } = await _axios.default.request({ ...options,
    baseURL: KIBANA_BASE_URL + kibanaBasePath,
    auth: {
      username: ELASTICSEARCH_USERNAME,
      password: ELASTICSEARCH_PASSWORD
    },
    headers: {
      'kbn-xsrf': 'true',
      ...options.headers
    }
  });
  return data;
}

async function createRole({
  roleName,
  kibanaPrivileges
}) {
  var _kibanaPrivileges$bas, _kibanaPrivileges$fea;

  const role = await getRole(roleName);

  if (role) {
    console.log(`Skipping: Role "${roleName}" already exists`);
    return;
  }

  await callKibana({
    method: 'PUT',
    url: `/api/security/role/${roleName}`,
    data: {
      metadata: {
        version: 1
      },
      elasticsearch: {
        cluster: [],
        indices: []
      },
      kibana: [{
        base: (_kibanaPrivileges$bas = kibanaPrivileges.base) !== null && _kibanaPrivileges$bas !== void 0 ? _kibanaPrivileges$bas : [],
        feature: (_kibanaPrivileges$fea = kibanaPrivileges.feature) !== null && _kibanaPrivileges$fea !== void 0 ? _kibanaPrivileges$fea : {},
        spaces: ['*']
      }]
    }
  });
  console.log(`Created role "${roleName}" with privilege "${JSON.stringify(kibanaPrivileges)}"`);
}

async function createOrUpdateUser(newUser) {
  const existingUser = await getUser(newUser.username);

  if (!existingUser) {
    return createUser(newUser);
  }

  return updateUser(existingUser, newUser);
}

async function createUser(newUser) {
  const user = await callKibana({
    method: 'POST',
    url: `/internal/security/users/${newUser.username}`,
    data: { ...newUser,
      enabled: true,
      password: ELASTICSEARCH_PASSWORD
    }
  });
  console.log(`User "${newUser.username}" was created`);
  return user;
}

async function updateUser(existingUser, newUser) {
  const {
    username
  } = newUser;
  const allRoles = (0, _lodash.union)(existingUser.roles, newUser.roles);
  const hasAllRoles = (0, _lodash.difference)(allRoles, existingUser.roles).length === 0;

  if (hasAllRoles) {
    console.log(`Skipping: User "${username}" already has neccesarry roles: "${newUser.roles}"`);
    return;
  } // assign role to user


  await callKibana({
    method: 'POST',
    url: `/internal/security/users/${username}`,
    data: { ...existingUser,
      roles: allRoles
    }
  });
  console.log(`User "${username}" was updated`);
}

async function getUser(username) {
  try {
    return await callKibana({
      url: `/internal/security/users/${username}`
    });
  } catch (e) {
    var _e$response3; // return empty if user doesn't exist


    if (isAxiosError(e) && ((_e$response3 = e.response) === null || _e$response3 === void 0 ? void 0 : _e$response3.status) === 404) {
      return null;
    }

    throw e;
  }
}

async function getRole(roleName) {
  try {
    return await callKibana({
      method: 'GET',
      url: `/api/security/role/${roleName}`
    });
  } catch (e) {
    var _e$response4; // return empty if role doesn't exist


    if (isAxiosError(e) && ((_e$response4 = e.response) === null || _e$response4 === void 0 ? void 0 : _e$response4.status) === 404) {
      return null;
    }

    throw e;
  }
}

async function getKibanaVersion() {
  var _e$response5, _e$config$auth, _e$config$auth2;

  try {
    const res = await callKibana({
      method: 'GET',
      url: `/api/status`
    });
    return res.version.number;
  } catch (e) {
    if (isAxiosError(e)) {
      switch ((_e$response5 = e.response) === null || _e$response5 === void 0 ? void 0 : _e$response5.status) {
        case 401:
          throw new AbortError(`Could not access Kibana with the provided credentials. Username: "${(_e$config$auth = e.config.auth) === null || _e$config$auth === void 0 ? void 0 : _e$config$auth.username}". Password: "${(_e$config$auth2 = e.config.auth) === null || _e$config$auth2 === void 0 ? void 0 : _e$config$auth2.password}"`);

        case 404:
          throw new AbortError(`Could not get version on ${e.config.url} (Code: 404)`);

        default:
          throw new AbortError(`Cannot access Kibana on ${e.config.baseURL}. Please specify Kibana with: "--kibana-url <url>"`);
      }
    }

    throw e;
  }
}

function isAxiosError(e) {
  return 'isAxiosError' in e;
}

class AbortError extends Error {
  constructor(message) {
    super(message);
  }

}