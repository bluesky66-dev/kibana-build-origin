"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PipelineListItem = void 0;

var _lodash = require("lodash");

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

class PipelineListItem {
  constructor(options) {
    _defineProperty(this, "id", void 0);

    _defineProperty(this, "description", void 0);

    _defineProperty(this, "last_modified", void 0);

    _defineProperty(this, "username", void 0);

    this.id = options.id;
    this.description = options.description;
    this.last_modified = options.last_modified;
    this.username = options.username;
  }

  get downstreamJSON() {
    const json = {
      id: this.id,
      description: this.description,
      last_modified: this.last_modified,
      username: this.username
    };
    return json;
  }
  /**
   * Takes the json GET response from ES and constructs a pipeline model to be used
   * in Kibana downstream
   */


  static fromUpstreamJSON(id, pipeline) {
    const opts = {
      id,
      description: (0, _lodash.get)(pipeline, id + '.description'),
      last_modified: (0, _lodash.get)(pipeline, id + '.last_modified'),
      username: (0, _lodash.get)(pipeline, id + '.username')
    };
    return new PipelineListItem(opts);
  }

}

exports.PipelineListItem = PipelineListItem;