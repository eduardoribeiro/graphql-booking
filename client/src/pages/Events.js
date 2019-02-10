import React, { Component } from 'react';

import './Events.css';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';

class Events extends Component {
  state = {
    showModal: false
  };

  modalHandler = () => {
    this.setState(prevState => {
      return {
        showModal: !prevState.showModal
      };
    });
  };

  render() {
    return (
      <React.Fragment>
        {this.state.showModal && (
          <React.Fragment>
            <Backdrop />
            <Modal
              title="Add Event"
              onCancel={this.modalHandler}
              canConfirm
              canCancel
            >
              <p>Modal content!</p>
            </Modal>
          </React.Fragment>
        )}
        <div className="events-control">
          <p>Share your own events!</p>
          <button className="btn btn-green" onClick={this.modalHandler}>
            Create Event
          </button>
        </div>
      </React.Fragment>
    );
  }
}

export default Events;
