function NBaseContent(contentManagment) {
    var mContentManagment = contentManagment;
    var mFrameworkInstance = mContentManagment.GetFramework();
    var mPath = undefined;

    this.GetPath                = function () { return mPath; }
    this.GetFramework           = function () { return mFrameworkInstance; }
    this.GetContentManagment    = function () { return mContentManagment; }

    NBaseContent.prototype.Initialize = function () {
        
    }

    NBaseContent.prototype.Load = function (path) {
        mPath = path;
    }

    NBaseContent.prototype.Unload = function () {

    }
}