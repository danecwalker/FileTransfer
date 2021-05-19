function Download(id) {
    fetch(window.location, {
        method:"POST"
    }).then((res) => 
        res.blob().then((blob) => {
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = id;
            document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
            a.click();
            a.remove();
        })
    )
}