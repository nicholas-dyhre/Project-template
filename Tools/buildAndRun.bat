echo Building the project...
./build.bat
echo Running the project...
cd backend
dotnet run
cd ..
echo Running the frontend...
cd frontend
npm start
cd ..
echo Project is running. Press any key to exit.