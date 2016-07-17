function NShaderPrimitive(shaderFactory, sourceTarget) {
    var mShaderFactory = shaderFactory;
    var mRenderCamera = shaderFactory.GetGraphicDevice().GetRenderCamera();

    var mWorldMatrix = Matrix.I(4);
    var mRotationMatrix = Matrix.I(4);
    var mScaleMatrix = Matrix.I(4);
    var mShaderProgram = mShaderFactory.InstanceShader(sourceTarget);

    // Get Attributes from Shader
    var mVertexPositionAttribute = GL.getAttribLocation(mShaderProgram, "aVertexPosition");

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

    this.Draw = function (args, vertexBuffer, indexBuffer, renderType, count) {
        // Enable blending
        GL.enable(GL.BLEND);
        GL.blendFunc(GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA);

        GL.useProgram(mShaderProgram);

        GL.bindBuffer(GL.ARRAY_BUFFER, vertexBuffer);
        
        GL.enableVertexAttribArray(mVertexPositionAttribute);
        GL.vertexAttribPointer(mVertexPositionAttribute, 3, GL.FLOAT, false, 0, 0)
        
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
        renderType = renderType == undefined ? GL.TRIANGLE_STRIP : renderType
        
        if (indexBuffer != undefined) {
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, indexBuffer);
            GL.drawElements(renderType, count, GL.UNSIGNED_SHORT, 0);
        }
        else {
            GL.drawArrays(renderType, 0, count);
        }
       
    }
}
