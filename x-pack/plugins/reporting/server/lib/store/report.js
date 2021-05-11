"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "ReportApiJSON", {
  enumerable: true,
  get: function () {
    return _types.ReportApiJSON;
  }
});
Object.defineProperty(exports, "ReportSource", {
  enumerable: true,
  get: function () {
    return _types.ReportSource;
  }
});
exports.Report = void 0;

var _moment = _interopRequireDefault(require("moment"));

var _puid = _interopRequireDefault(require("puid"));

var _constants = require("../../../common/constants");

var _types = require("../../../common/types");

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

const puid = new _puid.default();

class Report {
  // set by ES
  // set by ES

  /*
   * Create an unsaved report
   * Index string is required
   */
  constructor(opts) {
    _defineProperty(this, "_index", void 0);

    _defineProperty(this, "_id", void 0);

    _defineProperty(this, "_primary_term", void 0);

    _defineProperty(this, "_seq_no", void 0);

    _defineProperty(this, "kibana_name", void 0);

    _defineProperty(this, "kibana_id", void 0);

    _defineProperty(this, "jobtype", void 0);

    _defineProperty(this, "created_at", void 0);

    _defineProperty(this, "created_by", void 0);

    _defineProperty(this, "payload", void 0);

    _defineProperty(this, "meta", void 0);

    _defineProperty(this, "max_attempts", void 0);

    _defineProperty(this, "browser_type", void 0);

    _defineProperty(this, "status", void 0);

    _defineProperty(this, "attempts", void 0);

    _defineProperty(this, "output", void 0);

    _defineProperty(this, "started_at", void 0);

    _defineProperty(this, "completed_at", void 0);

    _defineProperty(this, "process_expiration", void 0);

    _defineProperty(this, "priority", void 0);

    _defineProperty(this, "timeout", void 0);

    this._id = opts._id != null ? opts._id : puid.generate();
    this._index = opts._index;
    this._primary_term = opts._primary_term;
    this._seq_no = opts._seq_no;
    this.payload = opts.payload;
    this.kibana_name = opts.kibana_name;
    this.kibana_id = opts.kibana_id;
    this.jobtype = opts.jobtype;
    this.max_attempts = opts.max_attempts;
    this.attempts = opts.attempts || 0;
    this.process_expiration = opts.process_expiration;
    this.timeout = opts.timeout;
    this.created_at = opts.created_at || _moment.default.utc().toISOString();
    this.created_by = opts.created_by || false;
    this.meta = opts.meta || {
      objectType: 'unknown'
    };
    this.browser_type = opts.browser_type;
    this.priority = opts.priority;
    this.status = opts.status || _constants.JOB_STATUSES.PENDING;
    this.output = opts.output || null;
  }
  /*
   * Update the report with "live" storage metadata
   */


  updateWithEsDoc(doc) {
    if (doc._index == null || doc._id == null) {
      throw new Error(`Report object from ES has missing fields!`);
    }

    this._id = doc._id;
    this._index = doc._index;
    this._primary_term = doc._primary_term;
    this._seq_no = doc._seq_no;
  }
  /*
   * Data structure for writing to Elasticsearch index
   */


  toEsDocsJSON() {
    return {
      _id: this._id,
      _index: this._index,
      _source: {
        jobtype: this.jobtype,
        created_at: this.created_at,
        created_by: this.created_by,
        payload: this.payload,
        meta: this.meta,
        timeout: this.timeout,
        max_attempts: this.max_attempts,
        priority: this.priority,
        browser_type: this.browser_type,
        status: this.status,
        attempts: this.attempts,
        started_at: this.started_at,
        completed_at: this.completed_at
      }
    };
  }
  /*
   * Data structure for API responses
   */


  toApiJSON() {
    return {
      id: this._id,
      index: this._index,
      kibana_name: this.kibana_name,
      kibana_id: this.kibana_id,
      jobtype: this.jobtype,
      created_at: this.created_at,
      created_by: this.created_by,
      payload: this.payload,
      meta: this.meta,
      timeout: this.timeout,
      max_attempts: this.max_attempts,
      priority: this.priority,
      browser_type: this.browser_type,
      status: this.status,
      attempts: this.attempts,
      started_at: this.started_at,
      completed_at: this.completed_at
    };
  }

}

exports.Report = Report;