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

  // <does_database_exist>
  // Get list of databases
  const listResult = await client.db().admin().listDatabases();
  if (listResult.databases.length === 0) {
    return 'No databases found';
  }

  // does database exist
  const lookForDatabase = 'adventureworks';
  const dbFound = listResult.databases.find(db => db.name === lookForDatabase);
  if (dbFound) {
    return `Database exists:\t${lookForDatabase}`;
  }
  // </does_database_exist>

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
Database exists:        adventureworks
// </console_result>
*/
