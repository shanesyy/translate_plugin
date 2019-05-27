
chrome.commands.onCommand.addListener(function(command) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var tab = tabs[0];
        chrome.tabs.sendMessage(tab.id, "translate", function handler(response) {
            console.log(response);
            chrome.notifications.create (
                response['res']['target'],{   
                type: 'basic', 
                iconUrl: 'trans.png', 
                title: response['res']['target'], 
                message: response['res']['result'] 
                },function() {}
            );
        }) ;
    }) ;
});