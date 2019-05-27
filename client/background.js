
chrome.commands.onCommand.addListener(function(command) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var tab = tabs[0];
        chrome.tabs.sendMessage(tab.id, "translate", function handler(response) {
            console.log(response);
            chrome.windows.create({'url': 'result.html', 'type': 'popup', 'width': 300, 'height': 200}, function(window) {
                console.log(window);
                chrome.tabs.executeScript(window.tabs[0].id, {
                    code: "document.getElementById('result').innerText = " + response['res']['trans'] + ";"
                });
            });
        }) ;
    }) ;
});