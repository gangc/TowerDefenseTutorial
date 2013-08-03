/**
 * User: Gang
 * Date: 2013-07-29
 * Time: 11:39 AM
 */

var HEALTH_BAR_WIDTH=20;
var HEALTH_BAR_ORIGIN=-10;

var Enemy = cc.Node.extend({
    myPosition: null,
    maxHp: 0,
    currentHp: 0,
    walkingSpeed: 0,
    destinationWaypoint: null,
    active: false,
    attackedBy: [],
    theGame: null,
    mySprite: null,
    drawtool: null,

    ctor: function () {
        this._super();

    },

    initWithTheGame: function(game, waypoint)
    {
        this.attackedBy = [];
        this.maxHp = 40;
        this.currentHp = this.maxHp;
        this.active = false;
        this.walkingSpeed = 0.5;

        this.theGame = game;
        this.mySprite = cc.Sprite.create(s_png_Enemy);
        this.addChild(this.mySprite);

        this.destinationWaypoint = waypoint.nextWaypoint;
        var pos = waypoint.getMyPosition();
        this.myPosition = pos;
        this.mySprite.setPosition(pos);
        this.theGame.gameLayer.addChild(this, g_GameZOder.ui);

        this.drawtool = cc.DrawNode.create();
        this.theGame.gameLayer.addChild(this.drawtool, g_GameZOder.ui );

        //this.scheduleUpdate();

        return true;
    },

    doActivate: function(dt)
    {
        this.active = true;
    },

    getRemoved: function()
    {
        // Tell tower that target is killed
        for (var i = 0; i < this.attackedBy.length; i ++)
        {
            var attacker = this.attackedBy[i]; //Tower
            attacker.targetKilled();
        }

        // removed this from ui
        this.getParent().removeChild(this, true);

        // remove this from enemiesList
        var index = this.theGame.enemiesList.indexOf(this);
        if(index !=-1 )
        {
            this.theGame.enemiesList.splice(index, 1);
        }

        //Notify the game that we killed an enemy so we can check if we can send another wave
        this.theGame.enemyGotKilled();
    },

    // attacked by tower
    getAttacked: function(attacker)
    {
       this.attackedBy.push(attacker);
    },

    // tower can't see this any more
    gotLostSight: function(attacker)
    {
        var index = this.attackedBy.indexOf(attacker);
        if(index != -1)
        {
            this.attackedBy.splice(index, 1);
        }
    },

    getDamaged: function(damage)
    {
        var audioEngine = cc.AudioEngine.getInstance();
        audioEngine.playEffect(s_wav_LaserShot);

        this.currentHp -= damage;
        if (this.currentHp <= 0)
        {
            this.theGame.awardGold(200);
            this.getRemoved();
        }
    },

    update: function(dt)
    {
        if (!this.active)
        {
            return;
        }

        if (this.theGame.collisionWithCircle(this.myPosition, 1, this.destinationWaypoint.getMyPosition(), 1))
        {
            if (this.destinationWaypoint.nextWaypoint)
            {
                this.destinationWaypoint = this.destinationWaypoint.nextWaypoint;
            }
            else
            {
                //Reached the end of the road. Damage the player
                this.theGame.getHpDamage();
                this.getRemoved();
            }
        }

        var targetPoint =  this.destinationWaypoint.getMyPosition();
        var movementSpeed = this.walkingSpeed;

        var normalized = cc.pNormalize(cc.p(targetPoint.x - this.myPosition.x, targetPoint.y - this.myPosition.y));
        this.mySprite.setRotation(cc.RADIANS_TO_DEGREES(Math.atan2(normalized.y, - normalized.x)));

        this.myPosition = cc.p(this.myPosition.x + normalized.x * movementSpeed, this.myPosition.y + normalized.y * movementSpeed);
        this.mySprite.setPosition(this.myPosition);
    },

    draw: function()
    {
        var healthBarBack = [
        cc.p(this.mySprite.getPosition().x - 10, this.mySprite.getPosition().y + 16),
        cc.p(this.mySprite.getPosition().x + 10, this.mySprite.getPosition().y + 16),
        cc.p(this.mySprite.getPosition().x + 10, this.mySprite.getPosition().y + 14),
        cc.p(this.mySprite.getPosition().x - 10, this.mySprite.getPosition().y + 14)
        ];

        cc.drawingUtil.drawSolidPoly(healthBarBack,4, cc.c4f(255, 0, 0, 255));

        var healthBar = [
        cc.p(this.mySprite.getPosition().x + HEALTH_BAR_ORIGIN, this.mySprite.getPosition().y + 16),
        cc.p(this.mySprite.getPosition().x + HEALTH_BAR_ORIGIN + (this.currentHp * HEALTH_BAR_WIDTH) / this.maxHp, this.mySprite.getPosition().y + 16),
        cc.p(this.mySprite.getPosition().x + HEALTH_BAR_ORIGIN + (this.currentHp * HEALTH_BAR_WIDTH) / this.maxHp, this.mySprite.getPosition().y + 14),
        cc.p(this.mySprite.getPosition().x + HEALTH_BAR_ORIGIN, this.mySprite.getPosition().y + 14)
        ];

        cc.drawingUtil.drawSolidPoly(healthBar,  4, cc.c4f(0, 255, 0, 255));

        this._super ();
    }
});


Enemy.nodeWithTheGame=function(game, waypoint)
{
    var retObj = new Enemy();
    if (retObj && retObj.initWithTheGame(game, waypoint))
    {
        return retObj;
    }

    return null;
};