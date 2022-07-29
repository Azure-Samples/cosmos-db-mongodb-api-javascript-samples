// ------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// ------------------------------------------------------------

// Goal: Find the price range for the different bike subcategories. 

/*
// <console_result>
{"_id":"Mountain Bikes","nProducts":32,"min":539.99,"avg":1683.37,"max":3399.99}
{"_id":"Road Bikes","nProducts":43,"min":539.99,"avg":1597.45,"max":3578.27}
{"_id":"Touring Bikes","nProducts":22,"min":742.35,"avg":1425.25,"max":2384.07}
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

    // <execute_aggregation_pipeline> 
    const pipeline = [
      {
        '$match': {
          'categoryName': { $regex: 'Bikes' },
        }
      },
      {
        $addFields: {
          'categories': { '$split': ['$categoryName', ', '] }
        }
      },

      {
        $addFields: {
          'subcategory': { '$slice': ["$categories", 1, { $subtract: [{ $size: "$categories" }, 1] }] }
        }
      },
      {
        '$group': {
          '_id': '$subcategory',
          'maxPrice': {
            '$max': '$price'
          },
          'averagePrice': {
            '$avg': '$price'
          },
          'minPrice': {
            '$min': '$price'
          },
          'countOfProducts': {
            '$sum': 1
          }
        },
      },
      {
        '$project': {
          'nProducts': '$countOfProducts',
          '_id': { '$arrayElemAt': ['$_id', 0]},
          'min': { '$round': ["$minPrice", 2] },
          'avg': { '$round': ["$averagePrice", 2] },
          'max': { '$round': ["$maxPrice", 2] }
        }
      },
      { '$sort': { "_id": 1 } },
    ];

    const aggCursor = client.db("adventureworks").collection('products').aggregate(pipeline);

    await aggCursor.forEach(product => {
      console.log(JSON.stringify(product));
    });
    // </execute_aggregation_pipeline> 

    return "done";
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
