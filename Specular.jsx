// Open a file dialog to choose an image to load into Photoshop
var inputImage = File.openDialog("Select an image to open in Photoshop", "*.jpg;*.jpeg;*.png;*.tif;*.tiff;*.psd");

if (inputImage) {
    // Open the selected image in Photoshop
    var docRef = app.open(inputImage);


    
    // Get the directory of the currently running script
    var fileName = "Main.jsx";
    var scriptDirectory = $.fileName.substring(0, $.fileName.lastIndexOf('/'));
    
    // Create a new folder for the modified image in the same directory
    var newFolder = new Folder(scriptDirectory + "/ModifiedImages");
    if (!newFolder.exists) {
        newFolder.create();
    }
    
    // Get the original file name and path
    var originalPath = inputImage.path;
    var originalFileName = inputImage.name; // Full file name with extension
    
    // Extract filename without extension
    var filenameParts = originalFileName.split(".");
    filenameParts.pop(); // Remove the last element (file extension)
    var filenameWithoutExtension = filenameParts.join(".");

    // Construct the new file path and name for the modified image
    var modifiedFilePath = newFolder + "/" + filenameWithoutExtension + "_spec.tif";

    // Save the modified image
    var saveOptions = new TiffSaveOptions();
    docRef.saveAs(new File(modifiedFilePath), saveOptions);
    alert("Saved to: " + modifiedFilePath);

    // Close the opened document without saving changes
    docRef.close(SaveOptions.DONOTSAVECHANGES);
}