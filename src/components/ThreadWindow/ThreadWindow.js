import React from 'react'
import Link from 'gatsby-link'
import './styles.scss'

class ThreadWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <div className="threadcontainer">
      <div className="pidContainer">
      <h4>{this.props.pid}</h4>
      </div>
        <textarea readOnly="true" value={this.props.code}/>
      </div>
    );
  }
}

export default ThreadWindow;
