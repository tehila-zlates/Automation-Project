@echo off
echo Installing server dependencies...
cd server
call npm install

echo Installing client dependencies...
cd ..\digital-sign-flow
call npm install

echo All dependencies installed!
pause
