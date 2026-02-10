# Stack
Angular + RxJS Frontend | C# .NET 10 Backend | PostgreSQL Database

# E-Commerce Application

This is a full-stack e-commerce application built with **ASP.NET Core** for the backend and **Angular** for the frontend. The backend provides REST APIs for products, baskets, and checkout functionality, while the frontend offers a responsive shopping experience. PostgreSQL is used as the database, and Entity Framework Core handles data access.

The application includes:

* Product catalog with categories and specifications
* Shopping basket with quantity management
* Checkout process
* Database seeding for initial data
* API client generation with NSwag

---

## Prerequisites

* [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/7.0)
* [Node.js](https://nodejs.org/en/) (with npm)
* [Angular CLI](https://angular.io/cli)
* [PostgreSQL](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads)

---

## 1. Install Dependencies

**Frontend:**

```bash
cd Frontend
npm install
```

**Backend:**

```bash
cd Backend
dotnet restore
```

---

## 2. PostgreSQL Setup

**Install PostgreSQL:**

1. Download and run the installer.
2. Choose components: **PostgreSQL Server**, **pgAdmin**, **Command Line Tools**.
3. Set installation directory (default is fine), data directory (default is fine), password for `postgres` user (e.g., `postgres123`), port (default 5432), and locale (default is fine). Complete the installation.

**Verify Installation:**

* Open **pgAdmin** (Start Menu)
* Connect using:

  * Host: `localhost`
  * Port: `5432`
  * Username: `postgres`
  * Password: the one you set

**Create Database:**

*CLI:*

```bash
psql -U postgres -h localhost -c "CREATE DATABASE ecommerce_dev;"
```

*pgAdmin:*

1. Right-click **Databases** → **Create** → **Database**
2. Name: `ecommerce_dev`
3. Owner: `postgres`
4. Click **Save**

---

## 3. Update Connection String

Edit `Backend/appsettings.Development.json`:

```json
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Database=ecommerce_dev;Username=postgres;Password=your_password"
}
```

Replace `your_password` with the password you set during PostgreSQL installation.

---

## 4. Remove Existing Migrations and Create New Ones

```bash
./Backend/tools/resetDatabase.bat
```

Alternatively comment the Nswag section backend.csproj and run
```bash
dotnet ef database drop
Remove-Item -Recurse -Force Migrations
dotnet ef migrations add InitialCreate
dotnet ef database update
```

---

## 5. Run the Application

**Backend:**

```bash
cd Backend
dotnet run
```

**Frontend:**

```bash
cd Frontend
ng serve --port 4200
```

The frontend will be available at `http://localhost:4200` and will automatically connect to the backend.

---

## 6. First-Time Usage

1. On first run, the backend will seed the database with default categories and products.
2. Open the frontend and browse products.
3. Add products to your basket.
4. The basket will update in real time; you can adjust quantities using the + / - buttons or input a specific amount.
5. Proceed to checkout when ready.

**Tips for First Run:**

* Ensure that localStorage does not contain a previous `basketId` to avoid conflicts with the seeded basket.
* If you change seeded product data (like image URLs), remove the existing database and rerun migrations to apply the updates.

### 6.1 Setup Authentication
1. cd YourBackendProject
2. dotnet user-secrets init
3. dotnet user-secrets set "JwtSettings:SecretKey" "your-super-secret-key-from-last-step"
4. dotnet user-secrets set "JwtSettings:Issuer" "Ecommerce"
5. dotnet user-secrets set "JwtSettings:Audience" "EcommerceUsers"
---

## 7. Additional Notes

* To regenerate API clients with NSwag, uncomment the `<Target Name="NSwag">` section in your `.csproj` file, build the project, then comment it again if needed.
* Use `dotnet ef database drop` to completely reset the database if necessary.
* Frontend basket styling is optimized for a slim, responsive layout with quantity input and remove buttons.
* This setup assumes a single developer environment; adjust PostgreSQL credentials for production use.

---


