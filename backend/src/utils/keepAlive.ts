import fetch from 'node-fetch';

export const keepAlive = () => {
	setInterval(async () => {
		try {
			await fetch('https://codecarrers.onrender.com');
			console.log('Pinged itself');
		} catch (error) {
			console.log('Error while pinging', error);
		}
	}, 5 * 60 * 1000);
};
