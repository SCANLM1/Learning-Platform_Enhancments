var $exeDeviceExport = {
    init: function() {
        // Ensure all drag and drop setups are initialized on document ready
        this.initializeDragAndDrops();
    },

    initializeDragAndDrops: function() {
        // Iterate over each dragDropArea if there are multiple instances
        $(".dragDropArea").each(function() {
            var $area = $(this);
            
            // Initialize drag and drop functionality
            $area.find(".draggable").attr("draggable", "true")
                .on("dragstart", function(e) {
                    e.originalEvent.dataTransfer.setData("text", e.target.id);
                });

            $area.find(".drop-zone").on("dragover", function(e) {
                e.preventDefault(); // Necessary to allow the drop
            }).on("drop", function(e) {
                e.preventDefault();
                const data = e.originalEvent.dataTransfer.getData("text");
                const draggable = document.getElementById(data);
                e.target.innerHTML = ''; // Optionally clear the drop zone before appending
                e.target.appendChild(draggable);
            });
        });
    }
};

$(function() {
    $exeDeviceExport.init();
});
