/**
 * User: Gang
 * Date: 2013-07-30
 * Time: 11:20 AM
 */
var Tower = cc.Node.extend({
    attackRange: 0,
    damage: 0,
    fireRate: 0.0,
    attacking: false,
    chosenEnemy: null,

    theGame: null,
    mySprite: null,
    //drawtool: null,

    //构造函数，当new一个当前的实例时，会执行ctor
    ctor: function () {
        this._super();

    },

    initWithTheGame: function(game, location)
    {
        this.attackRange = 70;
        this.damage = 10;
        this.fireRate = 1;
        this.chosenEnemy = null;

        this.mySprite = cc.Sprite.create(s_png_Tower);
        this.addChild(this.mySprite);
        this.mySprite.setPosition(location);
        this.theGame = game;
        this.theGame.gameLayer.addChild(this, g_GameZOder.ui);

        this.scheduleUpdate();

        return true;
    },

    attackEnemy: function()
    {
        this.schedule(this.shootWeapon, this.fireRate);
    },

    chosenEnemyForAttack: function(enemy)
    {
        this.chosenEnemy = null;
        this.chosenEnemy = enemy;
        this.attackEnemy();
        enemy.getAttacked(this);
    },

    shootWeapon: function(dt)
    {
        var bullet = cc.Sprite.create(s_png_Bullet);
        this.theGame.gameLayer.addChild(bullet, g_GameZOder.ui);
        bullet.setPosition(this.mySprite.getPosition());

        bullet.runAction(cc.Sequence.create(
            cc.MoveTo.create(0.1, cc.p(this.chosenEnemy.mySprite.getPosition())),
            cc.CallFunc.create(this.damageEnemy, this),
            //cc.CallFuncN.create(this.removeBullet, this),
            cc.CallFunc.create(this.removeBullet, this),
            null));
    },

    removeBullet: function(bullet)
    {
        bullet.getParent().removeChild(bullet, true);
    },

    damageEnemy: function()
    {
        if (this.chosenEnemy)
        {
            this.chosenEnemy.getDamaged(this.damage);
        }
    },

    targetKilled: function()
    {
        if (this.chosenEnemy)
        {
            this.chosenEnemy = null;
        }

        this.unschedule(this.shootWeapon);
    },

    lostSightOfEnemy: function()
    {
        this.chosenEnemy.gotLostSight(this);

        if (this.chosenEnemy)
        {
            this.chosenEnemy = null;
        }

        this.unschedule(this.shootWeapon);
    },

    update: function(dt)
    {
        if (this.chosenEnemy)
        {
            //We make it turn to target the enemy chosen
            var normalized = cc.pNormalize(
                                                cc.p(this.chosenEnemy.mySprite.getPosition().x - this.mySprite.getPosition().x,
                                                     this.chosenEnemy.mySprite.getPosition().y - this.mySprite.getPosition().y));
            this.mySprite.setRotation(cc.RADIANS_TO_DEGREES(Math.atan2(normalized.y, - normalized.x)) + 90);

            if (!this.theGame.collisionWithCircle(this.mySprite.getPosition(), this.attackRange, this.chosenEnemy.mySprite.getPosition(), 1))
            {
                this.lostSightOfEnemy();
            }
        }
        else
        {
            for (var i=0; i < this.theGame.enemiesList.length; i ++)
            {
                var enemy = this.theGame.enemiesList[i];
                if (this.theGame.collisionWithCircle(this.mySprite.getPosition(), this.attackRange, enemy.mySprite.getPosition(), 1))
                {
                    this.chosenEnemyForAttack(enemy);
                    break;
                }
            }
        }
    },

    draw: function()
    {
        if (cc.COCOS2D_DEBUG == 2)
        {
            cc.drawingUtil.setDrawColor4B(255, 255, 255, 255);
            cc.drawingUtil.drawCircle(this.mySprite.getPosition(), this.attackRange, 360, 30, false);
        }

        this._super ();
    }
});

Tower.nodeWithTheGame=function(game, location)
{
    var retObj = new Tower();
    if (retObj && retObj.initWithTheGame(game, location))
    {
        return retObj;
    }

    return null;
};