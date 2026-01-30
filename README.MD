# Install frontend dependencies
```
cd Frontend
npm i
```

# Install backend dependencies
```
cd Backend
dotnet restore
```

# Download Postgres: 
https://www.enterprisedb.com/downloads/postgres-postgresql-downloads

## Install:
1) Choose components: PostgreSQL  Server, pgAdmin, Command Line Tools
2) Set installation directory (default is fine)
3) Set data directory (default is fine)
4) Set password for postgres user (remember this - e.g., "postgres123")
5) Set port (default 5432)
6) Choose locale (default is fine)
7) Complete installation

Verify Installation
1) Open pgAdmin (should be in Start Menu)
2) Connect using: 
- Host: localhost
- Port: 5432
- Username: postgres
- Password: (the one you set)

## Create Database:´
```
psql -U postgres -h localhost -c "CREATE DATABASE ecommerce_dev;"
```
or 
1) In pgAdmin, right-click "Databases" → Create → Database
2) Name: ecommerce_dev
3) Owner: postgres
4) Click Save


## Update Connection String in appsettings.Development.json
```
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Database=ecommerce_dev;Username=postgres;Password=your_password"
}
```

## Remove existing migrations and create new ones for PostgreSQL:
```
rm -rf Migrations
dotnet ef migrations add InitialCreate
dotnet ef database update
```

# Run the Application
```
cd Backend
dotnet run
```

```
cd Frontend
ng serve --port 4200
```
