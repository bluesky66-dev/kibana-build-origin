"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ClusterClientAdapter = exports.EVENT_BUFFER_LENGTH = exports.EVENT_BUFFER_TIME = void 0;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _lodash = require("lodash");

var _types = require("../types");

var _server = require("../../../../../src/plugins/data/server");

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

const EVENT_BUFFER_TIME = 1000; // milliseconds

exports.EVENT_BUFFER_TIME = EVENT_BUFFER_TIME;
const EVENT_BUFFER_LENGTH = 100;
exports.EVENT_BUFFER_LENGTH = EVENT_BUFFER_LENGTH;

class ClusterClientAdapter {
  constructor(opts) {
    _defineProperty(this, "logger", void 0);

    _defineProperty(this, "elasticsearchClientPromise", void 0);

    _defineProperty(this, "docBuffer$", void 0);

    _defineProperty(this, "context", void 0);

    _defineProperty(this, "docsBufferedFlushed", void 0);

    this.logger = opts.logger;
    this.elasticsearchClientPromise = opts.elasticsearchClientPromise;
    this.context = opts.context;
    this.docBuffer$ = new _rxjs.Subject(); // buffer event log docs for time / buffer length, ignore empty
    // buffers, then index the buffered docs; kick things off with a
    // promise on the observable, which we'll wait on in shutdown

    this.docsBufferedFlushed = this.docBuffer$.pipe((0, _operators.bufferTime)(EVENT_BUFFER_TIME, null, EVENT_BUFFER_LENGTH), (0, _operators.filter)(docs => docs.length > 0), (0, _operators.switchMap)(async docs => await this.indexDocuments(docs))).toPromise();
  } // This will be called at plugin stop() time; the assumption is any plugins
  // depending on the event_log will already be stopped, and so will not be
  // writing more event docs.  We complete the docBuffer$ observable,
  // and wait for the docsBufffered$ observable to complete via it's promise,
  // and so should end up writing all events out that pass through, before
  // Kibana shuts down (cleanly).


  async shutdown() {
    this.docBuffer$.complete();
    await this.docsBufferedFlushed;
  }

  indexDocument(doc) {
    this.docBuffer$.next(doc);
  }

  async indexDocuments(docs) {
    // If es initialization failed, don't try to index.
    // Also, don't log here, we log the failure case in plugin startup
    // instead, otherwise we'd be spamming the log (if done here)
    if (!(await this.context.waitTillReady())) {
      return;
    }

    const bulkBody = [];

    for (const doc of docs) {
      if (doc.body === undefined) continue;
      bulkBody.push({
        create: {
          _index: doc.index
        }
      });
      bulkBody.push(doc.body);
    }

    try {
      const esClient = await this.elasticsearchClientPromise;
      await esClient.bulk({
        body: bulkBody
      });
    } catch (err) {
      this.logger.error(`error writing bulk events: "${err.message}"; docs: ${JSON.stringify(bulkBody)}`);
    }
  }

  async doesIlmPolicyExist(policyName) {
    const request = {
      method: 'GET',
      path: `/_ilm/policy/${policyName}`
    };

    try {
      const esClient = await this.elasticsearchClientPromise;
      await esClient.transport.request(request);
    } catch (err) {
      if (err.statusCode === 404) return false;
      throw new Error(`error checking existance of ilm policy: ${err.message}`);
    }

    return true;
  }

  async createIlmPolicy(policyName, policy) {
    const request = {
      method: 'PUT',
      path: `/_ilm/policy/${policyName}`,
      body: policy
    };

    try {
      const esClient = await this.elasticsearchClientPromise;
      await esClient.transport.request(request);
    } catch (err) {
      throw new Error(`error creating ilm policy: ${err.message}`);
    }
  }

  async doesIndexTemplateExist(name) {
    let result;

    try {
      const esClient = await this.elasticsearchClientPromise;
      result = (await esClient.indices.existsTemplate({
        name
      })).body;
    } catch (err) {
      throw new Error(`error checking existance of index template: ${err.message}`);
    }

    return result;
  }

