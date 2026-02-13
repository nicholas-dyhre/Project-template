echo building backend
cd backend
dotnet build
cd ..
echo building frontend
cd frontend
npm install
npm run build
cd ..
echo build complete
pause