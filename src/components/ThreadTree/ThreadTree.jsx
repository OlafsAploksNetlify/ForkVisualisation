import React from 'react'

import ThreadWindow from '../ThreadWindow/ThreadWindow.js'
let usedHeight = 0;

import CodeBlock from '../code/code.jsx';
import './style.scss'

import Thread from '../../services/Thread.js';
import Scheduler from '../../services/scheduler.js'

class ThreadTree extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      threads: this.props.ThreadTree,
      zoomConstant: 1,
      zoomX: 0,
      zoomY: 0,
    }

    //ja pamaini te, tad pamaini arī scss failā
    this.threadWindowParams = {
      width: 100,
      height: 50,
    }
    this.setZoomTimer = null;
  }

  handleScroll(event) {
    event.preventDefault();
    let newZoomValue = this.state.zoomConstant;
    if (event.deltaY > 0) { //scrolls down = zooms out
      newZoomValue -= 0.1;
      if(newZoomValue > 0.2) {
        this.setState({zoomConstant: (this.state.zoomConstant - 0.1)});
        this.props.renderZoomValue(newZoomValue);
      }
    } else {
      newZoomValue += 0.1;
      if (newZoomValue <= 1.6) {
        this.setState({zoomConstant: (this.state.zoomConstant + 0.1)});
        this.props.renderZoomValue(newZoomValue);
      }
    }

  }

  componentWillReceiveProps(newProps) {
    this.setState({
      threads: newProps.ThreadTree,
    });
    usedHeight = 0;
  }

  createThread({parsedCode}, index) {
    let threadlist = this.state.threads;
    threadlist.push({
      pid: 0,
      code: parsedCode[0].rawCode
    });
    this.setState({threads: threadlist});
  }

  createThreadWindow(thread, nodeHeight, childIndex, parentVerticalOffset) {
    //this.state.zoomConstant
    //this.state.zoomX
    //this.state.zoomY
    return <ThreadWindow
      active={this.state.activePid === thread.pid}
      key={thread.pid}
      pid={thread.pid}
      progress={thread.progress()}
      xOffset={nodeHeight}
      yOffset={usedHeight}
      height={this.threadWindowParams.height*this.state.zoomConstant}
      width={this.threadWindowParams.width*this.state.zoomConstant}
      zoomConstant={this.state.zoomConstant}
      onClick={(pid) => {this.props.changeVisibleThread({pid})}}
      parentVerticalOffset={parentVerticalOffset}
      childIndex={childIndex}
      lineWidth={2}
      horizontalMargin={100} //space between thread windows in px
    />
  }


  renderThreadWindows(currentThread, treeHeight, childIndex, pOffset) {
    //ja nav procesu?
    if (typeof(currentThread) == "undefined") {
      return null;
    }

    //base case - lapa
    if(currentThread.children == null) {
      return [this.createThreadWindow(currentThread, treeHeight, childIndex, pOffset)];
    }
    //procesa tiešo bērnu skaits - 1 soļa attālumā
    let childrenCount = currentThread.children.length;
    let array = [this.createThreadWindow(currentThread, treeHeight, childIndex, pOffset)];

    let i = 0; //Bērna kārtas numurs
    let parentOffset = usedHeight; //Priekš līnijām
    for (let thread in currentThread.children) {
      let thr = currentThread.children[thread];
      if (i==0) { //ja pirmais bērns - tad vēl pa y asi nestaigā
        array = array.concat(this.renderThreadWindows(thr, treeHeight+1, i, parentOffset));
      } else {
        usedHeight += this.threadWindowParams.height*this.state.zoomConstant*1.5;
        array = array.concat(this.renderThreadWindows(thr, treeHeight+1, i, parentOffset));
      }
      i++;
    }
    return array;
  }

  render() {
    usedHeight = 0;
    return(
      <div style={{
        height: 100 + "%",
        width: 100 + "%",
      }}
      onWheel = {(e) => this.handleScroll(e)}
      >
      {this.renderThreadWindows(this.state.threads[0], 0, null, null)}
      </div>
    );
  }

}

export default ThreadTree;
