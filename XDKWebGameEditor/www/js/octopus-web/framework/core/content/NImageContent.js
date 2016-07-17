function NImageContent(contentManagment) {
    // calling base.constructor
    NBaseContent.call(this, contentManagment);

    var mIsLoaded = false;

    var mImage;
    var mImageTexture = undefined;

    this.GetImage           = function () { return mImage; }
    this.GetImageWidth      = function () { return mImage.width; }
    this.GetImageHeight     = function () { return mImage.height; }
    this.GetImageTexture    = function () { return mImageTexture; }

    this.IsLoaded = function () { return mIsLoaded; }

    this.Initialize = function () {
        NBaseContent.prototype.Initialize();
    }

    this.Load = function (path) {
        NBaseContent.prototype.Load(path);
        
        mImage = new Image();
        //mImage.crossOrigin = "Anonymous";
        //mImage.crossOrigin = "use-credentials";

        switch (this.GetFramework().GetDeviceCapabilities().GetRenderEngineType()) {
            case NRenderEngineEnum.WebGL:
                mImageTexture = GL.createTexture();

                // Extends the OnLoad image event for WebGL support
                mImage.onload = function () {
                    GL.bindTexture(GL.TEXTURE_2D, mImageTexture);
                    GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, mImage);
                    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
                    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);
                    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
                    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);

                    // For mipmapping (BETTER PERFORMANCE IN 3D ENVIOREMENT)
                    //GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR_MIPMAP_NEAREST);
                    //GL.generateMipmap(GL.TEXTURE_2D);

                    GL.bindTexture(GL.TEXTURE_2D, null);

                    mIsLoaded = true;
                }
                break;
        }

        // Finally then set it's path to the Image to load
        mImage.src = path;
    }

    this.Unload = function () {
        NBaseContent.prototype.Unload();
    }
}