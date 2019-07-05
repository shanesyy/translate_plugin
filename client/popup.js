// This code runs in the popup window to communicate with the page
// itself, get the selected text, then display that result in the
// popup's html.

// function setChildTextNode(elementId, text) {
//     document.getElementById(elementId).innerText = text;
// }

// // function getSrcLanguage() {
// //     setChildTextNode("dst", "loading...");
// //     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
// //         var tab = tabs[0];
// //         console.log(tab);
// //         chrome.tabs.detectLanguage(tab.id, function handler(response) {
// //             console.log(response);
// //             setChildTextNode("dst", response);
// //         });
// //     });
// // }

// function displayHighlight() {
//     setChildTextNode("snippet", "running...");
//     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//         var tab = tabs[0];
//         chrome.tabs.sendMessage(tab.id, "popup", responseCallback=function handler(response) {
//             setChildTextNode("snippet", response);
//         }) ;
//     }) ;
// }

// // When popup window is loaded, immediately display the selectedText
// document.addEventListener('DOMContentLoaded', function() {
//     window.addEventListener('load', displayHighlight) ;
// }) ;

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


