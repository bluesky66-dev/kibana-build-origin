"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.KibanaDatabaseAdapter = void 0;

var _adapter_types = require("./../framework/adapter_types");

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

class KibanaDatabaseAdapter {
  constructor(elasticsearch) {
    _defineProperty(this, "es", void 0);

    this.es = elasticsearch.legacy.client;
  }

  async get(user, params) {
    return await this.callWithUser(user, 'get', params);
  }

  async mget(user, params) {
    return await this.callWithUser(user, 'mget', params);
  }

  async bulk(user, params) {
    return await this.callWithUser(user, 'bulk', params);
  }

  async create(user, params) {
    return await this.callWithUser(user, 'create', params);
  }

  async index(user, params) {
    return await this.callWithUser(user, 'index', params);
  }

  async delete(user, params) {
    return await this.callWithUser(user, 'delete', params);
  }

  async deleteByQuery(user, params) {
    return await this.callWithUser(user, 'deleteByQuery', params);
  }

  async search(user, params) {
    return await this.callWithUser(user, 'search', params);
  }

  async searchAll(user, params) {
    return await this.callWithUser(user, 'search', {
      scroll: '1m',
      ...params,
      body: {
        size: 1000,
        ...params.body
      }
    });
  }

  async putTemplate(name, template) {
    return await this.callWithUser({
      kind: 'internal'
    }, 'indices.putTemplate', {
      name,
      body: template
    });
  }

  callWithUser(user, esMethod, options = {}) {
    if (user.kind === 'authenticated') {
      return this.es.asScoped({
        headers: user[_adapter_types.internalAuthData]
      }).callAsCurrentUser(esMethod, options);
    } else if (user.kind === 'internal') {
      return this.es.callAsInternalUser(esMethod, options);
    } else {
      throw new Error('Invalid user type');
    }
  }

}

exports.KibanaDatabaseAdapter = KibanaDatabaseAdapter;