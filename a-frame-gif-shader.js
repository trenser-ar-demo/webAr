// import { parseGIF } from './aframe-gif-shader-master/lib/gifsparser.js'

if (typeof AFRAME === 'undefined') {
    throw 'Component attempted to register before AFRAME was available.'
}

/* get util from AFRAME */
const { parseUrl } = AFRAME.utils.srcLoader
const { debug } = AFRAME.utils
// debug.enable('shader:gif:*')
debug.enable('shader:gif:warn')
const warn = debug('shader:gif:warn')
const log = debug('shader:gif:debug')

/* store data so that you won't load same data */
const gifData = {}

/* create error message */
function createError(err, src) {
    return { status: 'error', src: src, message: err, timestamp: Date.now() }
}


AFRAME.registerShader('draw-canvas', {

    schema: {

        /* For material */
        color: { type: 'color' },
        fog: { default: false },

        /* For texuture */
        src: { default: null },
        autoplay: { default: true },
        // opacity: {type: 'number', is: 'uniform', default: 1.0}

    },
    /**
     * Initialize material. Called once.
     * @protected
     */
    init: function init(data) {

        this.canvasAsset = document.getElementById('my-canvas');
        this.canvasAssetCtx = this.canvasAsset.getContext('2d');

        this.__material = {};
        this.__cnv = document.createElement('canvas');
        this.__cnv.width = 2;
        this.__cnv.height = 2;
        this.__ctx = this.__cnv.getContext('2d');
        this.__texture = new THREE.CanvasTexture(this.__cnv); //renders straight from a canvas
        this.__texture.needsUpdate = true;
        this.__reset();
        // console.log('color : ', new THREE.Color( 0x800080 ));
        this.material = new THREE.MeshBasicMaterial({
            map: this.__texture,
            fog: false,
            transparent: true,
            opacity: 1.0,
            // alphaTest: 0.5
            // color: 0x800080
        });
        // this.material.color.setStyle("#0000ffff");
        console.log(this.material.toJSON());
        this.__texture.needsUpdate = true;

        this._fillImages((images) => {
            console.log(images);
            this.__frames = images;
            this.__addPublicFunctions();
            this.el.sceneEl.addBehavior(this);
            this.__updateTexture(data);
        });
        return this.material;
    },


    /**
     * Update or create material.
     * @param {object|null} oldData
     */
    update: function update(oldData) {
        // console.log('update', oldData);
        this.__updateTexture(oldData);
        return this.material;
    },


    /**
     * Called on each scene tick.
     * @protected
     */
    tick: function tick(t) {
        if (!this.__frames || this.paused()) return;
        if (Date.now() - this.__startTime >= this.__nextFrameTime) {
            this.nextFrame();
        }
    },


    /*================================
    =            material            =
    ================================*/

    /**
     * Updating existing material.
     * @param {object} data - Material component data.
     */
    __updateMaterial: function __updateMaterial(data) {
        var material = this.material;

        var newData = this.__getMaterialData(data);
        Object.keys(newData).forEach(function (key) {
            if (key === 'color') {
                material[key] = ''
            }
            material[key] = newData[key];
        });
    },


    /**
     * Builds and normalize material data, normalizing stuff along the way.
     * @param {Object} data - Material data.
     * @return {Object} data - Processed material data.
     */
    __getMaterialData: function __getMaterialData(data) {
        return {
            // fog: data.fog,
            // color: new THREE.Color('black'),
            // fog: false,
            // transparent: false,
            // opacity: 1.0,
            // alpha:1.0,
            // alphaTest:1.0,
            // vertexColors:false
            // side: THREE.BackSide,
            // vertexColors: THREE.VertexColors
        };
    },


    /*==============================
    =            texure            =
    ==============================*/

    /**
     * set texure
     * @private
     * @param {Object} data
     * @property {string} status - success / error
     * @property {string} src - src url
     * @property {array} times - array of time length of each image
     * @property {number} cnt - total counts of gif images
     * @property {array} frames - array of each image
     * @property {Date} timestamp - created at the texure
     */

    __setTexure: function __setTexure(data) {
        log('__setTexure', data);
        if (data.status === 'error') {
            warn('Error: ' + data.message + '\nsrc: ' + data.src);
            this.__reset();
        } else if (data.status === 'success' && data.src !== this.__textureSrc) {
            this.__reset();
            /* Texture added or changed */
            this.__ready(data);
            console.log('ready');
        }
    },


    /**
     * Update or create texure.
     * @param {Object} data - Material component data.
     */
    __updateTexture: function __updateTexture(data) {
        var src = data.src;
        var autoplay = data.autoplay;

        /* autoplay */

        if (typeof autoplay === 'boolean') {
            this.__autoplay = autoplay;
        } else if (typeof autoplay === 'undefined') {
            this.__autoplay = true;
        }
        if (this.__autoplay && this.__frames) {
            this.play();
        }

        /* src */
        if (src) {
            this.__validateSrc(src, this.__setTexure.bind(this));
        } else {
            /* Texture removed */
            this.__reset();
        }
    },


    /*=============================================
    =            varidation for texure            =
    =============================================*/

    __validateSrc: function __validateSrc(src, cb) {

        /* check if src is a url */
        var url = parseUrl(src);
        if (url) {
            this.__getImageSrc(url, cb);
            return;
        }

        var message = void 0;

        /* check if src is a query selector */
        var el = this.__validateAndGetQuerySelector(src);
        if (!el || (typeof el === 'undefined' ? 'undefined' : typeof el) !== 'object') {
            return;
        }
        if (el.error) {
            message = el.error;
        } else {
            var tagName = el.tagName.toLowerCase();
            if (tagName === 'video') {
                src = el.src;
                message = 'For video, please use `aframe-video-shader`';
            } else if (tagName === 'img') {
                this.__getImageSrc(el.src, cb);
                return;
            } else {
                message = 'For <' + tagName + '> element, please use `aframe-html-shader`';
            }
        }

        /* if there is message, create error data */
        if (message) {
            (function () {
                var srcData = gifData[src];
                var errData = createError(message, src);
                /* callbacks */
                if (srcData && srcData.callbacks) {
                    srcData.callbacks.forEach(function (cb) {
                        return cb(errData);
                    });
                } else {
                    cb(errData);
                }
                /* overwrite */
                gifData[src] = errData;
            })();
        }
    },


    /**
     * Validate src is a valid image url
     * @param  {string} src - url that will be tested
     * @param  {function} cb - callback with the test result
     */
    __getImageSrc: function __getImageSrc(src, cb) {
        var _this = this;

        /* if src is same as previous, ignore this */
        if (src === this.__textureSrc) {
            return;
        }

        /* check if we already get the srcData */
        var srcData = gifData[src];
        if (!srcData || !srcData.callbacks) {
            /* create callback */
            srcData = gifData[src] = { callbacks: [] };
            srcData.callbacks.push(cb);
        } else if (srcData.src) {
            cb(srcData);
            return;
        } else if (srcData.callbacks) {
            /* add callback */
            srcData.callbacks.push(cb);
            return;
        }
        var tester = new Image();
        tester.crossOrigin = 'Anonymous';
        tester.addEventListener('load', function (e) {
            /* check if it is gif */
            _this.__getUnit8Array(src, function (arr) {
                if (!arr) {
                    onError('This is not gif. Please use `shader:flat` instead');
                    return;
                }
                console.log('getimage');

                /* parse data */
                parseGIFShader(arr, function (times, cnt, frames) {
                    console.log('getimage 1');
                    /* store data */
                    var newData = { status: 'success', src: src, times: times, cnt: cnt, frames: frames, timestamp: Date.now() };
                    /* callbacks */
                    if (srcData.callbacks) {
                        srcData.callbacks.forEach(function (cb) {
                            return cb(newData);
                        });
                        /* overwrite */
                        gifData[src] = newData;
                    }
                }, function (err) {
                    console.log('getimage 2');

                    return onError(err);
                });
            });
        });
        tester.addEventListener('error', function (e) {
            return onError('Could be the following issue\n - Not Image\n - Not Found\n - Server Error\n - Cross-Origin Issue');
        });
        function onError(message) {
            /* create error data */
            var errData = createError(message, src);
            /* callbacks */
            if (srcData.callbacks) {
                srcData.callbacks.forEach(function (cb) {
                    return cb(errData);
                });
                /* overwrite */
                gifData[src] = errData;
            }
        }
        tester.src = src;
    },


    /**
     *
     * get mine type
     *
     */
    __getUnit8Array: function __getUnit8Array(src, cb) {
        if (typeof cb !== 'function') {
            return;
        }

        var xhr = new XMLHttpRequest();
        xhr.open('GET', src);
        xhr.responseType = 'arraybuffer';
        xhr.addEventListener('load',  (e)=> {
            var uint8Array = new Uint8Array(e.target.response);

            var gif = parseGIFUCT(e.target.response);
            console.log(gif);
            var frames = decompressFrames(gif, true);
            // console.log(frames)
            this.__delayTimes = [];
             frames.forEach((frame)=>{
                this.__delayTimes.push(frame.delay);
            });
            console.log(this.__delayTimes);

            var arr = uint8Array.subarray(0, 4);
            // const header = arr.map(value => value.toString(16)).join('')
            var header = '';
            for (var i = 0; i < arr.length; i++) {
                header += arr[i].toString(16);
            }
            if (header === '47494638') {
                cb(uint8Array);
            } else {
                cb();
            }
        });
        xhr.addEventListener('error', function (e) {
            log(e);
            cb();
        });
        xhr.send();
    },


    /**
     * Query and validate a query selector,
     *
     * @param  {string} selector - DOM selector.
     * @return {object} Selected DOM element | error message object.
     */
    __validateAndGetQuerySelector: function __validateAndGetQuerySelector(selector) {
        try {
            var el = document.querySelector(selector);
            if (!el) {
                return { error: 'No element was found matching the selector' };
            }
            return el;
        } catch (e) {
            // Capture exception if it's not a valid selector.
            return { error: 'no valid selector' };
        }
    },


    /*================================
    =            playback            =
    ================================*/

    /**
     * add public functions
     * @private
     */
    __addPublicFunctions: function __addPublicFunctions() {
        this.el.gif = {
            play: this.play.bind(this),
            pause: this.pause.bind(this),
            togglePlayback: this.togglePlayback.bind(this),
            paused: this.paused.bind(this),
            nextFrame: this.nextFrame.bind(this)
        };
    },


    /**
     * Pause gif
     * @public
     */
    pause: function pause() {
        log('pause');
        this.__paused = true;
    },


    /**
     * Play gif
     * @public
     */
    play: function play() {
        log('play');
        this.__paused = false;
    },


    /**
     * Toggle playback. play if paused and pause if played.
     * @public
     */

    togglePlayback: function togglePlayback() {

        if (this.paused()) {
            this.play();
        } else {
            this.pause();
        }
    },


    /**
     * Return if the playback is paused.
     * @public
     * @return {boolean}
     */
    paused: function paused() {
        return this.__paused;
    },


    /**
     * Go to next frame
     * @public
     */
    nextFrame: function nextFrame() {
        this.__draw();

        /* update next frame time */
        while (Date.now() - this.__startTime >= this.__nextFrameTime) {

            this.__nextFrameTime += this.__delayTimes[this.__frameIdx++];
            if ((this.__infinity || this.__loopCnt) && this.__frameCnt <= this.__frameIdx) {
                /* go back to the first */
                this.__frameIdx = 0;
            }
        }
    },


    /*==============================
     =            canvas            =
     ==============================*/

    /**
     * clear canvas
     * @private
     */
    __clearCanvas: function __clearCanvas() {
        this.canvasAssetCtx.clearRect(0, 0, this.__width, this.__height);
        document.getElementById("#modelEntaImage").setAttribute('material', 'src', '');
        this.__ctx.clearRect(0, 0, this.__width, this.__height);
        this.__texture.needsUpdate = true;
    },


    /**
     * draw
     * @private
     */
    __draw: function __draw() {
        this.__clearCanvas();
        // var image = new Image();
        // image.src = this.__frames[this.__frameIdx].src;
        // const img = document.getElementById('butterflies');
        // img.src = this.__frames[this.__frameIdx].src
        if (this.__frames && this.__frames.length > 0) {
            this.canvasAssetCtx.drawImage(this.__frames[this.__frameIdx], 0, 0, this.__width, this.__height);
            document.getElementById("#modelEntaImage").setAttribute('material', 'src', '#my-canvas');
            this.__ctx.drawImage(this.__frames[this.__frameIdx], 0, 0, this.__width, this.__height);
            // console.log(image);

            this.__texture.needsUpdate = true;
        }
    },


    /*============================
    =            ready            =
    ============================*/

    /**
     * setup gif animation and play if autoplay is true
     * @private
     * @property {string} src - src url
     * @param {array} times - array of time length of each image
     * @param {number} cnt - total counts of gif images
     * @param {array} frames - array of each image
     */
    __ready: function __ready(_ref) {
        var src = _ref.src;
        var times = _ref.times;
        var cnt = _ref.cnt;
        var frames = _ref.frames;
        console.log("refs :", _ref);

        this.__textureSrc = src;
        // this.__delayTimes = times;
        cnt ? this.__loopCnt = cnt : this.__infinity = true;
        // this.__infinity = true;
        // this.__frames = frames;
        this.__frameCnt = times.length;
        this.__startTime = Date.now();
        this.__width = THREE.Math.floorPowerOfTwo(frames[0].width);
        this.__height = THREE.Math.floorPowerOfTwo(frames[0].height);
        this.__cnv.width = this.__width;
        this.__cnv.height = this.__height;
        this.canvasAsset.width = this.__width;
        this.canvasAsset.height = this.__height;
        this.__draw();
        if (this.__autoplay) {
            this.play();
        } else {
            this.pause();
        }
    },


    /*=============================
    =            reset            =
    =============================*/

    /**
     * @private
     */

    __reset: function __reset() {
        console.log('reset');
        this.pause();
        this.__clearCanvas();
        this.__startTime = 0;
        this.__nextFrameTime = 0;
        this.__frameIdx = 0;
        this.__frameCnt = 0;
        console.log(this.__delayTimes);
        // this.__delayTimes = null;
        this.__infinity = false;
        this.__loopCnt = 0;
        this.__frames = null;
        this.__textureSrc = null;
    },

    _fillImages: function _fillImages(cb) {
        let c = document.getElementById("myCanvas");
        let ctx = c.getContext("2d");
        ctx.clearRect(0, 0, ctx.width, ctx.height);
        ctx.beginPath();

        let images = [];
        $('div.gifimage img').each((idx, img_tag) => {
            var total = 0;
            if (/^.+\.gif$/.test($(img_tag).prop("src"))) {
                var rub = new SuperGif({
                    gif: img_tag,
                    progressbar_height: 0
                });
                rub.load(function () {

                    // An array for the image references
                    // Keep the reference to save on expensive DOM lookups every iteration.
                    let frames = $("#frames");
                    for (let i = 0; i < rub.get_length(); i++) {
                        total += 1;
                        rub.move_to(i);
                        // var canvas = cloneCanvas(rub.get_canvas());
                        var canvas = rub.get_canvas().toDataURL('image/webp');
                        let img = $('<img id = "gifframe' + i + '"src= "' + canvas + '" class="frameimages" width="360" height="360">');

                        // Use the reference to append the image.
                        // frames.append(img);

                        // Add image to images array with the current index as the array index.
                        // Use the jQuery get method to get the actual DOM element.
                        images[i] = img.get(0);
                    }
                    //   frames.append(images[0]);
                    //   console.log(images[0]);
                    cb(images);
                });
            }
        });
    }
});


