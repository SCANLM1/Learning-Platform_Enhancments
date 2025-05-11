/**
 * CodeBlock Edition iDevice
 */
var $exeDevice = {
	i18n: { name: _("CodeBlock") },
	// mason
	// reference to our code mirror instance
	codeMirrorEditor: null,

	init: function() {
		var self = this;

		// inject content security policy 
		// has to be done because rendering html like normal does not work
		// simple <meta> tag has to be rendered within a function
		(function() {
			var meta = document.createElement("meta");
			meta.httpEquiv = "Content-Security-Policy";
			meta.content = ""
				+ "default-src 'self'; "
				+ "script-src 'self' https://cdnjs.cloudflare.com; "
				+ "style-src 'self' https://cdnjs.cloudflare.com; "
				+ "img-src 'self' data:; "
				+ "object-src 'none'; "
				+ "sandbox allow-scripts allow-same-origin; "
				+ "base-uri 'self'; "
				+ "form-action 'self';";
			document.head.appendChild(meta);
		})();

		this.loadDependencies(function() {
			// Build the CodeMirror form
			var html = '\
			<div id="codeBlockForm">\
				<div class="exe-idevice-info">' + _("Code you want to present: ") + '</div>\
				<textarea id="codeBlockEditor"></textarea>\
			</div>';
			// Insert it before the hidden textarea
			var field = $("#activeIdevice textarea.jsContentEditor");
			field.before(html);
			// Restore saved code (if any)
			self.getPreviousValues(field);
			// Init CodeMirror
			var area = document.getElementById("codeBlockEditor");
			if (area) {
				self.codeMirrorEditor = CodeMirror.fromTextArea(area, {
					lineNumbers: true,
					mode: "javascript",
					theme: "monokai",
					lineWrapping: true
				});
			}
		});
	},

	loadDependencies: function(cb) {
		var head = document.head;
		if (typeof CodeMirror === "undefined") {
			// Core CSS
			var l1 = document.createElement("link");
			l1.rel = "stylesheet";
			l1.href = "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.1/codemirror.min.css";
			head.appendChild(l1);
			// Monokai theme
			var l2 = document.createElement("link");
			l2.rel = "stylesheet";
			l2.href = "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.1/theme/monokai.min.css";
			head.appendChild(l2);
			// Core JS
			var s1 = document.createElement("script");
			s1.src = "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.1/codemirror.min.js";
			s1.onload = function() {
				// JavaScript mode
				var s2 = document.createElement("script");
				s2.src = "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.1/mode/javascript/javascript.min.js";
				s2.onload = cb;
				head.appendChild(s2);
			};
			head.appendChild(s1);
		} else cb();
	},


	// save function sanitizes the code and stores it in the hidden textarea

	save: function() {
		var res = "";
		if (this.codeMirrorEditor) {
			// Get the code from the editor
			var c = this.codeMirrorEditor.getValue();
			
			// Sanitize the code using DOMPurify
			var sanitizedCode = DOMPurify.sanitize(c);

			// Wrap the sanitized code in the expected structure
			if (sanitizedCode) res = '<div class="exe-code-block"><pre>' + sanitizedCode + '</pre></div>';
		}
		// Store the sanitized code into the hidden editor field
		$("#activeIdevice textarea.jsContentEditor").val(res);
		return res;
	},

	getPreviousValues: function(field) {
		var content = field.val();
		if (content) {
			var wrapper = $("<div>").html(content);
			var pre = wrapper.find("div.exe-code-block pre").get(0);
			if (pre) {
				var text = pre.textContent;
				$("#codeBlockEditor").val(text);
			}
		}
	}
};

// Translation stub
function _(s) { return s; }

// Kick off edition
$(document).ready(function() {
	$exeDevice.init();
});
