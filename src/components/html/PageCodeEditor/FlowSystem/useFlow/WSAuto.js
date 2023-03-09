export class WSAuto {
  constructor({ roomID, url }) {
    this.url = url
    this.roomID = roomID
    this.connectionID = ''
    //
    this.events = new MyEventEmitter()

    this.events.on('setup-connectionID', (payload) => {
      if (this.roomID === payload.roomID) {
        console.log('setup-connectionID', payload)
        this.connectionID = payload.connectionID
        this.systemReady = true

        this.events.emit('all-ready', this)
      }
    })

    this.on = (ev, fnc) => {
      this.events.on(ev, fnc)
    }
    this.once = (ev, fnc) => {
      this.events.on(ev, (data) => {
        this.events.removeListener(ev, fnc)
        fnc(data)
      })
    }
    this.off = (ev, fnc) => {
      this.events.removeListener(ev, fnc)
    }

    this.send = (v, { bypassSystemReady = false } = {}) => {
      if (bypassSystemReady) {
        if (this.ws && this.ws.readyState === this.ws.OPEN) {
          this.ws.send(JSON.stringify(v))
        } else {
          let tt = setInterval(() => {
            if (this.ws && this.ws.readyState === this.ws.OPEN) {
              clearInterval(tt)
              this.ws.send(JSON.stringify(v))
            }
          })
        }
      } else {
        let tt = setInterval(() => {
          if (this.ws && this.ws.readyState === this.ws.OPEN && this.systemReady) {
            clearInterval(tt)
            this.ws.send(JSON.stringify(v))
          }
        })
      }
    }

    this.clean = () => {
      if (this.ws) {
        this.ws.onerror = () => {}
        this.ws.onclose = () => {}
        this.ws.close()
      }
    }

    this.init = () => {
      let ws = new WebSocket(`${this.url}`)
      this.ws = ws

      ws.onopen = () => {
        this.send({ action: 'joinRoom', payload: { roomID } }, { bypassSystemReady: true })
      }

      ws.onmessage = (ev) => {
        try {
          let data = JSON.parse(ev.data)
          console.log('on any message', data)

          this.events.emit(data.action, data.payload)
        } catch (e) {
          console.error(e)
        }
      }

      ws.onclose = () => {
        this.clean()
        console.log('closed, reconnecting in 10 seconds')
        setTimeout(() => {
          this.init()
        }, 1000 * 10)
      }

      ws.onerror = (err) => {
        console.error(err)
        this.clean()
        console.log('error, reconnecting in 10 seconds')
        setTimeout(() => {
          this.init()
        }, 1000 * 10)
      }
    }

    this.init()
  }
}

class MyEventEmitter {
  constructor() {
    this._events = {}
  }

  on(name, listener) {
    if (!this._events[name]) {
      this._events[name] = []
    }

    this._events[name].push(listener)
  }

  removeListener(name, listenerToRemove) {
    if (!this._events[name]) {
      throw new Error(`Can't remove a listener. Event "${name}" doesn't exits.`)
    }

    const filterListeners = (listener) => listener !== listenerToRemove

    this._events[name] = this._events[name].filter(filterListeners)
  }

  emit(name, data) {
    if (!this._events[name]) {
      console.warn(new Error(`Can't emit an event. Event "${name}" doesn't exits.`))
      return
    }

    const fireCallbacks = (callback) => {
      callback(data)
    }

    this._events[name].forEach(fireCallbacks)
  }
}

/**!SECTION
 *
 *
      let auto = new WSAuto({ roomID: docName, url: AWSBackend[process.env.NODE_ENV].ws })
      set({ socket: auto })

      auto.on('all-ready', () => {
        auto.send({
          action: 'pushGraph',
          payload: {
            docName: docName,
          },
        })
      })

      auto.on('pushGraph', (payload) => {
        //
        console.log(payload)
        //
      })
 */
