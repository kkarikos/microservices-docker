'use strict';
import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateValue, saveEndorsement } from '../actions';
import TextField from 'material-ui/lib/text-field';
import Slider from 'material-ui/lib/slider';
import RaisedButton from 'material-ui/lib/raised-button';
import AutoComplete from 'material-ui/lib/auto-complete';

class Main extends React.Component {
  render() {
    const styles = require('./Main.scss');
    const { endorsement } = this.props;

    return (
      <div className={styles.main} id="main">
        <AutoComplete
            onNewRequest={this.props.updateValue.bind(this, 'endorsed')}
            onUpdateInput={this.props.updateValue.bind(this, 'endorsed')}
            searchText={endorsement.get('endorsed')}
            fullWidth={true}
            hintText="@slack"
            dataSource={this.props.users}
        />
        <AutoComplete
          onNewRequest={this.props.updateValue.bind(this, 'action')}
          onUpdateInput={this.props.updateValue.bind(this, 'action')}
          fullWidth={true}
          floatingLabelText=""
          searchText={endorsement.get('action')}
          hintText="...keitti hyvät kahvit"
          filter={AutoComplete.caseInsensitiveFilter}
          dataSource={this.props.fruits}
        />
        <RaisedButton onClick={this.props.saveEndorsement} secondary={true} label="Lähetä kehut" />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return state.props;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
      updateValue,
      saveEndorsement
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
