import React, { Component } from "react";
import PropTypes from "prop-types";

class Form extends Component {
    static propTypes = {
        endpoint: PropTypes.string.isRequired // gets mapped in tag
    };

    // defaults
    state = {
        name: "",
        email: "",
        message: ""
    };

    handleChange = e => {
        this.setState({
            [e.target.name]: e.target.value 
        });
    };

    handleSubmit = e => {
        e.preventDefault();
        const { name, email, message } = this.state;
        const lead = { name, email, message };
        const conf = {
            method: "post",
            body: JSON.stringify(lead),
            headers: new Headers({
                "Content-Type": "application/json"
            })
        };

        fetch(this.props.endpoint, conf)
            .then(res => console.log(res));

        // clear form after submission
        this.setState({
            name: "",
            email: "",
            message: ""
        });
    };
        
    render() {
        const { name, email, message } = this.state;

        return (
            <div className="column">
              <form onSubmit={this.handleSubmit}>
                <div className="field">
                  <label className="label">Name</label>
                  <div className="input">
                    <input className="input"
                           name="name"
                           type="text"
                           value={name}
                           onChange={this.handleChange}
                           required />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Email</label>
                  <div className="control">
                    <input className="input"
                           name="email" 
                           type="email"
                           value={email}
                           onChange={this.handleChange}
                           required/>
                  </div>
                </div>
                <div className="field">
                  <label className="label">Message</label>
                  <div className="control">
                    <textarea className="textarea"
                              type="text"
                              name="message"
                              onChange={this.handleChange}
                              value={message}
                              required/>
                  </div>
                </div>
                <div className="control">
                  <button className="button is-info">
                    Send Message
                  </button>
                </div>
              </form>
            </div>
        );
    }
}

export default Form;
