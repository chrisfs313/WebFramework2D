function NEffect2DFactory() {

    var mEffects = new Array();
    var mSpriteBatcher = new NSpriteBatcher('../www/asset/spSpriteSheetGameElements.png');

    this.CreateEffect2D = function (path, x, y, horizontalTiles, verticalTiles) {
        
        var effect = new NEffect2D(path, x, y, horizontalTiles, verticalTiles);
        effect.GetAnimator2D().SetSpriteBatch(mSpriteBatcher);

        mEffects.push(effect);

        return effect;
    }

    this.Update = function (args) {
        mSpriteBatcher.BeginDraw();

        for (var i = 0; i < mEffects.length; i++) {
            var effect = mEffects[i];

            if (effect != undefined) {
                if (!effect.GetIsWaitingForDelete()) {
                    effect.Update(args);
                }
                else {
                    effect.Destroy();
                    effect = undefined;

                    mEffects.splice(i, 1);
                    i--;
                }
            }
        }

        mSpriteBatcher.EndDraw();
        mSpriteBatcher.Update(args);
    }

    this.Destroy = function () {
        mEffects = undefined;
    }
}