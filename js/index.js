const cursor = document.getElementById('Cursor');
const cursor2 = document.getElementById('Cursor2');
const cursorLA = document.getElementsByClassName('LightApperance')[0];

let isDark = false;

function cursorChange() {
    if (width >= 768) {
        

        document.addEventListener('mousemove', (e) => {
            const x = e.clientX;
            const y = e.clientY;

            if (!isDark) {
                cursor.style.left = (e.pageX-160) + 'px';
                cursor.style.top = (e.pageY-50) + 'px';
                cursorLA.style.setProperty('--cursorX', (e.pageX-500) + 'px');
                cursorLA.style.setProperty('--cursorY', (e.pageY-500)+ 'px');
            }
            else {
                cursor2.style.left = (x-10) + "px"
                cursor2.style.top = (y-10) + "px"
            }
            
        });
    }
}

// let langGlobal = {};

function changeText(element) {
    const text = document.getElementById("PC6SSText");
    const grids = document.querySelectorAll(".PC6_Grid .Hovering")
    Array.from(grids).forEach(e => {
        e.classList.remove("Actived");
    })

    Array.from(grids).forEach(e => {

        if (element == e) {
            e.classList.add("Actived")
        }

    if (element.classList.contains("Actived")) {
        text.setAttribute("lang-id", element.getAttribute("id2"))
        changeTextLanguage()
        // text.textContent = langGlobal[e.getAttribute("id2")][0]
    }

        

    })
}

function switchTab(element) {
    Array.from(element.closest(".PC4_Tabs").querySelectorAll(".ReviewTab")).forEach(e => {
        e.classList.remove("Actived");

        if (document.getElementById(e.getAttribute("tab")).classList.contains("Actived")) {
            document.getElementById(e.getAttribute("tab")).classList.remove("Actived")
        }
    })

    element.classList.add("Actived");
    document.getElementById(element.getAttribute("tab")).classList.add("Actived")
}

function createInputElement(parent, labelText, inputId, placeholderText) {
    // Создаем контейнер
    
    // Создаем label
    const label = document.createElement('label');
    label.htmlFor = inputId;
    label.className = 'Handrawn TwentyFive';
    label.setAttribute("lang-id", inputId)
    label.textContent = labelText;
    
    // Создаем контейнер для input
    const inputContainer = document.createElement('div');
    inputContainer.className = 'LightedInput';
    
    // Создаем input
    const input = document.createElement('input');
    input.type = 'text';
    input.name = inputId;
    input.id = inputId;
    input.className = 'Handrawn TwentyFive';
    input.setAttribute("lang-id", inputId)
    input.setAttribute("lang-for", "placeholder")
    input.placeholder = getLanguageElement(placeholderText);
    input.oninput = function() { inputOpenButton(this); };
    
    // Создаем div внутри контейнера
    const innerDiv = document.createElement('div');
    
    // Собираем структуру
    inputContainer.appendChild(input);
    inputContainer.appendChild(innerDiv);
    
    parent.appendChild(label);
    parent.appendChild(inputContainer);
}

function ONopenInputs(button) {
    const where = document.getElementById("ONInputs");
    where.innerHTML = ''
    const category = button.getAttribute("lang-id").replace("category", "")
    createInputElement(where, getLanguageElement("briefName"), `briefName`, "")
    createInputElement(where, getLanguageElement("briefBudget"), `briefBudget`, "")
    
    for (let i = 1; i <=9; i++) {
        createInputElement(where, getLanguageElement(`brief${category}${i}`), `brief${category}${i}`, `brief${category}${i}Placeholder`)
    }
    
}

document.addEventListener('DOMContentLoaded', function() {
    cursorChange()
    changeText()
});