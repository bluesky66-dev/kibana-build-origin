"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTemplate = getTemplate;
exports.generateMappings = generateMappings;
exports.generateTemplateName = generateTemplateName;
exports.generateTemplateIndexPattern = generateTemplateIndexPattern;
exports.getTemplatePriority = getTemplatePriority;
exports.generateESIndexPatterns = generateESIndexPatterns;
exports.updateCurrentWriteIndices = void 0;

var _index = require("../index");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const DEFAULT_SCALING_FACTOR = 1000;
const DEFAULT_IGNORE_ABOVE = 1024; // see discussion in https://github.com/elastic/kibana/issues/88307

const DEFAULT_TEMPLATE_PRIORITY = 200;
const DATASET_IS_PREFIX_TEMPLATE_PRIORITY = 150;
/**
 * getTemplate retrieves the default template but overwrites the index pattern with the given value.
 *
 * @param indexPattern String with the index pattern
 */

function getTemplate({
  type,
  templateIndexPattern,
  mappings,
  pipelineName,
  packageName,
  composedOfTemplates,
  templatePriority,
  ilmPolicy,
  hidden
}) {
  const template = getBaseTemplate(type, templateIndexPattern, mappings, packageName, composedOfTemplates, templatePriority, ilmPolicy, hidden);

  if (pipelineName) {
    template.template.settings.index.default_pipeline = pipelineName;
  }

  return template;
}
/**
 * Generate mapping takes the given nested fields array and creates the Elasticsearch
 * mapping properties out of it.
 *
 * This assumes that all fields with dotted.names have been expanded in a previous step.
 *
 * @param fields
 */


function generateMappings(fields) {
  const props = {}; // TODO: this can happen when the fields property in fields.yml is present but empty
  // Maybe validation should be moved to fields/field.ts

  if (fields) {
    fields.forEach(field => {
      // If type is not defined, assume keyword
      const type = field.type || 'keyword';
      let fieldProps = getDefaultProperties(field);

      switch (type) {
        case 'group':
          fieldProps = { ...generateMappings(field.fields),
            ...generateDynamicAndEnabled(field)
          };
          break;

        case 'group-nested':
          fieldProps = { ...generateMappings(field.fields),
            ...generateNestedProps(field),
            type: 'nested'
          };
          break;

        case 'integer':
          fieldProps.type = 'long';
          break;

        case 'scaled_float':
          fieldProps.type = 'scaled_float';
          fieldProps.scaling_factor = field.scaling_factor || DEFAULT_SCALING_FACTOR;
          break;

        case 'text':
          const textMapping = generateTextMapping(field);
          fieldProps = { ...fieldProps,
            ...textMapping,
            type: 'text'
          };

          if (field.multi_fields) {
            fieldProps.fields = generateMultiFields(field.multi_fields);
          }

          break;

        case 'keyword':
          const keywordMapping = generateKeywordMapping(field);
          fieldProps = { ...fieldProps,
            ...keywordMapping,
            type: 'keyword'
          };

          if (field.multi_fields) {
            fieldProps.fields = generateMultiFields(field.multi_fields);
          }

          break;

        case 'object':
          fieldProps = { ...fieldProps,
            ...generateDynamicAndEnabled(field),
            type: 'object'
          };
          break;

        case 'nested':
          fieldProps = { ...fieldProps,
            ...generateNestedProps(field),
            type: 'nested'
          };
          break;

        case 'array':
          // this assumes array fields were validated in an earlier step
          // adding an array field with no object_type would result in an error
          // when the template is added to ES
          if (field.object_type) {
            fieldProps.type = field.object_type;
          }

          break;

        case 'alias':
          // this assumes alias fields were validated in an earlier step
          // adding a path to a field that doesn't exist would result in an error
          // when the template is added to ES.
          fieldProps.type = 'alias';
          fieldProps.path = field.path;
          break;

        default:
          fieldProps.type = type;
      }

      props[field.name] = fieldProps;
    });
  }

  return {
    properties: props
  };
}

function generateDynamicAndEnabled(field) {
  const props = {};

  if (field.hasOwnProperty('enabled')) {
    props.enabled = field.enabled;
  }

  if (field.hasOwnProperty('dynamic')) {
    props.dynamic = field.dynamic;
  }

  return props;
}

