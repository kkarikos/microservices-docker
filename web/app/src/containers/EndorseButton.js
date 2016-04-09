'use strict';
import React from 'react';
import classNames from 'classnames';

export class EndorseButton extends React.Component {
  render() {
    const styles = require('./EndorseButton.scss');

    const clickHandler = this.props.onClick ? this.props.onClick : () => {};

    return <div onClick={clickHandler} className={classNames(styles.button, { selected: this.props.selected })}>
      <div className={classNames(styles.slug, styles[this.props.slug])}></div>
      <div className={styles.label}>
        ... {this.props.action}
      </div>
    </div>;
  }
}
