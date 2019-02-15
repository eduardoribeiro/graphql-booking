import React, { Component } from 'react';
import axios from 'axios';

import Loader from '../components/Loader/Loader';
import AuthContext from '../context/auth-context';

class Bookings extends Component {
  state = {
    isLoading: false,
    bookings: []
  };

  static contextType = AuthContext;

  componentDidMount() {
    this.fetchBookings();
  }

  fetchBookings = async () => {
    this.setState({ isLoading: true });
    const body = JSON.stringify({
      query: `
        query {
          bookings {
            _id
            createdAt
            event {
              _id
              title
              date
            }
          }
        }
      `
    });

    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.context.token
    };

    await axios
      .post('http://localhost:5000/api', body, {
        headers: headers
      })
      .then(res => {
        const bookings = res.data.data.bookings;
        this.setState({ bookings, isLoading: false });
      })
      .catch(err => {
        this.setState({ isLoading: false });
        console.error(err);
      });
  };

  render() {
    return (
      <React.Fragment>
        {this.state.isLoading && <Loader />}
        <ul>
          {this.state.bookings.map(booking => (
            <li key={booking._id}>{booking.event.title}</li>
          ))}
        </ul>
      </React.Fragment>
    );
  }
}

export default Bookings;
