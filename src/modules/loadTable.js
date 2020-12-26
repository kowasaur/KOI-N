function appendElement(element, parent, content, dataName, dataValue, className) {
    element = document.createElement(element);
    element.innerHTML = content || '';
    parent.appendChild(element);
    if (className !== undefined) {
        element.className = className
    }
    if (dataName !== undefined && dataValue !== undefined) {
        element.dataset[dataName] = dataValue
    }
    return element;
}

module.exports = appendElement