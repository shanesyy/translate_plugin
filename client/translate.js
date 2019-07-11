var translateServiceUrl = "https://www.shanesyy-abby.tk/translate_service"
var dstLang = "en";

// JSON to be injected into the google document the purpose of this is
// to respond to the message sent by the popup to the page, so that
// the page can respond with the selected text.

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        var target;
        var curUrl = window.location.href;
        if (curUrl.startsWith("https://docs.google.com/document")) {
            var googleDocument = googleDocsUtil.getGoogleDocument();
            target = googleDocument.selectedText;
        } else {
            target = window.getSelection().toString();
        }
        chrome.storage.sync.get("translatePluginDstLang", result => {
            console.log(result);
            if (result.translatePluginDstLang)
                dstLang = result.translatePluginDstLang;
            else
                dstLang = "en";
        
            console.log("The selected text is: " + target);
            console.log("The selected lang is: " + dstLang);
            
            if (target != '') {
                data = {"text": target, "dst": dstLang};
                $.ajax({
                    type: "POST",
                    url: translateServiceUrl,
                    contentType: "application/json;charset=utf-8",
                    data: JSON.stringify(data),
                    dataType: "json",
                    success: function(response) {
                        if (curUrl.startsWith("https://docs.google.com/document")) {
                            markGoogleDoc(googleDocument, response);
                        }
                        else {
                            markSelection(response);
                        }
                        sendResponse(response);
                    }
                });
            } else {
                console.log("Empty target.");
                sendResponse("Empty target.");
            }
        });
        return true;
    }) ;
