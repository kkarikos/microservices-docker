'use strict';
import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { executeJob } from '../actions';

class Main extends React.Component {
  executeJob = () => {
    this.props.executeJob();
  }
  render() {
    const styles = require('./Main.scss');
    return (
      <div id="main">
        <button onClick={this.executeJob}>executeJob</button>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
      executeJob
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
