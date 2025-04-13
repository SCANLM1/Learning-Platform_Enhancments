var $exeDevice = {
    init: function () {
        const html = `
            <div id="myExampleForm">
                <div class="exe-idevice-info">${_("Instructions: Enter the question with answers surrounded by asterisks.")}</div>
                <p>
                    <label for="questionInput">Question:</label>
                    <textarea id="questionInput" placeholder="Hello yesterday I went to the *shop* then I went *outside*" style="width: 100%; height: 120px;"></textarea>
                </p>
                <button type="button" id="generateDragDrop">Generate Drag and Drop</button>
                <div id="dragDropArea"></div>
            </div>
        `;

        const field = $("#activeIdevice textarea.jsContentEditor");
        field.before(html);
        field.hide(); // ✅ hide default textarea
        $exeAuthoring.iDevice.tabs.init("myExampleForm");

        $("#generateDragDrop").click(() => {
            const inputText = $("#questionInput").val();
            this.processInput(inputText);
        });

        this.getPreviousValues(field);
    },

    processInput: function (inputText) {
        const matches = [...inputText.matchAll(/\*(.*?)\*/g)];
        let lastIndex = 0;
        const uid = 'dd' + Date.now(); // Unique prefix to prevent ID collision

        $("#dragDropArea").empty();

        let dragDropHtml = `<div class="dragdrop-idevice" data-uid="${uid}"><p style="line-height: 1.5;">`;
        let draggableItemsHtml = `<div id="${uid}_draggableContainer" style="display: flex; gap: 10px; margin-top: 10px;">`;

        matches.forEach((match, index) => {
            const textBefore = inputText.substring(lastIndex, match.index);
            const answer = match[1];
            const dragId = `${uid}_draggableAnswer${index}`;

            dragDropHtml += `${textBefore}<span class="drop-zone" data-correct-answer="${dragId}"></span>`;
            draggableItemsHtml += `<div class="draggable" draggable="true" id="${dragId}">${answer}</div>`;

            lastIndex = match.index + match[0].length;
        });

        dragDropHtml += inputText.substring(lastIndex) + '</p>' + draggableItemsHtml + '</div></div>';

        $("#dragDropArea").html(dragDropHtml);
        this.setupDragAndDrop();
    },

    save: function () {
        const inputText = $("#questionInput").val();
        const matches = [...inputText.matchAll(/\*(.*?)\*/g)];
        let lastIndex = 0;
        const uid = 'dd' + Date.now();

        let dragDropHtml = `<div class="dragdrop-idevice" data-uid="${uid}"><p style="line-height: 1.5;">`;
        let draggableItemsHtml = `<div id="${uid}_draggableContainer" style="display: flex; gap: 10px; margin-top: 10px;">`;

        matches.forEach((match, index) => {
            const textBefore = inputText.substring(lastIndex, match.index);
            const answer = match[1];
            const dragId = `${uid}_draggableAnswer${index}`;

            dragDropHtml += `${textBefore}<span class="drop-zone" data-correct-answer="${dragId}"></span>`;
            draggableItemsHtml += `<div class="draggable" draggable="true" id="${dragId}">${answer}</div>`;

            lastIndex = match.index + match[0].length;
        });

        dragDropHtml += inputText.substring(lastIndex) + '</p>' + draggableItemsHtml + '</div></div>';

        // Save to the hidden editor field
        $("#activeIdevice textarea.jsContentEditor").val(dragDropHtml);
        return dragDropHtml;
    },

    getPreviousValues: function (field) {
        const content = field.val();
        if (content) {
            $("#dragDropArea").html(content);
            this.setupDragAndDrop();
        }
    },

    setupDragAndDrop: function () {
        $(document).off("dragstart.drag").on("dragstart.drag", ".draggable", function (e) {
            e.originalEvent.dataTransfer.setData("text/plain", e.target.id);
        });

        $(document).off("dragover.drag drop.drag");

        $(document).on("dragover.drag", ".drop-zone", function (e) {
            e.preventDefault();
        });

        $(document).on("drop.drag", ".drop-zone", function (e) {
            e.preventDefault();
            const data = e.originalEvent.dataTransfer.getData("text/plain");
            const $dragged = $("#" + data);
            const targetZone = $(e.target).closest(".drop-zone");

            // Make sure it's from this iDevice
            if ($(this).closest(".dragdrop-idevice").find(`#${data}`).length > 0) {
                targetZone.empty().append($dragged);
            }
        });
    }
};
