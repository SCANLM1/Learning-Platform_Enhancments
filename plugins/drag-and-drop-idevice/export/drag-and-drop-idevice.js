var $exeDeviceExport = {
    init: function() {
        this.initializeDragAndDrops();
    },

    initializeDragAndDrops: function() {
        $(".dragDropArea").each(function() {
            var area = $(this);
            if (!area.find(".draggable").length) { // Check if draggables are missing and need to be recreated
                // Recreate draggable items based on some criteria or stored data
                var draggableItemsHtml = ''; // You would fill this string based on your application's logic
                area.append(draggableItemsHtml);
            }

            area.find(".draggable").attr("draggable", "true").on("dragstart", function(e) {
                e.originalEvent.dataTransfer.setData("text", e.target.id);
            });

            area.find(".drop-zone").on("dragover", function(e) {
                e.preventDefault(); // Necessary to allow the drop
            }).on("drop", function(e) {
                e.preventDefault();
                var data = e.originalEvent.dataTransfer.getData("text");
                var draggable = document.getElementById(data);
                e.target.innerHTML = ''; // Clear the drop zone before appending
                e.target.appendChild(draggable);
            });
        });
    }
};

$(function() {
    $exeDeviceExport.init();
});
