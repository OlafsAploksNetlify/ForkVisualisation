
class Scheduler {
  constructor(init = []) {
    this.processes = init;
  }

  getNextProcess(algorithm = 'fcfs') {

    // removing threads that have ended
    while (this.processes.length && this.processes[0].finished) {
      this.processes.shift();
    }

    if (this.processes.length < 1) {
      return null;
    }

    if (algorithm === 'fcfs') {
      // ** FCFS **
      return this.processes[0];
    }

    if (algorithm === 'sjf') {
      let bestI = 0;
      let bestRes = 100000000000;
      for (let i = 0; i < this.processes.length; i++) {
        const res = this.processes[i].totalSteps - this.processes[i].completedSteps;
        if (!this.processes[i].finished && res < bestRes) {
          bestRes = res;
          bestI = i;
        }
      }
      return this.processes[bestI];
    }

    return null;
  }

  addProcess(proc) {
    this.processes.push(proc);
  }

  execute() {
    const proc = this.getNextProcess();
    if (proc) {
      proc.stepForward();
    }
    return proc;
  }

  executeType(type) {
    const proc = this.getNextProcess(type);
    if (proc) {
      proc.stepForward();
    }
    return proc;
  }

  executeProcess(pid) {
    for (let i = 0; i < this.processes.length; i++) {
      if (this.processes[i].pid === pid) {
        this.processes[i].stepForward();
        return this.processes[i];
      }
    }
  }

};

export default Scheduler;
