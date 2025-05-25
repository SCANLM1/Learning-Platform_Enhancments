var $formatCodeIdevice = {
    init: function () {
        var self = this;
        this.loadDependencies(function () {
            self.renderFormatCodeActivities();
        });
    },

    loadDependencies: function (callback) {
        const head = document.head;

        const cssLinks = [
            "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.1/codemirror.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.1/theme/monokai.min.css",
            "format-code-idevice.css" // ✅ your custom style file
        ];

        const jsLinks = [
            "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.1/codemirror.min.js",
            "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.1/mode/xml/xml.min.js"
        ];

        cssLinks.forEach(href => {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = href;
            head.appendChild(link);
        });

        const loadScripts = (i = 0) => {
            if (i >= jsLinks.length) return callback();
            const script = document.createElement("script");
            script.src = jsLinks[i];
            script.onload = () => loadScripts(i + 1);
            head.appendChild(script);
        };
        loadScripts();
    },

    renderFormatCodeActivities: function () {
        document.querySelectorAll(".format-code-idevice").forEach(activity => {
            const title = activity.querySelector(".format-code-title")?.textContent || "";
            const instructionsHTML = activity.querySelector(".format-code-instructions")?.innerHTML || "";
            const hintHTML = activity.querySelector(".format-code-hint")?.innerHTML || "";
            const codeToEdit = activity.querySelector(".format-code-to-edit pre")?.textContent || "";
            const correctFormatting = activity.querySelector(".format-code-answer pre")?.textContent || "";

            const html = `
                <div class="format-code-export-title">${title}</div>
                ${instructionsHTML ? `<div class="instructions">${instructionsHTML}</div>` : ""}
                <div class="format-code-original-label"><strong>Incorrectly formatted code:</strong></div>
                <div class="format-code-original"></div>
                <div class="format-code-answer-label"><strong>Your corrected code:</strong></div>
                <div class="format-code-answer-editor"></div>
                <div class="feedback"></div>
                <div class="button-layout">
                    <div class="button-left">
                        ${hintHTML ? `<button class="hint-btn">Hint</button>` : ""}
                        <button class="reset-btn">Reset</button>
                    </div>
                    <div class="button-center">
                        <button class="submit-btn">Submit</button>
                    </div>
                    <div class="button-right"></div>
                </div>
                ${hintHTML ? `<div class="hint-box" style="display:none;">${hintHTML}</div>` : ""}
            `;

            activity.innerHTML = html;

            const originalBlock = activity.querySelector(".format-code-original");
            const answerEditorBlock = activity.querySelector(".format-code-answer-editor");

            // CodeMirror setup for original and answer editors
            CodeMirror(originalBlock, {
                value: codeToEdit,
                mode: "xml",
                theme: "monokai",
                readOnly: "nocursor",
                lineNumbers: true,
                lineWrapping: true
            });

            const answerEditor = CodeMirror(answerEditorBlock, {
                value: "",
                mode: "xml",
                theme: "monokai",
                lineNumbers: true,
                lineWrapping: true
            });

            // Hook up interactivity
            const feedbackBox = activity.querySelector(".feedback");
            const submitBtn = activity.querySelector(".submit-btn");
            const resetBtn = activity.querySelector(".reset-btn");
            const hintBtn = activity.querySelector(".hint-btn");
            const hintBox = activity.querySelector(".hint-box");

            submitBtn?.addEventListener("click", () => {
                const userCode = answerEditor.getValue().trim();
                const correctCode = correctFormatting.trim();
                if (userCode === correctCode) {
                    feedbackBox.textContent = "✅ Correct formatting!";
                    feedbackBox.style.color = "green";
                    finishCourse();
                } else {
                    feedbackBox.textContent = "❌ Not quite right. Try again!";
                    feedbackBox.style.color = "red";
                }
            });

            resetBtn?.addEventListener("click", () => {
                answerEditor.setValue("");
                feedbackBox.textContent = "";
                if (hintBox) hintBox.style.display = "none";
            });

            hintBtn?.addEventListener("click", () => {
                if (hintBox) {
                    const visible = hintBox.style.display === "block";
                    hintBox.style.display = visible ? "none" : "block";
                    hintBtn.textContent = visible ? "Hint" : "Hide Hint";
                }
            });
        });

        if (typeof pipwerks !== "undefined" && pipwerks.SCORM) {
            pipwerks.SCORM.init();
        }
    }
};

$(function () {
    $formatCodeIdevice.init();
});

function finishCourse() {
    if (typeof pipwerks !== "undefined" && pipwerks.SCORM) {
        pipwerks.SCORM.SetCompletionStatus("completed");
        pipwerks.SCORM.SetSuccessStatus("passed");
        pipwerks.SCORM.save();
        pipwerks.SCORM.quit();
    }
}
