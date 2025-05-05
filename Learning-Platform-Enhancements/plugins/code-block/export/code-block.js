/**
 * CodeBlock Export iDevice
 *
 * Renders the saved XML code block as a read-only CodeMirror editor.
 *
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Your Name for http://exelearning.net/
 *
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 */
var $codeBlockIdevice = {
	// Entry point
	init: function() {
	var self = this;
	this.loadDependencies(function(){
		self.renderCodeBlocks();
	});
	},

	// Dynamically inject CodeMirror CSS/JS into <head>
	loadDependencies: function(callback) {
	var head = document.getElementsByTagName("head")[0];

	// Core CSS
	var link1 = document.createElement("link");
	link1.rel = "stylesheet";
	link1.href = "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.1/codemirror.min.css";
	head.appendChild(link1);

	// Monokai theme
	var link2 = document.createElement("link");
	link2.rel = "stylesheet";
	link2.href = "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.1/theme/monokai.min.css";
	head.appendChild(link2);

	// Core JS
	var script1 = document.createElement("script");
	script1.src = "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.1/codemirror.min.js";
	script1.onload = function() {
		// XML mode
		var script2 = document.createElement("script");
		script2.src = "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.1/mode/xml/xml.min.js";
		script2.onload = callback;
		head.appendChild(script2);
	};
	head.appendChild(script1);
	},

	// Find each saved <pre> and replace with read-only CodeMirror
	renderCodeBlocks: function() {
	// `.codeBlockIdevice` must match your iDevice wrapper class
	$(".codeBlockIdevice .iDevice_content div.exe-code-block pre").each(function() {
		var preEl = this;
		var code = preEl.textContent;
		CodeMirror(function(node) {
		preEl.parentNode.replaceChild(node, preEl);
		}, {
		value: code,
		mode: "xml",
		theme: "monokai",
		readOnly: "nocursor",
		lineNumbers: true,
		lineWrapping: true
		});
	});
	}
};

// Initialize on DOM ready
$(function() {
	$codeBlockIdevice.init();
});
