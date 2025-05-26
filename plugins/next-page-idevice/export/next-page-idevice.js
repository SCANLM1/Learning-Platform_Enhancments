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

    window.location.href = pageUrl;
}

$(function () {
    $(".nextPageButton").on("click", function () {
        const pageUrl = $(this).data("url");
        if (pageUrl) {
            navigateToPage(pageUrl);
        } else {
            console.error("No URL specified for next page.");
        }
    });

    // 🆕 Hide title in export view
    $(".nextPageIdevice .iDevice_title").hide();
});
