'use strict';
import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateValue, saveEndorsement, selectSlug } from '../actions';
import TextField from 'material-ui/lib/text-field';
import Slider from 'material-ui/lib/slider';
import RaisedButton from 'material-ui/lib/raised-button';
import AutoComplete from 'material-ui/lib/auto-complete';
import { EndorseButton } from './EndorseButton';

class Main extends React.Component {
  handleSlugSelect(slug, action) {
    this.props.updateValue('action', action);
    this.props.updateValue('slug', slug);
    this.props.selectSlug(slug);
  }

  render() {
    const styles = require('./Main.scss');
    const { endorsement } = this.props;
    const f = () => { console.log('boom')};
    return (
      <div className={styles.main} id="main">
        <h1 className={styles.title}>Kiitos!</h1>
        <AutoComplete
            onNewRequest={this.props.updateValue.bind(this, 'endorsee')}
            onUpdateInput={this.props.updateValue.bind(this, 'endorsee')}
            searchText={endorsement.get('endorsee')}
            fullWidth={true}
            hintText="@slack"
            dataSource={this.props.users}
        />
        {
          /*
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
          */
        }

        {this.props.defaultEndorsements.toJS().map((item) => {
           return <EndorseButton onClick={this.handleSlugSelect.bind(this, item.slug, item.action)}
                                 selected={this.props.selectedSlug == item.slug}
                                 key={item.slug} slug={item.slug} action={item.action}/>
          }
        )}
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
      saveEndorsement,
      selectSlug
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
