function NHTMLUtil() { }

NHTMLUtil.CreateCanvas = function (warningText, parentDiv, id) {
    var elementText = document.createTextNode(warningText);
    var element = document.createElement("canvas");
    element.id = id;

    element.appendChild(elementText);
    parentDiv.appendChild(element);

    return element;
}