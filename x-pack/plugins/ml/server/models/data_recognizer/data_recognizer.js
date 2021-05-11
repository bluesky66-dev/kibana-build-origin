"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DataRecognizer = exports.SAVED_OBJECT_TYPES = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _numeral = _interopRequireDefault(require("@elastic/numeral"));

var _moment = _interopRequireDefault(require("moment"));

var _lodash = require("lodash");

var _request_authorization = require("../../lib/request_authorization");

var _modules = require("../../../common/types/modules");

var _job_utils = require("../../../common/util/job_utils");

var _log = require("../../lib/log");

var _calculate_model_memory_limit = require("../calculate_model_memory_limit");

var _fields_service = require("../fields_service");

var _job_service = require("../job_service");

var _results_service = require("../results_service");

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

const ML_DIR = 'ml';
const KIBANA_DIR = 'kibana';
const INDEX_PATTERN_ID = 'INDEX_PATTERN_ID';
const INDEX_PATTERN_NAME = 'INDEX_PATTERN_NAME';
const SAVED_OBJECT_TYPES = {
  DASHBOARD: 'dashboard',
  SEARCH: 'search',
  VISUALIZATION: 'visualization'
};
exports.SAVED_OBJECT_TYPES = SAVED_OBJECT_TYPES;

class DataRecognizer {
  /**
   * List of the module jobs that require model memory estimation
   */
  constructor(mlClusterClient, mlClient, savedObjectsClient, jobSavedObjectService, request) {
    _defineProperty(this, "_client", void 0);

    _defineProperty(this, "_mlClient", void 0);

    _defineProperty(this, "_savedObjectsClient", void 0);

    _defineProperty(this, "_jobSavedObjectService", void 0);

    _defineProperty(this, "_request", void 0);

    _defineProperty(this, "_authorizationHeader", void 0);

    _defineProperty(this, "_modulesDir", `${__dirname}/modules`);

    _defineProperty(this, "_indexPatternName", '');

    _defineProperty(this, "_indexPatternId", undefined);

    _defineProperty(this, "_jobsService", void 0);

    _defineProperty(this, "_resultsService", void 0);

    _defineProperty(this, "_calculateModelMemoryLimit", void 0);

    _defineProperty(this, "jobsForModelMemoryEstimation", []);

    this._client = mlClusterClient;
    this._mlClient = mlClient;
    this._savedObjectsClient = savedObjectsClient;
    this._jobSavedObjectService = jobSavedObjectService;
    this._request = request;
    this._authorizationHeader = (0, _request_authorization.getAuthorizationHeader)(request);
    this._jobsService = (0, _job_service.jobServiceProvider)(mlClusterClient, mlClient);
    this._resultsService = (0, _results_service.resultsServiceProvider)(mlClient);
    this._calculateModelMemoryLimit = (0, _calculate_model_memory_limit.calculateModelMemoryLimitProvider)(mlClusterClient, mlClient);
  } // list all directories under the given directory


  async listDirs(dirName) {
    const dirs = [];
    return new Promise((resolve, reject) => {
      _fs.default.readdir(dirName, (err, fileNames) => {
        if (err) {
          reject(err);
        }

        fileNames.forEach(fileName => {
          const path = `${dirName}/${fileName}`;

          if (_fs.default.lstatSync(path).isDirectory()) {
            dirs.push(fileName);
          }
        });
        resolve(dirs);
      });
    });
  }

  async readFile(fileName) {
    return new Promise((resolve, reject) => {
      _fs.default.readFile(fileName, 'utf-8', (err, content) => {
        if (err) {
          reject(err);
        } else {
          resolve(content);
        }
      });
    });
  }

  async loadManifestFiles() {
    const configs = [];
    const dirs = await this.listDirs(this._modulesDir);
    await Promise.all(dirs.map(async dir => {
      let file;

      try {
        file = await this.readFile(`${this._modulesDir}/${dir}/manifest.json`);
      } catch (error) {
        _log.mlLog.warn(`Data recognizer skipping folder ${dir} as manifest.json cannot be read`);
      }

      if (file !== undefined) {
        try {
          configs.push({
            dirName: dir,
            json: JSON.parse(file)
          });
        } catch (error) {
          _log.mlLog.warn(`Data recognizer error parsing ${dir}/manifest.json. ${error}`);
        }
      }
    }));
    return configs;
  } // get the manifest.json file for a specified id, e.g. "nginx"


  async getManifestFile(id) {
    const manifestFiles = await this.loadManifestFiles();
    return manifestFiles.find(i => i.json.id === id);
  } // called externally by an endpoint


