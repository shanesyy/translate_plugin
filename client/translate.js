var translateServiceUrl = "http://localhost:12000/translate_service"

// JSON to be injected into the google document the purpose of this is
// to respond to the message sent by the popup to the page, so that
// the page can respond with the selected text.

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        var googleDocument = googleDocsUtil.getGoogleDocument();
        console.log("The selected text is: " + googleDocument.selectedText);
        if (googleDocument.selectedText != '') {
            data = {"text": googleDocument.selectedText, "dst": "en"};
            $.ajax({
                type: "POST",
                url: translateServiceUrl,
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify(data),
                dataType: "json",
                success: function(response) {
                    console.log(response);
                    sendResponse(response);
                }
            });
        } else {
            console.log("Empty target.");
            sendResponse("Empty target.");
        }
        return true;
    }) ;
