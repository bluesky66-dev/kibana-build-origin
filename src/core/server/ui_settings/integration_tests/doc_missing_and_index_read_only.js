"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.docMissingAndIndexReadOnlySuite = void 0;

var _lib = require("./lib");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const docMissingAndIndexReadOnlySuite = savedObjectsIndex => () => {
  // ensure the kibana index has no documents
  beforeEach(async () => {
    const {
      kbnServer,
      callCluster
    } = (0, _lib.getServices)(); // write a setting to ensure kibana index is created

    await kbnServer.inject({
      method: 'POST',
      url: '/api/kibana/settings/defaultIndex',
      payload: {
        value: 'abc'
      }
    }); // delete all docs from kibana index to ensure savedConfig is not found

    await callCluster('deleteByQuery', {
      index: savedObjectsIndex,
      body: {
        query: {
          match_all: {}
        }
      }
    }); // set the index to read only

    await callCluster('indices.putSettings', {
      index: savedObjectsIndex,
      body: {
        index: {
          blocks: {
            read_only: true
          }
        }
      }
    });
  });
  afterEach(async () => {
    const {
      callCluster
    } = (0, _lib.getServices)(); // disable the read only block

    await callCluster('indices.putSettings', {
      index: savedObjectsIndex,
      body: {
        index: {
          blocks: {
            read_only: false
          }
        }
      }
    });
  });
  describe('get route', () => {
    it('returns simulated doc with buildNum', async () => {
      const {
        kbnServer
      } = (0, _lib.getServices)();
      const {
        statusCode,
        result
      } = await kbnServer.inject({
        method: 'GET',
        url: '/api/kibana/settings'
      });
      expect(statusCode).toBe(200);
      expect(result).toMatchObject({
        settings: {
          buildNum: {
            userValue: expect.any(Number)
          },
          foo: {
            userValue: 'bar',
            isOverridden: true
          }
        }
      });
    });
  });
  describe('set route', () => {
    it('fails with 403 forbidden', async () => {
      const {
        kbnServer
      } = (0, _lib.getServices)();

      const defaultIndex = _lib.chance.word();

      const {
        statusCode,
        result
      } = await kbnServer.inject({
        method: 'POST',
        url: '/api/kibana/settings/defaultIndex',
        payload: {
          value: defaultIndex
        }
      });
      expect(statusCode).toBe(403);
      expect(result).toEqual({
        error: 'Forbidden',
        message: expect.stringContaining('index read-only'),
        statusCode: 403
      });
    });
  });
  describe('setMany route', () => {
    it('fails with 403 forbidden', async () => {
      const {
        kbnServer
      } = (0, _lib.getServices)();

      const defaultIndex = _lib.chance.word();

      const {
        statusCode,
        result
      } = await kbnServer.inject({
        method: 'POST',
        url: '/api/kibana/settings',
        payload: {
          changes: {
            defaultIndex
          }
        }
      });
      expect(statusCode).toBe(403);
      expect(result).toEqual({
        error: 'Forbidden',
        message: expect.stringContaining('index read-only'),
        statusCode: 403
      });
    });
  });
  describe('delete route', () => {
    it('fails with 403 forbidden', async () => {
      const {
        kbnServer
      } = (0, _lib.getServices)();
      const {
        statusCode,
        result
      } = await kbnServer.inject({
        method: 'DELETE',
        url: '/api/kibana/settings/defaultIndex'
      });
      expect(statusCode).toBe(403);
      expect(result).toEqual({
        error: 'Forbidden',
        message: expect.stringContaining('index read-only'),
        statusCode: 403
      });
    });
  });
};

exports.docMissingAndIndexReadOnlySuite = docMissingAndIndexReadOnlySuite;