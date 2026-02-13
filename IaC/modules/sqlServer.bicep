// sqlServer.bicep - Azure SQL Server

@description('SQL Server name')
param sqlServerName string

@description('Location for the SQL Server')
param location string

@description('SQL Server administrator login')
@secure()
param sqlAdminLogin string

@description('SQL Server administrator password')
@secure()
param sqlAdminPassword string

@description('Environment name')
param environment string

resource sqlServer 'Microsoft.Sql/servers@2022-05-01-preview' = {
  name: sqlServerName
  location: location
  tags: {
    Environment: environment
  }
  properties: {
    administratorLogin: sqlAdminLogin
    administratorLoginPassword: sqlAdminPassword
    version: '12.0'
    minimalTlsVersion: '1.2'
    publicNetworkAccess: 'Enabled'
  }
}

// Firewall rule to allow Azure services
resource allowAzureServices 'Microsoft.Sql/servers/firewallRules@2022-05-01-preview' = {
  parent: sqlServer
  name: 'AllowAllWindowsAzureIps'
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '0.0.0.0'
  }
}

// Optional: Allow your development IP (update this IP address)
// Uncomment and set your IP to connect from local machine
/*
resource allowDevelopmentIp 'Microsoft.Sql/servers/firewallRules@2022-05-01-preview' = {
  parent: sqlServer
  name: 'AllowDevelopmentIP'
  properties: {
    startIpAddress: '1.2.3.4'  // Replace with your IP
    endIpAddress: '1.2.3.4'
  }
}
*/

output sqlServerId string = sqlServer.id
output sqlServerName string = sqlServer.name
output sqlServerFqdn string = sqlServer.properties.fullyQualifiedDomainName
