function NColor(color, renderEngineType) {
    var mColor = color.split(",");

    var mRed = mColor[0];
    var mGreen = mColor[1];
    var mBlue = mColor[2];
    var mAlpha = mColor[3];
    var mResult = undefined;
    var mRenderEngineType = renderEngineType;
    
    this.GetRed     = function () { return mRed; }
    this.GetGreen   = function () { return mGreen; }
    this.GetBlue    = function () { return mBlue; }
    this.GetAlpha = function () { return mAlpha; }

    this.GetResult = function () {
        if (mResult == undefined) {
            this.GetResultColor();
        }

        return mResult;
    }

    this.GetResultColor = function () {
        if (mRenderEngineType == undefined) {
            var deviceCapabilities = NOctopusFramework.Instance().GetDeviceCapabilities();
            mRenderEngineType = deviceCapabilities.GetRenderEngineType();
        }
        
        if (mResult == undefined) {
            switch (mRenderEngineType) {
                case NRenderEngineEnum.CanvasContext2D:
                    mResult = "rgba(" + (mRed * 255) + "," + (mGreen * 255) + "," + (mBlue * 255) + "," + (mAlpha * 255) + ")";
                    break;
                case NRenderEngineEnum.WebGL:
                    mResult = new Object();
                    mResult.r = mRed;
                    mResult.g = mGreen;
                    mResult.b = mBlue;
                    mResult.a = mAlpha;
                    break;
            }
        }

        return mResult;
    }
}