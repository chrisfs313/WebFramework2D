function NGEnemyHomingMissile(bulletFactoryInstance, player) {

    var mPlayer = player;
    var mBulletFactoryInstance = bulletFactoryInstance;
    var mAnimator2D;

    var mHomingInterpolator;
    var mIsWaitingForDelete;

    this.GetIsWaitingForDelete = function () { return mIsWaitingForDelete; }
    this.GetAnimator = function () { return mAnimator2D; }

    this.Initialize = function (currentX, currentY, turnFactor, speed) {
        mIsWaitingForDelete = false;

        var imageContent = NOctopusFramework.Instance().GetContentManagment().GetImage('../www/asset/spSpriteSheetGameElements.png');

        mAnimator2D = new NAnimator2D(currentX, currentY, 4, 2);
        mAnimator2D.SetImageContent(imageContent);
        mAnimator2D.SetAdvanceAnimationTileConfig(1024, 190, 80, 15);

        var collWidth = mAnimator2D.GetWidth() * mAnimator2D.scaleX;
        var collHeight = mAnimator2D.GetHeight() * mAnimator2D.scaleY;
        
        var primitiveQuad = mAnimator2D.CreateCollision(0, 0, collWidth, collHeight, new NColor("0,0,1,0"));
        primitiveQuad.offsetX = -collWidth / 2;
        primitiveQuad.offsetY = -collHeight / 2;

        mHomingInterpolator = new NHoming2D(currentX, currentY, turnFactor, speed);
    }

    this.Update = function (args) {
        mHomingInterpolator.Update(args);

        mAnimator2D.x = mHomingInterpolator.GetX();
        mAnimator2D.y = mHomingInterpolator.GetY();
        mAnimator2D.rotation = mHomingInterpolator.GetRotation();
        mAnimator2D.Update(args);

        mHomingInterpolator.SetTarget(mPlayer.GetX(), mPlayer.GetY());

        if (mPlayer != undefined) {
            var hitted = mPlayer.HitTest(mAnimator2D);
            
            if (hitted) {
                // If there's collision of the player bullet then show an animation
                var bulletEffect2D = mBulletFactoryInstance.GetGameInstance().GetEffectFactory().CreateEffect2D(
                    '../www/asset/spSpriteSheetGameElements.png', mAnimator2D.x, mAnimator2D.y, 4, 4);
                bulletEffect2D.GetAnimator2D().SetAdvanceAnimationTileConfig(1024, 0, 190, 190);
                bulletEffect2D.GetAnimator2D().scaleX = 0.35;
                bulletEffect2D.GetAnimator2D().scaleY = 0.35;

                mIsWaitingForDelete = true;

                mPlayer.OnHit(1);
            }
        }
    }

    this.Destroy = function () {
        mAnimator2D.Destroy();
        mAnimator2D = undefined;
        mBulletFactoryInstance = undefined;
    }
}