import React from 'react'
import Link from 'gatsby-link'
import './styles.scss'


//Parameters:
// pid
// xOffset - nodeHeight in tree
// yOffset - constant
// height - window height
// width - window width
// parentVerticalOffset - selfexplanatory
// childIndex - which child is it (first, second, ...)?
// lineWidth - width of connecting lines
// horizontalMargin - margin between windows
class ThreadWindow extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      xOffset: this.props.xOffset*(this.props.width+this.props.horizontalMargin),
      yOffset: this.props.yOffset,
    };
    // console.log(this.props.childIndex);
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      xOffset: this.props.xOffset*(this.props.width+this.props.horizontalMargin),
      yOffset: this.props.yOffset,
    });
  }

  getInitialState() {
    return ({
      pos: 0,
      dragging: false,
      rel: null // position relative to the cursor
    });
  }

  createVerticalLine() {
    console.log(this.props.pid + " " + this.props.parentVerticalOffset);
    let topOffset = (this.props.parentVerticalOffset + this.props.height) - this.state.yOffset;
    // console.log(topOffset);
    return(
      [<div className="line"
        key={"vertical"}
        style={{
          height: this.state.yOffset-(this.props.parentVerticalOffset+this.props.height/2) + this.props.lineWidth,
          width: this.props.lineWidth+"px",
          top: topOffset,
          left: this.props.xOffset-(this.props.width/2+this.props.horizontalMargin),
      }}></div>]
    );
  }

  createHorizontalLine() {
    let lineWidth, leftOffset;
    if (this.props.childIndex != 0) { // nav pirmais bērns -> garāka horizontāla līnija
      lineWidth = this.props.width/2 + this.props.horizontalMargin - this.props.lineWidth;
      leftOffset = (-this.props.width/2 - this.props.horizontalMargin + this.props.lineWidth+1);
    } else { // pirmais bērns
      lineWidth = this.props.horizontalMargin;
      leftOffset = (-this.props.horizontalMargin);
    }
    return(
      <div className="line"
        key={"horizontal"}
        style={{
          height: this.props.lineWidth+"px",
          width: lineWidth,
          top: this.props.height/2,
          left: leftOffset,
      }}></div>
    );
  }

  createConnectingLines() {
    if(this.props.parentVerticalOffset == null) {
      return [];
    }
    let linesArray = [];
    linesArray = linesArray.concat(this.createVerticalLine());
    linesArray = linesArray.concat(this.createHorizontalLine());
    return linesArray;
  }

  render() {
    let connectingLines = {

    }
    return (
      <div className={`threadcontainer ${this.props.active ? 'active' : ''} progress_${Math.round(this.props.progress * 100)}`}
        style={{
          top:this.state.yOffset,
          left: this.state.xOffset,
          width: this.props.width+"px",
          height: this.props.height+"px",
        }}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          this.props.onClick(this.props.pid);
        }}
          >
        <a href="/">
          <h4 style={{
            lineHeight: this.props.height + "px",
          }}>
          {this.props.pid}</h4>
        </a>
        {this.createConnectingLines()}
    </div>
    );
  }
}

export default ThreadWindow;
