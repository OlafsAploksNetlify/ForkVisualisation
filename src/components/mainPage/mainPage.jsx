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
      threads: [rootThread],
      program: rootThread.getProgram(),
      state: rootThread.getState(),
      activePid: rootThread.pid,
      output: [],
      zoomValue: 1,
      seq: 'fcfs',
      autoSteps: false,
      stepDuration: 50,
    };
    this.scheduler = new Scheduler([rootThread]);

    this.processes = {};
    this.processes[rootThread.pid] = rootThread;

    rootThread.onFork(child => {
      this.processes[child.pid] = child;
      this.scheduler.addProcess(child);
    });

    rootThread.onPrint(value => {
      const newOutput = this.state.output;
      newOutput.push(value);
      this.setState({
        output: newOutput,
      });
    });

    this.stepForward = this.stepForward.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  autoSteps = () => {
    const enable = !this.state.autoSteps;
    this.setState({
      autoSteps: enable,
    });
    if (enable) {
      this.stepForward(true);
    }
  }

  renderZoomValue(zoomValue) {
    this.setState({
      zoomValue: zoomValue
    });
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  stepForward(auto = false) {
    if (!this.mounted) return;

    let lastExecuted = null;
    if (this.state.seq === 'active') {
      lastExecuted = this.scheduler.executeProcess(this.state.activePid);
    } else {
      lastExecuted = this.scheduler.executeType(this.state.seq);
    }

    if(lastExecuted == null) {
        return;
    }

    this.setState({
      state: lastExecuted.getState(),
      program: lastExecuted.getProgram(),
      activePid: lastExecuted.pid,
    });
    this.forceUpdate();

    if (auto === true || this.state.autoSteps) {
      setTimeout(this.stepForward, this.state.stepDuration);
    }
  }

  changeVisibleThread({pid}) {
    this.setState({
      state: this.processes[pid].getState(),
      program: this.processes[pid].getProgram(),
      activePid: pid,
    });
  }

  render() {
    usedHeight = 0;
    return (
      <div className="main-page">

        <div className="top-container">
          <i className="fas fa-arrow-left" onClick={this.props.goBack} />

          <button className="pretty-button" onClick={this.stepForward}>Solis</button>
          <button className="pretty-button" onClick={this.autoSteps}>
            {this.state.autoSteps ? 'Pauze' : 'Izpildīt visu'}
          </button>

          <span className="x-label">Soļa ātrums:</span>
          <input
            type="range"
            name="stepDuration"
            value={this.state.stepDuration}
            onChange={this.handleChange}
            min={10}
            max={1000}
            step={10}
          />


          <span className="x-label">Secība:</span>
          <input
            type="radio"
            name="seq"
            value="fcfs"
            id="seq_fcfs"
            checked={this.state.seq === 'fcfs'}
            onChange={this.handleChange}
          /> <label htmlFor="seq_fcfs">Vecāks vispirms (FCFS)</label>
          <input
            type="radio"
            name="seq"
            value="sjf"
            id="seq_sjf"
            checked={this.state.seq === 'sjf'}
            onChange={this.handleChange}
          /> <label htmlFor="seq_sjf">Īsākais process</label>
          <input
            type="radio"
            name="seq"
            value="active"
            id="seq_active"
            checked={this.state.seq === 'active'}
            onChange={this.handleChange}
          /> <label htmlFor="seq_active">Aktīvais process</label>

        </div>

        <div className="middle-block">
          <div className="leftContainer">
            <CodeBlock
              program={this.state.program}
              state={this.state.state}
            />
          </div>
          <div className="rightContainer" ref={"rightContainer"}>
            <ThreadTree
              ThreadTree={this.state.threads}
              renderZoomValue={this.renderZoomValue.bind(this)}
              rightContainerRef={this.refs.rightContainer}
              changeVisibleThread={this.changeVisibleThread.bind(this)}
              activePid={this.state.activePid}
            />
          </div>
          <div className="zoomContainer">
            <h3>{Math.round(this.state.zoomValue*100) + "%"}</h3>
          </div>
        </div>

        <div className="outputContainer">
          {this.state.output.map((output, index) => <span key={index}>{output} </span>)}
        </div>

      </div>
    );
  }
}

export default MainPage;
