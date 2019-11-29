import React, { Component } from 'react';
import { render } from 'react-dom';
import * as serviceWorker from './serviceWorker';

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
serviceWorker.register();
