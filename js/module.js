

function OpenModule(element, forId="") {
    var for_id = document.getElementById(element.getAttribute("for"));
    if (forId != "") {
        for_id = document.getElementById(forId);
    }
    if (for_id) {
        for_id.classList.add("Actived")
    }

    isDark = true
}

function CloseModule(element, forId="") {
    var for_id = document.getElementById(element.getAttribute("for"));
    if (forId != "") {
        for_id = document.getElementById(forId);
    }
    if (for_id) {
        for_id.classList.remove("Actived")
    }

    isDark = false
}

function ModuleNextPage(element, index=0) {
    const page = element.closest('.MPage')
    
    
    index = Math.abs(index)
    if (index == 0) {
        index = parseInt(page.getAttribute("module-page"))
    }

    page.classList.remove("Actived")
    page.classList.add("Backed")
    document.querySelector(`#${element.getAttribute("for")} .MPage[module-page="${index + 1}"]`).classList.add("Actived")
}

function BackPage(element) {
    const page = element.closest('.ModulePages').querySelector('.MPages .MPage.Actived')
    var index = parseInt(page.getAttribute("module-page"))

    page.classList.remove("Actived")
    page.classList.add("Backed")
    document.querySelector(`#${element.getAttribute("for")} .MPage[module-page="${index - 1}"]`).classList.add("Actived")
}


function getTextWidth(text, element) {
    // Создаем временный span
    const span = document.createElement('span');
    span.style.visibility = 'hidden';
    span.style.position = 'absolute';
    span.style.whiteSpace = 'pre'; // Сохраняем пробелы
    span.style.font = getComputedStyle(element).font;
    span.style.fontFamily = getComputedStyle(element).fontFamily;
    span.style.fontSize = getComputedStyle(element).fontSize;
    span.style.fontWeight = getComputedStyle(element).fontWeight;
    span.style.letterSpacing = getComputedStyle(element).letterSpacing;
    
    span.textContent = text;
    document.body.appendChild(span);
    
    const width = span.offsetWidth;
    document.body.removeChild(span);
    
    return width;
}

function goToPrevious() {
    let slides = Array.from(document.querySelectorAll('.ModulePages.Actived .MPage'));
    let currentIndex = slides.indexOf(slides.find(el => el.classList.contains("Actived")))

    if (currentIndex > 0) {
        slides[currentIndex].classList.remove('Actived');
        currentIndex--;
        slides[currentIndex].classList.remove('Backe');
        slides[currentIndex].classList.add('Actived');
    }
}

// Простой вариант только с переходом по клику/свайпу
function initSimpleSwipeBack() {
    // Переменные для отслеживания мыши
    let startX = 0;
    let isMouseDown = false;

    // Тач-события (для мобильных устройств)
    document.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX;
    });

    document.addEventListener('touchend', e => {
        if (startX - e.changedTouches[0].clientX > 50) {
            goToPrevious();
        }
    });

    // События мыши (для десктопов)
    document.addEventListener('mousedown', e => {
        isMouseDown = true;
        startX = e.clientX;
    });

    document.addEventListener('mouseup', e => {
        if (!isMouseDown) return;
        isMouseDown = false;
        
        if (e.clientX - startX > 50) {
            goToPrevious();
        }
    });

    // На случай если мышь выйдет за пределы окна
    document.addEventListener('mouseleave', () => {
        isMouseDown = false;
    });

    // Предотвращаем выделение текста при перетаскивании
    document.addEventListener('mousemove', e => {
        if (!isMouseDown) return;
        e.preventDefault();
    });
}

async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        console.log('Текст скопирован в буфер обмена: ', text);
    } catch (err) {
        console.error('Ошибка копирования: ', err);
        // Fallback для старых браузеров
        copyToClipboardFallback(text);
    }
}

let answers = {}

function inputOpenButton(element) {
    if (element.value.trim() != "") {
        answers[element.getAttribute("name")] = element.value.trim()
    }

    if (Object.keys(answers).length == 2) {
        const button = document.getElementById("ON2_Button")
        button.classList.remove("Disabled")
        button.classList.add("Actived")

        let txt = ""

        for (var key in answers) {
            txt += `1. ${answers[key]}\n`
        }

        copyToClipboard(txt)
    }

}

document.addEventListener('DOMContentLoaded', function() {
    initSimpleSwipeBack()
});