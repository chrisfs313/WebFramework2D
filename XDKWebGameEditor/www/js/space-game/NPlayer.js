function NPlayer() {
    var mSprite;
    var mGameInstance;

    this.GetX = function () { return mSprite.x; }
    this.GetY = function () { return mSprite.y; }

    this.Initialize = function (gameInstance) {
        mGameInstance = gameInstance;

        var imageContent = NOctopusFramework.Instance().GetContentManagment().GetImage('../www/asset/spSpriteSheetGameElements.png');
        
        mSprite = new NSprite();
        mSprite.SetImageContent(imageContent);
        mSprite.rotation = -Math.PI / 2;
        mSprite.scaleX = mSprite.scaleY = 0.3;
        mSprite.SetAdvanceAnimationTileConfig(1024, 205, 75, 128);

        var offsetCollWidth = -8;
        var offsetCollHeight = -14;
        var collWidth = (mSprite.GetWidth() * mSprite.scaleX) + offsetCollWidth;
        var collHeight = (mSprite.GetHeight() * mSprite.scaleY) + offsetCollHeight;

        var primitiveQuad = mSprite.CreateCollision(0, 0, collHeight, collWidth, new NColor("1,0,0,0"));
        primitiveQuad.offsetX = -collHeight / 2;
        primitiveQuad.offsetY = -collWidth / 2;
    }

    this.HitTest = function (otherObject) {
        return mSprite.HitTest(otherObject);
    }

    this.OnHit = function (damage) {

    }

    this.OnMouseMove = function (x, y) {
        mSprite.x = x;
        mSprite.y = y;
    }

    this.OnKeyDown = function (keyCode) {
        switch (keyCode) {
            case NKeyCodeEnum.Space:
                var direction = new NVector2();
                direction.x = 1;
                direction.y = 0;

                var speed = 300;
                
                for (var i = -8; i < 16; i++) {
                    mGameInstance.GetBulletFactory().CreateBullet(ProyectileTypeEnum.Player,
                    mSprite.x, mSprite.y + i * 4, direction, speed);
                }

                mGameInstance.GetBulletFactory().CreateBullet(ProyectileTypeEnum.Player,
                    mSprite.x, mSprite.y, direction, speed);
                break;
        }
    }

    this.Update = function (args) {
        mSprite.Update(args);
    }
}