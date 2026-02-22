@echo off
title Codefest Push
color 0A

echo.
echo  ================================
echo   codefest.ai — Push to GitHub
echo  ================================
echo.

cd /d "C:\Users\evren\Codefest"

echo  Pulling latest changes first...
git pull
echo.

echo  Pushing to GitHub...
git push

echo.
if %ERRORLEVEL% == 0 (
    color 0A
    echo  ================================
    echo   Done! Vercel is deploying...
    echo  ================================
) else (
    color 0C
    echo  ================================
    echo   Something went wrong. Check above.
    echo  ================================
)

echo.
pause
