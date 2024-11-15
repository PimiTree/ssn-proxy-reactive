export class SSNRenderState {
    constructor() {
        this.renderEnabled = true;
        this.extendTimer = null;

        this.renderArray = [];
        this.beforeRenderArray = [];
        this.afterRenderArray = [];

        this.frame = null;
        this.ref = null;
    }
    createState = (props)=> {
        if (props.renderArray != null) this.renderArray = props.renderArray;
        if (props.beforeRenderArray != null) this.beforeRenderArray = props.beforeRenderArray;
        if (props.afterRenderArray != null) this.afterRenderArray = props.afterRenderArray;

        this.ref = props.obj;
        const proxy =  new Proxy(props.obj, {
            set: (target, key, value, receiver) => {
                Reflect.set(target, key, value, receiver)
                if (this.renderEnabled) {
                    this.forceUpdateRender();
                }
                return true;
            },
            get(target, key, receiver) {
                return Reflect.get(target, key, receiver);
            }
        });

        this.forceUpdateRender();
    
        return proxy;
    }

    forceUpdateRender = () => {
        cancelAnimationFrame(this.frame);
        this.frame = requestAnimationFrame(() => {
            this.beforeRender();
            this.render();
    
            requestAnimationFrame(() => {
                this.afterRender()
            })
        });
    }

    enableRendering = () => {
        this.renderEnabled = true;
    }

    disableRendering = () => {
        this.renderEnabled = false;
    }

    render = () => {
        for (let i = 0; i < this.renderArray.length; i++) {
            this.renderArray[i]();
        }
    }

    beforeRender = () => {
        for (let i = 0; i < this.beforeRenderArray.length; i++) {
            this.beforeRenderArray[i]();
        }
    }

    afterRender = () => {
        for (let i = 0; i < this.afterRenderArray.length; i++) {
            this.afterRenderArray[i]();
        }
    }


}