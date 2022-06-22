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

async function main() {

  // <connect_client>
  // Use connect method to connect to the server
  await client.connect();
  // </connect_client>

  // <database_object> 
  // get list of databases
  const listResult = await client.db().admin().listDatabases();
  console.log("Databases:\n");

  // loop through databases
  for await (let database of listResult.databases) {

    console.log(`\t${database.name}\n`);

    // get database client
    const dbClient = client.db(database.name);

    // get collections in database
    const collections = await dbClient.listCollections();
    console.log("\n\t\tCollections:\n");

    // loop through collections
    for await (let collection of collections) {
      
      // get collection client
      const collectionClient = dbClient.collection(collection.name);

      // get doc count of collection
      const docCount = await collectionClient.countDocuments({});
      console.log(`\t\t\t${collection.name}: ${docCount} doc(s)\n`);
    }
  }
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
Databases:

        adventureworks


                Collections:

                        products: 1 doc(s)

        oldmain


                Collections:

                        central: 0 doc(s)

done
// </console_result>
*/
