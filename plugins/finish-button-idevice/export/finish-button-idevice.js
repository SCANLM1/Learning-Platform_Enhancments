function finishCourse() {
    if (typeof computeTime === "function") {
        computeTime();
    }

    if (typeof pipwerks !== "undefined" && pipwerks.SCORM) {
        // Mark the SCORM package as completed
        pipwerks.SCORM.SetCompletionStatus("completed");

        
        pipwerks.SCORM.save();
        pipwerks.SCORM.quit();

        
    } else {
        console.warn("SCORM API not available. Unable to set completion status.");
    }
}

// Initialization for preview/published mode
$(function() {
    $(".finishButton").on("click", function() {
        finishCourse();
    });
});
