"use strict";

var _yargs = require("yargs");

var _child_process = require("child_process");

var _moment = _interopRequireDefault(require("moment"));

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _get_es_client = require("../shared/get_es_client");

var _parse_index_url = require("../shared/parse_index_url");

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

async function run() {
  var _response$body$aggreg, _response$body$aggreg2;

  const archiveName = 'apm_8.0.0';
  const esUrl = _yargs.argv['es-url'];

  if (!esUrl) {
    throw new Error('--es-url is not set');
  }

  const kibanaUrl = _yargs.argv['kibana-url'];

  if (!kibanaUrl) {
    throw new Error('--kibana-url is not set');
  }

  const gte = (0, _moment.default)().subtract(1, 'hour').toISOString();
  const lt = (0, _moment.default)(gte).add(30, 'minutes').toISOString(); // include important APM data and ML data

  const should = [{
    index: 'apm-*-transaction,apm-*-span,apm-*-error,apm-*-metric',
    bool: {
      must_not: [{
        term: {
          'service.name': 'elastic-co-frontend'
        }
      }],
      filter: [{
        terms: {
          'processor.event': ['transaction', 'span', 'error', 'metric']
        }
      }, {
        range: {
          '@timestamp': {
            gte,
            lt
          }
        }
      }]
    }
  }, {
    index: '.ml-anomalies-shared',
    bool: {
      filter: [{
        term: {
          _index: '.ml-anomalies-shared'
        }
      }, {
        range: {
          timestamp: {
            gte,
            lt
          }
        }
      }]
    }
  }, {
    index: '.ml-config',
    bool: {
      filter: [{
        term: {
          _index: '.ml-config'
        }
      }, {
        term: {
          groups: 'apm'
        }
      }]
    }
  }, {
    index: '.kibana',
    bool: {
      filter: [{
        term: {
          type: 'ml-job'
        }
      }]
    }
  }]; // eslint-disable-next-line no-console

  console.log(`Archiving from ${gte} to ${lt}...`); // APM data uses '@timestamp' (ECS), ML data uses 'timestamp'

  const query = {
    bool: {
      should: should.map(({
        bool
      }) => ({
        bool
      })),
      minimum_should_match: 1
    }
  };

  const root = _path.default.join(__dirname, '../../../../..');

  const options = (0, _parse_index_url.parseIndexUrl)(esUrl);
  const client = (0, _get_es_client.getEsClient)({
    node: options.node
  });
  const response = await client.search({
    body: {
      query,
      aggs: {
        index: {
          terms: {
            field: '_index',
            size: 1000
          }
        }
      }
    },
    index: should.map(({
      index
    }) => index)
  }); // only store data for indices that actually have docs
  // for performance reasons, by looking at the search
  // profile

  const indicesWithDocs = (_response$body$aggreg = (_response$body$aggreg2 = response.body.aggregations) === null || _response$body$aggreg2 === void 0 ? void 0 : _response$body$aggreg2.index.buckets.map(bucket => bucket.key)) !== null && _response$body$aggreg !== void 0 ? _response$body$aggreg : []; // create the archive

  const tmpDir = _path.default.join(__dirname, 'tmp/');

  (0, _child_process.execSync)(`node scripts/es_archiver save ${archiveName} ${indicesWithDocs.filter(index => !index.startsWith('.kibana')).concat('.kibana').join(',')} --dir=${tmpDir} --kibana-url=${kibanaUrl} --es-url=${esUrl} --query='${JSON.stringify(query)}'`, {
    cwd: root,
    stdio: 'inherit'
  });
  const currentConfig = {}; // get the current metadata and extend/override metadata for the new archive

  const configFilePath = _path.default.join(tmpDir, 'archives_metadata.ts');

  try {
    Object.assign(currentConfig, (await Promise.resolve(`${configFilePath}`).then(s => _interopRequireWildcard(require(s)))).default);
  } catch (error) {// do nothing
  }

  const newConfig = { ...currentConfig,
    [archiveName]: {
      start: gte,
      end: lt
    }
  };

  _fs.default.writeFileSync(configFilePath, `
    /* eslint-disable import/no-default-export*/
    export default ${JSON.stringify(newConfig, null, 2)}`, {
    encoding: 'utf-8'
  }); // run ESLint on the generated metadata files


  (0, _child_process.execSync)('node scripts/eslint **/*/archives_metadata.ts --fix', {
    cwd: root,
    stdio: 'inherit'
  });
  const esArchiverDir = 'fixtures/es_archiver/';

  const apiIntegrationDir = _path.default.join(root, 'x-pack/test/apm_api_integration/common', esArchiverDir);

  const e2eDir = _path.default.join(__dirname, '../../ftr_e2e/cypress', esArchiverDir); // Copy generated files to e2e test folder


  (0, _child_process.execSync)(`cp -r ${tmpDir} ${e2eDir}`); // Copy generated files to API integration test folder

  (0, _child_process.execSync)(`cp -r ${tmpDir} ${apiIntegrationDir}`); // Delete tmp folder

  (0, _child_process.execSync)(`rm -rf ${tmpDir}`);
}

run().then(() => {
  process.exit(0);
}).catch(err => {
  // eslint-disable-next-line no-console
  console.log(err);
  process.exit(1);
});