#!/bin/bash
# based on a script from http://invisible-island.net/xterm/xterm.faq.html
# http://stackoverflow.com/questions/2575037/how-to-get-the-cursor-position-in-bash

echo "\[\033[6n\]"
read a <<< $(echo "\033[6n")
echo $a