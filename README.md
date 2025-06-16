# Azure Cosmos DB MongoDB API JavaScript Samples

A collection of## Examples

The following table shows all the numbered example directories and what each demonstrates:

| Directory                      | Name                      | Description                                                                                                                    |
| ------------------------------ | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `001-quickstart`               | Basic CRUD Operations     | Complete example showing database/collection creation, document insertion with upsert, point reads, indexing, and queries      |
| `101-client-connection-string` | Client Connection Options | Demonstrates connecting to Cosmos DB and displaying all MongoDB client connection options and settings                         |
| `200-admin`                    | Server Administration     | Shows how to get server information, check server status, and list all databases using admin commands                          |
| `201-does-database-exist`      | Database Existence Check  | Checks if a specific database exists by listing all databases and searching for a target database name                         |
| `202-get-doc-count`            | Document Counting         | Lists all databases and collections, then counts the number of documents in each collection                                    |
| `203-insert-doc`               | Document Insertion        | Demonstrates inserting single documents with `insertOne()` and multiple documents with `insertMany()`                          |
| `225-get-collection-indexes`   | Index Management          | Shows how to retrieve and display all indexes on a collection                                                                  |
| `250-upsert-doc`               | Document Upsert           | Demonstrates upsert operations (insert or update) using `updateOne()` with the upsert option                                   |
| `251-bulk_write`               | Bulk Operations           | Shows how to perform multiple operations (insert, update) in a single bulk write operation                                     |
| `252-insert-many`              | Bulk Data Import          | Demonstrates importing data from JSON files using `insertMany()` for customers and products collections                        |
| `275-find`                     | Query Operations          | Comprehensive example of different find operations: point reads, queries by unique/non-unique values, find all, and pagination |
| `280-aggregation`              | Aggregation Pipeline      | Contains two aggregation examples: calculating average prices by category and finding price ranges for bike subcategories      |
| `290-delete-doc`               | Document Deletion         | Shows how to delete single documents with `deleteOne()` and multiple documents with `deleteMany()`                             |
| `299-drop-collection`          | Collection Removal        | Demonstrates dropping/deleting entire collections from the database                                                            |
| `300-drop-database`            | Database Removal          | Shows how to drop/delete an entire database                                                                                    |

## Demo

To run any demo:

1. Ensure Azure infrastructure is deployed (`azd up`)
2. Load sample data (`cd data && ./mongoimport.sh`)
3. Navigate to the desired sample directory
4. Run `npm install && node index.js`demonstrating how to use Azure Cosmos DB with the MongoDB API. This project is designed to run in a development container and deploy to Azure using the Azure Developer CLI.

## Features

This project provides the following features:

- Azure Cosmos DB MongoDB vCore integration samples
- Development container with pre-configured environment
- Azure Developer CLI (azd) deployment automation
- AdventureWorks sample database seeding
- Multiple JavaScript examples demonstrating CRUD operations

## Getting Started

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Visual Studio Code](https://code.visualstudio.com/) with [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
- [Azure Developer CLI](https://learn.microsoft.com/azure/developer/azure-developer-cli/install-azd)
- Active Azure subscription

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Azure-Samples/cosmos-db-mongodb-api-javascript-samples.git
   cd cosmos-db-mongodb-api-javascript-samples
   ```

2. Open in development container:

   - Open the project in VS Code
   - When prompted, select "Reopen in Container" or use `Ctrl+Shift+P` → "Dev Containers: Reopen in Container"

3. Deploy to Azure:
   ```bash
   azd up
   ```

### Quickstart

1. **Deploy infrastructure**: The `azd up` command provisions Azure Cosmos DB vCore and creates a root `.env` file with connection strings
2. **Load sample data**: Navigate to the data directory and run the import script:
   ```bash
   cd data
   ./mongoimport.sh
   ```
3. **Run samples**: Each subdirectory contains a focused example:
   ```bash
   cd 001-quickstart
   npm install
   node index.js
   ```

## Project Structure

- **Root `.env`**: Contains Azure connection strings (auto-generated by azd)
- **`/data`**: Contains AdventureWorks sample data and import scripts
- **`/001-quickstart`**: Basic CRUD operations example
- **`/275-find`**: Query and find operations example
- **`/infra`**: Bicep templates for Azure infrastructure

Each sample directory references the root `.env` file for Azure Cosmos DB connection details.

## Demo

The included samples demonstrate:

1. **Basic Operations** (`001-quickstart`):

   - Connect to Azure Cosmos DB MongoDB vCore
   - Create database and collection
   - Insert, update, and query documents

2. **Advanced Queries** (`275-find`):
   - Point reads with partition keys
   - Complex query operations
   - Index usage examples

To run any demo:

1. Ensure Azure infrastructure is deployed (`azd up`)
2. Load sample data (`cd data && ./create-adventureworks.sh`)
3. Navigate to the desired sample directory
4. Run `npm install && node index.js`

## Resources

- [Azure Cosmos DB MongoDB API Documentation](https://docs.microsoft.com/azure/cosmos-db/mongodb/)
- [Azure Developer CLI Documentation](https://learn.microsoft.com/azure/developer/azure-developer-cli/)
- [MongoDB Node.js Driver Documentation](https://mongodb.github.io/node-mongodb-native/)
- [Development Containers Documentation](https://containers.dev/)
