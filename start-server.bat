
call yarn run postinstall:cache

rem set PATH=G:\Users\The Project\.nvm\node-v18.12.1-win-x64;%PATH%

rem call yarn run start:tsx

call "G:\Users\The Project\.nvm\node-v18.12.1-win-x64\node.exe" --enable-source-maps C:\Users\User\AppData\Roaming\npm\node_modules\tsx\dist\cli.cjs ./server/cluster

pause
