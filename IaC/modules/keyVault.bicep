// keyVault.bicep - Azure Key Vault for storing auto-generated credentials

@description('Key Vault name')
param keyVaultName string

@description('Location for the Key Vault')
param location string

@description('Environment name')
param environment string

@description('SQL Server admin login to store')
param sqlAdminLogin string

@description('SQL Server admin password to store')
@secure()
param sqlAdminPassword string

@description('Tenant ID for access policies')
param tenantId string = tenant().tenantId

@description('Object ID of the service principal that needs access')
param servicePrincipalObjectId string = ''

resource keyVault 'Microsoft.KeyVault/vaults@2023-02-01' = {
  name: keyVaultName
  location: location
  tags: {
    Environment: environment
  }
  properties: {
    sku: {
      family: 'A'
      name: 'standard'
    }
    tenantId: tenantId
    enabledForDeployment: true
    enabledForTemplateDeployment: true
    enabledForDiskEncryption: false
    enableSoftDelete: true
    softDeleteRetentionInDays: 7
    enableRbacAuthorization: false
    accessPolicies: [
      // Access policy for Azure DevOps service principal (if provided)
      ...(servicePrincipalObjectId != '' ? [
        {
          tenantId: tenantId
          objectId: servicePrincipalObjectId
          permissions: {
            secrets: [
              'get'
              'list'
            ]
          }
        }
      ] : [])
    ]
  }
}

// Store SQL admin login
resource sqlLoginSecret 'Microsoft.KeyVault/vaults/secrets@2023-02-01' = {
  parent: keyVault
  name: 'sql-admin-login'
  properties: {
    value: sqlAdminLogin
  }
}

// Store SQL admin password
resource sqlPasswordSecret 'Microsoft.KeyVault/vaults/secrets@2023-02-01' = {
  parent: keyVault
  name: 'sql-admin-password'
  properties: {
    value: sqlAdminPassword
  }
}

output keyVaultId string = keyVault.id
output keyVaultName string = keyVault.name
output keyVaultUri string = keyVault.properties.vaultUri
// Note: Secret URIs should not be output for security reasons
// Retrieve secrets directly from Key Vault when needed
