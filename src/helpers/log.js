export default class Log {
  static singleton;
  static getInstance() {
    if (!Log.singleton) {
      Log.singleton = new Log();
    }
    return Log.singleton;
  }
  createLog(e, origin) {
    console.log("============ LOG =============");
    console.log(origin)
    console.log(e.message);
    console.log(e);
  }
}