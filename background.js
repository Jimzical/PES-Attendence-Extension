let receivedData = [];

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "tableData") {
    receivedData = message.data;
  }
}); 
