"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ElasticsearchConfigurationBlockAdapter = void 0;

var _lodash = require("lodash");

var _v = _interopRequireDefault(require("uuid/v4"));

var _constants = require("../../../../common/constants");

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

class ElasticsearchConfigurationBlockAdapter {
  constructor(database) {
    _defineProperty(this, "database", void 0);

    this.database = database;
  }

  async getByIds(user, ids) {
    if (ids.length === 0) {
      return [];
    }

    const params = {
      ignore: [404],
      _source: true,
      size: 10000,
      index: _constants.INDEX_NAMES.BEATS,
      body: {
        ids: ids.map(id => `configuration_block:${id}`)
      }
    };
    const response = await this.database.search(user, params);
    const configs = (0, _lodash.get)(response, 'hits.hits', []);
    return configs.map(tag => ({ ...tag._source.tag,
      config: JSON.parse(tag._source.tag)
    }));
  }

  async getForTags(user, tagIds, page = 0, size = 100) {
    if (tagIds.length === 0) {
      return {
        page: 0,
        total: 0,
        blocks: []
      };
    }

    const params = {
      ignore: [404],
      index: _constants.INDEX_NAMES.BEATS,
      body: {
        from: page === -1 ? undefined : page * size,
        size,
        query: {
          terms: {
            'configuration_block.tag': tagIds
          }
        }
      }
    };
    let response;

    if (page === -1) {
      response = await this.database.searchAll(user, params);
    } else {
      response = await this.database.search(user, params);
    }

    const configs = (0, _lodash.get)(response, 'hits.hits', []);
    return {
      blocks: configs.map(block => ({ ...block._source.configuration_block,
        config: JSON.parse(block._source.configuration_block.config || '{}')
      })),
      page,
      total: response.hits ? response.hits.total.value : 0
    };
  }

  async delete(user, ids) {
    const result = await this.database.bulk(user, {
      body: ids.map(id => ({
        delete: {
          _id: `configuration_block:${id}`
        }
      })),
      index: _constants.INDEX_NAMES.BEATS,
      refresh: 'wait_for'
    });

    if (result.errors) {
      if (result.items[0].result) {
        throw new Error(result.items[0].result);
      }

      throw new Error(result.items[0].index.error.reason);
    }

    return result.items.map(item => {
      return {
        id: item.delete._id,
        success: item.delete.result === 'deleted',
        reason: item.delete.result !== 'deleted' ? item.delete.result : undefined
      };
    });
  }

  async deleteForTags(user, tagIds) {
    const result = await this.database.deleteByQuery(user, {
      body: {
        query: {
          terms: {
            'configuration_block.tag': tagIds
          }
        }
      },
      index: _constants.INDEX_NAMES.BEATS
    });

    if (result.failures.length > 0) {
      return {
        success: false,
        reason: result.failures[0]
      };
    }

    return {
      success: true
    };
  }

  async create(user, configs) {
    const body = (0, _lodash.flatten)(configs.map(config => {
      const {
        id: configId,
        ...configWithoutId
      } = config;
      const id = configId || (0, _v.default)();
      return [{
        index: {
          _id: `configuration_block:${id}`
        }
      }, {
        type: 'configuration_block',
        configuration_block: {
          id,
          ...configWithoutId,
          config: JSON.stringify(config.config)
        }
      }];
    }));
    const result = await this.database.bulk(user, {
      body,
      index: _constants.INDEX_NAMES.BEATS,
      refresh: 'wait_for'
    });

    if (result.errors) {
      if (result.items[0].result) {
        throw new Error(result.items[0].result);
      }

      throw new Error(result.items[0].index.error.reason);
    }

    return result.items.map(item => item.index._id);
  }

}

exports.ElasticsearchConfigurationBlockAdapter = ElasticsearchConfigurationBlockAdapter;