function NRenderCamera(framework) {

    var mFrameworkInstance = framework;
    var mGraphicDevice;
    var mGraphicContext;

    var mRenderEngineType;

    var mWorldMatrix = Matrix.I(4);
    mWorldMatrix = mWorldMatrix.x(Matrix.Translation($V([-0.0, 0.0, -10])).ensure4x4());

    var mViewMatrix = Matrix.I(4);
    var mProjectionMatrix;
    var mTransformedMatrix;

    this.GetWorldMatrix         = function () { return mWorldMatrix; }
    this.GetViewMatrix          = function () { return mViewMatrix; }
    this.GetProjectionMatrix    = function () { return mProjectionMatrix; }
    this.GetTransformedMatrix   = function () { return mTransformedMatrix; }

    this.Initialize = function (graphicDevice) {
        mGraphicDevice = graphicDevice;
        mGraphicContext = mGraphicDevice.GetGraphicContext();
        mRenderEngineType = mGraphicDevice.GetRenderEngineType();

        // Set Viewport
        var appWidth = mFrameworkInstance.GetAppWidth();
        var appHeight = mFrameworkInstance.GetAppHeight();

        this.SetViewport(appWidth, appHeight);

        switch (mRenderEngineType) {
            case NRenderEngineEnum.WebGL:
                var zNear = 0.01;
                var zFar = 100;

                switch (NFrameworkSettings.CanvasContextType) {
                    case "2d":
                        this.CreateOrthographic(appWidth, appHeight, zNear, zFar);
                        break;
                    case "3d":
                        var fov = 45;

                        this.CreatePerspective(fov, appWidth, appHeight, zNear, zFar);
                        break;
                }
                break;
        }
    }

    this.CreatePerspective = function (fov, width, height, zNear, zFar) {
        var aspectRatio = width / height;

        mProjectionMatrix = makePerspective(fov, aspectRatio, zNear, zFar);

    }
    this.CreateOrthographic = function (width, height, zNear, zFar) {
        mProjectionMatrix = makeOrtho(0, width, height, 0, zNear, zFar);
    }

    this.SetViewport = function (width, height) {
        mGraphicDevice.GetCanvasElement().width = width;
        mGraphicDevice.GetCanvasElement().height = height;

        switch (mRenderEngineType) {
            case NRenderEngineEnum.WebGL:
                mGraphicContext.viewport(0, 0, width, height);
                break;
        }
    }

    this.Update = function (args) {
        switch (mRenderEngineType) {
            case NRenderEngineEnum.WebGL:
                mTransformedMatrix = mProjectionMatrix;
                mTransformedMatrix = mTransformedMatrix.x(mViewMatrix.x(mWorldMatrix));
                break;
        }
    }
}