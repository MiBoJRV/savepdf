window.jsPDF = window.jspdf.jsPDF;

function saveAsPDF() {
    const element = document.getElementById('editableContent');
    const pages = element.querySelectorAll('.page');

    var doc = new jsPDF({
        unit: 'mm',
        format: 'a4',
    });

    // Recursive function to capture and add pages sequentially
    function addPageToPDF(index) {
        if (index >= pages.length) {
            // Save PDF when all pages are processed
            doc.save('myfile.pdf');
            return;
        }

        // Change the color of span elements to #000 before capturing
        const editableSpans = pages[index].querySelectorAll('span[contenteditable="true"]');
        editableSpans.forEach(span => {
            span.style.color = "#000";
        });

        // Delay to ensure styles are applied before capturing
        setTimeout(() => {
            editableSpans.forEach(span => {
                span.style.color = "#F00";
            });

            html2canvas(pages[index], { scale: 2 }) // Increase scale for higher resolution
                .then(canvas => {
                    var imgData = canvas.toDataURL('image/jpeg', 1.0); // Use JPEG format with high quality
                    var imgWidth = 210;
                    var imgHeight = (canvas.height * imgWidth) / canvas.width;

                    if (index > 0) {
                        doc.addPage();
                    }

                    doc.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);

                    // Recursively call the function for the next page
                    addPageToPDF(index + 1);
                });
        }, 500);
    }

    // Start the process with the first page
    addPageToPDF(0);
}






const editableSpans = document.querySelectorAll('span[contenteditable="true"]');
editableSpans.forEach(span => {
    span.style.color = "#F00";

});

document.addEventListener('DOMContentLoaded', function() {
    const blockContainer = document.querySelector('.block_6');

    // Инициализация кнопок
    const uploadButton = createUploadButton();
    const removeButton = createRemoveButton();

    // Добавление кнопок в контейнер
    blockContainer.appendChild(uploadButton);

    // Обработчик события для кнопки загрузки
    uploadButton.addEventListener('click', function() {
        const input = document.createElement('input');
        input.type = 'file';

        input.addEventListener('change', function() {
            const file = input.files[0];

            if (file) {
                const reader = new FileReader();

                reader.addEventListener('load', function() {
                    const imageUrl = reader.result;
                    displayImage(imageUrl);

                    // Toggle visibility of buttons
                    // uploadButton.style.display = 'none';
                    removeButton.style.display = 'flex';
                    removeButton.style.opacity = '0';
                });

                reader.readAsDataURL(file);
            }
        });

        input.click();
    });

    // Обработчик события для кнопки удаления
    removeButton.addEventListener('click', function() {
        removeImage();
    });

    function displayImage(url) {
        const imageContainer = document.createElement('div');
        const image = document.createElement('img');

        image.src = url;
        image.style.maxWidth = '100%';
        imageContainer.appendChild(image);

        blockContainer.innerHTML = ''; // Очистка контейнера перед добавлением нового изображения
        blockContainer.appendChild(imageContainer);
        blockContainer.appendChild(removeButton); // Добавление кнопки удаления
    }

    function removeImage() {
        // Очистка контейнера
        blockContainer.innerHTML = '';

        // Повторное добавление кнопки загрузки
        blockContainer.appendChild(uploadButton);
    }

    // Функция создания кнопки загрузки
    function createUploadButton() {
        const button = document.createElement('button');
        button.className = 'upload';
        button.textContent = 'Upload the Image';
        return button;
    }

    // Функция создания кнопки удаления
    function createRemoveButton() {
        const button = document.createElement('button');
        button.className = 'remove';
        button.textContent = 'Remove the Image';
        // button.style.display = 'none'; // Изначально скрыта
        return button;
    }
});

// -------------------------------
document.addEventListener('DOMContentLoaded', () => {
    let editableSpansTrue = document.querySelectorAll('span[contenteditable="true"]');
    console.log(editableSpansTrue.length)

    editableSpansTrue.forEach(editableSpan => {
        editableSpan.addEventListener("keydown", e => {
            if (e.keyCode == 13) {
                e.preventDefault();
                e.stopPropagation();
                insertTextAtSelection(editableSpan, "\n");
            }
        });

        editableSpan.addEventListener("paste", e => {
            console.log('paste');
            e.preventDefault();
            let text = (e.originalEvent || e).clipboardData.getData('text/plain');
            insertTextAtSelection(editableSpan, text);
        });
    });

    function insertTextAtSelection(element, txt) {
        let sel = window.getSelection();
        let text = element.textContent;
        let before = Math.min(sel.focusOffset, sel.anchorOffset);
        let after = Math.max(sel.focusOffset, sel.anchorOffset);
        let afterStr = text.substring(after);
        if (afterStr == "") afterStr = "\n";
        element.textContent = text.substring(0, before) + txt + afterStr;
        sel.removeAllRanges();
        let range = document.createRange();
        range.setStart(element.childNodes[0], before + txt.length);
        range.setEnd(element.childNodes[0], before + txt.length);
        sel.addRange(range);
    }

});







