<template>
  <div id="app">
    <video id="video" style="display: none"/>
    <div id="canvas-container">
      <canvas id="canvas"></canvas>
    </div>
    <div id="menu" v-if="menu">
      <div id="menu-header">Choose mode</div>
      <div class="menu-items">
        <div
          v-for="mode of modes"
          v-bind:class="'menu-item' + (selectedMode.key == mode.key ? ' menu-item-selected' : '')"
          v-on:click="selectedMode = mode">
          {{mode.name}}
        </div>
      </div>
    </div>
    <div id="top" v-if="!menu">
      <div class="top-item">
        <i class="material-icons" v-on:click="menu = true">menu</i>
      </div>
      <div class="top-item">
        <i class="material-icons" v-if="facingMode == 'environment'" v-on:click="facingMode = 'user'">portrait</i>
        <i class="material-icons" v-if="facingMode == 'user'" v-on:click="facingMode = 'environment'">landscape</i>
      </div>
      <div class="top-item-right">
        <i class="material-icons" v-on:click="captureNextFrame = true">photo_camera</i>
      </div>
    </div>
  </div>
</template>

<script>
import Trixie from '../lib/trixie.js';
export default {
  name: 'App',
  data() {
    return {
      selectedMode: null,
      modes: [
        { name: "Default", key: "identity" },
        { name: "Invert", key: "invert"},
        { name: "Color shift", key: "colorShift"},
        { name: "Vertical mirror", key: "verticalMirror"},
        { name: "Horizontal mirror", key: "horizontalMirror"},
        { name: "Kaleidoscope 4", key: "kaleidoscope4"},
        { name: "Kaleidoscope 6", key: "kaleidoscope6"},
        { name: "Sharpen", key: "convolve", uniforms: { kernel: [0,-3,0,-3,13,-3,0,-3,0] }, argument: "kernel" },
        { name: "Edge detection", key: "convolve", uniforms: { kernel: [1,1,1,1,-8,1,1,1,1] }, argument: "kernel" }
      ],
      menu: false,
      tx: null,
      captureNextFrame: false,
      facingMode: "environment",
      animating: false,
      mediaStream: null
    }
  },
  watch: {
    selectedMode: function(x) {
      this.tx = new Trixie({
        input: document.getElementById('video'),
        shader: ("uniforms" in this.selectedMode && "argument" in this.selectedMode) ?
          Trixie.shaders[this.selectedMode.key](this.selectedMode.uniforms[this.selectedMode.argument]) :
          Trixie.shaders[this.selectedMode.key](),
        output: document.getElementById("canvas"),
        uniforms: this.selectedMode.uniforms
      });
      this.menu = false;
    },
    facingMode: function(x) {
      this.startStreaming();
    }
  },
  methods: {
    dataURItoBlob(dataURI) {
        // https://stackoverflow.com/questions/4998908/convert-data-uri-to-file-then-append-to-formdata
        // convert base64/URLEncoded data component to raw binary data held in a string
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(dataURI.split(',')[1]);
        else
            byteString = unescape(dataURI.split(',')[1]);
        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ia], {type:mimeString});
    },
    saveFrame(frame) {
      var filename = "capture_" + Date.now() + ".png";
      if ('cordova' in window) {
        let blob = this.dataURItoBlob(frame);
        let folderpath = "file:///storage/emulated/0/Download";
        window.resolveLocalFileSystemURL(folderpath, function(dir) {
          dir.getFile(filename, {create:true}, function(file) {
            file.createWriter(function(fileWriter) {
               fileWriter.write(blob);
               alert("Photo saved to Download folder (" + filename + ")");
            }, function(err){
               console.log(err);
            });
          });
        });
      } else {
        let a = document.createElement('a');
        a.href = frame;
        a.download = filename;
        a.click();
      }
    },
    animate() {
      this.tx.render();
      if (this.captureNextFrame) {
        this.captureNextFrame = false;
        let frame = document.getElementById("canvas").toDataURL(); // Second param is quality.
        this.saveFrame(frame);
      }
      window.requestAnimationFrame(this.animate);
    },
    startStreaming() {
      if (this.mediaStream) {
        this.mediaStream.getTracks().forEach(track => track.stop())
      }
      let constraints = { audio: false, video: { facingMode: this.facingMode } };
      navigator.mediaDevices.getUserMedia(constraints).then(mediaStream => {
        this.mediaStream = mediaStream;
        let video = document.getElementById('video');
        video.srcObject = mediaStream;
        video.onloadedmetadata = e => {
          video.play();
          this.tx = new Trixie({
              input: video,
              shader: ("uniforms" in this.selectedMode && "argument" in this.selectedMode) ?
                Trixie.shaders[this.selectedMode.key](this.selectedMode.uniforms[this.selectedMode.argument]) :
                Trixie.shaders[this.selectedMode.key](),
              output: document.getElementById("canvas"),
              uniforms: this.selectedMode.uniforms
          });
          if (!this.animating) {
            this.animating = true;
            this.animate();
          }
        };
      }).catch(err => {
        console.log(err.name + ": " + err.message);
      });
    }
  },
  mounted() {
    this.selectedMode = this.modes[0];
    if ('cordova' in window) {
      document.addEventListener('deviceready', () => {
        cordova.plugins.diagnostic.requestCameraAuthorization(
          status => {
            if (status == cordova.plugins.diagnostic.permissionStatus.GRANTED) {
              this.startStreaming()
            } else {
              console.log("Camera permission denied");
            }
          },
          error => { console.log("Camera authorization error: " + error) },
          false
        );
      });
    } else {
      this.startStreaming();
    }

  }
}
</script>

<style>
html, body, #app {
  width: 100%; height: 100%; margin: 0px; padding: 0px;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
#canvas-container {
  background: black;
  height: calc(100% - 0px);
  width: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
}
#canvas {
  width: 100%;
  height: 100%;
}
#top {
  position: absolute;
  top: 0px;
  left: 0px;
  background: rgba(0,0,0,0.25);
  color: white;
  width: 100%;
  height: 50px;
  line-height: 50px;
}
#menu {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.25);
  color: white;
}
#menu-header {
  height: 50px;
  line-height: 50px;
  background: rgba(0,0,0,0.25);
  padding-left: 20px;
  font-weight: bold;
}
.menu-items {
  padding: 10px;
}
.menu-item {
  margin-bottom: 10px;
  background: rgba(0,0,0,0.125);
  padding: 10px;
}
.menu-item-selected {
  font-weight: bold;
  background: rgba(0,0,0,0.25);
}

.top-item, .top-item-right {
  height: 50px;
}
.top-item > i, .top-item-right > i {
  font-size: 28px;
  line-height: 50px;
}
.top-item {
  margin-left: 10px;
  float: left;
}
.top-item-right {
  float: right;
  margin-right: 10px;
}
</style>
