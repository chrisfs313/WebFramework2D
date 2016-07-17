function NTextfield2D(x, y, text) {
    this.x = x;
    this.y = y;
    this.rotation = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.text = text;
    this.fontSize = 12;
    this.font = "Arial";
    this.fontWeight = "normal";
    this.textAlign = "center";
    this.alpha = 1;
    
    this.fontColor = new NColor("1,1,1,1");

    var mGraphicDevice;
    var mGraphicContext;

    this.WrapText = function(context, text, maxWidth, lineHeight) {
        var internalY = 0;
        var cars = text.split("\n");

        for (var i = 0; i < cars.length; i++) {

            var line = "";
            var words = cars[i].split(" ");

            for (var n = 0; n < words.length; n++) {
                var testLine = line + words[n] + " ";
                var metrics = context.measureText(testLine);
                var testWidth = metrics.width;

                if (testWidth > maxWidth) {
                    context.fillText(line, 0, this.fontSize + internalY);
                    line = words[n] + " ";
                    internalY += lineHeight;
                }
                else {
                    line = testLine;
                }
            }

            context.fillText(line, 0, this.fontSize + internalY);
            internalY += lineHeight;
        }
    }

    this.Update = function (args) {
        if (mGraphicDevice == undefined) {
            if (args.framework.GetSecondaryGraphicDevice() == undefined) {
                mGraphicDevice = args.framework.GetMainGraphicDevice();
                mGraphicContext = mGraphicDevice.GetGraphicContext();
            }
            else {
                mGraphicDevice = args.framework.GetSecondaryGraphicDevice();
                mGraphicContext = mGraphicDevice.GetGraphicContext();
                
                var rawColor = this.fontColor.GetRed() + "," + this.fontColor.GetGreen() + "," +
                    this.fontColor.GetBlue() + "," + this.fontColor.GetAlpha();
                this.fontColor = new NColor(rawColor, mGraphicDevice.GetRenderEngineType());
            }
        }
        
        mGraphicContext.save();
        mGraphicContext.globalAlpha = this.alpha;
        mGraphicContext.translate(this.x, this.y);
        mGraphicContext.rotate(this.rotation);
        mGraphicContext.scale(this.scaleX, this.scaleY);

        mGraphicContext.font = this.fontWeight + " - " + this.fontSize.toString() + "px " + this.font;
        mGraphicContext.fillStyle = this.fontColor.GetResult();

        this.WrapText(mGraphicContext, this.text, 1000, this.fontSize);

        mGraphicContext.textAlign = this.textAlign;
        mGraphicContext.restore();
    }
}