
// ------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// ------------------------------------------------------------

// <package_dependencies> 
// Read .env file and set environment variables
require('dotenv').config();
const fs = require("fs").promises;

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

  
  // <get_data_from_file>
  const data = await fs.readFile('customers.json');
  const docs = JSON.parse(data.toString());
  const insertManyResponse1 = await client.db("adventureworks").collection('customers').insertMany(docs);
  console.log(`${JSON.stringify(insertManyResponse1)}`);  
  // </get_data_from_file>

  // <get_data_from_file_2>
  const data2 = await fs.readFile('products.json');
  const docs2 = JSON.parse(data2.toString());
  const insertManyResponse2 = await client.db("adventureworks").collection('products').insertMany(docs2);
  console.log(`${JSON.stringify(insertManyResponse2)}`);    
  // </get_data_from_file_2>  


  // <insert_many>

  // </insert_many>

  return "done";
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => {
    // Close the db and its underlying connections
    client.close()
  });

