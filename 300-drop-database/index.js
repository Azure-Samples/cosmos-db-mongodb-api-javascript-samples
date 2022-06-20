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

    // <drop_database> 
    // Drop a database, removing it permanently from the server.
    const dropDatabase = await client.db("adventureworks").dropDatabase();
    console.log(`Drop database:\t${JSON.stringify(dropDatabase)}`);
    // </drop_database>     
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
Drop database:  true
done
// </console_result>
*/
