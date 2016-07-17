function NEffect2D(path, x, y, horizontalTiles, verticalTiles) {

    var mIsWaitingForDelete = false;
    var mAnimator2D = new NAnimator2D(x, y, horizontalTiles, verticalTiles);
    mAnimator2D.SetImageContent(NOctopusFramework.Instance().GetContentManagment().GetImage('../www/asset/spSpriteSheetGameElements.png'));

    this.GetAnimator2D = function () { return mAnimator2D; }
    this.GetIsWaitingForDelete = function () { return mIsWaitingForDelete; }

    this.Update = function (args) {
        mAnimator2D.Update(args);

        if (mAnimator2D.GetEndedAnimation()) {
            // Erase the effect
            mIsWaitingForDelete = true;
        }
    }

    this.Destroy = function () {
        mAnimator2D.Destroy();
        mAnimator2D = undefined;
    }
}