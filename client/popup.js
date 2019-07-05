// This code runs in the popup window to communicate with the page
// itself, get the selected text, then display that result in the
// popup's html.

document.addEventListener('DOMContentLoaded', function() {
    var target = document.getElementById("dst");
    chrome.storage.sync.get("translatePluginDstLang", function(result) {
        if (result.translatePluginDstLang) {
            target.value = result.translatePluginDstLang;
        } else {
            target.value = "en";
        }
    });
    target.addEventListener('change', function() {
        console.log(target.value);
        chrome.storage.sync.set({'translatePluginDstLang': target.value});
    });
});


