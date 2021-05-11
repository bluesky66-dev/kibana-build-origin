"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PKIAuthenticationProvider = void 0;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _authentication_result = require("../authentication_result");

var _deauthentication_result = require("../deauthentication_result");

var _http_authentication = require("../http_authentication");

var _can_redirect_request = require("../can_redirect_request");

var _tokens = require("../tokens");

var _base = require("./base");

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
/**
 * List of protocols that can be renegotiated. Notably, TLSv1.3 is absent from this list, because it does not support renegotiation.
 */


const RENEGOTIATABLE_PROTOCOLS = ['TLSv1', 'TLSv1.1', 'TLSv1.2'];
/**
 * Checks whether current request can initiate new session.
 * @param request Request instance.
 */

function canStartNewSession(request) {
  // We should try to establish new session only if request requires authentication and it's not an XHR request.
  // Technically we can authenticate XHR requests too, but we don't want these to create a new session unintentionally.
  return (0, _can_redirect_request.canRedirectRequest)(request) && request.route.options.authRequired === true;
}
/**
 * Returns a stringified version of a certificate, including metadata
 * @param peerCertificate DetailedPeerCertificate instance.
 */


function stringifyCertificate(peerCertificate) {
  const {
    subject,
    issuer,
    issuerCertificate,
    subjectaltname,
    valid_from: validFrom,
    valid_to: validTo
  } = peerCertificate; // The issuerCertificate field can be three different values:
  //  * Object: In this case, the issuer certificate is an object
  //  * null: In this case, the issuer certificate is a null value; this should not happen according to the type definition but historically there was code in place to account for this
  //  * undefined: The issuer certificate chain is broken; this should not happen according to the type definition but we have observed this edge case behavior with certain client/server configurations
  // This distinction can be useful for troubleshooting mutual TLS connection problems, so we include it in the stringified certificate that is printed to the debug logs.
  // There are situations where a partial client certificate chain is accepted by Node, but we cannot verify the chain in Kibana because an intermediate issuerCertificate is undefined.
  // If this happens, Kibana will reject the authentication attempt, and the client and/or server need to ensure that the entire CA chain is installed.

  let issuerCertType;

  if (issuerCertificate === undefined) {
    issuerCertType = 'undefined';
  } else if (issuerCertificate === null) {
    issuerCertType = 'null';
  } else {
    issuerCertType = 'object';
  }

  return JSON.stringify({
    subject,
    issuer,
    issuerCertType,
    subjectaltname,
    validFrom,
    validTo
  });
}
/**
 * Provider that supports PKI request authentication.
 */


class PKIAuthenticationProvider extends _base.BaseAuthenticationProvider {
  /**
   * Type of the provider.
   */

  /**
   * Performs initial login request.
   * @param request Request instance.
   */
  async login(request) {
    this.logger.debug('Trying to perform a login.');
    return await this.authenticateViaPeerCertificate(request);
  }
  /**
   * Performs PKI request authentication.
   * @param request Request instance.
   * @param [state] Optional state object associated with the provider.
   */


  async authenticate(request, state) {
    this.logger.debug(`Trying to authenticate user request to ${request.url.pathname}${request.url.search}.`);

    if (_http_authentication.HTTPAuthorizationHeader.parseFromRequest(request) != null) {
      this.logger.debug('Cannot authenticate requests with `Authorization` header.');
      return _authentication_result.AuthenticationResult.notHandled();
    }

    let authenticationResult = _authentication_result.AuthenticationResult.notHandled();

    if (state) {
      authenticationResult = await this.authenticateViaState(request, state); // If access token expired or doesn't match to the certificate fingerprint we should try to get
      // a new one in exchange to peer certificate chain. Since we know that we had a valid session
      // before we can safely assume that it's desired to automatically re-create session even for XHR
      // requests.

      const invalidAccessToken = authenticationResult.notHandled() || authenticationResult.failed() && _tokens.Tokens.isAccessTokenExpiredError(authenticationResult.error);

      if (invalidAccessToken) {
        authenticationResult = await this.authenticateViaPeerCertificate(request); // If we have an active session that we couldn't use to authenticate user and at the same time
        // we couldn't use peer's certificate to establish a new one, then we should respond with 401
        // and force authenticator to clear the session.

        if (authenticationResult.notHandled()) {
          return _authentication_result.AuthenticationResult.failed(_boom.default.unauthorized());
        }
      }
    } // If we couldn't authenticate by means of all methods above, let's check if the request is allowed
    // to start a new session, and if so try to authenticate request using its peer certificate chain,
    // otherwise just return authentication result we have.


    return authenticationResult.notHandled() && canStartNewSession(request) ? await this.authenticateViaPeerCertificate(request) : authenticationResult;
  }
  /**
   * Invalidates access token retrieved in exchange for peer certificate chain if it exists.
   * @param request Request instance.
   * @param state State value previously stored by the provider.
   */


