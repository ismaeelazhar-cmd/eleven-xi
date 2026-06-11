/* net.js — Online multiplayer transport for Eleven XI.
 *
 * Zero-backend peer-to-peer over WebRTC, using PeerJS's free public broker only
 * for signalling (the actual game data flows directly browser↔browser). PeerJS
 * is lazy-loaded from CDN the first moment a user chooses "Online" — the offline
 * game never touches the network.
 *
 * Public API (window.ElxiNet):
 *   ElxiNet.host()            -> Promise<code>   create a game, resolve with the share code
 *   ElxiNet.join(code)        -> Promise<void>   join an existing game by code
 *   ElxiNet.send(obj)                            send a JSON-able message to the peer
 *   ElxiNet.close()                              tear down the session
 *   ElxiNet.isOnline()        -> bool            true while a session is live/forming
 *   ElxiNet.isHost            -> bool
 *   ElxiNet.code              -> string|null
 *   Callbacks (assign functions): onStatus(state,info), onData(obj), onOpen(), onPeerLeave(reason)
 *
 * Status states: "loading" | "hosting" | "waiting" | "joining" | "connected" | "closed" | "error"
 */
(function () {
  "use strict";

  var PEERJS_CDN = "https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js";
  // Unambiguous alphabet (no 0/O/1/I) for human-friendly codes.
  var ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  var PREFIX = "elxi-";           // namespace on the shared public broker
  var CODE_LEN = 4;
  var WAIT_MS = 90000;            // how long a host advertises before timing out

  var _peerjsLoading = null;

  function loadPeerJS() {
    if (window.Peer) return Promise.resolve();
    if (_peerjsLoading) return _peerjsLoading;
    _peerjsLoading = new Promise(function (res, rej) {
      var s = document.createElement("script");
      s.src = PEERJS_CDN;
      s.async = true;
      s.onload = function () { window.Peer ? res() : rej(new Error("PeerJS missing after load")); };
      s.onerror = function () { _peerjsLoading = null; rej(new Error("Could not load the online engine — check your connection.")); };
      document.head.appendChild(s);
    });
    return _peerjsLoading;
  }

  function randCode() {
    var c = "";
    // crypto where available; deterministic-safe fallback otherwise.
    var rnd = (window.crypto && window.crypto.getRandomValues)
      ? function (n) { var a = new Uint32Array(1); window.crypto.getRandomValues(a); return a[0] % n; }
      : function (n) { return Math.floor(Math.random() * n); };
    for (var i = 0; i < CODE_LEN; i++) c += ALPHABET[rnd(ALPHABET.length)];
    return c;
  }

  var Net = {
    isHost: false,
    code: null,
    state: "closed",
    onStatus: null,
    onData: null,
    onOpen: null,
    onPeerLeave: null,

    _peer: null,
    _conn: null,
    _waitTimer: null,
    _opened: false
  };

  function setState(s, info) {
    Net.state = s;
    if (typeof Net.onStatus === "function") { try { Net.onStatus(s, info); } catch (e) {} }
  }

  Net.isOnline = function () {
    return Net.state === "hosting" || Net.state === "waiting" || Net.state === "joining" ||
           Net.state === "connected" || Net.state === "loading";
  };

  function wireConn(conn) {
    Net._conn = conn;
    conn.on("open", function () {
      Net._opened = true;
      if (Net._waitTimer) { clearTimeout(Net._waitTimer); Net._waitTimer = null; }
      setState("connected", { code: Net.code });
      if (typeof Net.onOpen === "function") { try { Net.onOpen(); } catch (e) {} }
    });
    conn.on("data", function (d) {
      if (typeof Net.onData === "function") { try { Net.onData(d); } catch (e) {} }
    });
    conn.on("close", function () {
      if (Net.state === "connected") {
        setState("closed", { reason: "peer-left" });
        if (typeof Net.onPeerLeave === "function") { try { Net.onPeerLeave("peer-left"); } catch (e) {} }
      }
    });
    conn.on("error", function () {
      if (Net.state === "connected") {
        setState("closed", { reason: "peer-error" });
        if (typeof Net.onPeerLeave === "function") { try { Net.onPeerLeave("peer-error"); } catch (e) {} }
      }
    });
  }

  Net.host = function () {
    Net.close();
    Net.isHost = true;
    Net._opened = false;
    setState("loading");
    return loadPeerJS().then(function () {
      return new Promise(function (resolve, reject) {
        var attempts = 0;
        function tryOpen() {
          attempts++;
          var code = randCode();
          var peer = new window.Peer(PREFIX + code, { debug: 0 });
          Net._peer = peer;
          var settled = false;
          peer.on("open", function () {
            if (settled) return; settled = true;
            Net.code = code;
            setState("waiting", { code: code });
            // Host advertises and waits for a guest connection.
            peer.on("connection", function (conn) {
              // Refuse a second guest — this is strictly 1v1.
              if (Net._conn && Net._opened) { try { conn.close(); } catch (e) {} return; }
              wireConn(conn);
            });
            Net._waitTimer = setTimeout(function () {
              if (Net.state === "waiting") {
                setState("error", { reason: "no-opponent", message: "No one joined in time. Try again or share the code." });
              }
            }, WAIT_MS);
            resolve(code);
          });
          peer.on("error", function (err) {
            if (settled) return;
            // ID already taken on the broker -> pick a new code (up to 5 tries).
            if (err && err.type === "unavailable-id" && attempts < 5) {
              try { peer.destroy(); } catch (e) {}
              tryOpen();
              return;
            }
            settled = true;
            setState("error", { reason: "broker", message: "Couldn't reach the online service. Try again." });
            reject(err);
          });
        }
        tryOpen();
      });
    });
  };

  Net.join = function (rawCode) {
    Net.close();
    Net.isHost = false;
    Net._opened = false;
    var code = String(rawCode || "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (code.length !== CODE_LEN) {
      setState("error", { reason: "bad-code", message: "That code doesn't look right — it should be " + CODE_LEN + " characters." });
      return Promise.reject(new Error("bad-code"));
    }
    Net.code = code;
    setState("loading");
    return loadPeerJS().then(function () {
      return new Promise(function (resolve, reject) {
        var peer = new window.Peer({ debug: 0 });
        Net._peer = peer;
        var settled = false;
        var connectTimer = setTimeout(function () {
          if (!Net._opened && !settled) {
            settled = true;
            setState("error", { reason: "no-game", message: "No game found with code " + code + ". Check it and try again." });
            reject(new Error("timeout"));
          }
        }, 15000);
        peer.on("open", function () {
          setState("joining", { code: code });
          var conn = peer.connect(PREFIX + code, { reliable: true });
          wireConn(conn);
          conn.on("open", function () {
            if (settled) return; settled = true;
            clearTimeout(connectTimer);
            resolve();
          });
        });
        peer.on("error", function (err) {
          if (settled) return;
          // peer-unavailable => no host is advertising that code.
          if (err && err.type === "peer-unavailable") {
            settled = true;
            clearTimeout(connectTimer);
            setState("error", { reason: "no-game", message: "No game found with code " + code + ". Check it and try again." });
            reject(err);
            return;
          }
          // Other transient broker errors before connect.
          if (!Net._opened) {
            settled = true;
            clearTimeout(connectTimer);
            setState("error", { reason: "broker", message: "Couldn't reach the online service. Try again." });
            reject(err);
          }
        });
      });
    });
  };

  Net.send = function (obj) {
    if (Net._conn && Net._opened) {
      try { Net._conn.send(obj); return true; } catch (e) {}
    }
    return false;
  };

  Net.close = function () {
    if (Net._waitTimer) { clearTimeout(Net._waitTimer); Net._waitTimer = null; }
    if (Net._conn) { try { Net._conn.close(); } catch (e) {} Net._conn = null; }
    if (Net._peer) { try { Net._peer.destroy(); } catch (e) {} Net._peer = null; }
    Net._opened = false;
    Net.isHost = false;
    Net.code = null;
    if (Net.state !== "closed") setState("closed", { reason: "self" });
    else Net.state = "closed";
  };

  window.ElxiNet = Net;
})();
