var canvas = document.getElementById('fishCanvas'),
    w = window.innerWidth, 
    h = window.innerHeight;

canvas.width = 720;
canvas.height = 1280;
canvas.style.width = w + "px";
canvas.style.height = h + "px";

var canvasWidth = canvas.width,
    canvasHeight = canvas.height,
    stage, // 舞台
    isDrawing, // 判断是否在触摸
    oldPt, // 每次触摸的点
    bgImage, // 背景
    player, // 玩家
    fishColor, // 玩家鱼的颜色
    cursor, // 虚拟手柄轮盘
    circle, // 虚拟手柄底座
    plateContainer, // 虚拟手柄容器
    circleRadius, // 虚拟手柄底座半径
    _angle, // 与圆心角度
    _speed, // 速度
    scoreNum = 0, // 分数
    scoreText, // 分数容器
    gameNum = -1, // 总执行帧数
    onceVar, // 只执行一次变量
    FPS = 50; // 设置帧数



function loading(){ // 加载函数
    var result = [
        {id:"bigBg2",src:"image/bg.png"},
        {id:"bigBg",src:"image/bigBg2.png"},
        {id:"plate", src:"image/plate2.png"},
        {id:"circle", src:"image/plate_circle.png"},
        {id:"bubble1",src:"image/bubble1.png"},
        {id:"bubble2",src:"image/bubble2.png"},
        {id:"time_1",src:"image/time_1.png"},
        {id:"time_2",src:"image/time_2.png"},
        {id:"time_3",src:"image/time_3.png"},
        {id:"fish1",src:"image/cFish1.png"},
        {id:"fish2",src:"image/cFish2.png"},
        {id:"fish3",src:"image/cFish3.png"},
        {id:"fish4",src:"image/cFish4.png"},
        {id:"fish5",src:"image/cFish5.png"},
        {id:"fish6",src:"image/cFish6.png"},
        {id:"fish7",src:"image/cFish7.png"},
        {id:"fish8",src:"image/cFish8.png"},
        {id:"goldFish1",src:"image/goldFish1.png"},
        {id:"goldFish2",src:"image/goldFish2.png"},
        {id:"goldFish3",src:"image/goldFish3.png"},
        {id:"goldFish4",src:"image/goldFish4.png"},
        {id:"goldFish5",src:"image/goldFish5.png"},
        {id:"goldFish6",src:"image/goldFish6.png"},
        {id:"goldFish1_a",src:"image/goldFish1_a.png"},
        {id:"goldFish2_a",src:"image/goldFish2_a.png"},
        {id:"goldFish3_a",src:"image/goldFish3_a.png"},
        {id:"goldFish4_a",src:"image/goldFish4_a.png"},
        {id:"goldFish5_a",src:"image/goldFish5_a.png"},
        {id:"goldFish6_a",src:"image/goldFish6_a.png"},
        {id:"goldFish1_v",src:"image/goldFish1_v.png"},
        {id:"goldFish2_v",src:"image/goldFish2_v.png"},
        {id:"goldFish3_v",src:"image/goldFish3_v.png"},
        {id:"goldFish4_v",src:"image/goldFish4_v.png"},
        {id:"goldFish5_v",src:"image/goldFish5_v.png"},
        {id:"goldFish6_v",src:"image/goldFish6_v.png"},
        {id:"blueFish1",src:"image/blueFish1.png"},
        {id:"blueFish2",src:"image/blueFish2.png"},
        {id:"blueFish3",src:"image/blueFish3.png"},
        {id:"blueFish4",src:"image/blueFish4.png"},
        {id:"blueFish5",src:"image/blueFish5.png"},
        {id:"blueFish6",src:"image/blueFish6.png"},
        {id:"blueFish1_a",src:"image/blueFish1_a.png"},
        {id:"blueFish2_a",src:"image/blueFish2_a.png"},
        {id:"blueFish3_a",src:"image/blueFish3_a.png"},
        {id:"blueFish4_a",src:"image/blueFish4_a.png"},
        {id:"blueFish5_a",src:"image/blueFish5_a.png"},
        {id:"blueFish6_a",src:"image/blueFish6_a.png"},
        {id:"blueFish1_v",src:"image/blueFish1_v.png"},
        {id:"blueFish2_v",src:"image/blueFish2_v.png"},
        {id:"blueFish3_v",src:"image/blueFish3_v.png"},
        {id:"blueFish4_v",src:"image/blueFish4_v.png"},
        {id:"blueFish5_v",src:"image/blueFish5_v.png"},
        {id:"blueFish6_v",src:"image/blueFish6_v.png"},
    ];
    loader = new createjs.LoadQueue(true);
    loader.installPlugin(createjs.Sound);
    loader.addEventListener('progress', progress);
    loader.loadManifest(result);
}

