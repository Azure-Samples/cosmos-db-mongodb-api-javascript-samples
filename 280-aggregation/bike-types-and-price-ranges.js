// ------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// ------------------------------------------------------------

// < aggregation_1>
// Goal: Find the price range for the different bike subcategories.

import dotenv from 'dotenv';
import path from 'path';
const __dirname = path.resolve();

dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Use official mongodb driver to connect to the server
import { MongoClient } from 'mongodb';

// New instance of MongoClient with connection string
// for Cosmos DB
const url = process.env.COSMOS_CONNECTION_STRING;
const client = new MongoClient(url);

export async function main() {
  try {
    // Use connect method to connect to the server
    await client.connect();

    const categoryName = 'Bikes';

    const findAllBikes = {
      $match: {
        categoryName: { $regex: categoryName },
      },
    };

    // Convert 'Bikes, Touring Bikes' to ['Bikes', 'Touring Bikes']
    const splitStringIntoCsvArray = {
      $addFields: {
        categories: { $split: ['$categoryName', ', '] },
      },
    };

    // Remove first element from array
    // Converts ['Bikes', 'Touring Bikes'] to ['Touring Bikes']
    const removeFirstElement = {
      $addFields: {
        subcategory: {
          $slice: [
            '$categories',
            1,
            { $subtract: [{ $size: '$categories' }, 1] },
          ],
        },
      },
    };

    // Group items by book subcategory, and find min, avg, and max price
    const groupBySubcategory = {
      $group: {
        _id: '$subcategory',
        maxPrice: {
          $max: '$price',
        },
        averagePrice: {
          $avg: '$price',
        },
        minPrice: {
          $min: '$price',
        },
        countOfProducts: {
          $sum: 1,
        },
      },
    };

    // Miscellaneous transformations
    // Don't return _id
    // Convert subcategory from array of 1 item to string in `name`
    // Round prices to 2 decimal places
    // Rename property for countOfProducts to nProducts
    const additionalTransformations = {
      $project: {
        _id: 0,
        name: { $arrayElemAt: ['$_id', 0] },
        nProducts: '$countOfProducts',
        min: { $round: ['$minPrice', 2] },
        avg: { $round: ['$averagePrice', 2] },
        max: { $round: ['$maxPrice', 2] },
      },
    };

    // Sort by subcategory
    const sortBySubcategory = { $sort: { name: 1 } };

    // stages execute in order from top to bottom
    const pipeline = [
      findAllBikes,
      splitStringIntoCsvArray,
      removeFirstElement,
      groupBySubcategory,
      additionalTransformations,
      sortBySubcategory,
    ];

    const db = 'adventureworks';
    const collection = 'products';

    // Get iterable cursor
    const aggCursor = client.db(db).collection(collection).aggregate(pipeline);

    // Display each item in cursor
    await aggCursor.forEach(product => {
      console.log(JSON.stringify(product));
    });

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
    client.close();
  });

// Results:
// {'name':'Mountain Bikes','nProducts':32,'min':539.99,'avg':1683.37,'max':3399.99}
// {'name':'Road Bikes','nProducts':43,'min':539.99,'avg':1597.45,'max':3578.27}
// {'name':'Touring Bikes','nProducts':22,'min':742.35,'avg':1425.25,'max':2384.07}

// </aggregation_1>
