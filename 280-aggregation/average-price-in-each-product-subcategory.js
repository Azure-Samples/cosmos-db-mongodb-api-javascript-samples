// ------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// ------------------------------------------------------------

// Goal: Find the average price of each product subcategory with 
// the number of products in that subcategory.
// Sort by average price descending.

/*
// <console_result>
{"averagePrice":51.99,"category":"Clothing, Jerseys","nProducts":8}
{"averagePrice":1683.36,"category":"Bikes, Mountain Bikes","nProducts":32}
{"averagePrice":1597.45,"category":"Bikes, Road Bikes","nProducts":43}
{"averagePrice":20.24,"category":"Components, Chains","nProducts":1}
{"averagePrice":25,"category":"Accessories, Locks","nProducts":1}
{"averagePrice":631.42,"category":"Components, Touring Frames","nProducts":18}
{"averagePrice":9.25,"category":"Clothing, Socks","nProducts":4}
{"averagePrice":125,"category":"Accessories, Panniers","nProducts":1}
... remaining fields ...
// </console_result>
*/

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

  try {
    // <connect_client>
    // Use connect method to connect to the server
    await client.connect();
    // </connect_client>

    // <pipeline_stages>
    // Group all products by category
    // Find average price of each category
    // Count # of products in each category
    const groupByCategory = {
      '$group': {
        '_id': '$categoryName',
        'averagePrice': {
          '$avg': '$price'
        },
        'countOfProducts': {
          '$sum': 1
        }
      },
    };

    // Round price to 2 decimal places
    // Don't return _id
    // Rename category name help in `_id` to `categoryName`
    // Round prices to 2 decimal places
    // Rename property for countOfProducts to nProducts
    const additionalTransformations = {
      '$project': {
        '_id': 0,
        'category': '$_id',
        'nProducts':'$countOfProducts',
        'averagePrice': { '$round': ['$averagePrice', 2] }
      }
    };

    // Sort by average price descending
    const sort = { '$sort': { '$averagePrice': -1 } };
    // </pipeline_stages>


    // <execute_aggregation_pipeline> 
    // stages execute in order from top to bottom
    const pipeline = [
      groupByCategory,
      additionalTransformations,
      sort
    ];

    const db = 'adventureworks';
    const collection = 'products';

    // Get iterable cursor
    const aggCursor = client.db(db).collection(collection).aggregate(pipeline);

    // Display each item in cursor
    await aggCursor.forEach(product => {
      console.log(JSON.stringify(product));
    });
    // </execute_aggregation_pipeline> 

    return 'done';
  } catch (err) {
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

