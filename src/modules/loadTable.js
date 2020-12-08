function appendElement(element, parent, content) {
    element = document.createElement(element);
    element.innerHTML = content || '';
    parent.appendChild(element);
    return element;
}

module.exports = appendElement