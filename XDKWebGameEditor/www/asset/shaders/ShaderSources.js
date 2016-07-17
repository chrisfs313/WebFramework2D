var SourcesShaderPrimitive = {
    Vertex: 
        "attribute vec3 aVertexPosition;" +

        "uniform mat4 uWVPMatrix;" +
        "uniform vec4 uColor;" +

        "varying mediump vec4 varyingColor;" +
  
        "void main(void) {" +
            "varyingColor = uColor;" +
            "gl_Position = uWVPMatrix * vec4(aVertexPosition, 1.0);" +
        "}",

    Fragment:
        "varying mediump vec4 varyingColor;" +

        "void main(void) {" +
        "    gl_FragColor = varyingColor;" +
        "}"
};

var SourcesShaderTexture = {
    Vertex:
        "attribute vec3 aVertexPosition;" +
        "attribute vec2 aTextureCoord;" +

        "uniform mat4 uWVPMatrix;" +
        "uniform vec4 uColor;" +

        "varying mediump vec4 varyingColor;" +
        "varying highp vec2 varyingTextureCoord;" +

        "void main(void) {" +
            "varyingColor = uColor;" +
            "varyingTextureCoord = aTextureCoord;" +
            "gl_Position = uWVPMatrix * vec4(aVertexPosition, 1.0);" +
        "}",

    Fragment:
        "varying mediump vec4 varyingColor;" +
        "varying highp vec2 varyingTextureCoord;" +

        "uniform sampler2D uSamplerTexture;" +

        "void main(void) {" +
        "    gl_FragColor = texture2D(uSamplerTexture, vec2(varyingTextureCoord.s, varyingTextureCoord.t)) * varyingColor;" +
        "}"
};