  async findMatches(indexPattern) {
    const manifestFiles = await this.loadManifestFiles();
    const results = [];
    await Promise.all(manifestFiles.map(async i => {
      const moduleConfig = i.json;
      let match = false;

      try {
        match = await this.searchForFields(moduleConfig, indexPattern);
      } catch (error) {
        _log.mlLog.warn(`Data recognizer error running query defined for module ${moduleConfig.id}. ${error}`);
      }

      if (match === true) {
        let logo = null;

        if (moduleConfig.logoFile) {
          try {
            logo = await this.readFile(`${this._modulesDir}/${i.dirName}/${moduleConfig.logoFile}`);
            logo = JSON.parse(logo);
          } catch (e) {
            logo = null;
          }
        }

        results.push({
          id: moduleConfig.id,
          title: moduleConfig.title,
          query: moduleConfig.query,
          description: moduleConfig.description,
          logo
        });
      }
    }));
    results.sort((res1, res2) => res1.id.localeCompare(res2.id));
    return results;
  }

  async searchForFields(moduleConfig, indexPattern) {
    if (moduleConfig.query === undefined) {
      return false;
    }

    const index = indexPattern;
    const size = 0;
    const searchBody = {
      query: moduleConfig.query
    };
    const {
      body
    } = await this._client.asCurrentUser.search({
      index,
      size,
      body: searchBody
    });
    return body.hits.total.value > 0;
  }

  async listModules() {
    const manifestFiles = await this.loadManifestFiles();
    const ids = manifestFiles.map(({
      json
    }) => json.id).sort((a, b) => a.localeCompare(b)); // sort as json files are read from disk and could be in any order.

    const modules = [];

    for (let i = 0; i < ids.length; i++) {
      const module = await this.getModule(ids[i]);
      modules.push(module);
    }

    return modules;
  } // called externally by an endpoint
  // supplying an optional prefix will add the prefix
  // to the job and datafeed configs


  async getModule(id, prefix = '') {
    let manifestJSON = null;
    let dirName = null;
    const manifestFile = await this.getManifestFile(id);

    if (manifestFile !== undefined) {
      manifestJSON = manifestFile.json;
      dirName = manifestFile.dirName;
    } else {
      throw _boom.default.notFound(`Module with the id "${id}" not found`);
    }

    const jobs = [];
    const datafeeds = [];
    const kibana = {}; // load all of the job configs

    await Promise.all(manifestJSON.jobs.map(async job => {
      try {
        const jobConfig = await this.readFile(`${this._modulesDir}/${dirName}/${ML_DIR}/${job.file}`); // use the file name for the id

        jobs.push({
          id: `${prefix}${job.id}`,
          config: JSON.parse(jobConfig)
        });
      } catch (error) {
        _log.mlLog.warn(`Data recognizer error loading config for job ${job.id} for module ${id}. ${error}`);
      }
    })); // load all of the datafeed configs

    await Promise.all(manifestJSON.datafeeds.map(async datafeed => {
      try {
        const datafeedConfig = await this.readFile(`${this._modulesDir}/${dirName}/${ML_DIR}/${datafeed.file}`);
        const config = JSON.parse(datafeedConfig); // use the job id from the manifestFile

        config.job_id = `${prefix}${datafeed.job_id}`;
        datafeeds.push({
          id: (0, _job_utils.prefixDatafeedId)(datafeed.id, prefix),
          config
        });
      } catch (error) {
        _log.mlLog.warn(`Data recognizer error loading config for datafeed ${datafeed.id} for module ${id}. ${error}`);
      }
    })); // load all of the kibana saved objects

    if (manifestJSON.kibana !== undefined) {
      const kKeys = Object.keys(manifestJSON.kibana);
      await Promise.all(kKeys.map(async key => {
        kibana[key] = [];
        await Promise.all(manifestJSON.kibana[key].map(async obj => {
          try {
            const kConfig = await this.readFile(`${this._modulesDir}/${dirName}/${KIBANA_DIR}/${key}/${obj.file}`); // use the file name for the id

            const kId = obj.file.replace('.json', '');
            const config = JSON.parse(kConfig);
            kibana[key].push({
              id: kId,
              title: config.title,
              config
            });
          } catch (error) {
            _log.mlLog.warn(`Data recognizer error loading config for ${key} ${obj.id} for module ${id}. ${error}`);
          }
        }));
      }));
    }

    return { ...manifestJSON,
      jobs,
      datafeeds,
      kibana
    };
  } // called externally by an endpoint
  // takes a module config id, an optional jobPrefix and the request object
  // creates all of the jobs, datafeeds and savedObjects  listed in the module config.
  // if any of the savedObjects already exist, they will not be overwritten.


