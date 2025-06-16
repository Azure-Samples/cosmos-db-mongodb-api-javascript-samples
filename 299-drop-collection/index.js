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

  // <drop_collection>
  // Drop the collection from the database, removing it permanently.
  // New accesses will create a new collection.

  // drop from db instance
  const dropCollection1 = await client
    .db('adventureworks')
    .dropCollection('products');
  console.log(`Collection dropped:\t${JSON.stringify(dropCollection1)}`);

  // drop from collection instance
  const dropCollection2 = await client
    .db('adventureworks')
    .collection('products-2')
    .drop();
  console.log(`Collection dropped:\t${JSON.stringify(dropCollection2)}`);
  // </drop_collection>
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
Collection dropped:     true
Collection dropped:     true
done
// </console_result>
*/
