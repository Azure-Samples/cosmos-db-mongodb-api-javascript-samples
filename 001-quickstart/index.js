// ------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// ------------------------------------------------------------

// <package_dependencies>
// Read .env file and set environment variables
const random = Math.floor(Math.random() * 100);

// Use official mongodb driver to connect to the server
const { MongoClient, ObjectId } = require('mongodb');
// </package_dependencies>

// <client_credentials>
// New instance of MongoClient with connection string
// for Cosmos DB
const url = process.env.AZURE_COSMOS_DB_MONGODB_CONNECTION_STRING;
const client = new MongoClient(url);
// </client_credentials>

async function main() {
  // <connect_client>
  // Use connect method to connect to the server
  await client.connect();
  // </connect_client>

  // <new_database>
  // Database reference with creation if it does not already exist
  const db = client.db(`adventureworks`);
  console.log(`New database:\t${db.databaseName}\n`);
  // </new_database>

  // <new_collection>
  // Collection reference with creation if it does not already exist
  const collection = db.collection('products');
  console.log(`New collection:\t${collection.collectionName}\n`);
  // </new_collection>

  // <new_doc>
  // Create new doc and upsert (create or replace) to collection
  const product = {
    category: 'gear-surf-surfboards',
    name: `Yamba Surfboard-${random}`,
    quantity: 12,
    sale: false,
  };
  const query = { name: product.name };
  const update = { $set: product };
  const options = { upsert: true, new: true };

  // Insert via upsert (create or replace) doc to collection directly
  const upsertResult1 = await collection.updateOne(query, update, options);
  console.log(`upsertResult1: ${JSON.stringify(upsertResult1)}\n`);

  // Update via upsert on chained instance
  const query2 = { _id: ObjectId(upsertResult1.upsertedId) };
  const update2 = { $set: { quantity: 20 } };
  const upsertResult2 = await client
    .db(`adventureworks`)
    .collection('products')
    .updateOne(query2, update2, options);
  console.log(`upsertResult2: ${JSON.stringify(upsertResult2)}\n`);
  // </new_doc>

  // <read_doc>
  // Point read doc from collection:
  // - without sharding, should use {_id}
  // - with sharding,    should use {_id, partitionKey }, ex: {_id, category}
  const foundProduct = await collection.findOne({
    _id: ObjectId(upsertResult1.upsertedId),
    category: 'gear-surf-surfboards',
  });
  console.log(`foundProduct: ${JSON.stringify(foundProduct)}\n`);
  // </read_doc>

  // <create_index>
  // create index to sort by name
  const indexResult = await collection.createIndex({ name: 1 });
  console.log(`indexResult: ${JSON.stringify(indexResult)}\n`);
  // </create_index>

  // <query_docs>
  // select all from product category
  const allProductsQuery = {
    category: 'gear-surf-surfboards',
  };

  // get all documents, sorted by name, convert cursor into array
  const products = await collection
    .find(allProductsQuery)
    .sort({ name: 1 })
    .toArray();
  products.map((product, i) =>
    console.log(`${++i} ${JSON.stringify(product)}`)
  );
  // </query_docs>

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
New database:   adventureworks

New collection: products

upsertResult1: {"acknowledged":true,"modifiedCount":0,"upsertedId":"62b1f492ff69395b30a03169","upsertedCount":1,"matchedCount":0}

upsertResult2: {"acknowledged":true,"modifiedCount":1,"upsertedId":null,"upsertedCount":0,"matchedCount":1}

foundProduct: {"_id":"62b1f492ff69395b30a03169","name":"Yamba Surfboard-93","category":"gear-surf-surfboards","quantity":20,"sale":false}

indexResult: "name_1"

1 {"_id":"62b1f47dacbf04e86c8abf25","name":"Yamba Surfboard-11","category":"gear-surf-surfboards","quantity":20,"sale":false}
done
// </console_result>
*/
