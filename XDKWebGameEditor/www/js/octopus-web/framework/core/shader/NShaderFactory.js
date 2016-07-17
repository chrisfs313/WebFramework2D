function NShaderFactory(graphicDeviceInstance) {

    var mFrameworkInstance = graphicDeviceInstance.GetFramework();
    var mGraphicDeviceInstance = graphicDeviceInstance;
    var mShaderRepository = {};

    this.GetGraphicDevice   = function () { return mGraphicDeviceInstance; }
    this.GetFramework       = function () { return mFrameworkInstance; }

    this.RetrieveShader = function (idShader) {
        return mShaderRepository[idShader];
    }

    this.LoadAll = function () {
        this.AddShader("ShaderPrimitive", new NShaderPrimitive(this, SourcesShaderPrimitive));
        this.AddShader("ShaderTexture", new NShaderTexture(this, SourcesShaderTexture));
    }

    this.AddShader = function (shaderName, shaderObject) {
        mShaderRepository[shaderName] = shaderObject;

        console.log("NShaderFactory(WebGL Only)::AddShader> Loaded shader: " + shaderName);
    }

    this.InstanceShader = function (sourceTarget) {
        var vertex = GLHelper.compileShader(sourceTarget.Vertex, GL.VERTEX_SHADER);
        var fragment = GLHelper.compileShader(sourceTarget.Fragment, GL.FRAGMENT_SHADER);
        
        return GLHelper.createProgram(vertex, fragment);
    }
}