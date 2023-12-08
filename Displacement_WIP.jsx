// Open dialog to select the Normal image
var displacementFile = File.openDialog("Select the Displacement image", "*.jpg;*.jpeg;*.png;*.tif;*.tiff;*.psd");
var exit = false;
if (!displacementFile) {
    alert("No Displacement image selected. Exiting.");
    exit = true;   
}


// Function to convert grayscale value (0-255) to opacity value (0-100)
function grayscaleToOpacity(grayValue) {
    return (grayValue / 255) * 100; // Map grayscale value to opacity percentage
}

// Function to convert opacity value (0-100) to grayscale value (0-255)
function opacityToGrayscale(opacityValue) {
    return (opacityValue / 100) * 255; // Map opacity percentage to grayscale value
}


// if alerts are passed with no errors
if (!exit)
{

    // open the normal file
    var displacementDoc = app.open(displacementFile);
    app.activeDocument = displacementDoc;
    var displacementLayer = displacementDoc.artLayers[0];
    displacementLayer.name = "Displacement";

    
    var doc = app.activeDocument;
    // Ensure the document is in RGB color mode
    if (doc.mode !== DocumentMode.RGB) {
        doc.changeMode(ChangeMode.RGB);
    }
    
    // Create a new Alpha channel in the document
    var alphaChannel = doc.channels.add();
    alphaChannel.name = "Alpha";
    alphaChannel.visible = true;

    // Duplicate the layer to preserve the original
    var duplicateLayer = displacementLayer.duplicate();

    // Convert the duplicate layer to grayscale
    duplicateLayer.desaturate();
   
    

    // Iterate through the pixels to set alpha values
    for (var y = 0; y < doc.height; y++) {
        for (var x = 0; x < doc.width; x++) {
            var colorSampler = doc.colorSamplers.add([x, y]); // Add a color sampler at [x, y]
            var color = colorSampler.color; // Get the color from the color sampler
            var grayValue = color.rgb.red; // Extract grayscale value from the red channel
            // Set alpha value directly by using the layer opacity
            // Convert grayscale value to opacity value
            var opacityValue = grayscaleToOpacity(grayValue);

            // Create a new solid color layer with the calculated opacity
            var pixel = doc.artLayers.add();
            pixel.opacity = opacityValue; // Set the opacity of the pixel layer

            // Select all pixels on the new layer and copy
            doc.activeLayer = pixel;
            doc.selection.selectAll();
            doc.selection.copy();

            // Activate the document and select the alpha channel
            doc.activeLayer = alphaChannel;
            doc.selection.selectAll();

            // Paste the copied content into the alpha channel
            doc.paste();

            // Clean up: remove color sampler and pixel layer
            colorSampler.remove();
            pixel.remove();
        }
    }



    // // Load the duplicate layer as a selection
    // duplicateLayer.copy();
    
    // // Load the selection to the alpha channel
    // // doc.selection.deselect();
    // doc.channels.getByName("Alpha").visible = true;
    // doc.activeChannels = [doc.channels.getByName("Alpha")];
    // doc.paste(true);

    // // Deselect the selection
    // // doc.selection.deselect();

    // Save as a TIF file
    var displacementFileName = displacementFile.name.split(".");
    displacementFileName.pop(); // Remove the last element (file extension)
    var displacementFileNameWithoutExtension = displacementFileName.join(".");

    // Get the directory of the currently running script
    var fileName = "Main.jsx";
    var scriptDirectory = $.fileName.substring(0, $.fileName.lastIndexOf('/'));

    // Create a new folder for the modified image in the same directory
    var newFolder = new Folder(scriptDirectory + "/ModifiedImages");
    if (!newFolder.exists) {
        newFolder.create();
    }
    // Construct the new file path and name for the modified image
    var savePath = newFolder + "/" + displacementFileNameWithoutExtension + "_displ.tif";
    
    // Save the modified image
    var tiffSaveOptions = new TiffSaveOptions();
    displacementDoc.saveAs(new File(savePath), tiffSaveOptions);
    alert("Saved to: " + savePath);

    // displacementDoc.close(SaveOptions.DONOTSAVECHANGES);


}