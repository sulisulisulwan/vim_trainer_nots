import React from 'react';
import TextEditor from './TextEditor.jsx';
import ControlPanel from './ControlPanel.jsx';
const App = () => {


	return (
		<>
			<header>
				<h1>Vim trainer</h1>
			</header>
			<main>
				<div className="text-editor-wrapper">
					<TextEditor editorId={'main'}/>
				</div>
				<div className="control-panel-wrapper">
					<ControlPanel/>
				</div>
			</main>

		</>
	)
}

export default App;
