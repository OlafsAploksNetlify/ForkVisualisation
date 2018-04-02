import React from 'react'
import Link from 'gatsby-link'
import FrontPage from '../components/FrontPage/FrontPage.js'
import ThreadWindow from '../components/ThreadWindow/ThreadWindow.js'
import './styles/index.scss'

// let xOffsetMatrix = new Array(100).join('0').split('').map(parseFloat);
let container;
let usedHeight = 0;

class IndexPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstPage: true,
      rightContainerWidth: this.rightContainer.height,
      threads: [],
    };
  //ja pamaini te, tad pamaini arī scss failā
  this.threadWindowParams = {
    width: 100,
    height: 50,
  }
  container = this;
  }

  componentDidMount() {
      // console.log(this.myInput.offsetWidth);
  }

  changePage({ parsedCode }) {
    // xOffsetMatrix = new Array(100).join('0').split('').map(parseFloat);
    container.setState({
      firstPage: !container.state.firstPage
    });
    container.setState({
      threads: [
        {pid: 0, code: "Test", children: [
          {pid: 199, code: "Test Children", children: [
            {pid: 1949, code: "Test Children", children: null},
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


  createThreadWindow(thread, nodeHeight) {

    // let partitions = xOffsetMatrix[height]; //Cik daļās ekrāns jādala - tik cik vecāku tik daļu
    console.log(thread.pid);
    return <ThreadWindow
      key={thread.pid}
      pid={thread.pid}
      code={thread.code}
      xOffset={nodeHeight}
      yOffset={usedHeight}
      height={this.threadWindowParams.height}
      width={this.threadWindowParams.width}
      horizontalMargin={25} //space between thread windows in px
    />
  }

  renderThreadWindows(currentThread, treeHeight, startingOffset) {
    //ja nav procesu?
    if (typeof(currentThread) == "undefined") {
      return null;
    }
    //base case - lapa
    if(currentThread.children == null) {
      return [this.createThreadWindow(currentThread, treeHeight)];
    }
    //procesa tiešo bērnu skaits - 1 soļa attālumā
    let childrenCount = currentThread.children.length;
    let array = [this.createThreadWindow(currentThread, treeHeight)];

    let i = 0; //Bērna kārtas numurs
    for (let thread in currentThread.children) {
      let thr = currentThread.children[thread];
      if (i==0) { //ja pirmais bērns - tad vēl pa y asi nestaigā
        array = array.concat(this.renderThreadWindows(thr, treeHeight+1));
      } else {
        usedHeight += this.threadWindowParams.height*2;
        array = array.concat(this.renderThreadWindows(thr, treeHeight+1));
      }
      i++;
    }
    return array;
  }

  // renderThreadWindows(currentThread, height, childrenIndex, startingOffset) {
  //   if(currentThread.children == null) {
  //     return [this.createThreadWindow(currentThread, height, childrenIndex)];
  //   }
  //   let children = currentThread.children;
  //   xOffsetMatrix[height+1] = children.length;
  //
  //   let array = [this.createThreadWindow(currentThread,xOffsetMatrix[height], height)];
  //   xOffsetMatrix[height]+=1;
  //   console.log(xOffsetMatrix[height]);
  //   let i = 0; //Bērna kārtas numurs
  //   for (let thread in children) {
  //     let thr = currentThread.children[thread];
  //     array = array.concat(this.renderThreadWindows(thr, height+1, i));
  //     i++;
  //   }
  //   // console.log(array);
  //   return array;
  //
  //   // console.log(this.state.threads.map(this.createThreadWindow));
  //   // return this.state.threads.map(this.createThreadWindow)
  // }

  leftContainer() {
    return (
      <div className="leftContainer">
      </div>
    );
  }

// ref={input => {this.myInput = input}}
  rightContainer() {
    return (
      <div className="rightContainer">
        {this.renderThreadWindows(this.state.threads[0], 0)}
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
