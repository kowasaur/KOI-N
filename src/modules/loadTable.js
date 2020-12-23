function appendElement(element, parent, content, className) {
    element = document.createElement(element);
    element.innerHTML = content || '';
    parent.appendChild(element);
    if (className !== undefined) {
        element.className = className
    }
    return element;
}

module.exports = appendElement