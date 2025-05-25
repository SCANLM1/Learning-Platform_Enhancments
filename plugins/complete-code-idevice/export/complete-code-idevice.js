var $eXeCompleteCode = {
    init: function () {
        var elements = document.querySelectorAll('.complete-code-idevice, .trigger-complete-code');
        elements.forEach(function (container) {
            const codeEl = container.querySelector('.complete-code');
            const answersEl = container.querySelector('.complete-answers');
            const instructions = container.querySelector('.complete-instructions')?.innerHTML || '';
            const hintHTML = container.querySelector('.complete-hint')?.innerHTML || '';
            const codeRaw = codeEl?.innerHTML || '';
            const answers = (answersEl?.textContent || '').split(',').map(a => a.trim());

            let inputIndex = 0;
            const renderedCode = codeRaw.replace(/\[\[\s*.*?\s*\]\]/g, () => {
                return `<input type="text" class="blank" data-index="${inputIndex++}" style="width: 100px; margin: 2px;">`;
            });

            const html = `
                <p>${instructions}</p>
                <pre class="code-snippet">${renderedCode}</pre>
                <div class="feedback"></div>
                <div class="button-layout">
                    <div class="button-left">
                        <button class="reset-btn">Reset</button>
                        ${hintHTML ? `<button class="hint-btn">Hint</button>` : ""}
                    </div>
                    <div class="button-center">
                        <button class="submit-btn">Check Answers</button>
                    </div>
                    <div class="button-right"></div>
                </div>
    
                ${hintHTML ? `<div class="hint-box" style="display:none; margin-top:10px;">${hintHTML}</div>` : ""}
            `;
            container.innerHTML = html;

            const button = container.querySelector(".submit-btn");
            const resetButton = container.querySelector(".reset-btn");
            const hintButton = container.querySelector(".hint-btn");
            const blanks = container.querySelectorAll("input.blank");
            const feedbackBox = container.querySelector(".feedback");
            const hintBox = container.querySelector(".hint-box");

            button.addEventListener("click", function () {
                let allCorrect = true;

                blanks.forEach((input, i) => {
                    const userAnswer = input.value.trim();
                    const correct = answers[i];

                    if (userAnswer === correct) {
                        input.style.border = "2px solid green";
                        input.style.backgroundColor = "#eaffea";
                    } else {
                        input.style.border = "2px solid red";
                        input.style.backgroundColor = "#ffeaea";
                        allCorrect = false;
                    }
                });

                if (allCorrect) {
                    feedbackBox.textContent = "✅ All correct!";
                    finishCourse();
                } else {
                    feedbackBox.textContent = "❌ Some answers are incorrect.";
                }
            });

            resetButton.addEventListener("click", function(){
                blanks.forEach(input => {
                    input.value = "";
                    input.style.border = "";
                    input.style.backgroundColor = "";
                });
                feedbackBox.textContent = "";
                if (hintBox) hintBox.style.display = "none";
            });

            if (hintButton && hintBox) {
                hintButton.addEventListener("click", function () {
                    hintBox.style.display = hintBox.style.display === "none" ? "block" : "none";
                });
            }

        });
    }
};

$(function () {
    $eXeCompleteCode.init();
});

function finishCourse() {
    if (typeof pipwerks !== "undefined" && pipwerks.SCORM) {
        pipwerks.SCORM.SetCompletionStatus("completed");
        pipwerks.SCORM.SetSuccessStatus("passed");
        pipwerks.SCORM.save();
        pipwerks.SCORM.quit();
    }
}
