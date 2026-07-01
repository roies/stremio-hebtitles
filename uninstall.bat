@echo off
setlocal

echo This will remove the local .env and node_modules in this folder.
choice /C YN /M "Continue?"
if errorlevel 2 exit /b 0
if errorlevel 1 (
  if exist .env del /q .env
  if exist node_modules rmdir /s /q node_modules
  if exist package-lock.json del /q package-lock.json
  echo Local install files removed.
)
pause
