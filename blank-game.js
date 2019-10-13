// Do not change this
window.addEventListener('load', () => {
	Adventure.addCommandHandler(onCommand);
	setupGame();
})

// This function is called every time the player enters a command in the textarea. Determine which scene the player is in at the moment and call the appropriate function. This function needs to return a string, that is displayed as a response to the player. If you don't return a string, the player will not see anything.
function onCommand(command) {
	const scene = Adventure.scene.get();
	let value = '';
	if( scene === 'exampleScene' ) {
		value = exampleScene(command);
	} else {
		value = `Sorry, that scene is not programmed yet. You won, I guess?`
	}

	if( value ) {
		return value;
	}
	return `I don't understand what you mean.`;  // That does not work.
}

// Check if the command should do something.
function exampleScene(command) {
	// First room
	let state = Adventure.scene.getState();
	if( command === 'dance' ) {
		// You can do several things for each command:
		// - go to another scene
		// - change the title or description
		// - pick up, use or drop items
		// - change the state

		// Use string.startsWith to match the beginning of the command string
		// if( command.startsWith('go') )  - go out, go north, go up...

		// Use array.includes if several commands should have the same effect
		// if( ['floss', 'dance', 'tango', 'waltz'].includes(command) )
		return `You dance`;
	}

	// You don't need an else case.
}



function setupGame() {
	// Setup the scenes you will need
	// Adventure.scene.create(sceneId, title, description, items);

	// Then set the starting scene
	// Adventure.scene.change(starting scene id);
}
