// for UI (View/Controller) code

import  {
    html, render,
    useState,
    setApi,
    setState, getState, clearState,
} from 'simple-web'
import { ContextExclusionPlugin } from 'webpack'

let api /* == web.api object */ = setApi({
    'user.signon': {
        url: '/httpbin/post',
        input: (a) => ({cmd:'signon', ...a}),
        output: async (r) => {
            setState('user.signed_on', true)
            setState('ajax.headers', {
                'Authorization': 'Bearer (jwt)'
            })
            return r
        }
    },

    'user.signoff': {
        url: '/httpbin/post',
        input: (a) => ({cmd:'signoff', ...a}),
        output: async (a) => {
            clearState()
            return a
        }
    }
})



export const App = (props) => {

    const [signedOn, setSignedOn] = useState(getState('user.signed_on'))

    return html`

    <div class="container">
    <div class="row">
    <div class="col-12">

    <div class="alert alert-primary" role="alert">
    <i class="bi-alarm" style="font-size: 2rem; padding-right:10px"></i>
    ${signedOn ? 'signed-on, thank you!' : 'please, sign on'}
    </div>

    ${!signedOn&& html`
        <form id="form1">
        <div class="mb-3">
            <label class="form-label">User Id</label>
            <input name="user_id" type="text" class="form-control" />
        </div>
        <div class="mb-3">
            <label class="form-label">Password</label>
            <input name="user_pwd" type="password" class="form-control" />
        </div>
        <button type="button"
            class="btn btn-primary"
            data-form-id="form1"
            onClick=${async (e) => {
                let id = e.target.dataset.formId
                let fe = document.getElementById(id)
                let f = new FormData(fe)
                let a = Object.fromEntries(f.entries())
                let r = await api.user.signon(a)

                setSignedOn(true)

                let log = document.getElementById('log')
                log.innerHTML = JSON.stringify(r, null, 2)

            }}
        >Sign-on</button>
        </form>`
    }

    ${signedOn && html`
        <button type="button"
            class="btn btn-primary"
            data-form-id="form1"
            onClick=${async (e) => {
                setSignedOn(false)
                let r = await api.user.signoff()

                let log = document.getElementById('log')
                log.innerHTML = JSON.stringify(r, null, 2)
            }}
        >Sign-off</button>
        `
    }


    </div></div>

    <div class="row"><div class="col-12"><pre id="log"></pre></div></div>
    </div>
    `
}

const getTargetId = () => {
    try {
        let el = document.currentScript
        return el.dataset.targetId
    } catch(x) {
    }
}


render(html`<${App} name="xxx" />`, document.getElementById(getTargetId() || 'root'))

