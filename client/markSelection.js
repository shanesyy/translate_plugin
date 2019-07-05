// from https://stackoverflow.com/questions/3997659/replace-selected-text-in-contenteditable-div
// function replaceSelectedText(replacementText) {
//     var sel, range;
//     if (window.getSelection) {
//         sel = window.getSelection();
//         if (sel.rangeCount) {
//             range = sel.getRangeAt(0);
//             range.deleteContents();
//             range.insertNode(document.createTextNode(replacementText));
//         }
//     } else if (document.selection && document.selection.createRange) {
//         range = document.selection.createRange();
//         range.text = replacementText;
//     }
// }
function replaceSelectedText(range, replacementText) {
    if (range) {    
        range.deleteContents();
        range.insertNode(document.createTextNode(replacementText));
    } else {
        copyTextToClipboard(replacementText);
    }
}

// from https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
function copyTextToClipboard(text) {
  var textArea = document.createElement("textarea");

  //
  // *** This styling is an extra step which is likely not required. ***
  //
  // Why is it here? To ensure:
  // 1. the element is able to have focus and selection.
  // 2. if element was to flash render it has minimal visual impact.
  // 3. less flakyness with selection and copying which **might** occur if
  //    the textarea element is not visible.
  //
  // The likelihood is the element won't even render, not even a
  // flash, so some of these are just precautions. However in
  // Internet Explorer the element is visible whilst the popup
  // box asking the user for permission for the web page to
  // copy to the clipboard.
  //

  // Place in top-left corner of screen regardless of scroll position.
  textArea.style.position = 'fixed';
  textArea.style.top = 0;
  textArea.style.left = 0;

  // Ensure it has a small width and height. Setting to 1px / 1em
  // doesn't work as this gives a negative w/h on some browsers.
  textArea.style.width = '2em';
  textArea.style.height = '2em';

  // We don't need padding, reducing the size if it does flash render.
  textArea.style.padding = 0;

  // Clean up any borders.
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';

  // Avoid flash of white box if rendered for any reason.
  textArea.style.background = 'transparent';


  textArea.value = text;

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Copying text command was ' + msg);
  } catch (err) {
    console.log('Oops, unable to copy');
  }

  document.body.removeChild(textArea);
}



function createSelection(doc, response) {
    sel = window.getSelection();
    if (sel.rangeCount)
        range = sel.getRangeAt(0);
    else
        range = null;
    selectionEl = doc.createElement("div");
    selectionEl.style.border = "solid darkblue 1px";
    selectionEl.style.backgroundColor = "lightgoldenrodyellow";
    selectionEl.style.position = "absolute";
    doc.body.appendChild(selectionEl);

    closeBtn = doc.createElement("span");
    closeBtn.innerText = "x";
    closeBtn.style.cssFloat = "right";
    closeBtn.style.display = "inline-block";
    closeBtn.style.paddingTop = "2px";
    closeBtn.style.paddingRight = "5px";
    selectionEl.appendChild(closeBtn);
    closeBtn.onclick = function() {
        this.parentNode.parentNode.removeChild(this.parentNode);
    }

    target = doc.createElement("p");
    target.innerText = response['res']['target'];
    selectionEl.appendChild(target);

    result = doc.createElement("p");
    result.innerText = response['res']['result'];
    result.onclick = function() {
        replaceSelectedText(range, response['res']['result']);
        this.parentNode.parentNode.removeChild(this.parentNode);
    };
    selectionEl.appendChild(result);

    fromGoogle = doc.createElement("div");
    response['res']['from_google'].forEach(item => {
        div = doc.createElement("div");

        head = doc.createElement("p");
        head.innerText = item[0];
        div.appendChild(head);

        item[1].forEach(subItem => {
            subDiv = doc.createElement("div");
            subRes = doc.createElement("span");
            subRes.innerText = subItem[0];
            subRes.style.paddingLeft = "10px";
            subDiv.appendChild(subRes);
            explanation = doc.createElement("span");
            explanation.innerText = subItem[1].join(",");
            explanation.style.paddingLeft = "10px";
            subDiv.appendChild(explanation);
            subDiv.onclick = function() {
                replaceSelectedText(range, subItem[0]);
                this.parentNode.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode.parentNode);
            };
            div.appendChild(subDiv);
        });
        fromGoogle.appendChild(div);
    });
    selectionEl.appendChild(fromGoogle);

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