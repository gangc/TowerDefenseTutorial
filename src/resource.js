var s_png_Bg = "Bg.png";
var s_png_Bullet= "bullet.png";
var s_png_Enemy = "enemy.png";
var s_png_OpenSpot = "open_spot.png";
var s_png_Tower = "tower.png";

var s_png_FontRed14 = "font_red_14.png";
var s_fnt_FontRed14 = "font_red_14.fnt";

var s_wav_LaserShot = "sounds/laser_shoot.wav";
var s_wav_LifeLose = "sounds/life_lose.wav";
var s_wav_TowerPlace = "sounds/tower_place.wav";
var s_mp3_Level = "sounds/8bitDungeonLevel.mp3";

var s_plist_TowersPosition = "TowersPosition.plist";
var s_plist_Waves = "Waves.plist";

var g_ressources = [
    //image
    {src:s_png_Bg},
    {src:s_png_Bullet},
    {src:s_png_Enemy},
    {src:s_png_OpenSpot},
    {src:s_png_Tower},

    //plist
    {type:'plist', src:s_plist_TowersPosition},
    {type:'plist', src:s_plist_Waves},

    //fnt
    {src:s_png_FontRed14},
    {type:'fnt', src:s_fnt_FontRed14},

    //wav
    {type:'sound', src:s_wav_LaserShot},
    {type:'sound', src:s_wav_LifeLose},
    {type:'sound', src:s_wav_TowerPlace},
    {type:'sound', src:s_mp3_Level}

    //tmx


    //bgm

    //effect
];