var $exeDevice = {
    init: function () {
        if ($("#finishButtonForm").length === 0) {
            const html = `
                <div id="finishButtonForm">
                    <div class="exe-idevice-info">
                        This button will mark the SCORM package as complete when clicked.
                    </div>
                </div>
            `;

            const field = $("#activeIdevice textarea.jsContentEditor");
            field.before(html);
            field.hide();

            // 🆕 Automatically clear the title field if it's still "Finish Button"
            var titleField = $("#activeIdevice input[type='text']").eq(0);
            if (titleField.val() === "Finish Button") titleField.val("").focus();
        }
    },

    save: function () {
        const html = `
            <div class="finish-button-idevice">
                <div class="finish-button-wrapper">
                    <button class="finish-btn">Finish</button>
                </div>
            </div>
        `;
        $("#activeIdevice textarea.jsContentEditor").val(html);
        return html;
    }
};