function progress(e) { // 进度条
    console.log(e)
    var myLoad;
    var proessWidth = parseInt(e.loaded * 100);
    var borderradius = 50 - proessWidth/2;
    if(window.prople == 1){
        myLoad = $("#loading .goldLoad");
    }else if(window.prople == 2){
        myLoad = $("#loading .blueLoad");
    }
        
    $(myLoad).find('div.progress>img').css({width: (proessWidth-4) + "%" , borderRadius: borderradius + "%"});
    $(myLoad).find('div.progress>span').text(proessWidth+"%");
        
    if(proessWidth == 100){
        countDown();
    }
}

function countDown(){ // 倒计时
    $("#loading>div").remove();
    $("#loading>p.countDown").show();
    var intervals = setInterval(function(){
        var num = parseInt($("#loading>p.countDown").find('img').attr('src').slice(-5));
        if(typeof num == 'number') --num;
        
        if(num > 0){
            $("#loading>p.countDown").find('img').attr('src','image/time_'+num+'.png');
        }else {
            $("#loading").hide();
            clearInterval(intervals);
        }
    },1000);
    init();
}

function init(){
    stage = new createjs.Stage(canvas);
    createjs.Touch.enable(stage);
    stage.enableMouseOver();
    createjs.Ticker.setFPS(FPS);
//    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener("tick", tickFun);
    
    
    /*背景*/
    var bgImageSheet = {
        framerate: 20
        , images: [loader.getResult("bigBg")]
        , frames: {
            width: 720
            , height: 1280
            , count: 8
        }
        , animations: {
            "run": [0,7, ,0.1]
        , }
    };
    bgImage = new createjs.Sprite(new createjs.SpriteSheet(bgImageSheet), "run");
    stage.addChild(bgImage);
    
    /*玩家*/
    if(window.prople == 1){
        player = _appendBitmap('goldFish1');
        fishColor = 'goldFish';
    }else if(window.prople == 2){
        player = _appendBitmap('blueFish1');
        fishColor = 'blueFish';
    }
    player.set({
        x: canvasWidth / 2
        , y : canvasHeight /2
        , regX : player.getBounds().width >> 1
        , regY : player.getBounds().height >> 1
        , scaleX : -0.5
        , scaleY : 0.5
        , level : 1
    });
    
    /*得分*/
    scoreText = new createjs.Text(scoreNum+'分');
    scoreText.set({
        x: 10,
        y: 150,
        color: '#f66',
        font: '40px Arial'
    });
    stage.addChild(scoreText);
    
    /*操作轮盘*/
    plateContainer = new createjs.Container();
    stage.addChild(plateContainer);
    circle = _appendBitmap('plate');
    circle.set({
        x: stage.canvas.width - 200
        , y: stage.canvas.height - 300
        , regX : circle.getBounds().width >> 1
        , regY : circle.getBounds().height >> 1
        , scaleX: 0.8
        , scaleY: 0.8
    });
    cursor = _appendBitmap('circle');
    cursor.set({
        x: stage.canvas.width - 200
        , y: stage.canvas.height - 300
        , regX : cursor.getBounds().width >> 1
        , regY : cursor.getBounds().height >> 1
        , scaleX: 0.8
        , scaleY: 0.8
    });
    plateContainer.addChild(circle, cursor);
    
    stage.setChildIndex(plateContainer,9999);
    
    circleRadius = circle.getBounds().width / 2 * 0.8;
//    cursor.addEventListener('mousedown', function (e) { // 事件
//        oldPt = new createjs.Point(circle.x, circle.y);
//        isDrawing = true;
        stage.addEventListener("stagemousedown", handleMouseDown);
        stage.addEventListener("stagemouseup", handleMouseUp);
        stage.addEventListener("stagemousemove", handleMouseMove);
//    });
    
}


