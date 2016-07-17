function NVBOPooler(graphicDevice) {
    var INTERNAL_ENUMS = {
        InitialVBOCount: 16,
        ResizeAddVBOCount: 8
    };

    var mGraphicDeviceInstance = graphicDevice;
    var mVBORepository = [];

    this.Initialize = function () {
        this.CreateVBOs(INTERNAL_ENUMS.InitialVBOCount);
    }

    this.CreateVBOs = function (count) {
        for (var i = 0; i < count; i++) {
            var vboObject = new NVBOObject(this);
            vboObject.Initialize();

            mVBORepository.push(vboObject);
        }
    }

    this.GetAvailableVBO = function () {
        var resultObject = undefined;
        var count = mVBORepository.length;

        for (var i = 0; i < count; i++) {
            var vboObject = mVBORepository[i];

            if (vboObject.IsAvailable) {
                resultObject = vboObject;
                break;
            }
        }

        // If no VBO available is found then create more...
        if (resultObject == undefined) {
            this.CreateVBOs(INTERNAL_ENUMS.ResizeAddVBOCount);
            // Now call recursively the function until found an available VBO
            resultObject = this.GetAvailableVBO();
        }

        return resultObject;
    }

    this.Update = function (args) {
        var count = mVBORepository.length;

        for (var i = 0; i < count; i++) {
            var vboObject = mVBORepository[i];

            if (vboObject.IsWaitingForDelete) {
                vboObject.Destroy();
                vboObject = undefined;
                // remove it from the array
                mVBORepository.splice(i, 1);
                i--;
                count--;
            }
            else {
                vboObject.Update(args);
            }
        }
    }

    this.Destroy = function () {

    }
}