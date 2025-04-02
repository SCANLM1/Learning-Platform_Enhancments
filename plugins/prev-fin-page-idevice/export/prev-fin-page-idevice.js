function navigateToPage(pageUrl) {
    if (typeof computeTime === "function") {
        computeTime();
    }

    if (typeof pipwerks !== "undefined" && pipwerks.SCORM) {
        pipwerks.SCORM.SetCompletionStatus("incomplete");
        pipwerks.SCORM.save();
    } else {
        console.warn("SCORM API not available. Unable to set completion status.");
    }

    window.location.href = pageUrl;  // Navigate to the specified URL
}

function finishCourse() {
    if (typeof computeTime === "function") {
        computeTime();
    }

    if (typeof pipwerks !== "undefined" && pipwerks.SCORM) {
        // Set the SCORM package completion status
        pipwerks.SCORM.SetCompletionStatus("completed");



        pipwerks.SCORM.save();
        pipwerks.SCORM.quit();

    } else {
        console.warn("SCORM API not available. Unable to set completion status.");
    }

}

// Initialization for preview/published mode
$(function() {
    $(".previousPageButton").on("click", function() {
        var pageUrl = $(this).data("url");
        if (pageUrl) {
            navigateToPage(pageUrl);
        } else {
            console.error("No URL specified for the previous page.");
        }
    });

    $(".finishButton").on("click", function() {
        finishCourse();
    });
});
