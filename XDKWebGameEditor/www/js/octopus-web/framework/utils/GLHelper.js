function GLHelper(graphicContext) {
    // GL is a global variable
    GL = graphicContext;
}

GLHelper.compileShader = function (shaderSource, shaderType) {
    var shaderSourceObject;

    switch (shaderType) {
        case GL.VERTEX_SHADER:
            shaderSourceObject = GL.createShader(GL.VERTEX_SHADER);
            break;
        case GL.FRAGMENT_SHADER:
            shaderSourceObject = GL.createShader(GL.FRAGMENT_SHADER);
            break;
    }

    // Bind the source to a shader object
    GL.shaderSource(shaderSourceObject, shaderSource);
    // Compile the shader program
    GL.compileShader(shaderSourceObject);
    // See if it compiled successfully
    if (!GL.getShaderParameter(shaderSourceObject, GL.COMPILE_STATUS)) {
        console.log("GL::CompileShader> An error occurred compiling the shaders: " +
            GL.getShaderInfoLog(shaderSourceObject));
        return null;
    }

    return shaderSourceObject;
}

GLHelper.createProgram = function (vertexShader, fragmentShader) {
    var shaderProgram = GL.createProgram();

    GL.attachShader(shaderProgram, vertexShader);
    GL.attachShader(shaderProgram, fragmentShader);
    GL.linkProgram(shaderProgram);

    // If creating the shader program failed, alert
    if (!GL.getProgramParameter(shaderProgram, GL.LINK_STATUS)) {
        console.log("GL::CreateProgram> Unable to initialize the shader program: " +
            GL.getProgramInfoLog(shaderProgram));
    }

    return shaderProgram;
}