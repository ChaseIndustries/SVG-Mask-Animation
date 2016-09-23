# SVG Mask Animation jQuery plugin

Create HTML5 transparent Canvas animations with SVG Masks over a sequence of JPEG Images

## Advantages over using HTML5 video

- Plays on mobile browsers
- Easily control filesize (less overhead)
- Ability to play and create transparent videos

## Setup Instructions

- Clone repo
- Drop a transparent png sequence in the /png folder (sequence ends with 1, 2, 3, etc...)
- Open terminal and run `bash png2svg.sh` - This will convert your pngs to svg masks and jpeg counterparts located in /svg and /jpg folders, respectively
*If you would like to use a spritesheet instead, convert your images into a spritesheet by running `bash png2sprites.sh`*
- IMPORTANT: For this to work, you need to have a 'placeholder' image, with the dimensions you want for your video.  Create a placeholder by copying the first frame of your video and renaming it "placeholder.jpg"
- Move your images into your project folder

## Javascript Instructions

- Create a `<canvas id="my-canvas"></canvas>` element and put your placholder `<img src="placeholder.jpg" class="my-placeholder/>` on the page

To initialize the animation: 

```javascript
$('#my-canvas').SVGAnimation(
         imageDir : 'your-image-directory', 
         svgDir : 'your-image-directory/svg',
         endAt : 100,
         startAt : 0,
         onload : 'play',
         fps : 30,
         prefix : '',
         placeholder : '.my-placeholder',
         positionX : 0,
         positionY : 0,
         loop : false,
         add : [],
         progressive : false,
         spritesheet : {
            rows : null,
            cols : null, 
            src : ''
         }
      });
```

## Options

`imageDir` : string
The directory containing your jpeg images
         
`svgDir` : string
The directory containing your svg masks (created by pn2svg.sh)

`startAt` : integer
The frame to start at

`endAt` : integer
The frame to end the animation

`onload` : string
What to do when the animation loads.  Either `play` or null **(Optional)** 
         
`fps` : integer
Frames per second (default:30)

`prefix` : string
The prefix of the filenames.  If your sequence is `image-1`, `image-2`, the prefix would be `image-`

`placeholder` : string
The class of the placeholder image.  This controls the dimensions of the canvas        

`positionX` : integer
The X offset of the images projected on the canvas (default: 0)

`positionY` : integer
The Y offset of the images projected on the canvas (default: 0)

`loop` : boolean
Whether or not to loop the animation

`add` : array
Array of additional images to project onto the canvas (if you need something like a shadow)  Include full directory.
         
`progressive` : boolean
Whether to start playing as the images are loaded rather than waiting for them all to load first.  Note that this will not work if you load a spritesheet. (default : false)

`spritesheet` : object

```javascript
{
  rows : null,
  cols : null, 
  src : ''
}
```
Specify the rows, columns, and location of the spritesheet you want to use.  If included, this will be used instead of loading all the images individually (although masks are still loaded individually)

## Optional Methods

`this.goToFrame(idx)`
Projects a specified frame onto the canvas

`this.play()`
Plays the animatino

`this.setPositions()`
Sets any positioning on the canvas element
