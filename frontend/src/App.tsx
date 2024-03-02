import { Button } from './components/ui/button';

function App() {
	const login = async () => {
		const res = await fetch('http://localhost:3000/login/github', {
			credentials: 'include',
			mode: 'no-cors',
		});
		const data = await res.json();
		console.log(data);
	};

	return (
		<div>
			<Button onClick={login}>Log In</Button>
		</div>
	);
}

export default App;
