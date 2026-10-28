@echo off
title IMovies Full-Stack Platform
set PATH=%~dp0tools\node;%PATH%
echo ====================================================
echo Starting IMovies Full-Stack Cinema Platform...
echo ====================================================
start "IMovies Backend Server" cmd /k "set PATH=%~dp0tools\node;%%PATH%% && cd server && npm start"
timeout /t 3 >nul
start "IMovies Frontend Client" cmd /k "set PATH=%~dp0tools\node;%%PATH%% && cd client && npm run dev"
echo Both services launched!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
pause
