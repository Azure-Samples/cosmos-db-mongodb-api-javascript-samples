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

  try{
  // <connect_client>
  // Use connect method to connect to the server
  await client.connect();
  // </connect_client>

    // <execute_aggregation_pipeline> 
    // See https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#aggregate for the aggregate() docs
    const pipeline = [
        {
            '$match': {
                'categoryName': 'Accessories, Tires and Tubes'
            }
        },
        
    ];
    const aggCursor = client.db("adventureworks").collection('products').aggregate(pipeline);

    await aggCursor.forEach(customer => {
      console.log(JSON.stringify(customer));
    });
        // </execute_aggregation_pipeline> 

  return "done";
  }catch(err){
    console.log(JSON.stringify(err));
  }


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