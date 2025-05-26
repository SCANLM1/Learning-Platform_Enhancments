var $exeDevice = {
    init: function () {
        if (document.getElementById("prevNextPageForm")) return;

        const html = `
            <div id="prevNextPageForm">
                <div class="exe-idevice-info">
                    Enter URLs for both the previous and next pages. Clicking "Previous" will navigate to the previous page. Clicking "Next" will go to the next.
                </div>
                <label for="previousPageURL">Previous Page URL:</label>
                <input type="text" id="previousPageURL" placeholder="e.g., page1.html"><br>
                <label for="nextPageURL">Next Page URL:</label>
                <input type="text" id="nextPageURL" placeholder="e.g., page3.html">
            </div>
        `;

        const field = $("#activeIdevice textarea.jsContentEditor");
        field.before(html);
        field.hide();

        this.getPreviousValues(field);

        // Auto-clear title if default
        setTimeout(function () {
            const titleField = $("#activeIdevice input[type='text']").eq(0);
            if (titleField.val() === "Previous and Next Button") {
                titleField.val("").focus();
            }
        }, 100);
    },

    save: function () {
        const previousPage = $("#previousPageURL").val().trim().toLowerCase();
        const nextPage = $("#nextPageURL").val().trim().toLowerCase();

        if (previousPage === "" || nextPage === "") {
            eXe.app.alert("Please provide both previous and next page URLs.");
            return false;
        }

        const html = `
        <div class="prevNextPageIdevice">
            <div class="button-layout">
                <div class="button-left">
                    <button class="prevNextButton previous" data-url="${previousPage}">Previous</button>
                </div>
                <div class="button-right">
                    <button class="prevNextButton next" data-url="${nextPage}">Next</button>
                </div>
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
        const previousPage = wrapper.find(".prevNextButton.previous").data("url");
        const nextPage = wrapper.find(".prevNextButton.next").data("url");

        $("#previousPageURL").val(previousPage || "");
        $("#nextPageURL").val(nextPage || "");
    }
};