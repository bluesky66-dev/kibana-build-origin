"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.run = exports.cli = void 0;

var _minimist = _interopRequireDefault(require("minimist"));

var _devUtils = require("@kbn/dev-utils");

var _test = require("@kbn/test");

var _bluebird = _interopRequireDefault(require("bluebird"));

var _path = require("path");

var _constants = require("../../../common/endpoint/constants");

var _types = require("../../../common/endpoint/types");

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


const defaultLogger = new _devUtils.ToolingLog({
  level: 'info',
  writeTo: process.stdout
});
const separator = '----------------------------------------';

const cli = async () => {
  const cliDefaults = {
    string: ['kibana'],
    default: {
      count: 10,
      kibana: 'http://elastic:changeme@localhost:5601'
    }
  };
  const options = (0, _minimist.default)(process.argv.slice(2), cliDefaults);

  if ('help' in options) {
    defaultLogger.write(`
node ${(0, _path.basename)(process.argv[1])} [options]

Options:${Object.keys(cliDefaults.default).reduce((out, option) => {
      // @ts-ignore
      return `${out}\n  --${option}=${cliDefaults.default[option]}`;
    }, '')}
`);
    return;
  }

  const runLogger = createRunLogger();
  defaultLogger.write(`${separator}
Loading ${options.count} Trusted App Entries`);
  await run({ ...options,
    logger: runLogger
  });
  defaultLogger.write(`
Done!
${separator}`);
};

exports.cli = cli;

const run = async ({
  count = 10,
  kibana = 'http://elastic:changeme@localhost:5601',
  logger = defaultLogger
} = {}) => {
  const kbnClient = new _test.KbnClient({
    log: logger,
    url: kibana
  }); // touch the Trusted Apps List so it can be created

  await kbnClient.request({
    method: 'GET',
    path: _constants.TRUSTED_APPS_LIST_API
  });
  return _bluebird.default.map(Array.from({
    length: count
  }), () => kbnClient.request({
    method: 'POST',
    path: _constants.TRUSTED_APPS_CREATE_API,
    body: generateTrustedAppEntry()
  }).then(({
    data
  }) => {
    logger.write(data.id);
    return data;
  }), {
    concurrency: 10
  });
};

exports.run = run;

const generateTrustedAppEntry = ({
  os = randomOperatingSystem(),
  name = randomName()
} = {}) => {
  return {
    description: `Generator says we trust ${name}`,
    name,
    os,
    entries: [{
      // @ts-ignore
      field: 'process.hash.*',
      operator: 'included',
      type: 'match',
      value: '1234234659af249ddf3e40864e9fb241'
    }, {
      // @ts-ignore
      field: 'process.executable.caseless',
      operator: 'included',
      type: 'match',
      value: '/one/two/three'
    }]
  };
};

const randomN = max => Math.floor(Math.random() * max);

const randomName = (() => {
  const names = ['Symantec Endpoint Security', 'Bitdefender GravityZone', 'Malwarebytes', 'Sophos Intercept X', 'Webroot Business Endpoint Protection', 'ESET Endpoint Security', 'FortiClient', 'Kaspersky Endpoint Security', 'Trend Micro Apex One', 'CylancePROTECT', 'VIPRE', 'Norton', 'McAfee Endpoint Security', 'AVG AntiVirus', 'CrowdStrike Falcon', 'Avast Business Antivirus', 'Avira Antivirus', 'Cisco AMP for Endpoints', 'Eset Endpoint Antivirus', 'VMware Carbon Black', 'Palo Alto Networks Traps', 'Trend Micro', 'SentinelOne', 'Panda Security for Desktops', 'Microsoft Defender ATP'];
  const count = names.length;
  return () => names[randomN(count)];
})();

const randomOperatingSystem = (() => {
  const osKeys = Object.keys(_types.OperatingSystem);
  const count = osKeys.length;
  return () => _types.OperatingSystem[osKeys[randomN(count)]];
})();

const createRunLogger = () => {
  let groupCount = 1;
  let itemCount = 0;
  return new _devUtils.ToolingLog({
    level: 'info',
    writeTo: {
      write: msg => {
        process.stdout.write('.');
        itemCount++;

        if (itemCount === 5) {
          itemCount = 0;

          if (groupCount === 5) {
            process.stdout.write('\n');
            groupCount = 1;
          } else {
            process.stdout.write('  ');
            groupCount++;
          }
        }
      }
    }
  });
};