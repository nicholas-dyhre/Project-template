// appServicePlan.bicep - Azure App Service Plan (Free F1 Tier)

@description('App Service Plan name')
param appServicePlanName string

@description('Location for the App Service Plan')
param location string

@description('Environment name')
param environment string

resource appServicePlan 'Microsoft.Web/serverfarms@2022-09-01' = {
  name: appServicePlanName
  location: location
  tags: {
    Environment: environment
  }
  sku: {
    name: 'F1'        // Free tier
    tier: 'Free'
    size: 'F1'
    family: 'F'
    capacity: 1
  }
  kind: 'linux'
  properties: {
    reserved: true    // Required for Linux
    perSiteScaling: false
    maximumElasticWorkerCount: 1
    targetWorkerCount: 1
  }
}

output appServicePlanId string = appServicePlan.id
output appServicePlanName string = appServicePlan.name
