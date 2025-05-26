var $exeDeviceExport = {
    init: function () {
        document.querySelectorAll(".dragdrop-idevice").forEach(function (container) {
            const instructionHTML = container.querySelector(".dragdrop-instructions")?.innerHTML || "";
            const hintHTML = container.querySelector(".dragdrop-hint")?.innerHTML || "";
            const sentenceRaw = container.querySelector(".dragdrop-question")?.innerHTML || "";

            const matches = [...sentenceRaw.matchAll(/\[\[(.*?)\]\]/g)];
            let lastIndex = 0;
            const uid = 'dd' + Date.now();
            let dropHTML = `<pre class="code-snippet">`;
            let draggables = [];

            matches.forEach((match, i) => {
                const textBefore = sentenceRaw.substring(lastIndex, match.index);
                const answer = match[1];
                const id = `${uid}_drag_${i}`;

                // ✅ Add zero-width space to preserve inline layout even when empty
                dropHTML += `${textBefore}<span class="drop-zone" data-correct-answer="${id}">&#8203;</span>`;
                draggables.push(`<div class="draggable" id="${id}" draggable="true">${answer}</div>`);
                lastIndex = match.index + match[0].length;
            });

            dropHTML += sentenceRaw.substring(lastIndex) + '</pre>';

            for (let i = draggables.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [draggables[i], draggables[j]] = [draggables[j], draggables[i]];
            }

            const dragContainer = `<div class="draggable-container">${draggables.join("")}</div>`;
            const layout = `
                <div class="instructions">${instructionHTML}</div>
                ${dropHTML}
                ${dragContainer}
                <div class="button-layout">
                    <div class="button-left">
                        ${hintHTML ? `<button class="hint-btn">Hint</button>` : ""}
                        <button class="reset-btn">Reset</button>
                    </div>
                    <div class="button-center">
                        <button class="check-btn">Check Answers</button>
                    </div>
                    <div class="button-right"></div>
                </div>
                <div class="feedback"></div>
                ${hintHTML ? `<div class="hint-box" style="display:none;">${hintHTML}</div>` : ""}
            `;

            container.innerHTML = layout;

            const drops = container.querySelectorAll(".drop-zone");
            const feedback = container.querySelector(".feedback");
            const checkBtn = container.querySelector(".check-btn");
            const resetBtn = container.querySelector(".reset-btn");
            const hintBtn = container.querySelector(".hint-btn");
            const hintBox = container.querySelector(".hint-box");
            const dragBox = container.querySelector(".draggable-container");

            // Drag and Drop Behavior
            container.addEventListener("dragstart", e => {
                if (e.target.classList.contains("draggable")) {
                    e.dataTransfer.setData("text/plain", e.target.id);
                }
            });

            container.addEventListener("dragover", e => {
                if (e.target.classList.contains("drop-zone")) {
                    e.preventDefault();
                }
            });

            container.addEventListener("drop", e => {
                const id = e.dataTransfer.getData("text/plain");
                const el = document.getElementById(id);
                const zone = e.target.closest(".drop-zone");

                if (el && zone) {
                    zone.innerHTML = "";
                    zone.appendChild(el);
                }
            });

            // Check Answers
            checkBtn.addEventListener("click", () => {
                let allCorrect = true;
                drops.forEach(zone => {
                    const correct = zone.dataset.correctAnswer;
                    const dragged = zone.querySelector(".draggable");
                    if (dragged && dragged.id === correct) {
                        zone.style.border = "2px solid green";
                        zone.style.backgroundColor = "#eaffea";
                    } else {
                        zone.style.border = "2px solid red";
                        zone.style.backgroundColor = "#ffeaea";
                        allCorrect = false;
                    }
                });
                feedback.textContent = allCorrect ? "✅ All correct!" : "❌ Some answers are incorrect.";
                if (allCorrect) finishCourse();
            });

            // Reset
            resetBtn.addEventListener("click", () => {
                drops.forEach(zone => {
                    const item = zone.querySelector(".draggable");
                    if (item) dragBox.appendChild(item);
                    zone.innerHTML = "&#8203;";
                    zone.style.border = "";
                    zone.style.backgroundColor = "";
                });

                const items = [...dragBox.querySelectorAll(".draggable")];
                for (let i = items.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [items[i], items[j]] = [items[j], items[i]];
                }
                dragBox.innerHTML = "";
                items.forEach(item => dragBox.appendChild(item));

                feedback.textContent = "";
                if (hintBox) hintBox.style.display = "none";
            });

            if (hintBtn && hintBox) {
                hintBtn.addEventListener("click", () => {
                    hintBox.style.display = hintBox.style.display === "none" ? "block" : "none";
                });
            }
        });

        if (typeof pipwerks !== "undefined" && pipwerks.SCORM) {
            pipwerks.SCORM.init();
        }
    }
};

$(function () {
    $exeDeviceExport.init();
});

function finishCourse() {
    if (typeof pipwerks !== "undefined" && pipwerks.SCORM) {
        pipwerks.SCORM.SetCompletionStatus("completed");
        pipwerks.SCORM.SetSuccessStatus("passed");
        pipwerks.SCORM.save();
        pipwerks.SCORM.quit();
    }
}
