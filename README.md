# Image Format Converter - Firefox Extension

A Firefox extension that adds a context menu option to convert images to PNG or JPG format when saving.

## Features

- Right-click on any image to see "Save as PNG/JPG" option
- Right-click on links to supported image formats (WebP, AVIF, BMP, GIF, TIFF, SVG) to convert before saving
- Choose between PNG and JPG formats with a user-friendly dialog
- Maintains original image quality during conversion
- Shows progress indicators and success/error messages

## Supported Input Formats

- WebP
- AVIF  
- BMP
- GIF
- TIFF/TIF
- SVG
- And more...

## Installation

### For Development/Testing:

1. Open Firefox
2. Navigate to `about:debugging`
3. Click "This Firefox"
4. Click "Load Temporary Add-on"
5. Select the `manifest.json` file from this directory

### For Production:
1. Download the project
2. about:config
3. xpinstall.signature.required set this to false
4. about:addons
5. Add file manually and choose the v2 version in the folder.

## How to Use

1. Right-click on any image on a webpage
2. Select "Save as PNG/JPG" from the context menu
3. Choose your preferred format (PNG or JPG) in the dialog
4. The converted image will be automatically downloaded



## License

This extension is provided as-is for educational and personal use.

