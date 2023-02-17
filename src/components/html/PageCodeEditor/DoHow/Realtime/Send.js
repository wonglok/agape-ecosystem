import { toBase64, fromBase64 } from 'lib0/buffer'
import { AWSBackend } from 'aws.config'

export class Send {
  constructor({ doc, url, docName }) {
    this.url = url
    this.docName = docName
    this.doc = doc
    // this.set = set
    // this.get = get
    this.open({ doc, url, docName })
  }
  ensureSend(object) {
    let tt = setInterval(() => {
      if (this?.socket?.readyState === this?.socket?.OPEN && this.socket) {
        clearInterval(tt)
        this?.socket?.send(JSON.stringify(object))
      }
    })
  }
  async open({}) {
    if (this.socket) {
      this.socket.onerror = () => {}
      this.socket.onopen = () => {}
      this.socket.onclose = () => {}
      this.socket.onmessage = () => {}
      this.socket.close()
    }
    this.socket = new WebSocket(this.url)
    this.socket.onmessage = (ev) => {
      let bodyData = JSON.parse(ev.data)
      let action = bodyData.action

      if (action === 'init') {
        this.socket.connectionId = bodyData.connectionId
        Y.applyUpdate(this.doc, fromBase64(bodyData.update), 'init')
      }

      if (action === 'operation') {
        Y.applyUpdate(this.doc, fromBase64(bodyData.update), 'operation')
      }

      // if (action === 'init') {
      //   this.socket.connectionId = bodyData.connectionId
      //   Y.applyUpdate(this.doc, fromBase64(bodyData.update), 'init')
      // }

      // if (operation === 'init') {
      //   this.socket.connectionId = bodyData.connectionId
      //   console.log('init apply update')
      //   Y.applyUpdate(this.doc, fromBase64(bodyData.update), 'init')
      // }
    }

    this.socket.onerror = () => {
      setTimeout(() => {
        this.open({})
      }, 1000 * 30)
    }

    this.socket.onclose = () => {
      setTimeout(() => {
        this.open({})
      }, 1000 * 30)
    }

    this.doc.on('update', (update, origin) => {
      if (origin === null) {
        this.ensureSend({ action: 'operation', docName: this.docName, update: toBase64(update) })
      }
    })

    this.ensureSend({ action: 'init', docName: this.docName })
  }
  close() {
    this.socket.onerror = () => {}
    this.socket.onopen = () => {}
    this.socket.onclose = () => {}
    this.socket.onmessage = () => {}
    this.socket.close()
    this.socket = false
  }
}
