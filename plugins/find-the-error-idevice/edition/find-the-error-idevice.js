var $exeDevice = {
    init: function () {
        const html = `
            <div id="findErrorEditor">
                <div class="exe-idevice-info">Paste your code block below. Use the line number (starting from 0) to indicate which line contains the error. You may also add optional instructions or a hint.</div>

                <p><label for="instructionsInput">Instructions:</label>
                <textarea id="instructionsInput" class="exe-html-editor" rows="3"></textarea></p>

                <p><label for="codeInput">Code Block:</label>
                <textarea id="codeInput" rows="10" style="font-family:monospace;width:100%;"></textarea></p>

                <p><label for="correctLineInput">Correct Answer Line Number (starting from 0):</label>
                <input type="number" id="correctLineInput" style="width:100%;" min="0" /></p>

                <p><label for="hintInput">Optional Hint:</label>
                <textarea id="hintInput" class="exe-html-editor" rows="2"></textarea></p>
                
                <div style="margin-top:20px;">
                <strong>Preview with Correct Answer Line Highlighted:</strong>
                <div id="codePreview" class="code-block" style="margin-top:6px;"></div>
                </div>
            </div>
        `;

        const field = $("#activeIdevice textarea.jsContentEditor");
        field.before(html);
        field.hide();

        $exeAuthoring.iDevice.tabs.init("findErrorEditor");
        this.loadPreviousValues();

        setTimeout(() => {
            if (typeof tinyMCE !== "undefined" && eXe.editorSettings) {
                tinyMCE.init(Object.assign({}, eXe.editorSettings, {
                    selector: '.exe-html-editor'
                }));
            }
        }, 0);

        // Live preview rendering
        $("#codeInput, #correctLineInput").on("input", () => {
            this.renderPreview();
        });
    },

    renderPreview: function () {
        const code = $("#codeInput").val().split('\n');
        const correctLine = parseInt($("#correctLineInput").val());
        const preview = $("#codePreview");
        preview.empty();

        code.forEach((line, i) => {
            const div = $('<div></div>').text(line).addClass('code-line');
            if (i === correctLine) div.css('background-color', '#d4edda');
            preview.append(div);
        });
    },

    save: function () {
        const instructions = tinyMCE.get("instructionsInput")?.getContent() || "";
        const hint = tinyMCE.get("hintInput")?.getContent() || "";
        const code = $("#codeInput").val();
        const correctLine = $("#correctLineInput").val();

        if (!code.trim()) {
            alert("You must enter a code block.");
            return false;
        }

        if (correctLine === "" || isNaN(correctLine)) {
            alert("You must specify the line number containing the error.");
            return false;
        }

        const html = `
            <div class="find-error-idevice">
                <div class="find-error-instructions">${instructions}</div>
                <div class="find-error-code" style="display:none;">${$('<div>').text(code).html()}</div>
                <div class="find-error-correct" style="display:none;">${correctLine}</div>
                <div class="find-error-hint" style="display:none;">${hint}</div>
                <span class="trigger-find-error" style="display:none;"></span>
            </div>
        `;

        $("#activeIdevice textarea.jsContentEditor").val(html);
        return html;
    },

    loadPreviousValues: function () {
        const field = $("#activeIdevice textarea.jsContentEditor");
        const content = field.val();
        if (!content) return;

        const wrapper = $('<div>').html(content);
        $("#instructionsInput").val(wrapper.find(".find-error-instructions").html() || "");
        $("#codeInput").val($('<div>').html(wrapper.find(".find-error-code").html() || "").text());
        $("#correctLineInput").val(wrapper.find(".find-error-correct").text() || "");
        $("#hintInput").val(wrapper.find(".find-error-hint").html() || "");

        this.renderPreview();
    }
};
