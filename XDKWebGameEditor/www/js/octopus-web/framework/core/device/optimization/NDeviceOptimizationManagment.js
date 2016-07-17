function NDeviceOptimizationManagment(graphicDevice) {
    var mGraphicDeviceInstance = graphicDevice;

    var mVBOPooler;

    this.GetVBOPooler = function () { return mVBOPooler; }

    this.Initialize = function () {
        mVBOPooler = new NVBOPooler(this);
        mVBOPooler.Initialize();
    }

    this.Update = function (args) {
        mVBOPooler.Update(args);
    }
}