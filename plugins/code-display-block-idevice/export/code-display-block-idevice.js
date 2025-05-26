var $codeDisplayBlock = {
    init: function () {
        this.loadDependencies(() => {
            document.querySelectorAll(".code-display-block-idevice").forEach(block => {
                const pre = block.querySelector(".code-display-block pre");
                const code = pre?.textContent || "";

                if (pre?.parentNode) {
                    pre.parentNode.removeChild(pre);
                }

                const codeContainer = block.querySelector(".code-display-block");

                const editorWrapper = document.createElement("div");
                editorWrapper.className = "formatted-code-wrapper";

                const editorDiv = document.createElement("div");
                editorWrapper.appendChild(editorDiv);

                const buttonLayout = document.createElement("div");
                buttonLayout.className = "button-layout";
                buttonLayout.innerHTML = `
                    <div class="button-center">
                        <button class="submit-btn">Mark as Done</button>
                    </div>
                `;
                editorWrapper.appendChild(buttonLayout);
                codeContainer.appendChild(editorWrapper);

                CodeMirror(editorDiv, {
                    value: code,
                    mode: "xml",
                    theme: "monokai",
                    lineNumbers: true,
                    readOnly: true,
                    lineWrapping: true
                });

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
            "code-display-block-idevice.css"
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
    $codeDisplayBlock.init();
});

function finishCourse() {
    if (typeof pipwerks !== "undefined" && pipwerks.SCORM) {
        pipwerks.SCORM.SetCompletionStatus("completed");
        pipwerks.SCORM.SetSuccessStatus("passed");
        pipwerks.SCORM.save();
        pipwerks.SCORM.quit();
    }
}
