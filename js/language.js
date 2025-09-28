
let language = 0;

let langData;

function PNLButton(element) {

    document.querySelectorAll('#PN_Language span').forEach(btn => {
        btn.classList.remove('Actived');
    });

    element.classList.add('Actived');
    if (element.id == "PNL_Ru") {
        language = 0;
    } else {
        language = 1;
    }

    changeTextLanguage(language)
}

function changeLanguage(lang) {
    if (lang == 0 || lang == 1) {
        language = lang
    }
}

function switchLanguage() {
    if (language == 0) {
        language = 1
    } else {
        language = 0
    }
    changeTextLanguage()
}

function changeTextLanguage() {
    Array.from(document.querySelectorAll("*[lang-id]")).forEach(a => {
        a.innerHTML = langData[a.getAttribute("lang-id")][language]
    })
}

window.changeTextLanguage = changeTextLanguage;
window.switchLanguage = switchLanguage;

document.addEventListener('DOMContentLoaded', function() {
    fetch("../data/languages.json")
        .then(response => response.json())
        .then(data => {
            langData = data;
        })
        .catch(error => console.error('Error:', error));
});