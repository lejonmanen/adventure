# Adventure
## Learn JavaScript DOM manipulation

This project aims to be a framework where the developer can build an old school text-based adventure game.

Try the default game: https://lejonmanen.github.io/adventure/

Read to the end for a hint on the game...

## Files
### index.html
The HTML links the CSS and JavaScript files. Add a link to any files you create.

### blank-game.js
This is where you write your code. Copy or rename this file. Then start creating. You need to complete functions to make a game.
+ **onCommand**
	+ This global function is called from adventure.js every time the user inputs a command. Use if statements to determine how the game should respond. This function can respond directly to commands, but generally that should be done in each scene function instead.

+ **exampleScene**
	+ Define a function for each scene (room) you make. This function should respond to the command. Se the documentation in the code.

+ **setupGame**
	+ Call `Adventure.scene.create` to initialize each scene. See example-game.js for example.

Remember to remove the example game before testing.


### example-game.js
A complete, very simple game. Has two rooms (scenes) and a few commands.


### adventure.js
Defines a global `Adventure` object, with functions that control the game.



Here's the hint: try `open door`!
