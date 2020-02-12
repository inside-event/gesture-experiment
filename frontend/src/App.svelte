<script>
	import { onMount } from 'svelte'

	const socket = new WebSocket('wss://gesture-experiment.ngrok.io/ws');

	export let name;
	let messages = []
	let isCapturingMove = false
	let gestureLabel = ''

	const handleTouchstart = () => isCapturingMove = true
	const handleTouchend = () => isCapturingMove = false

	const handleTrain = accelerometer => e => {
			const { x, y, z} = accelerometer

			if (!isCapturingMove || gestureLabel === '') {
				messages = ['No train'];
				return
			}

			socket.send(JSON.stringify({ gestureLabel, x, y, z }))

			messages = ['New pos']
				.concat("Acceleration along the X-axis " + accelerometer.x)
				.concat("Acceleration along the Y-axis " + accelerometer.y)
				.concat("Acceleration along the Z-axis " + accelerometer.z)
		}

	onMount(async () => {
		messages = messages.concat('WILL LOAD ACCELEROMETER')
		const accelerometer = new Accelerometer({frequency: 60});

		accelerometer.addEventListener('reading', handleTrain(accelerometer));
		accelerometer.start();
	});
</script>

<main>
	<h1>Hello {name}!</h1>
	<button on:touchstart={handleTouchstart} on:touchend={handleTouchend}>TRAIN</button>
	<input bind:value={gestureLabel} placeholder="gesture label">
	<main>Messages: {messages}</main>

	<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
		-webkit-touch-callout: none;
		-webkit-user-select: none;
		-khtml-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
		cursor: default;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
