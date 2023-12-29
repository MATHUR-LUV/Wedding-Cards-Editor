document.getElementById('addTextbutton').addEventListener('click', function () {
    let canvas = document.getElementById('canvas');
    let textElement = document.createElement('textarea');
    textElement.className = 'text';

    canvas.appendChild(textElement);

    let undoStack = [];
    let redoStack = [];
    let rotationAngle = 0;

    textElement.addEventListener('input', function () {

        saveState(textElement);

        let fontSize = document.getElementById('fontSize').value + 'px';
        let fontFamily = document.getElementById('fontFamily').value;
        let fontColor = document.getElementById('fontColor').value;

        textElement.style.fontSize = fontSize;
        textElement.style.fontFamily = fontFamily;
        textElement.style.color = fontColor;

        textarea_height(textElement, 500);
        textarea_width(textElement, 400);
    });

    function onDrag({ movementX, movementY }) {
        let getStyle = window.getComputedStyle(textElement);
        let leftVal = parseInt(getStyle.left) || 0;
        let topVal = parseInt(getStyle.top) || 0;
        textElement.style.left = `${leftVal + movementX}px`;
        textElement.style.top = `${topVal + movementY}px`;
    }

    function rotateText(degrees) {
        rotationAngle += degrees;
        textElement.style.transform = `rotate(${rotationAngle}deg)`;
    }

    textElement.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        textElement.classList.add('active');
        textElement.addEventListener('mousemove', onDrag);
    });

    document.addEventListener('mouseup', () => {
        textElement.classList.remove('active');
        textElement.removeEventListener('mousemove', onDrag);
    });

    document.addEventListener('mousedown', (e) => {
        if (e.target === textElement) {
            e.preventDefault();
        } else {
            textElement.classList.remove('active');
        }
    });

    document.getElementById('undoButton').addEventListener('click', function () {
        undo();
    });

    document.getElementById('redoButton').addEventListener('click', function () {
        redo();
    });

    document.getElementById('rotateButton').addEventListener('click', function () {
        let rotationInput = document.getElementById('rotationInput');
        let angle = parseFloat(rotationInput.value) || 0;
        rotateText(angle);
    });

    function saveState(textarea) {
        undoStack.push({
            value: textarea.value,
            rotation: rotationAngle
        });
        redoStack = [];
    }

    function undo() {
        if (undoStack.length > 1) {
            let prevState = undoStack.pop();
            redoStack.push({
                value: textElement.value,
                rotation: rotationAngle
            });
            textElement.value = prevState.value;
            rotationAngle = prevState.rotation;
            rotateText(rotationAngle);
        } else if (undoStack.length === 1) {

            redoStack.push({
                value: textElement.value,
                rotation: rotationAngle
            });
            textElement.remove();
        }
    }

    function redo() {
        if (redoStack.length > 0) {
            let nextState = redoStack.pop();
            undoStack.push({
                value: textElement.value,
                rotation: rotationAngle
            });
            textElement.value = nextState.value;
            rotationAngle = nextState.rotation;
            rotateText(rotationAngle);
            canvas.appendChild(textElement);
        }
    }
});

function textarea_height(textarea, maxHeight) {
    let rows = textarea.value.split("\n").length;
    let lineHeight = parseInt(window.getComputedStyle(textarea).lineHeight);
    let newHeight = Math.min(rows * lineHeight, maxHeight);
    textarea.style.height = `${newHeight}px`;
}

function textarea_width(textarea, maxWidth) {
    let cols = textarea.value.split("\n").reduce((max, line) => Math.max(max, line.length), 0);
    let charWidth = parseInt(window.getComputedStyle(textarea).fontSize);
    let newWidth = Math.min(cols * charWidth, maxWidth);
    textarea.style.width = `${newWidth}px`;
}
