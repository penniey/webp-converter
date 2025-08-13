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

The extension would need to be packaged and submitted to Mozilla Add-ons store.

## How to Use

1. Right-click on any image on a webpage
2. Select "Save as PNG/JPG" from the context menu
3. Choose your preferred format (PNG or JPG) in the dialog
4. The converted image will be automatically downloaded

## File Structure

```
WEBPConverter/
├── manifest.json       # Extension manifest
├── background.js       # Background script for context menus
├── content.js          # Content script for image conversion
├── icons/             # Extension icons
│   └── icon.svg       # SVG icon (can be converted to PNG sizes)
└── README.md          # This file
```

## Technical Details

- Uses HTML5 Canvas API for image conversion
- Supports both direct image context menus and link context menus
- Handles CORS issues by fetching images through the content script
- Provides user feedback through notifications and loading indicators

## Browser Compatibility

- Firefox 57+ (WebExtensions API)
- Uses Manifest V2 for maximum compatibility

## Privacy

This extension:
- Only processes images when explicitly requested by the user
- Does not collect or transmit any user data
- Performs all conversions locally in the browser
- Does not require any external services

## Development

To modify the extension:

1. Make changes to the source files
2. Reload the extension in `about:debugging`
3. Test the changes on various websites

## License

This extension is provided as-is for educational and personal use.