function generateNestedProps(field) {
  const props = generateDynamicAndEnabled(field);

  if (field.hasOwnProperty('include_in_parent')) {
    props.include_in_parent = field.include_in_parent;
  }

  if (field.hasOwnProperty('include_in_root')) {
    props.include_in_root = field.include_in_root;
  }

  return props;
}

function generateMultiFields(fields) {
  const multiFields = {};

  if (fields) {
    fields.forEach(f => {
      const type = f.type;

      switch (type) {
        case 'text':
          multiFields[f.name] = { ...generateTextMapping(f),
            type: f.type
          };
          break;

        case 'keyword':
          multiFields[f.name] = { ...generateKeywordMapping(f),
            type: f.type
          };
          break;
      }
    });
  }

  return multiFields;
}

function generateKeywordMapping(field) {
  const mapping = {
    ignore_above: DEFAULT_IGNORE_ABOVE
  };

  if (field.ignore_above) {
    mapping.ignore_above = field.ignore_above;
  }

  if (field.normalizer) {
    mapping.normalizer = field.normalizer;
  }

  return mapping;
}

function generateTextMapping(field) {
  const mapping = {};

  if (field.analyzer) {
    mapping.analyzer = field.analyzer;
  }

  if (field.search_analyzer) {
    mapping.search_analyzer = field.search_analyzer;
  }

  return mapping;
}

function getDefaultProperties(field) {
  const properties = {};

  if (field.index) {
    properties.index = field.index;
  }

  if (field.doc_values) {
    properties.doc_values = field.doc_values;
  }

  if (field.copy_to) {
    properties.copy_to = field.copy_to;
  }

  return properties;
}
/**
 * Generates the template name out of the given information
 */


function generateTemplateName(dataStream) {
  return (0, _index.getRegistryDataStreamAssetBaseName)(dataStream);
}

function generateTemplateIndexPattern(dataStream) {
  // undefined or explicitly set to false
  // See also https://github.com/elastic/package-spec/pull/102
  if (!dataStream.dataset_is_prefix) {
    return (0, _index.getRegistryDataStreamAssetBaseName)(dataStream) + '-*';
  } else {
    return (0, _index.getRegistryDataStreamAssetBaseName)(dataStream) + '.*-*';
  }
} // Template priorities are discussed in https://github.com/elastic/kibana/issues/88307
// See also https://www.elastic.co/guide/en/elasticsearch/reference/current/index-templates.html
//
// Built-in templates like logs-*-* and metrics-*-* have priority 100
//
// EPM generated templates for data streams have priority 200 (DEFAULT_TEMPLATE_PRIORITY)
//
// EPM generated templates for data streams with dataset_is_prefix: true have priority 150 (DATASET_IS_PREFIX_TEMPLATE_PRIORITY)


function getTemplatePriority(dataStream) {
  // undefined or explicitly set to false
  // See also https://github.com/elastic/package-spec/pull/102
  if (!dataStream.dataset_is_prefix) {
    return DEFAULT_TEMPLATE_PRIORITY;
  } else {
    return DATASET_IS_PREFIX_TEMPLATE_PRIORITY;
  }
}
/**
 * Returns a map of the data stream path fields to elasticsearch index pattern.
 * @param dataStreams an array of RegistryDataStream objects
 */


function generateESIndexPatterns(dataStreams) {
  if (!dataStreams) {
    return {};
  }

  const patterns = {};

  for (const dataStream of dataStreams) {
    patterns[dataStream.path] = generateTemplateIndexPattern(dataStream);
  }

  return patterns;
}

