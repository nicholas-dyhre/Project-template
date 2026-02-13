// appService.bicep - Azure App Service (Web App)

@description('App Service name')
param appServiceName string

@description('App Service Plan resource ID')
param appServicePlanId string

@description('Location for the App Service')
param location string

@description('Environment name')
param environment string

@description('SQL Database connection string')
@secure()
param sqlConnectionString string

resource appService 'Microsoft.Web/sites@2022-09-01' = {
  name: appServiceName
  location: location
  tags: {
    Environment: environment
  }
  kind: 'app,linux'
  properties: {
    serverFarmId: appServicePlanId
    httpsOnly: true
    clientAffinityEnabled: false
    
    siteConfig: {
      linuxFxVersion: 'DOTNETCORE|10.0'  // .NET 8.0 runtime
      alwaysOn: false                    // Must be false for Free tier
      ftpsState: 'Disabled'
      minTlsVersion: '1.2'
      http20Enabled: true
      
      appSettings: [
        {
          name: 'ASPNETCORE_ENVIRONMENT'
          value: environment
        }
        {
          name: 'WEBSITE_RUN_FROM_PACKAGE'
          value: '1'
        }
        {
          name: 'SCM_DO_BUILD_DURING_DEPLOYMENT'
          value: 'false'
        }
      ]
      
      connectionStrings: [
        {
          name: 'DefaultConnection'
          connectionString: sqlConnectionString
          type: 'SQLAzure'
        }
      ]
      
      // Configure to serve Angular app from wwwroot
      defaultDocuments: [
        'index.html'
      ]
      
      // Handle Angular routing - redirect all routes to index.html
      httpErrors: {
        '404': {
          statusCode: 404
          defaultAction: 'Redirect'
          redirectUrl: '/index.html'
        }
      }
    }
  }
}

output appServiceId string = appService.id
output appServiceName string = appService.name
output appServiceUrl string = 'https://${appService.properties.defaultHostName}'
output appServiceDefaultHostName string = appService.properties.defaultHostName
