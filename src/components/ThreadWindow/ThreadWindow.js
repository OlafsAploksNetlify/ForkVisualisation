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
    this.borderThickness = 3;
    this.state = {
      xOffset: this.props.xOffset*(this.props.width*2), // *2 for margin
      yOffset: this.props.yOffset,
      horizontalMargin: Math.round(this.props.width + this.borderThickness*2),
      height: this.props.height,
      width: this.props.width,
      parentVerticalOffset: this.props.parentVerticalOffset,
    };
  }

  componentWillReceiveProps(newProps) {
      this.state = {
        xOffset: newProps.xOffset * (newProps.width*2), // *2 for margin
        yOffset: newProps.yOffset,
        horizontalMargin: Math.round(newProps.width + this.borderThickness*2),
        height: newProps.height,
        width: newProps.width,
        parentVerticalOffset: newProps.parentVerticalOffset,
      };
  }

  getInitialState() {
    return ({
      pos: 0,
      dragging: false,
      rel: null // position relative to the cursor
    });
  }

  createVerticalLine() {
    let topOffset = (this.state.parentVerticalOffset + this.state.height) - (this.state.yOffset + this.borderThickness*2);
    let leftOffset = this.props.xOffset - ( this.props.width/2 + this.state.horizontalMargin);

    if (this.props.parentVerticalOffset == this.props.yOffset) { // first child doesn't need vertical lines
      return;
    }
    return(
      [<div className="line"
        style={{
          height: this.state.yOffset - (this.state.parentVerticalOffset + this.state.height/2) + this.borderThickness*2,
          width: this.props.lineWidth+"px",
          top: topOffset,
          left: leftOffset,
      }}></div>]
    );
  }

  createHorizontalLine() {
    let lineWidth, leftOffset;
    if (this.props.childIndex != 0) { // nav pirmais bērns -> garāka horizontāla līnija
      lineWidth = (this.props.width/2 + this.state.horizontalMargin) - this.props.lineWidth;
      leftOffset = this.props.lineWidth - (this.props.width/2 + this.state.horizontalMargin);
      //(this.props.lineWidth+1) - (this.props.width/2 + this.state.horizontalMargin);
    } else { // pirmais bērns
      lineWidth = this.props.width+this.borderThickness*2;
      leftOffset = ( -this.state.horizontalMargin);
    }
    return(
      <div className="line"
        key={"horizontal"}
        style={{
          height: this.props.lineWidth+"px",
          width: lineWidth,
          top: (this.state.height - this.borderThickness)/2,
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
        {this.createConnectingLines()}
        <a href="/">
          <h4 style={{
            lineHeight: this.props.height-this.borderThickness + "px",
            fontSize: this.props.zoomConstant*15 + "px",
          }}>
          {this.props.pid}</h4>
        </a>
    </div>
    );
  }
}

export default ThreadWindow;
