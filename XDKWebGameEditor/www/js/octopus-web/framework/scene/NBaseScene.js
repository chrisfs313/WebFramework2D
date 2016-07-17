function NBaseScene(params) {

    var mSceneManager;
    var mFramework;
    var mContentManagment;

    this.GetFramework           = function () { return mFramework; }
    this.GetContentManagment    = function () { return mContentManagment; }

    NBaseScene.prototype.Initialize = function (sceneManager) {
        mSceneManager = sceneManager;
        mFramework = mSceneManager.GetFramework();
        mContentManagment = mFramework.GetContentManagment();
    }

    NBaseScene.prototype.OnMouseMove = function (x, y) {

    }

    NBaseScene.prototype.OnMouseDown = function (event) {

    }

    NBaseScene.prototype.OnMouseUp = function (event) {

    }

    NBaseScene.prototype.OnKeyDown = function (keyCode) {

    }

    NBaseScene.prototype.OnKeyUp = function (keyCode) {

    }

    NBaseScene.prototype.Update = function (args) {

    }
}