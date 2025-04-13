var $exeDevice = {
    init: function() {
        var html = `
            <div id="myExampleForm">
                <div class="exe-idevice-info">${_("Instructions: Enter the question with answers surrounded by asterisks.")}</div>
                <p>
                    <label for="questionInput">Question:</label>
                    <input type="text" id="questionInput" placeholder="Hello yesterday I went to the *shop* then I went *outside*" style="width: 100%; max-width: 1200px; height: 400px;">
                </p>
                <button type="button" id="generateDragDrop">Generate Drag and Drop</button>
                <div id="dragDropArea"></div>
            </div>
        `;

        $("#activeIdevice textarea.jsContentEditor").before(html);
        $exeAuthoring.iDevice.tabs.init("myExampleForm");

        $("#generateDragDrop").click(() => {
            var inputText = $("#questionInput").val();
            this.processInput(inputText);
        });

        this.getPreviousValues($("#activeIdevice textarea.jsContentEditor"));
        this.setupDragAndDrop(); // Ensure drag and drop is set up initially
    },

    processInput: function(inputText) {
        var matches = [...inputText.matchAll(/\*(.*?)\*/g)];
        var lastIndex = 0;
        var dragDropHtml = '<p style="line-height: 1.5;">';
        var draggableItemsHtml = '<div id="draggableContainer" style="display: flex; gap: 10px; margin-top: 10px;">';
    
        matches.forEach((match, index) => {
            var placeholder = `<span class="drop-zone" data-correct-answer="draggableAnswer${index}"></span>`;
            var textPart = inputText.substring(lastIndex, match.index);
            dragDropHtml += textPart + placeholder;
            draggableItemsHtml += `<div class="draggable" draggable="true" id="draggableAnswer${index}">${match[1]}</div>`;
            lastIndex = match.index + match[0].length;
        });
    
        dragDropHtml += inputText.substring(lastIndex) + '</p>';
        draggableItemsHtml += '</div>';
        
        $("#dragDropArea").html(dragDropHtml + draggableItemsHtml);
        this.setupDragAndDrop();
    },

    setupDragAndDrop: function() {
        $(document).on("dragstart", ".draggable", function(e) {
            e.originalEvent.dataTransfer.setData("text/plain", e.target.id);
        });

        $(document).on("dragover", ".drop-zone", function(e) {
            e.preventDefault();
        });

        $(document).on("drop", ".drop-zone", function(e) {
            e.preventDefault();
            const data = e.originalEvent.dataTransfer.getData("text");
            const targetZone = $(e.target).closest('.drop-zone');
            targetZone.empty().append($(`#${data}`));
        });
    },

    save: function() {
        var inputText = $("#questionInput").val();
        this.processInput(inputText);
        $("#dragDropArea").html(); // Save the current state
        this.setupDragAndDrop(); // Re-setup drag and drop after saving state to ensure functionality
        return $("#dragDropArea").html(); // Return the saved state
    },

    getPreviousValues: function(field) {
        var content = field.val();
        if (content) {
            $("#dragDropArea").html(content);
            this.setupDragAndDrop();
        }
    }
};
