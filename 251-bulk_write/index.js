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

  // <bulk_write>
  const doc1 = {
    category: 'gear-surf-surfboards',
    name: 'Yamba Surfboard 3',
    quantity: 15,
    sale: true,
  };
  const doc2 = {
    category: 'gear-surf-surfboards',
    name: 'Yamba Surfboard 7',
    quantity: 5,
    sale: true,
  };

  // update docs with new property/value
  const addNewProperty = {
    filter: { category: 'gear-surf-surfboards' },
    update: { $set: { discontinued: true } },
    upsert: true,
  };

  // bulkWrite only supports insertOne, updateOne, updateMany, deleteOne, deleteMany
  const upsertResult = await client
    .db('adventureworks')
    .collection('products')
    .bulkWrite([
      { insertOne: { document: doc1 } },
      { insertOne: { document: doc2 } },
      { updateMany: addNewProperty },
    ]);

  console.log(`${JSON.stringify(upsertResult)}`);
  // </bulk_write>

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
// <console_result_bulk_write>
{
  "ok":1,
  "writeErrors":[],
  "writeConcernErrors":[],
  "insertedIds":[
    {"index":0,"_id":"62b23a371a09ed6441e5ee30"},
    {"index":1,"_id":"62b23a371a09ed6441e5ee31"}],
  "nInserted":2,
  "nUpserted":0,
  "nMatched":10,
  "nModified":10,
  "nRemoved":0,
  "upserted":[]
}
done
// </console_result_bulk_write>
*/
