function finishCourse() {
    if (typeof computeTime === "function") {
        computeTime();
    }

    if (typeof pipwerks !== "undefined" && pipwerks.SCORM) {
        pipwerks.SCORM.SetCompletionStatus("completed");
        pipwerks.SCORM.SetSuccessStatus("passed");
        pipwerks.SCORM.save();
        pipwerks.SCORM.quit();
    } else {
        console.warn("SCORM API not available. Unable to set completion status.");
    }
}

$(function () {
    $(".finish-btn").on("click", function () {
        finishCourse();
    });

    // Hide the iDevice title in exported view
    $(".finish-button-idevice .iDevice_title").hide();
});
