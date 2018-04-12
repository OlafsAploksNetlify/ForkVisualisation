import React from 'react'
import Link from 'gatsby-link'
import FrontPage from '../components/FrontPage/FrontPage.js'
import ThreadWindow from '../components/ThreadWindow/ThreadWindow.js'
import './styles/index.scss'

// let xOffsetMatrix = new Array(100).join('0').split('').map(parseFloat);

let usedHeight = 0;

import CodeBlock from '../components/code/code.jsx';

import Thread from '../services/Thread.js';

class IndexPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstPage: true,
      rightContainerWidth: this.rightContainer.height,
      threads: [],
      program: null,
      state: [],
    };

    //ja pamaini te, tad pamaini arī scss failā
    this.threadWindowParams = {
      width: 100,
      height: 50,
    }

    this.changePage = this.changePage.bind(this);
    window.tt = this.stepForward.bind(this);
  }

  componentDidMount() {
      // console.log(this.myInput.offsetWidth);
  }

  stepForward() {
    this.thread.stepForward();
    this.setState({
      state: this.thread.getState(),
      program: this.thread.getProgram(),
    });
    console.log(`PROGRESS: ${this.thread.completedSteps / this.thread.totalSteps}`);
  }

  changePage({ parsedCode }) {
    // xOffsetMatrix = new Array(100).join('0').split('').map(parseFloat);
    this.setState({
      firstPage: !this.state.firstPage
    });

    // console.log(parsedCode);
    this.thread = Thread.create(parsedCode);
    this.setState({
      firstPage: false,
      program: this.thread.getProgram(),
      state: this.thread.getState(),
    });

    this.setState({
      threads: [
        {pid: 0, code: "Test", children: [
          {pid: 199, code: "Test Children", children: [
            {pid: 1949, code: "Test Children", children: null},
            {pid: 555, code: "Test Children", children: [
              {pid: 3142, code: "Test Children", children: null},
              {pid: 2222, code: "Test Children", children: [
                {pid: 123, code: "Test Children", children: null},
                {pid: 456, code: "Test Children", children: null},
                {pid: 789, code: "Test Children", children: null},
              ]},
            ]},
            {pid: 1299, code: "Test Children", children: [
              {pid: 1999, code: "Test Children", children: null},
              {pid: 1149, code: "Test Children", children: null},
              {pid: 334, code: "Test Children", children: null},
            ]},
          ]},
          {pid: 349, code: "Test Children", children: [
            {pid: 5149, code: "Test Children", children: [
              {pid: 1111, code: "Test Children", children: null},
            ]},
          ]},
          {pid: 649, code: "Test Children", children: [
            {pid: 2149, code: "Test Children", children: null},
            {pid: 3324, code: "Test Children", children: [
              {pid: 7139, code: "Test Children", children: null},
            ]},
          ]},
        ]},
      ]
    });
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
    return <ThreadWindow
      key={thread.pid}
      pid={thread.pid}
      xOffset={nodeHeight}
      yOffset={usedHeight}
      height={this.threadWindowParams.height}
      width={this.threadWindowParams.width}
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
      </div>
    );
  }

  render() {
    usedHeight = 0;
    let leftContainer = this.leftContainer();
    let rightContainer = this.rightContainer();
    let outputContainer = this.outputContainer();
    return (
    (this.state.firstPage) ?
      <FrontPage
        changePage={this.changePage}
      />
      : //Vizualizācija
      <div>
        {leftContainer}
        {rightContainer}
        {outputContainer}
      </div>
    );
  }
}

export default IndexPage;
