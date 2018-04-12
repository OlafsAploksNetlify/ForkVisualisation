
class Scheduler {
  constructor(init = []) {
    this.processes = init;
  }

  getNextProcess() {

    // ** FCFS **
    // removing threads that have ended
    while (this.processes.length && this.processes[0].finished) {
      this.processes.shift();
    }

    if (this.processes.length) {
      return this.processes[0];
    }
    return null;

    // SJF būtu atrast ar mazāko totalSteps - completedSteps
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

};

export default Scheduler;