  async setup(moduleId, jobPrefix, groups, indexPatternName, query, useDedicatedIndex, startDatafeed, start, end, jobOverrides, datafeedOverrides, estimateModelMemory = true, applyToAllSpaces = false) {
    // load the config from disk
    const moduleConfig = await this.getModule(moduleId, jobPrefix);

    if (indexPatternName === undefined && moduleConfig.defaultIndexPattern === undefined) {
      throw _boom.default.badRequest(`No index pattern configured in "${moduleId}" configuration file and no index pattern passed to the endpoint`);
    }

    this._indexPatternName = indexPatternName === undefined ? moduleConfig.defaultIndexPattern : indexPatternName;
    this._indexPatternId = await this.getIndexPatternId(this._indexPatternName); // the module's jobs contain custom URLs which require an index patten id
    // but there is no corresponding index pattern, throw an error

    if (this._indexPatternId === undefined && this.doJobUrlsContainIndexPatternId(moduleConfig)) {
      throw _boom.default.badRequest(`Module's jobs contain custom URLs which require a kibana index pattern (${this._indexPatternName}) which cannot be found.`);
    } // the module's saved objects require an index patten id
    // but there is no corresponding index pattern, throw an error


    if (this._indexPatternId === undefined && this.doSavedObjectsContainIndexPatternId(moduleConfig)) {
      throw _boom.default.badRequest(`Module's saved objects contain custom URLs which require a kibana index pattern (${this._indexPatternName}) which cannot be found.`);
    } // create an empty results object


    const results = this.createResultsTemplate(moduleConfig);
    const saveResults = {
      jobs: [],
      datafeeds: [],
      savedObjects: []
    };
    this.jobsForModelMemoryEstimation = moduleConfig.jobs.map(job => {
      var _moduleConfig$datafee, _moduleConfig$datafee2;

      return {
        job,
        query: (_moduleConfig$datafee = (_moduleConfig$datafee2 = moduleConfig.datafeeds.find(d => d.config.job_id === job.id)) === null || _moduleConfig$datafee2 === void 0 ? void 0 : _moduleConfig$datafee2.config.query) !== null && _moduleConfig$datafee !== void 0 ? _moduleConfig$datafee : null
      };
    });
    this.applyJobConfigOverrides(moduleConfig, jobOverrides, jobPrefix);
    this.applyDatafeedConfigOverrides(moduleConfig, datafeedOverrides, jobPrefix);
    this.updateDatafeedIndices(moduleConfig);
    this.updateJobUrlIndexPatterns(moduleConfig);
    await this.updateModelMemoryLimits(moduleConfig, estimateModelMemory, start, end); // create the jobs

    if (moduleConfig.jobs && moduleConfig.jobs.length) {
      if (Array.isArray(groups)) {
        // update groups list for each job
        moduleConfig.jobs.forEach(job => job.config.groups = groups);
      } // Set the results_index_name property for each job if useDedicatedIndex is true


      if (useDedicatedIndex === true) {
        moduleConfig.jobs.forEach(job => job.config.results_index_name = job.id);
      }

      saveResults.jobs = await this.saveJobs(moduleConfig.jobs, applyToAllSpaces);
    } // create the datafeeds


    if (moduleConfig.datafeeds && moduleConfig.datafeeds.length) {
      if (typeof query === 'object' && query !== null) {
        moduleConfig.datafeeds.forEach(df => {
          df.config.query = query;
        });
      }

      saveResults.datafeeds = await this.saveDatafeeds(moduleConfig.datafeeds);

      if (startDatafeed) {
        const savedDatafeeds = moduleConfig.datafeeds.filter(df => {
          const datafeedResult = saveResults.datafeeds.find(d => d.id === df.id);
          return datafeedResult !== undefined && datafeedResult.success === true;
        });
        const startResults = await this.startDatafeeds(savedDatafeeds, start, end);
        saveResults.datafeeds.forEach(df => {
          const startedDatafeed = startResults[df.id];

          if (startedDatafeed !== undefined) {
            df.started = startedDatafeed.started;
            df.awaitingMlNodeAllocation = startedDatafeed.awaitingMlNodeAllocation;

            if (startedDatafeed.error !== undefined) {
              df.error = startedDatafeed.error;
            }
          }
        });
      }
    } // create the savedObjects


    if (moduleConfig.kibana) {
      // update the saved objects with the index pattern id
      this.updateSavedObjectIndexPatterns(moduleConfig);
      const savedObjects = await this.createSavedObjectsToSave(moduleConfig); // update the exists flag in the results

      this.updateKibanaResults(results.kibana, savedObjects); // create the savedObjects

      try {
        saveResults.savedObjects = await this.saveKibanaObjects(savedObjects);
      } catch (error) {
        var _error$output; // only one error is returned for the bulk create saved object request
        // so populate every saved object with the same error.


        this.populateKibanaResultErrors(results.kibana, (_error$output = error.output) === null || _error$output === void 0 ? void 0 : _error$output.payload);
      }
    } // merge all the save results


    this.updateResults(results, saveResults);
    return results;
  }

