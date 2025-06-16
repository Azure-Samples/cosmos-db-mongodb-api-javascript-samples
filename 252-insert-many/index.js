// ------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// ------------------------------------------------------------

import dotenv from 'dotenv';
import path from 'path';
const __dirname = path.resolve();

dotenv.config({ path: path.resolve(__dirname, '../.env') });

// <package_dependencies>

// Use official mongodb driver to connect to the server
import { MongoClient } from 'mongodb';
import fs from 'fs/promises';
// </package_dependencies>

// <client_credentials>
// New instance of MongoClient with connection string
// for Cosmos DB
const url = process.env.AZURE_COSMOS_DB_MONGODB_CONNECTION_STRING;
const client = new MongoClient(url);
// </client_credentials>

export async function main() {
  // <connect_client>
  // Use connect method to connect to the server
  await client.connect();
  // </connect_client>

  // <get_data_from_file>
  const filePath = path.join(__dirname, './data/customers.json');
  const data = await fs.readFile(filePath);
  const docs = JSON.parse(data.toString());
  const insertManyResponse1 = await client
    .db('adventureworks')
    .collection('customers')
    .insertMany(docs);
  console.log(`${JSON.stringify(insertManyResponse1)}`);
  // </get_data_from_file>

  // <get_data_from_file_2>
  const filePath2 = path.join(__dirname, './data/products.json');
  const data2 = await fs.readFile(filePath2);
  const docs2 = JSON.parse(data2.toString());
  const insertManyResponse2 = await client
    .db('adventureworks')
    .collection('products')
    .insertMany(docs2);
  console.log(`${JSON.stringify(insertManyResponse2)}`);
  // </get_data_from_file_2>

  // <insert_many>

  // </insert_many>

  return 'done';
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => {
    // Close the db and its underlying connections
    client.close();
  });
