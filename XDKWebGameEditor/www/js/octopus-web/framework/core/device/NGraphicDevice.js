function NGraphicDevice(frameworkInstance) {
    
    var mFrameworkInstance = frameworkInstance;
    var mGraphicDeviceInstance;
    var mGraphicContext;
    var mCanvasObject;
    var mRenderEngineType;
    var mDeviceOptimizationManagment;
    var mRenderCamera;

    var mShaderFactory;
    this.ClearColor = NFrameworkSettings.RenderClearColor;
    
    this.GetGraphicContext                  = function () { return mGraphicContext; }
    this.GetShaderFactory                   = function () { return mShaderFactory; }
    this.GetDeviceCapabilities              = function () { return mDeviceCapabilities; }
    this.GetFramework                       = function () { return mFrameworkInstance; }
    this.GetCanvasElement                   = function () { return mCanvasObject.CanvasElement; }
    this.GetRenderEngineType                = function () { return mRenderEngineType; }
    this.GetRenderCamera                    = function () { return mRenderCamera; }
    this.GetDeviceOptimizationManagment     = function () { return mDeviceOptimizationManagment; }

    this.Initialize = function (canvasObject, renderEngineType) {
        mGraphicDeviceInstance = this;

        mFrameworkInstance = frameworkInstance;
        mCanvasObject = canvasObject;
        mRenderEngineType = renderEngineType;
        mGraphicContext = mCanvasObject.Context;

        // Create RenderCamera and initialize it
        mRenderCamera = new NRenderCamera(mFrameworkInstance);
        mRenderCamera.Initialize(this);

        switch (mRenderEngineType) {
            case NRenderEngineEnum.WebGL:
                // GL_INSTANCE as Global Variable
                GL_Helper = new GLHelper(mGraphicContext);
                // Create a Shader Factory and Load all the Shaders in the application
                mShaderFactory = new NShaderFactory(this);
                mShaderFactory.LoadAll();
                // Create device optimization managment
                mDeviceOptimizationManagment = new NDeviceOptimizationManagment(this);
                mDeviceOptimizationManagment.Initialize();
                break;
        }
    }
    
    this.Clear = function () {
        switch (mRenderEngineType) {
            case NRenderEngineEnum.CanvasContext2D:
                mGraphicContext.clearRect(0, 0, mCanvasObject.CanvasElement.width, mCanvasObject.CanvasElement.height);
                mGraphicContext.fillStyle = mGraphicDeviceInstance.ClearColor.GetResult();
                mGraphicContext.fillRect(0, 0, mCanvasObject.CanvasElement.width, mCanvasObject.CanvasElement.height);


                //mGraphicContext.save();
                //mGraphicContext.globalAlpha = 1;
                //mGraphicContext.translate(40, 40);
                //mGraphicContext.rotate(0);
                //mGraphicContext.scale(1, 1);
     
                //mGraphicContext.font = "normal" + " - " + "14" + "px " + "Arial";
                //mGraphicContext.fillStyle = "rgb(255, 255, 255)";
                
                //mGraphicContext.fillText("algo esyqensjdasjdasjd sajdsad sad sad sadsa", 0, 0);
                
                //mGraphicContext.restore();
                break;
            case NRenderEngineEnum.WebGL:
                var color = mGraphicDeviceInstance.ClearColor.GetResult();
                
                GL.clearColor(color.r, color.g, color.b, color.a);
                //GL.enable(GL.DEPTH_TEST);
                //GL.depthFunc(GL.LEQUAL);
                GL.clear(GL.COLOR_BUFFER_BIT);
                //replaced with: GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
                break;
        }
    }

    this.Update = function (args) {
        this.Clear();

        mRenderCamera.Update(args);

        switch (mRenderEngineType) {
            case NRenderEngineEnum.WebGL:
                mDeviceOptimizationManagment.Update(args);
                break;
        }
    }
}