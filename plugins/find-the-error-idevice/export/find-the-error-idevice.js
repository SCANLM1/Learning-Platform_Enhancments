/**
 * Find the Error iDevice - Export version
 *
 * Released under Attribution-ShareAlike 4.0 International License.
 * Based on template by Ignacio Gros (http://gros.es/)
 * Adapted for "Find the Error" plugin by Shubham Paudel
 *
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 */

// Define the main plugin object
var $findErrorIdevice = {
    // Initialization function called on page load
    init: function () {
        // For each instance of this plugin on the page
        $(".findErrorIdevice").each(function () {
            var content = $(".iDevice_content", this);
            if (content.length !== 1) return;

            // Extract code block, correct line index, and feedback JSON from hidden inputs
            const codeBlock = $("pre.code-block", content).text();
            const correctLine = parseInt($("input.correctLine", content).val());
            const feedbackJSON = $("input.feedbackData", content).val();

            // Parse feedback JSON to an object
            const feedbackMap = JSON.parse(feedbackJSON || '{}');

            // Create a container to render the interactive code block
            const displayContainer = $('<div class="code-block" style="white-space: pre;"></div>');
            content.empty().append(displayContainer);

            // Render the code block with interactive line selection
            $findErrorIdevice.renderCode(codeBlock, correctLine, feedbackMap, displayContainer[0]);
        });
    },

    // Function to render code lines and attach interactivity
    renderCode: function (codeText, correctLine, feedbackMap, container) {
        const lines = codeText.split('\n'); // Split the code into lines

        lines.forEach((line, i) => {
            const span = document.createElement('span'); // Create a span for each line
            span.textContent = line;
            span.classList.add('code-line');
            span.dataset.line = i;

            // When a line is clicked
            span.addEventListener('click', function () {
                // Clear previous highlights (red/green)
                container.querySelectorAll('.code-line').forEach(el => {
                    el.classList.remove('correct', 'incorrect');
                });

                // Check if selected line is the correct one
                if (i === correctLine) {
                    span.classList.add('correct');
                    alert("✅ That's correct!");
                } else {
                    span.classList.add('incorrect');
                    const feedback = feedbackMap[i] || "❌ That's incorrect.";
                    alert(`Oops! Line ${i + 1} was the wrong one: ${feedback}`);
                }
            });

            // Add the span to the container
            container.appendChild(span);
        });
    }
};

// Run the plugin once the DOM is ready
$(function () {
    $findErrorIdevice.init();
});