function getBaseTemplate(type, templateIndexPattern, mappings, packageName, composedOfTemplates, templatePriority, ilmPolicy, hidden) {
  // Meta information to identify Ingest Manager's managed templates and indices
  const _meta = {
    package: {
      name: packageName
    },
    managed_by: 'ingest-manager',
    managed: true
  };
  return {
    priority: templatePriority,
    // To be completed with the correct index patterns
    index_patterns: [templateIndexPattern],
    template: {
      settings: {
        index: {
          // ILM Policy must be added here, for now point to the default global ILM policy name
          lifecycle: {
            name: ilmPolicy ? ilmPolicy : type
          },
          // What should be our default for the compression?
          codec: 'best_compression',
          // W
          mapping: {
            total_fields: {
              limit: '10000'
            }
          },
          // This is the default from Beats? So far seems to be a good value
          refresh_interval: '5s',
          // Default in the stack now, still good to have it in
          number_of_shards: '1',
          // All the default fields which should be queried have to be added here.
          // So far we add all keyword and text fields here.
          query: {
            default_field: ['message']
          },
          // We are setting 30 because it can be devided by several numbers. Useful when shrinking.
          number_of_routing_shards: '30'
        }
      },
      mappings: {
        // All the dynamic field mappings
        dynamic_templates: [// This makes sure all mappings are keywords by default
        {
          strings_as_keyword: {
            mapping: {
              ignore_above: 1024,
              type: 'keyword'
            },
            match_mapping_type: 'string'
          }
        }],
        // As we define fields ahead, we don't need any automatic field detection
        // This makes sure all the fields are mapped to keyword by default to prevent mapping conflicts
        date_detection: false,
        // All the properties we know from the fields.yml file
        properties: mappings.properties,
        _meta
      }
    },
    data_stream: {
      hidden
    },
    composed_of: composedOfTemplates,
    _meta
  };
}

const updateCurrentWriteIndices = async (callCluster, templates) => {
  if (!templates.length) return;
  const allIndices = await queryDataStreamsFromTemplates(callCluster, templates);
  if (!allIndices.length) return;
  return updateAllDataStreams(allIndices, callCluster);
};

exports.updateCurrentWriteIndices = updateCurrentWriteIndices;

function isCurrentDataStream(item) {
  return item !== undefined;
}

const queryDataStreamsFromTemplates = async (callCluster, templates) => {
  const dataStreamPromises = templates.map(template => {
    return getDataStreams(callCluster, template);
  });
  const dataStreamObjects = await Promise.all(dataStreamPromises);
  return dataStreamObjects.filter(isCurrentDataStream).flat();
};

const getDataStreams = async (callCluster, template) => {
  const {
    templateName,
    indexTemplate
  } = template;
  const res = await callCluster('transport.request', {
    method: 'GET',
    path: `/_data_stream/${templateName}-*`
  });
  const dataStreams = res.data_streams;
  if (!dataStreams.length) return;
  return dataStreams.map(dataStream => ({
    dataStreamName: dataStream.name,
    indexTemplate
  }));
};

const updateAllDataStreams = async (indexNameWithTemplates, callCluster) => {
  const updatedataStreamPromises = indexNameWithTemplates.map(({
    dataStreamName,
    indexTemplate
  }) => {
    return updateExistingDataStream({
      dataStreamName,
      callCluster,
      indexTemplate
    });
  });
  await Promise.all(updatedataStreamPromises);
};

const updateExistingDataStream = async ({
  dataStreamName,
  callCluster,
  indexTemplate
}) => {
  const {
    settings,
    mappings
  } = indexTemplate.template; // for now, remove from object so as not to update stream or data stream properties of the index until type and name
  // are added in https://github.com/elastic/kibana/issues/66551.  namespace value we will continue
  // to skip updating and assume the value in the index mapping is correct

  delete mappings.properties.stream;
  delete mappings.properties.data_stream; // try to update the mappings first

  try {
    await callCluster('indices.putMapping', {
      index: dataStreamName,
      body: mappings,
      write_index_only: true
    }); // if update fails, rollover data stream
  } catch (err) {
    try {
      const path = `/${dataStreamName}/_rollover`;
      await callCluster('transport.request', {
        method: 'POST',
        path
      });
    } catch (error) {
      throw new Error(`cannot rollover data stream ${error}`);
    }
  } // update settings after mappings was successful to ensure
  // pointing to the new pipeline is safe
  // for now, only update the pipeline


  if (!settings.index.default_pipeline) return;

  try {
    await callCluster('indices.putSettings', {
      index: dataStreamName,
      body: {
        index: {
          default_pipeline: settings.index.default_pipeline
        }
      }
    });
  } catch (err) {
    throw new Error(`could not update index template settings for ${dataStreamName}`);
  }
};