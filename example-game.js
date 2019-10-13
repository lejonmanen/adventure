window.addEventListener('load', () => {
	Adventure.addCommandHandler(onCommand);
	setupGame();
})

function onCommand(command) {
	const scene = Adventure.scene.get();
	let value = '';
	if( scene === 'start' ) {
		value = startScene(command);
	} else if( scene === 'room' ) {
		value = roomScene(command);
	} else {
		value = `Sorry, that scene is not programmed yet. You won, I guess?`
	}

	if( value ) {
		return value;
	}
	return `I don't understand what you mean.`;
}

function startScene(command) {
	// First room
	let state = Adventure.scene.getState();
	if( command === 'help' ) {
		let items = Adventure.items.all();
		if( items.length > 0 ) {
			return `Are you lost? Try interacting with the items in the room! For example, the <span class="keyword">${items[0]}</span>.`;
		} else {
			return `Are you lost? Read the description of the room. What would you do in that situation?`;
		}
	}

	else if( command === 'open door' ) {
		if( state === 0 ) {
			Adventure.scene.setState(1);
			Adventure.scene.modifyDescription(`You are standing inside a small closet. The door is open. You could decide to <span class="keyword">step out</span> at any time. Unless you like it in here.`)
			Adventure.scene.modifyItems(['small key']);
			return 'You open the door. When your eyes adjust you see a normal room. It appears you have been inside a closet!';
		}
		else {
			return `The door is already open.`;
		}
	}
	else if( command === 'close door' ) {
		if( state === 0 ) {
			return `How could you close an already closed door?`;
		} else {
			return `You refuse to close the door for moral reasons.`;
		}
	}

	else if( command.startsWith('pick up') ) {
		if( state === 0 ) {
			return `It's too dark in here, you cannot see to pick up anything.`;
		} else if( command === 'pick up key' || command === 'pick up small key' ) {
			if( Adventure.items.exist('small key') ) {
				Adventure.items.pickUp('small key');
				return `You pick up the small key. Could come in handy.`;
			} else {
				return `You have already picked up the small key. Nice try, though.`;
			}
		} else {
			return `You cannot find such an item here.`;
		}
	}

	else if( ['step out', 'go out'].includes(command) ) {
		if( state === 0 ) {
			return `You thrash about wildly for a moment, but the <span class="keyword">closed door</span> heroically resist your effort.`;
		} else {
			Adventure.scene.change('room');
			return `You step out into the room.`;
		}
	}
}


function roomScene(command) {
	// Second room (victory)
	let state = Adventure.scene.getState();

	if( command === 'dance' ) {
		const NUM_DANCE_MOVES = 2;
		let r = Math.floor(Math.random() * NUM_DANCE_MOVES);

		switch( r ) {
			case 0: return `You dance through the room with abandon, like there's no tomorrow. And you deserve it!`;

			default: return `You gracefully soar through the room, in celebration of your unprecedented victory. Congratulations!`;
		}
	}

	else if( command === 'go back' || command === 'go in' || command === 'step back' ) {
		Adventure.scene.change('start');
		return `Overwhelmed by emotions, you retreat to the safety of the closet.`;
	}
}

function setupGame() {
	Adventure.scene.create('start', 'Mystery room',
		`You awake standing in a small dark room. This room appears very small. Through your senses you detect that there is a <span class="keyword">door</span> right in front of you. The door is, quite obviously, closed.`,
		[]);

	Adventure.scene.create('room', 'Room',
		`The room is brightly lit. Freedom at last! <br>Thanks for playing. Feel free to do a victory <span class="keyword">dance</span> or two. And when you're done, make your own game!`,
		[]);
	Adventure.scene.change('start');
}
