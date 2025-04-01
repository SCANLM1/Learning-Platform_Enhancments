/**
 * Example iDevice (edition code)
 *
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Ignacio Gros (http://gros.es/) for http://exelearning.net/
 *
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 */
var $exeDevice = {
	
	// For score (SCORM) options, see the games' loadSCOFunctions method
	// i18n intructions: Always use _ as in "Information and instructions."
	
	// i18n
	i18n : {
		
		name : _("Example"), // Title in config.xml
		
		// Optional translations
		// Spanish
		es : {
			"Information and instructions." : "Información e instrucciones.",
		}
		
	},

	// Custom i18n (see Advanced mode - Language settings tab)
	ci18n: {
		"btn1": _("Click here to start"),
		"btn2": _("Maximize")
	},
	
init: function() {
    // Create the form template
    var html = '\
        <div id="moduleTemplateForm">\
            <div class="exe-idevice-info">' + _("Module Template Editor") + '</div>\
            <div class="exe-form-tab" title="Module Details">\
                <p>\
                    <label for="moduleTitle">Module Title:</label>\
                    <input type="text" id="moduleTitle">\
                </p>\
                <p>\
                    <label for="moduleDescription">Module Description:</label>\
                    <textarea id="moduleDescription" class="exe-html-editor"></textarea>\
                </p>\
                <p>\
                    <label for="moduleCode">Code Provided:</label>\
                    <textarea id="moduleCode" class="exe-code-editor"></textarea>\
                </p>\
                <p>\
                    <button id="previewButton">Preview Module</button>\
                </p>\
            </div>\
            <div class="exe-form-tab" title="Additional Fields (Extendable)">\
                <fieldset class="exe-fieldset exe-fieldset-closed">\
                    <legend><a href="#">Future Fields</a></legend>\
                    <div>\
                        <p>Placeholder for additional inputs</p>\
                    </div>\
                </fieldset>\
            </div>\
            <div id="previewSection" class="exe-hidden">\
                <h3>Preview:</h3>\
                <div id="modulePreview"></div>\
            </div>\
            ' + $exeAuthoring.iDevice.gamification.common.getLanguageTab(this.ci18n) + '\
        </div>\
    ';

    var field = $("#activeIdevice textarea.jsContentEditor");

    field.before(html); // Insert template before hidden TEXTAREA

    $exeAuthoring.iDevice.tabs.init("moduleTemplateForm"); // Enable tabs

    this.getPreviousValues(field);

    // Add event listener for preview button
    $("#previewButton").on("click", function() {
        var title = $("#moduleTitle").val();
        var description = $("#moduleDescription").val();
        var code = $("#moduleCode").val();

        var previewHTML = '<h2>' + title + '</h2>\
            <p>' + description + '</p>\
            <pre><code>' + code + '</code></pre>';

        $("#modulePreview").html(previewHTML);
        $("#previewSection").removeClass("exe-hidden");
    });
},

	save : function(){
		
		// This method will return the content to save (HTML, JSON...)
		// That code will be placed in the hidden TEXTAREA
		var res = "";
		
		// Paragraph content (with validation example)
		var p = $("#myExampleFieldA").val();
		if (p=="") {
			eXe.app.alert("Please type the paragraph content.");
			return false;
		}

		// Paragraph color
		var pStyle = '';
		var pC = $("#myExampleFieldB").val();
		if (pC!="") {
			pStyle = ' style="color:#'+pC+'"';
		}		
		
		// Paragraph
		res += "<p"+pStyle+">"+p+"</p>";
		
		// Rich text (TinyMCE)
		var t = tinymce.editors[0].getContent();
		if (t!="") {
			res += '<div class="exe-text">';
				res += t;
			res += '</div>';	
		}
		
		// File picker
		var file = $("#myExampleFieldD").val();
		if (file!="") {
			var fileName = file;
				fileName = fileName.split("_");
				fileName = fileName[fileName.length-1];
				fileName = fileName.split("/");
				fileName = fileName[fileName.length-1];
				if (fileName=="") fileName = "Fichero adjunto";
			res += '<p class="exe-attachment-file"><a href="'+file+'">'+fileName+'</a></p>';
		}
		
		// Image picker
		var img = $("#myExampleFieldE").val();
		if (img!="") {
			res += '<p class="exe-attachment-img"><img src="'+img+'" alt=""></p>';
		}
		
		// Buttons with custom text (Advanced mode - Language settings tab
		var btn1 = $("#ci18n_btn1").val();
		if (btn1=="") btn1 = this.ci18n.btn1;
		var btn2 = $("#ci18n_btn2").val();
		if (btn2=="") btn2 = this.ci18n.btn2;
		
		res += '<p class="exe-custom-btns">\
			<button type="button">'+btn1+'</button>\
			<button type="button">'+btn2+'</button>\
		</p>';
		
		// HTML to save
		return res;
	},
	getPreviousValues : function(field){
		
		var content = field.val();
		if (content != '') {
			
			// Find the previous values in the HTML you saved
			var wrapper = $("<div></div>");
				wrapper.html(content);
			
			// Paragraph
			var p = $("p",wrapper).eq(0);
			
			$("#myExampleFieldA").val(p.text()); // Contenido del párrafo
			
			// Paragraph color
			var pC = p.attr("style");
			if (typeof(pC)=='string'&&pC.indexOf("color:#")==0) pC = pC.replace("color:#","");
			$("#myExampleFieldB").val(pC);
			
			// TinyMCE
			var t = $("div.exe-text",wrapper).eq(0);
			if (t.length==1) {
				$("#myExampleFieldC").val(t.html());
			}
			
			// Attached file (file picker)
			var a = $("p.exe-attachment-file a",wrapper).eq(0);
			if (a.length==1) {
				$("#myExampleFieldD").val(a.attr("href"));
			}
			
			// Image (image picker)
			var a = $("p.exe-attachment-img img",wrapper).eq(0);
			if (a.length==1) {
				$("#myExampleFieldE").val(a.attr("src"));
			}
			
			// Buttons
			var btns = $("p.exe-custom-btns button",wrapper);
			if (btns.length==2) {
				var btn1 = btns.eq(0).text();
				var btn2 = btns.eq(1).text();
				$("#ci18n_btn1").val(btn1);
				$("#ci18n_btn2").val(btn2);
			}
			
		}
		
	}
}