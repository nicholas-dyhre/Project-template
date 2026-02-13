// sqlDatabase.bicep - Azure SQL Database (Free Tier - 32GB)

@description('SQL Database name')
param sqlDatabaseName string

@description('SQL Server name')
param sqlServerName string

@description('Location for the SQL Database')
param location string

@description('Environment name')
param environment string

resource sqlDatabase 'Microsoft.Sql/servers/databases@2022-05-01-preview' = {
  name: '${sqlServerName}/${sqlDatabaseName}'
  location: location
  tags: {
    Environment: environment
  }
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  properties: {
    collation: 'SQL_Latin1_General_CP1_CI_AS'
    maxSizeBytes: 30000000000  // 32GB (free tier limit)
    catalogCollation: 'SQL_Latin1_General_CP1_CI_AS'
    zoneRedundant: false
    readScale: 'Disabled'
    requestedBackupStorageRedundancy: 'Local'
    
    // Auto-pause settings (important for free tier cost optimization)
    autoPauseDelay: 5  // Auto-pause after 60 minutes of inactivity
  }
}

// Output connection string (will be passed to App Service)
output connectionString string = 'Server=tcp:${reference(resourceId('Microsoft.Sql/servers', sqlServerName), '2022-05-01-preview').fullyQualifiedDomainName},1433;Initial Catalog=${sqlDatabaseName};Persist Security Info=False;User ID=${reference(resourceId('Microsoft.Sql/servers', sqlServerName), '2022-05-01-preview').administratorLogin};Password={your_password};MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;'
output databaseId string = sqlDatabase.id
output databaseName string = sqlDatabaseName
