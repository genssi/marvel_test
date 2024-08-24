import React, { Component } from "react";

// 1)
const Container = (props) => {
    return (
        <div className="container">
            {
                props.children
            }
        </div>
    )
}

class App extends Component {
    render() {
        return (
            <Container>
                <h1>Hello world!</h1>
                <p>test porps children in React</p>
            </Container>
        )
    }
}

// 2)
const Card = (props) => {
    return (
        <div 
            className="card"
            style={[{'border': '1px solid black'}, {'padding': '5px'}]}>
                {props.children}
        </div>
    )
}

const App = () => {
    return (
        <div>
            <Card>
                <h1>Hello world</h1>
                <img src="./img/img" alt="img" />
                <p>Lorem ipsum dolor sit amet.</p>
            </Card>
        </div>
    )
}

//3)

class Toggle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
        }
    }

    toggleVisibility = () => {
        this.setState({
            isVisible: true
        })
    }

    render() {
        return (
            <div>
                <button onClick={this.toggleVisibility}>
                    {this.state.isVisible ? 'Hide' : 'Show'}
                </button>
                {this.state.isVisible && <div>{this.props.children}</div>}
            </div>
        )
    }
}