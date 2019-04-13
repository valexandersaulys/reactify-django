import React, { Component } from "react";
import PropTypes from "prop-types";

class DataProvider extends Component {
    // define the property types expected for mapped props
    static propTypes = {
        endpoint: PropTypes.string.isRequired,
        render: PropTypes.func.isRequired
    };

    state = {
        data: [],
        loaded: false,
        placeholder: "Loading..."
    };

    componentDidMount() {
        fetch(this.props.endpoint)
            .then(res => {
                if (res.status !== 200) 
                    return this.setState({
                        placholder: "Something went wrong"
                    });
                else
                    return res.json();

            })
            .then(data => this.setState({
                data: data,
                loaded: true
            }));
    }

    render() {
        const { data, loaded, placeholder } = this.state;

        return loaded ? this.props.render(data) : <p>{placeholder}</p>;
    }
}

export default DataProvider;
