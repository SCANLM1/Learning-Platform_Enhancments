/**
 * CodeBlock Export iDevice
 *
 * Renders the saved code block activity as an interactive CodeMirror editor.
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
            var script2 = document.createElement("script");
            script2.src = "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.1/mode/javascript/javascript.min.js";
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

            let html = `
                <div class="code-block-export-title" style="font-weight:bold; margin-bottom:8px;">${title}</div>
                <div class="code-block-export-editor" style="margin-bottom:8px;"></div>
                <div class="feedback" style="margin-top:8px; font-weight:bold;"></div>
                <div class="button-layout" style="margin-bottom:8px;">
                    <button type="button" class="reset-btn">Reset</button>
                    <button type="button" class="check-btn">Check Answer</button>
                </div>
            `;
            activity.innerHTML = html;

            // Init CodeMirror (editable)
            var editor = CodeMirror(activity.querySelector(".code-block-export-editor"), {
                value: codeToEdit,
                mode: "javascript",
                theme: "monokai",
                lineNumbers: true,
                lineWrapping: true
            });

            var feedbackBox = activity.querySelector(".feedback");
            var checkBtn = activity.querySelector(".check-btn");
            var resetBtn = activity.querySelector(".reset-btn");

            checkBtn.addEventListener("click", function() {
                var userCode = editor.getValue().trim();
                var correctCode = correctFormatting.trim();
                if (userCode === correctCode) {
                    feedbackBox.textContent = "✅ Correct formatting!";
                    feedbackBox.style.color = "green";
                    if (typeof finishCourse === "function") finishCourse();
                } else {
                    feedbackBox.textContent = "❌ Not quite right. Try again!";
                    feedbackBox.style.color = "red";
                }
            });

            resetBtn.addEventListener("click", function() {
                editor.setValue(codeToEdit);
                feedbackBox.textContent = "";
            });
        });
    }
};

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
