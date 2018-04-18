const cloneDeep = require('lodash.clonedeep');

let next_pid = 1;

class Thread {
  constructor(program, state = null) {
    this.program = cloneDeep(program);
    if (state === null) {
      state = [];
      let p = this.program;
      while (true) {
        if (Array.isArray(p)) {
          p = p[0];
          state.push(0);
        } else if (['if', 'and', 'or', 'not'].includes(p.type)) {
          p = p.value;
        } else if (p.type === 'branch') {
          state.push('condition');
          p = p.condition;
        } else {
          break;
        }
      }
    }
    this.state = state;
    this.finished = false;

    this.nextForkValue = null;

    this.onForkFn = [];
    this.onPrintFn = [];

    this.initThread();
  }

  initThread(child = false) {
    this.pid = next_pid++;
    this.completedSteps = 0;
    this.children = [];
    this.totalSteps = this.calculateLeftSteps(child);
    if (child) {
      this.totalSteps -= 1;
    }
  }

  onFork(fn) {
    this.onForkFn.push(fn);
  }

  onPrint(fn) {
    this.onPrintFn.push(fn);
  }

  calculateLeftSteps(child = false) {
    const thread = cloneDeep(this);
    const stepsBefore = thread.completedSteps;
    thread.nextForkValue = !child;
    let forkValue = !child;
    while (!thread.finished) {
      thread.stepForward(true);
    }
    // console.log(thread.pid, stepsBefore, thread.completedSteps)
    return thread.completedSteps - stepsBefore;
  }

  progress() {
    return this.completedSteps / this.totalSteps;
  }

  callback() {
    const args = Array.from(arguments);
    if (Array.isArray(args[0])) {
      for (let i = 0; i < args[0].length; ++i) {
        this.callback(args[0][i], ...args.slice(1));
      }
    }
    if (typeof args[0] === 'function') {
      args[0](...args.slice(1));
    }
  }

  callFork() {
    if (this.nextForkValue === null) {
      const child = cloneDeep(this);
      child.initThread(true);
      child.nextForkValue = false;
      this.children.push(child);

      this.callback(this.onForkFn, child, this);

      this.nextForkValue = true;
      return null;
    } else {
      const res = this.nextForkValue;
      this.nextForkValue = null;
      return res;
    }
    return true;
  }

  callPrint(value) {
    let v = value.toString().trim();
    if (v[0] === v[v.length-1] && ['\'', '"'].indexOf(v[0]) >= 0) {
      v = v.slice(1, v.length-1);
    }
    this.callback(this.onPrintFn, v);
  }

  stepForward(skipForks = false, forkValue = true) {
    if (this.finished) {
      return;
    }

    const prevState = this.state;
    let newState = [];

    this.completedSteps += 1;

    const goDeeper = (program, state) => {
      if (Array.isArray(program)) { // code
        const res = goDeeper(program[state[0]], state.slice(1));
        if (res === null) {
          newState.push(state[0]);
          return null;
        }

        if (state[0] === program.length - 1) {
          // newState.push(state[0]);
          return true;
        } else {
          newState = this.buildDefaultState(program[state[0] + 1]).reverse();
          newState.push(state[0] + 1);
          return null;
        }
      } else if (program.type === 'if') {
        const res = goDeeper(program.value[state[0]], state.slice(1));

        if (res === null) {
          newState.push(state[0]);
          return null;
        }

        if (res === true) {
          // newState.push(state[0]);
          return true;
        } else {
           if (state[0] === program.value.length - 1) {
             // newState.push(state[0]);
             return true;
           } else {
             newState = this.buildDefaultState(program.value[state[0] + 1]).reverse();
             newState.push(state[0] + 1);
             return null;
           }
        }
      } else if (program.type === 'branch') {
        const res = goDeeper(program[state[0]], state.slice(1));

        if (res === null) {
          newState.push(state[0]);
          return null;
        }

        if (state[0] === 'condition') {
          if (res === true) {
            newState = this.buildDefaultState(program['code']).reverse();
            newState.push('code');
            return null;
          } else {
            // newState.push(state[0]);
            return false;
          }
        } else {
          return true;
        }
      } else if (program.type === 'and') {
        const res = goDeeper(program.value[state[0]], state.slice(1));

        if (res === null) {
          newState.push(state[0]);
          return null;
        } else if (res === false) {
          program.rValue = false;
          return false;
        } else {
          if (state[0] === program.value.length - 1) {
            program.rValue = true;
            return true;
          } else {
            newState = this.buildDefaultState(program.value[state[0] + 1]).reverse();
            newState.push(state[0] + 1);
            return null;
          }
        }
      } else if (program.type === 'or') {
        const res = goDeeper(program.value[state[0]], state.slice(1));

        if (res === null) {
          newState.push(state[0]);
          return null;
        } else if (res === true) {
          program.rValue = true;
          return true;
        } else {
          if (state[0] === program.value.length - 1) {
            program.rValue = false;
            return false;
          } else {
            newState = this.buildDefaultState(program.value[state[0] + 1]).reverse();
            newState.push(state[0] + 1);
            return null;
          }
        }
      } else if (program.type === 'not') {
        const res = goDeeper(program.value, state);
        if (res === null) {
          return null;
        } else {
          program.rValue = !res;
          return !res;
        }
      } else if (program.type === 'fork') {
        if (skipForks) {
          this.completedSteps += 1;
          if (this.nextForkValue === false) {
            this.nextForkValue = true;
            return false;
          }
          return true;
        }
        const res = this.callFork();
        if (res !== null) {
          program.rValue = res;
        }
        return res;
      } else if (program.type === 'print') {
        if (!skipForks) {
          program.rValue = true;
          this.callPrint(program.value);
        }
        return true;
      } else {
        // ???
        console.warn('Something went wrong');
        return null;
      }
      return null;
    };

    const res = goDeeper(this.program, this.state);
    this.state = newState.reverse();
    this.finished = !!res;
  }

  buildDefaultState(program) {
    const state = [];
    let p = program;
    while (true) {
      if (p === null) debugger;
      if (Array.isArray(p)) {
        if (p.length === 0) {
          break;
        }
        p = p[0];
        state.push(0);
      } else if (['if', 'and', 'or', 'not'].includes(p.type)) {
        p = p.value;
      } else if (p.type === 'branch') {
        if (p.condition) {
          state.push('condition');
          p = p.condition;
        } else {
          state.push('code');
          p = p.code;
        }
      } else {
        break;
      }
    }

    return state;
  }

  hasFinished() {
    return this.finished;
  }

  getState() {
    return this.state;
  }

  getProgram() {
    return this.program;
  }

  static create() {
    next_pid = 1;
    const p = new this(...arguments);
    return p;
  }
}

export default Thread;
