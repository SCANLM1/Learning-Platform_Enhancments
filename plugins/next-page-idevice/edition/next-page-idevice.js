var $exeDevice = {
    init: function() {
        // Avoid adding multiple forms
        if ($("#nextPageForm").length === 0) {
            // HTML form for editing mode
            var html = `
                <div id="nextPageForm">
                    <label for="nextPageURL">What is your next page URL?</label>
                    <input type="text" id="nextPageURL" placeholder="e.g., page2.html">
                </div>
            `;

            // Insert the form before the hidden textarea
            var field = $("#activeIdevice textarea.jsContentEditor");
            field.before(html);

            // Load previous values if they exist
            this.getPreviousValues(field);
        }
    },

    save: function() {
        // Get the input URL, convert to lowercase, and trim whitespace
        var nextPage = $("#nextPageURL").val().trim().toLowerCase();
        if (nextPage === "") {
            eXe.app.alert("Please provide the next page URL.");
            return false;
        }

        // Save button with a data attribute for the URL
        return `<button class="nextPageButton" data-url="${nextPage}">Next</button>`;
    },

    getPreviousValues: function(field) {
        var content = field.val();
        if (content !== '') {
            var wrapper = $("<div></div>");
            wrapper.html(content);

            // Extract the next page URL from the data attribute
            var nextPage = wrapper.find(".nextPageButton").data("url");
            $("#nextPageURL").val(nextPage);
        }
    }
};
