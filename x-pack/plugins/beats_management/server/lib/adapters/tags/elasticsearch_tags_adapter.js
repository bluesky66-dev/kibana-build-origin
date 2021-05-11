"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ElasticsearchTagsAdapter = void 0;

var _lodash = require("lodash");

var _constants = require("../../../../common/constants");

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

class ElasticsearchTagsAdapter {
  constructor(database) {
    _defineProperty(this, "database", void 0);

    this.database = database;
  }

  async getAll(user, ESQuery) {
    const params = {
      ignore: [404],
      _source: true,
      size: 10000,
      index: _constants.INDEX_NAMES.BEATS,
      body: {
        query: {
          bool: {
            must: {
              term: {
                type: 'tag'
              }
            }
          }
        }
      }
    };

    if (ESQuery) {
      params.body.query = { ...params.body.query,
        ...ESQuery
      };
    }

    const response = await this.database.search(user, params);
    const tags = (0, _lodash.get)(response, 'hits.hits', []);
    return tags.map(tag => ({
      hasConfigurationBlocksTypes: [],
      ...tag._source.tag
    }));
  }

  async delete(user, tagIds) {
    const ids = tagIds.map(tag => tag);
    const params = {
      ignore: [404],
      index: _constants.INDEX_NAMES.BEATS,
      body: {
        query: {
          terms: {
            'beat.tags': tagIds
          }
        }
      }
    };
    const beatsResponse = await this.database.search(user, params);
    const beats = (0, _lodash.get)(beatsResponse, 'hits.hits', []).map(beat => beat._source.beat);
    const inactiveBeats = beats.filter(beat => beat.active === false);
    const activeBeats = beats.filter(beat => beat.active === true);

    if (activeBeats.length !== 0) {
      return false;
    }

    const beatIds = inactiveBeats.map(beat => beat.id); // While we block tag deletion when on an active beat, we should remove from inactive

    const bulkInactiveBeatsUpdates = (0, _lodash.flatten)(beatIds.map(beatId => {
      const script = `
        def beat = ctx._source.beat;
        if (beat.tags != null) {
          beat.tags.removeAll([params.tag]);
        }`;
      return (0, _lodash.flatten)(ids.map(tagId => [{
        update: {
          _id: `beat:${beatId}`
        }
      }, {
        script: {
          source: script.replace('          ', ''),
          params: {
            tagId
          }
        }
      }]));
    }));
    const bulkTagsDelete = ids.map(tagId => ({
      delete: {
        _id: `tag:${tagId}`
      }
    }));
    await this.database.bulk(user, {
      body: (0, _lodash.flatten)([...bulkInactiveBeatsUpdates, ...bulkTagsDelete]),
      index: _constants.INDEX_NAMES.BEATS,
      refresh: 'wait_for'
    });
    return true;
  }

  async getTagsWithIds(user, tagIds) {
    if (tagIds.length === 0) {
      return [];
    }

    const ids = tagIds.map(tag => `tag:${tag}`);
    const params = {
      ignore: [404],
      _source: true,
      body: {
        ids
      },
      index: _constants.INDEX_NAMES.BEATS
    };
    const response = await this.database.mget(user, params);
    return (0, _lodash.get)(response, 'docs', []).filter(b => b.found).map(b => ({
      hasConfigurationBlocksTypes: [],
      ...b._source.tag,
      id: b._id.replace('tag:', '')
    }));
  }

  async upsertTag(user, tag) {
    const body = {
      tag,
      type: 'tag'
    };
    const params = {
      body,
      id: `tag:${tag.id}`,
      index: _constants.INDEX_NAMES.BEATS,
      refresh: 'wait_for'
    };
    const response = await this.database.index(user, params);
    return (0, _lodash.get)(response, 'result');
  }

  async getWithoutConfigTypes(user, blockTypes) {
    const body = {
      query: {
        bool: {
          filter: {
            match: {
              type: 'tag'
            }
          },
          must_not: {
            terms: {
              'tag.hasConfigurationBlocksTypes': blockTypes
            }
          }
        }
      }
    };
    const params = {
      body,
      index: _constants.INDEX_NAMES.BEATS,
      ignore: [404],
      _source: true,
      size: 10000
    };
    const response = await this.database.search(user, params);
    const tags = (0, _lodash.get)(response, 'hits.hits', []);
    return tags.map(tag => ({
      hasConfigurationBlocksTypes: [],
      ...tag._source.tag
    }));
  }

}

exports.ElasticsearchTagsAdapter = ElasticsearchTagsAdapter;