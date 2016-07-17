function NSpriteBatcher(spritePath) {
    var mGraphicDevice = NOctopusFramework.Instance().GetMainGraphicDevice();
    var mRenderEngineType = NOctopusFramework.Instance().GetDeviceCapabilities().GetRenderEngineType();
    
    var mImageContent = NOctopusFramework.Instance().GetContentManagment().GetImage(spritePath);
    var mImage = mImageContent.GetImage();
    var mVertexCount = 0;
    var mIndexCount = 0;

    var mArrayBufferGPUVertex;
    var mArrayBufferGPUIndex;

    switch (mRenderEngineType) {
        case NRenderEngineEnum.WebGL:

            var mImageTexture = mImageContent.GetImageTexture();
            var mShader = mGraphicDevice.GetShaderFactory().RetrieveShader("ShaderTexture");

            // Get a VBO for this object
            var mVBOObject = mGraphicDevice.GetDeviceOptimizationManagment().GetVBOPooler().GetAvailableVBO();
            mVBOObject.Activate();
            // Get a IBO for this object
            var mIBOObject = mGraphicDevice.GetDeviceOptimizationManagment().GetVBOPooler().GetAvailableVBO();
            mIBOObject.Activate();

            var mVertices = [];
            var mIndices = [];
            break;
    }

    this.BeginDraw = function () {
        mVertices = [];
        mIndices = [];
        mVertexCount = 0;
        mIndexCount = 0;
    }

    this.DrawGraphic = function (graphic) {
        var qTC = graphic.GetQuadTextCoords();
        var vx = graphic.x;
        var vy = graphic.y;
        var hw = (qTC.Width / 2) * graphic.scaleX;
        var hh = (qTC.Height / 2) * graphic.scaleY;
        
        if (graphic.rotation != 0) {
            var cosAngle = Math.cos(graphic.rotation);
            var sinAngle = Math.sin(graphic.rotation);

            var x_0 = vx + hw;
            var x_1 = vx - hw;
            var x_2 = vx + hw;
            var x_3 = vx - hw;
            
            var y_0 = vy + hh;
            var y_1 = vy + hh;
            var y_2 = vy - hh;
            var y_3 = vy - hh;

            var centerX = (x_0 + x_1 + x_2 + x_3) * 0.25;
            var centerY = (y_0 + y_1 + y_2 + y_3) * 0.25;

            x_0 -= centerX;
            x_1 -= centerX;
            x_2 -= centerX;
            x_3 -= centerX;

            y_0 -= centerY;
            y_1 -= centerY;
            y_2 -= centerY;
            y_3 -= centerY;

            var _x_0 = x_0;
            var _x_1 = x_1;
            var _x_2 = x_2;
            var _x_3 = x_3;
            
            var _y_0 = y_0;
            var _y_1 = y_1;
            var _y_2 = y_2;
            var _y_3 = y_3;

            x_0 = (cosAngle * _x_0 - sinAngle * _y_0);
            y_0 = (sinAngle * _x_0 + cosAngle * _y_0);

            x_1 = (cosAngle * _x_1 - sinAngle * _y_1);
            y_1 = (sinAngle * _x_1 + cosAngle * _y_1);

            x_2 = (cosAngle * _x_2 - sinAngle * _y_2);
            y_2 = (sinAngle * _x_2 + cosAngle * _y_2);

            x_3 = (cosAngle * _x_3 - sinAngle * _y_3);
            y_3 = (sinAngle * _x_3 + cosAngle * _y_3);

            x_0 += centerX;
            x_1 += centerX;
            x_2 += centerX;
            x_3 += centerX;

            y_0 += centerY;
            y_1 += centerY;
            y_2 += centerY;
            y_3 += centerY;

            mVertices.push(
                x_0, y_0, 0.0, qTC.Right, qTC.Down,
                x_1, y_1, 0.0, qTC.Left, qTC.Down,
                x_2, y_2, 0.0, qTC.Right, qTC.Up,
                x_3, y_3, 0.0, qTC.Left, qTC.Up);
        }
        else {
            mVertices.push(
                vx + hw, vy + hh, 0.0, qTC.Right, qTC.Down,
                vx - hw, vy + hh, 0.0, qTC.Left, qTC.Down,
                vx + hw, vy - hh, 0.0, qTC.Right, qTC.Up,
                vx - hw, vy - hh, 0.0, qTC.Left, qTC.Up);
        }

        // Degenerate indices
        
        if (mVertexCount != 0) {
            mIndices.push(mVertexCount -1, mVertexCount, mVertexCount, mVertexCount + 1, mVertexCount + 2, mVertexCount + 3);
        }
        else {
            mIndices.push(mVertexCount, mVertexCount + 1, mVertexCount + 2, mVertexCount + 3);
        }

        mVertexCount += 4;
        mIndexCount = mIndices.length;
    }

    this.EndDraw = function () {
        if (mVertexCount != 0) {
            if (mArrayBufferGPUVertex != null) { mArrayBufferGPUVertex = null; }
            if (mArrayBufferGPUIndex != null) { mArrayBufferGPUIndex = null; }

            mArrayBufferGPUVertex = new Float32Array(mVertices);
            mArrayBufferGPUIndex = new Uint16Array(mIndices);
            
            // Now we set the vertices interleaved array to the VertexBuffer
            GL.bindBuffer(GL.ARRAY_BUFFER, mVBOObject.VBO);
            GL.bufferData(GL.ARRAY_BUFFER, mArrayBufferGPUVertex, GL.DYNAMIC_DRAW);
            // Now we set the indices array to the IndexBuffer
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, mIBOObject.VBO);
            GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, mArrayBufferGPUIndex, GL.STATIC_DRAW);
        }
    }

    this.Update = function (args) {
        switch (mRenderEngineType) {
            case NRenderEngineEnum.WebGL:
                if (mImageContent.IsLoaded() && mVertexCount != 0) {
                    mShader.SetTranslate(0, 0, 0);
                    mShader.SetRotation(0, 0, 0);
                    mShader.SetScale(1, 1, 1);
                    mShader.DrawElements(args, mImageTexture, mIBOObject.VBO, mVBOObject.VBO, mIndexCount);
                }
                break;
        }
    }

    this.Destroy = function () {
        if (mArrayBufferGPUVertex != null) { mArrayBufferGPUVertex = null; }
        if (mArrayBufferGPUIndex != null) { mArrayBufferGPUIndex = null; }

        mImage = undefined;
        mGraphicDevice = undefined;

        switch (mRenderEngineType) {
        case NRenderEngineEnum.WebGL:
            mVBOObject.Deactivate();
            mVBOObject = undefined;
            break;
        }
    }
}