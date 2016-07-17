function NMath() {}

NMath.Random = function (min, max) {
    return min + ((max * Math.random()) - min);
}

NMath.Float2Int = function(value) {
    return value | 0;
}