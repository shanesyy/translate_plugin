var translateServiceUrl = "http://localhost:12000/translate_service"

// JSON to be injected into the google document the purpose of this is
// to respond to the message sent by the popup to the page, so that
// the page can respond with the selected text.

chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
        var googleDocument = googleDocsUtil.getGoogleDocument();
        console.log("The selected text is: " + googleDocument.selectedText);
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
    }) ;


// function getCSRFToken() {
//     var cookies = document.cookie.split(";");
//     for (var i = 0; i < cookies.length; i++) {
//         if (cookies[i].startsWith("csrftoken=")) {
//             return cookies[i].substring("csrftoken=".length, cookies[i].length);
//         }
//     }
//     return "unknown";
// }

// function translationHandler(response) {
//     console.log(response);
//     sendResponse(response);
// }