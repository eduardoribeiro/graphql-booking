import React, { Component } from 'react';
import axios from 'axios';

import Loader from '../components/Loader/Loader';
import AuthContext from '../context/auth-context';
import BookingList from '../components/Bookings/BookingList/BookingList';

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

  cancelBookingHandler = async bookingId => {
    this.setState({ isLoading: true });
    const body = JSON.stringify({
      query: `
        mutation {
          cancelBooking(bookingId: "${bookingId}") {
            _id
            title
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
        this.setState(prevState => {
          const updatedBookings = prevState.bookings.filter(booking => {
            return booking._id !== bookingId;
          });
          return { bookings: updatedBookings, isLoading: false };
        });
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
        <BookingList
          bookings={this.state.bookings}
          onDelete={this.cancelBookingHandler}
        />
      </React.Fragment>
    );
  }
}

export default Bookings;
