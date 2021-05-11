"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SharedGlobalConfigKeys = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Dedicated type for plugin configuration schema.
 *
 * @public
 */

/**
 * Describes a plugin configuration properties.
 *
 * @example
 * ```typescript
 * // my_plugin/server/index.ts
 * import { schema, TypeOf } from '@kbn/config-schema';
 * import { PluginConfigDescriptor } from 'kibana/server';
 *
 * const configSchema = schema.object({
 *   secret: schema.string({ defaultValue: 'Only on server' }),
 *   uiProp: schema.string({ defaultValue: 'Accessible from client' }),
 * });
 *
 * type ConfigType = TypeOf<typeof configSchema>;
 *
 * export const config: PluginConfigDescriptor<ConfigType> = {
 *   exposeToBrowser: {
 *     uiProp: true,
 *   },
 *   schema: configSchema,
 *   deprecations: ({ rename, unused }) => [
 *     rename('securityKey', 'secret'),
 *     unused('deprecatedProperty'),
 *   ],
 * };
 * ```
 *
 * @public
 */

/**
 * Dedicated type for plugin name/id that is supposed to make Map/Set/Arrays
 * that use it as a key or value more obvious.
 *
 * @public
 */

/** @public */

/** @internal */

/**
 * Describes the set of required and optional properties plugin can define in its
 * mandatory JSON manifest file.
 *
 * @remarks
 * Should never be used in code outside of Core but is exported for
 * documentation purposes.
 *
 * @public
 */

/**
 * Small container object used to expose information about discovered plugins that may
 * or may not have been started.
 * @public
 */

/**
 * @internal
 */

/**
 * The interface that should be returned by a `PluginInitializer`.
 *
 * @public
 */

/**
 * A plugin with asynchronous lifecycle methods.
 *
 * @deprecated Asynchronous lifecycles are deprecated, and should be migrated to sync {@link Plugin | plugin}
 * @public
 */
const SharedGlobalConfigKeys = {
  // We can add more if really needed
  kibana: ['index', 'autocompleteTerminateAfter', 'autocompleteTimeout'],
  elasticsearch: ['shardTimeout', 'requestTimeout', 'pingTimeout'],
  path: ['data'],
  savedObjects: ['maxImportPayloadBytes']
};
/**
 * @public
 */

exports.SharedGlobalConfigKeys = SharedGlobalConfigKeys;