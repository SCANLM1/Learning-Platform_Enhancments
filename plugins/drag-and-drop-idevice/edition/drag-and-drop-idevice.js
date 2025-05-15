// SECURITY CODE: Inject CSP meta tag for security
(function() {
    var meta = document.createElement("meta");
    meta.httpEquiv = "Content-Security-Policy";
    meta.content = ""
        + "default-src 'self'; "
        + "script-src 'self' https://cdnjs.cloudflare.com; "
        + "style-src 'self' https://cdnjs.cloudflare.com; "
        + "img-src 'self' data:; "
        + "object-src 'none'; "
        + "sandbox allow-scripts allow-same-origin; "
        + "base-uri 'self'; "
        + "form-action 'self';";
    document.head.appendChild(meta);
})();
// END SECURITY CODE

var $exeDevice = {
    originalDraggables: [],

    init: function () {
        const html = `
            <div id="myExampleForm">
                <div class="exe-idevice-info">${_("Instructions: Enter the question with answers surrounded by double square brackets [[ ]]")}</div>
                <p>
                    <label for="questionInput">Question:</label>
                    <textarea id="questionInput" placeholder="CSS Stands for [[Cascading Style Sheets]] and HTML stands for [[Hyper Text Markup Language]]" style="width: 100%; height: 120px;"></textarea>
                </p>
                <button type="button" id="generateDragDrop">Generate Drag and Drop</button>
                <button type="button" id="resetDragDrop">Reset Elements</button>
                <div id="dragDropArea"></div>
            </div>
        `;

        const field = $("#activeIdevice textarea.jsContentEditor");
        field.before(html);
        field.hide(); // hide default textarea
        $exeAuthoring.iDevice.tabs.init("myExampleForm");

        $("#generateDragDrop").click(() => {
            const inputText = $("#questionInput").val();
            this.processInput(inputText);
        });

        $("#resetDragDrop").click(() => {
            this.resetDraggables();
        });

        this.getPreviousValues(field);
    },

    processInput: function (inputText) {
        const matches = [...inputText.matchAll(/\[\[(.*?)\]\]/g)];
        let lastIndex = 0;
        const uid = 'dd' + Date.now();

        $("#dragDropArea").empty();
        this.originalDraggables = [];

        let dragDropHtml = `<div class="dragdrop-idevice" data-uid="${uid}"><p style="line-height: 1.5;">`;
        let draggableItemsHtml = `<div id="${uid}_draggableContainer" class="draggable-container" style="display: flex; gap: 10px; margin-top: 10px; flex-wrap: wrap;">`;

        matches.forEach((match, index) => {
            const textBefore = inputText.substring(lastIndex, match.index);
            const answer = match[1];
            const dragId = `${uid}_draggableAnswer${index}`;

            dragDropHtml += `${textBefore}<span class="drop-zone" data-correct-answer="${dragId}"></span>`;
            draggableItemsHtml += `<div class="draggable" draggable="true" id="${dragId}">${answer}</div>`;

            this.originalDraggables.push(dragId);

            lastIndex = match.index + match[0].length;
        });

        dragDropHtml += inputText.substring(lastIndex) + '</p>' + draggableItemsHtml + '</div></div>';

        $("#dragDropArea").html(dragDropHtml);
        this.setupDragAndDrop();
    },

    resetDraggables: function () {
        const container = $(".draggable-container");
        this.originalDraggables.forEach(id => {
            const el = $("#" + id);
            if (el.length) container.append(el);
        });
    },

    save: function () {
        const inputText = $("#questionInput").val();
        // SECURITY CODE: Sanitize input using DOMPurify before processing
        var sanitizedInput = (typeof DOMPurify !== "undefined")
            ? DOMPurify.sanitize(inputText)
            : inputText;
        // END SECURITY CODE

        const matches = [...sanitizedInput.matchAll(/\[\[(.*?)\]\]/g)];
        let lastIndex = 0;
        const uid = 'dd' + Date.now();

        let dragDropHtml = `<div class="dragdrop-idevice" data-uid="${uid}"><p style="line-height: 1.5;">`;
        let draggableItemsHtml = `<div id="${uid}_draggableContainer" class="draggable-container" style="display: flex; gap: 10px; margin-top: 10px;">`;

        matches.forEach((match, index) => {
            const textBefore = sanitizedInput.substring(lastIndex, match.index);
            const answer = match[1];
            const dragId = `${uid}_draggableAnswer${index}`;

            dragDropHtml += `${textBefore}<span class="drop-zone" data-correct-answer="${dragId}"></span>`;
            draggableItemsHtml += `<div class="draggable" draggable="true" id="${dragId}">${answer}</div>`;

            lastIndex = match.index + match[0].length;
        });

        dragDropHtml += sanitizedInput.substring(lastIndex) + '</p>' + draggableItemsHtml + '</div></div>';

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

            if ($dragged.length && targetZone.length) {
                targetZone.empty().append($dragged);
            }
        });
    }
};
