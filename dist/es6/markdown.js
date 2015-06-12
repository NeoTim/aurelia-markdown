import {bindable,noView,useView,useShadowDOM,skipContentProcessing} from 'aurelia-framework';
import showdown from 'showdown';
import prism from 'prism';

@skipContentProcessing
@noView
export class MarkdownCustomElement {

  @bindable model = null;

  static inject = [Element];
  constructor(element){
    this.element = element;
    this.converter = new showdown.converter();
  }

  attached(){
    this.root = this.element.shadowRoot || this.element;
    if(!this.model) {
      this.valueChanged(this.element.innerHTML);
    }else{
      this.valueChanged(this.model);
    }
  }

  modelChanged(){
    this.valueChanged(this.model);
  }

  valueChanged(newValue){
    if(!this.root) return;
    this.root.innerHTML = this.converter.makeHtml(dedent(newValue));
    var codes = this.root.querySelectorAll('pre code');
    for(var node of codes) {
      var c = node.className;
      node.classList.remove(c);
      node.classList.add("language-"+c);

      var pre = node.parentNode;
      pre.classList.remove(c);
      pre.classList.add("language-"+c);

      prism.highlightElement(node);
    }
  }
}

function dedent(str){
  var match = str.match(/^[ \t]*(?=\S)/gm);
  if (!match) return str;

  var indent = Math.min.apply(Math, match.map(function (el) {
    return el.length;
  }));

  var re = new RegExp('^[ \\t]{' + indent + '}', 'gm');
  return indent > 0 ? str.replace(re, '') : str;
}
