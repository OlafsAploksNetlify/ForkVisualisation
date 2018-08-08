import React from 'react'
import Link from 'gatsby-link'
import './styles.scss'

import Parser from '../../services/Parser.js';

const examples = [
  {
    title: 'Test case #1',
    code: `if (!fork() || !fork()) {
  print("A");
} else if (!fork() && fork()) {
  print("B");
} else {
  print("C");
}`,
  },
  {
    title: 'Test case #1',
    code: `if (!fork() && fork()) {
  print("A");
} else if (fork() || !fork()) {
  print("B");
} else {
  print("C");
}`,
  },
  {
    title: 'Big test case',
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
  {
    title: 'clear',
    code: ``,
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

    if (!code.toString().trim()) {
      alert('Please enter code');
      return;
    }

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

  handleChange = (e) => {
      this.setState({
        [e.target.name]: e.target.value,
      });
  }

  render() {
    return (
    <div className="container">
      <h1>Fork demonstration</h1>
      <p>Demonstration graphically shows execution of function - fork. Enter code to execute in text box below.</p>
      <p>Allowed language constructs:</p>
      <ul>
        <li>{'if (...) {...} else if (...) {...} else {...}'}</li>
        <li>'&&' un '||'</li>
        <li>print(x)</li>
        <li>fork()</li>
      </ul>

      <div>
        {examples.map(v => (
          <button className="pretty-button" key={v.title} onClick={e => {
            this.setState({
              code: v.code,
            });
          }}>{v.title}</button>
        ))}
      </div>

      <textarea
        rows="15"
        cols="100"
        name="code"
        placeholder={`Enter code, for example:
if (fork() && (!fork() || fork()) {
  print(1);
} else {
  print(2);
}`}
        onChange={this.handleChange}
        value={this.state.code}
        required="true" />
      <br />
      <button className="pretty-button" onClick={this.parse}>Continue</button>
    </div>
  );
  }
}

export default IndexPage;
//ref={(e) => {this.textarea = e}}
