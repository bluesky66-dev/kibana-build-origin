"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ElasticsearchTokensAdapter = void 0;

var _lodash = require("lodash");

var _constants = require("../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class ElasticsearchTokensAdapter {
  constructor(database) {
    this.database = database;
  }

  async deleteEnrollmentToken(user, enrollmentToken) {
    const params = {
      id: `enrollment_token:${enrollmentToken}`,
      index: _constants.INDEX_NAMES.BEATS
    };
    await this.database.delete(user, params);
  }

  async getEnrollmentToken(user, tokenString) {
    const params = {
      id: `enrollment_token:${tokenString}`,
      ignore: [404],
      index: _constants.INDEX_NAMES.BEATS
    };
    const response = await this.database.get(user, params);
    const tokenDetails = (0, _lodash.get)(response, '_source.enrollment_token', {
      expires_on: '0',
      token: null
    }); // Elasticsearch might return fast if the token is not found. OR it might return fast
    // if the token *is* found. Either way, an attacker could using a timing attack to figure
    // out whether a token is valid or not. So we introduce a random delay in returning from
    // this function to obscure the actual time it took for Elasticsearch to find the token.

    const randomDelayInMs = 25 + Math.round(Math.random() * 200); // between 25 and 225 ms

    return new Promise(resolve => setTimeout(() => resolve(tokenDetails), randomDelayInMs));
  }

  async insertTokens(user, tokens) {
    const body = (0, _lodash.flatten)(tokens.map(token => [{
      index: {
        _id: `enrollment_token:${token.token}`
      }
    }, {
      enrollment_token: token,
      type: 'enrollment_token'
    }]));
    const result = await this.database.bulk(user, {
      body,
      index: _constants.INDEX_NAMES.BEATS,
      refresh: 'wait_for'
    });

    if (result.errors) {
      throw new Error(result.items[0].result);
    }

    return tokens;
  }

}

exports.ElasticsearchTokensAdapter = ElasticsearchTokensAdapter;