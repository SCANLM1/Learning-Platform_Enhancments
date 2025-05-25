var $exeDevice = {
    init: function() {
        if ($("#finishButtonForm").length === 0) {
            // HTML form for editing mode
            var html = `
                <div id="finishButtonForm">
                    <p>Clicking this button will mark the SCORM package as completed.</p>
                </div>
            `;

            // Insert the form before the hidden textarea
            var field = $("#activeIdevice textarea.jsContentEditor");
            field.before(html);
        }
    },
    
    save: function() {
        // Return finish button without any extra attributes
        return `<button class="finishButton">Finish</button>`;
    }
};


