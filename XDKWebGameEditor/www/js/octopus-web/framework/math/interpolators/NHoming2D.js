function NHoming2D(currentX, currentY, turnFactor, speed) {
    var mTargetX = 0;
    var mTargetY = 0;
    var mCurrentX = currentX;
    var mCurrentY = currentY;
    var mRotation = 0;
    var mTurnFactor = turnFactor;
    var mSpeed = speed;
    var mRotationCorrection = 0;

    var mDirectionVector = new NVector2(mTargetX - mCurrentX, mTargetY - mCurrentY);
    mDirectionVector.Normalize(1);

    var mVelocityVector = new NVector2(0, 0);

    this.GetX = function () { return mCurrentX; }
    this.GetY = function () { return mCurrentY; }
    this.GetRotation = function () { return mRotation; }

    this.SetTarget = function (targetX, targetY) {
        mTargetX = targetX;
        mTargetY = targetY;
    }
    
    this.Update = function (args) {
        mDirectionVector.x = mTargetX - mCurrentX;
        mDirectionVector.y = mTargetY - mCurrentY;

        mDirectionVector.Normalize();  
		mDirectionVector.Multiply(new NVector2(mTurnFactor, mTurnFactor));
		
        mVelocityVector.Add(mDirectionVector);
        mVelocityVector.Normalize();
        mVelocityVector.Multiply(new NVector2(mSpeed * args.dt, mSpeed * args.dt));
        
        mCurrentX += mVelocityVector.x;
        mCurrentY += mVelocityVector.y;

        mRotation = Math.atan2(mVelocityVector.y, mVelocityVector.x) + mRotationCorrection;
    }
}