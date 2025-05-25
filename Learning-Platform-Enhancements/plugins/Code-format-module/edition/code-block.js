/**
 * CodeBlock Edition iDevice
 */
var $exeDevice = {
    i18n: { name: _("CodeBlock") },
    codeMirrorEditor: null,
    codeMirrorAnswerEditor: null,

    init: function() {
        var self = this;
        this.loadDependencies(function() {
            // Remove any previous form to avoid duplicates
            $("#codeBlockForm").remove();
            // Build the CodeMirror form (XML only)
            var html = '\
            <div id="codeBlockForm">\
                <p><label for="codeBlockTitle"><strong>' + _("Title of module:") + '</strong></label><br>\
                <input type="text" id="codeBlockTitle" style="width:100%;" /></p>\
                <p><label for="codeBlockEditor"><strong>' + _("Incorrect code for question:") + '</strong></label><br>\
                <textarea id="codeBlockEditor"></textarea></p>\
                <p><label for="codeBlockAnswer"><strong>' + _("Correct formatting option:") + '</strong></label><br>\
                <textarea id="codeBlockAnswer"></textarea></p>\
            </div>';
            // Insert it before the hidden textarea
            var field = $("#activeIdevice textarea.jsContentEditor");
            field.before(html);
            field.hide(); // Hide the default textarea
            // Restore saved code (if any)
            self.getPreviousValues(field);
            // Init CodeMirror for incorrect code (XML mode)
            var area = document.getElementById("codeBlockEditor");
            if (area) {
                self.codeMirrorEditor = CodeMirror.fromTextArea(area, {
                    lineNumbers: true,
                    mode: "xml",
                    theme: "monokai",
                    lineWrapping: true
                });
            }
            // Init CodeMirror for correct formatting (XML mode)
            var answerArea = document.getElementById("codeBlockAnswer");
            if (answerArea) {
                self.codeMirrorAnswerEditor = CodeMirror.fromTextArea(answerArea, {
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

/**
 * CodeBlock Export iDevice
 * Shows the incorrect code, a blank answer section, and a submit button that gives a prompt and sets completion if correct.
 */

var $codeBlockIdevice = {
    init: function() {
        var self = this;
        this.loadDependencies(function(){
            self.renderCodeBlockActivities();
        });
    },

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

    renderCodeBlockActivities: function() {
        document.querySelectorAll(".exe-code-block-activity").forEach(function(activity) {
            var title = activity.querySelector(".code-block-title")?.textContent || "";
            var codeToEdit = activity.querySelector(".code-block-to-edit pre")?.textContent || "";
            var correctFormatting = activity.querySelector(".code-block-answer pre")?.textContent || "";

            // Build the UI
            var html = `
                <div class="code-block-export-title" style="font-weight:bold; margin-bottom:8px;">${title}</div>
                <div class="code-block-original-label" style="font-weight:bold; margin-bottom:4px;">Incorrectly formatted code:</div>
                <div class="code-block-original" style="margin-bottom:16px;"></div>
                <div class="code-block-answer-label" style="font-weight:bold; margin-bottom:4px;">Your corrected code:</div>
                <div class="code-block-answer-editor" style="margin-bottom:8px;"></div>
                <div class="feedback" style="margin-top:8px; font-weight:bold;"></div>
                <div class="button-layout" style="margin-bottom:8px;">
                    <button type="button" class="submit-btn">Submit Answer</button>
                    <button type="button" class="reset-btn">Reset</button>
                </div>
            `;
            activity.innerHTML = html;

            // Render the original incorrect code as a read-only CodeMirror block
            var originalBlock = activity.querySelector(".code-block-original");
            CodeMirror(originalBlock, {
                value: codeToEdit,
                mode: "xml",
                theme: "monokai",
                readOnly: "nocursor",
                lineNumbers: true,
                lineWrapping: true
            });

            // Render the blank answer editor
            var answerEditor = CodeMirror(activity.querySelector(".code-block-answer-editor"), {
                value: "",
                mode: "xml",
                theme: "monokai",
                lineNumbers: true,
                lineWrapping: true
            });

            var feedbackBox = activity.querySelector(".feedback");
            var submitBtn = activity.querySelector(".submit-btn");
            var resetBtn = activity.querySelector(".reset-btn");

            submitBtn.addEventListener("click", function() {
                var userCode = answerEditor.getValue().trim();
                var correctCode = correctFormatting.trim();
                if (userCode === correctCode) {
                    feedbackBox.textContent = "✅ Correct formatting!";
                    feedbackBox.style.color = "green";
                    // Set completion as per classmate's logic
                    if (typeof finishCourse === "function") finishCourse();
                } else {
                    feedbackBox.textContent = "❌ Not quite right. Try again!";
                    feedbackBox.style.color = "red";
                }
            });

            resetBtn.addEventListener("click", function() {
                answerEditor.setValue("");
                feedbackBox.textContent = "";
            });
        });
    }
};

// Translation stub
function _(s) { return s; }

// Kick off edition
$(document).ready(function() {
    $exeDevice.init();
});

// Initialize on DOM ready
$(function() {
    $codeBlockIdevice.init();
});

function finishCourse() {
    if (typeof pipwerks !== "undefined" && pipwerks.SCORM) {
        pipwerks.SCORM.SetCompletionStatus("completed");
        pipwerks.SCORM.SetSuccessStatus("passed");
        pipwerks.SCORM.save();
        pipwerks.SCORM.quit();
    }
}