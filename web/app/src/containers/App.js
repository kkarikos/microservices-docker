import React from 'react';

export default class App extends React.Component {
  constructor(props){
    super(props);
  }
  
  render() {
    return (
      <div className='root'>
        <div className="content">
          {this.props.children}
        </div>
      </div>
    );
  }
}
