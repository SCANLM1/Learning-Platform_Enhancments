var $exeDevice = {
    originalDraggables: [],

    init: function () {
        const html = `
            <div id="dragDropAuthorForm">
                <div class="exe-idevice-info">Use <code>[[ ]]</code> to mark blanks. Provide your sentence, instructions, and an optional hint.</div>

                <p><label for="instructionsInput">Instructions:</label>
                <textarea id="instructionsInput" class="exe-html-editor" rows="3"></textarea></p>

                <p><label for="questionInput">Sentence with Blanks:</label>
                <textarea id="questionInput" class="exe-html-editor" rows="6"></textarea></p>

                <p><label for="hintInput">Optional Hint:</label>
                <textarea id="hintInput" class="exe-html-editor" rows="2"></textarea></p>

                <button type="button" id="generateDragDrop">Generate Drag and Drop</button>
                <button type="button" id="resetDragDrop">Reset Elements</button>

                <div id="dragDropArea" style="margin-top: 12px;"></div>
            </div>
        `;

        const field = $("#activeIdevice textarea.jsContentEditor");
        field.before(html);
        field.hide();
        $exeAuthoring.iDevice.tabs.init("dragDropAuthorForm");

        this.loadPreviousValues();

        setTimeout(() => {
            if (typeof tinyMCE !== "undefined" && eXe.editorSettings) {
                tinyMCE.init(Object.assign({}, eXe.editorSettings, {
                    selector: '.exe-html-editor'
                }));
            }
        }, 0);
    },

    save: function () {
        const instructions = tinyMCE.get("instructionsInput")?.getContent() || "";
        const hint = tinyMCE.get("hintInput")?.getContent() || "";
        const sentence = tinyMCE.get("questionInput")?.getContent() || ""; // ✅ Preserves formatting

        const blankMatches = sentence.match(/\[\[(.*?)\]\]/g);

        if (!sentence.trim()) {
            alert("You must enter a sentence with at least two blanks marked with [[ ]].");
            return false;
        }

        if (!blankMatches || blankMatches.length < 2) {
            alert("You must define at least two blanks using [[ ]] in the sentence.");
            return false;
        }

        const valueCounts = {};
        blankMatches.forEach(m => {
            const val = m.replace(/\[\[|\]\]/g, '').trim();
            valueCounts[val] = (valueCounts[val] || 0) + 1;
        });

        const duplicates = Object.entries(valueCounts).filter(([_, count]) => count > 1);
        if (duplicates.length > 0) {
            const dupList = duplicates.map(([val]) => `'${val}'`).join(", ");
            alert(`⚠️ Each [[word]] must be unique. You used ${dupList} more than once.\nPlease rephrase so each answer is only used once.`);
            return false;
        }

        const html = `
            <div class="dragdrop-idevice">
                <div class="dragdrop-instructions">${instructions}</div>
                <div class="dragdrop-hint" style="display:none;">${hint}</div>
                <div class="dragdrop-question" style="display:none;">${sentence}</div>
                <span class="trigger-dragdrop" style="display:none;"></span>
            </div>
        `;

        $("#activeIdevice textarea.jsContentEditor").val(html);
        return html;
    },

    loadPreviousValues: function () {
        const field = $("#activeIdevice textarea.jsContentEditor");
        const content = field.val();
        if (!content) return;

        const wrapper = $('<div>').html(content);
        $("#instructionsInput").val(wrapper.find(".dragdrop-instructions").html() || "");
        $("#hintInput").val(wrapper.find(".dragdrop-hint").html() || "");
        $("#questionInput").val(wrapper.find(".dragdrop-question").html() || "");
    },

    processInput: function (inputText) {
        const matches = [...inputText.matchAll(/\[\[(.*?)\]\]/g)];
        let lastIndex = 0;
        const uid = 'dd' + Date.now();

        $("#dragDropArea").empty();
        this.originalDraggables = [];

        let dragDropHtml = `<div class="dragdrop-idevice" data-uid="${uid}"><p>`;
        let draggableItems = [];

        matches.forEach((match, index) => {
            const textBefore = inputText.substring(lastIndex, match.index);
            const answer = match[1];
            const dragId = `${uid}_draggableAnswer${index}`;

            dragDropHtml += `${textBefore}<span class="drop-zone" data-correct-answer="${dragId}">&#8203;</span>`; // ✅ Keeps space visible when empty
            draggableItems.push(`<div class="draggable" draggable="true" id="${dragId}">${answer}</div>`);

            this.originalDraggables.push(dragId);
            lastIndex = match.index + match[0].length;
        });

        dragDropHtml += inputText.substring(lastIndex) + '</p>';
        dragDropHtml += `<div class="draggable-container" style="display:flex;gap:10px;flex-wrap:wrap;margin-top:10px;">${draggableItems.join("")}</div></div>`;

        $("#dragDropArea").html(dragDropHtml);
        this.setupDragAndDrop();
    },

    resetDraggables: function () {
        const container = $(".draggable-container");
        const items = container.children(".draggable").get();

        for (let i = items.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [items[i], items[j]] = [items[j], items[i]];
        }

        container.empty().append(items);
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
                targetZone.html(""); // Clear zero-width space too
                targetZone.append($dragged);
            }
        });
    }
};
