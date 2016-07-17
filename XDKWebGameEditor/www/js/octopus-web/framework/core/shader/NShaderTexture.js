function NShaderTexture(shaderFactory, sourceTarget) {
    var mShaderFactory = shaderFactory;
    var mRenderCamera = shaderFactory.GetGraphicDevice().GetRenderCamera();
    
    var mWorldMatrix = Matrix.I(4);
    var mRotationMatrix = Matrix.I(4);
    var mScaleMatrix = Matrix.I(4);
    var mShaderProgram = mShaderFactory.InstanceShader(sourceTarget);

    // Get Attributes from Shader
    var mVertexPositionAttribute = GL.getAttribLocation(mShaderProgram, "aVertexPosition");
    var mTextureCoordPositionAttribute = GL.getAttribLocation(mShaderProgram, "aTextureCoord");
    var mSamplerPositionUniform = GL.getUniformLocation(mShaderProgram, "uSamplerTexture");

    var mX = 0;
    var mY = 0;
    var mZ = 0;
    var mScaleX = 1;
    var mScaleY = 1;
    var mScaleZ = 1;
    var mRotationX = 0;
    var mRotationY = 0;
    var mRotationZ = 0;
    var mColor = (new NColor("1,1,1,1")).GetResultColor();

    this.SetX = function (value) {
        if (mX != value) {
            mX = value;

            mWorldMatrix = Matrix.Translation($V([mX, mY, mZ]));
        }
    }

    this.SetY = function (value) {
        if (mY != value) {
            mY = value;

            mWorldMatrix = Matrix.Translation($V([mX, mY, mZ]));
        }
    }

    this.SetZ = function (value) {
        if (mZ != value) {
            mZ = value;

            mWorldMatrix = Matrix.Translation($V([mX, mY, mZ]));
        }
    }

    this.SetTranslate = function (x, y, z) {
        mX = x;
        mY = y;
        mZ = z;

        mWorldMatrix = Matrix.Translation($V([mX, mY, mZ]));
    }

    this.SetRotation = function (x, y, z) {
        mRotationX = x;
        mRotationY = y;
        mRotationZ = z;

        mRotationMatrix = Matrix.RotationX(mRotationX).x(
            Matrix.RotationY(mRotationX)).x(
                Matrix.RotationZ(mRotationZ)).ensure4x4();
    }

    this.SetScale = function (x, y, z) {
        mScaleX = x;
        mScaleY = y;
        mScaleZ = z;

        mScaleMatrix = Matrix.Diagonal([mScaleX, mScaleY, mScaleZ, 1.0]);
    }

    this.SetColor = function (value) { mColor = value; }

    this.Draw = function (args, texture, vertexBuffer, transformation) {
        // Enable blending
        GL.enable(GL.BLEND);
        GL.blendFunc(GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA);

        GL.useProgram(mShaderProgram);

        GL.activeTexture(GL.TEXTURE0);
        GL.bindTexture(GL.TEXTURE_2D, texture);
        GL.uniform1i(mSamplerPositionUniform, 0);

        GL.bindBuffer(GL.ARRAY_BUFFER, vertexBuffer);

        GL.enableVertexAttribArray(mVertexPositionAttribute);
        GL.enableVertexAttribArray(mTextureCoordPositionAttribute);
        GL.vertexAttribPointer(mVertexPositionAttribute, 3, GL.FLOAT, false, 20, 0)
        GL.vertexAttribPointer(mTextureCoordPositionAttribute, 2, GL.FLOAT, false, 20, 12)

        // Get Transformation Matrix from RenderCamera
        var transformedMatrix = mRenderCamera.GetTransformedMatrix();

        // Now multiply the Camera transformed Matrix with the local 
        // transformations Matrix.
        if (transformation == undefined) {
            transformedMatrix = transformedMatrix.x(mWorldMatrix);
            transformedMatrix = transformedMatrix.x(mScaleMatrix);
            transformedMatrix = transformedMatrix.x(mRotationMatrix);
        }
        else {
            transformedMatrix = transformedMatrix.x(transformation);
        }

        // Set uniform for WVP Matrix
        var pUniformWVP = GL.getUniformLocation(mShaderProgram, "uWVPMatrix");
        GL.uniformMatrix4fv(pUniformWVP, false, new Float32Array(transformedMatrix.flatten()));
        // Set uniform for Color
        var pUniformColor = GL.getUniformLocation(mShaderProgram, "uColor");
        GL.uniform4f(pUniformColor, mColor.r, mColor.g, mColor.b, mColor.a);

        // Now draw arrays
        GL.drawArrays(GL.TRIANGLE_STRIP, 0, 4);
    }

    this.DrawElements = function (args, texture, indexBuffer, vertexBuffer, indexCount) {
        // Enable blending
        GL.enable(GL.BLEND);
        GL.blendFunc(GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA);

        GL.useProgram(mShaderProgram);

        GL.activeTexture(GL.TEXTURE0);
        GL.bindTexture(GL.TEXTURE_2D, texture);
        GL.uniform1i(mSamplerPositionUniform, 0);

        GL.bindBuffer(GL.ARRAY_BUFFER, vertexBuffer);   
        GL.enableVertexAttribArray(mVertexPositionAttribute);
        GL.enableVertexAttribArray(mTextureCoordPositionAttribute);
        GL.vertexAttribPointer(mVertexPositionAttribute, 3, GL.FLOAT, false, 20, 0)
        GL.vertexAttribPointer(mTextureCoordPositionAttribute, 2, GL.FLOAT, false, 20, 12)

        // Get Transformation Matrix from RenderCamera
        var transformedMatrix = mRenderCamera.GetTransformedMatrix();

        // Now multiply the Camera transformed Matrix with the local 
        // transformations Matrix.
        transformedMatrix = transformedMatrix.x(mWorldMatrix);
        transformedMatrix = transformedMatrix.x(mScaleMatrix);
        transformedMatrix = transformedMatrix.x(mRotationMatrix);

        // Set uniform for WVP Matrix
        var pUniformWVP = GL.getUniformLocation(mShaderProgram, "uWVPMatrix");
        GL.uniformMatrix4fv(pUniformWVP, false, new Float32Array(transformedMatrix.flatten()));
        // Set uniform for Color
        var pUniformColor = GL.getUniformLocation(mShaderProgram, "uColor");
        GL.uniform4f(pUniformColor, mColor.r, mColor.g, mColor.b, mColor.a);
        
        // Now draw arrays
        //GL.drawArrays(GL.TRIANGLE_STRIP, 0, indexCount);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, indexBuffer);
        GL.drawElements(GL.TRIANGLE_STRIP, indexCount, GL.UNSIGNED_SHORT, 0);
    }
}
