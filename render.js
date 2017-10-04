// temp
function encode(str) {
  var r='';
  for (var i=0;i<str.length;i++) {
    var ascii=str.charCodeAt(i);
    if (ascii<32) ascii=0;
    else ascii-=31;
    r+=ascii.toString(16)+'g';
  }
  return r.slice(0,-1);
}
function decode(str) {
  var r='';
  str=str.split('g').map(a=>parseInt(a,16));
  for (var i=0;i<str.length;i++) {
    if (str[i]===0) r+='\n';
    else r+=String.fromCharCode(str[i]+31);
  }
  return r;
}
(function() {
  var story,values,history,saves,storydata={},currentstoryid;
  if (localStorage.flatlevels) {
    saves=JSON.parse(localStorage.flatlevels);
  } else {
    saves=[0,"STORYSRC`https://sheeptester.github.io/theflat/test.json`STORYID`INIT`"];
    localStorage.flatlevels=JSON.stringify(saves);
  }
  for (var i=1;i<saves.length;i++) {
    var s=document.createElement('level');
    s.dataset.id=i;
    s.appendChild(document.createElement('edit'));
    document.querySelector('levels').appendChild(s);
    saves[i]=read(saves[i],i);
  }
  for (var span in storydata) {
    (span=>SHEEP.ajax(span,e=>{
      var burpers=storydata[span].split('-').slice(0,-1);
      storydata[span]=JSON.parse(e);
      for (var i=0;i<burpers.length;i++) {
        document.querySelector('level[data-id="'+burpers[i]+'"]').appendChild(document.createTextNode(storydata[span].META.name));
      }
    },e=>{
      var burpers=storydata[span].split('-').slice(0,-1);
      storydata[span]={INIT:{type:-1,var:"mep",set:"Hi",then:"DIE"},DIE:'this level does not currently exist',META:{fail:true}};
      for (var i=0;i<burpers.length;i++) {
        document.querySelector('level[data-id="'+burpers[i]+'"]').appendChild(document.createTextNode('nonexistent'));
        document.querySelector('level[data-id="'+burpers[i]+'"]').classList.add('fail');
      }
    }))(span);
  }
  if (saves[0]!==0) document.querySelector('#play').classList.remove('disabled');
  function savecodas(laobject) {
    var konvertigxis='';
    for (var span in laobject) {
      if (/[`\|]/.test(span)) konvertigxis+=encode(span)+'|';
      else konvertigxis+=span+'`';
      if (/[`\|]/.test(laobject[span])) konvertigxis+=encode(laobject[span])+'|';
      else konvertigxis+=laobject[span]+'`';
    }
    return konvertigxis;
  }
  function read(savecode,i) {
    var t={};
    for (var j=1;j<savecode.length;j++) {
      var k,l;
      if (savecode.indexOf('`',j)===-1) k=savecode.indexOf('|',j);
      else if (savecode.indexOf('|',j)===-1) k=savecode.indexOf('`',j);
      else if (savecode.indexOf('`',j)>savecode.indexOf('|',j)) k=savecode.indexOf('|',j);
      else k=savecode.indexOf('`',j);
      if (k===-1) break;
      if (savecode[k]==='`') l=savecode.slice(j-1,k);
      else l=decode(savecode.slice(j-1,k));
      j=k+1;
      if (savecode.indexOf('`',j)===-1) k=savecode.indexOf('|',j);
      else if (savecode.indexOf('|',j)===-1) k=savecode.indexOf('`',j);
      else if (savecode.indexOf('`',j)>savecode.indexOf('|',j)) k=savecode.indexOf('|',j);
      else k=savecode.indexOf('`',j);
      if (k===-1) break;
      if (savecode[k]==='`') t[l]=savecode.slice(j,k);
      else t[l]=decode(savecode.slice(j,k));
      j=k+1;
    }
    if (!storydata[t.STORYSRC]) storydata[t.STORYSRC]='';
    if (typeof storydata[t.STORYSRC]==='string') storydata[t.STORYSRC]+=i+'-';
    return t;
  }
  function save(savearray) {
    if (saves[0]!==0) document.querySelector('#play').classList.remove('disabled');
    else document.querySelector('#play').classList.add('disabled');
    var t=[savearray[0]];
    for (var i=1;i<savearray.length;i++) t[i]=savecodas(savearray[i]);
    return JSON.stringify(t);
  }
  function Confetti(x,y) {
    this.x=x;
    this.y=y;
    this.box=document.createElement('confetti');
    this.size=Math.random()*10+5;
    this.color=Math.floor(Math.random()*360);
    this.tilt=Math.random()*360;
    this.box.style.left=this.x+'px';
    this.box.style.top=this.y+'px';
    this.box.style.transform='rotate('+this.tilt+'deg)';
    this.box.style.boxShadow='0 0 0 '+this.size+'px hsl('+this.color+',100%,50%)';
    document.querySelector('confettis').appendChild(this.box);
    this.xv=Math.random()*10-5;
    this.yv=Math.random()*-20-10;
    this.interval=setInterval(_=>{
      this.x+=this.xv;
      this.tilt+=this.xv;
      this.y+=this.yv;
      this.yv+=1;
      this.box.style.left=this.x+'px';
      this.box.style.top=this.y+'px';
      this.box.style.transform='rotate('+this.tilt+'deg)';
      if (this.y>window.innerHeight) {
        clearInterval(this.interval);
        document.querySelector('confettis').removeChild(this.box)
      }
    },30);
  }
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
          } else if (t[i+1]==='h') {
            var replace=text(rr[r]);
            replace='&hlt;'+replace+'&hgt;';
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
    document.onkeydown=null;
    elem.classList.add('bye');
    setTimeout(_=>{
      elem.parentNode.removeChild(elem);
      if (then) then();
    },300);
  }
  function play(storyid) {
    var data=story[storyid],page,msg;
    currentstoryid=storyid;
    if (data.type!==-1) {
      history.push(storyid);
      page=document.createElement('page');
      msg=document.createElement('msg');
      msg.innerHTML=text(data.type!==undefined?data.msg:data)
        .replace(/\&/g,'&amp;')
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;')
        .replace(/&amp;ilt;img/g,'<img')
        .replace(/\/&amp;igt;/g,'/>')
        .replace(/&amp;hlt;/g,'<h>')
        .replace(/&amp;hgt;/g,'</h>')
        .replace(/\r?\n/g,'<br>');
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
        else if (data.rand) values[varname]=Math.floor(Math.random()*Number(text(data.rand))).toString();
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
        if (data.choices.length<10)
          document.onkeydown=e=>{
            if (e.keyCode>48&&e.keyCode<58) choices.children[e.keyCode-49].click();
          };
        page.appendChild(choices);
        break;
      case 1:
        var cont=document.createElement('continue');
        cont.innerHTML="continue";
        cont.onclick=e=>bye(page,_=>play(text(data.then)));
        document.onkeydown=e=>{if (e.keyCode===13) cont.click();};
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
        setTimeout(_=>inp.focus(),0);
        cont.innerHTML="ok";
        cont.onclick=e=>{
          if (data.is) values[text(data.is)]=inp.value;
          if (data.add) values[text(data.add)]=(Number(values[text(data.add)])+Number(inp.value)).toString();
          if (data.sub) values[text(data.sub)]=(Number(values[text(data.sub)])-Number(inp.value)).toString();
          bye(page,_=>play(text(data.then)));
        };
        document.onkeydown=e=>{if (e.keyCode===13) cont.click();};
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
        setTimeout(_=>inp.focus(),0);
        cont.innerHTML="ok";
        cont.onclick=e=>{
          if (data.is) values[text(data.is)]=inp.value;
          if (data.app) values[text(data.app)]+=inp.value;
          if (data.pre) values[text(data.pre)]=inp.value+values[text(data.pre)];
          bye(page,_=>play(text(data.then)));
        };
        document.onkeydown=e=>{if (e.keyCode===13) cont.click();};
        page.appendChild(cont);
        break;
      default:
        var cont=document.createElement('continue');
        cont.innerHTML=storyid==='WIN'?'Celebrate':'Accept my misfortune';
        document.querySelector('bar').className=storyid==='WIN'?'win':'die';
        if (storyid==='WIN') {
          var interval=setInterval(_=>new Confetti(window.innerWidth/2,window.innerHeight),30);
          setTimeout(_=>clearInterval(interval),500);
        }
        cont.onclick=e=>bye(page,_=>{
          document.querySelector('btns').classList.remove('hide');
          document.querySelector('btns').classList.add('hello');
          document.querySelector('bar').className='';
          setTimeout(_=>document.querySelector('btns').classList.remove('hello'),300);
        });
        document.onkeydown=e=>{if (e.keyCode===13) cont.click();};
        page.appendChild(cont);
    }
    if (page)
      document.body.appendChild(page);
  }
  document.querySelector('#play').onclick=e=>{
    if (document.querySelector('#play').classList.contains('disabled')) return true; // disabled continue for now
    document.querySelector('btns').classList.add('bye');
    setTimeout(_=>{
      document.querySelector('btns').classList.remove('bye');
      document.querySelector('btns').classList.add('hide');
      document.querySelector('left').className='playing';
      values=saves[saves[0]];
      history=[];
      story=storydata[values.STORYSRC];
      play(story.META.fail?'INIT':values.STORYID);
    },300);
  };
  document.querySelector('levels').onclick=e=>{
    if (e.target.tagName==='LEVEL') {
      document.querySelector('levelcontainer').classList.add('bye');
      setTimeout(_=>{
        document.querySelector('levelcontainer').classList.remove('bye');
        document.querySelector('levelcontainer').classList.add('hide');
        document.querySelector('left').className='playing';
        saves[0]=Number(e.target.dataset.id);
        values=saves[saves[0]];
        history=[];
        story=storydata[values.STORYSRC];
        play(story.META.fail?'INIT':values.STORYID);
      },300);
    } else if (e.target.tagName==='EDIT') {
      document.querySelector('levelcontainer').classList.add('bye');
      setTimeout(_=>{
        document.querySelector('levelcontainer').classList.remove('bye');
        document.querySelector('levelcontainer').classList.add('hide');
        document.querySelector('editr').classList.remove('hide');
        document.querySelector('editr').classList.add('hello');
        setTimeout(_=>document.querySelector('editr').classList.remove('hello'),300);
        document.querySelector('editr').dataset.id=e.target.parentNode.dataset.id;
        document.querySelector('left').className='editing';
        document.querySelector('#src').value=saves[Number(e.target.parentNode.dataset.id)].STORYSRC;
        document.querySelector('#savecode').value=savecodas(saves[Number(e.target.parentNode.dataset.id)]);
      },300);
    }
  };
  document.querySelector('add').onclick=e=>{
    if (document.querySelector('#jsonurl').value) {
      var s=document.createElement('level'),src=document.querySelector('#jsonurl').value;
      s.dataset.id=saves.length;
      s.appendChild(document.createElement('edit'));
      document.querySelector('levels').appendChild(s);
      saves.push({STORYID:'INIT',STORYSRC:src});
      if (!storydata[src]) SHEEP.ajax(src,e=>{
        storydata[src]=JSON.parse(e);
        s.appendChild(document.createTextNode(storydata[src].META.name));
      });
      else s.appendChild(document.createTextNode(storydata[src].META.name));
      localStorage.flatlevels=save(saves);
      document.querySelector('#jsonurl').value='';
    }
  };
  document.querySelector('#jsonurl').onkeydown=e=>{
    if (e.keyCode===13) document.querySelector('add').click();
  };
  document.querySelector('#load').onclick=e=>{
    document.querySelector('btns').classList.add('bye');
    setTimeout(_=>{
      document.querySelector('btns').classList.remove('bye');
      document.querySelector('btns').classList.add('hide');
      document.querySelector('levelcontainer').classList.remove('hide');
      document.querySelector('levelcontainer').classList.add('hello');
      setTimeout(_=>document.querySelector('levelcontainer').classList.remove('hello'),300);
    },300);
  };
  document.querySelector('#menu').onclick=e=>{
    if (!document.querySelector('btns').classList.contains('hide')||document.querySelector('.bye')||document.querySelector('.hello')) return true;
    var t,elm;
    if (document.querySelector('page')) {t='p';elm=document.querySelector('page');}
    else if (!document.querySelector('levelcontainer').classList.contains('hide')) {t='l';elm=document.querySelector('levelcontainer');}
    else if (!document.querySelector('editr').classList.contains('hide')) {t='e';elm=document.querySelector('editr');}
    elm.classList.add('bye');
    setTimeout(_=>{
      if (t=='p') document.querySelector('page').parentNode.removeChild(document.querySelector('page'));
      else {
        elm.classList.remove('bye');
        elm.classList.add('hide');
      }
      document.querySelector('btns').classList.remove('hide');
      document.querySelector('btns').classList.add('hello');
      setTimeout(_=>document.querySelector('btns').classList.remove('hello'),300);
    },300);
    document.querySelector('left').className='';
  };
  document.querySelector('#savi').onclick=e=>{
    saves[saves[0]].STORYID=currentstoryid;
    if (currentstoryid=='WIN'||currentstoryid=='DIE') {
      saves[0]=0;
    }
    localStorage.flatlevels=save(saves);
  };
  document.querySelector('restart').onclick=e=>{
    var t=Number(document.querySelector('editr').dataset.id);
    saves[t]={STORYID:'INIT',STORYSRC:saves[t].STORYSRC};
    if (saves[0]===t) saves[0]=0;
    document.querySelector('#savecode').value=savecodas(saves[t]);
  };
  document.querySelector('copy').onclick=e=>{
    var s=document.createElement('level'),src=document.querySelector('#src').value;
    s.dataset.id=saves.length;
    s.appendChild(document.createElement('edit'));
    s.appendChild(document.createTextNode(storydata[src].META.name));
    document.querySelector('levels').appendChild(s);
    saves.push(saves[Number(document.querySelector('editr').dataset.id)]);
    localStorage.flatlevels=save(saves);
    document.querySelector('#lvls').click();
  };
  document.querySelector('#lvls').onclick=e=>{
    document.querySelector('editr').classList.add('bye');
    document.querySelector('left').classList.remove('editing');
    setTimeout(_=>{
      document.querySelector('editr').classList.remove('bye');
      document.querySelector('editr').classList.add('hide');
      document.querySelector('levelcontainer').classList.remove('hide');
      document.querySelector('levelcontainer').classList.add('hello');
      setTimeout(_=>document.querySelector('levelcontainer').classList.remove('hello'),300);
    },300);
  };
}());
