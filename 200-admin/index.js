// ------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// ------------------------------------------------------------

// <package_dependencies> 
// Read .env file and set environment variables
require('dotenv').config();

// Use official mongodb driver to connect to the server
const { MongoClient, ObjectId } = require('mongodb');
// </package_dependencies>

// <client_credentials> 
// New instance of MongoClient with connection string
// for Cosmos DB
const url = process.env.COSMOS_CONNECTION_STRING;
const client = new MongoClient(url);
// </client_credentials>

async function main() {

  // <connect_client>
  // Use connect method to connect to the server
  await client.connect();
  // </connect_client>

  // <server_info> 
  // Get server build info
  const serverInfo = await client.db().admin().serverInfo();
  console.log(`Server info:\n${Object.keys(serverInfo).map(key => `\t${key}: ${serverInfo[key]}\n`)}`);

  // Get server status
  const serverStatus = await client.db().admin().serverStatus();
  console.log(`Server status:\n${Object.keys(serverStatus).map(key => `\t${key}: ${serverStatus[key]}\n`)}`);

  // List all databases
  const dbListResult = await client.db().admin().listDatabases();
  console.log(`Databases:\n${dbListResult.databases.map(db => `\t${db.name}\n`)}`);
  // </server_info>

  return "done";
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());
