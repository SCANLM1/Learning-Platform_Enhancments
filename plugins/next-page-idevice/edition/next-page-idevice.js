var $exeDevice = {
    init: function () {
        if ($("#nextPageForm").length === 0) {
            const html = `
                <div id="nextPageForm">
                    <div class="exe-idevice-info">
                        Enter the URL of the next page you want to navigate to.
                    </div>
                    <label for="nextPageURL">Next Page URL:</label>
                    <input type="text" id="nextPageURL" placeholder="e.g., page2.html">
                </div>
            `;

            const field = $("#activeIdevice textarea.jsContentEditor");
            field.before(html);
            field.hide();

            this.getPreviousValues(field);

            // ✅ Auto-clear the title if it matches default
            setTimeout(function () {
                const titleField = $("#activeIdevice input[type='text']").eq(0);
                if (titleField.val() === "Next Page Button") {
                    titleField.val("").focus();
                }
            }, 100);
        }
    },

    save: function () {
        const nextPage = $("#nextPageURL").val().trim().toLowerCase();
        if (nextPage === "") {
            eXe.app.alert("Please provide the next page URL.");
            return false;
        }

        return `
            <div class="nextPageIdevice">
                <div class="button-layout">
                    <button class="nextPageButton" data-url="${nextPage}">Next</button>
                </div>
            </div>
        `;
    },

    getPreviousValues: function (field) {
        const content = field.val();
        if (!content) return;

        const wrapper = $("<div>").html(content);
        const nextPage = wrapper.find(".nextPageButton").data("url");
        $("#nextPageURL").val(nextPage || "");
    }
};
