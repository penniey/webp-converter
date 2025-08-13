browser.runtime.onInstalled.addListener(() => {
  browser.contextMenus.create({
    id: "convert-image",
    title: "Save as PNG/JPG",
    contexts: ["image"],
    documentUrlPatterns: ["<all_urls>"]
  });
  
  browser.contextMenus.create({
    id: "convert-link",
    title: "Save linked image as PNG/JPG",
    contexts: ["link"],
    targetUrlPatterns: [
      "*://*/*.webp*",
      "*://*/*.avif*",
      "*://*/*.bmp*",
      "*://*/*.gif*",
      "*://*/*.tiff*",
      "*://*/*.tif*",
      "*://*/*.svg*"
    ]
  });
});

browser.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "convert-image" || info.menuItemId === "convert-link") {
    const imageUrl = info.srcUrl || info.linkUrl;
    
    if (imageUrl) {
      try {
        await browser.tabs.sendMessage(tab.id, {
          action: "convertImage",
          imageUrl: imageUrl,
          originalUrl: imageUrl
        });
      } catch (error) {
        console.error("Failed to send message to content script:", error);
        showConversionOptions(imageUrl, tab.id);
      }
    }
  }
});

async function showConversionOptions(imageUrl, tabId) {
  try {
    // Use message passing instead of executeScript for better security
    await browser.tabs.sendMessage(tabId, {
      action: "showFormatDialog",
      imageUrl: imageUrl
    });
  } catch (error) {
    console.error("Failed to show conversion options:", error);
  }
}
