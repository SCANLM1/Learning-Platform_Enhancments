var $exeDevice = {
    init: function() {
        var html = '\
            <div id="myExampleForm">\
                <div class="exe-idevice-info">' + _("Instructions: Enter the question with answers surrounded by asterisks.") + '</div>\
                <p>\
                    <label for="questionInput">Question:</label>\
                    <input type="text" id="questionInput" placeholder="Hello yesterday I went to the *shop* then I went *outside*" style="width: 100%; max-width: 1200px; height: 400px;">\
                </p>\
                <button type="button" id="generateDragDrop">Generate Drag and Drop</button>\
                <div id="dragDropArea"></div>\
            </div>\
        ';

        var field = $("#activeIdevice textarea.jsContentEditor");
        field.before(html);
        $exeAuthoring.iDevice.tabs.init("myExampleForm");

        $("#generateDragDrop").on("click", function() {
            var inputText = $("#questionInput").val();
            $exeDevice.processInput(inputText);
        });

        this.getPreviousValues(field);
    },

    // processInput: function(inputText) {
    //     var matches = [...inputText.matchAll(/\*(.*?)\*/g)];
    //     var lastIndex = 0;
    //     var dragDropHtml = '';

    //     matches.forEach(function(match, index) {
    //         var answer = match[1];
    //         var start = match.index;
    //         var end = start + match[0].length;

    //         // Add text before the answer
    //         dragDropHtml += inputText.substring(lastIndex, start);

    //         // Add drop zone and draggable item
    //         dragDropHtml += '<div class="drop-zone">[Drop answer here]</div>';
    //         dragDropHtml += '<div class="draggable" draggable="true" id="draggableAnswer' + index + '">' + answer + '</div>';

    //         lastIndex = end;
    //     });

    //     // Add remaining text after the last answer
    //     dragDropHtml += inputText.substring(lastIndex);

    //     $("#dragDropArea").html(dragDropHtml);

    //     // Initialize draggable and droppable functionality
    //     this.setupDragAndDrop();
    // },

    processInput: function(inputText) {
        var matches = [...inputText.matchAll(/\*(.*?)\*/g)];
        var lastIndex = 0;
        var dragDropHtml = '';
        var draggableItemsHtml = '<div id="draggableContainer" style="padding: 20px; border: 1px solid #ccc;">';
    
        matches.forEach(function(match, index) {
            var answer = match[1];
            var start = match.index;
            var end = start + match[0].length;
    
            // Add text before the answer
            dragDropHtml += inputText.substring(lastIndex, start);
    
            // Add drop zone
            dragDropHtml += '<div class="drop-zone">[Drop answer here]</div>';
    
            // Add draggable item to a separate container
            draggableItemsHtml += '<div class="draggable" draggable="true" id="draggableAnswer' + index + '">' + answer + '</div>';
    
            lastIndex = end;
        });
    
        // Close the draggable container and add remaining text
        draggableItemsHtml += '</div>';
        dragDropHtml += inputText.substring(lastIndex);
    
        // Combine the zones and draggables in the HTML
        $("#dragDropArea").html(draggableItemsHtml + dragDropHtml);
    
        // Initialize draggable and droppable functionality
        this.setupDragAndDrop();
    },

    setupDragAndDrop: function() {
        $(".draggable").on("dragstart", function(e) {
            e.originalEvent.dataTransfer.setData("text/plain", e.target.id);
        });

        $(".drop-zone").on("dragover", function(e) {
            e.preventDefault();
        }).on("drop", function(e) {
            e.preventDefault();
            var data = e.originalEvent.dataTransfer.getData("text");
            var draggableElement = document.getElementById(data);
            e.target.innerHTML = ''; // Clear the drop zone before appending
            e.target.appendChild(draggableElement);
        });
    },

    save: function() {
        var inputText = $("#questionInput").val();
        $exeDevice.processInput(inputText);
        var res = $("#dragDropArea").html(); // Save the current state of the drag and drop area
        return res;
    },

    getPreviousValues: function(field) {
        var content = field.val();
        if (content != '') {
            $("#dragDropArea").html(content);
            this.setupDragAndDrop(); // Reinitialize drag and drop functionality after loading saved values
        }
    }
}

