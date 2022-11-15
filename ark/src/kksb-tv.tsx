import React, {useEffect} from 'react';
import ReactDOM from 'react-dom';

const App = () => {
    useEffect(() => {
        console.log(fetch('/loan-tasks-static/loan-tasks/importmap.json').then(r => r.json()).then(console.log));
    },[])
    return <div>hello</div>
}

ReactDOM.render(<App />, document.getElementById('root'));
