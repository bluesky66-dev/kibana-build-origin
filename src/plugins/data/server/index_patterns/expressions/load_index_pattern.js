"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFunctionDefinition = getFunctionDefinition;
exports.getIndexPatternLoad = getIndexPatternLoad;

var _i18n = require("@kbn/i18n");

var _expressions = require("../../../common/index_patterns/expressions");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Returns the expression function definition. Any stateful dependencies are accessed
 * at runtime via the `getStartDependencies` param, which provides the specific services
 * needed for this function to run.
 *
 * This function is an implementation detail of this module, and is exported separately
 * only for testing purposes.
 *
 * @param getStartDependencies - async function that resolves with IndexPatternLoadStartDependencies
 *
 * @internal
 */
function getFunctionDefinition({
  getStartDependencies
}) {
  return () => ({ ...(0, _expressions.getIndexPatternLoadMeta)(),

    async fn(input, args, {
      getKibanaRequest
    }) {
      const kibanaRequest = getKibanaRequest ? getKibanaRequest() : null;

      if (!kibanaRequest) {
        throw new Error(_i18n.i18n.translate('data.indexPatterns.indexPatternLoad.error.kibanaRequest', {
          defaultMessage: 'A KibanaRequest is required to execute this search on the server. ' + 'Please provide a request object to the expression execution params.'
        }));
      }

      const {
        indexPatterns
      } = await getStartDependencies(kibanaRequest);
      const indexPattern = await indexPatterns.get(args.id);
      return {
        type: 'index_pattern',
        value: indexPattern.toSpec()
      };
    }

  });
}
/**
 * This is some glue code that takes in `core.getStartServices`, extracts the dependencies
 * needed for this function, and wraps them behind a `getStartDependencies` function that
 * is then called at runtime.
 *
 * We do this so that we can be explicit about exactly which dependencies the function
 * requires, without cluttering up the top-level `plugin.ts` with this logic. It also
 * makes testing the expression function a bit easier since `getStartDependencies` is
 * the only thing you should need to mock.
 *
 * @param getStartServices - core's StartServicesAccessor for this plugin
 *
 * @internal
 */


function getIndexPatternLoad({
  getStartServices
}) {
  return getFunctionDefinition({
    getStartDependencies: async request => {
      const [{
        elasticsearch,
        savedObjects
      },, {
        indexPatterns
      }] = await getStartServices();
      return {
        indexPatterns: await indexPatterns.indexPatternsServiceFactory(savedObjects.getScopedClient(request), elasticsearch.client.asScoped(request).asCurrentUser)
      };
    }
  });
}