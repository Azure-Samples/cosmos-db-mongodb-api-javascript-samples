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
const url = process.env.COSMOS_CONNECTION_STRING;
const client = new MongoClient(url);
// </client_credentials>

export async function main() {
  // <connect_client>
  // Use connect method to connect to the server
  await client.connect();
  // </connect_client>

  // <read_doc>
  // assume doc exists

  const product = {
    _id: new ObjectId('62b1f43a9446918500c875c5'),
    category: 'gear-surf-surfboards',
    name: 'Yamba Surfboard 7',
    quantity: 12,
    sale: false,
  };

  // For unsharded database: use id
  const query1 = { _id: new ObjectId(product._id) };
  const foundById = await client
    .db('adventureworks')
    .collection('products')
    .findOne(query1);
  console.log(
    `Read doc:\t\n${Object.keys(foundById).map(key => `\t${key}: ${foundById[key]}\n`)}`
  );

  // For sharded database: point read doc from collection using the id and partitionKey
  const query2 = { _id: new ObjectId(product._id), category: product.category };
  const foundByIdAndPartitionKey = await client
    .db('adventureworks')
    .collection('products')
    .findOne(query2);
  console.log(
    `Read doc 2:\t\n${Object.keys(foundByIdAndPartitionKey).map(key => `\t${key}: ${foundByIdAndPartitionKey[key]}\n`)}`
  );

  // Find one by unique doc property value
  const query3 = { name: product.name };
  const foundByUniqueValue = await client
    .db('adventureworks')
    .collection('products')
    .findOne(query3);
  console.log(
    `Read doc 3:\t\n${Object.keys(foundByUniqueValue).map(key => `\t${key}: ${foundByUniqueValue[key]}\n`)}`
  );

  // Find one (with many that match query) still returns one doc
  const query4 = { category: product.category };
  const foundByNonUniqueValue = await client
    .db('adventureworks')
    .collection('products')
    .findOne(query4);
  console.log(
    `Read doc 4:\t\n${Object.keys(foundByNonUniqueValue).map(key => `\t${key}: ${foundByNonUniqueValue[key]}\n`)}`
  );

  // Find all that match query
  const query5 = { category: product.category };
  const foundAll = await client
    .db('adventureworks')
    .collection('products')
    .find(query5)
    .sort({ _id: 1 })
    .toArray();
  console.log(
    `Matching all in product category:\n${foundAll.map(doc => `\t${doc._id}: ${doc.name}\n`)}`
  );

  // Find all in collection with empty query {}
  const foundAll2 = await client
    .db('adventureworks')
    .collection('products')
    .find({})
    .toArray();
  console.log(
    `All docs:\n${foundAll2.map(doc => `\t${doc._id}: ${doc.name}\n`)}`
  );

  // Pagination - next 5 docs
  // sort by name require an index on name
  const nextFiveDocs = await client
    .db('adventureworks')
    .collection('products')
    .find({})
    .sort({ name: 1 })
    .skip(5)
    .limit(5)
    .toArray();
  console.log(
    `Next 5 docs:\n${nextFiveDocs.map(doc => `\t${doc._id}: ${doc.name}\n`)}`
  );

  // </read_doc>
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
// <console_result_findone>
Read doc:
        _id: 62b1f43a9446918500c875c5
,       name: Yamba Surfboard-13
,       category: gear-surf-surfboards
,       quantity: 20
,       sale: false
,       discontinued: true

Read doc 2:
        _id: 62b1f43a9446918500c875c5
,       name: Yamba Surfboard-13
,       category: gear-surf-surfboards
,       quantity: 20
,       sale: false
,       discontinued: true

Read doc 3:
        _id: 62b23a371a09ed6441e5ee31
,       category: gear-surf-surfboards
,       name: Yamba Surfboard 7
,       quantity: 5
,       sale: true
,       discontinued: true

Read doc 4:
        _id: 62b1f43a9446918500c875c5
,       name: Yamba Surfboard-13
,       category: gear-surf-surfboards
,       quantity: 20
,       sale: false
,       discontinued: true

Matching all in product category:
        62b1f43a9446918500c875c5: Yamba Surfboard-13
,       62b1f4670c7af8c2942b7c10: Yamba Surfboard-3
,       62b1f46fa6546d2afb5715ac: Yamba Surfboard-90
,       62b1f474e4b43498c05d295b: Yamba Surfboard-9

All docs:
        62b1f43a9446918500c875c5: Yamba Surfboard-13
,       62b1f4670c7af8c2942b7c10: Yamba Surfboard-3
,       62b1f46fa6546d2afb5715ac: Yamba Surfboard-90
,       62b1f474e4b43498c05d295b: Yamba Surfboard-9
,       62b1f47896aa8cfa280edf2d: Yamba Surfboard-55
,       62b1f47dacbf04e86c8abf25: Yamba Surfboard-11
,       62b1f4804ee53f4c5c44778c: Yamba Surfboard-97
,       62b1f492ff69395b30a03169: Yamba Surfboard-93
,       62b23a371a09ed6441e5ee30: Yamba Surfboard 3
,       62b23a371a09ed6441e5ee31: Yamba Surfboard 7

All docs:
        62b1f43a9446918500c875c5: Yamba Surfboard-13
,       62b1f4670c7af8c2942b7c10: Yamba Surfboard-3
,       62b1f46fa6546d2afb5715ac: Yamba Surfboard-90
,       62b1f474e4b43498c05d295b: Yamba Surfboard-9
,       62b1f47896aa8cfa280edf2d: Yamba Surfboard-55
,       62b1f47dacbf04e86c8abf25: Yamba Surfboard-11
,       62b1f4804ee53f4c5c44778c: Yamba Surfboard-97
,       62b1f492ff69395b30a03169: Yamba Surfboard-93
,       62b23a371a09ed6441e5ee30: Yamba Surfboard 3
,       62b23a371a09ed6441e5ee31: Yamba Surfboard 7

done
// </console_result_findone>
*/