function tickFun(){
    gameNum++;
    
    if(gameNum % 15 == 0){ // 生成气泡
        _roundPopo(_round(1,5));
    }
    
    if(_angle){
        myFish(player);
    }
    
    
    /*其他鱼*/
    if(roundFish[0] && roundFish[0] !== undefined){
        computerFish(player);
    }
    else{
        if(gameNum > 200 && $('#loading').css('display') == 'none' && !onceVar){
            onceVar = true;
            _sendFish(5);
         }
    }
    
    stage.update();
}


function _sendFish(n){ // 生成n条鱼
    n = n || 1;
    var fish = "";
    var width = 0;
    var height = 0;
    var level = 0;
    var fishList = [];
    for(var i=0;i<n;i++){
        var fishData = {};
        var num = _round(1,100);
        var direction = _round(0,1);
        var rNum = _round(0,3);
        if(num == 100){ // 1%
            fish = "fish8";
            width = 436;
            height = 237;
            level = 99999;
        }
        else if (num < 100 && num >= 98){ // 2%
            fish = "fish7";
            width = 280;
            height = 163;
            level = 6;
        }
        else if (num < 98 && num >= 95){ // 3%
            fish = "fish6";
            width = 240;
            height = 152;
            level = 5;
        }
        else if (num < 95 && num >= 91){ // 4%
            fish = "fish5";
            width = 200;
            height = 120;
            level = 4;
        }
        else if (num < 91 && num >= 81){ // 10%
            fish = "fish4";
            width = 124;
            height = 78;
            level = 3;
        }
        else if (num < 81 && num >= 71){ // 10%
            fish = "fish3";
            width = 120;
            height = 71;
            level = 3;
        }
        else if (num < 71 && num >= 51){ // 20%
            fish = "fish2";
            width = 80;
            height = 61;
            level = 2;
        }
        else {  // 50%
            fish = "fish1";
            width = 47;
            height = 35;
            level = 1;
        }
        
        fishData.id = _round(1,100).toString() + _round(1,100).toString(); // 随机一个ID
        fishData.fish = fish;
        if(direction == 1){ // 右边
            fishData.x = canvasWidth + width/2;
        }else { // 左边
            fishData.x = 0 - width/2;
        }
        fishData.y = _round(height,canvasHeight-height); // y轴不能出上下边界
        fishData.startY = fishData.y;
        
        fishData.speed = _round(1,10);
        fishData.direction = direction;
        fishData.level = level;
        
        if(rNum == 0){ // 控制y轴上下 范围在 +- 200 以内
            fishData.endY = _round((fishData.y + 200),(fishData.y + 500));
        }else if(rNum == 3){
            fishData.endY = _round((fishData.y - 200),(fishData.y - 500));
        }else {
            fishData.endY = fishData.y;
        }
        
        // 不能出屏幕范围
        if(fishData.endY > (canvasHeight-height)){
            fishData.endY = canvasHeight-height;
        }
        if(fishData.endY < height){
            fishData.endY = height;
        }
        
        /* 计算每条鱼y轴每一帧所移动的距离 */
        if(fishData.startY != fishData.endY){
            fishData.diff = Math.abs(fishData.startY - fishData.endY) / ((parseInt(canvasWidth) + width) / FPS) / FPS;
        }else {
            fishData.diff = 0;
        }
        
        fishList.push(fishData);
    }
    
    
    allFishList = allFishList.concat(fishList);
    for(var w=0;w<fishList.length;w++){ // 电脑的鱼移动
        var oneFish = _appendBitmap(fishList[w].fish);
        oneFish.set({ // 设置坐标
            x: fishList[w].x
            , y : fishList[w].y
            , regX : oneFish.getBounds().width >> 1
            , regY : oneFish.getBounds().height >> 1
            , scaleX : 1
        });
        oneFish.speed = fishList[w].speed;
        oneFish.startY = fishList[w].startY;
        oneFish.endY = fishList[w].endY;
        oneFish.diff = fishList[w].diff;
        oneFish.direction = fishList[w].direction;
        oneFish.level = fishList[w].level;
        if(oneFish.direction == 1){ // 右边
            oneFish.scaleX = -Math.abs(oneFish.scaleX);
        }else { // 左边
            oneFish.scaleX = Math.abs(oneFish.scaleX);
        }
        roundFish.push(oneFish);
        stage.addChild(oneFish);
        stage.setChildIndex(oneFish,1);
    }
}


