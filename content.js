console.log("Content script loaded");

async function translateText(text, targetLang) {
  console.log("Translating text:", text);
  console.log("Target language:", targetLang);

  try {
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(
        text
      )}`
    );

    console.log("NODDY NODDY NODDY"); // Log the API response
    const result = await response.json();
    console.log("API result: ", result);

    if (result && result[0] && result[0][0]) {
      return result[0][0][0]; // Return the translated text
    }

    return text; // Return original text if no translation found
  } catch (error) {
    console.error("Error translating text:", error);
    return text; // Return original text in case of error
  }
}

// Function to translate all messages in the chat
async function translateAllMessages(targetLang) {
  const messageNodes = document.querySelectorAll(
    "span.selectable-text.copyable-text"
  );

  for (const node of messageNodes) {
    const originalText = node.innerText;
    const translatedText = await translateText(originalText, targetLang);
    console.log(translatedText);

    // Replace the original text with the translated text
    node.innerText = translatedText;
  }
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "TRANSLATE_CHAT") {
    translateAllMessages(request.targetLang);
    sendResponse({ status: "Translation started" });
  }
});
