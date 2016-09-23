#!/bin/bash

for FILE in png/*.png
  do
    FILENAME=$(basename $FILE)
    EXTENSION=${FILENAME##*.}
    FILENAME=${FILENAME%.*}
    if [ ! -e $FILE ]; then
      echo $FILE.png does not exist
      exit 1;
    fi
    if [ ! -d svg ]; then
      mkdir svg
    fi
    if [ ! -d jpg ]; then
      mkdir jpg
    fi
    #convert the file to a pnm with the alpha channel extracted and eroded by 2px, so potrace can do its thang
    convert $FILE -alpha extract -threshold 0 -morphology Erode Square:2  -negate -transparent white $FILENAME.pnm
    width=$(identify -format "%[fx:w]" $FILE)pt
    height=$(identify -format "%[fx:h]" $FILE)pt
    potrace -W $width -H $height -s -o svg/$FILENAME.svg $FILENAME.pnm
    rm $FILENAME.pnm
    #convert the png to jpg
    convert $FILE -background '#949494' -quality 80 -flatten jpg/$FILENAME.jpg
    # get the image dimensions
  done
