import { useState } from "react";
import "./App.css";

function App() {
	const [isElonRemoved, setIsElonRemoved] = useState(false);

	return (
		<>
			<h1>ElonAway</h1>
			<div className="card">
				<p>{isElonRemoved ? "Elon is gone!!!" : "He is back..."}</p>
				<button
					type="button"
					onClick={() => setIsElonRemoved(!isElonRemoved)}
					className={`button ${isElonRemoved ? "gone" : "back"}`}
				>
					{isElonRemoved ? "Bring Elon back" : "Remove Elon"}
				</button>
			</div>
		</>
	);
}

export default App;
