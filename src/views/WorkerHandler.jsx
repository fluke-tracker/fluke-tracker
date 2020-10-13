import Worker from "views/predict.worker.js";

class WorkerHandler {
  constructor() {
    this.id = 0;
    this.worker = new Worker();
    this.promises = {};
    this.worker.onmessage = (evt) => {
      console.log("worker message");
      if (evt.data.modelIsReady) {
        console.log("model ready");
      }
      if (evt.data.prediction) {
        console.log("prediction " + JSON.stringify(evt.data.prediction));
        this.promises[evt.data.id].resolve(evt);
      }
    };
  }

  addJob(args) {
    console.log("add job " + args);
    this.id += 1;
    const _id = this.id;
    let promiseFct = function (resolve, reject) {
      args.id = _id;
      console.log("postMessageToWorker");
      this.worker.postMessage(args);
      // you can save all relevant things in your object.
      this.promises[_id].resolve = resolve;
      this.promises[_id].reject = reject;
      this.promises[_id].args = args;
    };
    this.promises[_id] = {};
    promiseFct = promiseFct.bind(this);
    this.promises[_id].promise = new Promise(promiseFct);

    return this.promises[_id].promise;
  }
}

export default WorkerHandler;
