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
const url = process.env.COSMOS_CONNECTION_STRING;
const client = new MongoClient(url);
// </client_credentials>

export async function main() {
  // <connect_client>
  // Use connect method to connect to the server
  await client.connect();
  // </connect_client>

  // <collection>
  // Get all indexes in collection
  const collectionInstance = await client
    .db('adventureworks')
    .collection('products');
  const indexes = await collectionInstance.indexes();
  console.log(
    `Indexes on collection:\n${Object.keys(indexes).map(key => `\t${key}: ${JSON.stringify(indexes[key])}\n`)}`
  );
  // </collection>

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
Indexes on collection:
        0: {"v":1,"key":{"_id":1},"name":"_id_","ns":"adventureworks.products"}
,       1: {"v":1,"key":{"name":1},"name":"name_1","ns":"adventureworks.products"}

done
// </console_result>
*/
