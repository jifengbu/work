import React, { Component } from 'react';
import { render } from 'react-dom';

class App extends Component {
    render() {
        return (
            <div>
                <div>这是关于页</div>
                <div>this is about page</div>
            </div>
        );
    }
}

render(<App />, document.getElementById('app'));
