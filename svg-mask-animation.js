;( function( $, window, document, undefined ) {

	"use strict";
	
  var pluginName = 'SVGAnimation',
      defaults =  {
         imageDir : 'images', 
         svgDir : 'images/svg',
         endAt : 100,
         startAt : 0,
         onload : 'play',
         fps : 30,
         prefix : '',
         placeholder : '',
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
      };

function SVGAnimation(el, opts) {
  this.opts = $.extend({}, defaults, opts);
  
  this.init(el);
}

$.extend(SVGAnimation.prototype,  {
    init : function(el) {
      
      var self = this;
      
      function pad(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
      }      
      
      function canvasWidth() {
        return parseInt($(self.canvas).width());
      }
      function canvasHeight() {
        return parseInt($(self.canvas).height());
      }
      self.canvas = $(el);
      
      self.preload = document.createElement('div');
      self.preload.setAttribute('class','preload');
      self.preload.setAttribute('style', 'display:none');
      
      $('body').append(self.preload);
      
      self.canvas = self.canvas.get(0);
      self.placeholder = $(self.opts.placeholder);
      
      var cw = canvasWidth();
      var ch = canvasHeight();
      self.totalFrames = self.opts.endAt - self.opts.startAt;
      self.images = [];
      self.masks = [];
      self.addlImages = [];
      self.context = self.canvas.getContext('2d');
      self.loaded = false;
      self.framesLoaded = 0;
      self.currentFrame = 0;
      self.posX = self.opts.positionX;
      self.posY = self.opts.positionY;
      
      
      if(self.opts.add) {
        self.totalAddlImages = self.opts.add.length;
      }
      
      self.setPositions = function() {
        // Reset the height and width to get accurate measurements
        $(self.canvas).attr({ 'height': '', 'width' : '' });
        // Set the canvas width to be the same dimensions of the placeholder
        $(self.canvas).attr({ 'height': self.placeholder.height(), 'width' : self.placeholder.width() });
        cw = canvasWidth();
        ch = canvasHeight();
        drawFrame(self.currentFrame);
      }
      
      function imageLoaded() {
        self.framesLoaded++;
        if(self.framesLoaded == self.totalFrames * 2 + self.totalAddlImages) {
          if(self.opts.onload == 'play') {
            self.play();
          }
          $(el).trigger('svganim.loaded');
          self.loaded = true;
        } else if(self.opts.progressive && self.opts.onload == 'play') {
          var idx = $(this).attr('data-index');
          if(idx) {
            if(idx == 0) {
              $(el).trigger('svganim.loaded');
              self.loaded = true;
              self.goToFrame(idx);
            } else 
            if(idx == self.currentFrame + 1) {
              self.goToFrame(idx);
            }
          }
        }
      }
      
      function loadImage(imageUrl, arr, i) {
         i = i || false;
         var img = new Image(cw, ch);
         if(i) {
          img.setAttribute('data-index', i);
         }
         arr.push(img);
         img.src = imageUrl;
         img.onload = imageLoaded;
         $('.preload').append(img);
      }
      
      function drawFrame(idx) {
        self.currentFrame = idx;
        self.context.clearRect(0, 0, cw, ch);
        self.context.globalCompositeOperation = 'copy';
        // draw the mask
        self.context.drawImage(self.masks[idx], self.posX, self.posY, cw, ch); 
        // draw the image
        self.context.globalCompositeOperation = 'source-in';
        self.context.drawImage(self.images[idx], self.posX, self.posY, cw, ch);
        drawAddlImages();
      }
      
      function drawAddlImages() {
        self.context.globalCompositeOperation = 'source-over';
        if(self.addlImages.length) {
          // Add additional static images on top
          for(var j = 0; j < self.addlImages.length; j++) {
            self.context.drawImage(self.addlImages[j], self.posX, self.posY, cw, ch);
          }
        }
      }      
      
      for(var i = self.opts.startAt; i <= self.opts.endAt; i++) {
        var imageUrl = self.opts.imageDir + '/' + self.opts.prefix + pad(i, 3) + '.jpg'; // Filename of each image
        var maskUrl = self.opts.svgDir + '/' + self.opts.prefix + pad(i, 3) + '.svg';
        loadImage(imageUrl, self.images, i.toString());
        loadImage(maskUrl, self.masks);
        
      }        
      // Load additional images
      if(typeof(self.opts.add) == 'object') {
        for(var j = 0; j < self.opts.add.length; j++) {
          var imageUrl = self.opts.add[j]; // Filename of each image
          loadImage(imageUrl, self.addlImages);
        }
      }
      
      self.goToFrame = function(idx) {
        self.setPositions();
        drawFrame(idx);
      }
      
      self.play = function() {
        self.setPositions();
        var fps = self.opts.fps || 30;
        for(var i = 0; i <= self.totalFrames; i++) {
          setTimeout(function(idx) {
            drawFrame(idx);
            if(self.opts.loop && idx == self.totalFrames) {
              self.play();
            }
          }, i * (1000 / fps), i);
        }
      }
      $(window).on('resize', function() {
        self.setPositions();
      });
      self.setPositions();
    }
  });
  
	$.fn[ pluginName ] = function( opts ) {
		return this.each( function() {
			if ( !$.data( this, "plugin_" + pluginName ) ) {
				$.data( this, "plugin_" +
					pluginName, new SVGAnimation( this, opts ) );
			}
		});
	};

})( jQuery, window, document );
