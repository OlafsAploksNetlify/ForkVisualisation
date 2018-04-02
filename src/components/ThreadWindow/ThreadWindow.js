import React from 'react'
import Link from 'gatsby-link'
import './styles.scss'

class ThreadWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      xOffset: this.props.xOffset,
      yOffset: this.props.yOffset,
    };
  }

  getInitialState() {
    return ({
      pos: 0,
      dragging: false,
      rel: null // position relative to the cursor
    });
  }

  render() {
    return (
      <div className="threadcontainer"
        style={{
          top:this.state.yOffset,
          left: this.state.xOffset*(this.props.width+this.props.horizontalMargin),
          width: this.props.width+"px",
          height: this.props.height+"px",
        }}
          >
        <a href="/">
          <h4 style={{
            lineHeight: this.props.height + "px",
          }}>
          {this.props.pid}</h4>
        </a>
    </div>
    );
  }
}

export default ThreadWindow;
