function NGPlayerBullet(bulletFactoryInstance) {

    var mBulletFactoryInstance = bulletFactoryInstance;
    var mSprite;
    var mDirection;
    var mSpeed;
    var mIsWaitingForDelete;

    this.GetIsWaitingForDelete = function () { return mIsWaitingForDelete; }
    this.GetSprite = function () { return mSprite; }

    this.Initialize = function (x, y, direction, speed) {
        mDirection = direction;
        mSpeed = speed;

        mIsWaitingForDelete = false;
        
        var imageContent = NOctopusFramework.Instance().GetContentManagment().GetImage('../www/asset/spSpriteSheetGameElements.png');

        mSprite = new NSprite(x, y);
        mSprite.SetImageContent(imageContent);
        mSprite.SetAdvanceAnimationTileConfig(1104, 190, 19, 4);

        var collWidth = mSprite.GetWidth() * mSprite.scaleX;
        var collHeight = mSprite.GetHeight() * mSprite.scaleY;
        
        var primitiveQuad = mSprite.CreateCollision(0, 0, collWidth, collHeight, new NColor("0,0,1,0"));
        primitiveQuad.offsetX = -collWidth / 2;
        primitiveQuad.offsetY = -collHeight / 2;
    }

    this.Update = function (args) {
        mSprite.x += mDirection.x * mSpeed * args.dt;
        mSprite.y += mDirection.y * mSpeed * args.dt;
        mSprite.Update(args);

        if ((mSprite.x + mSprite.GetWidth()) > NOctopusFramework.GetAppWidth()) {
            mIsWaitingForDelete = true;
        }

        var enemies = mBulletFactoryInstance.GetGameInstance().GetEnemyFactory().GetEnemies();

        for (var i = 0; i < enemies.length; i++) {
            var enemy = enemies[i];

            if (enemy != undefined) {
                var hitted = mSprite.HitTest(enemy.GetSprite());

                if (hitted) {
                    // If there's collision of the player bullet then show an animation
                    var bulletEffect2D = mBulletFactoryInstance.GetGameInstance().GetEffectFactory().CreateEffect2D(
                        '../www/asset/spSpriteSheetGameElements.png', mSprite.x, mSprite.y, 4, 4);
                    bulletEffect2D.GetAnimator2D().SetAdvanceAnimationTileConfig(1024, 0, 190, 190);
                    bulletEffect2D.GetAnimator2D().scaleX = 0.35;
                    bulletEffect2D.GetAnimator2D().scaleY = 0.35;

                    mIsWaitingForDelete = true;
                    enemy.OnHit(1);
                    break;
                }
            }
        }
    }

    this.Destroy = function () {
        mSprite.Destroy();
        mSprite = undefined;

        mBulletFactoryInstance = undefined;
        mDirection = undefined;
    }
}