function NCanvasContextManagment(frameworkInstance) {
    var mFrameworkInstance = frameworkInstance;
    var mCanvasContexts = [];

    this.FindCanvasObject = function (id) {
        return mCanvasContexts[id];
    }

    this.CreateCanvasElement = function (id, stylePosition,
        styleLeft, styleTop, styleZIndex) {

        var div = mFrameworkInstance.GetParentDiv();
        var element = NHTMLUtil.CreateCanvas(NFrameworkSettings.Message_CanvasHTML5Warning, div, id);
        element.style.position = stylePosition == undefined ? 'relative' : stylePosition;
        element.style.left = styleLeft == undefined ? "0px" : styleLeft;
        element.style.top = styleTop == undefined ? "0px" : styleTop;
        element.style["z-index"] = styleZIndex == undefined ? "0" : styleZIndex;

        mCanvasContexts[id] = { CanvasElement: element, Context: null };

        return mCanvasContexts[id];
    }

    this.CreateCanvasElementAndContext = function (id, renderEngineEnum, stylePosition,
        styleLeft, styleTop, styleZIndex) {

        var div = mFrameworkInstance.GetParentDiv();
        var element = NHTMLUtil.CreateCanvas(NFrameworkSettings.Message_CanvasHTML5Warning, div, id);
        var graphicContext = null;

        element.style.position = stylePosition == undefined ? 'relative' : stylePosition;
        element.style.left = styleLeft == undefined ? "0px" : styleLeft;
        element.style.top = styleTop == undefined ? "0px" : styleTop;
        element.style["z-index"] = styleZIndex == undefined ? "0" : styleZIndex;

        switch (renderEngineEnum) {
        case NRenderEngineEnum.CanvasContext2D:
            graphicContext = this.ConstructCanvas(element);
            break;
        case NRenderEngineEnum.WebGL:
            graphicContext = this.ConstrucWebGLCanvas(element);
            break;
        }

        mCanvasContexts[id] = { CanvasElement: element, Context: graphicContext };

        return mCanvasContexts[id];
    }

    this.ConstructCanvas = function (canvas) {
        return canvas.getContext(NFrameworkSettings.CanvasContextType);
    }

    this.ConstrucWebGLCanvas = function (canvas) {
        var graphicContext;

        try {
            graphicContext = canvas.getContext("webgl", { alpha: false }) ||
                canvas.getContext("experimental-webgl", { alpha: false });
        }
        catch (e) { }

        return graphicContext;
    }
}