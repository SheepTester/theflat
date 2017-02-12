/*
  [type WIN/DIE colon and space must be there] WIN: message
  [type -1 =+-<>?] storyid: var="val" then nextstoryid
  [type 1] storyid: "message" then nextstoryid
  [type 2 #+-] storyid: "message" var# then nextstoryid
  [type 3 =<>] storyid: "message" var= then nextstoryid
*/
function magic(input) {
  var lines=input.split(/\r?\n/),json={};
  function rio(str,regex,start) { // rio=regex index of
    var start;
    if (!start) start=0;
    if (start===-1) start=str.length-1;
    for (var i=start;i<str.length;i++) if (regex.test(str[i])) return i;
    return -1;
  }
  function compareIOs(isThis,beforeThis) { // compares the values of indexof's
    if (beforeThis===-1) return true;
    else if (isThis===-1) return false;
    else if (isThis<beforeThis) return true;
    else return false;
  }
  function slice(str,from,to) { // because I'm dealing with the ever-so anonying -1's from indexof
    if (from===-1) from=0;
    if (to===-1) to=str.length;
    return str.slice(from,to);
  }
  for (var i=0;i<lines.length;i++) {
    var line=lines[i],
    storyid,
    j=rio(line,/\W/);
    if (j>-1) {
      storyid=line.slice(0,j).replace(/\s/g,'');
      json[storyid]={};
      if (storyid==='WIN'||storyid==='DIE') {
        json[storyid]=slice(line,line.indexOf(':')+2,-1);
      } else if (compareIOs(rio(line,/\w/,j),rio(line,/["']/,j))) { // are we finding a var before a quote?
        json[storyid].type=-1; // this is type -1, the redirect
        j=rio(line,/\w/,j)+1;
        json[storyid].var=slice(line,j-1,rio(line,/\W/,j));
        j=rio(line,/[+-=<>?]/,j);
        var mode;
        switch (line[j]) {
          case '=':
            mode='is';
            break;
          case '+':
            mode='add';
            break;
          case '-':
            mode='sub';
            break;
          case '>':
            mode='app';
            break;
          case '<':
            mode='pre';
            break;
          case '?':
            mode='rand';
            break;
        }
        if (compareIOs(line.indexOf('"',j),line.indexOf("'",j))) {j=line.indexOf('"',j)+1;json[storyid][mode]=slice(line,j,line.indexOf('"',j));}
        else {j=line.indexOf("'",j)+1;json[storyid][mode]=slice(line,j,line.indexOf("'",j));}
        j=rio(line,/\w/,line.indexOf('then',j)+5);
        json[storyid].then=slice(line,j,rio(line,/\W/,j));
      } else {
        if (compareIOs(line.indexOf('"',j),line.indexOf("'",j))) {j=line.indexOf('"',j)+1;json[storyid].msg=slice(line,j,line.indexOf('"',j));j=line.indexOf('"',j)+1;}
        else {j=line.indexOf("'",j)+1;json[storyid].msg=slice(line,j,line.indexOf("'",j));j=line.indexOf("'",j)+1;}
        if (line.indexOf('choices',j)>-1) {
          json[storyid].type=0; // this is type 0, the multiple choice
        } else if (rio(line,/[=#+-<>]/,j)>-1) {
          // types 2-3, the ones with inputs
          j=rio(line,/\w/,j);
          var vari=slice(line,j,rio(line,/\W/,j));
          j=rio(line,/[=#+-<>]/,rio(line,/\W/,j));
          switch (line[j]) {
            case '=':
              json[storyid].is=vari;
              json[storyid].type=3; // this is type 3, the string input
              break;
            case '<':
              json[storyid].pre=vari;
              json[storyid].type=3;
              break;
            case '>':
              json[storyid].app=vari;
              json[storyid].type=3;
              break;
            case '#':
              json[storyid].is=vari;
              json[storyid].type=2; // this is type 2, the number input
              break;
            case '+':
              json[storyid].add=vari;
              json[storyid].type=2;
              break;
            case '-':
              json[storyid].sub=vari;
              json[storyid].type=2;
              break;
          }
          j=rio(line,/\w/,line.indexOf('then',j+1)+5);
          json[storyid].then=slice(line,j,rio(line,/\W/,j));
        } else {
          json[storyid].type=1; // this is type 1, the story
          j=rio(line,/\w/,line.indexOf('then',j)+5);
          json[storyid].then=slice(line,j,rio(line,/\W/,j));
        }
      }
    }
  }
  return JSON.stringify(json);
}
