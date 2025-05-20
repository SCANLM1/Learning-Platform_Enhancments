/**
 * Find the Error iDevice (edition code)
 * Built on base plugin template from eXeLearning
 * Author: Shubham Paudel + Ignacio Gros base
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 */
var $exeDevice = {

    // Called when the iDevice editor loads in eXeLearning
    init: function () {
        // HTML structure for the editing interface
        var html = `
            <div id="findErrorEditor">
                <label for="codeInput">Code Block:</label>
                <textarea id="codeInput" rows="10" style="width:100%"></textarea>

                <label for="correctLine">Correct Line Number (starting from 0):</label>
                <input type="number" id="correctLine" min="0" style="width:100%" />

                <label for="feedbackData">Feedback Map (JSON):</label>
                <textarea id="feedbackData" rows="5" style="width:100%"></textarea>

                <div id="codeLinePreview" class="code-block" style="margin-top:10px;"></div>
            </div>
        `;

        // Insert the HTML before the hidden text area that eXe uses to save iDevice data
        var field = $("#activeIdevice textarea.jsContentEditor");
        field.before(html);

        // Load previously saved data, if any
        this.getPreviousValues(field);

        // Get references to inputs and preview container
        const codeInput = $("#codeInput");
        const correctInput = $("#correctLine");
        const feedbackInput = $("#feedbackData");
        const preview = $("#codeLinePreview");

        // When any of the inputs change, update the preview
        codeInput.on("input", () => renderPreview());
        feedbackInput.on("input", () => renderPreview());
        correctInput.on("input", () => renderPreview());

        // Preview rendering function
        function renderPreview() {
            preview.empty(); // Clear old preview
            const lines = codeInput.val().split('\n'); // Split code into lines
            const correct = parseInt(correctInput.val()); // Convert to number
            let feedbackMap = {};

            // Try parsing the feedback JSON
            try {
                feedbackMap = JSON.parse(feedbackInput.val() || '{}');
            } catch (e) {
                feedbackMap = {};
            }

            // For each line, add it to preview with color if needed
            lines.forEach((line, i) => {
                const span = $('<div></div>').text(line).addClass('code-line');
                if (i === correct) span.css('background', '#d4edda'); // green if correct line
                else if (feedbackMap[i]) span.css('background', '#f8d7da'); // red if marked as incorrect
                preview.append(span);
            });
        }

        // Render the initial preview
        renderPreview();
    },

    // Called when the author clicks Save in eXe
    save: function () {
        const code = $("#codeInput").val(); // get code text
        const correct = $("#correctLine").val(); // get correct line number
        const feedback = $("#feedbackData").val(); // get feedback map

        // Validate: must have code
        if (!code.trim()) {
            eXe.app.alert("Please enter code.");
            return false;
        }

        // Return HTML content that will be saved into the SCORM package
        return `
            <pre class="code-block">${$('<div>').text(code).html()}</pre>
            <input type="hidden" class="correctLine" value="${correct}" />
            <input type="hidden" class="feedbackData" value='${feedback}' />
        `;
    },

    // Called to restore saved data into the editing interface
    getPreviousValues: function (field) {
        const content = field.val();
        if (!content) return;

        // Wrap the HTML to allow DOM querying
        const wrapper = $('<div></div>').html(content);
        const codeText = wrapper.find('pre.code-block').text(); // get saved code
        const correctLine = wrapper.find('input.correctLine').val(); // get correct line
        const feedbackMap = wrapper.find('input.feedbackData').val(); // get feedback JSON

        // Set inputs with saved values
        $("#codeInput").val(codeText);
        $("#correctLine").val(correctLine);
        $("#feedbackData").val(feedbackMap);
    }
};
