var $exeDevice = {
    init: function () {
        const html = `
            <div id="completeCodeForm">
                <div class="exe-idevice-info">Use [[ ]] for blanks. Provide correct answers below.</div>
                <div class="exe-form-tab" title="Complete the Code">
                    <p><label for="instructionsInput">Instructions:</label>
                    <textarea id="instructionsInput" class="exe-html-editor" rows="3"></textarea></p>
                    
                    <p><label for="codeInput">Code Snippet:</label>
                    <textarea id="codeInput" class="exe-html-editor" rows="6"></textarea></p>

                    <p><label for="acceptedAnswers">Accepted Answers (comma-separated):</label>
                    <input type="text" id="acceptedAnswers" style="width: 100%;"></p>

                    <p><label for="hintInput">Optional Hint:</label>
                    <textarea id="hintInput" class="exe-html-editor" rows="2"></textarea></p>

                    <div style="margin-top: 20px;">
                        <strong>Preview (Learner View):</strong>
                        <div id="codePreview" class="code-block" style="margin-top:6px;"></div>
                    </div>
                </div>
            </div>
        `;

        const field = $("#activeIdevice textarea.jsContentEditor");
        field.before(html);
        field.hide();

        $exeAuthoring.iDevice.tabs.init("completeCodeForm");
        this.loadPreviousValues();

        // Initialize TinyMCE after fields are rendered
        setTimeout(() => {
            if (typeof tinyMCE !== "undefined" && eXe.editorSettings) {
                tinyMCE.init(Object.assign({}, eXe.editorSettings, {
                    selector: ".exe-html-editor"
                }));
            }
        }, 0);

        // Add preview render hook after TinyMCE is ready
        setTimeout(() => {
            $("#acceptedAnswers").on("input", () => $exeDevice.renderPreview());
        }, 300);
    },

    renderPreview: function () {
        const code = tinyMCE.get("codeInput")?.getContent({ format: "text" }) || "";
        const answers = $("#acceptedAnswers").val().split(',').map(a => a.trim());
        let index = 0;
        const previewHTML = code.replace(/\[\[\s*.*?\s*\]\]/g, () => {
            return `<input type="text" class="blank" data-index="${index++}" style="width:100px; margin:2px;">`;
        });
        $("#codePreview").html(`<pre class="code-snippet">${previewHTML}</pre>`);
    },

    loadPreviousValues: function () {
        const field = $("#activeIdevice textarea.jsContentEditor");
        const content = field.val();
        if (!content) return;

        const wrapper = $('<div>').html(content);
        $("#instructionsInput").val(wrapper.find(".complete-instructions").html() || "");
        $("#codeInput").val(wrapper.find(".complete-code").html() || "");
        $("#acceptedAnswers").val(wrapper.find(".complete-answers").text() || "");
        $("#hintInput").val(wrapper.find(".complete-hint").html() || "");

        this.renderPreview();
    },

    save: function () {
        const instructions = tinyMCE.get("instructionsInput")?.getContent() || "";
        const code = tinyMCE.get("codeInput")?.getContent() || "";
        const answers = $("#acceptedAnswers").val();
        const hint = tinyMCE.get("hintInput")?.getContent() || "";

        if (!instructions || !code || !answers) {
            eXe.app.alert("All fields except hint are required.");
            return;
        }

        const html = `
            <div class="complete-code-idevice">
                <div class="complete-instructions">${instructions}</div>
                <div class="complete-code">${code}</div>
                <div class="complete-answers">${answers}</div>
                ${hint ? `<div class="complete-hint" style="display:none;">${hint}</div>` : ""}
                <span class="trigger-complete-code" style="display:none;"></span>
            </div>
        `;

        $("#activeIdevice textarea.jsContentEditor").val(html);
        return html;
    }
};
