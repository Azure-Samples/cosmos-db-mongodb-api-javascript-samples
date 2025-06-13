// ------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// ------------------------------------------------------------

import dotenv from 'dotenv';
import path from 'path';
const __dirname = path.resolve();

dotenv.config({ path: path.resolve(__dirname, '../.env') });

// <package_dependencies>

// Use official mongodb driver to connect to the server
import { MongoClient, ObjectId } from 'mongodb';
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

  // <delete>
  const product = {
    _id: new ObjectId('62b1f43a9446918500c875c5'),
    category: 'gear-surf-surfboards',
    name: 'Yamba Surfboard 3',
    quantity: 15,
    sale: true,
  };

  const query = { name: product.name };

  // delete 1 with query for unique document
  const delete1Result = await client
    .db('adventureworks')
    .collection('products')
    .deleteOne(query);
  console.log(
    `Delete 1 result:\t\n${Object.keys(delete1Result).map(key => `\t${key}: ${delete1Result[key]}\n`)}`
  );

  // delete all with empty query {}
  const deleteAllResult = await client
    .db('adventureworks')
    .collection('products')
    .deleteMany({});
  console.log(
    `Delete all result:\t\n${Object.keys(deleteAllResult).map(key => `\t${key}: ${deleteAllResult[key]}\n`)}`
  );
  // </delete>

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
Delete 1 result:
        acknowledged: true
,       deletedCount: 1

Delete all result:
        acknowledged: true
,       deletedCount: 27

done
// </console_result>
*/
