metadata description = 'Provisions Azure Cosmos DB for MongoDB resources.'

targetScope = 'resourceGroup'

@minLength(1)
@maxLength(64)
@description('Name of the environment that can be used as part of naming resource convention.')
param environmentName string

@minLength(1)
@description('Primary location for all resources.')
param location string

var resourceToken = toLower(uniqueString(resourceGroup().id, environmentName, location))
var tags = {
  'azd-env-name': environmentName
  repo: 'https://github.com/azure-samples/cosmos-db-mongodb-nodejs-quickstart'
}

module cosmosDbAccountVCore 'br/public:avm/res/document-db/mongo-cluster:0.4.0' = {
  name: 'cosmos-db-account-vcore'
  params: {
    name: 'cosmos-db-mongodb-vcore-${resourceToken}'
    location: location
    tags: tags
    nodeCount: 1
    sku: 'M10'
    highAvailabilityMode: 'Disabled'
    storage: 32
    administratorLogin: 'app'
    administratorLoginPassword: 'P0ssw.rd'
    networkAcls: {
      allowAllIPs: true
      allowAzureIPs: true
    }
  }
}


// Outputs
output COSMOS_CONNECTION_STRING string = cosmosDbAccountVCore.outputs.connectionString
output AZURE_COSMOS_ACCOUNT_NAME string = cosmosDbAccountVCore.outputs.name
