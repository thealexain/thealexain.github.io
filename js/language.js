
let language = 0;
const languageBrowser = navigator.language.split('-')[0]
if (languageBrowser == "en"){
    language = 1;
    document.getElementById("PNL_En").classList.add("Actived")
    document.getElementById("PNL_Ru").classList.remove("Actived")
}

let langData;
let langData2;

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

function getLanguageElement(id) {
    if (id != "") {
    return langData[id][language];
    }
    return ""
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
    console.log(document.querySelectorAll("*[lang-id]"))
    Array.from(document.querySelectorAll("*[lang-id]")).forEach(a => {
        if (a.hasAttribute("lang-for") && a.getAttribute("lang-for") == "placeholder") {
            a.setAttribute(a.getAttribute("lang-for"), langData[a.getAttribute("lang-id") + "Placeholder"][language])
        }
        else {
            if (a.hasAttribute("lang-work")) {
                l = ""
                if (language == 1) {
                    l = "Eng"
                }

                cp = a.innerHTML;
                t = langData2[a.getAttribute("lang-work")][a.getAttribute("lang-id") + l]
                if (t != undefined) {
                    a.innerHTML = t;
                } else {
                    a.innerHTML = langData2[a.getAttribute("lang-work")][a.getAttribute("lang-id")];
                }

            }
            else {
                a.innerHTML = langData[a.getAttribute("lang-id")][language]
            }
        }
    })
}

window.changeTextLanguage = changeTextLanguage;
window.switchLanguage = switchLanguage;
window.getLanguageElement = getLanguageElement;

document.addEventListener('DOMContentLoaded', function() {
    fetch("../data/languages.json")
        .then(response => response.json())
        .then(data => {
            langData = data;
        })
        .catch(error => console.error('Error:', error));

    fetch("../data/works.json")
        .then(response => response.json())
        .then(data => {
            langData2 = data;
            changeTextLanguage()
        })
        .catch(error => console.error('Error:', error));
});