  async createIndexTemplate(name, template) {
    try {
      const esClient = await this.elasticsearchClientPromise;
      await esClient.indices.putTemplate({
        name,
        body: template,
        create: true
      });
    } catch (err) {
      // The error message doesn't have a type attribute we can look to guarantee it's due
      // to the template already existing (only long message) so we'll check ourselves to see
      // if the template now exists. This scenario would happen if you startup multiple Kibana
      // instances at the same time.
      const existsNow = await this.doesIndexTemplateExist(name);

      if (!existsNow) {
        throw new Error(`error creating index template: ${err.message}`);
      }
    }
  }

  async doesAliasExist(name) {
    let result;

    try {
      const esClient = await this.elasticsearchClientPromise;
      result = (await esClient.indices.existsAlias({
        name
      })).body;
    } catch (err) {
      throw new Error(`error checking existance of initial index: ${err.message}`);
    }

    return result;
  }

  async createIndex(name, body = {}) {
    try {
      const esClient = await this.elasticsearchClientPromise;
      await esClient.indices.create({
        index: name,
        body
      });
    } catch (err) {
      var _err$body, _err$body$error;

      if (((_err$body = err.body) === null || _err$body === void 0 ? void 0 : (_err$body$error = _err$body.error) === null || _err$body$error === void 0 ? void 0 : _err$body$error.type) !== 'resource_already_exists_exception') {
        throw new Error(`error creating initial index: ${err.message}`);
      }
    }
  }

  async queryEventsBySavedObjects(index, namespace, type, ids, // eslint-disable-next-line @typescript-eslint/naming-convention
  {
    page,
    per_page: perPage,
    start,
    end,
    sort_field,
    sort_order,
    filter
  }) {
    const defaultNamespaceQuery = {
      bool: {
        must_not: {
          exists: {
            field: 'kibana.saved_objects.namespace'
          }
        }
      }
    };
    const namedNamespaceQuery = {
      term: {
        'kibana.saved_objects.namespace': {
          value: namespace
        }
      }
    };
    const namespaceQuery = namespace === undefined ? defaultNamespaceQuery : namedNamespaceQuery;
    const esClient = await this.elasticsearchClientPromise;
    let dslFilterQuery;

    try {
      dslFilterQuery = filter ? _server.esKuery.toElasticsearchQuery(_server.esKuery.fromKueryExpression(filter)) : [];
    } catch (err) {
      this.debug(`Invalid kuery syntax for the filter (${filter}) error:`, {
        message: err.message,
        statusCode: err.statusCode
      });
      throw err;
    }

    const body = {
      size: perPage,
      from: (page - 1) * perPage,
      sort: {
        [sort_field]: {
          order: sort_order
        }
      },
      query: {
        bool: {
          filter: dslFilterQuery,
          must: (0, _lodash.reject)([{
            nested: {
              path: 'kibana.saved_objects',
              query: {
                bool: {
                  must: [{
                    term: {
                      'kibana.saved_objects.rel': {
                        value: _types.SAVED_OBJECT_REL_PRIMARY
                      }
                    }
                  }, {
                    term: {
                      'kibana.saved_objects.type': {
                        value: type
                      }
                    }
                  }, {
                    terms: {
                      // default maximum of 65,536 terms, configurable by index.max_terms_count
                      'kibana.saved_objects.id': ids
                    }
                  }, namespaceQuery]
                }
              }
            }
          }, start && {
            range: {
              '@timestamp': {
                gte: start
              }
            }
          }, end && {
            range: {
              '@timestamp': {
                lte: end
              }
            }
          }], _lodash.isUndefined)
        }
      }
    };

    try {
      const {
        body: {
          hits: {
            hits,
            total
          }
        }
      } = await esClient.search({
        index,
        track_total_hits: true,
        body
      });
      return {
        page,
        per_page: perPage,
        total: total.value,
        data: hits.map(hit => hit._source)
      };
    } catch (err) {
      throw new Error(`querying for Event Log by for type "${type}" and ids "${ids}" failed with: ${err.message}`);
    }
  }

  debug(message, object) {
    const objectString = object == null ? '' : JSON.stringify(object);
    this.logger.debug(`esContext: ${message} ${objectString}`);
  }

}

exports.ClusterClientAdapter = ClusterClientAdapter;