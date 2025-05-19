/**
 * CodeBlock Edition iDevice
 */
var $exeDevice = {
    i18n: { name: _("CodeBlock") },
    // mason
    // reference to our code mirror instance
    codeMirrorEditor: null,
    codeMirrorAnswerEditor: null,

    init: function() {
        var self = this;

        // Build the CodeMirror form (no check button or feedback)
        var html = '\
        <div id="codeBlockForm">\
            <p><label for="codeBlockTitle"><strong>' + _("Title of module:") + '</strong></label><br>\
            <input type="text" id="codeBlockTitle" style="width:100%;" /></p>\
            <p><label for="codeBlockEditor"><strong>' + _("Incorrect code for question:") + '</strong></label><br>\
            <textarea id="codeBlockEditor"></textarea></p>\
            <p><label for="codeBlockAnswer"><strong>' + _("Correct formatting option:") + '</strong></label><br>\
            <textarea id="codeBlockAnswer" style="display:none;"></textarea></p>\
        </div>';
        // Insert it before the hidden textarea
        var field = $("#activeIdevice textarea.jsContentEditor");
        field.before(html);
        field.hide(); // Hide the default textarea
        // Restore saved code (if any)
        self.getPreviousValues(field);
        // Init CodeMirror for incorrect code
        var area = document.getElementById("codeBlockEditor");
        if (area) {
            self.codeMirrorEditor = CodeMirror.fromTextArea(area, {
                lineNumbers: true,
                mode: "javascript",
                theme: "monokai",
                lineWrapping: true
            });
        }
        // Init CodeMirror for correct formatting (hidden)
        var answerArea = document.getElementById("codeBlockAnswer");
        if (answerArea) {
            self.codeMirrorAnswerEditor = CodeMirror.fromTextArea(answerArea, {
                lineNumbers: true,
                mode: "javascript",
                theme: "monokai",
                lineWrapping: true
            });
        }
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
        var title = $("#codeBlockTitle").val() || "";
        var codeToEdit = this.codeMirrorEditor ? this.codeMirrorEditor.getValue() : "";
        var correctFormatting = this.codeMirrorAnswerEditor ? this.codeMirrorAnswerEditor.getValue() : "";
        // Wrap the data in a structure for export
        res = '<div class="exe-code-block-activity">' +
            '<div class="code-block-title">' + $('<div>').text(title).html() + '</div>' +
            '<div class="code-block-to-edit"><pre>' + $('<div>').text(codeToEdit).html() + '</pre></div>' +
            '<div class="code-block-answer" style="display:none;"><pre>' + $('<div>').text(correctFormatting).html() + '</pre></div>' +
            '</div>';
        // Store the sanitized code into the hidden editor field
        $("#activeIdevice textarea.jsContentEditor").val(res);
        return res;
    },

    getPreviousValues: function(field) {
        var content = field.val();
        if (content) {
            var wrapper = $("<div>").html(content);
            var title = wrapper.find(".code-block-title").text() || "";
            var pre = wrapper.find(".code-block-to-edit pre").get(0);
            var answerPre = wrapper.find(".code-block-answer pre").get(0);
            if (title) {
                $("#codeBlockTitle").val(title);
            }
            if (pre && this.codeMirrorEditor) {
                this.codeMirrorEditor.setValue(pre.textContent);
            }
            if (answerPre && this.codeMirrorAnswerEditor) {
                this.codeMirrorAnswerEditor.setValue(answerPre.textContent);
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