  async dataRecognizerJobsExist(moduleId) {
    const results = {}; // Load the module with the specified ID and check if the jobs
    // in the module have been created.

    const module = await this.getModule(moduleId);

    if (module && module.jobs) {
      // Add a wildcard at the front of each of the job IDs in the module,
      // as a prefix may have been supplied when creating the jobs in the module.
      const jobIds = module.jobs.map(job => `*${job.id}`);
      const jobInfo = await this._jobsService.jobsExist(jobIds); // Check if the value for any of the jobs is false.

      const doJobsExist = Object.values(jobInfo).every(j => j.exists === true);
      results.jobsExist = doJobsExist;

      if (doJobsExist === true) {
        // Get the IDs of the jobs created from the module, and their earliest / latest timestamps.
        const {
          body
        } = await this._mlClient.getJobStats({
          job_id: jobIds.join()
        });
        const jobStatsJobs = [];

        if (body.jobs && body.jobs.length > 0) {
          const foundJobIds = body.jobs.map(job => job.job_id);
          const latestBucketTimestampsByJob = await this._resultsService.getLatestBucketTimestampByJob(foundJobIds);
          body.jobs.forEach(job => {
            const jobStat = {
              id: job.job_id
            };

            if (job.data_counts) {
              jobStat.earliestTimestampMs = job.data_counts.earliest_record_timestamp;
              jobStat.latestTimestampMs = job.data_counts.latest_record_timestamp;
              jobStat.latestResultsTimestampMs = (0, _job_utils.getLatestDataOrBucketTimestamp)(jobStat.latestTimestampMs, latestBucketTimestampsByJob[job.job_id]);
            }

            jobStatsJobs.push(jobStat);
          });
        }

        results.jobs = jobStatsJobs;
      }
    }

    return results;
  }

  async loadIndexPatterns() {
    return await this._savedObjectsClient.find({
      type: 'index-pattern',
      perPage: 1000
    });
  } // returns a id based on an index pattern name


  async getIndexPatternId(name) {
    try {
      const indexPatterns = await this.loadIndexPatterns();

      if (indexPatterns === undefined || indexPatterns.saved_objects === undefined) {
        return;
      }

      const ip = indexPatterns.saved_objects.find(i => i.attributes.title === name);
      return ip !== undefined ? ip.id : undefined;
    } catch (error) {
      _log.mlLog.warn(`Error loading index patterns, ${error}`);

      return;
    }
  } // create a list of objects which are used to save the savedObjects.
  // each has an exists flag and those which do not already exist
  // contain a savedObject object which is sent to the server to save


  async createSavedObjectsToSave(moduleConfig) {
    // first check if the saved objects already exist.
    const savedObjectExistResults = await this.checkIfSavedObjectsExist(moduleConfig.kibana); // loop through the kibanaSaveResults and update

    Object.keys(moduleConfig.kibana).forEach(type => {
      // type e.g. dashboard, search ,visualization
      moduleConfig.kibana[type].forEach(configItem => {
        const existsResult = savedObjectExistResults.find(o => o.id === configItem.id);

        if (existsResult !== undefined) {
          configItem.exists = existsResult.exists;

          if (existsResult.exists === false) {
            // if this object doesn't already exist, create the savedObject
            // which will be used to create it
            existsResult.savedObject = {
              type,
              id: configItem.id,
              attributes: configItem.config
            };
          }
        }
      });
    });
    return savedObjectExistResults;
  } // update the exists flags in the kibana results


  updateKibanaResults(kibanaSaveResults, objectExistResults) {
    Object.keys(kibanaSaveResults).forEach(type => {
      kibanaSaveResults[type].forEach(resultItem => {
        const i = objectExistResults.find(o => o.id === resultItem.id && o.type === type);
        resultItem.exists = i !== undefined && i.exists;
      });
    });
  } // add an error object to every kibana saved object,
  // if it doesn't already exist.


  populateKibanaResultErrors(kibanaSaveResults, error) {
    const errorObj = error === undefined ? {
      message: 'Unknown error when creating saved object'
    } : error;
    Object.keys(kibanaSaveResults).forEach(type => {
      kibanaSaveResults[type].forEach(resultItem => {
        if (resultItem.exists === false) {
          resultItem.error = errorObj;
        }
      });
    });
  } // loop through each type (dashboard, search, visualization)
  // load existing savedObjects for each type and compare to find out if
  // items with the same id already exist.
  // returns a flat list of objects with exists flags set


  async checkIfSavedObjectsExist(kibanaObjects) {
    const types = Object.keys(kibanaObjects);
    const results = await Promise.all(types.map(async type => {
      const existingObjects = await this.loadExistingSavedObjects(type);
      return kibanaObjects[type].map(obj => {
        const existingObject = existingObjects.saved_objects.find(o => o.attributes && o.attributes.title === obj.title);
        return {
          id: obj.id,
          type,
          exists: existingObject !== undefined
        };
      });
    })); // merge all results

    return [].concat(...results);
  } // find all existing savedObjects for a given type


  loadExistingSavedObjects(type) {
    // TODO: define saved object type
    return this._savedObjectsClient.find({
      type,
      perPage: 1000
    });
  } // save the savedObjects if they do not exist already


