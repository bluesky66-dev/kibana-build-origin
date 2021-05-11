"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPointInTimeFinder = createPointInTimeFinder;
exports.PointInTimeFinder = void 0;

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Returns a generator to help page through large sets of saved objects.
 *
 * The generator wraps calls to `SavedObjects.find` and iterates over
 * multiple pages of results using `_pit` and `search_after`. This will
 * open a new Point In Time (PIT), and continue paging until a set of
 * results is received that's smaller than the designated `perPage`.
 *
 * Once you have retrieved all of the results you need, it is recommended
 * to call `close()` to clean up the PIT and prevent Elasticsearch from
 * consuming resources unnecessarily. This will automatically be done for
 * you if you reach the last page of results.
 *
 * @example
 * ```ts
 * const findOptions: SavedObjectsFindOptions = {
 *   type: 'visualization',
 *   search: 'foo*',
 *   perPage: 100,
 * };
 *
 * const finder = createPointInTimeFinder({
 *   logger,
 *   savedObjectsClient,
 *   findOptions,
 * });
 *
 * const responses: SavedObjectFindResponse[] = [];
 * for await (const response of finder.find()) {
 *   responses.push(...response);
 *   if (doneSearching) {
 *     await finder.close();
 *   }
 * }
 * ```
 */
function createPointInTimeFinder({
  findOptions,
  logger,
  savedObjectsClient
}) {
  return new PointInTimeFinder({
    findOptions,
    logger,
    savedObjectsClient
  });
}
/**
 * @internal
 */


var _log = new WeakMap();

var _savedObjectsClient = new WeakMap();

var _findOptions = new WeakMap();

var _open = new WeakMap();

var _pitId = new WeakMap();

class PointInTimeFinder {
  constructor({
    findOptions,
    logger,
    savedObjectsClient
  }) {
    _log.set(this, {
      writable: true,
      value: void 0
    });

    _savedObjectsClient.set(this, {
      writable: true,
      value: void 0
    });

    _findOptions.set(this, {
      writable: true,
      value: void 0
    });

    _open.set(this, {
      writable: true,
      value: false
    });

    _pitId.set(this, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldSet(this, _log, logger);

    _classPrivateFieldSet(this, _savedObjectsClient, savedObjectsClient);

    _classPrivateFieldSet(this, _findOptions, {
      // Default to 1000 items per page as a tradeoff between
      // speed and memory consumption.
      perPage: 1000,
      ...findOptions
    });
  }

  async *find() {
    if (_classPrivateFieldGet(this, _open)) {
      throw new Error('Point In Time has already been opened for this finder instance. ' + 'Please call `close()` before calling `find()` again.');
    } // Open PIT and request our first page of hits


    await this.open();
    let lastResultsCount;
    let lastHitSortValue;

    do {
      const results = await this.findNext({
        findOptions: _classPrivateFieldGet(this, _findOptions),
        id: _classPrivateFieldGet(this, _pitId),
        ...(lastHitSortValue ? {
          searchAfter: lastHitSortValue
        } : {})
      });

      _classPrivateFieldSet(this, _pitId, results.pit_id);

      lastResultsCount = results.saved_objects.length;
      lastHitSortValue = this.getLastHitSortValue(results);

      _classPrivateFieldGet(this, _log).debug(`Collected [${lastResultsCount}] saved objects for export.`); // Close PIT if this was our last page


      if (_classPrivateFieldGet(this, _pitId) && lastResultsCount < _classPrivateFieldGet(this, _findOptions).perPage) {
        await this.close();
      }

      yield results; // We've reached the end when there are fewer hits than our perPage size,
      // or when `close()` has been called.
    } while (_classPrivateFieldGet(this, _open) && lastResultsCount >= _classPrivateFieldGet(this, _findOptions).perPage);

    return;
  }

  async close() {
    try {
      if (_classPrivateFieldGet(this, _pitId)) {
        _classPrivateFieldGet(this, _log).debug(`Closing PIT for types [${_classPrivateFieldGet(this, _findOptions).type}]`);

        await _classPrivateFieldGet(this, _savedObjectsClient).closePointInTime(_classPrivateFieldGet(this, _pitId));

        _classPrivateFieldSet(this, _pitId, undefined);
      }

      _classPrivateFieldSet(this, _open, false);
    } catch (e) {
      _classPrivateFieldGet(this, _log).error(`Failed to close PIT for types [${_classPrivateFieldGet(this, _findOptions).type}]`);

      throw e;
    }
  }

  async open() {
    try {
      const {
        id
      } = await _classPrivateFieldGet(this, _savedObjectsClient).openPointInTimeForType(_classPrivateFieldGet(this, _findOptions).type);

      _classPrivateFieldSet(this, _pitId, id);

      _classPrivateFieldSet(this, _open, true);
    } catch (e) {
      // Since `find` swallows 404s, it is expected that exporter will do the same,
      // so we only rethrow non-404 errors here.
      if (e.output.statusCode !== 404) {
        throw e;
      }

      _classPrivateFieldGet(this, _log).debug(`Unable to open PIT for types [${_classPrivateFieldGet(this, _findOptions).type}]: 404 ${e}`);
    }
  }

  async findNext({
    findOptions,
    id,
    searchAfter
  }) {
    try {
      return await _classPrivateFieldGet(this, _savedObjectsClient).find({
        // Sort fields are required to use searchAfter, so we set some defaults here
        sortField: 'updated_at',
        sortOrder: 'desc',
        // Bump keep_alive by 2m on every new request to allow for the ES client
        // to make multiple retries in the event of a network failure.
        ...(id ? {
          pit: {
            id,
            keepAlive: '2m'
          }
        } : {}),
        ...(searchAfter ? {
          searchAfter
        } : {}),
        ...findOptions
      });
    } catch (e) {
      if (id) {
        // Clean up PIT on any errors.
        await this.close();
      }

      throw e;
    }
  }

  getLastHitSortValue(res) {
    if (res.saved_objects.length < 1) {
      return undefined;
    }

    return res.saved_objects[res.saved_objects.length - 1].sort;
  }

}

exports.PointInTimeFinder = PointInTimeFinder;