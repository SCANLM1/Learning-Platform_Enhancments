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
                    <textarea id="hintInput" class="exe-html-editor" rows="2">
                </div>
            </div>
        `;

        const field = $("#activeIdevice textarea.jsContentEditor");
        field.before(html);
        this.loadPreviousValues(field);
    },

    loadPreviousValues: function (field) {
        const content = field.val();
        if (!content) return;

        const wrapper = $('<div>').html(content);
        $("#instructionsInput").val(wrapper.find(".complete-instructions").html() || "");
        $("#codeInput").val(wrapper.find(".complete-code").html() || "");
        $("#acceptedAnswers").val(wrapper.find(".complete-answers").text() || "");
        $("#hintInput").val(wrapper.find(".complete-hint").html() || "");
    },

    save: function () {
        const instructions = tinyMCE.get("instructionsInput")?.getContent() || "";
        const code = tinyMCE.get("codeInput")?.getContent() || "";
        const answers = $("#acceptedAnswers").val();
        const hint = tinyMCE.get("hintInput")?.getContent() || "";

        if (!instructions || !code || !answers) {
            eXe.app.alert("All fields are except hint required.");
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
