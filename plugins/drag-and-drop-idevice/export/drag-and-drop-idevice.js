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

            // Store original draggable HTML for reset
            const originalDraggablesHTML = [...draggables];

            // Track stats
            const stats = {
                clicks: 0,
                drags: 0,
                drops: 0,
                checkAttempts: 0,
                failedAttempts: 0,
                startTime: Date.now(),
                totalTime: 0
            };

            const ui = `
                <p>${originalHTML}</p>
                <div id="draggableContainer" style="display: flex; gap: 10px; margin-top: 10px;">
                    ${draggables.join("\n")}
                </div>
                <button class="check-answers-btn" style="margin-top: 10px;">Check Answers</button>
                <button class="reset-answers-btn" style="margin-top: 10px; margin-left: 10px;">Reset</button>
                <div class="feedback" style="margin-top: 8px;"></div>
                <div class="stats-display" style="margin-top: 12px; font-family: monospace; background: #f9f9f9; padding: 8px; border: 1px solid #ccc;"></div>
            `;

            container.innerHTML = ui;

            const containerEl = container;
            const checkBtn = container.querySelector(".check-answers-btn");
            const resetBtn = container.querySelector(".reset-answers-btn");
            const feedbackBox = container.querySelector(".feedback");
            const statsBox = container.querySelector(".stats-display");
            const dragContainer = container.querySelector("#draggableContainer");

            // Click tracker
            containerEl.addEventListener("click", function () {
                stats.clicks++;
                updateStatsDisplay();
            });

            // Drag start
            containerEl.addEventListener("dragstart", function (e) {
                if (e.target.classList.contains("draggable")) {
                    stats.drags++;
                    e.dataTransfer.setData("text/plain", e.target.id);
                    updateStatsDisplay();
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
                        stats.drops++;
                        updateStatsDisplay();
                    }
                }
            });

            // Check logic
            checkBtn.addEventListener("click", function () {
                stats.checkAttempts++;
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

                if (!allCorrect) {
                    stats.failedAttempts++;
                } else {
                    stats.totalTime = Math.round((Date.now() - stats.startTime) / 1000);
                }

                updateStatsDisplay();

                if (allCorrect) {
                    feedbackBox.textContent = "✅ All correct!";
                    finishCourse(true);
                } else {
                    feedbackBox.textContent = "❌ Some answers are incorrect.";
                }
            });

            // Reset logic
            resetBtn.addEventListener("click", function () {
                // Clear drop-zones
                containerEl.querySelectorAll(".drop-zone").forEach(zone => {
                    zone.innerHTML = "";
                    zone.style.border = "";
                    zone.style.backgroundColor = "";
                });

                // Restore draggables
                dragContainer.innerHTML = originalDraggablesHTML.join("\n");

                // Reapply drag attributes
                dragContainer.querySelectorAll(".draggable").forEach(el => {
                    el.setAttribute("draggable", "true");
                    el.classList.add("draggable");
                });

                // Clear feedback
                feedbackBox.textContent = "";

                updateStatsDisplay();
            });

            // Update stats box
            function updateStatsDisplay() {
                statsBox.innerHTML = `
                    <strong>User Stats</strong><br>
                    Clicks: ${stats.clicks}<br>
                    Drags: ${stats.drags}<br>
                    Drops: ${stats.drops}<br>
                    Check Attempts: ${stats.checkAttempts}<br>
                    Failed Attempts: ${stats.failedAttempts}<br>
                    Time Taken: ${stats.totalTime > 0 ? stats.totalTime + 's' : '-'}
                `;
            }

            updateStatsDisplay(); // Initialize on load
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

// SCORM-safe completion function
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
