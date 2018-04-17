import React from 'react'
import Link from 'gatsby-link'
import './styles.scss'

import Parser from '../../services/Parser.js';

const examples = [
  {
    title: 'Liels piemērs',
    code: `if (fork() && !fork()) {
  if (fork() && fork()) {
    print(1);
  }
} else if ((!fork() || fork()) && fork()) {
  print(2);
} else {
  print(3);
}
print(5)
if ((fork() && (fork() || fork())) || ((fork() || fork()) && fork())){print('x')}
print("6")
if (!(fork() && !fork())){print(55)}elseif(){print(567)}`,
  },
];

class IndexPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      code: '',
    };

    this.parse = this.parse.bind(this);
  }

  parse() {
    const { code } = this.state;
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

  handleChange = (e, { name, value }) => {
      this.setState({
        [name]: value,
      });
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

      <div>
        {examples.map(v => (
          <button key={v.title} onClick={e => {
            this.handleChange(e, {
              name: 'code',
              value: v.code,
            });
          }}>{v.title}</button>
        ))}
      </div>

      <textarea
        rows="15"
        cols="100"
        name="code"
        placeholder="Ievadiet kodu te"
        onChange={this.handleChange}
        value={this.state.code}
        required="true" />
      <button onClick={this.parse}>Turpināt</button>
    </div>
  );
  }
}

export default IndexPage;
//ref={(e) => {this.textarea = e}}
