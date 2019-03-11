(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Trixie = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
/*
	Stock shaders
*/

exports.default = {
	identity: function identity() {
		return "\n\t\t\tprecision highp float;\n\t\t\tvarying vec2 texCoord;\n\t\t\tuniform sampler2D texture;\n\t\t\tvoid main() {\n\t\t\t\tgl_FragColor = texture2D(texture, texCoord);\n\t\t\t}\n\t\t";
	},
	invert: function invert() {
		return "\n\t\t\tprecision highp float;\n\t\t\tvarying vec2 texCoord;\n\t\t\tuniform sampler2D texture;\n\t\t\tvoid main() {\n\t\t\t\tvec4 color = texture2D(texture, texCoord);\n\t\t\t\tgl_FragColor = vec4(vec3(1.0 - color.rgb), color.a);\n\t\t\t}\n\t\t";
	},
	flip: function flip() {
		return "\n\t\t\tprecision highp float;\n\t\t\tvarying vec2 texCoord;\n\t\t\tuniform sampler2D texture;\n\t\t\tvoid main() {\n\t\t\t\tvec2 coord = vec2(1.0-texCoord.x, texCoord.y);\n\t\t\t\tvec4 color = texture2D(texture, coord);\n\t\t\t\tgl_FragColor = color;\n\t\t\t}\n\t\t";
	},
	blur: function blur() {
		return "\n\t\t\t#define radius 10\n\t\t\tprecision highp float;\n\t\t\tvarying vec2 texCoord;\n\t\t\tuniform vec2 resolution;\n\t\t\tuniform sampler2D texture;\n\t\t\tvoid main() {\n\t\t\t\tvec4 avg = vec4(0);\n\t\t\t\tint count = 0;\n\t\t\t\tfor (int i = -radius; i < radius; i++) {\n\t\t\t\t\tfor (int j = -radius; j < radius; j++) {\n\t\t\t\t\t\tif (i*i+j*j <= radius*radius) {\n\t\t\t\t\t\t\tavg += texture2D(\n\t\t\t\t\t\t\t\ttexture,\n\t\t\t\t\t\t\t\tvec2(texCoord.x + float(i)/resolution.x, texCoord.y + float(j)/resolution.y)\n\t\t\t\t\t\t\t);\n\t\t\t\t\t\t\tcount += 1;\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\tavg = avg / float(count);\n\t\t\t\tgl_FragColor = avg;\n\t\t\t}\n\t\t";
	},
	kaleidoscope4: function kaleidoscope4() {
		return "\n\t\t\tprecision highp float;\n\t\t\tvarying vec2 texCoord;\n\t\t\tuniform sampler2D texture;\n\t\t\tuniform float time;\n\t\t\tvec2 Kaleidoscope( vec2 uv, float n) {\n\t\t\t\tfloat PI = 3.1415926535897932384626433832795;\n\t\t    float angle = PI / n;\n\t\t    float r = length( uv );\n\t\t    float a = atan( uv.y, uv.x ) / angle;\n\t\t    a = mix( fract( a ), 1.0 - fract( a ), mod( floor( a ), 2.0 ) ) * angle;\n\t\t    // radial = vec2(a, r);\n\t\t    return vec2( cos( a ), sin( a ) ) * r;\n\t\t  }\n\t\t\tvoid main() {\n\t\t\t\tfloat rotation = 0.0;\n\t\t\t\tfloat scale = 1.0;\n\t\t\t\tvec2 pos = vec2(0.5, 0.5);\n\t\t\t\tfloat blades = 4.0;\n\t\t\t\tvec2 uv = texCoord.xy - 0.5;\n\t\t\t\tvec2 k = Kaleidoscope(uv * mat2(cos(rotation), -sin(rotation), sin(rotation), cos(rotation)), blades);\n\t\t\t\tmat2 rm = mat2(cos(rotation), -sin(rotation), sin(rotation), cos(rotation));\n\t\t\t\tvec2 colour_k = rm * (k * scale + pos);\n\t\t\t\tvec4 color = texture2D(texture, colour_k);\n\t\t\t\tgl_FragColor = color;\n\t\t\t}\n\t\t";
	},
	kaleidoscope6: function kaleidoscope6() {
		return "\n\t\t\tprecision highp float;\n\t\t\tvarying vec2 texCoord;\n\t\t\tuniform sampler2D texture;\n\t\t\tuniform float time;\n\t\t\tvec2 Kaleidoscope( vec2 uv, float n) {\n\t\t\t\tfloat PI = 3.1415926535897932384626433832795;\n\t\t    float angle = PI / n;\n\t\t    float r = length( uv );\n\t\t    float a = atan( uv.y, uv.x ) / angle;\n\t\t    a = mix( fract( a ), 1.0 - fract( a ), mod( floor( a ), 2.0 ) ) * angle;\n\t\t    // radial = vec2(a, r);\n\t\t    return vec2( cos( a ), sin( a ) ) * r;\n\t\t  }\n\t\t\tvoid main() {\n\t\t\t\tfloat rotation = 0.0;\n\t\t\t\tfloat scale = 1.0;\n\t\t\t\tvec2 pos = vec2(0.5, 0.5);\n\t\t\t\tfloat blades = 6.0;\n\t\t\t\tvec2 uv = texCoord.xy - 0.5;\n\t\t\t\tvec2 k = Kaleidoscope(uv * mat2(cos(rotation), -sin(rotation), sin(rotation), cos(rotation)), blades);\n\t\t\t\tmat2 rm = mat2(cos(rotation), -sin(rotation), sin(rotation), cos(rotation));\n\t\t\t\tvec2 colour_k = rm * (k * scale + pos);\n\t\t\t\tvec4 color = texture2D(texture, colour_k);\n\t\t\t\tgl_FragColor = color;\n\t\t\t}\n\t\t";
	},
	zoom: function zoom() {
		return "\n\t\t\t\tprecision highp float;\n\t\t\t\tuniform float x;\n\t\t\t\tuniform float y;\n\t\t\t\tuniform float factor;\n\t\t\t\tvarying vec2 texCoord;\n\t\t\t\tuniform sampler2D texture;\n\t\t\t\tvoid main() {\n\t\t\t\t\tvec2 coord = vec2((texCoord.x - x)/factor + x, (texCoord.y - y)/factor + y);\n\t\t\t\t\tvec4 color = texture2D(texture, coord);\n\t\t\t\t\tgl_FragColor = color;\n\t\t\t\t}\n\t\t";
	},
	convolve: function convolve(kernel) {
		return "\n\t\t\t#define size " + kernel.length + "\n\t\t\tprecision highp float;\n\t\t\tvarying vec2 texCoord;\n\t\t\tuniform sampler2D texture;\n\t\t\tuniform float kernel[size];\n\t\t\tuniform vec2 resolution;\n\t\t\tfloat intmod(float a, float b) {\n\t\t\t\t\tfloat m=a-floor((a+0.5)/b)*b;\n\t\t\t\t\treturn floor(m+0.5);\n\t\t\t}\n\t\t\tvoid main() {\n\t\t\t\tvec4 avg = vec4(0);\n\t\t\t\tint len = int(sqrt(float(size)));\n\t\t\t\tfloat total = 0.0;\n\t\t\t\tfor (int i = 0; i < size; i++) {\n\t\t\t\t\tint x = int(intmod(float(i), float(len)));\n\t\t\t\t\tint y = i / len;\n\t\t\t\t\tfloat weight = kernel[i];\n\t\t\t\t\tvec2 dp = vec2(float(x)-(float(len)-1.0)/(2.0), float(y)-(float(len)-1.0)/(2.0));\n\t\t\t\t\tavg += weight*texture2D(texture, texCoord + dp / resolution);\n\t\t\t\t}\n\t\t\t\tgl_FragColor = vec4(avg.xyz, 1.0);\n\t\t\t}\n\t\t";
	},
	verticalMirror: function verticalMirror() {
		return "\n\t\t\tprecision highp float;\n\t\t\tvarying vec2 texCoord;\n\t\t\tuniform sampler2D texture;\n\t\t\tvoid main() {\n\t\t\t\tfloat x;\n\t\t\t\tif (texCoord.x < 0.5) x = texCoord.x;\n\t\t\t\telse x = 1.0 - texCoord.x;\n\t\t\t\tvec4 color = texture2D(texture, vec2(x, texCoord.y));\n\t\t\t\tgl_FragColor = color;\n\t\t\t}\n\t\t";
	},
	horizontalMirror: function horizontalMirror() {
		return "\n\t\t\tprecision highp float;\n\t\t\tvarying vec2 texCoord;\n\t\t\tuniform sampler2D texture;\n\t\t\tvoid main() {\n\t\t\t\tfloat y;\n\t\t\t\tif (texCoord.y < 0.5) y = texCoord.y;\n\t\t\t\telse y = 1.0 - texCoord.y;\n\t\t\t\tvec4 color = texture2D(texture, vec2(texCoord.x, y));\n\t\t\t\tgl_FragColor = color;\n\t\t\t}\n\t\t";
	},
	colorShift: function colorShift() {
		return "\n\t\t\tprecision highp float;\n\t\t\tvarying vec2 texCoord;\n\t\t\tuniform float time;\n\t\t\tuniform sampler2D texture;\n\t\t\tvec3 rgb2hsv(vec3 c) {\n\t\t    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);\n\t\t    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));\n\t\t    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));\n\t\t    float d = q.x - min(q.w, q.y);\n\t\t    float e = 1.0e-10;\n\t\t    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);\n\t\t\t}\n\t\t\tvec3 hsv2rgb(vec3 c) {\n\t\t\t    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);\n\t\t\t    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);\n\t\t\t    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);\n\t\t\t}\n\t\t\tvoid main() {\n\t\t\t\tvec4 cin = texture2D(texture, texCoord);\n\t\t\t\tvec3 hsv = rgb2hsv(cin.rgb);\n\t\t\t\tvec3 cout = hsv2rgb(vec3(fract(hsv.x + time*0.1), hsv.y, hsv.z));\n\t\t\t\tgl_FragColor = vec4(cout, 1.0);\n\t\t\t}\n\t\t";
	},
	void: function _void() {
		return "\n\t\t\tprecision highp float;\n\t\t\tvoid main() {\n\t\t\t\tgl_FragColor = vec4(vec3(0), 1.0);\n\t\t\t}\n\t\t";
	}
};

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Trixie = function () {
	function Trixie(opts) {
		_classCallCheck(this, Trixie);

		this.initialized = false;
		this.uniforms = opts.uniforms || {};
		this.uniformLocations = {};
		this.vertexShader = "\n\t\t\tprecision highp float;\n\t\t\tattribute vec3 position;\n\t\t\tattribute vec2 coord;\n\t\t\tvarying vec2 texCoord;\n\t\t\tvoid main() {\n\t\t\t\ttexCoord = coord;\n\t\t\t  \tgl_Position = vec4(position, 1.0);\n\t\t\t}\n\t\t";
		this.time = 0;
		this.dt = 0.01;
		this.program = null;
		this.gl = null; // output canvas gl context
		this.fragmentShader = opts.shader;
		this.input = opts.input;
		this.output = opts.output;
		return this;
	}

	_createClass(Trixie, [{
		key: "setupTexture",
		value: function setupTexture() {
			var texture = this.gl.createTexture();
			this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
			return texture;
		}
	}, {
		key: "initialize",
		value: function initialize() {
			var _this = this;

			var gl = this.output.getContext("webgl");
			this.gl = gl;
			var vs = gl.createShader(gl.VERTEX_SHADER);
			gl.shaderSource(vs, this.vertexShader);
			gl.compileShader(vs);
			var fs = gl.createShader(gl.FRAGMENT_SHADER);
			gl.shaderSource(fs, this.fragmentShader);
			gl.compileShader(fs);
			var error = gl.getShaderInfoLog(fs);
			if (error) console.error(error);
			this.program = gl.createProgram();
			gl.attachShader(this.program, vs);
			gl.attachShader(this.program, fs);
			gl.linkProgram(this.program);
			gl.useProgram(this.program);
			this.setupTexture();
			if (this.input) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.input);
			var texture = this.setupTexture();
			var fbo = gl.createFramebuffer();
			gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
			gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
			gl.bindFramebuffer(gl.FRAMEBUFFER, null); // make it draw canvas
			this.uniformLocations.time = gl.getUniformLocation(this.program, "time");
			this.uniformLocations.resolution = gl.getUniformLocation(this.program, "resolution");
			this.uniformLocations.texture = gl.getUniformLocation(this.program, "texture");
			Object.keys(this.uniforms).forEach(function (name) {
				_this.uniformLocations[name] = gl.getUniformLocation(_this.program, name);
			});
			var verts = [-1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, -1.0, 0.0, -1.0, 1.0, 0.0, 1.0, -1.0, 0.0, -1.0, -1.0, 0.0];
			var buffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
			var position = gl.getAttribLocation(this.program, "position");
			gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 0, 0);
			gl.enableVertexAttribArray(position);
			var texCoordData = [0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0];
			var tbuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, tbuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoordData), gl.STATIC_DRAW);
			var texCoord = gl.getAttribLocation(this.program, "coord");
			if (texCoord >= 0) {
				gl.vertexAttribPointer(texCoord, 2, gl.FLOAT, false, 0, 0);
				gl.enableVertexAttribArray(texCoord);
			}
			this.initialized = true;
		}
	}, {
		key: "render",
		value: function render() {
			var _this2 = this;

			if (!this.initialized) this.initialize();
			var gl = this.gl;
			if (this.input) {
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.input);
			}
			gl.uniform1i(this.uniformLocations.texture, 0);
			gl.uniform2f(this.uniformLocations.resolution, this.output.width, this.output.height);
			gl.uniform1f(this.uniformLocations.time, this.time);
			Object.keys(this.uniforms).forEach(function (name) {
				if (typeof _this2.uniforms[name] === 'number') gl.uniform1f(_this2.uniformLocations[name], _this2.uniforms[name]);else if (_typeof(_this2.uniforms[name]) === 'object') gl.uniform1fv(_this2.uniformLocations[name], _this2.uniforms[name]);else console.error('Error: unsupported uniform type (' + _typeof(_this2.uniforms[name]) + ')');
			});
			this.output.width = this.output.scrollWidth;
			this.output.height = this.output.scrollHeight;
			gl.viewport(0, 0, this.output.width, this.output.height);
			//gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			gl.drawArrays(gl.TRIANGLES, 0, 6);
			this.time += this.dt;
			return this;
		}
	}]);

	return Trixie;
}();

