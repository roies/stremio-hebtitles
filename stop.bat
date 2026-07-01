@echo off
setlocal

title SubSync

echo Stopping SubSync...
taskkill /F /FI "WINDOWTITLE eq SubSync" /T 2>nul
if errorlevel 1 (
  echo No SubSync process was found.
) else (
  echo SubSync stopped.
)
pause