  async saveKibanaObjects(objectExistResults) {
    let results = {
      saved_objects: []
    };
    const filteredSavedObjects = objectExistResults.filter(o => o.exists === false).map(o => o.savedObject);

    if (filteredSavedObjects.length) {
      results = await this._savedObjectsClient.bulkCreate( // Add an empty migrationVersion attribute to each saved object to ensure
      // it is automatically migrated to the 7.0+ format with a references attribute.
      filteredSavedObjects.map(doc => ({ ...doc,
        migrationVersion: {}
      })));
    }

    return results.saved_objects;
  } // save the jobs.
  // if any fail (e.g. it already exists), catch the error and mark the result
  // as success: false


  async saveJobs(jobs, applyToAllSpaces = false) {
    const resp = await Promise.all(jobs.map(async job => {
      const jobId = job.id;

      try {
        job.id = jobId;
        await this.saveJob(job);
        return {
          id: jobId,
          success: true
        };
      } catch ({
        body
      }) {
        return {
          id: jobId,
          success: false,
          error: body
        };
      }
    }));

    if (applyToAllSpaces === true) {
      const canCreateGlobalJobs = await this._jobSavedObjectService.canCreateGlobalJobs(this._request);

      if (canCreateGlobalJobs === true) {
        await this._jobSavedObjectService.assignJobsToSpaces('anomaly-detector', jobs.map(j => j.id), ['*']);
      }
    }

    return resp;
  }

  async saveJob(job) {
    return this._mlClient.putJob({
      job_id: job.id,
      body: job.config
    });
  } // save the datafeeds.
  // if any fail (e.g. it already exists), catch the error and mark the result
  // as success: false


  async saveDatafeeds(datafeeds) {
    return await Promise.all(datafeeds.map(async datafeed => {
      try {
        await this.saveDatafeed(datafeed);
        return {
          id: datafeed.id,
          success: true,
          started: false,
          awaitingMlNodeAllocation: false
        };
      } catch ({
        body
      }) {
        return {
          id: datafeed.id,
          success: false,
          started: false,
          awaitingMlNodeAllocation: false,
          error: body
        };
      }
    }));
  }

  async saveDatafeed(datafeed) {
    return this._mlClient.putDatafeed({
      datafeed_id: datafeed.id,
      body: datafeed.config
    }, this._authorizationHeader);
  }

  async startDatafeeds(datafeeds, start, end) {
    const results = {};

    for (const datafeed of datafeeds) {
      results[datafeed.id] = await this.startDatafeed(datafeed, start, end);
    }

    return results;
  }

  async startDatafeed(datafeed, start, end) {
    const result = {
      started: false
    };
    let opened = false;

    try {
      const {
        body
      } = await this._mlClient.openJob({
        job_id: datafeed.config.job_id
      });
      opened = body.opened;
    } catch (error) {
      // if the job is already open, a 409 will be returned.
      if (error.statusCode === 409) {
        opened = true;
      } else {
        opened = false;
        result.started = false;
        result.error = error.body;
      }
    }

    if (opened) {
      try {
        const duration = {
          start: '0'
        };

        if (start !== undefined) {
          duration.start = start;
        }

        if (end !== undefined) {
          duration.end = end;
        }

        const {
          body: {
            started,
            node
          }
        } = await this._mlClient.startDatafeed({
          datafeed_id: datafeed.id,
          ...duration
        });
        result.started = started;
        result.awaitingMlNodeAllocation = (node === null || node === void 0 ? void 0 : node.length) === 0;
      } catch ({
        body
      }) {
        result.started = false;
        result.error = body;
      }
    }

    return result;
  } // merge all of the save results into one result object
  // which is returned from the endpoint


  async updateResults(results, saveResults) {
    // update job results
    results.jobs.forEach(j => {
      saveResults.jobs.forEach(j2 => {
        if (j.id === j2.id) {
          j.success = j2.success;

          if (j2.error !== undefined) {
            j.error = j2.error;
          }
        }
      });
    }); // update datafeed results

    results.datafeeds.forEach(d => {
      saveResults.datafeeds.forEach(d2 => {
        if (d.id === d2.id) {
          d.success = d2.success;
          d.started = d2.started;
          d.awaitingMlNodeAllocation = d2.awaitingMlNodeAllocation;

          if (d2.error !== undefined) {
            d.error = d2.error;
          }
        }
      });
    }); // update savedObjects results

    Object.keys(results.kibana).forEach(category => {
      results.kibana[category].forEach(item => {
        const result = saveResults.savedObjects.find(o => o.id === item.id);

        if (result !== undefined) {
          item.exists = result.exists;

          if (result.error === undefined) {
            item.success = true;
          } else {
            item.success = false;
            item.error = result.error;
          }
        }
      });
    });
  } // creates an empty results object,
  // listing each job/datafeed/savedObject with a save success boolean


