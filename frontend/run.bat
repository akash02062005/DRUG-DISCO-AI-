@echo off
REM Run the DrugDisco AI frontend locally on Windows.
cd /d %~dp0

if not exist node_modules (
  echo ==^> Installing npm dependencies
  npm install
)

echo ==^> Starting frontend at http://localhost:3000
npm start