function myFish(player){ // 自己的鱼移动
    var fishW = player.getBounds().width/4;
    var fishH = player.getBounds().height/4;
    var maxWidth = canvasWidth - fishW;
    var maxHeight = canvasHeight - fishH;
    
    
    /* 设置自己鱼的坐标 且不能出边界 */
    player.x += Math.cos(_angle * (Math.PI/180)) * _speed;
    player.x = player.x < fishW ? fishW : player.x;
    player.x = player.x > maxWidth ? maxWidth : player.x;

    player.y += Math.sin(_angle * (Math.PI/180)) * _speed;
    player.y = player.y < fishH ? fishH : player.y;
    player.y = player.y > maxHeight ? maxHeight : player.y;
    
    if(_angle >= -90 && _angle < 90){ // 右边
        player.scaleX = -Math.abs(player.scaleX);
    }else { // 左边
        player.scaleX = Math.abs(player.scaleX);
    }
}

function editFishImage(player,n,fishColor){ // 根据 n 设置鱼的大小
    var eat = document.getElementById("eatMP3");
    eat.play();  
    scoreText.text = n+'分';
    player.image = loader.getResult(fishColor+player.level+"_a");
    
    setTimeout(function(){
        player.image = loader.getResult(fishColor+player.level);
        switch(true){
            case n>=5&&n<20:
                player.image = loader.getResult(fishColor+'2');
                player.level = 2;
                break;
            case n>=20&&n<50:
                player.image = loader.getResult(fishColor+'3');
                player.level = 3;
                break;
            case n>=50&&n<100:
                player.image = loader.getResult(fishColor+'4');
                player.level = 4;
                break;
            case n>=100&&n<200:
                player.image = loader.getResult(fishColor+'5');
                player.level = 5;
                break;
            case n>=200:
                player.image = loader.getResult(fishColor+'6');
                player.level = 6;
                break;
        }
        player.set({ // 重新设置中心点
            regX : player.getBounds().width >> 1
            , regY : player.getBounds().height >> 1
        });
    },100);
}

function computerFish(player){ // 池塘的其他鱼
    var playerstate;
    if(roundFish.length < 5){ // 鱼总数量小于五条，则补充两条
        if(gameNum % 30 == 0){
            _sendFish(2);
        }
    }
    for(var w=0;w<roundFish.length;w++){
        if(roundFish[w].x > -roundFish[w].getBounds().width/2 - 1 && roundFish[w].x < canvasWidth + roundFish[w].getBounds().width/2 +1){ // 根据每条鱼的大小判断此鱼是否出了边界
            if(roundFish[w].direction == 1){ // 设置x坐标
                roundFish[w].x -= roundFish[w].speed/2; // 右边
            }else { 
                roundFish[w].x += roundFish[w].speed/2; // 左边
            }
            
            if(roundFish[w].startY != roundFish[w].endY){ // 如果鱼是斜着跑的，设置y坐标
                if(roundFish[w].y > roundFish[w].endY){
                    roundFish[w].y -= (roundFish[w].diff * roundFish[w].speed/2);
                }else{
                    roundFish[w].y += (roundFish[w].diff * roundFish[w].speed/2);
                }
            }
            
            /* 碰撞检测 */
            playerstate = ndgmr.checkPixelCollision(player, roundFish[w]);
            if (playerstate){
                if(parseInt(player.level) >= parseInt(roundFish[w].level)){ // 可以吃
                    scoreNum += parseInt(roundFish[w].level);
                    stage.removeChild(roundFish[w]);
                    roundFish.splice(w,1);
                    allFishList.splice(w,1);
                    editFishImage(player,scoreNum,fishColor);
                    break;
                }else {
                    gameover(scoreNum);
                }
            }
        }
        else {
            stage.removeChild(roundFish[w]);
            roundFish.splice(w,1);
            allFishList.splice(w,1);
            break;
        }
    }
}

