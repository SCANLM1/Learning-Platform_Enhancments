var $exeDevice = {
    init: function() {
        if ($("#prevNextPageForm").length === 0) {
            // HTML form for editing mode
            var html = `
                <div id="prevNextPageForm">
                    <label for="previousPageURL">Previous Page URL:</label>
                    <input type="text" id="previousPageURL" placeholder="e.g., page1.html"><br>
                    <label for="nextPageURL">Next Page URL:</label>
                    <input type="text" id="nextPageURL" placeholder="e.g., page3.html">
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
        // Get the previous and next URLs, convert to lowercase, and trim whitespace
        var previousPage = $("#previousPageURL").val().trim().toLowerCase();
        var nextPage = $("#nextPageURL").val().trim().toLowerCase();

        if (previousPage === "" || nextPage === "") {
            eXe.app.alert("Please provide both previous and next page URLs.");
            return false;
        }

        // Save buttons with data attributes for the URLs
        return `
            <button class="prevNextButton" data-url="${previousPage}">Previous</button>
            <button class="prevNextButton" data-url="${nextPage}">Next</button>
        `;
    },

    getPreviousValues: function(field) {
        var content = field.val();
        if (content !== '') {
            var wrapper = $("<div></div>");
            wrapper.html(content);

            // Extract the previous and next page URLs from the data attributes
            var previousPage = wrapper.find(".prevNextButton").eq(0).data("url");
            var nextPage = wrapper.find(".prevNextButton").eq(1).data("url");

            $("#previousPageURL").val(previousPage);
            $("#nextPageURL").val(nextPage);
        }
    }
};
