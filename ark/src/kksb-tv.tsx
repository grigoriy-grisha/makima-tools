import React from 'react';
import ReactDOM from 'react-dom';
import DynamicModule from "../shared/DynamicModule";

const App = () => {
    return <DynamicModule path="/loan-tasks-static/loan-tasks" name="@kksb/loan-tasks" />
}

ReactDOM.render(<App />, document.getElementById('root'));
