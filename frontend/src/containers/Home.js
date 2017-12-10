import React, { Component } from 'react';
import './Home.css';
import CheckedIn from '../components/CheckedIn';
import Register from '../components/Register';

const Loading = () => {
  return (
    <div className="overlay">
      <div className="loader"></div>
    </div>
  )
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userValid: false,
      checkins: undefined,
      phoneNumber: undefined,
      points: undefined,
      firstName: undefined,
      lastName: undefined,
      user: undefined,
      loading: false
    };
    this.manageState = this.manageState.bind(this);
    this.getUser = this.getUser.bind(this);
  }

  getUser(phoneNumber) {
    fetch(`/api/user/${phoneNumber}`)
    .then(async (response) => {
      if (!response.ok || response.status === 404) {
        this.setState({ needsRegistration: true, userValid: false });
        return [false, undefined];
      }
      const body = await response.json();
      await sleep(2000);
      return [true, body];
    }).then(([valid, body]) => {
      this.setState({
        userValid: valid,
        user: body,
        loading: false
      });
    }).catch(() => {
      this.setState({loading: false});
      alert('Something went wrong!');
    })
  }

  createUser(phoneNumber, firstName, lastName, email) {
    fetch(`/api/user/${phoneNumber}`,
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ firstName, lastName, email })
    }).then(async (response) => {
      if (response.ok) {
        this.setState({
          userValid: true,
          user: await response.json(),
          loading: false,
          needsRegistration: false
        });
      }
    }).catch((err) => {
      alert(err);
      this.setState({loading: false});
    });
  }

  manageState(phoneNumber, firstName, lastName, email) {
    this.setState({loading: true});
    if (firstName === undefined) {
      return this.getUser(phoneNumber);
    }
    return this.createUser(phoneNumber, firstName, lastName, email);
  }
  render() {
    console.log(this.state.userValid)
    let form ;
    if (this.state.userValid) {
      form = (<CheckedIn {...this.state.user}></CheckedIn>);
    }
    const checkin = (<Register onSubmit={this.manageState} needsRegistration={this.state.needsRegistration}></Register>);
    const loading = this.state.loading? <Loading></Loading> : null;
    return (
      <div className="Home">
        {loading}
        {checkin}
        {form}
      </div>
    );
  }
}

export default Home;
