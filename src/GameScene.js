/**
 * User: Gang
 * Date: 2013-07-27
 * Time: 1:16 PM
 */
var g_GameZOder = {bg: 0, ui: 1, front: 100};
var g_GameStatus={normal:0,stop:1,gameOver:2};
var kTOWER_COST=300;

var GameScene = cc.Scene.extend({
    gameStatus: 0,
    gameLayer: null,
    towerBaseList: [],
    towersList: [],
    waypointsList: [],
    enemiesList: [],
    wave: 0,
    playerHp: 0,
    playerGold: 0,
    gameEnded: false,
    ui_wave_lbl: null,
    ui_hp_lbl: null,
    ui_gold_lbl: null,
    winSize: cc.size(480, 320),


    onEnter: function () {
        this._super();

        this.initData();

        cc.Director.getInstance().getTouchDispatcher().addTargetedDelegate(this, 0, true);

        this.schedule(this.update, 0);
    },

    onTouchBegan:function (touch, event)
    {
        var location = touch.getLocation();

        for (var i = 0; i < this.towerBaseList.length; i ++)
        {
            //CCSprite *tb = (CCSprite*)pObject;
            var tb = this.towerBaseList[i];
            var box =  tb.getBoundingBox();
            var bContain = cc.rectContainsPoint(tb.getBoundingBox(), location);
            if (this.canBuyTower() && bContain && tb.getUserData() == null)
            {
                //We will spend our gold later.
                this.playerGold -= kTOWER_COST;
                this.ui_gold_lbl.setString("GOLD: " + this.playerGold);

                var audioEngine = cc.AudioEngine.getInstance();
                audioEngine.playEffect(s_wav_TowerPlace);

                var tower = Tower.nodeWithTheGame(this, tb.getPosition());
                this.towersList.push(tower);
                tb.setUserData(tower);
            }
        }
    },

    initData: function ()
    {
        this.winSize = cc.Director.getInstance().getWinSize();

        var audioEngine = cc.AudioEngine.getInstance();
        audioEngine.playMusic(s_mp3_Level, true);

        this.gameStatus = g_GameStatus.normal;

        this.wave = 0;
        this.towerBaseList = [];
        this.towersList = [];
        this.waypointsList = [];
        this.enemiesList = [];

        this.gameLayer = cc.Layer.create();
        this.addChild(this.gameLayer);

        var bg = cc.Sprite.create(s_png_Bg);
        bg.setAnchorPoint(cc.p(0, 0));
        this.gameLayer.addChild(bg, g_GameZOder.bg);

        this.loadTowerPositions ();
        this.addWaypoints ();

        this.ui_wave_lbl = cc.LabelBMFont.create("Wave: 0", s_fnt_FontRed14);
        //this.ui_wave_lbl.setAnchorPoint( cc.p(1,0) );
        //this.ui_wave_lbl.setAlignment( cc.TEXT_ALIGNMENT_RIGHT );
        this.gameLayer.addChild(this.ui_wave_lbl, g_GameZOder.ui);
        this.ui_wave_lbl.setPosition(cc.p(400, this.winSize.height - 12));
        this.ui_wave_lbl.setAnchorPoint(cc.p(0, 0.5));

        this.loadWave();

        this.gameEnded = false;
        this.playerHp = 5;
        this.ui_hp_lbl = cc.LabelBMFont.create("HP: " + this.playerHp, s_fnt_FontRed14);
        this.gameLayer.addChild(this.ui_hp_lbl, g_GameZOder.ui);
        this.ui_hp_lbl.setPosition(cc.p(35, this.winSize.height - 12));

        this.playerGold = 1000;
        this.ui_gold_lbl = cc.LabelBMFont.create("GOLD: " + this.playerGold, s_fnt_FontRed14);
        this.gameLayer.addChild(this.ui_gold_lbl, g_GameZOder.ui);
        this.ui_gold_lbl.setPosition(cc.p(135, this.winSize.height - 12));
        this.ui_gold_lbl.setAnchorPoint(cc.p(0, 0.5));
    },

    resetData: function()
    {
        this.wave = 0;
        this.gameEnded = false;
        this.playerHp = 5;
        this.playerGold = 1000;

        this.towersList = [];
        this.enemiesList = [];

        this.ui_hp_lbl.setString("HP: 0");
        this.ui_gold_lbl.setString("GOLD: 0");
        this.ui_wave_lbl.setString("Wave:: 0");

        this.loadWave();

    },

    loadTowerPositions: function()
    {
       // in cocos2d-x, there is a CCUtils::dictionaryWithContentsOfFile function
       var towerPositionsDict= new cc.DictMaker();
       towerPositionsDict.dictionaryWithContentsOfFile("res/Normal/TowersPosition.plist");
       for (var i = 0; i < towerPositionsDict.rootDict.length; i ++)
       {
          var towerPos = towerPositionsDict.rootDict[i];
          var towerBase = cc.Sprite.create(s_png_OpenSpot);
          this.gameLayer.addChild(towerBase, g_GameZOder.bg);

          var x = towerPos.x;
          var y = towerPos.y;
          towerBase.setPosition(cc.p(x, y));
          this.towerBaseList.push(towerBase);
       }
    },

    addWaypoints: function()
    {
        var waypoint1 = Waypoint.nodeWithTheGame(this, cc.p(420, 35));
        this.waypointsList.push(waypoint1);

        var waypoint2 = Waypoint.nodeWithTheGame(this, cc.p(35, 35));
        this.waypointsList.push(waypoint2);
        waypoint2.setNextWaypoint(waypoint1);

        var waypoint3 = Waypoint.nodeWithTheGame(this, cc.p(35, 130));
        this.waypointsList.push(waypoint3);
        waypoint3.setNextWaypoint(waypoint2);

        var waypoint4 = Waypoint.nodeWithTheGame(this, cc.p(445, 130));
        this.waypointsList.push(waypoint4);
        waypoint4.setNextWaypoint(waypoint3);

        var waypoint5 = Waypoint.nodeWithTheGame(this, cc.p(445, 220));
        this.waypointsList.push(waypoint5);
        waypoint5.setNextWaypoint(waypoint4);

        var waypoint6 = Waypoint.nodeWithTheGame(this, cc.p(-40, 220));
        this.waypointsList.push(waypoint6);
        waypoint6.setNextWaypoint(waypoint5);
    },

    loadWave: function()
    {
        var waveDataDict  = new cc.DictMaker();
        waveDataDict.dictionaryWithContentsOfFile("res/Normal/Waves.plist");

        if (this.wave >= waveDataDict.rootDict.length)
        {
            return false;
        }

        var currentWaveData = waveDataDict.rootDict[this.wave];
        var waypoint = this.waypointsList[this.waypointsList.length - 1];
        for (var i = 0; i < currentWaveData.length; i ++)
        {
            var enemyData = currentWaveData[i];
            var enemy = Enemy.nodeWithTheGame(this, waypoint);
            this.enemiesList.push(enemy);
            enemy.schedule(enemy.doActivate, enemyData.spawnTime);
        }

        this.wave++;
        this.ui_wave_lbl.setString("WAVE: " + this.wave);

        return true;
    },

    enemyGotKilled: function()
    {
        //If there are no more enemies.
        if (this.enemiesList.length <= 0)
        {
            if (!this.loadWave())
            {
                cc.log("You win!");

                // todo: update doesn't work, need fix
                //this.unschedule(this.update);
                this.removeAllChildren(true);
                var director = cc.Director.getInstance();
                director.replaceScene(cc.TransitionSplitCols.create(1, this));
                //this.schedule(this.update, 0);
                //this.overGame();
                //this.startGame();
            }
        }
    },

    startGame: function ()
    {
        if(this.gameStatus == g_GameStatus.gameOver)
        {
            this.resetData();
        }

        this.gameStatus = g_GameStatus.normal;
    },
    overGame:function()
    {
        this.gameStatus = g_GameStatus.gameOver;
    },

    canBuyTower: function()
    {
        if (this.playerGold - kTOWER_COST >= 0)
        {
            return true;
        }
        return false;
    },

    collisionWithCircle: function(circlePoint, radius, circlePointTwo, radiusTwo)
    {
        var xdif = circlePoint.x - circlePointTwo.x;
        var ydif = circlePoint.y - circlePointTwo.y;

        var distance = Math.sqrt(xdif * xdif + ydif * ydif);

        if(distance <= radius + radiusTwo)
        {
            return true;
        }
        return false;
    },

    getHpDamage: function()
    {
        var audioEngine = cc.AudioEngine.getInstance();
        audioEngine.playEffect(s_wav_LifeLose);

        this.playerHp--;
        this.ui_hp_lbl.setString("HP: " + this.playerHp);
        if (this.playerHp <= 0)
        {
            this.doGameOver();
        }
    },

    doGameOver: function()
    {
        //if (!this.gameEnded)
        //{
        //    this.gameEnded = true;
           // CCDirector::sharedDirector()->replaceScene(CCTransitionRotoZoom::create(1, HelloWorld::scene()));
        //}
        this.overGame();
        this.startGame();
    },

    awardGold: function(gold)
    {
        this.playerGold += gold;
        this.ui_gold_lbl.setString("GOLD: " + this.playerGold);
    },

    update: function (dt)
    {
        /*
        if (this.gameStatus != g_GameStatus.normal)
        {
            return;
        }

        for (var i = 0; i < this.towersList.length; i ++)
        {
            var tower = this.towersList[i];
            tower.update(dt);
        }

        for (var i = 0; i < this.enemiesList.length; i ++)
        {
            var enemy = this.enemiesList[i];
            enemy.update(dt);
        }
        */
    }
});