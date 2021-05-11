"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Tokens = void 0;

var _errors = require("../errors");

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
 * Class responsible for managing access and refresh tokens (refresh, invalidate, etc.) used by
 * various authentication providers.
 */


class Tokens {
  /**
   * Logger instance bound to `tokens` context.
   */
  constructor(options) {
    this.options = options;

    _defineProperty(this, "logger", void 0);

    this.logger = options.logger;
  }
  /**
   * Tries to exchange provided refresh token to a new pair of access and refresh tokens.
   * @param existingRefreshToken Refresh token to send to the refresh token API.
   */


  async refresh(existingRefreshToken) {
    try {
      // Token should be refreshed by the same user that obtained that token.
      const {
        access_token: accessToken,
        refresh_token: refreshToken,
        authentication: authenticationInfo
      } = (await this.options.client.security.getToken({
        body: {
          grant_type: 'refresh_token',
          refresh_token: existingRefreshToken
        }
      })).body;
      this.logger.debug('Access token has been successfully refreshed.');
      return {
        accessToken,
        refreshToken,
        authenticationInfo
      };
    } catch (err) {
      this.logger.debug(`Failed to refresh access token: ${err.message}`); // There are at least two common cases when refresh token request can fail:
      // 1. Refresh token is valid only for 24 hours and if it hasn't been used it expires.
      //
      // 2. Refresh token is one-time use token and if it has been used already, it is treated in the same way as
      // expired token. Even though it's an edge case, there are several perfectly valid scenarios when it can
      // happen. E.g. when several simultaneous AJAX request has been sent to Kibana, but access token has expired
      // already, so the first request that reaches Kibana uses refresh token to get a new access token, but the
      // second concurrent request has no idea about that and tries to refresh access token as well. All ends well
      // when first request refreshes access token and updates session cookie with fresh access/refresh token pair.
      // But if user navigates to another page _before_ AJAX request (the one that triggered token refresh) responds
      // with updated cookie, then user will have only that old cookie with expired access token and refresh token
      // that has been used already.
      //
      // Even though the issue is solved to large extent by a predefined 60s window during which ES allows to use the
      // same refresh token multiple times yielding the same refreshed access/refresh token pair it's still possible
      // to hit the case when refresh token is no longer valid.

      if ((0, _errors.getErrorStatusCode)(err) === 400) {
        this.logger.debug('Refresh token is either expired or already used.');
        return null;
      }

      throw err;
    }
  }
  /**
   * Tries to invalidate provided access and refresh token pair. At least one of the tokens should
   * be specified.
   * @param [accessToken] Optional access token to invalidate.
   * @param [refreshToken] Optional refresh token to invalidate.
   */


  async invalidate({
    accessToken,
    refreshToken
  }) {
    this.logger.debug('Invalidating access/refresh token pair.');
    let invalidationError;

    if (refreshToken) {
      let invalidatedTokensCount;

      try {
        invalidatedTokensCount = (await this.options.client.security.invalidateToken({
          body: {
            refresh_token: refreshToken
          }
        })).body.invalidated_tokens;
      } catch (err) {
        var _err$body;

        this.logger.debug(`Failed to invalidate refresh token: ${err.message}`); // When using already deleted refresh token, Elasticsearch responds with 404 and a body that
        // shows that no tokens were invalidated.

        if ((0, _errors.getErrorStatusCode)(err) === 404 && ((_err$body = err.body) === null || _err$body === void 0 ? void 0 : _err$body.invalidated_tokens) === 0) {
          invalidatedTokensCount = err.body.invalidated_tokens;
        } else {
          // We don't re-throw the error here to have a chance to invalidate access token if it's provided.
          invalidationError = err;
        }
      }

      if (invalidatedTokensCount === 0) {
        this.logger.debug('Refresh token was already invalidated.');
      } else if (invalidatedTokensCount === 1) {
        this.logger.debug('Refresh token has been successfully invalidated.');
      } else if (invalidatedTokensCount > 1) {
        this.logger.debug(`${invalidatedTokensCount} refresh tokens were invalidated, this is unexpected.`);
      }
    }

    if (accessToken) {
      let invalidatedTokensCount;

      try {
        invalidatedTokensCount = (await this.options.client.security.invalidateToken({
          body: {
            token: accessToken
          }
        })).body.invalidated_tokens;
      } catch (err) {
        var _err$body2;

        this.logger.debug(`Failed to invalidate access token: ${err.message}`); // When using already deleted access token, Elasticsearch responds with 404 and a body that
        // shows that no tokens were invalidated.

        if ((0, _errors.getErrorStatusCode)(err) === 404 && ((_err$body2 = err.body) === null || _err$body2 === void 0 ? void 0 : _err$body2.invalidated_tokens) === 0) {
          invalidatedTokensCount = err.body.invalidated_tokens;
        } else {
          invalidationError = err;
        }
      }

      if (invalidatedTokensCount === 0) {
        this.logger.debug('Access token was already invalidated.');
      } else if (invalidatedTokensCount === 1) {
        this.logger.debug('Access token has been successfully invalidated.');
      } else if (invalidatedTokensCount > 1) {
        this.logger.debug(`${invalidatedTokensCount} access tokens were invalidated, this is unexpected.`);
      }
    }

    if (invalidationError) {
      throw invalidationError;
    }
  }
  /**
   * Tries to determine whether specified error that occurred while trying to authenticate request
   * using access token happened because access token is expired. We treat all `401 Unauthorized`
   * as such.
   * @param err Error returned from Elasticsearch.
   */


  static isAccessTokenExpiredError(err) {
    return (0, _errors.getErrorStatusCode)(err) === 401;
  }

}

exports.Tokens = Tokens;