exports.default = Trixie;

Trixie.shaders = require('./shaders.js').default;
Trixie.uniforms = require('./uniforms.js').default;
module.exports = Trixie;

},{"./shaders.js":1,"./uniforms.js":3}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
/*
	Uniforms for stock shaders
*/

exports.default = {
	zoom: {
		x: 0.5,
		y: 0.5,
		factor: 2.0
	}
};

},{}]},{},[2])(2)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2hhZGVycy5qcyIsInNyYy90cml4aWUuanMiLCJzcmMvdW5pZm9ybXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztBQ0FBOzs7O2tCQUllO0FBQ2QsU0FEYyxzQkFDSDtBQUNWO0FBUUEsRUFWYTtBQVdkLE9BWGMsb0JBV0w7QUFDUjtBQVNBLEVBckJhO0FBc0JkLEtBdEJjLGtCQXNCUDtBQUNOO0FBVUEsRUFqQ2E7QUFrQ2QsS0FsQ2Msa0JBa0NQO0FBQ047QUF3QkEsRUEzRGE7QUE0RGQsY0E1RGMsMkJBNERFO0FBQ2Y7QUEyQkEsRUF4RmE7QUF5RmQsY0F6RmMsMkJBeUZFO0FBQ2Y7QUEyQkEsRUFySGE7QUFzSGQsS0F0SGMsa0JBc0hQO0FBQ047QUFhQSxFQXBJYTtBQXFJZCxTQXJJYyxvQkFxSUwsTUFySUssRUFxSUc7QUFDaEIsbUNBQ2dCLE9BQU8sTUFEdkI7QUF5QkEsRUEvSmE7QUFnS2QsZUFoS2MsNEJBZ0tHO0FBQ2hCO0FBWUEsRUE3S2E7QUE4S2QsaUJBOUtjLDhCQThLSztBQUNsQjtBQVlBLEVBM0xhO0FBNExkLFdBNUxjLHdCQTRMRDtBQUNaO0FBeUJBLEVBdE5hO0FBdU5kLEtBdk5jLG1CQXVOUDtBQUNOO0FBTUE7QUE5TmEsQzs7Ozs7Ozs7Ozs7Ozs7O0lDSk0sTTtBQUNwQixpQkFBWSxJQUFaLEVBQWtCO0FBQUE7O0FBQ2pCLE9BQUssV0FBTCxHQUFtQixLQUFuQjtBQUNBLE9BQUssUUFBTCxHQUFnQixLQUFLLFFBQUwsSUFBaUIsRUFBakM7QUFDQSxPQUFLLGdCQUFMLEdBQXdCLEVBQXhCO0FBQ0EsT0FBSyxZQUFMO0FBVUEsT0FBSyxJQUFMLEdBQVksQ0FBWjtBQUNBLE9BQUssRUFBTCxHQUFVLElBQVY7QUFDQSxPQUFLLE9BQUwsR0FBZSxJQUFmO0FBQ0EsT0FBSyxFQUFMLEdBQVUsSUFBVixDQWpCaUIsQ0FpQkQ7QUFDaEIs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RUwsS0FBRyxHQUZFO0FBR0wsVUFBUTtBQUhIO0FBRFEsQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKlxuXHRTdG9jayBzaGFkZXJzXG4qL1xuXG5leHBvcnQgZGVmYXVsdCB7XG5cdGlkZW50aXR5KCkge1xuXHRcdHJldHVybiBgXG5cdFx0XHRwcmVjaXNpb24gaGlnaHAgZmxvYXQ7XG5cdFx0XHR2YXJ5aW5nIHZlYzIgdGV4Q29vcmQ7XG5cdFx0XHR1bmlmb3JtIHNhbXBsZXIyRCB0ZXh0dXJlO1xuXHRcdFx0dm9pZCBtYWluKCkge1xuXHRcdFx0XHRnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQodGV4dHVyZSwgdGV4Q29vcmQpO1xuXHRcdFx0fVxuXHRcdGBcblx0fSxcblx0aW52ZXJ0KCkge1xuXHRcdHJldHVybiBgXG5cdFx0XHRwcmVjaXNpb24gaGlnaHAgZmxvYXQ7XG5cdFx0XHR2YXJ5aW5nIHZlYzIgdGV4Q29vcmQ7XG5cdFx0XHR1bmlmb3JtIHNhbXBsZXIyRCB0ZXh0dXJlO1xuXHRcdFx0dm9pZCBtYWluKCkge1xuXHRcdFx0XHR2ZWM0IGNvbG9yID0gdGV4dHVyZTJEKHRleHR1cmUsIHRleENvb3JkKTtcblx0XHRcdFx0Z2xfRnJhZ0NvbG9yID0gdmVjNCh2ZWMzKDEuMCAtIGNvbG9yLnJnYiksIGNvbG9yLmEpO1xuXHRcdFx0fVxuXHRcdGBcblx0fSxcblx0ZmxpcCgpIHtcblx0XHRyZXR1cm4gYFxuXHRcdFx0cHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xuXHRcdFx0dmFyeWluZyB2ZWMyIHRleENvb3JkO1xuXHRcdFx0dW5pZm9ybSBzYW1wbGVyMkQgdGV4dHVyZTtcblx0XHRcdHZvaWQgbWFpbigpIHtcblx0XHRcdFx0dmVjMiBjb29yZCA9IHZlYzIoMS4wLXRleENvb3JkLngsIHRleENvb3JkLnkpO1xuXHRcdFx0XHR2ZWM0IGNvbG9yID0gdGV4dHVyZTJEKHRleHR1cmUsIGNvb3JkKTtcblx0XHRcdFx0Z2xfRnJhZ0NvbG9yID0gY29sb3I7XG5cdFx0XHR9XG5cdFx0YFxuXHR9LFxuXHRibHVyKCkge1xuXHRcdHJldHVybiBgXG5cdFx0XHQjZGVmaW5lIHJhZGl1cyAxMFxuXHRcdFx0cHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xuXHRcdFx0dmFyeWluZyB2ZWMyIHRleENvb3JkO1xuXHRcdFx0dW5pZm9ybSB2ZWMyIHJlc29sdXRpb247XG5cdFx0XHR1bmlmb3JtIHNhbXBsZXIyRCB0ZXh0dXJlO1xuXHRcdFx0dm9pZCBtYWluKCkge1xuXHRcdFx0XHR2ZWM0IGF2ZyA9IHZlYzQoMCk7XG5cdFx0XHRcdGludCBjb3VudCA9IDA7XG5cdFx0XHRcdGZvciAoaW50IGkgPSAtcmFkaXVzOyBpIDwgcmFkaXVzOyBpKyspIHtcblx0XHRcdFx0XHRmb3IgKGludCBqID0gLXJhZGl1czsgaiA8IHJhZGl1czsgaisrKSB7XG5cdFx0XHRcdFx0XHRpZiAoaSppK2oqaiA8PSByYWRpdXMqcmFkaXVzKSB7XG5cdFx0XHRcdFx0XHRcdGF2ZyArPSB0ZXh0dXJlMkQoXG5cdFx0XHRcdFx0XHRcdFx0dGV4dHVyZSxcblx0XHRcdFx0XHRcdFx0XHR2ZWMyKHRleENvb3JkLnggKyBmbG9hdChpKS9yZXNvbHV0aW9uLngsIHRleENvb3JkLnkgKyBmbG9hdChqKS9yZXNvbHV0aW9uLnkpXG5cdFx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRcdGNvdW50ICs9IDE7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGF2ZyA9IGF2ZyAvIGZsb2F0KGNvdW50KTtcblx0XHRcdFx0Z2xfRnJhZ0NvbG9yID0gYXZnO1xuXHRcdFx0fVxuXHRcdGBcblx0fSxcblx0a2FsZWlkb3Njb3BlNCgpIHtcblx0XHRyZXR1cm4gYFxuXHRcdFx0cHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xuXHRcdFx0dmFyeWluZyB2ZWMyIHRleENvb3JkO1xuXHRcdFx0dW5pZm9ybSBzYW1wbGVyMkQgdGV4dHVyZTtcblx0XHRcdHVuaWZvcm0gZmxvYXQgdGltZTtcblx0XHRcdHZlYzIgS2FsZWlkb3Njb3BlKCB2ZWMyIHV2LCBmbG9hdCBuKSB7XG5cdFx0XHRcdGZsb2F0IFBJID0gMy4xNDE1OTI2NTM1ODk3OTMyMzg0NjI2NDMzODMyNzk1O1xuXHRcdCAgICBmbG9hdCBhbmdsZSA9IFBJIC8gbjtcblx0XHQgICAgZmxvYXQgciA9IGxlbmd0aCggdXYgKTtcblx0XHQgICAgZmxvYXQgYSA9IGF0YW4oIHV2LnksIHV2LnggKSAvIGFuZ2xlO1xuXHRcdCAgICBhID0gbWl4KCBmcmFjdCggYSApLCAxLjAgLSBmcmFjdCggYSApLCBtb2QoIGZsb29yKCBhICksIDIuMCApICkgKiBhbmdsZTtcblx0XHQgICAgLy8gcmFkaWFsID0gdmVjMihhLCByKTtcblx0XHQgICAgcmV0dXJuIHZlYzIoIGNvcyggYSApLCBzaW4oIGEgKSApICogcjtcblx0XHQgIH1cblx0XHRcdHZvaWQgbWFpbigpIHtcblx0XHRcdFx0ZmxvYXQgcm90YXRpb24gPSAwLjA7XG5cdFx0XHRcdGZsb2F0IHNjYWxlID0gMS4wO1xuXHRcdFx0XHR2ZWMyIHBvcyA9IHZlYzIoMC41LCAwLjUpO1xuXHRcdFx0XHRmbG9hdCBibGFkZXMgPSA0LjA7XG5cdFx0XHRcdHZlYzIgdXYgPSB0ZXhDb29yZC54eSAtIDAuNTtcblx0XHRcdFx0dmVjMiBrID0gS2FsZWlkb3Njb3BlKHV2ICogbWF0Mihjb3Mocm90YXRpb24pLCAtc2luKHJvdGF0aW9uKSwgc2luKHJvdGF0aW9uKSwgY29zKHJvdGF0aW9uKSksIGJsYWRlcyk7XG5cdFx0XHRcdG1hdDIgcm0gPSBtYXQyKGNvcyhyb3RhdGlvbiksIC1zaW4ocm90YXRpb24pLCBzaW4ocm90YXRpb24pLCBjb3Mocm90YXRpb24pKTtcblx0XHRcdFx0dmVjMiBjb2xvdXJfayA9IHJtICogKGsgKiBzY2FsZSArIHBvcyk7XG5cdFx0XHRcdHZlYzQgY29sb3IgPSB0ZXh0dXJlMkQodGV4dHVyZSwgY29sb3VyX2spO1xuXHRcdFx0XHRnbF9GcmFnQ29sb3IgPSBjb2xvcjtcblx0XHRcdH1cblx0XHRgO1xuXHR9LFxuXHRrYWxlaWRvc2NvcGU2KCkge1xuXHRcdHJldHVybiBgXG5cdFx0XHRwcmVjaXNpb24gaGlnaHAgZmxvYXQ7XG5cdFx0XHR2YXJ5aW5nIHZlYzIgdGV4Q29vcmQ7XG5cdFx0XHR1bmlmb3JtIHNhbXBsZXIyRCB0ZXh0dXJlO1xuXHRcdFx0dW5pZm9ybSBmbG9hdCB0aW1lO1xuXHRcdFx0dmVjMiBLYWxlaWRvc2NvcGUoIHZlYzIgdXYsIGZsb2F0IG4pIHtcblx0XHRcdFx0ZmxvYXQgUEkgPSAzLjE0MTU5MjY1MzU4OTc5MzIzODQ2MjY0MzM4MzI3OTU7XG5cdFx0ICAgIGZsb2F0IGFuZ2xlID0gUEkgLyBuO1xuXHRcdCAgICBmbG9hdCByID0gbGVuZ3RoKCB1diApO1xuXHRcdCAgICBmbG9hdCBhID0gYXRhbiggdXYueSwgdXYueCApIC8gYW5nbGU7XG5cdFx0ICAgIGEgPSBtaXgoIGZyYWN0KCBhICksIDEuMCAtIGZyYWN0KCBhICksIG1vZCggZmxvb3IoIGEgKSwgMi4wICkgKSAqIGFuZ2xlO1xuXHRcdCAgICAvLyByYWRpYWwgPSB2ZWMyKGEsIHIpO1xuXHRcdCAgICByZXR1cm4gdmVjMiggY29zKCBhICksIHNpbiggYSApICkgKiByO1xuXHRcdCAgfVxuXHRcdFx0dm9pZCBtYWluKCkge1xuXHRcdFx0XHRmbG9hdCByb3RhdGlvbiA9IDAuMDtcblx0XHRcdFx0ZmxvYXQgc2NhbGUgPSAxLjA7XG5cdFx0XHRcdHZlYzIgcG9zID0gdmVjMigwLjUsIDAuNSk7XG5cdFx0XHRcdGZsb2F0IGJsYWRlcyA9IDYuMDtcblx0XHRcdFx0dmVjMiB1diA9IHRleENvb3JkLnh5IC0gMC41O1xuXHRcdFx0XHR2ZWMyIGsgPSBLYWxlaWRvc2NvcGUodXYgKiBtYXQyKGNvcyhyb3RhdGlvbiksIC1zaW4ocm90YXRpb24pLCBzaW4ocm90YXRpb24pLCBjb3Mocm90YXRpb24pKSwgYmxhZGVzKTtcblx0XHRcdFx0bWF0MiBybSA9IG1hdDIoY29zKHJvdGF0aW9uKSwgLXNpbihyb3RhdGlvbiksIHNpbihyb3RhdGlvbiksIGNvcyhyb3RhdGlvbikpO1xuXHRcdFx0XHR2ZWMyIGNvbG91cl9rID0gcm0gKiAoayAqIHNjYWxlICsgcG9zKTtcblx0XHRcdFx0dmVjNCBjb2xvciA9IHRleHR1cmUyRCh0ZXh0dXJlLCBjb2xvdXJfayk7XG5cdFx0XHRcdGdsX0ZyYWdDb2xvciA9IGNvbG9yO1xuXHRcdFx0fVxuXHRcdGA7XG5cdH0sXG5cdHpvb20oKSB7XG5cdFx0cmV0dXJuIGBcblx0XHRcdFx0cHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xuXHRcdFx0XHR1bmlmb3JtIGZsb2F0IHg7XG5cdFx0XHRcdHVuaWZvcm0gZmxvYXQgeTtcblx0XHRcdFx0dW5pZm9ybSBmbG9hdCBmYWN0b3I7XG5cdFx0XHRcdHZhcnlpbmcgdmVjMiB0ZXhDb29yZDtcblx0XHRcdFx0dW5pZm9ybSBzYW1wbGVyMkQgdGV4dHVyZTtcblx0XHRcdFx0dm9pZCBtYWluKCkge1xuXHRcdFx0XHRcdHZlYzIgY29vcmQgPSB2ZWMyKCh0ZXhDb29yZC54IC0geCkvZmFjdG9yICsgeCwgKHRleENvb3JkLnkgLSB5KS9mYWN0b3IgKyB5KTtcblx0XHRcdFx0XHR2ZWM0IGNvbG9yID0gdGV4dHVyZTJEKHRleHR1cmUsIGNvb3JkKTtcblx0XHRcdFx0XHRnbF9GcmFnQ29sb3IgPSBjb2xvcjtcblx0XHRcdFx0fVxuXHRcdGBcblx0fSxcblx0Y29udm9sdmUoa2VybmVsKSB7XG5cdFx0cmV0dXJuIGBcblx0XHRcdCNkZWZpbmUgc2l6ZSAke2tlcm5lbC5sZW5ndGh9XG5cdFx0XHRwcmVjaXNpb24gaGlnaHAgZmxvYXQ7XG5cdFx0XHR2YXJ5aW5nIHZlYzIgdGV4Q29vcmQ7XG5cdFx0XHR1bmlmb3JtIHNhbXBsZXIyRCB0ZXh0dXJlO1xuXHRcdFx0dW5pZm9ybSBmbG9hdCBrZXJuZWxbc2l6ZV07XG5cdFx0XHR1bmlmb3JtIHZlYzIgcmVzb2x1dGlvbjtcblx0XHRcdGZsb2F0IGludG1vZChmbG9hdCBhLCBmbG9hdCBiKSB7XG5cdFx0XHRcdFx0ZmxvYXQgbT1hLWZsb29yKChhKzAuNSkvYikqYjtcblx0XHRcdFx0XHRyZXR1cm4gZmxvb3IobSswLjUpO1xuXHRcdFx0fVxuXHRcdFx0dm9pZCBtYWluKCkge1xuXHRcdFx0XHR2ZWM0IGF2ZyA9IHZlYzQoMCk7XG5cdFx0XHRcdGludCBsZW4gPSBpbnQoc3FydChmbG9hdChzaXplKSkpO1xuXHRcdFx0XHRmbG9hdCB0b3RhbCA9IDAuMDtcblx0XHRcdFx0Zm9yIChpbnQgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcblx0XHRcdFx0XHRpbnQgeCA9IGludChpbnRtb2QoZmxvYXQoaSksIGZsb2F0KGxlbikpKTtcblx0XHRcdFx0XHRpbnQgeSA9IGkgLyBsZW47XG5cdFx0XHRcdFx0ZmxvYXQgd2VpZ2h0ID0ga2VybmVsW2ldO1xuXHRcdFx0XHRcdHZlYzIgZHAgPSB2ZWMyKGZsb2F0KHgpLShmbG9hdChsZW4pLTEuMCkvKDIuMCksIGZsb2F0KHkpLShmbG9hdChsZW4pLTEuMCkvKDIuMCkpO1xuXHRcdFx0XHRcdGF2ZyArPSB3ZWlnaHQqdGV4dHVyZTJEKHRleHR1cmUsIHRleENvb3JkICsgZHAgLyByZXNvbHV0aW9uKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRnbF9GcmFnQ29sb3IgPSB2ZWM0KGF2Zy54eXosIDEuMCk7XG5cdFx0XHR9XG5cdFx0YFxuXHR9LFxuXHR2ZXJ0aWNhbE1pcnJvcigpIHtcblx0XHRyZXR1cm4gYFxuXHRcdFx0cHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xuXHRcdFx0dmFyeWluZyB2ZWMyIHRleENvb3JkO1xuXHRcdFx0dW5pZm9ybSBzYW1wbGVyMkQgdGV4dHVyZTtcblx0XHRcdHZvaWQgbWFpbigpIHtcblx0XHRcdFx0ZmxvYXQgeDtcblx0XHRcdFx0aWYgKHRleENvb3JkLnggPCAwLjUpIHggPSB0ZXhDb29yZC54O1xuXHRcdFx0XHRlbHNlIHggPSAxLjAgLSB0ZXhDb29yZC54O1xuXHRcdFx0XHR2ZWM0IGNvbG9yID0gdGV4dHVyZTJEKHRleHR1cmUsIHZlYzIoeCwgdGV4Q29vcmQueSkpO1xuXHRcdFx0XHRnbF9GcmFnQ29sb3IgPSBjb2xvcjtcblx0XHRcdH1cblx0XHRgO1xuXHR9LFxuXHRob3Jpem9udGFsTWlycm9yKCkge1xuXHRcdHJldHVybiBgXG5cdFx0XHRwcmVjaXNpb24gaGlnaHAgZmxvYXQ7XG5cdFx0XHR2YXJ5aW5nIHZlYzIgdGV4Q29vcmQ7XG5cdFx0XHR1bmlmb3JtIHNhbXBsZXIyRCB0ZXh0dXJlO1xuXHRcdFx0dm9pZCBtYWluKCkge1xuXHRcdFx0XHRmbG9hdCB5O1xuXHRcdFx0XHRpZiAodGV4Q29vcmQueSA8IDAuNSkgeSA9IHRleENvb3JkLnk7XG5cdFx0XHRcdGVsc2UgeSA9IDEuMCAtIHRleENvb3JkLnk7XG5cdFx0XHRcdHZlYzQgY29sb3IgPSB0ZXh0dXJlMkQodGV4dHVyZSwgdmVjMih0ZXhDb29yZC54LCB5KSk7XG5cdFx0XHRcdGdsX0ZyYWdDb2xvciA9IGNvbG9yO1xuXHRcdFx0fVxuXHRcdGA7XG5cdH0sXG5cdGNvbG9yU2hpZnQoKSB7XG5cdFx0cmV0dXJuIGBcblx0XHRcdHByZWNpc2lvbiBoaWdocCBmbG9hdDtcblx0XHRcdHZhcnlpbmcgdmVjMiB0ZXhDb29yZDtcblx0XHRcdHVuaWZvcm0gZmxvYXQgdGltZTtcblx0XHRcdHVuaWZvcm0gc2FtcGxlcjJEIHRleHR1cmU7XG5cdFx0XHR2ZWMzIHJnYjJoc3YodmVjMyBjKSB7XG5cdFx0ICAgIHZlYzQgSyA9IHZlYzQoMC4wLCAtMS4wIC8gMy4wLCAyLjAgLyAzLjAsIC0xLjApO1xuXHRcdCAgICB2ZWM0IHAgPSBtaXgodmVjNChjLmJnLCBLLnd6KSwgdmVjNChjLmdiLCBLLnh5KSwgc3RlcChjLmIsIGMuZykpO1xuXHRcdCAgICB2ZWM0IHEgPSBtaXgodmVjNChwLnh5dywgYy5yKSwgdmVjNChjLnIsIHAueXp4KSwgc3RlcChwLngsIGMucikpO1xuXHRcdCAgICBmbG9hdCBkID0gcS54IC0gbWluKHEudywgcS55KTtcblx0XHQgICAgZmxvYXQgZSA9IDEuMGUtMTA7XG5cdFx0ICAgIHJldHVybiB2ZWMzKGFicyhxLnogKyAocS53IC0gcS55KSAvICg2LjAgKiBkICsgZSkpLCBkIC8gKHEueCArIGUpLCBxLngpO1xuXHRcdFx0fVxuXHRcdFx0dmVjMyBoc3YycmdiKHZlYzMgYykge1xuXHRcdFx0ICAgIHZlYzQgSyA9IHZlYzQoMS4wLCAyLjAgLyAzLjAsIDEuMCAvIDMuMCwgMy4wKTtcblx0XHRcdCAgICB2ZWMzIHAgPSBhYnMoZnJhY3QoYy54eHggKyBLLnh5eikgKiA2LjAgLSBLLnd3dyk7XG5cdFx0XHQgICAgcmV0dXJuIGMueiAqIG1peChLLnh4eCwgY2xhbXAocCAtIEsueHh4LCAwLjAsIDEuMCksIGMueSk7XG5cdFx0XHR9XG5cdFx0XHR2b2lkIG1haW4oKSB7XG5cdFx0XHRcdHZlYzQgY2luID0gdGV4dHVyZTJEKHRleHR1cmUsIHRleENvb3JkKTtcblx0XHRcdFx0dmVjMyBoc3YgPSByZ2IyaHN2KGNpbi5yZ2IpO1xuXHRcdFx0XHR2ZWMzIGNvdXQgPSBoc3YycmdiKHZlYzMoZnJhY3QoaHN2LnggKyB0aW1lKjAuMSksIGhzdi55LCBoc3YueikpO1xuXHRcdFx0XHRnbF9GcmFnQ29sb3IgPSB2ZWM0KGNvdXQsIDEuMCk7XG5cdFx0XHR9XG5cdFx0YFxuXHR9LFxuXHR2b2lkKCkge1xuXHRcdHJldHVybiBgXG5cdFx0XHRwcmVjaXNpb24gaGlnaHAgZmxvYXQ7XG5cdFx0XHR2b2lkIG1haW4oKSB7XG5cdFx0XHRcdGdsX0ZyYWdDb2xvciA9IHZlYzQodmVjMygwKSwgMS4wKTtcblx0XHRcdH1cblx0XHRgXG5cdH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFRyaXhpZSB7XG5cdGNvbnN0cnVjdG9yKG9wdHMpIHtcblx0XHR0aGlzLmluaXRpYWxpemVkID0gZmFsc2U7XG5cdFx0dGhpcy51bmlmb3JtcyA9IG9wdHMudW5pZm9ybXMgfHzCoHt9O1xuXHRcdHRoaXMudW5pZm9ybUxvY2F0aW9ucyA9IHt9O1xuXHRcdHRoaXMudmVydGV4U2hhZGVyID0gYFxuXHRcdFx0cHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xuXHRcdFx0YXR0cmlidXRlIHZlYzMgcG9zaXRpb247XG5cdFx0XHRhdHRyaWJ1dGUgdmVjMiBjb29yZDtcblx0XHRcdHZhcnlpbmcgdmVjMiB0ZXhDb29yZDtcblx0XHRcdHZvaWQgbWFpbigpIHtcblx0XHRcdFx0dGV4Q29vcmQgPSBjb29yZDtcblx0XHRcdCAgXHRnbF9Qb3NpdGlvbiA9IHZlYzQocG9zaXRpb24sIDEuMCk7XG5cdFx0XHR9XG5cdFx0YDtcblx0XHR0aGlzLnRpbWUgPSAwO1xuXHRcdHRoaXMuZHQgPSAwLjAxO1xuXHRcdHRoaXMucHJvZ3JhbSA9IG51bGw7XG5cdFx0dGhpcy5nbCA9IG51bGw7IC8vIG91dHB1dCBjYW52YXMgZ2wgY29udGV4dFxuXHRcdHRoaXMuZnJhZ21lbnRTaGFkZXIgPSBvcHRzLnNoYWRlcjtcblx0XHR0aGlzLmlucHV0ID0gb3B0cy5pbnB1dDtcblx0XHR0aGlzLm91dHB1dCA9IG9wdHMub3V0cHV0O1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cdHNldHVwVGV4dHVyZSgpIHtcblx0XHR2YXIgdGV4dHVyZSA9IHRoaXMuZ2wuY3JlYXRlVGV4dHVyZSgpO1xuXHRcdHRoaXMuZ2wuYmluZFRleHR1cmUodGhpcy5nbC5URVhUVVJFXzJELCB0ZXh0dXJlKTtcblx0XHR0aGlzLmdsLnRleFBhcmFtZXRlcmkodGhpcy5nbC5URVhUVVJFXzJELCB0aGlzLmdsLlRFWFRVUkVfV1JBUF9TLCB0aGlzLmdsLkNMQU1QX1RPX0VER0UpO1xuXHRcdHRoaXMuZ2wudGV4UGFyYW1ldGVyaSh0aGlzLmdsLlRFWFRVUkVfMkQsIHRoaXMuZ2wuVEVYVFVSRV9XUkFQX1QsIHRoaXMuZ2wuQ0xBTVBfVE9fRURHRSk7XG5cdFx0dGhpcy5nbC50ZXhQYXJhbWV0ZXJpKHRoaXMuZ2wuVEVYVFVSRV8yRCwgdGhpcy5nbC5URVhUVVJFX01JTl9GSUxURVIsIHRoaXMuZ2wuTkVBUkVTVCk7XG5cdFx0dGhpcy5nbC50ZXhQYXJhbWV0ZXJpKHRoaXMuZ2wuVEVYVFVSRV8yRCwgdGhpcy5nbC5URVhUVVJFX01BR19GSUxURVIsIHRoaXMuZ2wuTkVBUkVTVCk7XG5cdFx0cmV0dXJuIHRleHR1cmU7XG5cdH1cblx0aW5pdGlhbGl6ZSgpIHtcblx0XHR2YXIgZ2wgPSB0aGlzLm91dHB1dC5nZXRDb250ZXh0KFwid2ViZ2xcIik7XG5cdFx0dGhpcy5nbCA9IGdsO1xuXHRcdHZhciB2cyA9IGdsLmNyZWF0ZVNoYWRlcihnbC5WRVJURVhfU0hBREVSKTtcblx0XHRnbC5zaGFkZXJTb3VyY2UodnMsIHRoaXMudmVydGV4U2hhZGVyKTtcblx0XHRnbC5jb21waWxlU2hhZGVyKHZzKTtcblx0XHR2YXIgZnMgPSBnbC5jcmVhdGVTaGFkZXIoZ2wuRlJBR01FTlRfU0hBREVSKTtcblx0XHRnbC5zaGFkZXJTb3VyY2UoZnMsIHRoaXMuZnJhZ21lbnRTaGFkZXIpO1xuXHRcdGdsLmNvbXBpbGVTaGFkZXIoZnMpO1xuXHRcdGxldCBlcnJvciA9IGdsLmdldFNoYWRlckluZm9Mb2coZnMpO1xuXHRcdGlmIChlcnJvcikgY29uc29sZS5lcnJvcihlcnJvcik7XG5cdFx0dGhpcy5wcm9ncmFtID0gZ2wuY3JlYXRlUHJvZ3JhbSgpO1xuXHRcdGdsLmF0dGFjaFNoYWRlcih0aGlzLnByb2dyYW0sIHZzKTtcblx0XHRnbC5hdHRhY2hTaGFkZXIodGhpcy5wcm9ncmFtLCBmcyk7XG5cdFx0Z2wubGlua1Byb2dyYW0odGhpcy5wcm9ncmFtKTtcblx0XHRnbC51c2VQcm9ncmFtKHRoaXMucHJvZ3JhbSk7XG5cdFx0dGhpcy5zZXR1cFRleHR1cmUoKTtcblx0XHRpZiAodGhpcy5pbnB1dCkgZ2wudGV4SW1hZ2UyRChnbC5URVhUVVJFXzJELCAwLCBnbC5SR0JBLCBnbC5SR0JBLCBnbC5VTlNJR05FRF9CWVRFLCB0aGlzLmlucHV0KTtcblx0XHR2YXIgdGV4dHVyZSA9IHRoaXMuc2V0dXBUZXh0dXJlKCk7XG4gIFx0dmFyIGZibyA9IGdsLmNyZWF0ZUZyYW1lYnVmZmVyKCk7XG4gIFx0Z2wuYmluZEZyYW1lYnVmZmVyKGdsLkZSQU1FQlVGRkVSLCBmYm8pO1xuXHRcdGdsLmZyYW1lYnVmZmVyVGV4dHVyZTJEKGdsLkZSQU1FQlVGRkVSLCBnbC5DT0xPUl9BVFRBQ0hNRU5UMCwgZ2wuVEVYVFVSRV8yRCwgdGV4dHVyZSwgMCk7XG5cdFx0Z2wuYmluZEZyYW1lYnVmZmVyKGdsLkZSQU1FQlVGRkVSLCBudWxsKTsgLy8gbWFrZSBpdCBkcmF3IGNhbnZhc1xuXHRcdHRoaXMudW5pZm9ybUxvY2F0aW9ucy50aW1lID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHRoaXMucHJvZ3JhbSwgXCJ0aW1lXCIpO1xuXHRcdHRoaXMudW5pZm9ybUxvY2F0aW9ucy5yZXNvbHV0aW9uID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHRoaXMucHJvZ3JhbSwgXCJyZXNvbHV0aW9uXCIpO1xuXHRcdHRoaXMudW5pZm9ybUxvY2F0aW9ucy50ZXh0dXJlID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHRoaXMucHJvZ3JhbSwgXCJ0ZXh0dXJlXCIpO1xuXHRcdE9iamVjdC5rZXlzKHRoaXMudW5pZm9ybXMpLmZvckVhY2gobmFtZSA9PiB7XG5cdFx0XHR0aGlzLnVuaWZvcm1Mb2NhdGlvbnNbbmFtZV0gPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24odGhpcy5wcm9ncmFtLCBuYW1lKTtcblx0XHR9KTtcblx0XHR2YXIgdmVydHMgPSBbXG5cdFx0XHQtMS4wLCAxLjAsIDAuMCxcblx0XHRcdDEuMCwgMS4wLCAwLjAsXG5cdFx0XHQxLjAsIC0xLjAsIDAuMCxcblx0XHRcdC0xLjAsIDEuMCwgMC4wLFxuXHRcdFx0MS4wLCAtMS4wLCAwLjAsXG5cdFx0XHQtMS4wLCAtMS4wLCAwLjAsXG5cdFx0XTtcblx0XHR2YXIgYnVmZmVyID0gZ2wuY3JlYXRlQnVmZmVyKCk7XG5cdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIGJ1ZmZlcik7XG5cdFx0Z2wuYnVmZmVyRGF0YShnbC5BUlJBWV9CVUZGRVIsIG5ldyBGbG9hdDMyQXJyYXkodmVydHMpLCBnbC5TVEFUSUNfRFJBVyk7XG5cdFx0dmFyIHBvc2l0aW9uID0gZ2wuZ2V0QXR0cmliTG9jYXRpb24odGhpcy5wcm9ncmFtLCBcInBvc2l0aW9uXCIpO1xuXHRcdGdsLnZlcnRleEF0dHJpYlBvaW50ZXIocG9zaXRpb24sIDMsIGdsLkZMT0FULCBmYWxzZSwgMCwgMCk7XG5cdFx0Z2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkocG9zaXRpb24pO1xuXHRcdHZhciB0ZXhDb29yZERhdGEgPSBbXG5cdFx0XHQwLjAsIDAuMCxcblx0XHRcdDEuMCwgMC4wLFxuXHRcdFx0MS4wLCAxLjAsXG5cdFx0XHQwLjAsIDAuMCxcblx0XHRcdDEuMCwgMS4wLFxuXHRcdFx0MC4wLCAxLjAsXG5cdFx0XTtcblx0XHR2YXIgdGJ1ZmZlciA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xuXHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCB0YnVmZmVyKTtcblx0XHRnbC5idWZmZXJEYXRhKGdsLkFSUkFZX0JVRkZFUiwgbmV3IEZsb2F0MzJBcnJheSh0ZXhDb29yZERhdGEpLCBnbC5TVEFUSUNfRFJBVyk7XG5cdFx0dmFyIHRleENvb3JkID0gZ2wuZ2V0QXR0cmliTG9jYXRpb24odGhpcy5wcm9ncmFtLCBcImNvb3JkXCIpO1xuXHRcdGlmICh0ZXhDb29yZCA+PSAwKSB7XG5cdFx0XHRnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKHRleENvb3JkLCAyLCBnbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xuXHRcdFx0Z2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkodGV4Q29vcmQpO1xuXHRcdH1cblx0XHR0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcblx0fVxuXHRyZW5kZXIoKSB7XG5cdFx0aWYgKCF0aGlzLmluaXRpYWxpemVkKSB0aGlzLmluaXRpYWxpemUoKTtcblx0XHR2YXIgZ2wgPSB0aGlzLmdsO1xuXHRcdGlmICh0aGlzLmlucHV0KSB7XG5cdFx0XHRnbC50ZXhJbWFnZTJEKGdsLlRFWFRVUkVfMkQsIDAsIGdsLlJHQkEsIGdsLlJHQkEsIGdsLlVOU0lHTkVEX0JZVEUsIHRoaXMuaW5wdXQpO1xuXHRcdH1cblx0XHRnbC51bmlmb3JtMWkodGhpcy51bmlmb3JtTG9jYXRpb25zLnRleHR1cmUsIDApO1xuXHRcdGdsLnVuaWZvcm0yZih0aGlzLnVuaWZvcm1Mb2NhdGlvbnMucmVzb2x1dGlvbiwgdGhpcy5vdXRwdXQud2lkdGgsIHRoaXMub3V0cHV0LmhlaWdodCk7XG5cdFx0Z2wudW5pZm9ybTFmKHRoaXMudW5pZm9ybUxvY2F0aW9ucy50aW1lLCB0aGlzLnRpbWUpO1xuXHRcdE9iamVjdC5rZXlzKHRoaXMudW5pZm9ybXMpLmZvckVhY2gobmFtZSA9PiB7XG5cdFx0XHRpZiAodHlwZW9mIHRoaXMudW5pZm9ybXNbbmFtZV0gPT09ICdudW1iZXInKSBnbC51bmlmb3JtMWYodGhpcy51bmlmb3JtTG9jYXRpb25zW25hbWVdLCB0aGlzLnVuaWZvcm1zW25hbWVdKTtcblx0XHRcdGVsc2UgaWYgKHR5cGVvZiB0aGlzLnVuaWZvcm1zW25hbWVdID09PSAnb2JqZWN0JykgZ2wudW5pZm9ybTFmdih0aGlzLnVuaWZvcm1Mb2NhdGlvbnNbbmFtZV0sIHRoaXMudW5pZm9ybXNbbmFtZV0pO1xuXHRcdFx0ZWxzZSBjb25zb2xlLmVycm9yKCdFcnJvcjogdW5zdXBwb3J0ZWQgdW5pZm9ybSB0eXBlICgnICsgdHlwZW9mIHRoaXMudW5pZm9ybXNbbmFtZV0gKyAnKScpO1xuXHRcdH0pO1xuXHRcdHRoaXMub3V0cHV0LndpZHRoID0gdGhpcy5vdXRwdXQuc2Nyb2xsV2lkdGg7XG5cdFx0dGhpcy5vdXRwdXQuaGVpZ2h0ID0gdGhpcy5vdXRwdXQuc2Nyb2xsSGVpZ2h0O1xuXHRcdGdsLnZpZXdwb3J0KDAsIDAsIHRoaXMub3V0cHV0LndpZHRoLCB0aGlzLm91dHB1dC5oZWlnaHQpO1xuXHRcdC8vZ2wuY2xlYXIoZ2wuQ09MT1JfQlVGRkVSX0JJVCB8IGdsLkRFUFRIX0JVRkZFUl9CSVQpO1xuXHRcdGdsLmRyYXdBcnJheXMoZ2wuVFJJQU5HTEVTLCAwLCA2KTtcblx0XHR0aGlzLnRpbWUgKz0gdGhpcy5kdDtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxufVxuVHJpeGllLnNoYWRlcnMgPSByZXF1aXJlKCcuL3NoYWRlcnMuanMnKS5kZWZhdWx0O1xuVHJpeGllLnVuaWZvcm1zID0gcmVxdWlyZSgnLi91bmlmb3Jtcy5qcycpLmRlZmF1bHQ7XG5tb2R1bGUuZXhwb3J0cyA9IFRyaXhpZTtcbiIsIi8qXG5cdFVuaWZvcm1zIGZvciBzdG9jayBzaGFkZXJzXG4qL1xuXG5leHBvcnQgZGVmYXVsdCB7XG5cdHpvb206IHtcblx0XHR4OiAwLjUsXG5cdFx0eTogMC41LFxuXHRcdGZhY3RvcjogMi4wXG5cdH1cbn1cbiJdfQ==
