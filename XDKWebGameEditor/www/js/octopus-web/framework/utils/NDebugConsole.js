function NDebugConsole() {

    var mDebugText;

    this.Initialize = function () {
        mDebugText = new NTextfield2D(NFrameworkSettings.CanvasWidth +
            NFrameworkSettings.DebugConsoleTextOffsetX,
            NFrameworkSettings.DebugConsoleTextOffsetY);
        mDebugText.fontSize = NFrameworkSettings.DebugConsoleTextSize;
        mDebugText.fontColor = NFrameworkSettings.DebugConsoleTextColor;
        mDebugText.fontWeight = NFrameworkSettings.DebugConsoleTextWeight;
    }

    this.Update = function (args) {
        var debugTextRaw = "";
        debugTextRaw += "Frame Rate: " + (1.0 / args.dt).toFixed(2) + "\n";
        debugTextRaw += "Delta Time: " + args.dt;

        mDebugText.text = debugTextRaw;
        mDebugText.Update(args);
    }
}