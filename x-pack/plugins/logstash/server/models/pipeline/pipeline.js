"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Pipeline = void 0;

var _moment = _interopRequireDefault(require("moment"));

var _boom = require("@hapi/boom");

var _lodash = require("lodash");

var _i18n = require("@kbn/i18n");

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
/**
 * This model deals with a pipeline object from ES and converts it to Kibana downstream
 */


class Pipeline {
  constructor(options) {
    _defineProperty(this, "id", void 0);

    _defineProperty(this, "description", void 0);

    _defineProperty(this, "username", void 0);

    _defineProperty(this, "pipeline", void 0);

    _defineProperty(this, "settings", void 0);

    this.id = options.id;
    this.description = options.description;
    this.username = options.username;
    this.pipeline = options.pipeline;
    this.settings = options.settings || {};
  }

  get downstreamJSON() {
    const json = {
      id: this.id,
      description: this.description,
      username: this.username,
      pipeline: this.pipeline,
      settings: this.settings
    };
    return json;
  }
  /**
   * Returns the JSON schema for the pipeline doc that Elasticsearch expects
   * For now, we hard code pipeline_metadata since we don't use it yet
   * pipeline_metadata.version is the version of the Logstash config stored in
   * pipeline field.
   * pipeline_metadata.type is the Logstash config type (future: LIR, json, etc)
   * @return {[JSON]} [Elasticsearch JSON]
   */


  get upstreamJSON() {
    return {
      description: this.description,
      last_modified: (0, _moment.default)().toISOString(),
      pipeline_metadata: {
        version: 1,
        type: 'logstash_pipeline'
      },
      username: this.username,
      pipeline: this.pipeline,
      pipeline_settings: this.settings
    };
  } // generate Pipeline object from kibana response


  static fromDownstreamJSON(downstreamPipeline, pipelineId, username) {
    const opts = {
      id: pipelineId,
      description: downstreamPipeline.description,
      username,
      pipeline: downstreamPipeline.pipeline,
      settings: downstreamPipeline.settings
    };
    return new Pipeline(opts);
  } // generate Pipeline object from elasticsearch response


  static fromUpstreamJSON(upstreamPipeline) {
    if (Object.keys(upstreamPipeline).length !== 1) {
      throw (0, _boom.badRequest)(_i18n.i18n.translate('xpack.logstash.upstreamPipelineArgumentMustContainAnIdPropertyErrorMessage', {
        defaultMessage: 'upstreamPipeline argument must contain pipeline id as a key'
      }));
    }

    const id = Object.keys(upstreamPipeline).pop();
    const description = (0, _lodash.get)(upstreamPipeline, id + '.description');
    const username = (0, _lodash.get)(upstreamPipeline, id + '.username');
    const pipeline = (0, _lodash.get)(upstreamPipeline, id + '.pipeline');
    const settings = (0, _lodash.get)(upstreamPipeline, id + '.pipeline_settings');
    const opts = {
      id,
      description,
      username,
      pipeline,
      settings
    };
    return new Pipeline(opts);
  }

}

exports.Pipeline = Pipeline;