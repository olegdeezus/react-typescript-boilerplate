import * as React from 'react'

export interface AppProps {
    /**
     * App title
     */
    title: string;
}

export class App extends React.Component<AppProps, {}> {
    render () {
        return <h1>Hello, {this.props.title} </h1>
    }
}
