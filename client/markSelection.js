function createSelection(doc, response) {
    console.log("test" + response);
    selectionEl = doc.createElement("div");
    selectionEl.style.border = "solid darkblue 1px";
    selectionEl.style.backgroundColor = "lightgoldenrodyellow";
    selectionEl.innerHTML = "For target: " + response['res']['target'] + ".\n" + "The result is: " + response['res']['result'];
    selectionEl.style.position = "absolute";
    doc.body.appendChild(selectionEl);
    return selectionEl;
}

function markGoogleDoc(googleDocument, response) {
    selectionEl = createSelection(window.document, response);
    targetBox = googleDocument.selectedRect;
    var left = targetBox.right;
    var top = targetBox.top;
    selectionEl.style.left = left + "px";
    selectionEl.style.top = top + "px";
}

var markSelection = (function(response) {
    var markerTextChar = "\ufeff";
    var markerTextCharEntity = "&#xfeff;";

    var markerEl, markerId = "sel_" + new Date().getTime() + "_" + Math.random().toString().substr(2);

    var selectionEl;

    return function(response) {
        win = window;
        console.log(win);
        var doc = win.document;
        var sel, range;
        // Branch for IE <= 8 
        if (doc.selection && doc.selection.createRange) {
            // Clone the TextRange and collapse
            range = doc.selection.createRange().duplicate();
            range.collapse(false);

            // Create the marker element containing a single invisible character by creating literal HTML and insert it
            range.pasteHTML('<span id="' + markerId + '" style="position: relative;">' + markerTextCharEntity + '</span>');
            markerEl = doc.getElementById(markerId);
        } else if (win.getSelection) {
            sel = win.getSelection();
            range = sel.getRangeAt(0).cloneRange();
            range.collapse(false);

            // Create the marker element containing a single invisible character using DOM methods and insert it
            markerEl = doc.createElement("span");
            markerEl.id = markerId;
            markerEl.appendChild( doc.createTextNode(markerTextChar) );
            range.insertNode(markerEl);
        }

        if (markerEl) {
            // Lazily create element to be placed next to the selection
            // if (!selectionEl) {
            selectionEl = createSelection(doc, response);
            // }

            // Find markerEl position http://www.quirksmode.org/js/findpos.html
            var obj = markerEl;
            var left = 0, top = 0;
            do {
                left += obj.offsetLeft;
                top += obj.offsetTop;
            } while (obj = obj.offsetParent);

            // Move the button into place.
            // Substitute your jQuery stuff in here
            selectionEl.style.left = left + "px";
            selectionEl.style.top = top + "px";

            markerEl.parentNode.removeChild(markerEl);
        }
    };
})();