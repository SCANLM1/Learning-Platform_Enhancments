var $exeDevice = {
    init: function () {
        if ($("#prevFinPageForm").length === 0) {
            const html = `
                <div id="prevFinPageForm">
                    <div class="exe-idevice-info">
                        Enter the URL of the previous page. Clicking "Previous" will navigate there. Clicking "Finish" will complete the SCORM package.
                        (Note: Initial Home page URL is <code>index.html</code>)
                    </div>
                    <label for="previousPageURL">Previous Page URL:</label>
                    <input type="text" id="previousPageURL" placeholder="e.g., index.html">
                </div>
            `;

            const field = $("#activeIdevice textarea.jsContentEditor");
            field.before(html);
            field.hide();

            this.getPreviousValues(field);

            // ✅ Auto-clear the title field if it's the default value
            setTimeout(function () {
                const titleField = $("#activeIdevice input[type='text']").eq(0);
                if (titleField.val() === "Previous and Finish Button") {
                    titleField.val("").focus();
                }
            }, 100);
        }
    },

    save: function () {
        const previousPage = $("#previousPageURL").val().trim().toLowerCase();
        if (previousPage === "") {
            eXe.app.alert("Please provide a previous page URL.");
            return false;
        }

        const html = `
            <div class="prevFinPageIdevice">
                <div class="button-layout">
                    <div class="button-left">
                        <button class="previousPageButton" data-url="${previousPage}">Previous</button>
                    </div>
                    <div class="button-right">
                        <button class="finishButton">Finish</button>
                    </div>
                    <div></div>
                </div>
            </div>
        `;

        $("#activeIdevice textarea.jsContentEditor").val(html);
        return html;
    },

    getPreviousValues: function (field) {
        const content = field.val();
        if (!content) return;

        const wrapper = $("<div>").html(content);
        const previousPage = wrapper.find(".previousPageButton").data("url");
        $("#previousPageURL").val(previousPage || "");
    }
};
