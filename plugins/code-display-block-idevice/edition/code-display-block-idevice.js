var $exeDevice = {
    codeMirrorEditor: null,

    init: function () {
        const html = `
            <div id="codeDisplayForm">
                <p><label for="instructionsInput"><strong>Optional Information:</strong></label><br>
                <textarea id="instructionsInput" class="exe-html-editor" rows="3"></textarea></p>

                <p><label for="formattedCodeEditor"><strong>Formatted Code:</strong></label><br>
                <textarea id="formattedCodeEditor"></textarea></p>
            </div>
        `;

        const field = $("#activeIdevice textarea.jsContentEditor");
        field.before(html);
        field.hide();

        this.getPreviousValues(field); // ✅ Set .val() BEFORE TinyMCE loads

        setTimeout(() => {
            if (typeof tinyMCE !== "undefined" && eXe.editorSettings) {
                tinyMCE.init(Object.assign({}, eXe.editorSettings, {
                    selector: '.exe-html-editor'
                }));
            }

            setTimeout(() => {
                const area = document.getElementById("formattedCodeEditor");
                if (area) {
                    $exeDevice.codeMirrorEditor = CodeMirror.fromTextArea(area, {
                        lineNumbers: true,
                        mode: "xml",
                        theme: "monokai",
                        lineWrapping: true
                    });
                }
            }, 100);
        }, 0);
    },

    save: function () {
        const code = this.codeMirrorEditor?.getValue().trim() || "";
        const instructions = tinyMCE.get("instructionsInput")?.getContent() || "";

        if (!code) {
            alert("Please provide a code block.");
            return false;
        }

        const html = `
            <div class="code-display-block-idevice">
                <div class="code-display-instructions">${instructions}</div>
                <div class="code-display-block"><pre>${$('<div>').text(code).html()}</pre></div>
            </div>
        `;

        $("#activeIdevice textarea.jsContentEditor").val(html);
        return html;
    },

    getPreviousValues: function (field) {
        const content = field.val();
        if (!content) return;

        const wrapper = $('<div>').html(content);
        const pre = wrapper.find(".code-display-block pre").get(0);
        const instructionsHTML = wrapper.find(".code-display-instructions").html() || "";

        $("#instructionsInput").val(instructionsHTML);
        if (pre) {
            $("#formattedCodeEditor").val(pre.textContent);
        }
    }
};

setTimeout(() => {
    if (typeof xAddOnSave !== "undefined") {
        xAddOnSave.push(() => $exeDevice.save());
    }
}, 0);
