(function() {

    app.world = {
        nodes : []
    };

    app.createWorld = function(gameBoard) {

        // create the world, using view as the surface
        var world = box2d.createWorld(gameBoard);

        // This will be used to shoot the ball "harder" the longer the user holds the plunger
        var impulseIntervul, impulse = 1, score = 0;

        // Set the gravity so that the ball "falls" correctly
        world.setGravity(0.0, -5.91);

        var nodeSettings = {
            backgroundImage : "/images/bumper1000.png",
            borderRadius : 15,
            width : 30,
            height : 30,
        };

        var node = [{
            left : 35,
            top : 105
        }, {
            left : 130,
            top : 75
        }, {
            left : 210,
            top : 105
        }, {
            left : 55,
            top : 200
        }, {
            left : 190,
            top : 200
        }];

        for( i = 0; i < node.length; i++) {

            nodeSettings.left = node[i].left;
            nodeSettings.top = node[i].top;
            nodeSettings.backgroundImage = (i % 2 == 0) ? '/images/bumper10.png' : '/images/bumper50.png';
            nodeSettings.hit_value = (i % 2 == 0) ? 10 : 50;

            app.world.nodes[i] = world.addBody(Ti.UI.createView(nodeSettings), {
                radius : 15,
                density : 10.0,
                friction : 0.3,
                restitution : 1.5,
                type : "static"
            });

        }

        app.world.rightWall = world.addBody(Ti.UI.createView({
            backgroundColor : "transparent",
            width : 1,
            right : 4,
            height : 440,
            bottom : 0
        }), {
            density : 12.0,
            friction : 0.3,
            restitution : 0.4,
            type : "static"
        });

        app.world.leftWall = world.addBody(Ti.UI.createView({
            backgroundColor : "transparent",
            width : 2,
            left : 1,
            height : 440,
            bottom : 0
        }), {
            density : 10.0,
            friction : 0.3,
            restitution : 0.4,
            type : "static"
        });

        app.world.topWall = world.addBody(Ti.UI.createView({
            backgroundColor : "transparent",
            width : 310,
            height : 2,
            top : 0
        }), {
            density : 12.0,
            friction : 0.3,
            restitution : 0.4,
            type : "static"
        });

        app.world.wallCorner = world.addBody(Ti.UI.createView({
            backgroundColor : "transparent",
            width : 160,
            height : 2,
            left : 0,
            top : 10
        }), {
            density : 10.0,
            friction : 0.3,
            restitution : 0.4,
            type : "static"
        });
        app.world.wallCorner.setAngle(0.2);

        app.world.LsideDeflector = world.addBody(Ti.UI.createView({
            backgroundColor : "transparent",
            width : 40,
            left : 8,
            height : 2,
            top : 280
        }), {
            density : 10.0,
            friction : 0.3,
            restitution : 0.4,
            type : "static"
        });
        app.world.LsideDeflector.setAngle(-0.7);

        app.world.RsideDeflector = world.addBody(Ti.UI.createView({
            backgroundColor : "transparent",
            width : 40,
            right : 45,
            height : 2,
            top : 280
        }), {
            density : 10.0,
            friction : 0.3,
            restitution : 0.4,
            type : "static"
        });
        app.world.RsideDeflector.setAngle(0.7);

        // add body to the world
        app.world.shoot = world.addBody(Ti.UI.createView({
            backgroundColor : "transparent",
            width : 2,
            right : 38,
            height : 362,
            bottom : 0
        }), {
            density : 1.0,
            friction : 0.1,
            restitution : 0.1,
            type : "static"
        });

        app.world.shootHook = world.addBody(Ti.UI.createView({
            backgroundColor : "transparent",
            height : 4,
            width : 40,
            bottom : 372,
            right : 37
        }), {
            density : 12.0,
            friction : 0.3,
            restitution : 0.4,
            type : "static"
        });
        app.world.shootHook.setAngle(-0.60);

        // add body to the world
        app.world.plunger = world.addBody(Ti.UI.createView({
            backgroundImage : "/images/spring.png",
            width : 32,
            right : 7,
            height : 35,
            bottom : 0
        }), {
            density : 10.0,
            friction : 0.3,
            restitution : 0.4,
            type : "static"
        });

        // add body to the world
        app.world.deflector = world.addBody(Ti.UI.createView({
            backgroundColor : "transparent",
            width : 50,
            right : -10,
            height : 2,
            top : 15
        }), {
            density : 5.0,
            friction : 0.3,
            restitution : 0.4,
            type : "static"
        });
        app.world.deflector.setAngle(-1);

        // add body to the world
        app.world.gutterRight = world.addBody(Ti.UI.createView({
            backgroundColor : "transparent",
            width : 5,
            right : 75,
            height : 15,
            bottom : 50
        }), {
            density : 10.0,
            friction : 0.3,
            restitution : 0.4,
            type : "static"
        });
        app.world.gutterRight.setAngle(0.25);

        // add body to the world
        app.world.gutterLeft = world.addBody(Ti.UI.createView({
            backgroundColor : "transparent",
            width : 5,
            left : 40,
            height : 15,
            bottom : 50
        }), {
            density : 10.0,
            friction : 0.3,
            restitution : 0.4,
            type : "static"
        });
        app.world.gutterLeft.setAngle(-0.25);

        // add body to the world
        app.world.flipperRight = world.addBody(Ti.UI.createView({
            backgroundImage : "/images/flipper_r.png",
            width : 66,
            right : 55,
            height : 21,
            bottom : 10
        }), {
            density : 10.0,
            friction : 0.3,
            restitution : 1.0,
            type : "dynamic"
        });

        app.world.flipperRightmoter = world.createJoint(app.world.flipperRight, app.world.gutterRight, {
            enableLimit : true,
            upperAngle : 0.44,
            lowerAngle : 0.01,
            enableMotor : true,
            maxMotorTorque : 26000,
            motorSpeed : -100,
            jointPoint : 1.4,
            basePoint : -1.8,
            collideConnected : false
        });

        // add body to the world
        app.world.flipperLeft = world.addBody(Ti.UI.createView({
            backgroundImage : "/images/flipper_l.png",
            width : 66,
            left : 10,
            height : 21,
            bottom : 10
        }), {
            density : 10.0,
            friction : 0.3,
            restitution : 1.0,
            type : "dynamic"
        });

        app.world.flipperLeftmoter = world.createJoint(app.world.flipperLeft, app.world.gutterLeft, {
            enableLimit : true,
            upperAngle : 0.01,
            lowerAngle : -0.44,
            enableMotor : true,
            maxMotorTorque : 26000,
            motorSpeed : 100,
            jointPoint : -1.4,
            basePoint : 1.8,
            collideConnected : false
        });

        // add the ball body to the world
        app.world.ball = world.addBody(Ti.UI.createView({
            backgroundImage : "/images/ball.png",
            borderRadius : 15,
            width : 27,
            height : 27,
            right : 8,
            bottom : 50,
            shootMe : true
        }), {
            radius : 15,
            density : 11.0,
            friction : 0.9,
            restitution : 0.4,
            type : "dynamic"
        });

        // This element is our "hole" we add this so we can control the collision of the ball
        // with an element below the flippers, this will be used to reset the ball
        app.world.hole = world.addBody(Ti.UI.createView({
            backgroundColor : "transparent",
            width : 286,
            left : 0,
            height : 5,
            bottom : 0
        }), {
            density : 7.0,
            friction : 0.3,
            restitution : 0.4,
            type : "static"
        });

        world.addEventListener("collision", function(e) {
            //Ti.API.info(e);
            if(e.phase == "begin") {

                // Interactions
                switch(e.a) {
                    case app.world.hole :
                        app.balls--;

                        if(app.balls > 0) {
                            app.ui.ballsRemaining.text = 'Balls: ' + (app.balls - 1);

                            // setting the ball to awake false then back before/after moving it, removes all momentum the body had
                            app.world.ball.setAwake(false);
                            app.world.ball.SetTransform({
                                posX : 300,
                                posY : 400
                            });
                            app.world.ball.setAwake(true);
                        } else {

                            var modal = app.ui.createStartWindow();

                            modal.open();

                            if(score > app.hScore) {
                                alert('YOU BEAT THE HIGH SCORE!!');
                            } else {
                                alert("Game over!");
                            }

                            // save the high score
                            if(score > app.hScore) {
                                Ti.App.Properties.setInt('high_score', score);

                                app.hScore = score;

                                app.ui.highScore.text = 'High Score: ' + app.hScore;

                            }

                            app.world.ball.setAwake(false);
                        }
                        break;
                    case app.world.plunger:

                        //mark that its ready to shoot
                        app.world.ball.view.shootMe = true;
                        break;
                }

                //Score
                if(app.isIn(e.a, app.world.nodes)) {
                    score = score + e.a.view.hit_value;

                    app.ui.scoreBoard.text = 'Score: ' + score;

                }
            }
        });

        app.ui.overlay.addEventListener('touchstart', function(e) {
            // make sure we are playing :)
            world.start();

            // Flip the flipper
            if(e.x > 160) {
                app.world.flipperRightmoter.setMotorSpeed(1000);
            } else {
                app.world.flipperLeftmoter.setMotorSpeed(-1000);
            }

            if(app.world.ball.view.shootMe) {
                impulseIntervul = setInterval(function() {
                    impulse = impulse + 150;

                    if(impulse >= app.MAX_IMPULSE) {
                        impulse = app.MAX_IMPULSE;
                    } else {
                        app.plungerY = app.plungerY + 2;
                        app.world.plunger.SetTransform({
                            posX : 297,
                            posY : app.plungerY
                        });
                    }

                }, 300);
            }
        });

        app.ui.overlay.addEventListener('touchend', function(e) {

            app.world.flipperRightmoter.setMotorSpeed(-1000);
            app.world.flipperLeftmoter.setMotorSpeed(1000);

            if(app.world.ball.view.shootMe) {

                // FIRE THE GUN!!!!
                app.world.ball.applyLinearImpulse([0, impulse], [19, 2]);

                //READY THE PLUNGER!!!!
                clearInterval(impulseIntervul);
                impulse = 1;

                //BATTLE STATIONS!!!
                app.plungerY = 550;
                app.world.plunger.SetTransform({
                    posX : 297,
                    posY : app.plungerY
                });

                // ...mark ball as shot
                app.world.ball.view.shootMe = false;
            }
        });
        return world;
    };
})();
