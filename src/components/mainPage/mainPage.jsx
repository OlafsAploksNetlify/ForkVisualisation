import React from 'react'

import ThreadWindow from '../ThreadWindow/ThreadWindow.js'
import ThreadTree from '../ThreadTree/ThreadTree.jsx'
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

    window.tt = this.stepForward.bind(this);
  }

  componentDidMount() {
      // console.log(this.myInput.offsetWidth);
  }

  stepForward() {
    const lastExecuted = this.scheduler.execute();
    // this.thread.stepForward();
    if(lastExecuted == null) {
        return;
    }

    this.setState({
      state: lastExecuted.getState(),
      program: lastExecuted.getProgram(),
      activePid: lastExecuted.pid,
    });
    this.forceUpdate();
  }

  changeVisibleThread({pid}) {
    this.setState({
      state: this.processes[pid].getState(),
      program: this.processes[pid].getProgram(),
      activePid: pid,
    });
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
    // console.log(this.state.threads);
    return (
      <div className="rightContainer">
        <ThreadTree
          ThreadTree={this.state.threads}
        />
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
