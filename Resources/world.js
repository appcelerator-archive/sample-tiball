(function() {
    
    app.world = {
        nodeRefs : []
    };

    app.createWorld = function(gameBoard) {
        
        
        // create the world, using view as the surface
        var world = box2d.createWorld(gameBoard);
        
        // This will be used to shoot the ball "harder" the longer the user holds the plunger
        var impulseIntervul,
            impulse = 1,
            score = 0;
        
        // Set the gravity so that the ball "falls" correctly
        world.setGravity(0.0, -5.91);
        
        // create the guide rail that is the shoot 
        var shoot = Ti.UI.createView({
            backgroundColor: "transparent",
            width: 2,
            right:38,
            height: 366,
            bottom: 0
        });
        
        var shootHook = Ti.UI.createView({
        	backgroundColor: "transparent",
        	height: 4,
        	width: 40,
        	bottom: 372,
        	right: 37
        });
        
        var wallR = Ti.UI.createView({
            backgroundColor: "transparent",
            width: 1,
            right: 4,
            height: 440,
            bottom: 0
        });
        
        var wallT = Ti.UI.createView({
            backgroundColor: "transparent",
            width: 310,
            height: 2,
            top: 0
        });
        
        var wallL = Ti.UI.createView({
            backgroundColor: "transparent",
            width: 2,
            left:1,
            height: 440,
            bottom: 0
        });
        
        var wallCorner = Ti.UI.createView({
        	backgroundColor: "transparent",
        	width: 160,
        	height: 2,
        	left: 0,
        	top: 10
        });
                
        // Create the plunger to shoot the ball
        var plunger = Ti.UI.createView({
            backgroundImage: "/images/spring.png",
            width: 32,
            right:7,
            height: 35,
            bottom: 0
        });
        
        // The deflector to aim the ball so it moves into the game board
        var deflector = Ti.UI.createView({
            backgroundColor: "transparent",
            width: 70,
            right:-5,
            height: 2,
            top: 15
        });
        
        // The deflector to aim the ball so it moves into the game board
        var LsideDeflector = Ti.UI.createView({
            backgroundColor: "transparent",
            width: 40,
            left:8,
            height: 2,
            top: 280
        });
        
        // The deflector to aim the ball so it moves into the game board
        var RsideDeflector = Ti.UI.createView({
            backgroundColor: "transparent",
            width: 40,
            right:45,
            height: 2,
            top: 280
        });
        
        
        // The first gutter so the ball rolls to the flippers
        var gutter1 = Ti.UI.createView({
            backgroundColor: "transparent",
            width: 5,
            right: 75,
            height: 15,
            bottom: 50
        });
        
        // The flipper attached to the first gutter
        var flipperR = Ti.UI.createView({
            backgroundImage: "/images/flipper_r.png",
            width:66,
            right:55,
            height: 21,
            bottom: 10
        });
        
        // The second gutter...
        var gutter2 = Ti.UI.createView({
            backgroundColor: "transparent",
            width: 5,
            left:40,
            height: 15,
            bottom: 50
        });
        
        // THe second flipper
        var flipperL = Ti.UI.createView({
            backgroundImage: "/images/flipper_l.png",
            width: 66,
            left: 10,
            height: 21,
            bottom: 10
        });
        
        // This element is our "hole" we add this so we can control the collision of the ball
        // with an element below the flippers, this will be used to reset the ball
        var hole = Ti.UI.createView({
            backgroundColor: "transparent",
            width: 286,
            left:0,
            height: 5,
            bottom: 0
        });
        
        // The ball, we create just one and re-use it
        var gameball = Ti.UI.createView({
            backgroundImage: "/images/ball.png",
            borderRadius: 15,
            width: 28,
            height: 28,
            right: 8,
            bottom: 50,
            shootMe: true
        });
        
        //
        var nodeSettings = {
            backgroundImage: "/images/bumper1000.png",
            borderRadius: 15,
            width: 30,
            height: 30,
        };
        
        var node = [
        {
            left:35,
            top: 105
        },{
            left:130,
            top: 75
        },{
            left:210,
            top: 105
        },{
        	left:55,
        	top:200
        },{
        	left:190,
        	top:200
        }
        ];
        
        for(i=0; i<node.length; i++) {
            
            nodeSettings.left = node[i].left;
            nodeSettings.top = node[i].top;
            nodeSettings.backgroundImage = (i%2==0) ? '/images/bumper10.png' : '/images/bumper50.png';
            nodeSettings.hit_value = (i%2==0) ? 10 : 50;
            
            app.world.nodeRefs[i] = world.addBody(Ti.UI.createView(nodeSettings), {
            	radius: 15,
                density: 10.0,
                friction: 0.3,
                restitution: 1.5,
                type: "static"
            });
            
        }

        app.world.rightWall = world.addBody(wallR, {
            density: 12.0,
            friction: 0.3,
            restitution: 0.4,
            type: "static"
        });
        
        app.world.leftWall = world.addBody(wallL, {
            density: 10.0,
            friction: 0.3,
            restitution: 0.4,
            type: "static"
        });
        
        app.world.topWall = world.addBody(wallT, {
            density: 12.0,
            friction: 0.3,
            restitution: 0.4,
            type: "static"
        });
        
        app.world.wallCorner = world.addBody(wallCorner, {
            density: 10.0,
            friction: 0.3,
            restitution: 0.4,
            type: "static"        	
        });
        app.world.wallCorner.setAngle(0.2);
        
        app.world.LsideDeflector = world.addBody(LsideDeflector, {
            density: 10.0,
            friction: 0.3,
            restitution: 0.4,
            type: "static"          
        });
        app.world.LsideDeflector.setAngle(-0.7);
        
        app.world.RsideDeflector = world.addBody(RsideDeflector, {
            density: 10.0,
            friction: 0.3,
            restitution: 0.4,
            type: "static"          
        });
        app.world.RsideDeflector.setAngle(0.7);
        
        // add body to the world
        app.world.shootRef = world.addBody(shoot, {
            density: 1.0,
            friction: 0.1,
            restitution: 0.1,
            type: "static"
        });
        
        app.world.shootHookRef = world.addBody(shootHook, {
            density: 12.0,
            friction: 0.3,
            restitution: 0.4,
            type: "static"        	
        });
        app.world.shootHookRef.setAngle(-0.50);
        
        // add body to the world
        app.world.plungerRef = world.addBody(plunger, {
            density: 10.0,
            friction: 0.3,
            restitution: 0.4,
            type: "static"
        });
        
        // add body to the world
        app.world.deflectorRef = world.addBody(deflector, {
            density: 5.0,
            friction: 0.3,
            restitution: 0.4,
            type: "static"
        });
        app.world.deflectorRef.setAngle(-0.8);
    
        // add body to the world
        app.world.gutterRightRef = world.addBody(gutter1, {
            density: 10.0,
            friction: 0.3,
            restitution: 0.4,
            type: "static"
        });
        app.world.gutterRightRef.setAngle(0.25);
        
        // add body to the world
        app.world.gutterLeftRef = world.addBody(gutter2, {
            density: 10.0,
            friction: 0.3,
            restitution: 0.4,
            type: "static"
        });
        app.world.gutterLeftRef.setAngle(-0.25);
        
        // add body to the world
        app.world.flipperRightRef = world.addBody(flipperR, {
            density: 10.0,
            friction: 0.3,
            restitution: 1.0,
            type: "dynamic"
        });
        
        // add body to the world
        app.world.flipperLeftRef = world.addBody(flipperL, {
            density: 10.0,
            friction: 0.3,
            restitution: 1.0,
            type: "dynamic"
        });
        
        app.world.flipperRightmoter = world.createJoint(app.world.flipperRightRef, app.world.gutterRightRef, {
            enableLimit: true,
            upperAngle: 0.44,
            lowerAngle: 0.01,
            enableMotor: true,
            maxMotorTorque: 26000,
            motorSpeed: -100,
            jointPoint: 1.4,
            basePoint: -1.8,
            collideConnected:false
        });
        
        app.world.flipperLeftmoter = world.createJoint(app.world.flipperLeftRef, app.world.gutterLeftRef, {
            enableLimit: true,
            upperAngle: 0.01,
            lowerAngle: -0.44,
            enableMotor: true,
            maxMotorTorque: 26000,
            motorSpeed: 100,
            jointPoint: -1.4,
            basePoint: 1.8,
            collideConnected:false
        });
        
        // add the ball body to the world
        app.world.ballRef = world.addBody(gameball, {
            radius: 15,
            density: 11.0,
            friction: 0.9,
            restitution: 0.4,
            type: "dynamic"
        });
        
        // add the ball body to the world
        app.world.gate1Ref = world.addBody(hole, {
            density: 7.0,
            friction: 0.3,
            restitution: 0.4,
            type: "static"
        });
        
        world.addEventListener("collision", function(e) {
            //Ti.API.info(e);
            if (e.phase == "begin") {
                
                // Interactions
                switch(e.a) {
                    case app.world.gate1Ref :
                        app.balls--;
                    
                        if(app.balls > 0) {
                            app.ui.ballsRemaining.text = 'Balls: ' + (app.balls -1);
                            
                            // setting the ball to awake false then back before/after moving it, removes all momentum the body had
                            app.world.ballRef.setAwake(false);
                            app.world.ballRef.SetTransform({
                                posX: 300,
                                posY: 400
                            });
                            app.world.ballRef.setAwake(true);
                        } else {
                            
                           // save the high score
                           if(score > app.hScore) {
                                Ti.App.Properties.setInt('high_score', score);

                                app.hScore = score;

                                app.ui.highScore.text = 'High Score: ' + app.hScore;

                            }
                                                        
                            var modal = app.ui.createStartWindow();
                            
                            modal.open();
                            alert("Game over!");
                            app.world.ballRef.setAwake(false);
                        }
                    break;
                    case app.world.plungerRef:
                        
                        //mark that its ready to shoot
                        gameball.shootMe = true;
                    break;
                } 
                
                //Score
                if(app.isIn(e.a, app.world.nodeRefs)) {
                                        
                    score = score + e.a.view.hit_value;
                    
                    app.ui.scoreBoard.text = 'Score: ' + score;
                    
                }
            }
        });
        
        app.ui.overlay.addEventListener('touchstart',function(e){ 
            // make sure we are playing :)
            world.start();
            
            
            // Flip the flipper
            app.world.flipperRightmoter.setMotorSpeed(1000);
            app.world.flipperLeftmoter.setMotorSpeed(-1000);
        
            if(gameball.shootMe) {
                impulseIntervul = setInterval(function() {
                    impulse = impulse + 150;
        
                    if(impulse >= app.MAX_IMPULSE) {
                        impulse = app.MAX_IMPULSE;
                    } else {
                        app.plungerY = app.plungerY + 2;
                        app.world.plungerRef.SetTransform({
                            posX: 297,
                            posY: app.plungerY
                        });
                    }
                    
                }, 300);
            }
        });
        
        app.ui.overlay.addEventListener('touchend',function(e){ 
        
            app.world.flipperRightmoter.setMotorSpeed(-1000);
            app.world.flipperLeftmoter.setMotorSpeed(1000);
            
            if(gameball.shootMe) {
        
                // FIRE THE GUN!!!!
                app.world.ballRef.applyLinearImpulse([0,impulse], [19,2]);
            
                //READY THE PLUNGER!!!!
                clearInterval(impulseIntervul);
                impulse = 1;
                
                //BATTLE STATIONS!!!
                app.plungerY = 550;
                app.world.plungerRef.SetTransform({
                    posX : 297,
                    posY : app.plungerY
                });
                
                // ...mark ball as shot
                gameball.shootMe = false;
            }
        });
        
        
        return world;
    };

})();