  createResultsTemplate(moduleConfig) {
    const results = {};
    const reducedConfig = {
      jobs: moduleConfig.jobs,
      datafeeds: moduleConfig.datafeeds,
      kibana: moduleConfig.kibana
    };

    function createResultsItems(configItems, resultItems, index) {
      resultItems[index] = [];
      configItems.forEach(j => {
        resultItems[index].push({
          id: j.id,
          success: false
        });
      });
    }

    Object.keys(reducedConfig).forEach(i => {
      if (Array.isArray(reducedConfig[i])) {
        createResultsItems(reducedConfig[i], results, i);
      } else {
        results[i] = {};
        Object.keys(reducedConfig[i]).forEach(k => {
          createResultsItems(reducedConfig[i][k], results[i], k);
        });
      }
    });
    return results;
  } // if an override index pattern has been specified,
  // update all of the datafeeds.


  updateDatafeedIndices(moduleConfig) {
    // if the supplied index pattern contains a comma, split into multiple indices and
    // add each one to the datafeed
    const indexPatternNames = (0, _job_utils.splitIndexPatternNames)(this._indexPatternName);
    moduleConfig.datafeeds.forEach(df => {
      const newIndices = []; // the datafeed can contain indexes and indices

      const currentIndices = df.config.indexes !== undefined ? df.config.indexes : df.config.indices;
      currentIndices.forEach(index => {
        if (index === INDEX_PATTERN_NAME) {
          // the datafeed index is INDEX_PATTERN_NAME, so replace it with index pattern(s)
          // supplied by the user or the default one from the manifest
          newIndices.push(...indexPatternNames);
        } else {
          // otherwise keep using the index from the datafeed json
          newIndices.push(index);
        }
      }); // just in case indexes was used, delete it in favour of indices

      delete df.config.indexes;
      df.config.indices = newIndices;
    });
  } // loop through the custom urls in each job and replace the INDEX_PATTERN_ID
  // marker for the id of the specified index pattern


  updateJobUrlIndexPatterns(moduleConfig) {
    if (Array.isArray(moduleConfig.jobs)) {
      moduleConfig.jobs.forEach(job => {
        // if the job has custom_urls
        if (job.config.custom_settings && job.config.custom_settings.custom_urls) {
          // loop through each url, replacing the INDEX_PATTERN_ID marker
          job.config.custom_settings.custom_urls.forEach(cUrl => {
            const url = cUrl.url_value;

            if (url.match(INDEX_PATTERN_ID)) {
              const newUrl = url.replace(new RegExp(INDEX_PATTERN_ID, 'g'), this._indexPatternId); // update the job's url

              cUrl.url_value = newUrl;
            }
          });
        }
      });
    }
  } // check the custom urls in the module's jobs to see if they contain INDEX_PATTERN_ID
  // which needs replacement


  doJobUrlsContainIndexPatternId(moduleConfig) {
    if (Array.isArray(moduleConfig.jobs)) {
      for (const job of moduleConfig.jobs) {
        // if the job has custom_urls
        if (job.config.custom_settings && job.config.custom_settings.custom_urls) {
          for (const cUrl of job.config.custom_settings.custom_urls) {
            if (cUrl.url_value.match(INDEX_PATTERN_ID)) {
              return true;
            }
          }
        }
      }
    }

    return false;
  } // loop through each kibana saved object and replace any INDEX_PATTERN_ID and
  // INDEX_PATTERN_NAME markers for the id or name of the specified index pattern


  updateSavedObjectIndexPatterns(moduleConfig) {
    if (moduleConfig.kibana) {
      Object.keys(moduleConfig.kibana).forEach(category => {
        moduleConfig.kibana[category].forEach(item => {
          let jsonString = item.config.kibanaSavedObjectMeta.searchSourceJSON;

          if (jsonString.match(INDEX_PATTERN_ID)) {
            jsonString = jsonString.replace(new RegExp(INDEX_PATTERN_ID, 'g'), this._indexPatternId);
            item.config.kibanaSavedObjectMeta.searchSourceJSON = jsonString;
          }

          if (category === SAVED_OBJECT_TYPES.VISUALIZATION) {
            // Look for any INDEX_PATTERN_NAME tokens in visualization visState,
            // as e.g. Vega visualizations reference the Elasticsearch index pattern directly.
            let visStateString = String(item.config.visState);

            if (visStateString !== undefined && visStateString.match(INDEX_PATTERN_NAME)) {
              visStateString = visStateString.replace(new RegExp(INDEX_PATTERN_NAME, 'g'), this._indexPatternName);
              item.config.visState = visStateString;
            }
          }
        });
      });
    }
  }
  /**
   * Provides a time range of the last 3 months of data
   */


