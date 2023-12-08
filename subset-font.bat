setlocal enabledelayedexpansion

del /s *.woff
del /s *.woff2

call npx glyphhanger ./index.html --cssSelector="h1, #me h3, #me h4" > temp.txt
set /p glyphs= < temp.txt
call npx glyphhanger --whitelist=%glyphs%1234567890 --subset=./fonts/noto-sans-jp-bold.ttf --formats=woff-zopfli,woff2

call npx glyphhanger ./index.html --family="Noto Sans JP, sans-serif" > temp.txt
set /p glyphs= < temp.txt
call npx glyphhanger --whitelist=%glyphs%1234567890 --subset=./fonts/noto-sans-jp-regular.ttf --formats=woff-zopfli,woff2

call npx glyphhanger ./index.html --family="Chihaya Jun" > temp.txt
set /p glyphs= < temp.txt
call npx glyphhanger --whitelist=%glyphs% --subset=./fonts/chihaya-jun.ttf --formats=woff-zopfli,woff2

del temp.txt

cd ./fonts
for %%f in (*-subset.zopfli.woff) do (set temp=%%f && ren "%%f" "!temp:~0,-20!.woff")
for %%f in (*-subset.woff2) do (set temp=%%f && ren "%%f" "!temp:~0,-14!.woff2")

pause
