"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReportingStore = void 0;

var _ = require("../");

var _index_timestamp = require("./index_timestamp");

var _mapping = require("./mapping");

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

const checkReportIsEditable = report => {
  if (!report._id || !report._index) {
    throw new Error(`Report object is not synced with ES!`);
  }
};
/*
 * A class to give an interface to historical reports in the reporting.index
 * - track the state: pending, processing, completed, etc
 * - handle updates and deletes to the reporting document
 * - interface for downloading the report
 */


class ReportingStore {
  constructor(reporting, logger) {
    _defineProperty(this, "indexPrefix", void 0);

    _defineProperty(this, "indexInterval", void 0);

    _defineProperty(this, "client", void 0);

    _defineProperty(this, "logger", void 0);

    const config = reporting.getConfig();
    const elasticsearch = reporting.getElasticsearchService();
    this.client = elasticsearch.legacy.client;
    this.indexPrefix = config.get('index');
    this.indexInterval = config.get('queue', 'indexInterval');
    this.logger = logger;
  }

  async createIndex(indexName) {
    return await this.client.callAsInternalUser('indices.exists', {
      index: indexName
    }).then(exists => {
      if (exists) {
        return exists;
      }

      const indexSettings = {
        number_of_shards: 1,
        auto_expand_replicas: '0-1'
      };
      const body = {
        settings: indexSettings,
        mappings: {
          properties: _mapping.mapping
        }
      };
      return this.client.callAsInternalUser('indices.create', {
        index: indexName,
        body
      }).then(() => true).catch(err => {
        const isIndexExistsError = err.message.match(/resource_already_exists_exception/);

        if (isIndexExistsError) {
          // Do not fail a job if the job runner hits the race condition.
          this.logger.warn(`Automatic index creation failed: index already exists: ${err}`);
          return;
        }

        this.logger.error(err);
        throw err;
      });
    });
  }
  /*
   * Called from addReport, which handles any errors
   */


  async indexReport(report) {
    const doc = {
      index: report._index,
      id: report._id,
      body: { ...report.toEsDocsJSON()._source,
        process_expiration: new Date(0),
        // use epoch so the job query works
        attempts: 0,
        status: _.statuses.JOB_STATUS_PENDING
      }
    };
    return await this.client.callAsInternalUser('index', doc);
  }
  /*
   * Called from addReport, which handles any errors
   */


  async refreshIndex(index) {
    return await this.client.callAsInternalUser('indices.refresh', {
      index
    });
  }

  async addReport(report) {
    let index = report._index;

    if (!index) {
      const timestamp = (0, _index_timestamp.indexTimestamp)(this.indexInterval);
      index = `${this.indexPrefix}-${timestamp}`;
      report._index = index;
    }

    await this.createIndex(index);

    try {
      const doc = await this.indexReport(report);
      report.updateWithEsDoc(doc);
      await this.refreshIndex(index);
      this.logger.debug(`Successfully stored pending job: ${report._index}/${report._id}`);
      return report;
    } catch (err) {
      this.logger.error(`Error in adding a report!`);
      this.logger.error(err);
      throw err;
    }
  }

  async setReportClaimed(report, stats) {
    const doc = { ...stats,
      status: _.statuses.JOB_STATUS_PROCESSING
    };

    try {
      checkReportIsEditable(report);
      return await this.client.callAsInternalUser('update', {
        id: report._id,
        index: report._index,
        if_seq_no: report._seq_no,
        if_primary_term: report._primary_term,
        body: {
          doc
        }
      });
    } catch (err) {
      this.logger.error('Error in setting report processing status!');
      this.logger.error(err);
      throw err;
    }
  }

  async setReportFailed(report, stats) {
    const doc = { ...stats,
      status: _.statuses.JOB_STATUS_FAILED
    };

    try {
      checkReportIsEditable(report);
      return await this.client.callAsInternalUser('update', {
        id: report._id,
        index: report._index,
        if_seq_no: report._seq_no,
        if_primary_term: report._primary_term,
        body: {
          doc
        }
      });
    } catch (err) {
      this.logger.error('Error in setting report failed status!');
      this.logger.error(err);
      throw err;
    }
  }

  async setReportCompleted(report, stats) {
    try {
      const {
        output
      } = stats;
      const status = output && output.warnings && output.warnings.length > 0 ? _.statuses.JOB_STATUS_WARNINGS : _.statuses.JOB_STATUS_COMPLETED;
      const doc = { ...stats,
        status
      };
      checkReportIsEditable(report);
      return await this.client.callAsInternalUser('update', {
        id: report._id,
        index: report._index,
        if_seq_no: report._seq_no,
        if_primary_term: report._primary_term,
        body: {
          doc
        }
      });
    } catch (err) {
      this.logger.error('Error in setting report complete status!');
      this.logger.error(err);
      throw err;
    }
  }

}

exports.ReportingStore = ReportingStore;