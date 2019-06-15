/* Made by David Andersson, 2019-06
Contribute to this on GitHub: repo here
This project is made for educational purposes with the goal of teaching students JavaScript basics. It uses the MIT license. If you make something good, please consider submitting a pull request.
*/

/* Students: use the functions exposed by the Adventure object to build your game.

*/
// Register Adventure as a global object that contains all the functions you should use.
window.Adventure = {
	addCommandHandler: handler => { settings.commandHandler = handler; },
	inventory: {
		clear: () => settings.items = [],
		add: itemName => settings.items.push(itemName),
		remove: itemName => settings.items = settings.items.filter(i => i !== itemName)
	},
	scene: {
		get: () => settings.currentScene,
		getState: () => settings.scenes[settings.currentScene].state,
		create: (sceneId, title, description, items) => {
			if( !sceneId || !title || !description ) {
				showError('You must call Adventure.scene.create with proper values for the parameters sceneId, title and description. Values cannot be undefined, null or empty strings. Use console.log and typeof to find out which you used!');
				return;
			} else if( settings.scenes[sceneId] ) {
				showError(`There already is a scene with the id "${sceneId}". Invent a new, unique id!`);
				return;
			}
			settings.scenes[sceneId] = { title, description, items };
		},
		modifyTitle: title => settings.scenes[settings.currentScene].title = title,
		modifyDescription: desc => settings.scenes[settings.currentScene].description = desc,
		modifyItems: items => settings.scenes[settings.currentScene].items = items,
		setState: state => settings.scenes[settings.currentScene].state = state,
		change: newScene => {
			settings.currentScene = newScene;
			refresh();
		}
	},
	items: {
		exist: itemName => !!(settings.scenes[settings.currentScene].items.find(i => i === itemName)),
		pickUp: itemName => {
			// if item exists in scene, pick it up
			const scene = settings.scenes[settings.currentScene];
			let it = scene.items.find(i => i === itemName);
			if( !it ) {
				throw new Error(`You tried to pick up "${itemName}", but it doesn't exist in the current scene.`);
			}
			scene.items = scene.items.filter(i => i !== itemName);
			settings.items.push(itemName);
			// appendMessage(``)
			refresh();
		},
		drop: itemName => {

		}
	}
}
const settings = {
	items: [],
	scenes: {
		"start": {
			title: `Mystery room`,
			description: `You awake standing in a small dark room. This room appears very small. Through your senses you detect that there is a <span class="keyword">door</span> right in front of you. The door is, quite obviously, closed.`,
			items: [],
			state: 0  // used to remember if the door has been opened or not
		},
		"room": {
			title: `Room`,
			description: `The room is brightly lit. Freedom at last! <br>Thanks for playing. Feel free to do a victory <span class="keyword">dance</span> or two. And when you're done, make your own game!`,
			items: []
		}
	},
	currentScene: 'start'
}

// Initialization
window.addEventListener('load', () => {
	console.log('hello');

	const textarea = document.getElementById('commands');
	const messageBox = document.getElementById('messages');
	textarea.addEventListener('keydown', event => onCommandKeyDown(event, textarea, messageBox));

	// Clear errors
	hideError();

	// Load first scene
	refresh();

	// Quality of life
	textarea.focus();

	// debug
	document.querySelector('#refresh').addEventListener('click', refresh);
})

// When user types anything in the command textarea
function onCommandKeyDown(event, textarea, messageBox) {
	if( event.isComposing || event.keyCode === 229 ) {
		return;
	} else if( event.keyCode !== 13 ) {
		return;
	}
	event.preventDefault();
	let input = textarea.value.toLowerCase();
	let output = settings.commandHandler(input);
	if( !output ) {
		showError('Your command handler function must always return a non-empty string.')
	}
	textarea.value = '';
	appendMessage(output, input);
	// messageBox.innerHTML = `<span class="echo">&gt; ${input}</span><br>${output}<br><br>` + messageBox.innerHTML;
	refresh();
}

// Used to print a message after the user typed a command
function appendMessage(message, input = false) {
	const messageBox = document.getElementById('messages');
	const firstChild = messageBox.childNodes[0];
	if( input ) {
		// Wrap HTML in a div element
		// Then make the span element clickable
		const textarea = document.getElementById('commands');
		let div = document.createElement('div');
		div.innerHTML = `<span class="echo">${input}</span><br>${message}<br><br>`;
		div.querySelector('.echo').addEventListener('click', () => {
			textarea.value = input;
			textarea.focus();
		});
		messageBox.insertBefore(div, firstChild);

	} else {
		let div = document.createElement('div');
		div.innerHTML = `${message}<br><br>`;
		messageBox.insertBefore(div, firstChild);
	}
}

function refresh() {
	// Redraw all elements of the UI
	const s = settings.scenes[settings.currentScene];
	const qs = document.querySelector.bind(document);
	qs('#roomTitle').innerText = s.title;
	qs('#roomDescription').innerHTML = s.description;
	qs('#roomItems').innerHTML = printItems(s.items);
	// qs('#messages').innerHTML = `Enter command.`;
	qs('#inventory').innerHTML = printInventory(settings.items)
}

// Items that the player is carrying
function printInventory(items) {
	if( !items || (typeof items.length) !== 'number' || items.length < 1 ) {
		return "You aren't carrying anything.";
	}
	let its = items.map(i => `<li><span class="keyword">${properArticle(i)} ${i}</span></li>`).join('');

	return `You are carrying: <ul>${its}</ul>`;
}

// Items that are present in a scene
function printItems(items) {
	if( !items || (typeof items.length) !== 'number' || items.length < 1 ) {
		return "There is nothing here.";
	} else if( items.length === 1 ) {
		let it = items[0];
		return `There is ${properArticle(it)} <span class="keyword">${it}</span> here.`;
	} else {
		let its = '';
		for( let i=0; i<items.length; i++ ) {
			let it = items[i];
			let kw = `<span class="keyword">${it}</span>`;
			if( i === 0 ) {
				its += `${properArticle(it)} ${kw}`;
			} else if( i === items.length - 1 ) {
				its += ` and ${properArticle(it)} ${kw}`;
			} else {
				its += `, ${properArticle(it)} ${kw}`;
			}
		}
		return `There is ` + its + ` here.`;
	}
}

// Whether to prefix with 'a' or 'an'
function properArticle(word) {
	const vowels = 'aeiouy';
	let first = word.charAt(0);
	if( vowels.includes(first) ) {
		return 'an';
	} else {
		return 'a';
	}
}


function showError(message) {
	let el = document.querySelector('body > h1.error');
	el.innerText = message;
	el.style ='';
	throw new Error(message);
}
function hideError() {
	document.querySelector('body > h1.error').style ='display: none;';
}
