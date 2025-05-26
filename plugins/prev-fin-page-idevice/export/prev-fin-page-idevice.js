function navigateToPage(pageUrl) {
    if (typeof computeTime === "function") {
        computeTime();
    }

    if (typeof pipwerks !== "undefined" && pipwerks.SCORM) {
        pipwerks.SCORM.SetCompletionStatus("incomplete");
        pipwerks.SCORM.save();
    } else {
        console.warn("SCORM API not available.");
    }

    window.location.href = pageUrl;
}

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
        console.warn("SCORM API not available.");
    }
}

$(function () {
    $(".previousPageButton").on("click", function () {
        const pageUrl = $(this).data("url");
        if (pageUrl) {
            navigateToPage(pageUrl);
        } else {
            console.error("No URL specified for the previous page.");
        }
    });

    $(".finishButton").on("click", function () {
        finishCourse();
    });

    // 🆕 Hide iDevice title in export
    $(".prevFinPageIdevice .iDevice_title").hide();
});
