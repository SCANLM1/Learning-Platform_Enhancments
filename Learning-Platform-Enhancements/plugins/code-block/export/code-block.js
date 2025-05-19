/**
 * CodeBlock Export iDevice
 *
 * Renders the saved code block activity as an interactive CodeMirror editor.
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
            // JavaScript mode (change/add more modes as needed)
            var script2 = document.createElement("script");
            script2.src = "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.1/mode/javascript/javascript.min.js";
            script2.onload = callback;
            head.appendChild(script2);
        };
        head.appendChild(script1);
    },

    // Render the code block activity as an interactive exercise
    renderCodeBlockActivities: function() {
        $(".exe-code-block-activity").each(function() {
            var $activity = $(this);
            var title = $activity.find(".code-block-title").text() || "";
            var codeToEdit = $activity.find(".code-block-to-edit pre").text() || "";
            var correctFormatting = $activity.find(".code-block-answer pre").text() || "";

            // Build the UI
            var html = '<div class="code-block-export-title" style="font-weight:bold; margin-bottom:8px;">' + title + '</div>' +
                '<div class="code-block-export-editor" style="margin-bottom:8px;"></div>' +
                '<button type="button" class="code-block-check-btn" style="margin-bottom:8px;">Check Answer</button>' +
                '<div class="code-block-feedback" style="margin-top:8px; font-weight:bold;"></div>';

            $activity.html(html);

            // Initialize CodeMirror editor (editable)
            var editor = CodeMirror($activity.find(".code-block-export-editor")[0], {
                value: codeToEdit,
                mode: "javascript",
                theme: "monokai",
                lineNumbers: true,
                lineWrapping: true
            });

            // Check answer logic
            $activity.find(".code-block-check-btn").on("click", function() {
                var userCode = editor.getValue().trim();
                var correctCode = correctFormatting.trim();
                var feedback = $activity.find(".code-block-feedback");
                if (userCode === correctCode) {
                    feedback.text("✅ Correct formatting!");
                    feedback.css("color", "green");
                    if (typeof finishCourse === "function") finishCourse();
                } else {
                    feedback.text("❌ Not quite right. Try again!");
                    feedback.css("color", "red");
                }
            });
        });
    }
};

// Initialize on DOM ready
$(function() {
    $codeBlockIdevice.init();
});
