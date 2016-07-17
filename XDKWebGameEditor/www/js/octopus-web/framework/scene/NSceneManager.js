function NSceneManager(framework) {

    var mFrameworkInstance = framework;
    var mCurrentScene = undefined;

    this.GetCurrentScene    = function () { return mCurrentScene; }
    this.GetFramework       = function () { return mFrameworkInstance; }

    this.GotoScene = function (className, params) {
        if (mCurrentScene != undefined) { mCurrentScene.Destroy(); }
        mCurrentScene = undefined;

        var instance = NCommon.InstanceByClassName(className, params);

        if (instance != undefined) {
            mCurrentScene = instance;
            mCurrentScene.Initialize(this);

            console.log("NSceneManager::GotoScene> Created Scene: " + className + " and Initialized.");
        }
        else {
            console.log("NSceneManager::GotoScene> The " + className + " doesn't exists.");
        }
    }

    this.OnMouseMove = function (x, y) {
        if (mCurrentScene != undefined) { mCurrentScene.OnMouseMove(x, y); }
    }

    this.OnMouseDown = function (event) {
        if (mCurrentScene != undefined) { mCurrentScene.OnMouseDown(event); }
    }

    this.OnMouseUp = function (event) {
        if (mCurrentScene != undefined) { mCurrentScene.OnMouseUp(event); }
    }

    this.OnKeyDown = function (keyCode) {
        if (mCurrentScene != undefined) { mCurrentScene.OnKeyDown(keyCode); }
    }

    this.OnKeyUp = function (keyCode) {
        if (mCurrentScene != undefined) { mCurrentScene.OnKeyUp(keyCode); }
    }

    this.Update = function(args) {
        if (mCurrentScene != null) {
            mCurrentScene.Update(args);
        }
    }
}