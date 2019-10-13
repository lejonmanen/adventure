/* Made by David Andersson, 2019-06
Contribute to this on GitHub: https://github.com/lejonmanen/adventure
This project is made for educational purposes with the goal of teaching students JavaScript basics. It uses the MIT license. If you make something good of it, please consider submitting a pull request.
*/

/* Students: use the functions exposed by the Adventure object to build your game.
Check out the files blank-game.js and example-game.js!
When you feel ready to begin, replace the script file example-game.js in index.html (line 9) with your own game file.

Global functions defined in this file:
onCommandKeyDown
appendMessage
refresh
printInventory
printItems
properArticle
showError
hideError
*/

// Crete a global variable named Adventure; an object that contains all the functions you need to control the game.
window.Adventure = {
	// Add a callback function that is called every time the player enters a new command
	addCommandHandler: handler => { settings.commandHandler = handler; },

	// Control the carried items display
	inventory: {
		clear: () => settings.items = [],
		add: itemName => settings.items.push(itemName),
		remove: itemName => settings.items = settings.items.filter(i => i !== itemName)
	},

	// The scene represents the current room
	scene: {
		get: () => settings.currentScene,
		getState: () => settings.scenes[settings.currentScene].state,

		// Creates a new scene
		// sceneId: a unique string
		// title: what you want the heading to show
		// description: what you want the player to know
		// items: array of items (strings) that are in this scene from the start
		create: (sceneId, title, description, items) => {
			if( !sceneId || !title || !description ) {
				showError('You must call Adventure.scene.create with proper values for the parameters sceneId, title and description. Values cannot be undefined, null or empty strings. Use console.log and typeof to find out which you used!');
				return;
			} else if( settings.scenes[sceneId] ) {
				showError(`There already is a scene with the id "${sceneId}". Invent a new, unique id!`);
				return;
			}
			settings.scenes[sceneId] = { title, description, items, state: 0 };
		},

		// You can change the scene
		modifyTitle: title => settings.scenes[settings.currentScene].title = title,
		modifyDescription: desc => settings.scenes[settings.currentScene].description = desc,
		modifyItems: items => settings.scenes[settings.currentScene].items = items,

		// State can be used to remember if the player has changed anything in the current scene
		setState: state => settings.scenes[settings.currentScene].state = state,
		change: newScene => {
			settings.currentScene = newScene;
			refresh();
		},
		getDescription: () => settings.scenes[settings.currentScene].description
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
			let item = settings.items.find(i => i === itemName);
			Adventure.inventory.remove(itemName);
			settings.items = [...settings.items, itemName];
		},
		all: () => settings.scenes[settings.currentScene].items
	}
}

// The settings object stores all the data of the adventure.
// Add scenes here using the Adventure object:
// Adventure.scenes.create(sceneId, title, description, items)
const settings = {
	items: [],
	scenes: { },
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

	// Quality of life - start the game with the textarea focused
	textarea.focus();
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
	if( !s ) return;
	const qs = q => document.querySelector(q);
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
	el.style = '';
	throw new Error(message);
}
function hideError() {
	document.querySelector('body > h1.error').style = 'display: none;';
}
