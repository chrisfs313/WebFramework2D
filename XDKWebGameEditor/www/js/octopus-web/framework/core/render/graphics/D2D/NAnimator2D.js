function NAnimator2D(x, y, horizontalTiles, verticalTiles) {
    var mSpriteInstance = this;
    var mGraphicDevice = NOctopusFramework.Instance().GetMainGraphicDevice();
    var mRenderEngineType = NOctopusFramework.Instance().GetDeviceCapabilities().GetRenderEngineType();

    var mImageContent = undefined;
    var mImage = undefined;
    var mSpriteBatchInstance = undefined;

    this.x = x;
    this.y = y;
    this.scaleX = 1;
    this.scaleY = 1;
    this.rotation = 0;
    this.alpha = 1;

    var horizontalTiles = horizontalTiles;
    var verticalTiles = verticalTiles;

    var mEndedAnimation = false;

    var mImageRectX = 0;
    var mImageRectY = 0;
    var mImageRectWidth = 0;
    var mImageRectHeight = 0;
    var currentFrameHorizontal = 0;
    var currentFrameVertical = 0;
    var totalFrames = horizontalTiles * verticalTiles;

    var mQuadTextCoords = undefined;
    
    switch (mRenderEngineType) {
        case NRenderEngineEnum.WebGL:
            var mVertices = undefined;
            var mImageTexture = undefined;
            var mShader = mGraphicDevice.GetShaderFactory().RetrieveShader("ShaderTexture");

            // Get a VBO for this object
            var mVBOObject = mGraphicDevice.GetDeviceOptimizationManagment().GetVBOPooler().GetAvailableVBO();
            mVBOObject.Activate();
            break;
    }

    this.primitiveQuad = undefined;

    this.GetEndedAnimation  = function () { return mEndedAnimation; }
    this.GetWidth           = function () { return (mImageRectWidth / horizontalTiles); }
    this.GetHeight          = function () { return (mImageRectHeight / verticalTiles); }
    this.GetQuadTextCoords  = function () { return mQuadTextCoords; }

    this.SetImageContent = function (imageContent) {
        mImageContent = imageContent;
        mImage = mImageContent.GetImage();

        if (mRenderEngineType == NRenderEngineEnum.WebGL) {
            mImageTexture = mImageContent.GetImageTexture();
        }

        if (mQuadTextCoords == undefined) {
            mImageRectWidth = mImage.width;
            mImageRectHeight = mImage.height;

            mQuadTextCoords = new dtNQuadTextCoords(0, 0, 0, 0,
                (mImageRectWidth / horizontalTiles) / 2, 
                (mImageRectHeight / verticalTiles) / 2);      

            if (mRenderEngineType == NRenderEngineEnum.WebGL) {
                // After finished loading created the vertices
                var hw = (mImageRectWidth / horizontalTiles) / 2;
                var hh = (mImageRectHeight / verticalTiles) / 2;

                mVertices = new Float32Array(20);
                mVertices[0] = hw; mVertices[1] = hh; mVertices[2] = 0; mVertices[3] = 1; mVertices[4] = 1;
                mVertices[5] = -hw; mVertices[6] = hh; mVertices[7] = 0; mVertices[8] = 0; mVertices[9] = 1;
                mVertices[10] = hw; mVertices[11] = -hh; mVertices[12] = 0; mVertices[13] = 1; mVertices[14] = 0;
                mVertices[15] = -hw; mVertices[16] = -hh; mVertices[17] = 0; mVertices[18] = 0; mVertices[19] = 0;

                // Now we set the vertices interleaved array to the VertexBuffer
                GL.bindBuffer(GL.ARRAY_BUFFER, mVBOObject.VBO);
                // This time the BufferData is set as DYNAMIC_DRAW, this is
                // because our vertex array will change often.
                GL.bufferData(GL.ARRAY_BUFFER, mVertices, GL.DYNAMIC_DRAW);
            }
        }
    }

    this.SetSpriteBatch = function (spriteBatch) {
        mSpriteBatchInstance = spriteBatch;
    }

    this.SetAdvanceAnimationTileConfig = function (imageRectX, imageRectY, imageRectWidth, imageRectHeight) {
        mImageRectX = imageRectX;
        mImageRectY = imageRectY;
        mImageRectWidth = imageRectWidth;
        mImageRectHeight = imageRectHeight;

        currentFrameHorizontal = 0;
        currentFrameVertical = 0;
        totalFrames = horizontalTiles * verticalTiles;

        // After finished loading created the vertices
        var hw = (mImageRectWidth / horizontalTiles) / 2;
        var hh = (mImageRectHeight / verticalTiles) / 2;

        // Update quad data
        mQuadTextCoords.Width = (mImageRectWidth / horizontalTiles);
        mQuadTextCoords.Height = (mImageRectHeight / verticalTiles);

        switch (mRenderEngineType) {
            case NRenderEngineEnum.WebGL:
                // Update current vertex array text coords
                mVertices[0] = hw; mVertices[1] = hh;
                mVertices[5] = -hw; mVertices[6] = hh;
                mVertices[10] = hw; mVertices[11] = -hh;
                mVertices[15] = -hw; mVertices[16] = -hh;
                break;
        }
    }

    this.CreateCollision = function (x, y, width, height, color) {
        this.primitiveQuad = new NPrimitiveQuad(x, y, width, height, color);
        return this.primitiveQuad;
    }

    this.HitTest = function (otherObject) {
        if (otherObject.primitiveQuad == undefined || this.primitiveQuad == undefined) {
            return false;
        }

        return this.primitiveQuad.HitTest(otherObject.primitiveQuad);
    }

    this.Update = function (args) {
        mEndedAnimation = false;
        
        var clipWidth = (mImageRectWidth / horizontalTiles) / mImage.width;
        var clipHeight = (mImageRectHeight / verticalTiles) / mImage.height;
        var clipX = (mImageRectX / mImage.width) + (Math.floor(currentFrameHorizontal) * clipWidth);
        var clipY = (mImageRectY / mImage.height) + (Math.floor(currentFrameVertical) * clipHeight);
        
        switch (mRenderEngineType) {
            case NRenderEngineEnum.CanvasContext2D:
                var graphicContext = mGraphicDevice.GetGraphicContext();

                graphicContext.save();
                graphicContext.globalAlpha = this.alpha;
                graphicContext.translate(this.x, this.y);
                graphicContext.rotate(this.rotation);
                graphicContext.scale(this.scaleX, this.scaleY);

                clipWidth *= mImage.width;
                clipHeight *= mImage.height;
                clipX *= mImage.width;
                clipY *= mImage.height;

                graphicContext.drawImage(mImage, clipX, clipY, clipWidth, clipHeight,
                    -clipWidth / 2, -clipHeight / 2, clipWidth, clipHeight);
                graphicContext.restore();
                break;
            case NRenderEngineEnum.WebGL:
                if (mImageContent.IsLoaded()) {
                    mQuadTextCoords.Left = clipX;
                    mQuadTextCoords.Right = clipX + clipWidth;
                    mQuadTextCoords.Up = clipY;
                    mQuadTextCoords.Down = clipY + clipHeight;

                    if (mSpriteBatchInstance != undefined) {
                        mSpriteBatchInstance.DrawGraphic(this);
                    }
                    else {
                        // Update current vertex array text coords
                        mVertices[3] = mQuadTextCoords.Right; mVertices[4] = mQuadTextCoords.Down;
                        mVertices[8] = mQuadTextCoords.Left; mVertices[9] = mQuadTextCoords.Down;
                        mVertices[13] = mQuadTextCoords.Right; mVertices[14] = mQuadTextCoords.Up;
                        mVertices[18] = mQuadTextCoords.Left; mVertices[19] = mQuadTextCoords.Up;

                        // Now we set the vertices interleaved array to the VertexBuffer
                        GL.bindBuffer(GL.ARRAY_BUFFER, mVBOObject.VBO);
                        GL.bufferSubData(GL.ARRAY_BUFFER, 0, mVertices);

                        mShader.SetTranslate(this.x, this.y, 0);
                        mShader.SetRotation(0, 0, this.rotation);
                        mShader.SetScale(this.scaleX, this.scaleY, 1.0);
                        mShader.Draw(args, mImageTexture, mVBOObject.VBO);
                    } 
                }
                break;
        }
       
        if (this.primitiveQuad != undefined) {
            this.primitiveQuad.x = this.x;
            this.primitiveQuad.y = this.y;
            this.primitiveQuad.Update(args);
        }

        // counting frames per update and by the framerate of the app and the animation
        var animationFramerate = NFrameworkSettings.AnimationFramerate;
        var targetFramerate = NFrameworkSettings.TargetFramerate;
        // Now add the division of the framerates to the currentFrameHorizontal
        currentFrameHorizontal += animationFramerate / targetFramerate;
        
        if (currentFrameHorizontal >= horizontalTiles) {
            currentFrameHorizontal = 0;
            currentFrameVertical++;

            if (currentFrameVertical >= verticalTiles) {
                currentFrameVertical = 0;
                mEndedAnimation = true;
            }
        }
    }

    this.Destroy = function () {
        mImage = undefined;
        mSpriteInstance = undefined;
        mGraphicDevice = undefined;
        mVertices = undefined;

        if (this.primitiveQuad != undefined) {
            this.primitiveQuad.Destroy();
            this.primitiveQuad = undefined;
        }

        switch (mRenderEngineType) {
            case NRenderEngineEnum.WebGL:
                mVBOObject.Deactivate();
                mVBOObject = undefined;
                break;
        }
    }
}