import React from 'react'

import ThreadWindow from '../ThreadWindow/ThreadWindow.js'
import './style.scss'

// let xOffsetMatrix = new Array(100).join('0').split('').map(parseFloat);

let usedHeight = 0;

import CodeBlock from '../code/code.jsx';

import Thread from '../../services/Thread.js';
import Scheduler from '../../services/scheduler.js'

class MainPage extends React.Component {
  constructor(props) {
    super(props);

    const rootThread = Thread.create(props.program);

    this.thread = rootThread;

    this.state = {
      rightContainerWidth: this.rightContainer.height,
      threads: [rootThread],
      program: rootThread.getProgram(),
      state: rootThread.getState(),
      activePid: rootThread.pid,
      output: [],
    };

    //ja pamaini te, tad pamaini arī scss failā
    this.threadWindowParams = {
      width: 100,
      height: 50,
    }

    this.scheduler = new Scheduler([rootThread]);

    this.processes = {};
    this.processes[rootThread.pid] = rootThread;

    rootThread.onFork(child => {
      this.processes[child.pid] = child;
      this.scheduler.addProcess(child);
    });

    rootThread.onPrint(value => {
      console.log(`PRINTING ${value}`);
      const newOutput = this.state.output;
      newOutput.push(value);
      this.setState({
        output: newOutput,
      });
    });

    // window.tt = this.stepForward.bind(this);
  }

  componentDidMount() {
      // console.log(this.myInput.offsetWidth);
  }

  stepForward() {
    const lastExecuted = this.scheduler.execute();
    // this.thread.stepForward();
    this.setState({
      state: lastExecuted.getState(),
      program: lastExecuted.getProgram(),
      activePid: lastExecuted.pid,
    });
    this.forceUpdate();
  }

  createThread({parsedCode}, index) {
    let threadlist = this.state.threads;
    threadlist.push({
      pid: 0,
      code: parsedCode[0].rawCode
    });
    this.setState({threads: threadlist});
  }

  changeVisibleThread({pid}) {
    this.setState({
      state: this.processes[pid].getState(),
      program: this.processes[pid].getProgram(),
      activePid: pid,
    });
  }


  createThreadWindow(thread, nodeHeight, childIndex, parentVerticalOffset) {
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


  leftContainer() {
    return (
      <div className="leftContainer" style={{overflow: 'scroll'}}>
        <CodeBlock
          program={this.state.program}
          state={this.state.state}
        />
      </div>
    );
  }

// ref={input => {this.myInput = input}}
  rightContainer() {
    return (
      <div className="rightContainer">
        {this.renderThreadWindows(this.state.threads[0], 0, null, null)}
      </div>
    );
  }

  outputContainer() {
    return (
      <div className="outputContainer">
        {this.state.output.map((output, index) => <span key={index}>{output} </span>)}
      </div>
    );
  }

  render() {
    usedHeight = 0;
    let leftContainer = this.leftContainer();
    let rightContainer = this.rightContainer();
    let outputContainer = this.outputContainer();
    return (
      <div>
        {leftContainer}
        {rightContainer}
        {outputContainer}
      </div>
    );
  }
}

export default MainPage;
