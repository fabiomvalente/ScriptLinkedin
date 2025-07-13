chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["config.js"]  // primeiro: define MY_NAME etc
  }, () => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["script.js"] // depois: executa o script principal
    });
  });
});
