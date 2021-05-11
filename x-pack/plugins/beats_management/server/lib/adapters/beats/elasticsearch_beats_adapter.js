"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ElasticsearchBeatsAdapter = void 0;

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

function formatWithTags(beat) {
  const {
    tags,
    ...rest
  } = beat;
  return {
    tags: tags || [],
    ...rest
  };
}

class ElasticsearchBeatsAdapter {
  constructor(database) {
    _defineProperty(this, "database", void 0);

    this.database = database;
  }

  async get(user, id) {
    const params = {
      id: `beat:${id}`,
      ignore: [404],
      index: _constants.INDEX_NAMES.BEATS
    };
    const response = await this.database.get(user, params);

    if (!response.found) {
      return null;
    }

    const beat = (0, _lodash.get)(response, '_source.beat');
    beat.tags = beat.tags || [];
    return beat;
  }

  async insert(user, beat) {
    const body = {
      beat,
      type: 'beat'
    };
    await this.database.index(user, {
      body,
      id: `beat:${beat.id}`,
      index: _constants.INDEX_NAMES.BEATS,
      refresh: 'wait_for'
    });
  }

  async update(user, beat) {
    const body = {
      beat,
      type: 'beat'
    };
    const params = {
      body,
      id: `beat:${beat.id}`,
      index: _constants.INDEX_NAMES.BEATS,
      refresh: 'wait_for'
    };
    await this.database.index(user, params);
  }

  async getWithIds(user, beatIds) {
    const ids = beatIds.map(beatId => `beat:${beatId}`);
    const params = {
      body: {
        ids
      },
      index: _constants.INDEX_NAMES.BEATS
    };
    const response = await this.database.mget(user, params);
    return (0, _lodash.get)(response, 'docs', []).filter(b => b.found).map(b => ({
      tags: [],
      ...b._source.beat
    }));
  }

  async getAllWithTags(user, tagIds) {
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
    const response = await this.database.search(user, params);
    const beats = (0, _lodash.get)(response, 'hits.hits', []);

    if (beats.length === 0) {
      return [];
    }

    return beats.map(beat => formatWithTags((0, _lodash.omit)(beat._source.beat, ['access_token'])));
  }

  async getBeatWithToken(user, enrollmentToken) {
    const params = {
      ignore: [404],
      index: _constants.INDEX_NAMES.BEATS,
      body: {
        query: {
          match: {
            'beat.enrollment_token': enrollmentToken
          }
        }
      }
    };
    const response = await this.database.search(user, params);
    const beats = (0, _lodash.get)(response, 'hits.hits', []);

    if (beats.length === 0) {
      return null;
    }

    return (0, _lodash.omit)((0, _lodash.get)(formatWithTags(beats[0]), '_source.beat'), ['access_token']);
  }

  async getAll(user, ESQuery) {
    const params = {
      index: _constants.INDEX_NAMES.BEATS,
      size: 10000,
      ignore: [404],
      body: {
        query: {
          bool: {
            must: {
              term: {
                type: 'beat'
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

    let response;

    try {
      response = await this.database.search(user, params);
    } catch (e) {// TODO something
    }

    if (!response) {
      return [];
    }

    const beats = (0, _lodash.get)(response, 'hits.hits', []);
    return beats.map(beat => formatWithTags((0, _lodash.omit)(beat._source.beat, ['access_token'])));
  }

  async removeTagsFromBeats(user, removals) {
    const body = (0, _lodash.flatten)(removals.map(({
      beatId,
      tag
    }) => {
      const script = `
          def beat = ctx._source.beat;
          if (beat.tags != null) {
            beat.tags.removeAll([params.tag]);
          }`;
      return [{
        update: {
          _id: `beat:${beatId}`
        }
      }, {
        script: {
          source: script.replace('          ', ''),
          params: {
            tag
          }
        }
      }];
    }));
    const response = await this.database.bulk(user, {
      body,
      index: _constants.INDEX_NAMES.BEATS,
      refresh: 'wait_for'
    });
    return (0, _lodash.get)(response, 'items', []).map((item, resultIdx) => ({
      idxInRequest: removals[resultIdx].idxInRequest,
      result: item.update.result,
      status: item.update.status
    }));
  }

  async assignTagsToBeats(user, assignments) {
    const body = (0, _lodash.flatten)(assignments.map(({
      beatId,
      tag
    }) => {
      const script = `
          def beat = ctx._source.beat;
          if (beat.tags == null) {
            beat.tags = [];
          }
          if (!beat.tags.contains(params.tag)) {
            beat.tags.add(params.tag);
          }`;
      return [{
        update: {
          _id: `beat:${beatId}`
        }
      }, {
        script: {
          source: script.replace('          ', ''),
          params: {
            tag
          }
        }
      }];
    }));
    const response = await this.database.bulk(user, {
      body,
      index: _constants.INDEX_NAMES.BEATS,
      refresh: 'wait_for'
    }); // console.log(response.items[0].update.error);

    return (0, _lodash.get)(response, 'items', []).map((item, resultIdx) => ({
      idxInRequest: assignments[resultIdx].idxInRequest,
      result: item.update.result,
      status: item.update.status
    }));
  }

}

exports.ElasticsearchBeatsAdapter = ElasticsearchBeatsAdapter;