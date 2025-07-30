Array.from(document.getElementsByClassName("FSMButtonOpen")).forEach(e => {
    const popup = document.getElementById(e.getAttribute('popup'));
    e.addEventListener("click", () => {
        popup.classList.add('FSMOpen');
    });

    Array.from(popup.querySelectorAll('.FSMButtonClose')).forEach(e => { 
        e.addEventListener("click", () => {
        popup.classList.remove('FSMOpen');
    });
    })
});

 lastID = 'FSMI1';

function setLastID(id) {
    document.getElementById(lastID).classList.remove('Actived');
    lastID = id;
    document.getElementById(id).classList.add('Actived')
}

Array.from(document.querySelectorAll('.FSMGrid > button')).forEach(b => {
    b.addEventListener("click", () => {
        setLastID(b.getAttribute('id2'));
        // document.querySelector('.FullScreenModule:has(div .FSMGrid)')
        
        document.getElementById('FSMIClose').setAttribute('none', '');
        document.getElementById('FSMIButtons').removeAttribute('none');
        document.querySelector('#GetWork #FSMHeader').setAttribute('none', '')
    });
});

Array.from(document.getElementsByClassName("FSMIBack")).forEach(e => {
    e.addEventListener("click", () => {
        setLastID('FSMI1');
        
        document.getElementById('FSMIClose').removeAttribute('none');
        document.getElementById('FSMIButtons').setAttribute('none', '')
        document.querySelector('#GetWork #FSMHeader').removeAttribute('none');
    })
});

var lastTab;

Array.from(document.querySelectorAll(".ReviewBlock .RBLinks > label")).forEach(e => {
    e.addEventListener("click", () => {
        e.closest(".RBLinks").querySelector("label.Active > *.Active").classList.remove("Active")
        e.closest(".RBLinks").querySelector("label.Active").classList.remove("Active")
        
        e.classList.add("Active")
        e.querySelector("span").classList.add("Active")
    })
})

var isLightTheme = window.matchMedia('(prefers-color-scheme: light)').matches;

function themeChange() {
    if (!isLightTheme) {
        document.querySelector("body").setAttribute("darkTheme", "");
        Array.from(document.getElementsByClassName("ChangeAppearance")).forEach(i => {
                i.removeAttribute("moon")
        })
    }

    else {
        document.querySelector("body").removeAttribute("darkTheme");
        Array.from(document.getElementsByClassName("ChangeAppearance")).forEach(i => {
                i.setAttribute("moon", "")
        })
    }
}

function change() {
    isLightTheme = !isLightTheme;
    themeChange();
}

var langData = {}; // Создаем переменную в глобальной области видимости

fetch('../../data/languages.json')
  .then(response => response.json())
  .then(data => {
   langData = data; // Записываем данные в переменную

    languageApplyLoaded()
    
  })
  .catch(error => console.error('Ошибка загрузки:', error));

function changeLanguage(language=0) {
    Array.from(document.querySelectorAll("[data-lang]")).forEach(a => {
        if (langData[a.getAttribute("data-lang")][language] == "--") {
            a.style.display = 'none';
        }
        else {
            if (a.getAttribute("data-lang").includes("AttributeContent")) {
                a.setAttribute("data-content", langData[a.getAttribute("data-lang")][language])
            }
            else {
                a.innerHTML = langData[a.getAttribute("data-lang")][language];
            }
        }
    })
}

function languageButton(element) {
    const url = new URL(window.location.href);

    document.querySelectorAll('.LanguageButtons span').forEach(btn => {
        btn.classList.remove('Actived');
    });

    element.classList.add('Actived');

    if (element.getAttribute("id2") == "RU") {
        changeLanguage(0);
        url.searchParams.set('language', "ru"); // Устанавливаем параметр
        history.pushState({}, '', url);
        document.querySelector("body").setAttribute("data-language", "ru")
    }
    else if (element.getAttribute("id2") == "EN") {
        changeLanguage(1);
        url.searchParams.set('language', "en"); // Устанавливаем параметр
        history.pushState({}, '', url);
        document.querySelector("body").setAttribute("data-language", "en")
    }
}

function languageApplyLoaded() {
    const params = new URLSearchParams(window.location.search);
    var lang = "ru"

    if (params.get("language") == null) {
        const systemLanguage = navigator.language || navigator.userLanguage;

        // Упрощаем до двухбуквенного кода ('ru', 'en' и т.д.)
        if (systemLanguage.split('-')[0].toLowerCase() == "en") {
            changeLanguage(1)
            lang = "en"
        }
    }
    else if (params.get("language" == "en")) {
        changeLanguage(1)
        lang = "en"
    }

    document.querySelectorAll('.LanguageButtons span').forEach(btn => {
        btn.classList.toggle("Actived", btn.getAttribute("id2").toLowerCase() == lang);
    });

    document.querySelector("body").setAttribute("data-language", lang)
}




themeChange()
