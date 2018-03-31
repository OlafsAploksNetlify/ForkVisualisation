import React from 'react'
import Link from 'gatsby-link'
import FrontPage from '../components/FrontPage/FrontPage.js'
import ThreadWindow from '../components/ThreadWindow/ThreadWindow.js'
import './styles/index.scss'

let container;

class IndexPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstPage: true,
      threads: [
        {pid: 100, code: "Test"},
      ],
    };
  container = this;
  }

  changePage({ parsedCode }) {
    container.createThread({parsedCode}, 0);
    container.setState({
      firstPage: !container.state.firstPage
    });
  }

  createThread({parsedCode}, index) {
    let threadlist = this.state.threads;
    threadlist.push({
      pid: 0,
      code: parsedCode[0].rawCode
    });
    this.setState({threads: threadlist});
    for (var i = 0; i < parsedCode.length; i++) {
      parsedCode[i]
    }
  }

  createThreadWindow(thread) {
    console.log(thread);
    return <ThreadWindow key={thread.pid} pid={thread.pid} code={thread.code}/>
  }

  renderThreadWindows() {
    return this.state.threads.map(this.createThreadWindow)
  }

  leftContainer() {
    return (
      <div className="leftContainer">
        {this.renderThreadWindows(this.state.threads)}
      </div>
    );
  }

  rightContainer() {
    return (
      <div className="rightContainer">
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
