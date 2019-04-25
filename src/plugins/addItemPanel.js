const deepMix = require('@antv/util/lib/deep-mix');
const each = require('@antv/util/lib/each');
const wrapBehavior = require('@antv/util/lib/event/wrap-behavior');
const createDOM = require('@antv/util/lib/dom/create-dom');
const modifyCSS = require('@antv/util/lib/dom/modify-css');

class AddItemPanel {

  constructor(cfgs) {
    this._cfgs = deepMix(this.getDefaultCfg(), cfgs);
  }
  getDefaultCfg() {
    return { container: null };
  }

  get(key) {
    return this._cfgs[key];
  }
  set(key, val) {
    this._cfgs[key] = val;
  }

  initPlugin(graph) {
    const self = this;
    this.set('graph', graph);
    const events = self.getEvents();
    const bindEvents = {};
    each(events, (v, k) => {
      const event = wrapBehavior(self, v);
      bindEvents[k] = event;
      graph.on(k, event);
    });
    this._events = bindEvents;
    this.init();
  }

  init(){
    this.initEvents();
  }

  getEvents() {
    return {  };
  }

  initEvents() {
    const graph = this.get('graph');
    const parentNode = this.get('container');
    const ghost = createDOM('<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"'+' style="opacity:0"/>');
    each(parentNode.children,(child,i)=>{
      if(child.hasAttribute('data-item')){
        const addModel = (new Function("return " + child.getAttribute('data-item')))();
        child.addEventListener('dragstart', e => {
          e.dataTransfer.setDragImage(ghost, 0, 0);
          graph.set('onDragAddNode',true);
          graph.set('addModel',addModel);
        });
        child.addEventListener('dragend', e => {
          graph.emit('canvas:mouseup',e);
          graph.set('onDragAddNode',false);
          graph.set('addModel',null);
        });
      }
    })
  }

  destroy() {
    this.get('canvas').destroy();
    const container = this.get('container');
    container.parentNode.removeChild(container);
  }
}

export default AddItemPanel;