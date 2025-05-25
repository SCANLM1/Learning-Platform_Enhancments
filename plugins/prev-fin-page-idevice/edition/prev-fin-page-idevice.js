var $exeDevice = {
    init: function() {
        if ($("#prevFinPageForm").length === 0) {
            // HTML form for editing mode
            var html = `
                <div id="prevFinPageForm">
                    <label for="previousPageURL">Previous Page URL:</label>
                    <input type="text" id="previousPageURL" placeholder="e.g., page1.html"><br>
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
        // Get the previous and finish URLs and final package checkbox status
        var previousPage = $("#previousPageURL").val().trim().toLowerCase();

        if (previousPage === "") {
            eXe.app.alert("Please provide a previous page URL.");
            return false;
        }

        // Save buttons with data attributes for navigation and finishing
        return `
            <button class="previousPageButton" data-url="${previousPage}">Previous</button>
            <button class="finishButton">Finish</button>
            `;
    },

    getPreviousValues: function(field) {
        var content = field.val();
        if (content !== '') {
            var wrapper = $("<div></div>");
            wrapper.html(content);

            // Extract the previous and finish page URLs and the final package status
            var previousPage = wrapper.find(".previousPageButton").data("url");

            $("#previousPageURL").val(previousPage);
        }
    }
};
