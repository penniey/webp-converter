//Content script for handling image conversion
(function() {
  'use strict';

  browser.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.action === "convertImage") {
      await handleImageConversion(message.imageUrl);
    } else if (message.action === "showFormatDialog") {
      await handleImageConversion(message.imageUrl);
    }
  });

  document.addEventListener("convertImageFormat", async (event) => {
    const { imageUrl, format } = event.detail;
    await convertAndDownloadImage(imageUrl, format);
  });

  async function handleImageConversion(imageUrl) {
    const format = await showFormatDialog();
    if (format) {
      await convertAndDownloadImage(imageUrl, format);
    }
  }

  function showFormatDialog() {
    return new Promise((resolve) => {
      //Create a modal dialog for format selection
      const modal = document.createElement('div');
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        z-index: 10000;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: Arial, sans-serif;
      `;

      const dialog = document.createElement('div');
      dialog.style.cssText = `
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        text-align: center;
        min-width: 300px;
      `;

      dialog.innerHTML = '';
      
      // Create dialog content safely
      const title = document.createElement('h3');
      title.textContent = 'Convert Image Format';
      title.style.cssText = 'margin-top: 0; color: #333;';
      
      const description = document.createElement('p');
      description.textContent = 'Choose the format to convert to:';
      description.style.cssText = 'color: #666; margin-bottom: 20px;';
      
      const buttonContainer = document.createElement('div');
      buttonContainer.style.cssText = 'display: flex; gap: 10px; justify-content: center;';
      
      const pngButton = document.createElement('button');
      pngButton.id = 'convertToPng';
      pngButton.textContent = 'PNG';
      pngButton.style.cssText = 'padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;';
      
      const jpgButton = document.createElement('button');
      jpgButton.id = 'convertToJpg';
      jpgButton.textContent = 'JPG';
      jpgButton.style.cssText = 'padding: 10px 20px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;';
      
      const cancelButton = document.createElement('button');
      cancelButton.id = 'cancelConvert';
      cancelButton.textContent = 'Cancel';
      cancelButton.style.cssText = 'padding: 10px 20px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;';
      
      buttonContainer.appendChild(pngButton);
      buttonContainer.appendChild(jpgButton);
      buttonContainer.appendChild(cancelButton);
      
      dialog.appendChild(title);
      dialog.appendChild(description);
      dialog.appendChild(buttonContainer);

      modal.appendChild(dialog);
      document.body.appendChild(modal);

      document.getElementById('convertToPng').onclick = () => {
        document.body.removeChild(modal);
        resolve('png');
      };

      document.getElementById('convertToJpg').onclick = () => {
        document.body.removeChild(modal);
        resolve('jpg');
      };

      document.getElementById('cancelConvert').onclick = () => {
        document.body.removeChild(modal);
        resolve(null);
      };

      //Close on background click
      modal.onclick = (e) => {
        if (e.target === modal) {
          document.body.removeChild(modal);
          resolve(null);
        }
      };
    });
  }

  async function convertAndDownloadImage(imageUrl, format) {
    try {
      showLoadingIndicator();

      const response = await fetch(imageUrl);
      const blob = await response.blob();

      //Create an image element to load the blob
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      img.onload = function() {
        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);

        const quality = format === 'jpg' ? 0.9 : undefined;
        const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
        
        canvas.toBlob((convertedBlob) => {
          //Generate filename
          const originalFilename = getFilenameFromUrl(imageUrl);
          const baseFilename = originalFilename.replace(/\.[^/.]+$/, "");
          const newFilename = `${baseFilename}.${format}`;

          //Create download link
          const downloadUrl = URL.createObjectURL(convertedBlob);
          const downloadLink = document.createElement('a');
          downloadLink.href = downloadUrl;
          downloadLink.download = newFilename;
          
          //Trigger download
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          
          //Clean up
          URL.revokeObjectURL(downloadUrl);
          hideLoadingIndicator();
          
          showSuccessMessage(`Image converted and saved as ${newFilename}`);
        }, mimeType, quality);
      };

      img.onerror = function() {
        hideLoadingIndicator();
        showErrorMessage('Failed to load image for conversion');
      };

      //Load the image
      const imageDataUrl = URL.createObjectURL(blob);
      img.src = imageDataUrl;

    } catch (error) {
      hideLoadingIndicator();
      showErrorMessage('Failed to convert image: ' + error.message);
      console.error('Image conversion error:', error);
    }
  }

  function getFilenameFromUrl(url) {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const filename = pathname.substring(pathname.lastIndexOf('/') + 1);
      return filename || 'converted_image';
    } catch {
      return 'converted_image';
    }
  }

  function showLoadingIndicator() {
    const loader = document.createElement('div');
    loader.id = 'imageConverterLoader';
    loader.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #333;
      color: white;
      padding: 10px 15px;
      border-radius: 4px;
      z-index: 10001;
      font-family: Arial, sans-serif;
      font-size: 14px;
    `;
    loader.textContent = 'Converting image...';
    document.body.appendChild(loader);
  }

  function hideLoadingIndicator() {
    const loader = document.getElementById('imageConverterLoader');
    if (loader) {
      document.body.removeChild(loader);
    }
  }

  function showSuccessMessage(message) {
    showNotification(message, '#4CAF50');
  }

  function showErrorMessage(message) {
    showNotification(message, '#f44336');
  }

  function showNotification(message, backgroundColor) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${backgroundColor};
      color: white;
      padding: 10px 15px;
      border-radius: 4px;
      z-index: 10001;
      font-family: Arial, sans-serif;
      font-size: 14px;
      max-width: 300px;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    //Auto-remove after 3 seconds
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 3000);
  }

})();
