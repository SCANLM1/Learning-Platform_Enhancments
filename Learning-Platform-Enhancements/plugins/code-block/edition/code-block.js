/**
 * Minimal CodeBlock iDevice (edition code) with CodeMirror test functionality
 *
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Ignacio Gros (http://gros.es/) for http://exelearning.net/
 *
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 */
var $exeDevice = {
  
	// i18n settings
	i18n : {
	  name : _("CodeBlock")
	},
	
	// Reference for our CodeMirror instance
	codeMirrorEditor: null,
	
	init : function(){
	  var self = this;
	  
	  // Dynamically load the header dependencies if not already loaded
	  this.loadDependencies(function(){
		
		// Build the simple form containing the enhanced code editor area and a test button
		var html = '\
		  <div id="codeBlockForm">\
			<div class="exe-idevice-info">'+ _("Edit your code below:") +'</div>\
			<textarea id="codeBlockEditor"></textarea>\
			<br><button id="testCodeMirror">'+ _("Test CodeMirror") +'</button>\
		  </div>';
		
		// Insert the form before the hidden TEXTAREA (that holds the saved content)
		var field = $("#activeIdevice textarea.jsContentEditor");
		field.before(html);
		
		// (Optional) If using tabs, initialize them – otherwise, this may be omitted.
		if (typeof $exeAuthoring !== "undefined" && $exeAuthoring.iDevice && $exeAuthoring.iDevice.tabs) {
		  $exeAuthoring.iDevice.tabs.init("codeBlockForm");
		}
		
		// Restore previous content (if any)
		self.getPreviousValues(field);
		
		// --- Initialize CodeMirror on the codeBlockEditor textarea ---
		var codeArea = document.getElementById("codeBlockEditor");
		if (codeArea) {
		  self.codeMirrorEditor = CodeMirror.fromTextArea(codeArea, {
			lineNumbers: true,             // Enable line numbers
			mode: "javascript",            // Set language mode (change if needed)
			theme: "monokai",              // Use the 'monokai' theme for a code feel
			lineWrapping: true             // Enable line wrapping
		  });
		}
		
		// Add a click event to the Test button to display CodeMirror content
		$("#testCodeMirror").click(function(){
		  if (self.codeMirrorEditor) {
			alert("Current CodeMirror content:\n" + self.codeMirrorEditor.getValue());
		  } else {
			alert("CodeMirror editor is not initialized.");
		  }
		});
	  });
	},
	
	// Method to dynamically load dependencies into the document head
	loadDependencies: function(callback){
	  var head = document.getElementsByTagName("head")[0];
	  // Check if CodeMirror is already loaded
	  if (typeof CodeMirror === "undefined") {
		
		// Create and append CodeMirror Core CSS
		var cmCss = document.createElement("link");
		cmCss.rel = "stylesheet";
		cmCss.href = "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.1/codemirror.min.css";
		head.appendChild(cmCss);
		
		// Create and append CodeMirror Monokai Theme CSS
		var themeCss = document.createElement("link");
		themeCss.rel = "stylesheet";
		themeCss.href = "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.1/theme/monokai.min.css";
		head.appendChild(themeCss);
		
		// Create and append CodeMirror Core JavaScript
		var script = document.createElement("script");
		script.src = "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.1/codemirror.min.js";
		script.onload = function(){
		  // Load the JavaScript mode for CodeMirror after the core has loaded
		  var modeScript = document.createElement("script");
		  modeScript.src = "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.1/mode/javascript/javascript.min.js";
		  modeScript.onload = function(){
			callback();
		  };
		  head.appendChild(modeScript);
		};
		head.appendChild(script);
		
	  } else {
		// Already loaded—execute the callback immediately
		callback();
	  }
	},
	
	save : function(){
	  // Gather content from the CodeMirror editor (if available)
	  var res = "";
	  if (this.codeMirrorEditor) {
		var codeContent = this.codeMirrorEditor.getValue();
		if(codeContent !== ""){
		  // Wrap the content in a container with a specific class for styling
		  res += '<div class="exe-code-block"><pre>' + codeContent + '</pre></div>';
		}
	  }
	  return res;
	},
	
	getPreviousValues : function(field){
	  // Retrieve previously saved content (if available)
	  var content = field.val();
	  if (content !== ''){
		var wrapper = $("<div></div>");
		wrapper.html(content);
		var codeBlock = $("div.exe-code-block pre", wrapper).eq(0);
		if(codeBlock.length === 1){
		  // If CodeMirror is initialized, set its value
		  if(this.codeMirrorEditor){
			this.codeMirrorEditor.setValue(codeBlock.text());
		  } else {
			// Fallback: set the raw textarea value
			$("#codeBlockEditor").val(codeBlock.text());
		  }
		}
	  }
	}
  };
  
  // Dummy translation function if not defined elsewhere
  function _(str) { return str; }
  