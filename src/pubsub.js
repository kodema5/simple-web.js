export class PubSub {

    constructor ({
        broadcastChannelId
    }) {
        var me = this
        me._id = 0
        me.channels = {}

        if (broadcastChannelId) {
            let bc = new BroadcastChannel(broadcastChannelId)

            bc.onmessage = (ev) => {
                let {ch, args} = ev.data
                me.publish_.apply(me, [ch].concat(args))
            }

            me.broadcastChannel = bc
        }
    }


    names(id) {
        let [ch, ...ns] = (id || '').split('.')
        return [ch, ns.join('.')
            || `_${++this._id}`] // fallback-id
    }


    subscribe(id, fn, {override=false} ={}) {
        let [ch, n] = this.names(id)
        if (!ch) return

        let channels = this.channels
        if (!channels[ch]) channels[ch] = {}
        let subscribers = channels[ch]

        if (subscribers[n] && !override) {
            throw `subscribe: ${id} already exists`
        }

        subscribers[n] = fn
        return [ch, n].join('.')
    }


    unsubscribe(id) {
        let [ch, n] = this.names(id)
        if (!ch) return

        let subscribers = this.channels[ch]
        if (!subscribers) return

        return delete subscribers[n]
    }

    publish_(ch, ...args) {
        let subscribers = this.channels[ch]
        if (!subscribers) return

        let fns = Object.values(subscribers)
        setTimeout(() => {
            fns.map(fn => fn.apply(null, args))
        }, 0)

        return fns.length

    }

    publish(ch, ...args) {
        if (ch.slice(-1)==='!' && this.broadcastChannel ) {
            this.broadcastChannel.postMessage({
                ch, args
            })
        }
        return this.publish_.apply(this, [ch].concat(args))
    }


    async exec(ch, ...args) {
        let subscribers = this.channels[ch]
        if (!subscribers) return

        let fns = Object.values(subscribers)
            . map(fn => fn.apply(null, args))
        let arr = await Promise.all(fns)

        return Object.keys(subscribers)
            .reduce( (x, id, i) => {
                x[id] = arr[i]
                return x
            }, {})
    }
}

const BROADCAST_CHANNEL_ID = 'web-broadcast-channel'
// this is a global pubsub
let ps = new PubSub({
    broadcastChannelId: BROADCAST_CHANNEL_ID
})
export const publish = ps.publish.bind(ps)
export const subscribe = ps.subscribe.bind(ps)
export const unsubscribe = ps.unsubscribe.bind(ps)
export const exec = ps.exec.bind(ps)


