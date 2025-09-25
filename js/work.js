function OpenGallery(element, forId="") {
    var for_id = document.getElementById(element.getAttribute("for"));
    var imgOriginal = element.getElementsByTagName('img')[[0]].getAttribute("src")
    if (forId != "") {
        for_id = document.getElementById(forId);
    }
    if (for_id) {
        let img = document.getElementById('FSPImage');
        img.setAttribute("src", imgOriginal)
        for_id.classList.add("Actived")
    }
}