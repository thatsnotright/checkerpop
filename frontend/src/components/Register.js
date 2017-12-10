import React from 'react';
import InputMask from 'react-input-mask';
import './Register.css';

export default class PhoneForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {phoneNumber: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const newState = { };
    newState[event.target.name] = event.target.value;
    this.setState(newState);
  }

  handleSubmit(event) {
    event.preventDefault();
    let params = [];
    const phoneNumberStr = this.state.phoneNumber.replace(/[^0-9]+/g, '');
    let phoneNumber;
    try {
      phoneNumber = parseInt(phoneNumberStr, 10);
    } catch (e) {
      phoneNumber = undefined;
    }
    if (phoneNumberStr.trim().length < 10 || !phoneNumber ||
      phoneNumber > 9999999999 || phoneNumber < 2010000000) {
        return alert('Please enter a valid phone number');
    }
    params.push(phoneNumber);

    if (this.props.needsRegistration) {
      const firstName = (this.state.firstName && this.state.firstName.trim()) || '';
      const lastName = (this.state.lastName && this.state.lastName.trim()) || '';
      const email = (this.state.email && this.state.email.trim()) || '';
      if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
        return alert('Please enter a valid email address');
      }
      if (firstName.length === 0 || lastName.length === 0) {
        return alert('Please enter your name!');
      }
      params.push(firstName, lastName, email);
    }
    this.props.onSubmit(...params);
  }

  render() {
    let submitButton = (<input type="submit" value="✔-in" className="button arrow"/>);
    let registrationForm ;
    if (this.props.needsRegistration) {
      submitButton = (<input type="submit" value="Register!" className="button arrow"/>);
      registrationForm = (
        <div>
          <label htmlFor="firstName">
          <span>First Name</span>
            <input type="text" onChange={this.handleChange} name="firstName" />
          </label>
          <br/>
          <label htmlFor="lastName">
          <span>Last Name</span>
            <input type="text" onChange={this.handleChange} name="lastName" />
          </label>
          <br/>
          <label htmlFor="email">
          <span>email</span>
            <input type="text" onChange={this.handleChange} name="email"/>
          </label>
        </div>
      )
    }

    return (
      <div className="header">
        <form onSubmit={this.handleSubmit} className="registerForm">
          <label htmlFor="phoneNumber">
          <span>Phone Number</span>
            <InputMask type="text" onChange={this.handleChange} name="phoneNumber" mask="(999)999-9999" maskChar=" "/>
          </label>
          {registrationForm}
          {submitButton}
          </form>
      </div>
    );
  }
}