  async logout(request, state) {
    this.logger.debug(`Trying to log user out via ${request.url.pathname}${request.url.search}.`); // Having a `null` state means that provider was specifically called to do a logout, but when
    // session isn't defined then provider is just being probed whether or not it can perform logout.

    if (state === undefined) {
      this.logger.debug('There is no access token to invalidate.');
      return _deauthentication_result.DeauthenticationResult.notHandled();
    }

    if (state) {
      try {
        await this.options.tokens.invalidate({
          accessToken: state.accessToken
        });
      } catch (err) {
        this.logger.debug(`Failed invalidating access token: ${err.message}`);
        return _deauthentication_result.DeauthenticationResult.failed(err);
      }
    }

    return _deauthentication_result.DeauthenticationResult.redirectTo(this.options.urls.loggedOut(request));
  }
  /**
   * Returns HTTP authentication scheme (`Bearer`) that's used within `Authorization` HTTP header
   * that provider attaches to all successfully authenticated requests to Elasticsearch.
   */


  getHTTPAuthenticationScheme() {
    return 'bearer';
  }
  /**
   * Tries to extract access token from state and adds it to the request before it's
   * forwarded to Elasticsearch backend.
   * @param request Request instance.
   * @param state State value previously stored by the provider.
   */


  async authenticateViaState(request, {
    accessToken,
    peerCertificateFingerprint256
  }) {
    this.logger.debug('Trying to authenticate via state.'); // If peer is authorized, but its certificate isn't available, that likely means the connection
    // with the peer is closed already. We shouldn't invalidate peer's access token in this case
    // since we cannot guarantee that there is a mismatch in access token and peer certificate.

    const peerCertificate = request.socket.getPeerCertificate(true);

    if (peerCertificate === null && request.socket.authorized) {
      this.logger.debug('Cannot validate state access token with the peer certificate since it is not available.');
      return _authentication_result.AuthenticationResult.failed(new Error('Peer certificate is not available'));
    }

    if (!request.socket.authorized || peerCertificate === null || peerCertificate.fingerprint256 !== peerCertificateFingerprint256) {
      this.logger.debug('Peer certificate is not present or its fingerprint does not match to the one associated with the access token. Invalidating access token...');

      try {
        await this.options.tokens.invalidate({
          accessToken
        });
      } catch (err) {
        this.logger.debug(`Failed to invalidate access token: ${err.message}`);
        return _authentication_result.AuthenticationResult.failed(err);
      } // Return "Not Handled" result to allow provider to try to exchange new peer certificate chain
      // to the new access token down the line.


      return _authentication_result.AuthenticationResult.notHandled();
    }

    try {
      const authHeaders = {
        authorization: new _http_authentication.HTTPAuthorizationHeader('Bearer', accessToken).toString()
      };
      const user = await this.getUser(request, authHeaders);
      this.logger.debug('Request has been authenticated via state.');
      return _authentication_result.AuthenticationResult.succeeded(user, {
        authHeaders
      });
    } catch (err) {
      this.logger.debug(`Failed to authenticate request via state: ${err.message}`);
      return _authentication_result.AuthenticationResult.failed(err);
    }
  }
  /**
   * Tries to exchange peer certificate chain to access/refresh token pair.
   * @param request Request instance.
   */


