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
    },

    processInput: function(inputText) {
        var matches = [...inputText.matchAll(/\*(.*?)\*/g)];
        var lastIndex = 0;
        var dragDropHtml = '<p style="line-height: 1.5;">'; // Ensure line height is enough to contain drop zones
        var draggableItemsHtml = '<div id="draggableContainer" style="display: flex; gap: 10px; margin-top: 10px;">';
    
        matches.forEach((match, index) => {
            var placeholder = `<span class="drop-zone" data-correct-answer="draggableAnswer${index}"></span>`;
            var textPart = inputText.substring(lastIndex, match.index);
            dragDropHtml += textPart + placeholder;
            draggableItemsHtml += `<div class="draggable" draggable="true" id="draggableAnswer${index}">${match[1]}</div>`;
            lastIndex = match.index + match[0].length;
        });
    
        dragDropHtml += inputText.substring(lastIndex) + '</p>';
        $("#dragDropArea").html(dragDropHtml); // Adds the text and drop zones to the page
        $("#dragDropArea").after(draggableItemsHtml); // Adds draggable items below the text
        this.setupDragAndDrop();
    },
    
    //GOOD VERSION

    setupDragAndDrop: function() {
        $(".draggable").on("dragstart", e => {
            e.originalEvent.dataTransfer.setData("text/plain", e.target.id);
        });

        $(".drop-zone").on("dragover", e => e.preventDefault()).on("drop", e => {
            e.preventDefault();
            const data = e.originalEvent.dataTransfer.getData("text");
            const targetZone = $(e.target).closest('.drop-zone');
            if (targetZone.children().length === 0 || targetZone.text().includes('[Drop answer here]')) {
                targetZone.empty().append($(`#${data}`));
            }
        });
    },

    save: function() {
        var inputText = $("#questionInput").val();
        this.processInput(inputText);
        return $("#dragDropArea").html();
    },
    

    getPreviousValues: function(field) {
        var content = field.val();
        if (content) {
            $("#dragDropArea").html(content);
            this.setupDragAndDrop();
        }
    }
};


