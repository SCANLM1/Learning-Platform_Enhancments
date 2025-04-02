function navigateToPage(pageUrl) {
    if (typeof computeTime === "function") {
        computeTime();
    }

    if (typeof pipwerks !== "undefined" && pipwerks.SCORM) {
        // Ensure status is set to "incomplete" without marking it complete
        pipwerks.SCORM.SetCompletionStatus("incomplete");
        pipwerks.SCORM.save();
    } else {
        console.warn("SCORM API not available. Unable to set completion status.");
    }

    window.location.href = pageUrl;
}

// Initialization for the preview/published mode
$(function() {
    $(".nextPageButton").on("click", function() {
        var pageUrl = $(this).data("url");
        if (pageUrl) {
            navigateToPage(pageUrl);
        } else {
            console.error("No URL specified for next page.");
        }
    });
});
