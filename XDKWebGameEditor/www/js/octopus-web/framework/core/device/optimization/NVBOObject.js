function NVBOObject(vboPooler) {
    var INTERNAL_ENUMS = {
        Lifetime : 4500
    };

    var mVBOPoolerInstance = vboPooler;
    var mLifeTime = INTERNAL_ENUMS.Lifetime / 1000.0;

    this.VBO;
    this.IsAvailable;
    this.IsWaitingForDelete = false;
    
    this.Initialize = function () {
        this.IsAvailable = true;

        // Create a Vertex Buffer for this object
        this.VBO = GL.createBuffer();
    }

    this.Activate = function () {
        this.IsAvailable = false;
    }

    this.Deactivate = function () {
        this.IsAvailable = true;
        // Reset Lifetime
        mLifeTime = INTERNAL_ENUMS.Lifetime / 1000.0;
    }

    this.Update = function (args) {
        if (this.IsAvailable) {
            mLifeTime -= args.dt;
            
            if (mLifeTime <= 0) {
                this.IsWaitingForDelete = true;
            }
        }
    }

    this.Destroy = function () {
        mVBOPoolerInstance = undefined;
        
        GL.deleteBuffer(this.VBO);
    }
}