parseGIFShader = function (gif, successCB, errorCB) {

    var pos = 0;
    var delayTimes = [];
    var loadCnt = 0;
    var graphicControl = null;
    var imageData = null;
    var frames = [];
    var loopCnt = 0;
    // console.log('parse ',gif);
    if (gif[0] === 0x47 && gif[1] === 0x49 && gif[2] === 0x46 && // 'GIF'
        gif[3] === 0x38 && gif[4] === 0x39 && gif[5] === 0x61) {
        // '89a'
        pos += 13 + +!!(gif[10] & 0x80) * Math.pow(2, (gif[10] & 0x07) + 1) * 3;
        // console.log('parse ',pos);
        var gifHeader = gif.subarray(0, pos);
        while (gif[pos] && gif[pos] !== 0x3b) {
            var offset = pos,
                blockId = gif[pos];
            if (blockId === 0x21) {
                var label = gif[++pos];
                if ([0x01, 0xfe, 0xf9, 0xff].indexOf(label) !== -1) {
                    // label === 0xf9 && console.log('parse delay',pos + 3);
                    // label === 0xf9 && console.log('parse delay2 ',gif[pos + 3], ":", (gif[pos + 4] << 8));
                    label === 0xf9 && delayTimes.push((gif[pos + 3] + (gif[pos + 4] << 8)) * 10);
                    label === 0xff && (loopCnt = gif[pos + 15] + (gif[pos + 16] << 8));
                    while (gif[++pos]) {
                        pos += gif[pos];
                    } label === 0xf9 && (graphicControl = gif.subarray(offset, pos + 1));
                } else {
                    errorCB && errorCB('parseGIF: unknown label'); break;
                }
            } else if (blockId === 0x2c) {
                pos += 9;
                pos += 1 + +!!(gif[pos] & 0x80) * (Math.pow(2, (gif[pos] & 0x07) + 1) * 3);
                while (gif[++pos]) {
                    pos += gif[pos];
                } var imageData = gif.subarray(offset, pos + 1);
                frames.push(URL.createObjectURL(new Blob([gifHeader, graphicControl, imageData])));
            } else {
                errorCB && errorCB('parseGIF: unknown blockId'); break;
            }
            pos++;
        }
    } else {
        errorCB && errorCB('parseGIF: no GIF89a');
    }
    if (frames.length) {

        var cnv = document.createElement('canvas');
        var loadImg = function loadImg() {
            frames.forEach(function (src, i) {
                var img = new Image();
                img.onload = function (e, i) {
                    if (i === 0) {
                        cnv.width = img.width;
                        cnv.height = img.height;
                    }
                    loadCnt++;
                    frames[i] = this;
                    if (loadCnt === frames.length) {
                        loadCnt = 0;
                        imageFix(1);
                    }
                }.bind(img, null, i);
                img.src = src;
                // console.log('img: ', img);
            });
        };
        var imageFix = function imageFix(i) {
            var img = new Image();
            img.onload = function (e, i) {
                loadCnt++;
                frames[i] = this;
                if (loadCnt === frames.length) {
                    cnv = null;
                    successCB && successCB(delayTimes, loopCnt, frames);
                } else {
                    imageFix(++i);
                }
            }.bind(img);
            img.src = cnv.toDataURL('image/gif');
        };
        loadImg();
    }
};