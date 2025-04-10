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
    },

    save: function () {
        const instructions = tinyMCE.get("instructionsInput")?.getContent() || "";
        const code = tinyMCE.get("codeInput")?.getContent() || "";
        const answers = $("#acceptedAnswers").val();

        if (!instructions || !code || !answers) {
            eXe.app.alert("All fields are required.");
            return;
        }

        const html = `
            <div class="complete-code-idevice">
                <div class="complete-instructions">${instructions}</div>
                <div class="complete-code">${code}</div>
                <div class="complete-answers">${answers}</div>
                <span class="trigger-complete-code" style="display:none;"></span>
            </div>
        `;

        $("#activeIdevice textarea.jsContentEditor").val(html);
        return html;
    }
};
