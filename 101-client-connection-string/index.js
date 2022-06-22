// ------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// ------------------------------------------------------------

// <package_dependencies> 
// Read .env file and set environment variables
require('dotenv').config();

// Use official mongodb driver to connect to the server
const { MongoClient } = require('mongodb');
// </package_dependencies>

// <client_credentials> 
// New instance of MongoClient with connection string
// for Cosmos DB
const url = process.env.COSMOS_CONNECTION_STRING;
const client = new MongoClient(url);

// connect to the server
await client.connect();

// client options
const options = client.options
console.log(`Options:\n${Object.keys(options).map(key => `\t${key}: ${options[key]}\n`)}`);
// </client_credentials>

// <client_disconnect>
// Close the db and its underlying connections
client.close();
// </client_disconnect>


/*
// <console_result>
Options:
Options:
        hosts: diberry-cosmos-mongodb.mongo.cosmos.azure.com:10255
,       metadata: [object Object]
,       credentials: [object Object]
,       compressors: none
,       connectTimeoutMS: 30000
,       directConnection: false
,       enableUtf8Validation: true
,       forceServerObjectId: false
,       heartbeatFrequencyMS: 10000
,       keepAlive: true
,       keepAliveInitialDelay: 120000
,       loadBalanced: false
,       localThresholdMS: 15
,       logger: [object Object]
,       maxConnecting: 2
,       maxIdleTimeMS: 120000
,       maxPoolSize: 100
,       minPoolSize: 0
,       minHeartbeatFrequencyMS: 500
,       monitorCommands: false
,       noDelay: true
,       pkFactory: [object Object]
,       raw: false
,       readPreference: [object Object]
,       replicaSet: globaldb
,       retryReads: true
,       retryWrites: false
,       serverSelectionTimeoutMS: 30000
,       socketTimeoutMS: 0
,       srvMaxHosts: 0
,       srvServiceName: mongodb
,       tls: true
,       waitQueueTimeoutMS: 0
,       zlibCompressionLevel: 0
,       dbName: test
,       userSpecifiedAuthSource: false
,       userSpecifiedReplicaSet: true
// </console_result>
*/
