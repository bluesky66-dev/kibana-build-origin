"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CMTokensDomain = void 0;

var _crypto = require("crypto");

var _jsonwebtoken = require("jsonwebtoken");

var _lodash = require("lodash");

var _moment = _interopRequireDefault(require("moment"));

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

const RANDOM_TOKEN_1 = 'b48c4bda384a40cb91c6eb9b8849e77f';
const RANDOM_TOKEN_2 = '80a3819e3cd64f4399f1d4886be7a08b';

class CMTokensDomain {
  constructor(adapter, libs) {
    _defineProperty(this, "adapter", void 0);

    _defineProperty(this, "framework", void 0);

    this.adapter = adapter;
    this.framework = libs.framework;
  }

  async getEnrollmentToken(enrollmentToken) {
    const fullToken = await this.adapter.getEnrollmentToken(this.framework.internalUser, enrollmentToken);

    if (!fullToken) {
      return {
        token: null,
        expired: true,
        expires_on: null
      };
    }

    const {
      verified,
      expired
    } = this.verifyToken(enrollmentToken, fullToken.token || '', false);

    if (!verified) {
      return {
        expired,
        token: null,
        expires_on: null
      };
    }

    return { ...fullToken,
      expired
    };
  }

  async deleteEnrollmentToken(enrollmentToken) {
    return await this.adapter.deleteEnrollmentToken(this.framework.internalUser, enrollmentToken);
  }

  verifyToken(recivedToken, token2, decode = true) {
    let tokenDecoded = true;
    let expired = false;

    if (decode) {
      const enrollmentTokenSecret = this.framework.getConfig().encryptionKey;

      try {
        (0, _jsonwebtoken.verify)(recivedToken, enrollmentTokenSecret);
        tokenDecoded = true;
      } catch (err) {
        if (err.name === 'TokenExpiredError') {
          expired = true;
        }

        tokenDecoded = false;
      }
    }

    if (typeof recivedToken !== 'string' || typeof token2 !== 'string' || recivedToken.length !== token2.length) {
      // This prevents a more subtle timing attack where we know already the tokens aren't going to
      // match but still we don't return fast. Instead we compare two pre-generated random tokens using
      // the same comparison algorithm that we would use to compare two equal-length tokens.
      return {
        expired,
        verified: (0, _crypto.timingSafeEqual)(Buffer.from(RANDOM_TOKEN_1, 'utf8'), Buffer.from(RANDOM_TOKEN_2, 'utf8')) && tokenDecoded
      };
    }

    return {
      expired,
      verified: (0, _crypto.timingSafeEqual)(Buffer.from(recivedToken, 'utf8'), Buffer.from(token2, 'utf8')) && tokenDecoded
    };
  }

  generateAccessToken() {
    const enrollmentTokenSecret = this.framework.getConfig().encryptionKey;
    const tokenData = {
      created: (0, _moment.default)().toJSON(),
      randomHash: (0, _crypto.randomBytes)(26).toString()
    };
    return (0, _jsonwebtoken.sign)(tokenData, enrollmentTokenSecret);
  }

  async createEnrollmentTokens(user, numTokens = 1) {
    const tokens = [];
    const enrollmentTokensTtlInSeconds = this.framework.getConfig().enrollmentTokensTtlInSeconds;
    const enrollmentTokenExpiration = (0, _moment.default)().add(enrollmentTokensTtlInSeconds, 'seconds').toJSON();
    const enrollmentTokenSecret = this.framework.getConfig().encryptionKey;

    while (tokens.length < numTokens) {
      const tokenData = {
        created: (0, _moment.default)().toJSON(),
        expires: enrollmentTokenExpiration,
        randomHash: (0, _crypto.randomBytes)(26).toString()
      };
      tokens.push({
        expires_on: enrollmentTokenExpiration,
        token: (0, _jsonwebtoken.sign)(tokenData, enrollmentTokenSecret)
      });
    }

    await Promise.all((0, _lodash.chunk)(tokens, 100).map(tokenChunk => this.adapter.insertTokens(user, tokenChunk)));
    return tokens.map(token => token.token);
  }

}

exports.CMTokensDomain = CMTokensDomain;