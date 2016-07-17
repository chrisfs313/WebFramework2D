function NDeviceCapabilities(octopusFrameworkInstance) {

    var mFramework = octopusFrameworkInstance;
    var mRenderEngineType;
    var mGraphiContext = null;

    this.GetGraphicContext = function () { return mGraphiContext; }
    this.GetRenderEngineType = function () { return mRenderEngineType; }

    this.Initialize = function (forceCanvas) {
        var canvasElement = mFramework.GetCanvasElement();
        
        if (!forceCanvas) {
            mGraphiContext = mFramework.GetCanvasContextManagment()
                .ConstrucWebGLCanvas(canvasElement);
        }
        
        if (!mGraphiContext) {
            mGraphiContext = mFramework.GetCanvasContextManagment()
                .ConstructCanvas(canvasElement);

            mRenderEngineType = NRenderEngineEnum.CanvasContext2D;
        }
        else {
            mRenderEngineType = NRenderEngineEnum.WebGL;
        }
    }
}