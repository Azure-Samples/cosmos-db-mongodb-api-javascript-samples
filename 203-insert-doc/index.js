// ------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// ------------------------------------------------------------

// <package_dependencies> 
// Read .env file and set environment variables
require('dotenv').config();
const random = Math.floor(Math.random() * 100);

// Use official mongodb driver to connect to the server
const { MongoClient } = require('mongodb');
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

  // <database_object> 
  // get database client for database 
  // if database or collection doesn't exist, it is created
  // when the doc is inserted

  // insert doc
  const doc = { name: `product-${random}` };
  const insertOneResult = await client.db("adventureworks").collection("products").insertOne(doc);
  console.log(`Insert 1 - ${JSON.stringify(insertOneResult)}`);

  // insert docs
  const docs = [
      { name: `product-${random}` },
      { name: `product-${random}` }
  ];
  const insertManyResult = await client.db("adventureworks").collection("products").insertMany(docs);
  console.log(`Insert many ${JSON.stringify(insertManyResult)}`);
  // </database_object> 

  return "done";
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => {
    // Close the db and its underlying connections
    client.close()
  });


/*
// <console_result>
Insert 1 - {"acknowledged":true,"insertedId":"62b2394be4042705f00fd790"}
Insert many {"acknowledged":true,"insertedCount":2,"insertedIds":{"0":"62b2394be4042705f00fd791","1":"62b2394be4042705f00fd792"}}
done
// </console_result>
*/
