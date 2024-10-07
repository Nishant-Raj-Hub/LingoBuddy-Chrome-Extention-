document.addEventListener('DOMContentLoaded', function () {
  const inputLangSelect = document.getElementById('input-lang');
  const outputLangSelect = document.getElementById('output-lang');
  const saveSettingsButton = document.getElementById('save-settings');

  // Fetch available languages from Google Translate API
  async function fetchLanguages() {
    try {
      const response = await fetch('https://translate.googleapis.com/translate_a/l?client=gtx&hl=en&format=html');
      const data = await response.json();
      const languages = await data.sl;

      // Map the response into <option> tags for input and output languages
      const optionsHTML = Object.keys(languages).map(langCode => 
        `<option value="${langCode}">${languages[langCode]}</option>`
      ).join('');

      // Set the options in both input and output language selectors
      inputLangSelect.innerHTML = optionsHTML;
      outputLangSelect.innerHTML = optionsHTML;
      
    } catch (error) {
      console.error('Error fetching languages:', error);
    }
  }

  // Fetch languages when the popup loads
  fetchLanguages();

  // When the user clicks Save, send the selected language and text to content.js
  saveSettingsButton.addEventListener('click', () => {
    const targetLang = outputLangSelect.value;

    // Send a message to the content script to translate the chat
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs.length === 0) {
        console.log("No active tab found.");
        return;
      }
    
      console.log("Active tab found:", tabs[0]);
      chrome.tabs.sendMessage(tabs[0].id, {
        type: 'TRANSLATE_CHAT',
        targetLang: targetLang
      }, function (response) {
        if (chrome.runtime.lastError) {
          console.error("Error sending message:", chrome.runtime.lastError);
        } else if (response && response.translatedText) {
          console.log('Translation successful:', response.translatedText);
        } else {
          console.log('Translation failed.');
        }
      });
    });
  });
});
