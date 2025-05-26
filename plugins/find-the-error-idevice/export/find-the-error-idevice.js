var $findErrorExport = {
    init: function () {
        $(".find-error-idevice").each(function () {
            const container = $(this);
            const instructionsHTML = container.find(".find-error-instructions").html() || "";
            const codeRaw = $("<div>").html(container.find(".find-error-code").html() || "").text();
            const correctLine = parseInt(container.find(".find-error-correct").text());
            const hintHTML = container.find(".find-error-hint").html() || "";

            const lines = codeRaw.split('\n');
            const uid = "fe_" + Date.now();

            let codeHTML = `<pre class="code-snippet">`;
            lines.forEach((line, i) => {
                codeHTML += `<div class="code-line" data-line="${i}">${line}</div>`;
            });
            codeHTML += `</pre>`;

            const layout = `
                <div class="instructions">${instructionsHTML}</div>
                ${codeHTML}
                <div class="button-layout">
                    <div class="button-left">
                        ${hintHTML ? `<button class="hint-btn">Hint</button>` : ""}
                        <button class="reset-btn">Reset</button>
                    </div>
                    <div class="button-center">
                        <button class="check-btn">Submit</button>
                    </div>
                    <div class="button-right"></div>
                </div>
                <div class="feedback"></div>
                ${hintHTML ? `<div class="hint-box" style="display:none;">${hintHTML}</div>` : ""}
            `;

            container.html(layout);

            const feedback = container.find(".feedback");
            const checkBtn = container.find(".check-btn");
            const resetBtn = container.find(".reset-btn");
            const hintBtn = container.find(".hint-btn");
            const hintBox = container.find(".hint-box");
            const codeLines = container.find(".code-line");

            let selectedLine = null;

            // Line selection
            codeLines.on("click", function () {
                codeLines.removeClass("selected");
                $(this).addClass("selected");
                selectedLine = parseInt($(this).data("line"));
            });

            // Submit
            checkBtn.on("click", function () {
                if (selectedLine === null) {
                    feedback.text("⚠️ Please select a line first.");
                    return;
                }

                codeLines.removeClass("correct incorrect");

                if (selectedLine === correctLine) {
                    codeLines.eq(selectedLine).addClass("correct");
                    feedback.text("✅ Correct! Well spotted.");
                    if (typeof finishCourse === "function") finishCourse();
                } else {
                    codeLines.eq(selectedLine).addClass("incorrect");
                    feedback.text("❌ Not quite. Try again.");
                }
            });

            // Reset
            resetBtn.on("click", function () {
                codeLines.removeClass("selected correct incorrect");
                selectedLine = null;
                feedback.text("");
                if (hintBox.length) hintBox.hide();
            });

            // Hint
            if (hintBtn && hintBox.length) {
                hintBtn.on("click", function () {
                    hintBox.toggle();
                });
            }
        });

        // SCORM init
        if (typeof pipwerks !== "undefined" && pipwerks.SCORM) {
            pipwerks.SCORM.init();
        }
    }
};

$(function () {
    $findErrorExport.init();
});

function finishCourse() {
    if (typeof pipwerks !== "undefined" && pipwerks.SCORM) {
        pipwerks.SCORM.SetCompletionStatus("completed");
        pipwerks.SCORM.SetSuccessStatus("passed");
        pipwerks.SCORM.save();
        pipwerks.SCORM.quit();
    }
}
