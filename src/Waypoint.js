/**
 * User: Gang
 * Date: 2013-07-28
 * Time: 9:32 PM
 */
var Waypoint = cc.Node.extend({
    nextWaypoint: null,
    myPosition: null,
    theGame: null,

    ctor: function () {
        this._super();

    },

    setNextWaypoint: function(next)
    {
       this.nextWaypoint = next;
    },

    initWithTheGame: function(game, location)
    {
        this.theGame = game;
        this.myPosition = location;

        this.setPosition(cc.p(0, 0));
        this.theGame.gameLayer.addChild(this);

        return true;
    },

    getMyPosition: function()
    {
       return this.myPosition;
    },

    draw: function()
    {
       if (cc.COCOS2D_DEBUG == 2)
       {
        cc.drawingUtil.setDrawColor4B(0, 255, 0, 255);
        cc.drawingUtil.drawCircle(this.myPosition, 6, 360, 30, false);
        cc.drawingUtil.drawCircle(this.myPosition, 2, 360, 30, false);

        if (this.nextWaypoint)
        {
            cc.drawingUtil.drawLine(this.myPosition, this.nextWaypoint.myPosition);
        }
       }

       this._super ();
    }
});

Waypoint.nodeWithTheGame=function(game, location)
{
    var retObj = new Waypoint();
    if (retObj && retObj.initWithTheGame(game, location))
    {
        return retObj;
    }

    return null;
};