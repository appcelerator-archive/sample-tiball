(function() {
    app.ui = {
        overlay : Ti.UI.createView({
            backgroundColor : 'transparent'
        })
    };

    app.ui.createStartWindow = function() {

        var modal = Ti.UI.createWindow({
            backgroundImage: '/images/bg.png'
        });

        var instructions = Ti.UI.createLabel({
        	top:50,
        	width:300,
        	height:20,
        	color:'white',
        	text: 'Instructions',
        	textAlign: 'center',
        	font: {fontSize:25, fontWeight:'bold'}
        });

		modal.add(instructions);

        var message = Ti.UI.createLabel({
        	top:85,
        	width:300,
        	height:'auto',
        	color:'white',
        	font: {fontWeight:'bold'},
        	text: 'Plunger - Tap the screen anywhere and hold, release to shoot the ball.\n\nFlippers - Tap the screen to flip the flippers.\n\nHigh Score - The high score is saved through closing the app to keep a running high score.'
        });
		modal.add(message);
		
        var newGame = Ti.UI.createButton({
            title : 'New Game',
            width : 200,
            height : 40,
            bottom : 20
        });
        modal.add(newGame);

        newGame.addEventListener('click', function() {
            app.world.ball.SetTransform({
                posX : 300,
                posY : 420
            });
            app.world.ball.setAwake(true);

            app.balls = 3;
            app.ui.ballsRemaining.text = 'Balls: 2';
            score = 0;
            app.ui.scoreBoard.text = 'Score: 0';

            modal.close();
        });
        return modal;
    }

    app.ui.createGame = function() {

        var window = Ti.UI.createWindow({
            backgroundImage : '/images/gamebg.png',
            fullscreen : true
        });

        window.gameBoard = Ti.UI.createView({
            height : 440,
            bottom : 0,
            backgroundColor : 'transparent'
        });
        window.add(window.gameBoard);

        app.ui.ballsRemaining = Ti.UI.createLabel({
            top : 0,
            left : 0,
            height : 20,
            width : 'auto',
            color : 'white',
            text : 'Balls: 2'
        });
        window.add(app.ui.ballsRemaining);

        app.ui.scoreBoard = Ti.UI.createLabel({
            top : 0,
            right : 0,
            height : 20,
            width : 'auto',
            color : 'white',
            text : 'Score: 0'
        });
        window.add(app.ui.scoreBoard);

        app.ui.highScore = Ti.UI.createLabel({
            top : 0,
            left : 65,
            height : 20,
            width : 'auto',
            color : 'white',
            text : 'High Score: ' + app.hScore
        });
        window.add(app.ui.highScore);

        window.add(app.ui.overlay);

        return window;
    };

    app.ui.startGame = function() {

        var win = app.ui.createGame();
        win.open();

        var world = app.createWorld(win.gameBoard);
        world.start();

    };
})();
