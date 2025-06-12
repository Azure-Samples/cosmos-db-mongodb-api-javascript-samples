metadata description = 'Provisions Azure Cosmos DB for MongoDB resources.'

targetScope = 'resourceGroup'

@minLength(1)
@maxLength(64)
@description('Name of the environment that can be used as part of naming resource convention.')
param environmentName string

@minLength(1)
@description('Primary location for all resources.')
param location string

@allowed([
  'vcore'
  'request-unit'
])
@description('Deployment type for the Azure Cosmos DB for MongoDB account. Defaults to Azure Cosmos DB for MongoDB vCore.')
param deploymentType string = 'request-unit'

var resourceToken = toLower(uniqueString(resourceGroup().id, environmentName, location))
var tags = {
  'azd-env-name': environmentName
  repo: 'https://github.com/azure-samples/cosmos-db-mongodb-nodejs-quickstart'
}

module cosmosDbAccountVCore 'br/public:avm/res/document-db/mongo-cluster:0.1.1' = if (deploymentType == 'vcore') {
  name: 'cosmos-db-account-vcore'
  params: {
    name: 'cosmos-db-mongodb-vcore-${resourceToken}'
    location: location
    tags: tags
    nodeCount: 1
    sku: 'M10'
    highAvailabilityMode: false
    storage: 32
    administratorLogin: 'app'
    administratorLoginPassword: 'P0ssw.rd'
    networkAcls: {
      allowAllIPs: true
      allowAzureIPs: true
    }
  }
}

module cosmosDbAccountRequestUnit 'br/public:avm/res/document-db/database-account:0.11.3' = if (deploymentType == 'request-unit') {
  name: 'cosmos-db-account-ru'
  params: {
    name: 'cosmos-db-mongodb-ru-${resourceToken}'
    location: location
    locations: [
      {
        failoverPriority: 0
        locationName: location
        isZoneRedundant: false
      }
    ]
    tags: tags
    disableKeyBasedMetadataWriteAccess: false
    disableLocalAuth: false
    networkRestrictions: {
      publicNetworkAccess: 'Enabled'
      ipRules: []
      virtualNetworkRules: []
    }
    capabilitiesToAdd: [
      'EnableServerless'
    ]
    mongodbDatabases: [
      {
        name: 'cosmicworks'
        collections: [
          {
            name: 'products'
            indexes: [
              {
                key: {
                  keys: [
                    '_id'
                  ]
                }
              }
              {
                key: {
                  keys: [
                    '$**'
                  ]
                }
              }
              {
                key: {
                  keys: [
                    '_ts'
                  ]
                }
                options: {
                  expireAfterSeconds: 2629746
                }
              }
            ]
            shardKey: {
              category: 'Hash'
            }
          }
        ]
      }
    ]
  }
}

// Outputs
output AZURE_COSMOS_DB_MONGODB_CONNECTION_STRING string = deploymentType == 'vcore' 
  ? replace(replace(cosmosDbAccountVCore.outputs.connectionStringKey, '<user>', 'app'), '<password>', 'P0ssw.rd')
  : cosmosDbAccountRequestUnit.outputs.endpoint

output AZURE_COSMOS_DB_MONGODB_DATABASE_NAME string = 'cosmicworks'
output AZURE_COSMOS_DB_MONGODB_COLLECTION_NAME string = 'products'

