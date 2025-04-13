var $exeDeviceExport = {
    init: function () {
        // ✅ SCORM API init (safe in preview/export)
        if (typeof pipwerks !== "undefined" && pipwerks.SCORM) {
            pipwerks.SCORM.init();
        }

        this.setupExportDragAndDrop();
    },

    setupExportDragAndDrop: function () {
        $(".dragdrop-idevice").each(function () {
            const $container = $(this);

            // Make draggables draggable
            $container.find(".draggable").attr("draggable", "true");

            // Drag start
            $container.on("dragstart", ".draggable", function (e) {
                e.originalEvent.dataTransfer.setData("text/plain", e.target.id);
            });

            // Allow drop
            $container.on("dragover", ".drop-zone", function (e) {
                e.preventDefault();
            });

            // Handle drop
            $container.on("drop", ".drop-zone", function (e) {
                e.preventDefault();
                const data = e.originalEvent.dataTransfer.getData("text");
                const $dragged = $("#" + data);

                // Prevent dragging from another iDevice
                if ($container.find(`#${data}`).length > 0) {
                    $(this).empty().append($dragged);
                }
            });

            // Add check button and feedback area (if not already added)
            if (!$container.find(".check-answers-btn").length) {
                $container.append(`
                    <button class="check-answers-btn" style="margin-top: 10px;">Check Answers</button>
                    <div class="feedback" style="margin-top: 8px;"></div>
                `);
            }

            // Check button logic
            $container.on("click", ".check-answers-btn", function () {
                let allCorrect = true;

                $container.find(".drop-zone").each(function () {
                    const expectedId = $(this).attr("data-correct-answer");
                    const actualChild = $(this).children(".draggable");

                    if (actualChild.length && actualChild.attr("id") === expectedId) {
                        $(this).css({
                            border: "2px solid green",
                            backgroundColor: "#eaffea"
                        });
                    } else {
                        $(this).css({
                            border: "2px solid red",
                            backgroundColor: "#ffeaea"
                        });
                        allCorrect = false;
                    }
                });

                const feedback = $container.find(".feedback");
                if (allCorrect) {
                    feedback.text("✅ All correct!");
                    finishCourse(true); // ✅ Marks SCORM completion
                } else {
                    feedback.text("❌ Some answers are incorrect.");
                }
            });
        });
    }
};

$(function () {
    $exeDeviceExport.init();
});

// ✅ SCORM-friendly course completion handler (preview-safe)
function finishCourse(isFinalPackage = false) {
    try {
        if (typeof pipwerks !== "undefined" && pipwerks.SCORM) {
            // Optional: include time tracking if SCOFunctions.js provides computeTime()
            if (typeof computeTime === "function") computeTime();

            pipwerks.SCORM.SetCompletionStatus("completed");

            if (isFinalPackage) {
                pipwerks.SCORM.SetSuccessStatus("passed");
            } else {
                pipwerks.SCORM.SetSuccessStatus("incomplete");
            }

            pipwerks.SCORM.save();
            pipwerks.SCORM.quit();

            if (isFinalPackage) {
                console.log("✅ Course completed!");
            } else {
                console.log("✅ SCORM package completed.");
            }
        } else {
            console.warn("⚠️ SCORM API not available. Skipping SCORM completion call.");
        }
    } catch (err) {
        console.error("⚠️ Error during SCORM finish:", err);
    }
}
