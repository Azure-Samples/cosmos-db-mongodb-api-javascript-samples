// ------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// ------------------------------------------------------------

import dotenv from 'dotenv';
import path from 'path';
const __dirname = path.resolve();

dotenv.config({ path: path.resolve(__dirname, '../.env') });

// <package_dependencies>

// Use official mongodb driver to connect to the server
import { MongoClient } from 'mongodb';
// </package_dependencies>

// <client_credentials>
// New instance of MongoClient with connection string
// for Cosmos DB
const url = process.env.AZURE_COSMOS_DB_MONGODB_CONNECTION_STRING;
const client = new MongoClient(url);
// </client_credentials>

export async function main() {
  // <connect_client>
  // Use connect method to connect to the server
  await client.connect();
  // </connect_client>

  // <server_info>
  // Get server build info
  const serverInfo = await client.db().admin().serverInfo();
  console.log(
    `Server info:\n${Object.keys(serverInfo).map(key => `\t${key}: ${serverInfo[key]}\n`)}`
  );

  // Get server status
  // Not supported in vCore
  // const serverStatus = await client.db().admin().serverStatus();
  // console.log(
  //   `Server status:\n${Object.keys(serverStatus).map(key => `\t${key}: ${serverStatus[key]}\n`)}`
  // );

  // List all databases
  const dbListResult = await client.db().admin().listDatabases();
  console.log(
    `Databases:\n${dbListResult.databases.map(db => `\t${db.name}\n`)}`
  );
  // </server_info>

  return 'done';
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => {
    // Close the db and its underlying connections
    client.close();
  });

/*
// <console_result>
Server info:
        version: 4.0.0
,       versionArray: 4,0,0,0
,       bits: 64
,       maxBsonObjectSize: 16777216
,       ok: 1

Server status:
        ok: 1

Databases:
        adventureworks
,       oldmain

done
// </console_result>
*/
