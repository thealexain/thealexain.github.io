

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




document.addEventListener('DOMContentLoaded', function() {
    cursorChange()
});