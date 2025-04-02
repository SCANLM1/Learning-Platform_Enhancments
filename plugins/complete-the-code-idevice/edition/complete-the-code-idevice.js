/**
 * Complete the Code iDevice (edition code)
 *
 * Released under Attribution-ShareAlike 4.0 International License.
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 */

var $exeDevice = {
	
	// For score (SCORM) options, see the games' loadSCOFunctions method
	// i18n intructions: Always use _ as in "Information and instructions."
	
	// i18n
	i18n : {
		name : _("Complete the Code"), // Title in config.xml
	},

	// Custom i18n (see Advanced mode - Language settings tab)
	ci18n: {
		"btn1": _("Click here to start"),
		"btn2": _("Maximize")
	},

	// Display alert compatible with both eXeLearning and local preview
	showAlert: function(message) {
	    if (typeof eXe !== 'undefined' && typeof eXe.app !== 'undefined' && typeof eXe.app.alert === 'function') {
	        eXe.app.alert(message); // eXeLearning environment
	    } else {
	        alert(message); // Local preview environment
	    }
	},

	init : function(){
		
		// Create the form
        var html = `
            <div id="completeCodeForm">
                <label for="codeInput">Enter Code (use {{ }} to mark blanks):</label>
                <textarea id="codeInput" rows="10" cols="50"></textarea>
                
                <label for="acceptedAnswers">Accepted Answers (comma-separated):</label>
                <input type="text" id="acceptedAnswers" placeholder="answer1, answer2, ...">
                
                <button id="saveCode">Save Code</button>
            </div>
        `;
		
		var field = $("#activeIdevice textarea.jsContentEditor");
		field.before(html); // Attach the form before the hidden textarea
				
		this.getPreviousValues(field);

		$("#saveCode").on("click", function() {
            $exeDevice.save();
        });
		
	},

	save: function(){
        var code = $("#codeInput").val();
        var acceptedAnswers = $("#acceptedAnswers").val();

        if (code === "") {
            $exeDevice.showAlert("Please enter the code with blanks marked using {{ }}.");
            return false;
        }

        if (acceptedAnswers === "") {
            $exeDevice.showAlert("Please provide at least one accepted answer.");
            return false;
        }

        var result = `
            <div class="completeCodeIdevice" data-answers="${acceptedAnswers}">
                <pre>${code}</pre>
            </div>
        `;
        
        $("#activeIdevice textarea.jsContentEditor").val(result); // Save result to hidden textarea

        $exeDevice.showAlert("Code saved successfully.");
        return result;
    },

	getPreviousValues: function(field) {
        var content = field.val();
        if (content !== '') {
            var wrapper = $("<div></div>");
            wrapper.html(content);

            var code = wrapper.find("pre").text();
            var answers = wrapper.find(".completeCodeIdevice").data("answers");

            $("#codeInput").val(code);
            $("#acceptedAnswers").val(answers);
        }
    }
};
