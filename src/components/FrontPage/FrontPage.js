import React from 'react'
import Link from 'gatsby-link'
import './styles.scss'

import Parser from '../../services/Parser.js';

class IndexPage extends React.Component {
  constructor(props) {
    super(props);

    this.parse = this.parse.bind(this);
  }

  parse() {
    const code = this.textarea.value;
    let parsedCode = null;
    try {
      parsedCode = Parser.parse(code);
    } catch (err) {
      if (err instanceof Parser.Exception) {
        alert(err);
      }
    }
    if (parsedCode) {
      this.props.changePage({
        parsedCode,
      });
    }
  }

  render() {
    return (
    <div className="container">
      <h1>OSK fork demonstrācija</h1>
      <p>Demonstrācija attēlo funkcijas fork izpildi. Logā zemāk ierakstiet kodu, kuru vēlaties izpildīt.</p>
      <p>Kodā atļautās valodas konstrukcijas ir:</p>
      <ul>
        <li>if(...)</li>
        <li>'&&' un '||'</li>
        <li>print(n)</li>
        <li>fork()</li>
      </ul>
      <textarea
        ref={(e) => {this.textarea = e}}
        rows="15"
        cols="100"
        placeholder="Ievadiet kodu te"
        required="true">
      </textarea>
      <button onClick={this.parse}>Turpināt</button>
    </div>
  );
  }
}

export default IndexPage;
//ref={(e) => {this.textarea = e}}
