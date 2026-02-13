// main.bicep - Main infrastructure template for e-commerce application
// Deploys: Resource Group, App Service Plan, App Service, SQL Server, SQL Database

targetScope = 'subscription'

@description('Environment name (dev, staging, prod)')
@allowed([
  'dev'
  'staging'
  'prod'
])
param environment string = 'dev'

@description('Location for all resources')
param location string = 'East US'

@description('SQL Server administrator login (auto-generated if not provided)')
@secure()
param sqlAdminLogin string = ''

@description('SQL Server administrator password (auto-generated if not provided)')
@secure()
param sqlAdminPassword string = ''

@description('Application name prefix')
param appName string = 'ecommerce'

// Variables
var resourceGroupName = 'rg-${appName}-${environment}'
var appServicePlanName = 'asp-${appName}-${environment}'
var appServiceName = 'app-${appName}-${environment}'
var sqlServerName = 'sql-${appName}-${environment}-${uniqueString(subscription().subscriptionId)}'
var sqlDatabaseName = '${appName}-db-${environment}'
var keyVaultName = 'kv-${appName}-${substring(uniqueString(subscription().subscriptionId), 0, 8)}'

// Auto-generate SQL credentials using deterministic unique strings
var generatedSqlAdminLogin = 'sqladmin${uniqueString(subscription().subscriptionId, environment)}'
var generatedSqlAdminPassword = '${toUpper(substring(uniqueString(subscription().subscriptionId, environment, 'sql'), 0, 8))}${toLower(substring(uniqueString(subscription().subscriptionId, environment, 'pwd'), 0, 8))}1!'

// Use provided credentials if available, otherwise use generated ones
var actualSqlAdminLogin = sqlAdminLogin != '' ? sqlAdminLogin : generatedSqlAdminLogin
var actualSqlAdminPassword = sqlAdminPassword != '' ? sqlAdminPassword : generatedSqlAdminPassword

// Resource Group
resource resourceGroup 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: resourceGroupName
  location: location
  tags: {
    Environment: environment
    Project: appName
    ManagedBy: 'Bicep'
    CostCenter: 'Development'
  }
}

// Key Vault (to store auto-generated credentials)
module keyVault 'modules/keyVault.bicep' = {
  name: 'deploy-key-vault'
  scope: resourceGroup
  params: {
    keyVaultName: keyVaultName
    location: location
    environment: environment
    sqlAdminLogin: actualSqlAdminLogin
    sqlAdminPassword: actualSqlAdminPassword
  }
}

// App Service Plan (Free Tier F1)
module appServicePlan 'modules/appServicePlan.bicep' = {
  name: 'deploy-app-service-plan'
  scope: resourceGroup
  params: {
    appServicePlanName: appServicePlanName
    location: location
    environment: environment
  }
}

// App Service
module appService 'modules/appService.bicep' = {
  name: 'deploy-app-service'
  scope: resourceGroup
  params: {
    appServiceName: appServiceName
    appServicePlanId: appServicePlan.outputs.appServicePlanId
    location: location
    environment: environment
    sqlConnectionString: sqlDatabase.outputs.connectionString
  }
}

// SQL Server
module sqlServer 'modules/sqlServer.bicep' = {
  name: 'deploy-sql-server'
  scope: resourceGroup
  params: {
    sqlServerName: sqlServerName
    location: location
    sqlAdminLogin: actualSqlAdminLogin
    sqlAdminPassword: actualSqlAdminPassword
    environment: environment
  }
  dependsOn: [
    keyVault
  ]
}

// SQL Database (Free Tier - 32GB)
module sqlDatabase 'modules/sqlDatabase.bicep' = {
  name: 'deploy-sql-database'
  scope: resourceGroup
  params: {
    sqlDatabaseName: sqlDatabaseName
    sqlServerName: sqlServer.outputs.sqlServerName
    location: location
    environment: environment
  }
}

// Outputs
output resourceGroupName string = resourceGroupName
output appServiceName string = appServiceName
output appServiceUrl string = appService.outputs.appServiceUrl
output sqlServerName string = sqlServer.outputs.sqlServerName
output sqlDatabaseName string = sqlDatabaseName
output keyVaultName string = keyVaultName
// Note: Credentials are stored in Key Vault and should be retrieved from there
// Do not output sensitive values like passwords or secret URIs
