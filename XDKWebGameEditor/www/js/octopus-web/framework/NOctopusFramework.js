function NOctopusFramework() {
    console.log("NOctopusFramework::constructor> Initializing the Framework.");

    var mSelf = this;

    var mParentDivNode;
    var mMainCanvasObject;
    var mTextCanvasObject;
    var mAppWidth;
    var mAppHeight;

    // Framework variables
    var mGameApplication;
    var mDebugConsole;
    var mDeviceCapabilities;
    
    var mSceneManager;
    var mContentManagment;
    var mCanvasContextManagment;
    var mGraphicDeviceManager;

    var mMainGraphicDevice;
    var mSecondaryGraphicDevice;

    // Static instances
    var mMathInstance;
     
    // For Delta Time process
    var mLastTime = 0;
    var mGameLoopInterval;

    this.GetAppWidth                = function () { return mAppWidth; }
    this.GetAppHeight               = function () { return mAppHeight; }

    this.GameApp                    = function () { return mGameApp; }
    this.GetDocument                = function () { return document; }
    this.GetParentDiv               = function () { return mParentDivNode; }
    this.GetCanvasElement           = function () { return mMainCanvasObject.CanvasElement; }
    this.GetTextCanvasElement       = function () { return mTextCanvasObject.CanvasElement; }
    this.GetGraphicDeviceManager    = function () { return mGraphicDeviceManager; }
    this.GetDeviceCapabilities      = function () { return mDeviceCapabilities; }
    this.GetSceneManager            = function () { return mSceneManager; }
    this.GetContentManagment        = function () { return mContentManagment; }
    this.GetCanvasContextManagment  = function () { return mCanvasContextManagment; }

    this.GetMainGraphicDevice       = function () { return mMainGraphicDevice; }
    this.GetSecondaryGraphicDevice  = function () { return mSecondaryGraphicDevice; }

    // This is global function
    GetOctopusFramework             = function () { return mSelf; }
    // Simulate Static
    NOctopusFramework.Instance      = function () { return GetOctopusFramework(); }
    NOctopusFramework.GetAppWidth   = function () { return mMainCanvasObject.CanvasElement.width; }
    NOctopusFramework.GetAppHeight  = function () { return mMainCanvasObject.CanvasElement.height; }

    this.StartOctopusFramework2D = function (divIdentifier, appWidth, appHeight) {
        mCanvasContextManagment = new NCanvasContextManagment(this);
        
        mAppWidth = appWidth != undefined ? appWidth : NFrameworkSettings.CanvasWidth;
        mAppHeight = appHeight != undefined ? appHeight : NFrameworkSettings.CanvasHeight;
        
        // statics initialization
        mMathInstance = new NMath();

        // Get by Id the Canvas Element.
        mParentDivNode = document.getElementById(divIdentifier);
        
        // Create main canvas element
        mMainCanvasObject = mCanvasContextManagment.CreateCanvasElement(
            NFrameworkSettings.Identifier_RenderCanvas, "absolute",
            "0px", "0px", "0");
        
        // First get the device capabilities.
        mDeviceCapabilities = new NDeviceCapabilities(mSelf);
        mDeviceCapabilities.Initialize(NFrameworkSettings.ForceUseCanvasContextInsteadOfWebGL);

        // Now that we know which canvas/webgl has been created, now set it to the mMainCanvasObject 
        mMainCanvasObject.Context = mDeviceCapabilities.GetGraphicContext();
        // Set proprerties to the Canvas Element
        mMainCanvasObject.CanvasElement.style.backgroundColor = NFrameworkSettings.CanvasBackgroundColor.GetResultColor();
        mMainCanvasObject.CanvasElement.style.borderWidth = NFrameworkSettings.CanvasBorderWidth;
        mMainCanvasObject.CanvasElement.style.borderColor = NFrameworkSettings.CanvasBorderColor.GetResultColor();
        
        // Create the GraphicDevice depending on the capabilities.
        mGraphicDeviceManager = new NGraphicDeviceManager(this);
        // Create Content Pipeline 
        mContentManagment = new NContentManagment(mSelf);

        // Now initialize all
        mGraphicDeviceManager.Initialize();
        mContentManagment.Initialize();

        // Create the Main Graphic Device
        mMainGraphicDevice = mGraphicDeviceManager.CreateGraphicDevice("main",
            mDeviceCapabilities.GetRenderEngineType(), mMainCanvasObject);
        
        // If is WebGL, then create a second Canvas for the text rendering
        if (mDeviceCapabilities.GetRenderEngineType() == NRenderEngineEnum.WebGL) {
            mTextCanvasObject = mCanvasContextManagment.CreateCanvasElementAndContext(
                NFrameworkSettings.Identifier_RenderTextCanvas, NRenderEngineEnum.CanvasContext2D,
                "absolute", "0px", "0px", "10");
            // Set proprerties to the Canvas Element
            mTextCanvasObject.CanvasElement.style.backgroundColor = NFrameworkSettings.CanvasBackgroundColor.GetResultColor();
            mTextCanvasObject.CanvasElement.style.borderWidth = NFrameworkSettings.CanvasBorderWidth;
            mTextCanvasObject.CanvasElement.style.borderColor = NFrameworkSettings.CanvasBorderColor.GetResultColor();

            // Create secondary graphic device for the text
            mSecondaryGraphicDevice = mGraphicDeviceManager.CreateGraphicDevice("textCanvas",
                NRenderEngineEnum.CanvasContext2D, mTextCanvasObject);

            var clearTextCanvasColor = new NColor("1,0,0,0", NRenderEngineEnum.CanvasContext2D);

            mSecondaryGraphicDevice.ClearColor = clearTextCanvasColor;
        }

        document.body.onmousedown = function (e) {
            // Get IE event object
            e = e || window.event;
            // Get target in W3C browsers & IE
            var elementId = e.target ? e.target.id : e.srcElement.id;
            
            OnMouseDown(elementId);
        }

        document.body.onmouseup = function (e) {
            // Get IE event object
            e = e || window.event;
            // Get target in W3C browsers & IE
            var elementId = e.target ? e.target.id : e.srcElement.id;

            OnMouseUp(elementId);
        }

        document.body.onmousemove = function (e) {
            var tempX = 0;
            var tempY = 0;
            var IE = document.all ? true : false

            if (IE) { // grab the x-y pos.s if browser is IE
                tempX = event.clientX + document.body.scrollLeft;
                tempY = event.clientY + document.body.scrollTop;
            }
            else {  // grab the x-y pos.s if browser is NS
                tempX = e.pageX;
                tempY = e.pageY;
            }

            OnMouseMove(tempX, tempY);
        }

        document.body.onkeydown = function (e) {
            OnKeyDown(e);
        }

        document.body.onkeyup = function (e) {
            OnKeyUp(e);
        }

        // Now initialize the Application
        this.InitializeApplication();
        
        // And set the Loop interval
        mGameLoopInterval = setInterval(mSelf.Update, 1000 / NFrameworkSettings.TargetFramerate);
    }

    this.InitializeApplication = function (event) {
        mSceneManager = new NSceneManager(this);

        mDebugConsole = new NDebugConsole();
        mDebugConsole.Initialize();

        console.log("NOctopusFramework> Ready to work!");
    }

    OnKeyDown = function (event) {
        mSceneManager.OnKeyDown(event.keyCode);
    }

    OnKeyUp = function (event) {
        mSceneManager.OnKeyUp(event.keyCode);
    }

    OnMouseDown = function (event) {
        mSceneManager.OnMouseDown(event);
    }

    OnMouseUp = function (event) {
        mSceneManager.OnMouseUp(event);
    }

    OnMouseMove = function (x, y) {
        mSceneManager.OnMouseMove(x, y);
    }

    this.Update = function (deltaTime) {
        var currentTime = new Date().getTime();
        var deltaTime = (currentTime - mLastTime) / 1000;

        mLastTime = currentTime;
        
        var updateArgs = { dt: deltaTime, framework: mSelf };
        
        mGraphicDeviceManager.Update(updateArgs);
        mSceneManager.Update(updateArgs);
        mDebugConsole.Update(updateArgs);
    }

    this.Destroy = function () {
        clearInterval(mGameLoopInterval);
    }
}