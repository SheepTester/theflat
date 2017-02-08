// temp
var test={
  "INIT":{"type":0,"msg":"hi","choices":["Die!","DIE","Win?","WIN","choice3","merp","choice4","ehh"]},
  "merp":{"type":-1,"var":"mep","set":"Hi","then":"merps"},
  "merps":{"type":1,"msg":{"if":"mep","is":"Hi","then":"wow","else":"wat"},"then":"hi"},
  "hi":{"type":1,"msg":{"text":"best animal: %s a percent: %% something useless: %p and value of mep: %v","replace":["sheep","mep"]},"then":"WIN"},
  "ehh":{"type":-1,"var":"mep","set":"2","then":"eh"},
  "eh":{"type":2,"msg":"your number?","add":"mep","then":"lol"},
  "lol":{"type":3,"msg":{"text":"your number + 2 is %v","replace":["mep"]},"pre":"mep","then":"report"},
  "report":{"type":1,"msg":{"text":"%v","replace":"mep"},"then":"WIN"},
  "DIE":{"text":"you ded %i","replace":"logo.svg"},
  "WIN":"you live less than < greater than >"
};
(function() {
  var story=test,values={};
  function remove(selector) {
    var s=document.querySelectorAll(selector);
    for (var i=0;i<s.length;i++) s[i].parentNode.removeChild(s[i]);
  }
  function val(varname) {
    if (values[varname]) return values[varname];
    else return '';
  }
  function text(txt) {
    if (typeof txt==='string') return txt;
    else if (typeof txt==='object') {
      if (txt.if) {
        if (txt.is) return val(txt.if)==text(txt.is)?text(txt.then):text(txt.else);
        if (txt.isnt) return val(txt.if)!=text(txt.isnt)?text(txt.then):text(txt.else);
        if (txt.lt) return Number(val(txt.if))<Number(text(txt.lt))?text(txt.then):text(txt.else);
        if (txt.gt) return Number(val(txt.if))>Number(text(txt.gt))?text(txt.then):text(txt.else);
        if (txt.lte) return Number(val(txt.if))<=Number(text(txt.lte))?text(txt.then):text(txt.else);
        if (txt.gte) return Number(val(txt.if))>=Number(text(txt.gte))?text(txt.then):text(txt.else);
      } else if (txt.replace) {
        var t=txt.text,r=0,rr=txt.replace;
        if (typeof rr==='string') rr=[rr];
        for (var i=0;i<t.length;) {
          i=t.indexOf('%',i);
          if (i===-1) i=t.length;
          if (t[i+1]==='s') {
            var replace=text(rr[r]);
            t=t.slice(0,i)+replace+t.slice(i+2);
            i+=replace.length;
            r++;
          } else if (t[i+1]==='v') {
            var replace=val(text(rr[r]));
            t=t.slice(0,i)+replace+t.slice(i+2);
            i+=replace.length;
            r++;
          } else if (t[i+1]==='i') {
            var replace=text(rr[r]);
            replace='&ilt;img src="'+replace+'" alt="'+replace+'" title="'+replace+'"/&igt;';
            t=t.slice(0,i)+replace+t.slice(i+2);
            i+=replace.length;
            r++;
          } else if (t[i+1]==='%') {
            t=t.slice(0,i)+t.slice(i+1);
            i++;
          } else i++;
        }
        return t;
      }
    }
  }
  function bye(elem,then) {
    var then;
    elem.classList.add('bye');
    setTimeout(_=>{
      elem.parentNode.removeChild(elem);
      if (then) then();
    },300);
  }
  function play(storyid) {
    var data=story[storyid],page,msg;
    if (data.type!==-1) {
      page=document.createElement('page');
      msg=document.createElement('msg');
      msg.innerHTML=text(data.type!==undefined?data.msg:data)
        .replace(/\&/g,'&amp;')
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;')
        .replace(/&amp;ilt;img/g,'<img')
        .replace(/\/&amp;igt;/g,'/>');
      page.appendChild(msg);
      page.classList.add('hello');
      setTimeout(_=>page.classList.remove('hello'),300);
    }
    switch (data.type) {
      case -1:
        var varname=text(data.var);
        if (data.set) values[varname]=text(data.set);
        else if (data.add) values[varname]=(Number(values[varname])+Number(text(data.add))).toString();
        else if (data.sub) values[varname]=(Number(values[varname])-Number(text(data.sub))).toString();
        else if (data.app) values[varname]+=text(data.app);
        else if (data.pre) values[varname]=text(data.pre)+values[varname];
        setTimeout(_=>play(text(data.then)),0);
        break;
      case 0:
        var choices=document.createElement('choices');
        for (var i=0;i<data.choices.length;i+=2) {
          var choice=document.createElement('choice');
          choice.innerHTML=text(data.choices[i]);
          choice.dataset.storyid=text(data.choices[i+1]);
          choice.onclick=e=>bye(page,_=>play(e.target.dataset.storyid));
          choices.appendChild(choice);
        }
        page.appendChild(choices);
        break;
      case 1:
        var cont=document.createElement('continue');
        cont.innerHTML="continue";
        cont.onclick=e=>bye(page,_=>play(text(data.then)));;
        page.appendChild(cont);
        break;
      case 2:
        var inp=document.createElement('input')
        cont=document.createElement('continue');
        inp.type='number';
        if (data.min) inp.min=text(data.min);
        if (data.max) inp.max=text(data.max);
        if (data.step) inp.step=text(data.step);
        page.appendChild(inp);
        cont.innerHTML="ok";
        cont.onclick=e=>{
          if (data.is) values[text(data.is)]=inp.value;
          if (data.add) values[text(data.add)]=(Number(values[text(data.add)])+Number(inp.value)).toString();
          if (data.sub) values[text(data.sub)]=(Number(values[text(data.sub)])-Number(inp.value)).toString();
          bye(page,_=>play(text(data.then)));
        };
        page.appendChild(cont);
        break;
      case 3:
        var inp=document.createElement('input')
        cont=document.createElement('continue');
        inp.type='text';
        if (data.min) inp.min=text(data.min);
        if (data.max) inp.max=text(data.max);
        if (data.step) inp.step=text(data.step);
        page.appendChild(inp);
        cont.innerHTML="ok";
        cont.onclick=e=>{
          if (data.is) values[text(data.is)]=inp.value;
          if (data.app) values[text(data.app)]+=inp.value;
          if (data.pre) values[text(data.pre)]=inp.value+values[text(data.pre)];
          bye(page,_=>play(text(data.then)));
        };
        page.appendChild(cont);
        break;
      default:
        var cont=document.createElement('continue');
        cont.innerHTML=storyid==='WIN'?'Celebrate':'Accept my misfortune';
        cont.onclick=e=>bye(page,_=>{
          document.querySelector('btns').classList.remove('hide');
          document.querySelector('btns').classList.add('hello');
          setTimeout(_=>document.querySelector('btns').classList.remove('hello'),300);
        });;
        page.appendChild(cont);
    }
    if (page)
      document.body.appendChild(page);
  }
  document.querySelector('#play').onclick=e=>{
    document.querySelector('btns').classList.add('bye');
    setTimeout(_=>{
      document.querySelector('btns').classList.remove('bye');
      document.querySelector('btns').classList.add('hide');
      play('INIT');
    },300);
  };
}());
