function NPrimitiveQuad(x, y, width, height, color) {
    var mGraphicDevice = NOctopusFramework.Instance().GetMainGraphicDevice();
    var mRenderEngineType = NOctopusFramework.Instance().GetDeviceCapabilities().GetRenderEngineType();

    this.x = x;
    this.y = y;
    this.offsetX = 0;
    this.offsetY = 0;

    this.width = width;
    this.height = height;

    var mColor = color.GetResultColor();
     
    var mRenderType;
     
    this.SetWireframeVisibility = function(value) {
        var indices = undefined;
        
        if (value) {
            mDrawingCount = 8;
            mRenderType = GL.LINES;
            
            indices = [0, 1, 1, 3, 3, 2, 2, 0];
        }
        else {
            mDrawingCount = 4;
            mRenderType = GL.TRIANGLE_STRIP;
            
            indices = [0, 1, 2, 3];
        }
        
        // Now we set the indices array to the IndexBuffer
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, mIBOObject.VBO);
        GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), GL.STATIC_DRAW);
    }

    switch (mRenderEngineType) {
        case NRenderEngineEnum.CanvasContext2D:
            var mAlpha = color.GetAlpha();
            break;
        case NRenderEngineEnum.WebGL:
            // Drawing count
            var mDrawingCount = 4;
            // Now set render type
            mRenderType = GL.TRIANGLE_STRIP;
            
            var mShader = mGraphicDevice.GetShaderFactory().RetrieveShader("ShaderPrimitive");
            
            // Get a VBO for this object
            var mVBOObject = mGraphicDevice.GetDeviceOptimizationManagment().GetVBOPooler().GetAvailableVBO();
            mVBOObject.Activate();
            
            // Get a IBO for this object
            var mIBOObject = mGraphicDevice.GetDeviceOptimizationManagment().GetVBOPooler().GetAvailableVBO();
            mIBOObject.Activate();
            
            var hw = this.width / 2;
            var hh = this.height / 2;

            var vertices = [
              hw, hh, 0.0,
              -hw, hh, 0.0,
              hw, -hh, 0.0,
              -hw, -hh, 0.0
            ];
            
            var indices = [
                0, 1, 2, 3
            ];

            // Now we set the vertices array to the VertexBuffer
            GL.bindBuffer(GL.ARRAY_BUFFER, mVBOObject.VBO);
            GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(vertices), GL.STATIC_DRAW);
            
            // Now we set the indices array to the IndexBuffer
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, mIBOObject.VBO);
            GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), GL.STATIC_DRAW);
            break;
    }

    this.SetColor = function (value) {
        mAlpha = value.GetAlpha();
        mColor = value.GetResultColor();
    }
    
    this.HitTest = function (otherQuad) {
        var thisX = this.x + this.offsetX;
        var thisY = this.y + this.offsetY;
        var otherX = otherQuad.x + otherQuad.offsetX;
        var otherY = otherQuad.y + otherQuad.offsetY;

        return thisX < otherX + otherQuad.width && thisX + this.width > otherX &&
            thisY < otherY + otherQuad.height && this.height + thisY > otherY;
    }

    this.Update = function (args) {
        if (mColor.a != 0) {
            switch (mRenderEngineType) {
                case NRenderEngineEnum.CanvasContext2D:
                    var graphicContext = mGraphicDevice.GetGraphicContext();

                    graphicContext.save();
                    graphicContext.globalAlpha = mAlpha;
                    graphicContext.fillStyle = mColor;
                    graphicContext.fillRect(this.x + this.offsetX, this.y + this.offsetY, this.width, this.height);
                    graphicContext.restore();
                    break;
                case NRenderEngineEnum.WebGL:
                    mShader.SetTranslate(this.x, this.y, 0);
                    mShader.SetColor(mColor);
                    mShader.Draw(args, mVBOObject.VBO, mIBOObject.VBO, 
                        mRenderType, mDrawingCount);
                    break;
            }
        }

        
    }

    this.Destroy = function () {
        mColor = undefined;
        mGraphicDevice = undefined;

        switch (mRenderEngineType) {
            case NRenderEngineEnum.WebGL:
                mVBOObject.Deactivate();
                mVBOObject = undefined;
                break;
        }
    }
}