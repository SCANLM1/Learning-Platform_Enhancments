/**
 * CodeBlock Export iDevice
 * Shows the incorrect code, a blank answer section, and a submit button that gives a prompt and sets completion if correct.
 */

var $codeBlockIdevice = {
    // Entry point
    init: function() {
        var self = this;
        this.loadDependencies(function(){
            self.renderCodeBlockActivities();
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
