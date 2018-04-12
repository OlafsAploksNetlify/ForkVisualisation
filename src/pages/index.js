import React from 'react';

import FrontPage from '../components/FrontPage/FrontPage.js'
import MainPage from '../components/mainPage/mainPage.jsx';
import './styles/index.scss'

class IndexPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      program: null,
    };

    this.changePage = this.changePage.bind(this);
  }

  changePage({ parsedCode }) {
    this.setState({
      program: parsedCode,
    });
  }

  render() {
    return (
      this.state.program === null ?
        <FrontPage
          changePage={this.changePage}
        />
        : //Vizualizācija
        <MainPage
          program={this.state.program}
        />
    );
  }
}

export default IndexPage;
