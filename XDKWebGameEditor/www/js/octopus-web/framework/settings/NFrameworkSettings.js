var NFrameworkSettings = {
    AnimationFramerate: 30,
    TargetFramerate: 60,

    // Configuration: Canvas
    ForceUseCanvasContextInsteadOfWebGL: false,
    CanvasContextType: "2d",
    CanvasWidth: 640,
    CanvasHeight: 320,
    CanvasBackgroundColor: new NColor("0,0,0,1"),
    CanvasBorderWidth: "1px",
    CanvasBorderColor: new NColor("0,0,0,1"),

    // Configuration: Debug Console
    DebugConsoleTextColor: new NColor("0,1,0,1"),
    DebugConsoleTextWeight: "bold",
    DebugConsoleTextSize: 8,
    DebugConsoleTextOffsetX: -90,
    DebugConsoleTextOffsetY: 0,

    // Configuration: Render
    RenderClearColor: new NColor("0,0,0,1"),

    // Id's
    Identifier_RenderCanvas: "renderCanvas",
    Identifier_RenderTextCanvas: "renderTextCanvas",

    //Message
    Message_CanvasHTML5Warning: "Your browser don't support HTML5 Canvas Element.",
};