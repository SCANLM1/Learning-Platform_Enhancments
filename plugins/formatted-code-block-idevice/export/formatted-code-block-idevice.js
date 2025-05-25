var $formattedCodeBlock = {
    init: function () {
        this.loadDependencies(() => {
            document.querySelectorAll(".formatted-code-block-idevice").forEach(block => {
                // Get the <pre> element and extract its textContent
                const pre = block.querySelector(".formatted-code-block pre");
                const code = pre?.textContent || "";

                // Remove the raw <pre> element to avoid duplicate rendering
                if (pre?.parentNode) {
                    pre.parentNode.removeChild(pre);
                }

                // Replace block content with CodeMirror + Submit button
                const codeContainer = block.querySelector(".formatted-code-block");

                // Create a wrapper for the editor and button
                const editorWrapper = document.createElement("div");
                editorWrapper.className = "formatted-code-wrapper";

                // Add a div to host the CodeMirror editor
                const editorDiv = document.createElement("div");
                editorWrapper.appendChild(editorDiv);

                // Add Submit button
                const buttonLayout = document.createElement("div");
                buttonLayout.className = "button-layout";
                buttonLayout.innerHTML = `
                    <div class="button-center">
                        <button class="submit-btn">Mark as Done</button>
                    </div>
                `;
                editorWrapper.appendChild(buttonLayout);
                codeContainer.appendChild(editorWrapper);

                // Initialize CodeMirror
                CodeMirror(editorDiv, {
                    value: code,
                    mode: "xml",
                    theme: "monokai",
                    lineNumbers: true,
                    readOnly: true,
                    lineWrapping: true
                });

                // Hook up the submit button
                const submitBtn = buttonLayout.querySelector(".submit-btn");
                submitBtn?.addEventListener("click", () => {
                    finishCourse();
                });
            });
        });
    },

    loadDependencies: function (callback) {
        const head = document.head;

        const cssLinks = [
            "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.1/codemirror.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.1/theme/monokai.min.css",
            "formatted-code-block-idevice.css"
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
    }
};

$(function () {
    $formattedCodeBlock.init();
});

function finishCourse() {
    if (typeof pipwerks !== "undefined" && pipwerks.SCORM) {
        pipwerks.SCORM.SetCompletionStatus("completed");
        pipwerks.SCORM.SetSuccessStatus("passed");
        pipwerks.SCORM.save();
        pipwerks.SCORM.quit();
    }
}
