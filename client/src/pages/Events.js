import React, { Component } from 'react';
import axios from 'axios';

import './Events.css';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import AuthContext from '../context/auth-context';
import EventList from '../components/Events/EventList/EventList';
import Loader from '../components/Loader/Loader';

class Events extends Component {
  state = {
    showModal: false,
    events: []
  };

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.titleElRef = React.createRef();
    this.priceElRef = React.createRef();
    this.dateElRef = React.createRef();
    this.descriptionElRef = React.createRef();
  }

  componentDidMount() {
    this.fetchEvents();
  }

  modalHandler = () => {
    this.setState(prevState => {
      return {
        showModal: !prevState.showModal
      };
    });
  };

  confirmHandler = async () => {
    this.setState({ showModal: false });
    const title = this.titleElRef.current.value;
    const price = +this.priceElRef.current.value;
    const date = this.dateElRef.current.value;
    const description = this.descriptionElRef.current.value;

    if (
      title.trim() === '' ||
      price <= 0 ||
      date.trim() === '' ||
      description.trim() === ''
    ) {
      console.error('All the inputs are required');
      return;
    }

    const event = { title, price, date, description };
    console.log(event);
    const token = this.context.token;

    const body = JSON.stringify({
      query: `
        mutation {
          createEvent(eventInput: {
            title: "${title}"
            price: ${price}
            date: "${date}"
            description: "${description}"
          }) {
            _id
            title
            description
          }
        }
      `
    });

    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token
    };

    await axios
      .post('http://localhost:5000/api', body, {
        headers: headers
      })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Can not register event!');
        }
        this.fetchEvents();
        console.log(res);
      })
      .catch(err => console.error(err));
  };

  fetchEvents = async () => {
    this.setState({ isLoading: true });
    const body = JSON.stringify({
      query: `
        query {
          events {
            _id
            title
            price
            description
            date
            creator {
              _id
            }
          }
        }
      `
    });

    const headers = {
      'Content-Type': 'application/json'
    };

    await axios
      .post('http://localhost:5000/api', body, {
        headers: headers
      })
      .then(res => {
        const events = res.data.data.events;
        this.setState({ events, isLoading: false });
      })
      .catch(err => {
        this.setState({ isLoading: false });
        console.error(err);
      });
  };

  render() {
    const eventList = this.state.events.map(event => {
      return (
        <li key={event._id} className="event-item">
          {event.title}
        </li>
      );
    });

    return (
      <React.Fragment>
        {this.state.showModal && (
          <React.Fragment>
            <Backdrop />
            <Modal
              title="Add Event"
              onCancel={this.modalHandler}
              onConfirm={this.confirmHandler}
              canConfirm
              canCancel
            >
              <form>
                <div className="form-control">
                  <label htmlFor="title">Title</label>
                  <input type="text" id="title" ref={this.titleElRef} />
                </div>
                <div className="form-control">
                  <label htmlFor="price">Price</label>
                  <input type="number" id="price" ref={this.priceElRef} />
                </div>
                <div className="form-control">
                  <label htmlFor="date">Date</label>
                  <input type="date" id="date" ref={this.dateElRef} />
                </div>
                <div className="form-control">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    rows="4"
                    ref={this.descriptionElRef}
                  />
                </div>
              </form>
            </Modal>
          </React.Fragment>
        )}
        {this.context.token && (
          <div className="events-control">
            <p>Share your own events!</p>
            <button className="btn btn-green" onClick={this.modalHandler}>
              Create Event
            </button>
          </div>
        )}
        <ul className="event-list">{eventList}</ul>
        {this.state.isLoading ? (
          <Loader />
        ) : (
          <EventList
            events={this.state.events}
            authUserId={this.context.userId}
            viewDetails={this.detailHandler}
          />
        )}
      </React.Fragment>
    );
  }
}

export default Events;
