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

  // <upsert>
  const product = {
    category: 'gear-surf-surfboards',
    name: 'Yamba Surfboard 3',
    quantity: 15,
    sale: true,
  };

  const query = { name: product.name };
  const update = { $set: product };
  const options = { upsert: true, new: true };

  const upsertResult = await client
    .db('adventureworks')
    .collection('products')
    .updateOne(query, update, options);

  console.log(
    `Upsert result:\t\n${Object.keys(upsertResult).map(key => `\t${key}: ${upsertResult[key]}\n`)}`
  );
  // </upsert>

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
// <console_result_insert>
Upsert result:
        acknowledged: true
,       modifiedCount: 0
,       upsertedId: 62b1f492ff69395b30a03169
,       upsertedCount: 1
,       matchedCount: 0

done

// </console_result_insert>

// <console_result_update>
Upsert result:
        acknowledged: true
,       modifiedCount: 1
,       upsertedId: null
,       upsertedCount: 0
,       matchedCount: 1

done
// </console_result_update>
*/
