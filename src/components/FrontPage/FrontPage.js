import React from 'react'
import Link from 'gatsby-link'
import './styles.scss'

class IndexPage extends React.Component {
  constructor(props) {
    super(props);
  }

  parse() {

    // this.props.changePage(parsedCode);  
  }

  render() {
    return (
    <div>
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
        ref="textarea"
        rows="15"
        cols="100"
        placeholder="Ievadiet kodu te"
        required="true">
      </textarea>
      <button onClick={() => {this.props.changePage(this.refs.textarea.value)}}>Turpināt</button>
    </div>
  );
  }
}

export default IndexPage;
//ref={(e) => {this.textarea = e}}
