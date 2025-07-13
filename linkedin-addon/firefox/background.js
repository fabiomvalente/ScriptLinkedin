// Background script for Firefox (Manifest V2)
browser.browserAction.onClicked.addListener((tab) => {
  // First inject the config
  browser.tabs.executeScript(tab.id, {
    file: "config.js"
  }).then(() => {
    // Then inject the main script
    browser.tabs.executeScript(tab.id, {
      file: "script.js"
    });
  }).catch((error) => {
    console.error("Error executing script:", error);
    // Try to show a notification to the user
    browser.notifications.create({
      type: "basic",
      iconUrl: "icon.png",
      title: "LinkedIn Connect Script",
      message: "Erro: Verifique se o arquivo config.js existe e está configurado corretamente."
    });
  });
});
