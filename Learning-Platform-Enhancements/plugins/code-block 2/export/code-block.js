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

// SECURITY CODE: Inject CSP meta tag for security
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
// END SECURITY CODE

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
            // JavaScript mode (change/add more modes as needed)
            var script2 = document.createElement("script");
            script2.src = "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.1/mode/javascript/javascript.min.js";
            script2.onload = callback;
            head.appendChild(script2);
        };
        head.appendChild(script1);
    },

    // Find each saved <pre> and replace with read-only CodeMirror
    renderCodeBlocks: function() {
        // Adjust selector if needed to match your export HTML
        $(".exe-code-block pre").each(function() {
            var preEl = this;
            var code = preEl.textContent;
            // Remove the <pre> so CodeMirror can replace it cleanly
            var parent = preEl.parentNode;
            CodeMirror(function(node) {
                parent.replaceChild(node, preEl);
            }, {
                value: code,
                mode: "javascript", // Change this if you want a different default
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
