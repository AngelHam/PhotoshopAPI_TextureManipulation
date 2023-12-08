// Open dialog to select the Normal image
var normalFile = File.openDialog("Select the Normal image", "*.jpg;*.jpeg;*.png;*.tif;*.tiff;*.psd");
var exit = false;
if (!normalFile) {
    alert("No Normal image selected. Exiting.");
    exit = true;   
}

// Open dialog to select the Gloss image
if (!exit)
{
    var glossFile = File.openDialog("Select the Gloss image", "*.jpg;*.jpeg;*.png;*.tif;*.tiff;*.psd");
    if (!glossFile) {
        alert("No Gloss image selected. Exiting.");
        exit = true;   
    }
}
// if alerts are passed with no errors
if (!exit)
{
    // open the gloss file and copy it to clipboard
    var glossDoc = app.open(glossFile);
    app.activeDocument = glossDoc;
    glossDoc.artLayers[0].copy();

    

    // open the normal file
    var normalDoc = app.open(normalFile);
    app.activeDocument = normalDoc;
    var normalLayer = normalDoc.artLayers[0];
    normalDoc.paste();
    var glossLayer = normalDoc.artLayers[1];
    glossLayer.name = "Gloss";
    normalLayer.name = "Normal";

    // Add Alpha Channel to the document
    var doc = app.activeDocument;

    // Ensure the document is in RGB color mode
    if (doc.mode !== DocumentMode.RGB) {
        doc.changeMode(ChangeMode.RGB);
    }
    
    // Create a new Alpha channel in the document
    var alphaChannel = doc.channels.add();
    alphaChannel.name = "Alpha";
    alphaChannel.visible = true;

    alphaChannel = glossLayer.desaturate();

    // Save as a TIF file
    var normalFileName = normalFile.name.split(".");
    normalFileName.pop(); // Remove the last element (file extension)
    var normalFileNameWithoutExtension = normalFileName.join(".");

    // Get the directory of the currently running script
    var fileName = "Main.jsx";
    var scriptDirectory = $.fileName.substring(0, $.fileName.lastIndexOf('/'));
    
    // Create a new folder for the modified image in the same directory
    var newFolder = new Folder(scriptDirectory + "/ModifiedImages");
    if (!newFolder.exists) {
        newFolder.create();
    }
    // Construct the new file path and name for the modified image
    var savePath = newFolder + "/" + normalFileNameWithoutExtension + "_ddna.tif";
    
    // Save the modified image
    var tiffSaveOptions = new TiffSaveOptions();
    normalDoc.saveAs(new File(savePath), tiffSaveOptions);
    alert("Saved to: " + savePath);

    glossDoc.close(SaveOptions.DONOTSAVECHANGES);
    normalDoc.close(SaveOptions.DONOTSAVECHANGES);


}