  async authenticateViaPeerCertificate(request) {
    this.logger.debug('Trying to authenticate request via peer certificate chain.'); // We should collect entire certificate chain as an ordered array of certificates encoded as base64 strings.

    const {
      peerCertificate,
      certificateChain,
      isChainIncomplete
    } = await this.getCertificateChain(request);

    if (!request.socket.authorized) {
      this.logger.debug(`Authentication is not possible since peer certificate was not authorized: ${request.socket.authorizationError}.`);
      return _authentication_result.AuthenticationResult.notHandled();
    }

    if (peerCertificate === null) {
      this.logger.debug('Authentication is not possible due to missing peer certificate chain.');
      return _authentication_result.AuthenticationResult.notHandled();
    }

    if (isChainIncomplete) {
      this.logger.debug('Authentication is not possible due to incomplete peer certificate chain.');
      return _authentication_result.AuthenticationResult.notHandled();
    }

    let result;

    try {
      // We can replace generic `transport.request` with a dedicated API method call once
      // https://github.com/elastic/elasticsearch/issues/67189 is resolved.
      result = (await this.options.client.asInternalUser.transport.request({
        method: 'POST',
        path: '/_security/delegate_pki',
        body: {
          x509_certificate_chain: certificateChain
        }
      })).body;
    } catch (err) {
      this.logger.debug(`Failed to exchange peer certificate chain to an access token: ${err.message}`);
      return _authentication_result.AuthenticationResult.failed(err);
    }

    this.logger.debug('Successfully retrieved access token in exchange to peer certificate chain.');
    return _authentication_result.AuthenticationResult.succeeded(this.authenticationInfoToAuthenticatedUser(result.authentication), {
      authHeaders: {
        authorization: new _http_authentication.HTTPAuthorizationHeader('Bearer', result.access_token).toString()
      },
      state: {
        accessToken: result.access_token,
        peerCertificateFingerprint256: peerCertificate.fingerprint256
      }
    });
  }
  /**
   * Obtains the peer certificate chain as an ordered array of base64-encoded (Section 4 of RFC4648 - not base64url-encoded)
   * DER PKIX certificate values. Starts from the leaf peer certificate and iterates up to the top-most available certificate
   * authority using `issuerCertificate` certificate property. THe iteration is stopped only when we detect circular reference
   * (root/self-signed certificate) or when `issuerCertificate` isn't available (null or empty object). Automatically attempts to
   * renegotiate the TLS connection once if the peer certificate chain is incomplete.
   * @param request Request instance.
   */


  async getCertificateChain(request, isRenegotiated = false) {
    const certificateChain = [];
    const certificateStrings = [];
    let isChainIncomplete = false;
    const peerCertificate = request.socket.getPeerCertificate(true);
    let certificate = peerCertificate;

    while (certificate && Object.keys(certificate).length > 0) {
      certificateChain.push(certificate.raw.toString('base64'));
      certificateStrings.push(stringifyCertificate(certificate)); // For self-signed certificates, `issuerCertificate` may be a circular reference.

      if (certificate === certificate.issuerCertificate) {
        this.logger.debug('Self-signed certificate is detected in certificate chain');
        break;
      } else if (certificate.issuerCertificate === undefined) {
        const protocol = request.socket.getProtocol();

        if (!isRenegotiated && protocol && RENEGOTIATABLE_PROTOCOLS.includes(protocol)) {
          this.logger.debug(`Detected incomplete certificate chain with protocol '${protocol}', attempting to renegotiate connection.`);

          try {
            await request.socket.renegotiate({
              requestCert: true,
              rejectUnauthorized: false
            });
            return this.getCertificateChain(request, true);
          } catch (err) {
            this.logger.debug(`Failed to renegotiate connection: ${err}.`);
          }
        } else if (!isRenegotiated) {
          this.logger.debug(`Detected incomplete certificate chain with protocol '${protocol}', cannot renegotiate connection.`);
        } else {
          this.logger.debug(`Detected incomplete certificate chain after renegotiation.`);
        } // The chain is only considered to be incomplete if one or more issuerCertificate values is undefined;
        // this is not an expected return value from Node, but it can happen in some edge cases


        isChainIncomplete = true;
        break;
      } else {
        // Repeat the loop
        certificate = certificate.issuerCertificate;
      }
    }

    this.logger.debug(`Peer certificate chain: [${certificateStrings.join(', ')}]`);
    return {
      peerCertificate,
      certificateChain,
      isChainIncomplete
    };
  }

}

exports.PKIAuthenticationProvider = PKIAuthenticationProvider;

_defineProperty(PKIAuthenticationProvider, "type", 'pki');