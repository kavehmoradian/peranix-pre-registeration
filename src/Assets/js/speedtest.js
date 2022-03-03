/*
    LibreSpeed - Main
    by Federico Dossena
    https://github.com/librespeed/speedtest/
    GNU LGPLv3 License
*/

/*
   This is the main interface between your webpage and the speedtest.
   It hides the speedtest web worker to the page, and provides many convenient functions to control the test.
   
   The best way to learn how to use this is to look at the basic example, but here's some documentation.
  
   To initialize the test, create a new Speedtest object:
    var s=new Speedtest();
   Now you can think of this as a finite state machine. These are the states (use getState() to see them):
   - 0: here you can change the speedtest settings (such as test duration) with the setParameter("parameter",value) method. From here you can either start the test using start() (goes to state 3) or you can add multiple test points using addTestPoint(server) or addTestPoints(serverList) (goes to state 1). Additionally, this is the perfect moment to set up callbacks for the onupdate(data) and onend(aborted) events.
   - 1: here you can add test points. You only need to do this if you want to use multiple test points.
        A server is defined as an object like this:
        {
            name: "User friendly name",
            server:"http://yourBackend.com/",     <---- URL to your server. You can specify http:// or https://. If your server supports both, just write // without the protocol
            dlURL:"garbage.php"    <----- path to garbage.php or its replacement on the server
            ulURL:"empty.php"    <----- path to empty.php or its replacement on the server
            pingURL:"empty.php"    <----- path to empty.php or its replacement on the server. This is used to ping the server by this selector
            getIpURL:"getIP.php"    <----- path to getIP.php or its replacement on the server
        }
        While in state 1, you can only add test points, you cannot change the test settings. When you're done, use selectServer(callback) to select the test point with the lowest ping. This is asynchronous, when it's done, it will call your callback function and move to state 2. Calling setSelectedServer(server) will manually select a server and move to state 2.
    - 2: test point selected, ready to start the test. Use start() to begin, this will move to state 3
    - 3: test running. Here, your onupdate event calback will be called periodically, with data coming from the worker about speed and progress. A data object will be passed to your onupdate function, with the following items:
            - dlStatus: download speed in mbps
            - ulStatus: upload speed in mbps
            - pingStatus: ping in ms
            - jitterStatus: jitter in ms
            - dlProgress: progress of the download test as a float 0-1
            - ulProgress: progress of the upload test as a float 0-1
            - pingProgress: progress of the ping/jitter test as a float 0-1
            - testState: state of the test (-1=not started, 0=starting, 1=download test, 2=ping+jitter test, 3=upload test, 4=finished, 5=aborted)
            - clientIp: IP address of the client performing the test (and optionally ISP and distance) 
        At the end of the test, the onend function will be called, with a boolean specifying whether the test was aborted or if it ended normally.
        The test can be aborted at any time with abort().
        At the end of the test, it will move to state 4
    - 4: test finished. You can run it again by calling start() if you want.
 */

function Speedtest() {
  this._serverList = []; //when using multiple points of test, this is a list of test points
  this._selectedServer = null; //when using multiple points of test, this is the selected server
  this._settings = {}; //settings for the speedtest worker
  this._state = 0; //0=adding settings, 1=adding servers, 2=server selection done, 3=test running, 4=done
}

