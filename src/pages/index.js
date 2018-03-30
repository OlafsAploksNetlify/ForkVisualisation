import React from 'react'
import Link from 'gatsby-link'
import FrontPage from '../components/FrontPage/FrontPage.js'
import './styles/index.scss'
let container;

class IndexPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstPage: true
    };
  container = this;
  }

  changePage(code) {
    console.log(code);
    container.setState({
      firstPage: false
    });
  }

  render() {
    return (
    (this.state.firstPage) ?
      <FrontPage
        changePage={this.changePage}
      />
      : //Vizualizācija
      <div>
        <h1>Otrā lapa</h1>
      </div>
    );
  }
}

export default IndexPage;
