/**
 * Minimal CodeBlock Edition iDevice
 * Renders a single editable XML CodeMirror block in the page.
 */
var $exeDevice = {
    codeMirrorEditor: null,

    init: function() {
        var self = this;
        this.loadDependencies(function() {
            // Remove any previous form to avoid duplicates
            $("#codeBlockForm").remove();
            // Minimal CodeMirror form
            var html = '\
            <div id="codeBlockForm">\
                <textarea id="codeBlockEditor"></textarea>\
            </div>';
            // Insert before the hidden textarea
            var field = $("#activeIdevice textarea.jsContentEditor");
            field.before(html);
            field.hide();
            // Init CodeMirror for XML
            var area = document.getElementById("codeBlockEditor");
            if (area) {
                self.codeMirrorEditor = CodeMirror.fromTextArea(area, {
                    lineNumbers: true,
                    mode: "xml",
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
                // XML mode
                var s2 = document.createElement("script");
                s2.src = "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.1/mode/xml/xml.min.js";
                s2.onload = cb;
                head.appendChild(s2);
            };
            head.appendChild(s1);
        } else cb();
    }
};

$(document).ready(function() {
    $exeDevice.init();
});
