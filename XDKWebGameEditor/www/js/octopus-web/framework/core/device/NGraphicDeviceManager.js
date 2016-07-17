function NGraphicDeviceManager(frameworkInstance) {

    var mFrameworkInstance = frameworkInstance;
    var mGraphicDevices = [];

    this.Initialize = function () {

    }

    this.CreateGraphicDevice = function (id, renderEngineType, canvasObject) {
        var graphicDevice = new NGraphicDevice(mFrameworkInstance);
        graphicDevice.Initialize(canvasObject, renderEngineType);

        mGraphicDevices[id] = graphicDevice;

        console.log("NGraphicDeviceManager::CreateGraphicDevice> The graphic device: " + id + " was created.");
        
        return graphicDevice;
    }

    this.Update = function (args) {
        for (var key in mGraphicDevices) {
            mGraphicDevices[key].Update(args);
        }
    }
}