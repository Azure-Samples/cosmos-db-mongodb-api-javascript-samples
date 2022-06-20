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

    // <does_database_exist> 
    // Get list of databases
    const listResult = await client.db().admin().listDatabases();
    if(listResult.databases.length === 0) {
      return 'No databases found';
    }

    // does database exist
    const lookForDatabase = 'adventureworks';
    const dbFound = listResult.databases.find(db => db.name===lookForDatabase).toArray();
    if(dbFound) {
      return `Database exists:\t${lookForDatabase}`;
    }
    // </does_database_exist> 

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
Database exists:        adventureworks
// </console_result>
*/
