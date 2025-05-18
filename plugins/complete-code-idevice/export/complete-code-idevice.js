var $eXeCompleteCode = {
    init: function () {

        // sec policy for content
        const meta = document.createElement("meta");
        meta.httpEquiv = "Content-Security-Policy";
        meta.content = `
            default-src 'self'; 
            script-src 'self' https://cdnjs.cloudflare.com; 
            style-src 'self' https://cdnjs.cloudflare.com; 
            img-src 'self' data:; 
            object-src 'none'; 
            base-uri 'self'; 
            form-action 'self';
        `;
        document.head.appendChild(meta);

        // Function to sanitize HTML
        
        const sanitizeHTML = (str) => {
            const tempDiv = document.createElement("div");
            tempDiv.textContent = str;
            return tempDiv.innerHTML;
        };
        
        var elements = document.querySelectorAll('.complete-code-idevice, .trigger-complete-code');
        elements.forEach(function (container) {
            const codeEl = container.querySelector('.complete-code');
            const answersEl = container.querySelector('.complete-answers');
            const instructions = container.querySelector('.complete-instructions')?.innerHTML || '';
            const codeRaw = codeEl?.innerHTML || '';
            const answers = (answersEl?.textContent || '').split(',').map(a => a.trim());

            let inputIndex = 0;
            const renderedCode = codeRaw.replace(/\[\[\s*.*?\s*\]\]/g, () => {
                return `<input type="text" class="blank" data-index="${inputIndex++}" style="width: 100px; margin: 2px;">`;
            });

            const html = `
                <p>${instructions}</p>
                <pre class="code-snippet">${renderedCode}</pre>
                <button class="submit-btn">Finish</button>
                <div class="feedback" style="margin-top: 10px;"></div>
            `;
            container.innerHTML = html;

            const button = container.querySelector(".submit-btn");
            const blanks = container.querySelectorAll("input.blank");
            const feedbackBox = container.querySelector(".feedback");

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
