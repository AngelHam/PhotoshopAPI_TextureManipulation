// Open dialog to select the Normal image
var detailFile = File.openDialog("Select the Normal image", "*.jpg;*.jpeg;*.png;*.tif;*.tiff;*.psd");
var exit = false;
if (!detailFile) {
    alert("No Normal image selected. Exiting.");
    exit = true;   
}


// Open dialog to select the Gloss image
if (!exit)
{
    var diffuseFile = File.openDialog("Select the Diffuse image", "*.jpg;*.jpeg;*.png;*.tif;*.tiff;*.psd");
    if (!diffuseFile) {
        alert("No Diffuse image selected. Exiting.");
        exit = true;   
    }
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

    // open the normal file
    var detailDoc = app.open(detailFile);
    app.activeDocument = detailDoc;
    var detailLayer = detailDoc.artLayers[0];
    detailLayer.name = "detail";

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
    
    // Duplicate the layer to preserve the original
    var duplicateLayer = detailLayer.duplicate();

    var channelNames = detailDoc.componentChannels; //CANNOT USE .length here

    // var channelNames = [];
    // // Get the names of all channels in the active layer
    // for (var i = 0; i < 10; i++) {
    //     if (channels[i])
    //     {
    //         var channel = channels[i];
    //         channelNames.push(channel.name);
    //     }
    // }

    // // Display an alert with the channel names
    // alert("Channel Names in the Active Layer:\n\n" + channelNames);

    // if (doc.channels.getByName("Green")) {
    //     // Perform operations with the green channel
    //     alert("success");
    // } else {
    //     alert("The 'Green' channel does not exist in the duplicate layer.");
    // }
    // var greenChannelNormal = duplicateLayer.channels.getByName("Green"); // Get the green channel of the duplicated layer
    var greenChannelNormal = doc.channels.getByName("Green"); // Get the green channel of the duplicated layer
    // Loop through the pixels and set the green channel values from the red channel
    var pixelArrayAlpha = alphaChannel.pixels;
    for (var i = 0; i < pixelArrayAlpha; i++) {
        pixelArrayAlpha[i] = greenChannelNormal.pixels[i];
    }

    // Get the red channel from the duplicated layer
    var redChannelNormal = doc.channels.getByName("Red");
    // Loop through the pixels and set the green channel values from the red channel
    var pixelArrayGreen = doc.channels.getByName("Green").pixels;
    for (var i = 0; i < pixelArrayGreen; i++) {
        // pixelArrayGreen[i] = redChannelNormal.pixels[i];
        pixelArrayGreen[i] = 0.01;
    }

    // get Diffuse grayscale
    var diffuseDoc = app.open(diffuseFile);
    app.activeDocument = diffuseDoc;
    var diffuseLayer = diffuseDoc.artLayers[0];
    var diffuseLayerGrayscale = diffuseLayer.desaturate();

    // get gloss grayscale
    var glossDoc = app.open(glossFile);
    app.activeDocument = glossDoc;
    var glossLayer = glossDoc.artLayers[0];
    var glossLayerGrayscale = glossLayer.desaturate();

    app.activeDocument = detailDoc;
    // detailLayer.channels.getByName("Red") = diffuseLayerGrayscale;  // SET DIFFUSE
    // Loop through the pixels and set the red channel values from the diffuse
    var pixelArrayRed = doc.channels.getByName("Red").pixels;
    for (var i = 0; i < pixelArrayRed; i++) {
        pixelArrayRed[i] = diffuseLayerGrayscale.pixels[i];
    }

    // detailLayer.channels.getByName("Blue") = glossLayerGrayscale;  // SET GLOSS
    // Loop through the pixels and set the blue channel values from the gloss
    var pixelArrayBlue = doc.channels.getByName("Blue").pixels;
    for (var i = 0; i < pixelArrayBlue; i++) {
        pixelArrayBlue[i] = glossLayerGrayscale.pixels[i];
    }

    // Save as a TIF file
    var detailFileName = detailFile.name.split(".");
    detailFileName.pop(); // Remove the last element (file extension)
    var detailFileNameWithoutExtension = detailFileName.join(".");

    // Get the directory of the currently running script
    var fileName = "Main.jsx";
    var scriptDirectory = $.fileName.substring(0, $.fileName.lastIndexOf('/'));
    
    // Create a new folder for the modified image in the same directory
    var newFolder = new Folder(scriptDirectory+ "/ModifiedImages");
    if (!newFolder.exists) {
        newFolder.create();
    }
    // Construct the new file path and name for the modified image
    var savePath = newFolder + "/" + detailFileNameWithoutExtension + "_detail.tif";
    
    // Save the modified image
    var tiffSaveOptions = new TiffSaveOptions();
    detailDoc.saveAs(new File(savePath), tiffSaveOptions);
    alert("Saved to: " + savePath);

    detailDoc.close(SaveOptions.DONOTSAVECHANGES);
    glossDoc.close(SaveOptions.DONOTSAVECHANGES);
    diffuseDoc.close(SaveOptions.DONOTSAVECHANGES);


}