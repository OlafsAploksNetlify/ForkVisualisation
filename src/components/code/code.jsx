import React from 'react'

import './style.scss';
import Parser from '../../services/Parser.js';

const Statements = {
  Condition: ({ condition: { type, value, rValue }, state}) => {
    let additionalClass = '';
    if (rValue === true) {
      additionalClass = 'true';
    } else if (rValue === false) {
      additionalClass = 'false';
    }
    switch (type) {
    case 'fork':
      return <span className={`conditionBlock ${state.length?null:'active'} ${additionalClass}`}>fork()</span>;
    case 'not':
      return <span className={`conditionBlock ${additionalClass}`}>!<Statements.Condition condition={value} state={state} /></span>;
    case 'and':
    case 'or':
      return (
        <span className={`conditionBlock ${additionalClass}`}>
          {'('}
          {value.map((condition, index) => (
            <span key={index}>
              {index !== 0 ? ` ${type.replace('and', '&&').replace('or', '||')} ` : null}
              <Statements.Condition condition={condition} state={state[0] === index ? state.slice(1) : [null]} />
            </span>
          ))}
          {')'}
        </span>
      );
    }
    return null;
  },
  IfBranch: ({ condition, code, firstCondition, state }) => {
    return (
      <div>
        <div className="codeRow">
          { firstCondition ? 'if ' : (condition ? '} else if ' : '} else ') }
          { condition ? (
            <Statements.Condition
              condition={condition}
              state={state[0] === 'condition' ? state.slice(1) : [null]}
            />
          ) : null}
          {' {'}
        </div>
        <CodeBlock
          program={code}
          state={state[0] === 'code' ? state.slice(1) : [null]}
        />
      </div>
    );
  },
  If: ({ program, state }) => {
    return (
      <div>
        {program.value.map((branch, index) => (
          <Statements.IfBranch
            key={index}
            {...branch}
            firstCondition={index === 0}
            state={state[0] === index ? state.slice(1) : [null]}
          />
        ))}
        {'}'}
      </div>
    );
  },
  Print: ({ program, state }) => {
    return <div>
      <span className={`print-block ${state.length?'':'active'} ${program.rValue ? 'true' : ''}`}>
        print({program.value});
      </span>
    </div>
  },
};

const Statement = (props) => {
  switch (props.program.type) {
    case 'if':
      return <Statements.If {...props} />;
    case 'print':
      return <Statements.Print {...props} />;
    default:
      console.log('Should not happen');
  }
};

const CodeBlock = ({ program, state, padding = 0 }) => {
  return (
    <div className="codeblock">
      { program.map((statement, index) => <Statement
          key={`statement_${index}`}
          program={statement}
          state={state[0] === index ? state.slice(1) : [null]}
          padding={padding}
        />
      )}
    </div>
  );
};

export default CodeBlock;