  async getFallbackTimeRange(timeField, query) {
    const fieldsService = (0, _fields_service.fieldsServiceProvider)(this._client);
    const timeFieldRange = await fieldsService.getTimeFieldRange(this._indexPatternName, timeField, query);
    return {
      start: timeFieldRange.end.epoch - _moment.default.duration(3, 'months').asMilliseconds(),
      end: timeFieldRange.end.epoch
    };
  }
  /**
   * Ensure the model memory limit for each job is not greater than
   * the max model memory setting for the cluster
   */


  async updateModelMemoryLimits(moduleConfig, estimateMML, start, end) {
    if (!Array.isArray(moduleConfig.jobs)) {
      return;
    }

    if (estimateMML && this.jobsForModelMemoryEstimation.length > 0) {
      try {
        // Checks if all jobs in the module have the same time field configured
        const firstJobTimeField = this.jobsForModelMemoryEstimation[0].job.config.data_description.time_field;
        const isSameTimeFields = this.jobsForModelMemoryEstimation.every(({
          job
        }) => job.config.data_description.time_field === firstJobTimeField);

        if (isSameTimeFields && (start === undefined || end === undefined)) {
          // In case of time range is not provided and the time field is the same
          // set the fallback range for all jobs
          // as there may not be a common query, we use a match_all
          const {
            start: fallbackStart,
            end: fallbackEnd
          } = await this.getFallbackTimeRange(firstJobTimeField, {
            match_all: {}
          });
          start = fallbackStart;
          end = fallbackEnd;
        }

        for (const {
          job,
          query
        } of this.jobsForModelMemoryEstimation) {
          let earliestMs = start;
          let latestMs = end;

          if (earliestMs === undefined || latestMs === undefined) {
            const timeFieldRange = await this.getFallbackTimeRange(job.config.data_description.time_field, query);
            earliestMs = timeFieldRange.start;
            latestMs = timeFieldRange.end;
          }

          const {
            modelMemoryLimit
          } = await this._calculateModelMemoryLimit(job.config.analysis_config, this._indexPatternName, query, job.config.data_description.time_field, earliestMs, latestMs);

          if (!job.config.analysis_limits) {
            job.config.analysis_limits = {};
          }

          job.config.analysis_limits.model_memory_limit = modelMemoryLimit;
        }
      } catch (error) {
        _log.mlLog.warn(`Data recognizer could not estimate model memory limit ${JSON.stringify(error.body)}`);
      }
    }

    const {
      body: {
        limits
      }
    } = await this._mlClient.info();
    const maxMml = limits.max_model_memory_limit;

    if (!maxMml) {
      return;
    } // @ts-expect-error


    const maxBytes = (0, _numeral.default)(maxMml.toUpperCase()).value();

    for (const job of moduleConfig.jobs) {
      var _job$config, _job$config$analysis_;

      const mml = (_job$config = job.config) === null || _job$config === void 0 ? void 0 : (_job$config$analysis_ = _job$config.analysis_limits) === null || _job$config$analysis_ === void 0 ? void 0 : _job$config$analysis_.model_memory_limit;

      if (mml !== undefined) {
        // @ts-expect-error
        const mmlBytes = (0, _numeral.default)(mml.toUpperCase()).value();

        if (mmlBytes > maxBytes) {
          // if the job's mml is over the max,
          // so set the jobs mml to be the max
          if (!job.config.analysis_limits) {
            job.config.analysis_limits = {};
          }

          job.config.analysis_limits.model_memory_limit = maxMml;
        }
      }
    }
  } // check the kibana saved searches JSON in the module to see if they contain INDEX_PATTERN_ID
  // which needs replacement


  doSavedObjectsContainIndexPatternId(moduleConfig) {
    if (moduleConfig.kibana) {
      for (const category of Object.keys(moduleConfig.kibana)) {
        for (const item of moduleConfig.kibana[category]) {
          const jsonString = item.config.kibanaSavedObjectMeta.searchSourceJSON;

          if (jsonString.match(INDEX_PATTERN_ID)) {
            return true;
          }
        }
      }
    }

    return false;
  }

