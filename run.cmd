@ECHO OFF

SET program=%1
IF NOT DEFINED program (
    web-ext run --start-url "about:debugging#/runtime/this-firefox" -f deved
) ELSE (
    web-ext run -t chromium
)