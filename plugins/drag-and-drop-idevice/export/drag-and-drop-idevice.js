var $exeDeviceExport = {
    init: function () {
        document.querySelectorAll(".dragdrop-idevice").forEach(function (container) {
            const dropZoneEls = container.querySelectorAll(".drop-zone");
            const draggableEls = container.querySelectorAll(".draggable");

            // Reconstruct the interface from saved HTML
            const textWrapper = container.querySelector("p");
            const draggableContainer = container.querySelector("#draggableContainer");

            // Preserve original text
            const originalHTML = textWrapper?.innerHTML || "";
            const draggables = Array.from(draggableEls).map(el => {
                el.setAttribute("draggable", "true");
                el.classList.add("draggable");
                return el.outerHTML;
            });

            const ui = `
                <p>${originalHTML}</p>
                <div id="draggableContainer" style="display: flex; gap: 10px; margin-top: 10px;">
                    ${draggables.join("\n")}
                </div>
                <button class="check-answers-btn" style="margin-top: 10px;">Check Answers</button>
                <div class="feedback" style="margin-top: 8px;"></div>
            `;

            container.innerHTML = ui;

            const containerEl = container;
            const checkBtn = container.querySelector(".check-answers-btn");
            const feedbackBox = container.querySelector(".feedback");

            // Drag start
            containerEl.addEventListener("dragstart", function (e) {
                if (e.target.classList.contains("draggable")) {
                    e.dataTransfer.setData("text/plain", e.target.id);
                }
            });

            // Drag over
            containerEl.addEventListener("dragover", function (e) {
                if (e.target.classList.contains("drop-zone")) {
                    e.preventDefault();
                }
            });

            // Drop
            containerEl.addEventListener("drop", function (e) {
                if (e.target.classList.contains("drop-zone")) {
                    e.preventDefault();
                    const id = e.dataTransfer.getData("text/plain");
                    const dragged = document.getElementById(id);

                    if (dragged && containerEl.contains(dragged)) {
                        e.target.innerHTML = "";
                        e.target.appendChild(dragged);
                    }
                }
            });

            // Check logic
            checkBtn.addEventListener("click", function () {
                let allCorrect = true;

                containerEl.querySelectorAll(".drop-zone").forEach(zone => {
                    const expectedId = zone.getAttribute("data-correct-answer");
                    const dragged = zone.querySelector(".draggable");

                    if (dragged && dragged.id === expectedId) {
                        zone.style.border = "2px solid green";
                        zone.style.backgroundColor = "#eaffea";
                    } else {
                        zone.style.border = "2px solid red";
                        zone.style.backgroundColor = "#ffeaea";
                        allCorrect = false;
                    }
                });

                if (allCorrect) {
                    feedbackBox.textContent = "✅ All correct!";
                    finishCourse(true);
                } else {
                    feedbackBox.textContent = "❌ Some answers are incorrect.";
                }
            });
        });

        // SCORM init if available
        if (typeof pipwerks !== "undefined" && pipwerks.SCORM) {
            pipwerks.SCORM.init();
        }
    }
};

$(function () {
    $exeDeviceExport.init();
});

// ✅ SCORM-safe completion function
function finishCourse(isFinalPackage = false) {
    try {
        if (typeof computeTime === "function") computeTime();

        if (typeof pipwerks !== "undefined" && pipwerks.SCORM) {
            pipwerks.SCORM.SetCompletionStatus("completed");
            pipwerks.SCORM.SetSuccessStatus(isFinalPackage ? "passed" : "incomplete");
            pipwerks.SCORM.save();
            pipwerks.SCORM.quit();
        } else {
            console.warn("SCORM not available.");
        }
    } catch (err) {
        console.error("Error in finishCourse:", err);
    }
}