  applyJobConfigOverrides(moduleConfig, jobOverrides, jobPrefix = '') {
    if (jobOverrides === undefined || jobOverrides === null) {
      return;
    }

    if (typeof jobOverrides !== 'object') {
      throw _boom.default.badRequest(`Incompatible jobOverrides type (${typeof jobOverrides}). It needs to be an object or array of objects.`);
    } // jobOverrides could be a single object or an array of objects.
    // if single, convert to an array


    const overrides = Array.isArray(jobOverrides) ? jobOverrides : [jobOverrides];
    const {
      jobs
    } = moduleConfig; // separate all the overrides.
    // the overrides which don't contain a job id will be applied to all jobs in the module

    const generalOverrides = [];
    const jobSpecificOverrides = [];
    overrides.forEach(override => {
      if ((0, _modules.isGeneralJobOverride)(override)) {
        generalOverrides.push(override);
      } else {
        jobSpecificOverrides.push(override);
      }
    });

    if (generalOverrides.some(override => {
      var _override$analysis_li;

      return !!((_override$analysis_li = override.analysis_limits) !== null && _override$analysis_li !== void 0 && _override$analysis_li.model_memory_limit);
    })) {
      this.jobsForModelMemoryEstimation = [];
    } else {
      this.jobsForModelMemoryEstimation = moduleConfig.jobs.filter(job => {
        var _override$analysis_li2;

        const override = jobSpecificOverrides.find(o => `${jobPrefix}${o.job_id}` === job.id);
        return (override === null || override === void 0 ? void 0 : (_override$analysis_li2 = override.analysis_limits) === null || _override$analysis_li2 === void 0 ? void 0 : _override$analysis_li2.model_memory_limit) === undefined;
      }).map(job => {
        var _moduleConfig$datafee3;

        return {
          job,
          query: ((_moduleConfig$datafee3 = moduleConfig.datafeeds.find(d => d.config.job_id === job.id)) === null || _moduleConfig$datafee3 === void 0 ? void 0 : _moduleConfig$datafee3.config.query) || null
        };
      });
    }

    function processArrayValues(source, update) {
      if (typeof source !== 'object' || typeof update !== 'object') {
        return;
      }

      Object.keys(source).forEach(key => {
        const sourceValue = source[key];
        const updateValue = update[key];

        if (typeof sourceValue !== 'object' || sourceValue === null || typeof updateValue !== 'object' || updateValue === null) {
          return;
        }

        if (Array.isArray(sourceValue) && Array.isArray(updateValue)) {
          source[key] = updateValue;
        } else {
          processArrayValues(sourceValue, updateValue);
        }
      });
    }

    generalOverrides.forEach(generalOverride => {
      jobs.forEach(job => {
        (0, _lodash.merge)(job.config, generalOverride);
        processArrayValues(job.config, generalOverride);
      });
    });
    jobSpecificOverrides.forEach(jobSpecificOverride => {
      // for each override, find the relevant job.
      // note, the job id already has the prefix prepended to it
      const job = jobs.find(j => j.id === `${jobPrefix}${jobSpecificOverride.job_id}`);

      if (job !== undefined) {
        // delete the job_id in the override as this shouldn't be overridden
        // @ts-expect-error
        delete jobSpecificOverride.job_id;
        (0, _lodash.merge)(job.config, jobSpecificOverride);
        processArrayValues(job.config, jobSpecificOverride);
      }
    });
  }

  applyDatafeedConfigOverrides(moduleConfig, datafeedOverrides, jobPrefix = '') {
    if (datafeedOverrides !== undefined && datafeedOverrides !== null) {
      if (typeof datafeedOverrides !== 'object') {
        throw _boom.default.badRequest(`Incompatible datafeedOverrides type (${typeof datafeedOverrides}). It needs to be an object or array of objects.`);
      } // jobOverrides could be a single object or an array of objects.
      // if single, convert to an array


      const overrides = Array.isArray(datafeedOverrides) ? datafeedOverrides : [datafeedOverrides];
      const {
        datafeeds
      } = moduleConfig; // for some items in the datafeed, we should not merge.
      // we should instead use the whole override object

      function overwriteObjects(source, update) {
        Object.entries(update).forEach(([key, val]) => {
          if (typeof val === 'object') {
            switch (key) {
              case 'query':
              case 'aggregations':
              case 'aggs':
              case 'script_fields':
                source[key] = val;
                break;

              default:
                break;
            }
          }
        });
      } // separate all the overrides.
      // the overrides which don't contain a datafeed id or a job id will be applied to all jobs in the module


      const generalOverrides = [];
      const datafeedSpecificOverrides = [];
      overrides.forEach(o => {
        if (o.datafeed_id === undefined && o.job_id === undefined) {
          generalOverrides.push(o);
        } else {
          datafeedSpecificOverrides.push(o);
        }
      });
      generalOverrides.forEach(o => {
        datafeeds.forEach(({
          config
        }) => {
          (0, _lodash.merge)(config, o);
          overwriteObjects(config, o);
        });
      }); // collect all the overrides which contain either a job id or a datafeed id

      datafeedSpecificOverrides.forEach(o => {
        // either a job id or datafeed id has been specified, so create a new id
        // containing either one plus the prefix
        const tempId = String(o.datafeed_id !== undefined ? o.datafeed_id : o.job_id);
        const dId = (0, _job_utils.prefixDatafeedId)(tempId, jobPrefix);
        const datafeed = datafeeds.find(d => d.id === dId);

        if (datafeed !== undefined) {
          delete o.job_id;
          delete o.datafeed_id;
          (0, _lodash.merge)(datafeed.config, o);
          overwriteObjects(datafeed.config, o);
        }
      });
    }
  }

}

exports.DataRecognizer = DataRecognizer;