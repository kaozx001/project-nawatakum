@echo off
git remote remove origin
git remote add origin https://github.com/kaozx001/project-nawatagum.git
git branch -M main
git push -u origin main
pause
