var $exeDevice = {
    codeMirrorEditor: null,
    codeMirrorAnswerEditor: null,

    init: function () {
        const html = `
            <div id="formatCodeForm">
                <div class="exe-idevice-info">
                    Provide an incorrectly formatted block of code, the correctly formatted version, and optional instructions or a hint. This activity supports XML syntax highlighting using CodeMirror.
                </div>

                <p><label for="instructionsInput"><strong>Optional Instructions:</strong></label><br>
                <textarea id="instructionsInput" class="exe-html-editor" rows="3"></textarea></p>

                <p><label for="formatCodeEditor"><strong>Incorrect code for question:</strong></label><br>
                <textarea id="formatCodeEditor"></textarea></p>

                <p><label for="formatCodeAnswer"><strong>Correct formatting option:</strong></label><br>
                <textarea id="formatCodeAnswer"></textarea></p>

                <p><label for="hintInput"><strong>Optional Hint:</strong></label><br>
                <textarea id="hintInput" class="exe-html-editor" rows="2"></textarea></p>
            </div>
        `;

        const field = $("#activeIdevice textarea.jsContentEditor");
        field.before(html);
        field.hide();

        this.getPreviousValues(field);

        setTimeout(() => {
            if (typeof tinyMCE !== "undefined" && eXe.editorSettings) {
                tinyMCE.init(Object.assign({}, eXe.editorSettings, {
                    selector: '.exe-html-editor'
                }));
            }

            setTimeout(() => {
                const area = document.getElementById("formatCodeEditor");
                if (area) {
                    $exeDevice.codeMirrorEditor = CodeMirror.fromTextArea(area, {
                        lineNumbers: true,
                        mode: "xml",
                        theme: "monokai",
                        lineWrapping: true
                    });
                }

                const answerArea = document.getElementById("formatCodeAnswer");
                if (answerArea) {
                    $exeDevice.codeMirrorAnswerEditor = CodeMirror.fromTextArea(answerArea, {
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
        const codeToEdit = this.codeMirrorEditor?.getValue().trim() || "";
        const correctFormatting = this.codeMirrorAnswerEditor?.getValue().trim() || "";
        const instructions = tinyMCE.get("instructionsInput")?.getContent() || "";
        const hint = tinyMCE.get("hintInput")?.getContent() || "";

        if (!codeToEdit) {
            alert("You must enter the incorrectly formatted code block.");
            return false;
        }

        if (!correctFormatting) {
            alert("You must enter the correct formatting version of the code.");
            return false;
        }

        const html = `
            <div class="code-formatting-activity-idevice">
                <div class="format-code-instructions">${instructions}</div>
                <div class="format-code-to-edit"><pre>${$('<div>').text(codeToEdit).html()}</pre></div>
                <div class="format-code-answer" style="display:none;"><pre>${$('<div>').text(correctFormatting).html()}</pre></div>
                <div class="format-code-hint" style="display:none;">${hint}</div>
            </div>
        `;

        $("#activeIdevice textarea.jsContentEditor").val(html);
        return html;
    },

    getPreviousValues: function (field) {
        const content = field.val();
        if (!content) return;

        const wrapper = $('<div>').html(content);
        const pre = wrapper.find(".format-code-to-edit pre").get(0);
        const answerPre = wrapper.find(".format-code-answer pre").get(0);
        const instructionsHTML = wrapper.find(".format-code-instructions").html() || "";
        const hintHTML = wrapper.find(".format-code-hint").html() || "";

        if (pre) {
            $("#formatCodeEditor").val(pre.textContent);
        }
        if (answerPre) {
            $("#formatCodeAnswer").val(answerPre.textContent);
        }

        $("#instructionsInput").val(instructionsHTML);
        $("#hintInput").val(hintHTML);
    }
};

setTimeout(() => {
    if (typeof xAddOnSave !== "undefined") {
        xAddOnSave.push(() => $exeDevice.save());
    }
}, 0);
