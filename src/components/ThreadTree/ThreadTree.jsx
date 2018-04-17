import React from 'react'

import ThreadWindow from '../ThreadWindow/ThreadWindow.js'
let usedHeight = 0;

import CodeBlock from '../code/code.jsx';

import Thread from '../../services/Thread.js';
import Scheduler from '../../services/scheduler.js'

class ThreadTree extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      threads: this.props.ThreadTree,
    }

    //ja pamaini te, tad pamaini arī scss failā
    this.threadWindowParams = {
      width: 100,
      height: 50,
      zoomConstant: 1,
      zoomX: 0,
      zoomY: 0,
    }
  }

  componentWillReceiveProps(newProps) {
    console.log(newProps.ThreadTree);
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
      height={this.threadWindowParams.height}
      width={this.threadWindowParams.width}
      onClick={(pid) => {this.changeVisibleThread({pid})}}
      parentVerticalOffset={parentVerticalOffset}
      childIndex={childIndex}
      lineWidth={2}
      horizontalMargin={50} //space between thread windows in px
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
        usedHeight += this.threadWindowParams.height*1.5;
        array = array.concat(this.renderThreadWindows(thr, treeHeight+1, i, parentOffset));
      }
      i++;
    }
    return array;
  }

  render() {
    return(
      <div style={{
        height: 100 + "%",
        width: 100 + "%",
        backgroundColor: "red"
      }}>
      {this.renderThreadWindows(this.state.threads[0], 0, null, null)}
      </div>
    );
  }

}

export default ThreadTree;
