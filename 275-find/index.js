// ------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// ------------------------------------------------------------

// <package_dependencies> 
// Read .env file and set environment variables
require('dotenv').config();

// Use official mongodb driver to connect to the server
const { MongoClient } = require('mongodb');
// </package_dependencies>

// <client_credentials> 
// New instance of MongoClient with connection string
// for Cosmos DB
const url = process.env.COSMOS_CONNECTION_STRING;
const client = new MongoClient(url);
// </client_credentials>

async function main(){

    // <connect_client>
    // Use connect method to connect to the server
    await client.connect();
    // </connect_client>

    // <read_doc> 
    // assume doc exists
    const product = {
        _id: "68719518391",
        category: "gear-surf-surfboards",
        name: "Yamba Surfboard",
        quantity: 12,
        sale: false
    };

    // For unsharded database: use id
    const query1 = { _id: product._id };
    const foundById = await client.db("adventureworks").collection('products').findOne(query1);
    console.log(`Read doc:\t\n${Object.keys(foundById).map(key => `\t${key}: ${foundById[key]}\n`)}`);

    // For sharded database: point read doc from collection using the id and partitionKey
    const query2 = { _id: product._id, category: product.category };
    const foundByIdAndPartitionKey = await client.db("adventureworks").collection('products').findOne(query2);
    console.log(`Read doc:\t\n${Object.keys(foundByIdAndPartitionKey).map(key => `\t${key}: ${foundByIdAndPartitionKey[key]}\n`)}`);


    // Find one by unique doc property value
    const query3 = { name: product.name};
    const foundByUniqueValue = await client.db("adventureworks").collection('products').findOne(query3);
    console.log(`Read doc:\t\n${Object.keys(foundByUniqueValue).map(key => `\t${key}: ${foundByUniqueValue[key]}\n`)}`);

    // Find one (with many that match query) still returns one doc
    const query4 = { category: product.category };
    const foundByNonUniqueValue = await client.db("adventureworks").collection('products').findOne(query4);
    console.log(`Read doc:\t\n${Object.keys(foundByNonUniqueValue).map(key => `\t${key}: ${foundByNonUniqueValue[key]}\n`)}`);

    // Find all that match query
    const query5 = { category: product.category };
    const foundAll = await client.db("adventureworks").collection('products').find(query5).sort({_id: 1}).toArray();
    console.log(`Matching docs:\n${foundAll.map(doc => `\t${doc._id}: ${doc.name}\n`)}`);

    // Find all in collection with empty query {}
    const foundAll2 = await client.db("adventureworks").collection('products').find({}).toArray();
    console.log(`All docs:\n${foundAll2.map(doc => `\t${doc._id}: ${doc.name}\n`)}`);

    // Pagination - next 5 docs
    const nextFiveDocs = await client.db("adventureworks").collection('products').find({}).sort({_id: 1}).skip(5).limit(5).toArray();
    console.log(`All docs:\n${foundAll2.map(doc => `\t${doc._id}: ${doc.name}\n`)}`);

    // </read_doc> 
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
// <console_result_findone>
Read doc:
        _id: 68719518391
,       name: Yamba Surfboard
,       category: gear-surf-surfboards
,       quantity: 12
,       sale: false

Read doc:
        _id: 68719518391
,       name: Yamba Surfboard
,       category: gear-surf-surfboards
,       quantity: 12
,       sale: false

Read doc:
        _id: 68719518391
,       name: Yamba Surfboard
,       category: gear-surf-surfboards
,       quantity: 12
,       sale: false

Read doc:
        _id: 68719518391
,       name: Yamba Surfboard
,       category: gear-surf-surfboards
,       quantity: 12
,       sale: false

Matching docs:
        68719518391: Yamba Surfboard
,       68719518111: Yamba Surfboard 3
,       1234: Yamba knee board

All docs:
        68719518391: Yamba Surfboard
,       68719518111: Yamba Surfboard 3
,       1234: Yamba knee board

done
// </console_result_findone>
*/
