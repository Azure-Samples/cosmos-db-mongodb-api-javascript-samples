// ------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// ------------------------------------------------------------

// <package_dependencies> 
// Read .env file and set environment variables
require('dotenv').config();

// Use official mongodb driver to connect to the server
const { MongoClient, ObjectId } = require('mongodb');
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

    // <new_database> 
    // Database reference with creation if it does not already exist
    const db = client.db("adventureworks");
    // </new_database>

    // <new_collection> 
    // Collection reference with creation if it does not already exist
    const collection = db.collection('products');
    // </new_container>

    // <new_doc> 
    // Create new object and upsert (create or replace) to collection
    const product = {
        _id: "68719518391",
        category: "gear-surf-surfboards",
        name: "Yamba Surfboard",
        quantity: 12,
        sale: false
    };
    const query = { name: "Yamba Surfboard"};
    const update = { $set: product };
    const options = {upsert: true, new: true};

    const upsertResult = await collection.updateOne(query, update, options);
    
    if(upsertResult.upsertedCount ===1){
        console.log(`Created doc:\t${ObjectId(upsertResult.id).toString()}\t[${product.category}]`);
    }
    // </new_doc>

    // <read_doc> 
    // Point read doc from container using the id and partitionKey
    const foundProduct = await collection.findOne({
        _id: "68719518391", 
        category: "gear-surf-surfboards"
    });
    console.log(`Read doc:\t${ObjectId(foundProduct.id).toString()}\t[${foundProduct.category}]`);
    // </read_doc>

    return "done";
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());
