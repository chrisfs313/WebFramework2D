function NSprite(x, y) {
    var mSpriteInstance = this;
    var mGraphicDevice = NOctopusFramework.Instance().GetMainGraphicDevice();
    var mRenderEngineType = NOctopusFramework.Instance().GetDeviceCapabilities().GetRenderEngineType();
    
    var mImageContent = undefined;
    var mImage = undefined;
    var mSpriteBatchInstance = undefined;
   
    var mImageRectX = 0;
    var mImageRectY = 0;
    var mImageRectWidth = 0;
    var mImageRectHeight = 0;

    var mQuadTextCoords = undefined;

    this.x = x;
    this.y = y;
    this.scaleX = 1;
    this.scaleY = 1;
    this.rotation = 0;
    this.alpha = 1;

    if (mRenderEngineType == NRenderEngineEnum.WebGL) {
        var mVertices = undefined;
        var mImageTexture = undefined;
        var mTransformationMatrix = undefined;
        var mShader = mGraphicDevice.GetShaderFactory().RetrieveShader("ShaderTexture");

        // Get a VBO for this object
        var mVBOObject = mGraphicDevice.GetDeviceOptimizationManagment().GetVBOPooler().GetAvailableVBO();
        mVBOObject.Activate();
    }
    
    this.primitiveQuad = undefined;

    this.GetWidth           = function () { return mImageRectWidth; }
    this.GetHeight          = function () { return mImageRectHeight; }
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

            mQuadTextCoords = new dtNQuadTextCoords(0, 1, 0, 1,
                mImageRectWidth / 2, mImageRectHeight / 2);
 
            mVertices = [
              mQuadTextCoords.Width, mQuadTextCoords.Height, 0.0, mQuadTextCoords.Right, mQuadTextCoords.Down,
              -mQuadTextCoords.Width, mQuadTextCoords.Height, 0.0, mQuadTextCoords.Left, mQuadTextCoords.Down,
              mQuadTextCoords.Width, -mQuadTextCoords.Height, 0.0, mQuadTextCoords.Right, mQuadTextCoords.Up,
              -mQuadTextCoords.Width, -mQuadTextCoords.Height, 0.0, mQuadTextCoords.Left, mQuadTextCoords.Up
            ];

            if (mRenderEngineType == NRenderEngineEnum.WebGL) {
                // Now we set the vertices interleaved array to the VertexBuffer
                GL.bindBuffer(GL.ARRAY_BUFFER, mVBOObject.VBO);
                GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(mVertices), GL.STATIC_DRAW);
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
        
        // After finished loading created the vertices
        var hw = mImageRectWidth / 2;
        var hh = mImageRectHeight / 2;
        var clipWidth = mImageRectWidth / mImage.width;
        var clipHeight = mImageRectHeight / mImage.height;
        var clipX = mImageRectX / mImage.width;
        var clipY = mImageRectY / mImage.height;
        
        mQuadTextCoords.Width = mImageRectWidth;
        mQuadTextCoords.Height = mImageRectHeight;
        mQuadTextCoords.Left = clipX;
        mQuadTextCoords.Right = clipX + clipWidth;
        mQuadTextCoords.Up = clipY;
        mQuadTextCoords.Down = clipY + clipHeight;

        switch (mRenderEngineType) {
            case NRenderEngineEnum.WebGL:
                // Update current vertex array vertex
                mVertices[0] = hw; mVertices[1] = hh;
                mVertices[5] = -hw; mVertices[6] = hh;
                mVertices[10] = hw; mVertices[11] = -hh;
                mVertices[15] = -hw; mVertices[16] = -hh;
                // Update current vertex array text coords
                mVertices[3] = mQuadTextCoords.Right; mVertices[4] = mQuadTextCoords.Down;
                mVertices[8] = mQuadTextCoords.Left; mVertices[9] = mQuadTextCoords.Down;
                mVertices[13] = mQuadTextCoords.Right; mVertices[14] = mQuadTextCoords.Up;
                mVertices[18] = mQuadTextCoords.Left; mVertices[19] = mQuadTextCoords.Up;

                // Now we set the vertices interleaved array to the VertexBuffer
                GL.bindBuffer(GL.ARRAY_BUFFER, mVBOObject.VBO);
                GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(mVertices), GL.STATIC_DRAW);
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

    // Functions only for WEBGL
    if (mRenderEngineType == NRenderEngineEnum.WebGL) {

        this.SetTransformationMatrix = function (matrix) {
            mTransformationMatrix = matrix;
        }
    }

    this.Update = function (args) {
        switch (mRenderEngineType) {
            case NRenderEngineEnum.CanvasContext2D:
                var graphicContext = mGraphicDevice.GetGraphicContext();

                graphicContext.save();
                graphicContext.globalAlpha = this.alpha;
                graphicContext.translate(this.x, this.y);
                graphicContext.rotate(this.rotation);
                graphicContext.scale(this.scaleX, this.scaleY);
                graphicContext.drawImage(mImage, mImageRectX, mImageRectY, mImageRectWidth, mImageRectHeight,
                    -mImageRectWidth / 2, -mImageRectHeight / 2, mImageRectWidth, mImageRectHeight);
                graphicContext.restore();
                break;
            case NRenderEngineEnum.WebGL:
                if (mImageContent.IsLoaded()) {
                    if (mSpriteBatchInstance != undefined) {
                        mSpriteBatchInstance.DrawGraphic(this);
                    }
                    else {
                        if (mTransformationMatrix == undefined) {
                            mShader.SetTranslate(this.x, this.y, 0);
                            mShader.SetRotation(0, 0, this.rotation);
                            mShader.SetScale(this.scaleX, this.scaleY, 1.0);
                            mShader.Draw(args, mImageTexture, mVBOObject.VBO);
                        }
                        else {
                            mShader.Draw(args, mImageTexture, mVBOObject.VBO,       mTransformationMatrix);
                        } 
                    }
                }
                break;
        }
        
        if (this.primitiveQuad != undefined) {
            this.primitiveQuad.x = this.x;
            this.primitiveQuad.y = this.y;
            this.primitiveQuad.Update(args);
        }
    }

    this.Destroy = function () {
        mImage = undefined;
        mSpriteInstance = undefined;
        mGraphicDevice = undefined;

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