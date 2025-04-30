/**
 * CodeBlock Edition iDevice
 */
var $exeDevice = {
	i18n: { name: _("CodeBlock") },
	codeMirrorEditor: null,
  
	init: function() {
	  var self = this;
	  this.loadDependencies(function() {
		// 1) Build the CodeMirror form
		var html = '\
		  <div id="codeBlockForm">\
			<div class="exe-idevice-info">'+ _("Code you want to present: ") +'</div>\
			<textarea id="codeBlockEditor"></textarea>\
		  </div>';
		// 2) Insert it before the hidden textarea
		var field = $("#activeIdevice textarea.jsContentEditor");
		field.before(html);
		// 3) Restore saved code (if any)
		self.getPreviousValues(field);
		// 4) Init CodeMirror
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
  
	save: function() {
	  var res = "";
	  if (this.codeMirrorEditor) {
		var c = this.codeMirrorEditor.getValue();
		if (c) res = '<div class="exe-code-block"><pre>' + c + '</pre></div>';
	  }
	  // Store into the hidden editor field
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
  function _(s){ return s; }
  
  // Kick off edition
  $(document).ready(function(){
	$exeDevice.init();
  });
  