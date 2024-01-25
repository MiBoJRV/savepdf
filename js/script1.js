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
        const editableSpans = pages[index].querySelectorAll('span[contenteditable="plaintext-only"]');
        editableSpans.forEach(span => {
            span.style.color = "#000";
        });
            setTimeout(() => {
        editableSpans.forEach(span => {
            span.style.color = "#F00";
        });
    }, 500);

        html2canvas(pages[index]).then(canvas => {
            var imgData = canvas.toDataURL('image/png');
            var imgWidth = 210;
            var imgHeight = (canvas.height * imgWidth) / canvas.width;

            if (index > 0) {
                doc.addPage();
            }

            doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

            // Recursively call the function for the next page
            addPageToPDF(index + 1);
        });
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








