"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPromises = exports.updatePrepackagedRules = exports.UPDATE_CHUNK_SIZE = void 0;

var _fp = require("lodash/fp");

var _patch_rules = require("./patch_rules");

var _read_rules = require("./read_rules");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * How many rules to update at a time is set to 50 from errors coming from
 * the slow environments such as cloud when the rule updates are > 100 we were
 * seeing timeout issues.
 *
 * Since there is not timeout options at the alerting API level right now, we are
 * at the mercy of the Elasticsearch server client/server default timeouts and what
 * we are doing could be considered a workaround to not being able to increase the timeouts.
 *
 * However, other bad effects and saturation of connections beyond 50 makes this a "noisy neighbor"
 * if we don't limit its number of connections as we increase the number of rules that can be
 * installed at a time.
 *
 * Lastly, we saw weird issues where Chrome on upstream 408 timeouts will re-call the REST route
 * which in turn could create additional connections we want to avoid.
 *
 * See file import_rules_route.ts for another area where 50 was chosen, therefore I chose
 * 50 here to mimic it as well. If you see this re-opened or what similar to it, consider
 * reducing the 50 above to a lower number.
 *
 * See the original ticket here:
 * https://github.com/elastic/kibana/issues/94418
 */


const UPDATE_CHUNK_SIZE = 50;
/**
 * Updates the prepackaged rules given a set of rules and output index.
 * This implements a chunked approach to not saturate network connections and
 * avoid being a "noisy neighbor".
 * @param alertsClient Alerting client
 * @param savedObjectsClient Saved object client
 * @param rules The rules to apply the update for
 * @param outputIndex The output index to apply the update to.
 */

exports.UPDATE_CHUNK_SIZE = UPDATE_CHUNK_SIZE;

const updatePrepackagedRules = async (alertsClient, savedObjectsClient, rules, outputIndex) => {
  const ruleChunks = (0, _fp.chunk)(UPDATE_CHUNK_SIZE, rules);

  for (const ruleChunk of ruleChunks) {
    const rulePromises = createPromises(alertsClient, savedObjectsClient, ruleChunk, outputIndex);
    await Promise.all(rulePromises);
  }
};
/**
 * Creates promises of the rules and returns them.
 * @param alertsClient Alerting client
 * @param savedObjectsClient Saved object client
 * @param rules The rules to apply the update for
 * @param outputIndex The output index to apply the update to.
 * @returns Promise of what was updated.
 */


exports.updatePrepackagedRules = updatePrepackagedRules;

const createPromises = (alertsClient, savedObjectsClient, rules, outputIndex) => {
  return rules.map(async rule => {
    const {
      author,
      building_block_type: buildingBlockType,
      description,
      event_category_override: eventCategoryOverride,
      false_positives: falsePositives,
      from,
      query,
      language,
      license,
      saved_id: savedId,
      meta,
      filters: filtersObject,
      rule_id: ruleId,
      index,
      interval,
      max_signals: maxSignals,
      risk_score: riskScore,
      risk_score_mapping: riskScoreMapping,
      rule_name_override: ruleNameOverride,
      name,
      severity,
      severity_mapping: severityMapping,
      tags,
      to,
      type,
      threat,
      threshold,
      threat_filters: threatFilters,
      threat_index: threatIndex,
      threat_query: threatQuery,
      threat_mapping: threatMapping,
      threat_language: threatLanguage,
      concurrent_searches: concurrentSearches,
      items_per_search: itemsPerSearch,
      timestamp_override: timestampOverride,
      references,
      version,
      note,
      anomaly_threshold: anomalyThreshold,
      timeline_id: timelineId,
      timeline_title: timelineTitle,
      machine_learning_job_id: machineLearningJobId,
      exceptions_list: exceptionsList
    } = rule;
    const existingRule = await (0, _read_rules.readRules)({
      alertsClient,
      ruleId,
      id: undefined
    }); // TODO: Fix these either with an is conversion or by better typing them within io-ts

    const filters = filtersObject; // Note: we do not pass down enabled as we do not want to suddenly disable
    // or enable rules on the user when they were not expecting it if a rule updates

    return (0, _patch_rules.patchRules)({
      alertsClient,
      author,
      buildingBlockType,
      description,
      eventCategoryOverride,
      falsePositives,
      from,
      query,
      language,
      license,
      outputIndex,
      rule: existingRule,
      savedId,
      savedObjectsClient,
      meta,
      filters,
      index,
      interval,
      maxSignals,
      riskScore,
      riskScoreMapping,
      ruleNameOverride,
      name,
      severity,
      severityMapping,
      tags,
      timestampOverride,
      to,
      type,
      threat,
      threshold,
      threatFilters,
      threatIndex,
      threatQuery,
      threatMapping,
      threatLanguage,
      concurrentSearches,
      itemsPerSearch,
      references,
      version,
      note,
      anomalyThreshold,
      enabled: undefined,
      timelineId,
      timelineTitle,
      machineLearningJobId,
      exceptionsList,
      actions: undefined
    });
  });
};

exports.createPromises = createPromises;