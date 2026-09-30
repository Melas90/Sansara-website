@echo off
rem Double-click to see the website on your computer: starts the preview server and opens the browser.
rem The page rebuilds on every reload, so changes to pages/ show up as you save. Close this window to stop.
cd /d "%~dp0"
echo Starting the Sansara website preview at http://localhost:4321/ ...
start "" "http://localhost:4321/"
npm run dev
