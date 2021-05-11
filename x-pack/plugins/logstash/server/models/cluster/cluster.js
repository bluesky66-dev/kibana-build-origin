"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Cluster = void 0;

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
/**
 * This model deals with a cluster object from ES and converts it to Kibana downstream
 */


class Cluster {
  constructor({
    uuid
  }) {
    _defineProperty(this, "uuid", void 0);

    this.uuid = uuid;
  }

  get downstreamJSON() {
    const json = {
      uuid: this.uuid
    };
    return json;
  } // generate Pipeline object from elasticsearch response


  static fromUpstreamJSON(upstreamCluster) {
    const uuid = (0, _lodash.get)(upstreamCluster, 'cluster_uuid');
    return new Cluster({
      uuid
    });
  }

}

exports.Cluster = Cluster;