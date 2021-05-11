"use strict";

var _devUtils = require("@kbn/dev-utils");

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _os = _interopRequireDefault(require("os"));

var kibanaPackage = _interopRequireWildcard(require("../../package.json"));

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
// @ts-ignore
// Using the ts-ignore because we are importing directly from a json to a script file


const version = kibanaPackage.version;
const CHECKIN_INTERVAL = 3000; // 3 seconds

let closing = false;
process.once('SIGINT', () => {
  closing = true;
});
(0, _devUtils.run)(async ({
  flags,
  log
}) => {
  if (!flags.kibanaUrl || typeof flags.kibanaUrl !== 'string') {
    throw (0, _devUtils.createFlagError)('please provide a single --path flag');
  }

  if (!flags.enrollmentApiKey || typeof flags.enrollmentApiKey !== 'string') {
    throw (0, _devUtils.createFlagError)('please provide a single --enrollmentApiKey flag');
  }

  const kibanaUrl = flags.kibanaUrl || 'http://localhost:5601';
  const agent = await enroll(kibanaUrl, flags.enrollmentApiKey, log);
  log.info('Enrolled with sucess', agent);

  while (!closing) {
    await checkin(kibanaUrl, agent, log);
    await new Promise((resolve, reject) => setTimeout(() => resolve(), CHECKIN_INTERVAL));
  }
}, {
  description: `
      Run a fleet development agent.
    `,
  flags: {
    string: ['kibanaUrl', 'enrollmentApiKey'],
    help: `
        --kibanaUrl kibanaURL to run the fleet agent
        --enrollmentApiKey enrollment api key
      `
  }
});

async function checkin(kibanaURL, agent, log) {
  const body = {
    events: [{
      type: 'STATE',
      subtype: 'RUNNING',
      message: 'state changed from STOPPED to RUNNING',
      timestamp: new Date().toISOString(),
      payload: {
        random: 'data',
        state: 'RUNNING',
        previous_state: 'STOPPED'
      },
      agent_id: agent.id
    }]
  };
  const res = await (0, _nodeFetch.default)(`${kibanaURL}/api/fleet/agents/${agent.id}/checkin`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'kbn-xsrf': 'xxx',
      Authorization: `ApiKey ${agent.access_api_key}`,
      'Content-Type': 'application/json'
    }
  });

  if (res.status === 403) {
    closing = true;
    log.info('Unenrolling agent');
    return;
  }

  const obj = await res.json();
  log.info('checkin', obj);
}

async function enroll(kibanaURL, apiKey, log) {
  const body = {
    type: 'PERMANENT',
    metadata: {
      local: {
        host: 'localhost',
        ip: '127.0.0.1',
        system: `${_os.default.type()} ${_os.default.release()}`,
        memory: _os.default.totalmem(),
        elastic: {
          agent: {
            version
          }
        }
      },
      user_provided: {
        dev_agent_version: '0.0.1',
        region: 'us-east'
      }
    }
  };
  const res = await (0, _nodeFetch.default)(`${kibanaURL}/api/fleet/agents/enroll`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'kbn-xsrf': 'xxx',
      Authorization: `ApiKey ${apiKey}`,
      'Content-Type': 'application/json'
    }
  });
  const obj = await res.json();

  if (!res.ok) {
    log.error(JSON.stringify(obj, null, 2));
    throw new Error('unable to enroll');
  }

  return {
    id: obj.item.id,
    access_api_key: obj.item.access_api_key
  };
}