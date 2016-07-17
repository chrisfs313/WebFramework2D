function NCommon() { }

NCommon.InstanceByClassName = function (className, params) {
    return new Function('arg1', 'return new ' + className + '(arg1)')(params);
}

NCommon.IsPowerOfTwo = function(x) {
    return (x & (x - 1)) == 0;
}

NCommon.NextHighestPowerOfTwo = function(x) {
    --x;
    for (var i = 1; i < 32; i <<= 1) {
        x = x | x >> i;
    }
    return x + 1;
}