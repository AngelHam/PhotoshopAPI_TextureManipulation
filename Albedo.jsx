var exit = false;


// Create and display a dialog box
var dialog = new Window("dialog", "Select AO Settings");
var group = dialog.add("group");
group.orientation = "horizontal";

var checkbox_AO = group.add("checkbox", undefined, "Yes Ambient Occlusion");

var selectedScripts = [];
var okButton = dialog.add("button", undefined, "OK");
okButton.onClick = function () {
    dialog.close();
};

dialog.show();

var selectedOpacity;

if (checkbox_AO.value == true)
{
    // Create and display a dialog box for Opacity of AO
    var dialog_AO_Slider = new Window("dialog", "AO Opacity");
    var group = dialog_AO_Slider.add("group");
    group.orientation = "column";

    var sliderGroup = group.add("group");
    sliderGroup.orientation = "row";

    var sliderLabel = sliderGroup.add("statictext", undefined, "Opacity:");
    var opacitySlider = sliderGroup.add("slider", undefined, 0, 0, 100); // Slider with range 0 to 100
    opacitySlider.value = 50; // Set default value to 50

    selectedOpacity = 50; // Default value

    var percentText = group.add("statictext", undefined, "50%"); // Display percentage text
    opacitySlider.onChanging = function() {
        percentText.text = opacitySlider.value + "%"; // Update percentage text while changing the slider
    };


    var okButton = dialog_AO_Slider.add("button", undefined, "OK");
    okButton.onClick = function () {
        selectedOpacity = opacitySlider.value;
        dialog_AO_Slider.close();
    };

    var cancelButton = dialog_AO_Slider.add("button", undefined, "Cancel");
    cancelButton.onClick = function () {
        alert("Operation canceled, Exiting.");
        dialog_AO_Slider.close();
        exit = true;
    };

    dialog_AO_Slider.show();
    if (!exit) {
        alert("Selected Opacity: " + selectedOpacity + "%");
        // Use selectedOpacity value for further operations
    }
}

// Open dialog to select the Albedo image
var albedoFile;
if (!exit) {
    albedoFile = File.openDialog("Select the Albedo image", "*.jpg;*.jpeg;*.png;*.tif;*.tiff;*.psd");
    if (!albedoFile) {
        alert("No Albedo image selected. Exiting.");
        exit = true;   
    }
}

// Open dialog to select the Ambient Occlusion image
var aoFile;
if (!exit && checkbox_AO.value == true)
{
    aoFile = File.openDialog("Select the Ambient Occlusion image", "*.jpg;*.jpeg;*.png;*.tif;*.tiff;*.psd");
    if (!aoFile) {
        alert("No Ambient Occlusion image selected. Exiting.");
        exit = true;   
    }
}

// if alerts are passed with no errors
if (!exit)
{
    if (checkbox_AO.value == true)
    {
        var aoDoc = app.open(aoFile);
        app.activeDocument = aoDoc;
        var aoLayer = aoDoc.artLayers[0];
        aoLayer.opacity = selectedOpacity;
        aoLayer.copy();
    }

    var albedoDoc = app.open(albedoFile);
    app.activeDocument = albedoDoc;
    var albedoLayer = albedoDoc.artLayers[0];

    if (checkbox_AO.value == true)
    {
        // when pasted into layer, it becomes artlayer 0
        albedoDoc.paste();
        albedoDoc.artLayers[0].opacity = selectedOpacity;

        // Set blend mode to Multiply
        albedoDoc.artLayers[1].blendMode = BlendMode.MULTIPLY;
        albedoDoc.artLayers[0].blendMode = BlendMode.MULTIPLY;
    }

    // Save as a TIF file
    var albedoFileName = albedoFile.name.split(".");
    albedoFileName.pop(); // Remove the last element (file extension)
    var albedoFileNameWithoutExtension = albedoFileName.join(".");


    // Get the directory of the currently running script
    var fileName = "Main.jsx";
    var scriptDirectory = $.fileName.substring(0, $.fileName.lastIndexOf('/'));
    
    // Create a new folder for the modified image in the same directory
    var newFolder = new Folder(scriptDirectory + "/ModifiedImages");
    if (!newFolder.exists) {
        newFolder.create();
    }

    // Construct the new file path and name for the modified image
    var savePath = newFolder + "/" + albedoFileNameWithoutExtension + "_albedo.tif";
    
    // Save the modified image
    var tiffSaveOptions = new TiffSaveOptions();
    albedoDoc.saveAs(new File(savePath), tiffSaveOptions);
    alert("Saved to: " + savePath);

    // Close the documents without saving changes
    albedoDoc.close(SaveOptions.DONOTSAVECHANGES);
    if (checkbox_AO.value == true)
        aoDoc.close(SaveOptions.DONOTSAVECHANGES);

}