function gameover(num){
    $('div.music').removeClass('play');
    var song = document.getElementById("song");
    song.pause();
    song.loop = false;

    $('#game_over span').addClass('win');
    song.src = 'common/win.mp3';
    song.play();

//    if($('#game_over span').hasClass('win') || $('#game_over span').hasClass('lose')){
//        $('#game_over').fadeIn('fast');
//    }
    plateContainer.alpha = 0;
    stage.removeAllEventListeners();
    createjs.Ticker.removeAllEventListeners();
}


function _roundPopo(n){ // 生成气泡
    for(var i=0;i<n;i++){
        var name = 'bubble'+_round(1,2);
        var popo = _appendBitmap(name);
        var popoScale = _round(1,5)/10;
        popo.set({
            x: _round(0,canvasWidth)
            , y : canvasHeight - 150
            , regX : popo.getBounds().width >> 1
            , regY : popo.getBounds().height >> 1
            , scaleX : popoScale
            , scaleY : popoScale
        });
        popo.speeds = _round(1,10);
        popo.rotate = _round(0,180);
        stage.setChildIndex(popo,2);

        _popoUp(popo);
    }
}
function _popoUp(popo){ // 气泡上升
    createjs.Tween.get(popo).to({y : 850},500*popo.speeds).call(function(){
        stage.removeChild(popo);
    })
}

function handleMouseDown(event) { // 屏幕触摸
    plateContainer.alpha = 1;
    
    isDrawing = true;
    circle.set({
        x: event.stageX
        , y: event.stageY
    });
    cursor.set({
        x: event.stageX
        , y: event.stageY
    });
    oldPt = new createjs.Point(circle.x, circle.y);
    
    stage.update();
}
function handleMouseMove(event) { // 屏幕滑动
    if (!isDrawing) { // 不是在小点上
        stage.update();
        return;
    }
    
    var movePoint = new createjs.Point(stage.mouseX, stage.mouseY);
    var distance = _getDistance(oldPt, movePoint);
    if (circleRadius > distance) { // 在轮盘范围内
        cursor.x = stage.mouseX;
        cursor.y = stage.mouseY;
        _speed = 6; // 6倍速
    }
    else{
        cursor.x = oldPt.x + Math.cos(_getRadian(movePoint)) * circleRadius;
        cursor.y = oldPt.y + Math.sin(_getRadian(movePoint)) * circleRadius;
        _speed = 8; // 8倍速
    }
    _angle = _getAngle(movePoint); // 获得角度
    
    stage.update();
}

function handleMouseUp(event) { // 屏幕滑动结束
    plateContainer.alpha = 0;
    isDrawing = false;
    _angle = undefined;
    stage.update();
}

function _getAngle (point) { // 计算角度并返回
    var pos = oldPt;
    var _angle = Math.atan2(point.y - pos.y, point.x - pos.x) * (180 / Math.PI);
    return _angle;
}
  
function _getRadian (point) { // 计算弧度并返回
    var _radian = Math.PI / 180 * _getAngle(point);
    return _radian;
}

function _getDistance (pos1, pos2) { // 计算两点间的距离并返回
    return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
}

function _appendBitmap(id) { // 新增位图
    var img = new createjs.Bitmap(loader.getResult(id));
    var imgInfo = img.getBounds();
    stage.addChild(img);
    return img;
}

function _round(min, max) { //随机数字
    return Math.round(Math.random() * (max - min) + min);
}

