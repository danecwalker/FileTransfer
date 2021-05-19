function isOS() {
    return navigator.userAgent.match(/ipad|iphone/i);
}

function copy(e) {
    e.target.classList.add('clicked');
    var oldName = e.target.innerText;
    e.target.innerText = "Copied!";


    var range,
        selection;

    var urlA = document.getElementById('url')
    var textArea = document.createElement('input');
    textArea.type = "text";
    textArea.value = urlA.innerText;
    document.body.appendChild(textArea);

    if (isOS()) {
        range = document.createRange();
        range.selectNodeContents(textArea);
        selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        textArea.setSelectionRange(0, 999999);
    } else {
        textArea.select();
    }

    document.execCommand('copy');
    textArea.remove();
    
    setTimeout(() => {
        e.target.classList.remove('clicked');
        e.target.innerText = oldName;
    }, 1200);
}

function qrCode() {
    window.location = `?qrcode=true`
}