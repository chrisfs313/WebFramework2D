function NVector2(x, y) {
    this.x = x;
    this.y = y;

    this.Length = function() {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }

    this.Dot = function (otherVector) {
        return ((this.x * otherVector.x) + (this.y * otherVector.y));
    }

    this.Add = function(otherVector) {
        this.x += otherVector.x;
        this.y += otherVector.y;
    }

    this.Multiply = function (otherVector) {
        this.x *= otherVector.x;
        this.y *= otherVector.y;
    }

    this.Scale = function(scaleFactor) {
        this.x *= scaleFactor;
        this.y *= scaleFactor;
    }

    this.Subtract = function (otherVector) {
        this.x -= otherVector.x;
        this.y -= otherVector.y;
    }
    	
    this.Divide = function(otherVector) {
        this.x /= otherVector.x;
        this.y /= otherVector.y;
    }
    	
    this.Angle = function() {
        return Math.atan2(this.y, this.x);
    }

	this.Normalize = function() {
        var vectorLength = this.Length();

        if (vectorLength > 0) {
            this.x /= vectorLength;
            this.y /= vectorLength;
        }
        else {
            //console.log("[WARN]: NVector2.normalize: called on a zero-length vector.");
        }
    }

    this.ProjectionOn = function(otherVector) {
        var squareLength = otherVector.Dot(otherVector);

        if (squareLength == 0) {
            //console.log("[WARN] Vector2D.projectionOn: zero-length projection vector.");
            return this.Clone();
        }
        var result = otherVector.Clone();
        result.Scale(this.Dot(otherVector) / squareLength);

        return result;
    }

    this.Clone = function() {
        return new NVector2(x, y);
    }
}

NVector2.Zero = new NVector2(0, 0);
NVector2.One = new NVector2(1, 1);
NVector2.Left = new NVector2(1, 0);
NVector2.Right = new NVector2(0, 1);