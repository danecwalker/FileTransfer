function dropHandler(e) {
    e.preventDefault();

    if (e.dataTransfer.items) {


        var loader = document.createElement('div');
        var loaderBox = document.createElement('div');
        loader.className = 'loader';
        loaderBox.className = 'loaderBox';
        loaderBox.appendChild(loader);
        var parent = e.target.parentNode;
        parent.replaceChild(loaderBox, e.target);

        for (let i = 0; i < e.dataTransfer.items.length; i++) {
            const item = e.dataTransfer.items[i];
            
            if (item.kind === 'file') {
                var file = item.getAsFile()

                var formData = new FormData();
                formData.append("file", file)

                fetch("/upload", {
                    method: "POST",
                    body: formData
                }).then(res => {
                    res.json().then(data => {
                        if (data.fileId) {
                            window.location = `/success/${data.fileId}`
                        }
                    })
                })
            }
        }
    }
}

function dragHandler(e) {
    e.preventDefault();

}