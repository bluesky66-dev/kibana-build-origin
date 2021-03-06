"use strict";

var _chance = _interopRequireDefault(require("chance"));

var _request = _interopRequireDefault(require("request"));

var _v = _interopRequireDefault(require("uuid/v4"));

var _config_schemas = require("../common/config_schemas");

var _scripts = require("../public/lib/compose/scripts");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-ignore


const args = process.argv.slice(2);
const chance = new _chance.default();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';

  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  return color;
}

const enroll = async (kibanaURL, token) => {
  const beatId = (0, _v.default)();
  await (0, _request.default)({
    url: `${kibanaURL}/api/beats/agent/${beatId}`,
    method: 'POST',
    headers: {
      'kbn-xsrf': 'xxx',
      'kbn-beats-enrollment-token': token
    },
    body: JSON.stringify({
      type: Math.random() >= 0.5 ? 'filebeat' : 'metricbeat',
      host_name: `${chance.word()}.local`,
      name: chance.word(),
      version: '6.7.0'
    })
  }, (error, response, body) => {
    const res = JSON.parse(body);

    if (res.message) {
      // eslint-disable-next-line
      console.log(res.message);
    }
  });
};

const start = async (kibanaURL, numberOfBeats = 10, maxNumberOfTagsPerBeat = 2, maxNumberOfConfigsPerTag = 4) => {
  try {
    const libs = (0, _scripts.compose)(kibanaURL); // eslint-disable-next-line

    console.error(`Enrolling ${numberOfBeats} fake beats...`);
    const enrollmentTokens = await libs.tokens.createEnrollmentTokens(numberOfBeats);
    process.stdout.write(`enrolling fake beats... 0 of ${numberOfBeats}`);
    let count = 0;

    for (const token of enrollmentTokens) {
      count++; // @ts-ignore

      process.stdout.clearLine(); // @ts-ignore

      process.stdout.cursorTo(0);
      process.stdout.write(`enrolling fake beats... ${count} of ${numberOfBeats}`);
      await enroll(kibanaURL, token);
      await sleep(10);
    }

    process.stdout.write('\n');
    await sleep(2000); // eslint-disable-next-line

    console.error(`${numberOfBeats} fake beats are enrolled`);
    const beats = await libs.beats.getAll(); // eslint-disable-next-line

    console.error(`Creating tags, configs, and assigning them...`);
    process.stdout.write(`creating tags/configs for beat... 0 of ${numberOfBeats}`);
    count = 0;

    for (const beat of beats) {
      count++; // @ts-ignore

      process.stdout.clearLine(); // @ts-ignore

      process.stdout.cursorTo(0);
      process.stdout.write(`creating tags w/configs for beat... ${count} of ${numberOfBeats}`);
      const tags = await Promise.all([...Array(maxNumberOfTagsPerBeat)].map(() => {
        return libs.tags.upsertTag({
          name: chance.word(),
          color: getRandomColor(),
          hasConfigurationBlocksTypes: []
        });
      }));
      await libs.beats.assignTagsToBeats(tags.map(tag => ({
        beatId: beat.id,
        tag: tag.id
      })));
      await Promise.all(tags.map(tag => {
        return libs.configBlocks.upsert([...Array(maxNumberOfConfigsPerTag)].map(() => ({
          type: _config_schemas.configBlockSchemas[Math.floor(Math.random())].id,
          description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sint ista Graecorum;
Nihil ad rem! Ne sit sane; Quod quidem nobis non saepe contingit.
Duo Reges: constructio interrete. Itaque his sapiens semper vacabit.`.substring(0, Math.floor(Math.random() * (0 - 115 + 1))),
          tag: tag.id,
          last_updated: new Date(),
          config: {}
        })));
      }));
    }
  } catch (e) {
    if (e.response && e.response.data && e.response.message) {
      // eslint-disable-next-line
      console.error(e.response.data.message);
    } else if (e.response && e.response.data && e.response.reason) {
      // eslint-disable-next-line
      console.error(e.response.data.reason);
    } else if (e.code) {
      // eslint-disable-next-line
      console.error(e.code);
    } else {
      // eslint-disable-next-line
      console.error(e);
    }
  }
}; // @ts-ignore


start(...args);