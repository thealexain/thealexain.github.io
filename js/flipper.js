
let currentPage = 1;
let totalPages;

function flipNext() {
    if (currentPage >= totalPages) return;
    
    const currentPageEl = document.querySelector(`.Page[data-page="${currentPage}"]`);
    const currentPageEl2 = document.querySelector(`.Page[data-page="${currentPage + 1}"]`);
    currentPageEl.classList.add('Flip');
    currentPageEl2.classList.add('Active');
    currentPageEl.classList.remove('Active');
    
    currentPage++;

    interactives = document.querySelectorAll('.Page.Active .Interactive')
}

function flipPrev() {
    if (currentPage <= 1) return;
    
    currentPage--;
    const currentPageEl = document.querySelector(`.Page[data-page="${currentPage}"]`);
    const currentPageEl2 = document.querySelector(`.Page[data-page="${currentPage + 1}"]`);
    currentPageEl.classList.remove('Flip');
    currentPageEl2.classList.remove('Active');
    currentPageEl.classList.add('Active');

    interactives = document.querySelectorAll('.Page.Active .Interactive')
    
}


let lastScrollTime = 0;
let scrollCooldown = 300;
let scrollSensitivity = 2;
let isMacInertiaScroll = false;
let inertiaTimeout = null;
let isProcessing = false;




function wheel() {
    document.addEventListener('wheel', function(event) {
        let modulesActived = document.querySelectorAll('.Module.Actived')
        if (!modulesActived.length) {
            // Получаем активную страницу
            const activePage = document.querySelector('.Page.Active');
            if (!activePage) return;


            if (Math.abs(event.deltaX) == Math.abs(event.deltaY)) {
                return;
            }
            
            // Проверяем scrollable элементы ТОЛЬКО внутри активной страницы
            if (hasHorizontalScrollAtPoint(event.clientX, event.clientY, activePage)) {
                // Если есть горизонтальный скролл и пользователь скроллит вбок - игнорируем
                if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
                    return; // Пользователь явно скроллит горизонтально
                }
                
                // Если вертикальный скролл, но элемент можно прокрутить вертикально - тоже игнорируем
                if (canScrollVerticallyAtPoint(event.clientX, event.clientY, event.deltaY, activePage)) {
                    return;
                }
            }
            

            
            const now = Date.now();
            
            // Если это инерционный скролл или уже обрабатываем - игнорируем
            if (isMacInertiaScroll || isProcessing) {
                return;
            }
            
            // Защита от слишком частых срабатываний
            if (now - lastScrollTime < scrollCooldown) {
                return;
            }
            
            const scrollForce = Math.abs(event.deltaY) * scrollSensitivity;
            const direction = event.deltaY > 0 ? 'next' : 'prev';
            
            let pagesToFlip = 0;
            
            if (scrollForce > 1) pagesToFlip = 1;
            else if (scrollForce > 70) pagesToFlip = 3;
            
            // console.log(`Сила: ${scrollForce.toFixed(1)}, Направление: ${direction}, Страниц: ${pagesToFlip}`);
            
            // Помечаем что начали обработку
            isProcessing = true;
            
            // Перелистываем страницы
            if (pagesToFlip === 1) {
                // Для одной страницы вызываем сразу
                if (direction === 'next') {
                    flipNext();
                } else {
                    flipPrev();
                }
            } else {
                // Для нескольких страниц делаем с задержкой
                for (let i = 0; i < pagesToFlip; i++) {
                    setTimeout(() => {
                        if (direction === 'next') {
                            flipNext();
                        } else {
                            flipPrev();
                        }
                    }, i * 150);
                }
            }
            
            lastScrollTime = now;
            
            // Сбрасываем флаг обработки после задержки
            setTimeout(() => {
                isProcessing = false;
            }, scrollCooldown);
        }
            
    }, { passive: false });
}

// Обновленная функция проверки горизонтального скролла с ограничением по контейнеру
function hasHorizontalScrollAtPoint(x, y, container) {
    const element = document.elementFromPoint(x, y);
    if (!element) return false;
    
    // Проверяем, находится ли элемент внутри активной страницы
    if (!container.contains(element)) {
        return false;
    }
    
    // Поднимаемся по DOM дереву, но только до границ контейнера
    let current = element;
    while (current && current !== container) {
        if (current.scrollWidth > current.clientWidth && 
            window.getComputedStyle(current).overflowX !== 'hidden') {
            return true;
        }
        current = current.parentElement;
    }
    return false;
}

// Обновленная функция проверки вертикального скролла с ограничением по контейнеру
function canScrollVerticallyAtPoint(x, y, deltaY, container) {
    const element = document.elementFromPoint(x, y);
    if (!element) return false;
    
    // Проверяем, находится ли элемент внутри активной страницы
    if (!container.contains(element)) {
        return false;
    }
    
    let current = element;
    while (current && current !== container) {
        const style = window.getComputedStyle(current);
        const canScroll = current.scrollHeight > current.clientHeight && 
                         style.overflowY !== 'hidden';
        
        if (canScroll) {
            // Проверяем, может ли элемент прокрутиться в направлении скролла
            if (deltaY > 0 && current.scrollTop < current.scrollHeight - current.clientHeight) {
                return true;
            }
            if (deltaY < 0 && current.scrollTop > 0) {
                return true;
            }
        }
        current = current.parentElement;
    }
    return false;
}

// Дополнительные утилиты для обработки инерционного скролла на Mac
function handleMacInertiaScroll() {
    if (navigator.platform.toLowerCase().includes('mac')) {
        document.addEventListener('wheel', function(event) {
            if (Math.abs(event.deltaY) > 0 && event.deltaY % 1 !== 0) {
                isMacInertiaScroll = true;
                
                if (inertiaTimeout) clearTimeout(inertiaTimeout);
                inertiaTimeout = setTimeout(() => {
                    isMacInertiaScroll = false;
                }, 100);
            }
        }, { passive: true });
    }
}

var width = window.innerWidth;

window.addEventListener('resize', () => {
    width = window.innerWidth;
    if (width >= 768) {
        wheel()
    }
});

document.addEventListener('DOMContentLoaded', function() {
    currentPage = 1;
    totalPages = parseInt(document.querySelector("div[all-pages]").getAttribute("all-pages"))

    if (width >= 768) {
        wheel()
        
    }
});