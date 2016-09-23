#!/bin/bash

# convert all the pngs to jpg spritesheet
if [ ! -d spritesheet ]; then
  mkdir spritesheet
fi
montage -background '#949494' -geometry +1+1 -quality 75 png/*.png spritesheet/spritesheet.jpg