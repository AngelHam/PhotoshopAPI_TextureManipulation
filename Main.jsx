scriptList = [
    { name: "Albedo.jsx", files: ["Albedo", "Ambient Occlusion"] },
    { name: "Detail_WIP.jsx", files: ["Normal", "Diffuse", "Gloss"] },
    { name: "Displacement_WIP.jsx", files: ["Displacement"] },
    { name: "Normal_WIP.jsx", files: ["Normal", "Gloss"] },
    { name: "Specular.jsx", files: ["Specular"] },
    // Add more scripts with their required files
  ];

// $.evalFile("C:/Users/alexa/Documents/PhotoshopAPITest/Working11_16/Specular.jsx");

// global variable
var exit = false;

// Create and display a dialog box
var dialog = new Window("dialog", "Select Scripts");
var group = dialog.add("group");
group.orientation = "column";

for (var i = 0; i < scriptList.length; i++) {
    var checkbox = group.add("checkbox", undefined, scriptList[i].name);
    checkbox.scriptIndex = i; // Add a custom property to identify the selected script
}
var selectedScripts = [];
var okButton = dialog.add("button", undefined, "OK");
okButton.onClick = function () {
    for (var i = 0; i < group.children.length; i++) {
        var child = group.children[i];
        if (child instanceof Checkbox && child.value === true) {
            selectedScripts.push(scriptList[child.scriptIndex]);
        }
    }

    if (selectedScripts.length > 0) {
        var filesMessage = '';
        for (var j = 0; j < selectedScripts.length; j++) {
            var script = selectedScripts[j];
            filesMessage += 'Script: ' + script.name + '\nFiles: ' + script.files.join(', ') + '\n\n';
        }

        alert('The required files for selected scripts are:\n\n' + filesMessage);
        dialog.close();
    } else {
        alert("No scripts selected, please make a selection.");
    }

};

var cancelButton = dialog.add("button", undefined, "Cancel");
cancelButton.onClick = function () {
    alert("Operation canceled.");
    dialog.close();
    exit = true;
};

dialog.show();

// Define the function to execute the selected scripts
function executeSelectedScripts(selectedScripts) {
    // Confirm the user's readiness to execute the selected scripts
    var confirmed = confirm("Are you ready to execute the selected scripts?");
    if (confirmed) {
        // Execute the selected scripts in the provided order using a traditional for loop
        for (var i = 0; i < selectedScripts.length; i++) {
            alert(selectedScripts[i].name);

            // Get the directory of the currently running script
            var fileName = "Main.jsx";
            var scriptDirectory = $.fileName.substring(0, $.fileName.lastIndexOf('/'));

            // Specify the filename of the script you want to execute
            var scriptToExecute = selectedScripts[i].name;

            // Combine the directory path with the script filename
            var scriptPath = scriptDirectory + "/" + scriptToExecute;

            // Execute the script using evalFile
            $.evalFile(scriptPath);

        }
        alert("Script operations complete.");
    } else {
        alert("Operation canceled.");
    }
}

// Example usage:
// Call the function with the list of selected script names
if (!exit)
{
    executeSelectedScripts(selectedScripts);
}

