const cursor = document.getElementById('Cursor');
const cursor2 = document.getElementById('Cursor2');

let isDark = false;

function cursorChange() {
    if (width >= 768) {
        

        document.addEventListener('mousemove', (e) => {
            const x = e.clientX;
            const y = e.clientY;

            if (!isDark) {
                cursor.style.left = (e.pageX-10) + 'px';
                cursor.style.top = (e.pageY-65) + 'px';
            }
            else {
                cursor2.style.left = (x-10) + "px"
                cursor2.style.top = (y-10) + "px"
            }
            
        });
    }
}

// let langGlobal = {};

function changeText(element = null) {
    const text = document.getElementById("PC6SSText");
    const grids = document.querySelectorAll(".PC6_Grid .Hovering")
    Array.from(grids).forEach(e => {
        if (element != null) {
            e.classList.remove("Actived")
        }
        if (element == e) {
            e.classList.add("Actived")
            
        }

        if (e.classList.contains("Actived")) {
            text.setAttribute("lang-id", e.getAttribute("id2"))
            changeTextLanguage()
            // text.textContent = langGlobal[e.getAttribute("id2")][0]
        }

        

    })
}

function switchTab(element) {
    Array.from(element.closest(".PC4_Tabs").querySelectorAll(".ReviewTab")).forEach(e => {
        e.classList.remove("Actived");
        document.getElementById(e.getAttribute("tab")).classList.remove("Actived")
    })

    element.classList.add("Actived")

    document.getElementById(element.getAttribute("tab")).classList.add("Actived")
}

document.addEventListener('DOMContentLoaded', function() {
    cursorChange()
    changeText()
});