Speedtest.prototype = {
  constructor: Speedtest,
  /**
   * Returns the state of the test: 0=adding settings, 1=adding servers, 2=server selection done, 3=test running, 4=done
   */
  getState: function () {
    return this._state;
  },
  /**
   * Change one of the test settings from their defaults.
   * - parameter: string with the name of the parameter that you want to set
   * - value: new value for the parameter
   *
   * Invalid values or nonexistant parameters will be ignored by the speedtest worker.
   */
  setParameter: function (parameter, value) {
    if (this._state === 3)
      throw new Error(
        "You cannot change the test settings while running the test"
      );
    this._settings[parameter] = value;
    if (parameter === "telemetry_extra") {
      this._originalExtra = this._settings.telemetry_extra;
    }
  },
  /**
   * Used internally to check if a server object contains all the required elements.
   * Also fixes the server URL if needed.
   */
  _checkServerDefinition: function (server) {
    try {
      if (typeof server.name !== "string")
        throw new Error("Name string missing from server definition (name)");
      if (typeof server.server !== "string")
        throw new Error(
          "Server address string missing from server definition (server)"
        );
      if (server.server.charAt(server.server.length - 1) !== "/")
        server.server += "/";
      // if (server.server.indexOf("//")===0)
      //     server.server = location.protocol + server.server;
      if (typeof server.dlURL !== "string")
        throw new Error(
          "Download URL string missing from server definition (dlURL)"
        );
      if (typeof server.ulURL !== "string")
        throw new Error(
          "Upload URL string missing from server definition (ulURL)"
        );
      if (typeof server.pingURL !== "string")
        throw new Error(
          "Ping URL string missing from server definition (pingURL)"
        );
      if (typeof server.getIpURL !== "string")
        throw new Error(
          "GetIP URL string missing from server definition (getIpURL)"
        );
    } catch (e) {
      throw new Error("Invalid server definition");
    }
  },
  /**
   * Add a test point (multiple points of test)
   * server: the server to be added as an object. Must contain the following elements:
   *  {
   *       name: "User friendly name",
   *       server:"http://yourBackend.com/",   URL to your server. You can specify http:// or https://. If your server supports both, just write // without the protocol
   *       dlURL:"garbage.php"   path to garbage.php or its replacement on the server
   *       ulURL:"empty.php"   path to empty.php or its replacement on the server
   *       pingURL:"empty.php"   path to empty.php or its replacement on the server. This is used to ping the server by this selector
   *       getIpURL:"getIP.php"   path to getIP.php or its replacement on the server
   *   }
   */
  addTestPoint: function (server) {
    this._checkServerDefinition(server);
    if (this._state === 0) this._state = 1;
    if (this._state !== 1)
      throw new Error("You can't add a server after server selection");
    this._settings.mpot = true;
    this._serverList.push(server);
  },
  /**
   * Same as addTestPoint, but you can pass an array of servers
   */
  addTestPoints: function (list) {
    for (let i = 0; i < list.length; i++) this.addTestPoint(list[i]);
  },
  /**
   * Load a JSON server list from URL (multiple points of test)
   * url: the url where the server list can be fetched. Must be an array with objects containing the following elements:
   *  {
   *       "name": "User friendly name",
   *       "server":"http://yourBackend.com/",   URL to your server. You can specify http:// or https://. If your server supports both, just write // without the protocol
   *       "dlURL":"garbage.php"   path to garbage.php or its replacement on the server
   *       "ulURL":"empty.php"   path to empty.php or its replacement on the server
   *       "pingURL":"empty.php"   path to empty.php or its replacement on the server. This is used to ping the server by this selector
   *       "getIpURL":"getIP.php"   path to getIP.php or its replacement on the server
   *   }
   * result: callback to be called when the list is loaded correctly. An array with the loaded servers will be passed to this function, or null if it failed
   */
  loadServerList: function (url, result) {
    if (this._state === 0) this._state = 1;
    if (this._state !== 1)
      throw new Error("You can't add a server after server selection");
    this._settings.mpot = true;
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      try {
        var servers = JSON.parse(xhr.responseText);
        for (let i = 0; i < servers.length; i++) {
          this._checkServerDefinition(servers[i]);
        }
        this.addTestPoints(servers);
        result(servers);
      } catch (e) {
        result(null);
      }
    }.bind(this);
    xhr.onerror = function () {
      result(null);
    };
    xhr.open("GET", url);
    xhr.send();
  },
  /**
   * Returns the selected server (multiple points of test)
   */
  getSelectedServer: function () {
    if (this._state < 2 || this._selectedServer === null)
      throw new Error("No server is selected");
    return this._selectedServer;
  },
  /**
   * Manually selects one of the test points (multiple points of test)
   */
  setSelectedServer: function (server) {
    this._checkServerDefinition(server);
    if (this._state === 3)
      throw new Error("You can't select a server while the test is running");
    this._selectedServer = server;
    this._state = 2;
  },
  /**
   * Automatically selects a server from the list of added test points. The server with the lowest ping will be chosen. (multiple points of test)
   * The process is asynchronous and the passed result callback function will be called when it's done, then the test can be started.
   */
  selectServer: function (result) {
    if (this._state !== 1) {
      if (this._state === 0) throw new Error("No test points added");
      if (this._state === 2) throw new Error("Server already selected");
      if (this._state >= 3)
        throw new Error("You can't select a server while the test is running");
    }
    if (this._selectServerCalled)
      throw new Error("selectServer already called");
    else this._selectServerCalled = true;

    //parallel server selection
    // var CONCURRENCY = 0;
    // var serverLists = [];
    // for (let i = 0; i < CONCURRENCY; i++) {
    //     serverLists[i] = [];
    // }
    // for (let i = 0; i < this._serverList.length; i++) {
    //     serverLists[i % CONCURRENCY].push(this._serverList[i]);
    // }
    // let completed = 0;
    // let bestServer = null;
    // for (let i = 0; i < CONCURRENCY; i++) {
    //     select(
    //         serverLists[i],
    //         function (server) {
    //             if (server !== null) {
    //                 if (bestServer === null || server.pingT < bestServer.pingT)
    //                     bestServer = server;
    //             }
    //             completed++;
    //             if (completed === CONCURRENCY) {
    //                 this._selectedServer = bestServer;
    //                 this._state = 2;
    //                 if (result) result(bestServer);
    //             }
    //         }.bind(this)
    //     );
    // }
  },
  /**
   * Starts the test.
   * During the test, the onupdate(data) callback function will be called periodically with data from the worker.
   * At the end of the test, the onend(aborted) function will be called with a boolean telling you if the test was aborted or if it ended normally.
   */
  start: function () {
    if (this._state === 3) throw new Error("Test already running");
    this.worker = new Worker(
      window.location.origin + "/speedtest_worker.js?r=" + Math.random()
    );
    this.worker.onmessage = function (e) {
      if (e.data === this._prevData) return;
      else this._prevData = e.data;
      var data = JSON.parse(e.data);
      try {
        if (this.onupdate) this.onupdate(data);
      } catch (e) {
        console.error("Speedtest onupdate event threw exception: " + e);
      }
      if (data.testState >= 4) {
        clearInterval(this.updater);
        this._state = 4;
        try {
          if (this.onend) this.onend(data.testState === 5);
        } catch (e) {
          console.error("Speedtest onend event threw exception: " + e);
        }
      }
    }.bind(this);
    this.updater = setInterval(
      function () {
        this.worker.postMessage("status");
      }.bind(this),
      200
    );
    if (this._state === 1)
      throw new Error(
        "When using multiple points of test, you must call selectServer before starting the test"
      );
    if (this._state === 2) {
      this._settings.url_dl =
        this._selectedServer.server + this._selectedServer.dlURL;
      this._settings.url_ul =
        this._selectedServer.server + this._selectedServer.ulURL;
      this._settings.url_ping =
        this._selectedServer.server + this._selectedServer.pingURL;
      this._settings.url_getIp =
        this._selectedServer.server + this._selectedServer.getIpURL;
      if (typeof this._originalExtra !== "undefined") {
        this._settings.telemetry_extra = JSON.stringify({
          server: this._selectedServer.name,
          extra: this._originalExtra,
        });
      } else
        this._settings.telemetry_extra = JSON.stringify({
          server: this._selectedServer.name,
        });
    }
    this._state = 3;
    this.worker.postMessage("start " + JSON.stringify(this._settings));
  },
  /**
   * Aborts the test while it's running.
   */
  abort: function () {
    if (this._state < 3)
      throw new Error("You cannot abort a test that's not started yet");
    if (this._state < 4) this.worker.postMessage("abort");
  },
};
export default Speedtest;
