// ------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// ------------------------------------------------------------

// Goal: Find the average price of each product subcategory with 
// the number of products in that subcategory.
// Sort by average price descending.

/*
// <results>
{"_id":"Bikes, Touring Bikes","averagePrice":1425.25,"nProducts":22}
{"_id":"Components, Saddles","averagePrice":39.63,"nProducts":9}
{"_id":"Accessories, Bottles and Cages","averagePrice":7.99,"nProducts":3}
{"_id":"Accessories, Tires and Tubes","averagePrice":19.48,"nProducts":11}
{"_id":"Components, Pedals","averagePrice":64.02,"nProducts":7}
{"_id":"Clothing, Tights","averagePrice":74.99,"nProducts":3}
{"_id":"Components, Bottom Brackets","averagePrice":92.24,"nProducts":3}
{"_id":"Clothing, Gloves","averagePrice":31.24,"nProducts":6}
{"_id":"Clothing, Vests","averagePrice":63.5,"nProducts":3}
{"_id":"Components, Headsets","averagePrice":87.07,"nProducts":3}
{"_id":"Components, Forks","averagePrice":184.4,"nProducts":3}
{"_id":"Components, Road Frames","averagePrice":780.04,"nProducts":33}
{"_id":"Components, Wheels","averagePrice":220.93,"nProducts":14}
{"_id":"Components, Mountain Frames","averagePrice":678.25,"nProducts":28}
{"_id":"Accessories, Lights","averagePrice":31.32,"nProducts":3}
{"_id":"Clothing, Jerseys","averagePrice":51.99,"nProducts":8}
{"_id":"Bikes, Mountain Bikes","averagePrice":1683.36,"nProducts":32}
{"_id":"Bikes, Road Bikes","averagePrice":1597.45,"nProducts":43}
{"_id":"Components, Chains","averagePrice":20.24,"nProducts":1}
{"_id":"Accessories, Locks","averagePrice":25,"nProducts":1}
{"_id":"Components, Touring Frames","averagePrice":631.42,"nProducts":18}
{"_id":"Clothing, Socks","averagePrice":9.25,"nProducts":4}
{"_id":"Accessories, Panniers","averagePrice":125,"nProducts":1}
{"_id":"Components, Brakes","averagePrice":106.5,"nProducts":2}
{"_id":"Components, Handlebars","averagePrice":73.89,"nProducts":8}
{"_id":"Components, Cranksets","averagePrice":278.99,"nProducts":3}
{"_id":"Accessories, Bike Racks","averagePrice":120,"nProducts":1}
{"_id":"Components, Derailleurs","averagePrice":106.48,"nProducts":2}
{"_id":"Clothing, Shorts","averagePrice":64.28,"nProducts":7}
{"_id":"Accessories, Bike Stands","averagePrice":159,"nProducts":1}
{"_id":"Accessories, Pumps","averagePrice":22.49,"nProducts":2}
{"_id":"Accessories, Hydration Packs","averagePrice":54.99,"nProducts":1}
{"_id":"Clothing, Bib-Shorts","averagePrice":89.99,"nProducts":3}
{"_id":"Accessories, Helmets","averagePrice":34.99,"nProducts":3}
{"_id":"Accessories, Cleaners","averagePrice":7.95,"nProducts":1}
{"_id":"Accessories, Fenders","averagePrice":21.98,"nProducts":1}
{"_id":"Clothing, Caps","averagePrice":8.99,"nProducts":1}
// </results>
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
        '$group': {
          '_id': '$categoryName',
          'averagePrice': {
            '$avg': '$price'
          },
          'countOfProducts': {
            '$sum': 1
          }
        },
      },
      {
        '$project': {
          "averagePrice": { '$round': ["$averagePrice", 2] },
          'nProducts':'$countOfProducts'
        }
      },
      { '$sort': { "$averagePrice": -1 } },

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


/*
// <console_result>
Insert 1 - {"acknowledged":true,"insertedId":"62b2394be4042705f00fd790"}
Insert many {"acknowledged":true,"insertedCount":2,"insertedIds":{"0":"62b2394be4042705f00fd791","1":"62b2394be4042705f00fd792"}}
done
// </console_result>
*/