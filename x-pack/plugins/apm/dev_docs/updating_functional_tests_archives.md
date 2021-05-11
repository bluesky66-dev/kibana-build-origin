### Updating functional tests archives

Some of our API tests use an archive generated by the [`esarchiver`](https://www.elastic.co/guide/en/kibana/current/development-functional-tests.html) script. Updating the main archive (`apm_8.0.0`) is a scripted process, where a 30m snapshot is downloaded from a cluster running the [APM Integration Testing server](https://github.com/elastic/apm-integration-testing). The script will copy the generated archives into the `fixtures/es_archiver` folders of our test suites (currently `basic` and `trial`). It will also generate a file that contains metadata about the archive, that can be imported to get the time range of the snapshot.

Usage:
`node x-pack/plugins/apm/scripts/create-functional-tests-archive --es-url=https://admin:changeme@localhost:9200 --kibana-url=https://localhost:5601`

