var Ue=Object.defineProperty;var re=t=>{throw TypeError(t)};var Ge=(t,e,r)=>e in t?Ue(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r;var g=(t,e,r)=>Ge(t,typeof e!="symbol"?e+"":e,r),qt=(t,e,r)=>e.has(t)||re("Cannot "+r);var p=(t,e,r)=>(qt(t,e,"read from private field"),r?r.call(t):e.get(t)),m=(t,e,r)=>e.has(t)?re("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,r),h=(t,e,r,n)=>(qt(t,e,"write to private field"),n?n.call(t,r):e.set(t,r),r),v=(t,e,r)=>(qt(t,e,"access private method"),r);var ne=(t,e,r,n)=>({set _(o){h(t,e,o,r)},get _(){return p(t,e,n)}});var oe=(t,e,r)=>(n,o)=>{let i=-1;return a(0);async function a(l){if(l<=i)throw new Error("next() called multiple times");i=l;let s,c=!1,d;if(t[l]?(d=t[l][0][0],n.req.routeIndex=l):d=l===t.length&&o||void 0,d)try{s=await d(n,()=>a(l+1))}catch(u){if(u instanceof Error&&e)n.error=u,s=await e(u,n),c=!0;else throw u}else n.finalized===!1&&r&&(s=await r(n));return s&&(n.finalized===!1||c)&&(n.res=s),n}},qe=Symbol(),We=async(t,e=Object.create(null))=>{const{all:r=!1,dot:n=!1}=e,i=(t instanceof _e?t.raw.headers:t.headers).get("Content-Type");return i!=null&&i.startsWith("multipart/form-data")||i!=null&&i.startsWith("application/x-www-form-urlencoded")?Ye(t,{all:r,dot:n}):{}};async function Ye(t,e){const r=await t.formData();return r?Je(r,e):{}}function Je(t,e){const r=Object.create(null);return t.forEach((n,o)=>{e.all||o.endsWith("[]")?Ve(r,o,n):r[o]=n}),e.dot&&Object.entries(r).forEach(([n,o])=>{n.includes(".")&&(Xe(r,n,o),delete r[n])}),r}var Ve=(t,e,r)=>{t[e]!==void 0?Array.isArray(t[e])?t[e].push(r):t[e]=[t[e],r]:e.endsWith("[]")?t[e]=[r]:t[e]=r},Xe=(t,e,r)=>{if(/(?:^|\.)__proto__\./.test(e))return;let n=t;const o=e.split(".");o.forEach((i,a)=>{a===o.length-1?n[i]=r:((!n[i]||typeof n[i]!="object"||Array.isArray(n[i])||n[i]instanceof File)&&(n[i]=Object.create(null)),n=n[i])})},Fe=t=>{const e=t.split("/");return e[0]===""&&e.shift(),e},Ke=t=>{const{groups:e,path:r}=Ze(t),n=Fe(r);return Qe(n,e)},Ze=t=>{const e=[];return t=t.replace(/\{[^}]+\}/g,(r,n)=>{const o=`@${n}`;return e.push([o,r]),o}),{groups:e,path:t}},Qe=(t,e)=>{for(let r=e.length-1;r>=0;r--){const[n]=e[r];for(let o=t.length-1;o>=0;o--)if(t[o].includes(n)){t[o]=t[o].replace(n,e[r][1]);break}}return t},Rt={},tr=(t,e)=>{if(t==="*")return"*";const r=t.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);if(r){const n=`${t}#${e}`;return Rt[n]||(r[2]?Rt[n]=e&&e[0]!==":"&&e[0]!=="*"?[n,r[1],new RegExp(`^${r[2]}(?=/${e})`)]:[t,r[1],new RegExp(`^${r[2]}$`)]:Rt[n]=[t,r[1],!0]),Rt[n]}return null},Mt=(t,e)=>{try{return e(t)}catch{return t.replace(/(?:%[0-9A-Fa-f]{2})+/g,r=>{try{return e(r)}catch{return r}})}},er=t=>Mt(t,decodeURI),$e=t=>{const e=t.url,r=e.indexOf("/",e.indexOf(":")+4);let n=r;for(;n<e.length;n++){const o=e.charCodeAt(n);if(o===37){const i=e.indexOf("?",n),a=e.indexOf("#",n),l=i===-1?a===-1?void 0:a:a===-1?i:Math.min(i,a),s=e.slice(r,l);return er(s.includes("%25")?s.replace(/%25/g,"%2525"):s)}else if(o===63||o===35)break}return e.slice(r,n)},rr=t=>{const e=$e(t);return e.length>1&&e.at(-1)==="/"?e.slice(0,-1):e},lt=(t,e,...r)=>(r.length&&(e=lt(e,...r)),`${(t==null?void 0:t[0])==="/"?"":"/"}${t}${e==="/"?"":`${(t==null?void 0:t.at(-1))==="/"?"":"/"}${(e==null?void 0:e[0])==="/"?e.slice(1):e}`}`),Ee=t=>{if(t.charCodeAt(t.length-1)!==63||!t.includes(":"))return null;const e=t.split("/"),r=[];let n="";return e.forEach(o=>{if(o!==""&&!/\:/.test(o))n+="/"+o;else if(/\:/.test(o))if(/\?/.test(o)){r.length===0&&n===""?r.push("/"):r.push(n);const i=o.replace("?","");n+="/"+i,r.push(n)}else n+="/"+o}),r.filter((o,i,a)=>a.indexOf(o)===i)},Wt=t=>/[%+]/.test(t)?(t.indexOf("+")!==-1&&(t=t.replace(/\+/g," ")),t.indexOf("%")!==-1?Mt(t,Xt):t):t,ke=(t,e,r)=>{let n;if(!r&&e&&!/[%+]/.test(e)){let a=t.indexOf("?",8);if(a===-1)return;for(t.startsWith(e,a+1)||(a=t.indexOf(`&${e}`,a+1));a!==-1;){const l=t.charCodeAt(a+e.length+1);if(l===61){const s=a+e.length+2,c=t.indexOf("&",s);return Wt(t.slice(s,c===-1?void 0:c))}else if(l==38||isNaN(l))return"";a=t.indexOf(`&${e}`,a+1)}if(n=/[%+]/.test(t),!n)return}const o={};n??(n=/[%+]/.test(t));let i=t.indexOf("?",8);for(;i!==-1;){const a=t.indexOf("&",i+1);let l=t.indexOf("=",i);l>a&&a!==-1&&(l=-1);let s=t.slice(i+1,l===-1?a===-1?void 0:a:l);if(n&&(s=Wt(s)),i=a,s==="")continue;let c;l===-1?c="":(c=t.slice(l+1,a===-1?void 0:a),n&&(c=Wt(c))),r?(o[s]&&Array.isArray(o[s])||(o[s]=[]),o[s].push(c)):o[s]??(o[s]=c)}return e?o[e]:o},nr=ke,or=(t,e)=>ke(t,e,!0),Xt=decodeURIComponent,ie=t=>Mt(t,Xt),dt,S,M,Ce,De,Vt,N,be,_e=(be=class{constructor(t,e="/",r=[[]]){m(this,M);g(this,"raw");m(this,dt);m(this,S);g(this,"routeIndex",0);g(this,"path");g(this,"bodyCache",{});m(this,N,t=>{const{bodyCache:e,raw:r}=this,n=e[t];if(n)return n;const o=Object.keys(e)[0];return o?e[o].then(i=>(o==="json"&&(i=JSON.stringify(i)),new Response(i)[t]())):e[t]=r[t]()});this.raw=t,this.path=e,h(this,S,r),h(this,dt,{})}param(t){return t?v(this,M,Ce).call(this,t):v(this,M,De).call(this)}query(t){return nr(this.url,t)}queries(t){return or(this.url,t)}header(t){if(t)return this.raw.headers.get(t)??void 0;const e={};return this.raw.headers.forEach((r,n)=>{e[n]=r}),e}async parseBody(t){return We(this,t)}json(){return p(this,N).call(this,"text").then(t=>JSON.parse(t))}text(){return p(this,N).call(this,"text")}arrayBuffer(){return p(this,N).call(this,"arrayBuffer")}blob(){return p(this,N).call(this,"blob")}formData(){return p(this,N).call(this,"formData")}addValidatedData(t,e){p(this,dt)[t]=e}valid(t){return p(this,dt)[t]}get url(){return this.raw.url}get method(){return this.raw.method}get[qe](){return p(this,S)}get matchedRoutes(){return p(this,S)[0].map(([[,t]])=>t)}get routePath(){return p(this,S)[0].map(([[,t]])=>t)[this.routeIndex].path}},dt=new WeakMap,S=new WeakMap,M=new WeakSet,Ce=function(t){const e=p(this,S)[0][this.routeIndex][1][t],r=v(this,M,Vt).call(this,e);return r&&/\%/.test(r)?ie(r):r},De=function(){const t={},e=Object.keys(p(this,S)[0][this.routeIndex][1]);for(const r of e){const n=v(this,M,Vt).call(this,p(this,S)[0][this.routeIndex][1][r]);n!==void 0&&(t[r]=/\%/.test(n)?ie(n):n)}return t},Vt=function(t){return p(this,S)[1]?p(this,S)[1][t]:t},N=new WeakMap,be),ir={Stringify:1},Ae=async(t,e,r,n,o)=>{typeof t=="object"&&!(t instanceof String)&&(t instanceof Promise||(t=t.toString()),t instanceof Promise&&(t=await t));const i=t.callbacks;return i!=null&&i.length?(o?o[0]+=t:o=[t],Promise.all(i.map(l=>l({phase:e,buffer:o,context:n}))).then(l=>Promise.all(l.filter(Boolean).map(s=>Ae(s,e,!1,n,o))).then(()=>o[0]))):Promise.resolve(t)},ar="text/plain; charset=UTF-8",Yt=(t,e)=>({"Content-Type":t,...e}),Ft=(t,e)=>new Response(t,e),_t,Ct,I,ut,j,A,Dt,ft,ht,Z,At,St,U,ct,me,sr=(me=class{constructor(t,e){m(this,U);m(this,_t);m(this,Ct);g(this,"env",{});m(this,I);g(this,"finalized",!1);g(this,"error");m(this,ut);m(this,j);m(this,A);m(this,Dt);m(this,ft);m(this,ht);m(this,Z);m(this,At);m(this,St);g(this,"render",(...t)=>(p(this,ft)??h(this,ft,e=>this.html(e)),p(this,ft).call(this,...t)));g(this,"setLayout",t=>h(this,Dt,t));g(this,"getLayout",()=>p(this,Dt));g(this,"setRenderer",t=>{h(this,ft,t)});g(this,"header",(t,e,r)=>{this.finalized&&h(this,A,Ft(p(this,A).body,p(this,A)));const n=p(this,A)?p(this,A).headers:p(this,Z)??h(this,Z,new Headers);e===void 0?n.delete(t):r!=null&&r.append?n.append(t,e):n.set(t,e)});g(this,"status",t=>{h(this,ut,t)});g(this,"set",(t,e)=>{p(this,I)??h(this,I,new Map),p(this,I).set(t,e)});g(this,"get",t=>p(this,I)?p(this,I).get(t):void 0);g(this,"newResponse",(...t)=>v(this,U,ct).call(this,...t));g(this,"body",(t,e,r)=>v(this,U,ct).call(this,t,e,r));g(this,"text",(t,e,r)=>!p(this,Z)&&!p(this,ut)&&!e&&!r&&!this.finalized?new Response(t):v(this,U,ct).call(this,t,e,Yt(ar,r)));g(this,"json",(t,e,r)=>v(this,U,ct).call(this,JSON.stringify(t),e,Yt("application/json",r)));g(this,"html",(t,e,r)=>{const n=o=>v(this,U,ct).call(this,o,e,Yt("text/html; charset=UTF-8",r));return typeof t=="object"?Ae(t,ir.Stringify,!1,{}).then(n):n(t)});g(this,"redirect",(t,e)=>{const r=String(t);return this.header("Location",/[^\x00-\xFF]/.test(r)?encodeURI(r):r),this.newResponse(null,e??302)});g(this,"notFound",()=>(p(this,ht)??h(this,ht,()=>Ft()),p(this,ht).call(this,this)));h(this,_t,t),e&&(h(this,j,e.executionCtx),this.env=e.env,h(this,ht,e.notFoundHandler),h(this,St,e.path),h(this,At,e.matchResult))}get req(){return p(this,Ct)??h(this,Ct,new _e(p(this,_t),p(this,St),p(this,At))),p(this,Ct)}get event(){if(p(this,j)&&"respondWith"in p(this,j))return p(this,j);throw Error("This context has no FetchEvent")}get executionCtx(){if(p(this,j))return p(this,j);throw Error("This context has no ExecutionContext")}get res(){return p(this,A)||h(this,A,Ft(null,{headers:p(this,Z)??h(this,Z,new Headers)}))}set res(t){if(p(this,A)&&t){t=Ft(t.body,t);for(const[e,r]of p(this,A).headers.entries())if(e!=="content-type")if(e==="set-cookie"){const n=p(this,A).headers.getSetCookie();t.headers.delete("set-cookie");for(const o of n)t.headers.append("set-cookie",o)}else t.headers.set(e,r)}h(this,A,t),this.finalized=!0}get var(){return p(this,I)?Object.fromEntries(p(this,I)):{}}},_t=new WeakMap,Ct=new WeakMap,I=new WeakMap,ut=new WeakMap,j=new WeakMap,A=new WeakMap,Dt=new WeakMap,ft=new WeakMap,ht=new WeakMap,Z=new WeakMap,At=new WeakMap,St=new WeakMap,U=new WeakSet,ct=function(t,e,r){const n=p(this,A)?new Headers(p(this,A).headers):p(this,Z)??new Headers;if(typeof e=="object"&&"headers"in e){const i=e.headers instanceof Headers?e.headers:new Headers(e.headers);for(const[a,l]of i)a.toLowerCase()==="set-cookie"?n.append(a,l):n.set(a,l)}if(r)for(const[i,a]of Object.entries(r))if(typeof a=="string")n.set(i,a);else{n.delete(i);for(const l of a)n.append(i,l)}const o=typeof e=="number"?e:(e==null?void 0:e.status)??p(this,ut);return Ft(t,{status:o,headers:n})},me),E="ALL",lr="all",cr=["get","post","put","delete","options","patch"],Se="Can not add a route since the matcher is already built.",Oe=class extends Error{},pr="__COMPOSED_HANDLER",dr=t=>t.text("404 Not Found",404),ae=(t,e)=>{if("getResponse"in t){const r=t.getResponse();return e.newResponse(r.body,r)}return console.error(t),e.text("Internal Server Error",500)},B,k,Be,R,X,Tt,Lt,gt,ur=(gt=class{constructor(e={}){m(this,k);g(this,"get");g(this,"post");g(this,"put");g(this,"delete");g(this,"options");g(this,"patch");g(this,"all");g(this,"on");g(this,"use");g(this,"router");g(this,"getPath");g(this,"_basePath","/");m(this,B,"/");g(this,"routes",[]);m(this,R,dr);g(this,"errorHandler",ae);g(this,"onError",e=>(this.errorHandler=e,this));g(this,"notFound",e=>(h(this,R,e),this));g(this,"fetch",(e,...r)=>v(this,k,Lt).call(this,e,r[1],r[0],e.method));g(this,"request",(e,r,n,o)=>e instanceof Request?this.fetch(r?new Request(e,r):e,n,o):(e=e.toString(),this.fetch(new Request(/^https?:\/\//.test(e)?e:`http://localhost${lt("/",e)}`,r),n,o)));g(this,"fire",()=>{addEventListener("fetch",e=>{e.respondWith(v(this,k,Lt).call(this,e.request,e,void 0,e.request.method))})});[...cr,lr].forEach(i=>{this[i]=(a,...l)=>(typeof a=="string"?h(this,B,a):v(this,k,X).call(this,i,p(this,B),a),l.forEach(s=>{v(this,k,X).call(this,i,p(this,B),s)}),this)}),this.on=(i,a,...l)=>{for(const s of[a].flat()){h(this,B,s);for(const c of[i].flat())l.map(d=>{v(this,k,X).call(this,c.toUpperCase(),p(this,B),d)})}return this},this.use=(i,...a)=>(typeof i=="string"?h(this,B,i):(h(this,B,"*"),a.unshift(i)),a.forEach(l=>{v(this,k,X).call(this,E,p(this,B),l)}),this);const{strict:n,...o}=e;Object.assign(this,o),this.getPath=n??!0?e.getPath??$e:rr}route(e,r){const n=this.basePath(e);return r.routes.map(o=>{var a;let i;r.errorHandler===ae?i=o.handler:(i=async(l,s)=>(await oe([],r.errorHandler)(l,()=>o.handler(l,s))).res,i[pr]=o.handler),v(a=n,k,X).call(a,o.method,o.path,i)}),this}basePath(e){const r=v(this,k,Be).call(this);return r._basePath=lt(this._basePath,e),r}mount(e,r,n){let o,i;n&&(typeof n=="function"?i=n:(i=n.optionHandler,n.replaceRequest===!1?o=s=>s:o=n.replaceRequest));const a=i?s=>{const c=i(s);return Array.isArray(c)?c:[c]}:s=>{let c;try{c=s.executionCtx}catch{}return[s.env,c]};o||(o=(()=>{const s=lt(this._basePath,e),c=s==="/"?0:s.length;return d=>{const u=new URL(d.url);return u.pathname=u.pathname.slice(c)||"/",new Request(u,d)}})());const l=async(s,c)=>{const d=await r(o(s.req.raw),...a(s));if(d)return d;await c()};return v(this,k,X).call(this,E,lt(e,"*"),l),this}},B=new WeakMap,k=new WeakSet,Be=function(){const e=new gt({router:this.router,getPath:this.getPath});return e.errorHandler=this.errorHandler,h(e,R,p(this,R)),e.routes=this.routes,e},R=new WeakMap,X=function(e,r,n){e=e.toUpperCase(),r=lt(this._basePath,r);const o={basePath:this._basePath,path:r,method:e,handler:n};this.router.add(e,r,[n,o]),this.routes.push(o)},Tt=function(e,r){if(e instanceof Error)return this.errorHandler(e,r);throw e},Lt=function(e,r,n,o){if(o==="HEAD")return(async()=>new Response(null,await v(this,k,Lt).call(this,e,r,n,"GET")))();const i=this.getPath(e,{env:n}),a=this.router.match(o,i),l=new sr(e,{path:i,matchResult:a,env:n,executionCtx:r,notFoundHandler:p(this,R)});if(a[0].length===1){let c;try{c=a[0][0][0][0](l,async()=>{l.res=await p(this,R).call(this,l)})}catch(d){return v(this,k,Tt).call(this,d,l)}return c instanceof Promise?c.then(d=>d||(l.finalized?l.res:p(this,R).call(this,l))).catch(d=>v(this,k,Tt).call(this,d,l)):c??p(this,R).call(this,l)}const s=oe(a[0],this.errorHandler,p(this,R));return(async()=>{try{const c=await s(l);if(!c.finalized)throw new Error("Context is not finalized. Did you forget to return a Response object or `await next()`?");return c.res}catch(c){return v(this,k,Tt).call(this,c,l)}})()},gt),Re=[];function fr(t,e){const r=this.buildAllMatchers(),n=((o,i)=>{const a=r[o]||r[E],l=a[2][i];if(l)return l;const s=i.match(a[0]);if(!s)return[[],Re];const c=s.indexOf("",1);return[a[1][c],s]});return this.match=n,n(t,e)}var jt="[^/]+",Et=".*",kt="(?:|/.*)",pt=Symbol(),hr=new Set(".\\+*[^]$()");function gr(t,e){return t.length===1?e.length===1?t<e?-1:1:-1:e.length===1||t===Et||t===kt?1:e===Et||e===kt?-1:t===jt?1:e===jt?-1:t.length===e.length?t<e?-1:1:e.length-t.length}var Q,tt,T,nt,br=(nt=class{constructor(){m(this,Q);m(this,tt);m(this,T,Object.create(null))}insert(e,r,n,o,i){if(e.length===0){if(p(this,Q)!==void 0)throw pt;if(i)return;h(this,Q,r);return}const[a,...l]=e,s=a==="*"?l.length===0?["","",Et]:["","",jt]:a==="/*"?["","",kt]:a.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);let c;if(s){const d=s[1];let u=s[2]||jt;if(d&&s[2]&&(u===".*"||(u=u.replace(/^\((?!\?:)(?=[^)]+\)$)/,"(?:"),/\((?!\?:)/.test(u))))throw pt;if(c=p(this,T)[u],!c){if(Object.keys(p(this,T)).some(f=>f!==Et&&f!==kt))throw pt;if(i)return;c=p(this,T)[u]=new nt,d!==""&&h(c,tt,o.varIndex++)}!i&&d!==""&&n.push([d,p(c,tt)])}else if(c=p(this,T)[a],!c){if(Object.keys(p(this,T)).some(d=>d.length>1&&d!==Et&&d!==kt))throw pt;if(i)return;c=p(this,T)[a]=new nt}c.insert(l,r,n,o,i)}buildRegExpStr(){const r=Object.keys(p(this,T)).sort(gr).map(n=>{const o=p(this,T)[n];return(typeof p(o,tt)=="number"?`(${n})@${p(o,tt)}`:hr.has(n)?`\\${n}`:n)+o.buildRegExpStr()});return typeof p(this,Q)=="number"&&r.unshift(`#${p(this,Q)}`),r.length===0?"":r.length===1?r[0]:"(?:"+r.join("|")+")"}},Q=new WeakMap,tt=new WeakMap,T=new WeakMap,nt),zt,Ot,xe,mr=(xe=class{constructor(){m(this,zt,{varIndex:0});m(this,Ot,new br)}insert(t,e,r){const n=[],o=[];for(let a=0;;){let l=!1;if(t=t.replace(/\{[^}]+\}/g,s=>{const c=`@\\${a}`;return o[a]=[c,s],a++,l=!0,c}),!l)break}const i=t.match(/(?::[^\/]+)|(?:\/\*$)|./g)||[];for(let a=o.length-1;a>=0;a--){const[l]=o[a];for(let s=i.length-1;s>=0;s--)if(i[s].indexOf(l)!==-1){i[s]=i[s].replace(l,o[a][1]);break}}return p(this,Ot).insert(i,e,n,p(this,zt),r),n}buildRegExp(){let t=p(this,Ot).buildRegExpStr();if(t==="")return[/^$/,[],[]];let e=0;const r=[],n=[];return t=t.replace(/#(\d+)|@(\d+)|\.\*\$/g,(o,i,a)=>i!==void 0?(r[++e]=Number(i),"$()"):(a!==void 0&&(n[Number(a)]=++e),"")),[new RegExp(`^${t}`),r,n]}},zt=new WeakMap,Ot=new WeakMap,xe),xr=[/^$/,[],Object.create(null)],It=Object.create(null);function Te(t){return It[t]??(It[t]=new RegExp(t==="*"?"":`^${t.replace(/\/\*$|([.\\+*[^\]$()])/g,(e,r)=>r?`\\${r}`:"(?:|/.*)")}$`))}function yr(){It=Object.create(null)}function wr(t){var c;const e=new mr,r=[];if(t.length===0)return xr;const n=t.map(d=>[!/\*|\/:/.test(d[0]),...d]).sort(([d,u],[f,w])=>d?1:f?-1:u.length-w.length),o=Object.create(null);for(let d=0,u=-1,f=n.length;d<f;d++){const[w,b,x]=n[d];w?o[b]=[x.map(([_])=>[_,Object.create(null)]),Re]:u++;let $;try{$=e.insert(b,u,w)}catch(_){throw _===pt?new Oe(b):_}w||(r[u]=x.map(([_,F])=>{const O=Object.create(null);for(F-=1;F>=0;F--){const[J,Ut]=$[F];O[J]=Ut}return[_,O]}))}const[i,a,l]=e.buildRegExp();for(let d=0,u=r.length;d<u;d++)for(let f=0,w=r[d].length;f<w;f++){const b=(c=r[d][f])==null?void 0:c[1];if(!b)continue;const x=Object.keys(b);for(let $=0,_=x.length;$<_;$++)b[x[$]]=l[b[x[$]]]}const s=[];for(const d in a)s[d]=r[a[d]];return[i,s,o]}function st(t,e){if(t){for(const r of Object.keys(t).sort((n,o)=>o.length-n.length))if(Te(r).test(e))return[...t[r]]}}var G,q,Pt,Le,ye,vr=(ye=class{constructor(){m(this,Pt);g(this,"name","RegExpRouter");m(this,G);m(this,q);g(this,"match",fr);h(this,G,{[E]:Object.create(null)}),h(this,q,{[E]:Object.create(null)})}add(t,e,r){var l;const n=p(this,G),o=p(this,q);if(!n||!o)throw new Error(Se);n[t]||[n,o].forEach(s=>{s[t]=Object.create(null),Object.keys(s[E]).forEach(c=>{s[t][c]=[...s[E][c]]})}),e==="/*"&&(e="*");const i=(e.match(/\/:/g)||[]).length;if(/\*$/.test(e)){const s=Te(e);t===E?Object.keys(n).forEach(c=>{var d;(d=n[c])[e]||(d[e]=st(n[c],e)||st(n[E],e)||[])}):(l=n[t])[e]||(l[e]=st(n[t],e)||st(n[E],e)||[]),Object.keys(n).forEach(c=>{(t===E||t===c)&&Object.keys(n[c]).forEach(d=>{s.test(d)&&n[c][d].push([r,i])})}),Object.keys(o).forEach(c=>{(t===E||t===c)&&Object.keys(o[c]).forEach(d=>s.test(d)&&o[c][d].push([r,i]))});return}const a=Ee(e)||[e];for(let s=0,c=a.length;s<c;s++){const d=a[s];Object.keys(o).forEach(u=>{var f;(t===E||t===u)&&((f=o[u])[d]||(f[d]=[...st(n[u],d)||st(n[E],d)||[]]),o[u][d].push([r,i-c+s+1]))})}}buildAllMatchers(){const t=Object.create(null);return Object.keys(p(this,q)).concat(Object.keys(p(this,G))).forEach(e=>{t[e]||(t[e]=v(this,Pt,Le).call(this,e))}),h(this,G,h(this,q,void 0)),yr(),t}},G=new WeakMap,q=new WeakMap,Pt=new WeakSet,Le=function(t){const e=[];let r=t===E;return[p(this,G),p(this,q)].forEach(n=>{const o=n[t]?Object.keys(n[t]).map(i=>[i,n[t][i]]):[];o.length!==0?(r||(r=!0),e.push(...o)):t!==E&&e.push(...Object.keys(n[E]).map(i=>[i,n[E][i]]))}),r?wr(e):null},ye),W,z,we,Fr=(we=class{constructor(t){g(this,"name","SmartRouter");m(this,W,[]);m(this,z,[]);h(this,W,t.routers)}add(t,e,r){if(!p(this,z))throw new Error(Se);p(this,z).push([t,e,r])}match(t,e){if(!p(this,z))throw new Error("Fatal error");const r=p(this,W),n=p(this,z),o=r.length;let i=0,a;for(;i<o;i++){const l=r[i];try{for(let s=0,c=n.length;s<c;s++)l.add(...n[s]);a=l.match(t,e)}catch(s){if(s instanceof Oe)continue;throw s}this.match=l.match.bind(l),h(this,W,[l]),h(this,z,void 0);break}if(i===o)throw new Error("Fatal error");return this.name=`SmartRouter + ${this.activeRouter.name}`,a}get activeRouter(){if(p(this,z)||p(this,W).length!==1)throw new Error("No active router has been determined yet.");return p(this,W)[0]}},W=new WeakMap,z=new WeakMap,we),$t=Object.create(null),$r=t=>{for(const e in t)return!0;return!1},Y,D,et,bt,C,P,K,mt,Er=(mt=class{constructor(e,r,n){m(this,P);m(this,Y);m(this,D);m(this,et);m(this,bt,0);m(this,C,$t);if(h(this,D,n||Object.create(null)),h(this,Y,[]),e&&r){const o=Object.create(null);o[e]={handler:r,possibleKeys:[],score:0},h(this,Y,[o])}h(this,et,[])}insert(e,r,n){h(this,bt,++ne(this,bt)._);let o=this;const i=Ke(r),a=[];for(let l=0,s=i.length;l<s;l++){const c=i[l],d=i[l+1],u=tr(c,d),f=Array.isArray(u)?u[0]:c;if(f in p(o,D)){o=p(o,D)[f],u&&a.push(u[1]);continue}p(o,D)[f]=new mt,u&&(p(o,et).push(u),a.push(u[1])),o=p(o,D)[f]}return p(o,Y).push({[e]:{handler:n,possibleKeys:a.filter((l,s,c)=>c.indexOf(l)===s),score:p(this,bt)}}),o}search(e,r){var d;const n=[];h(this,C,$t);let i=[this];const a=Fe(r),l=[],s=a.length;let c=null;for(let u=0;u<s;u++){const f=a[u],w=u===s-1,b=[];for(let $=0,_=i.length;$<_;$++){const F=i[$],O=p(F,D)[f];O&&(h(O,C,p(F,C)),w?(p(O,D)["*"]&&v(this,P,K).call(this,n,p(O,D)["*"],e,p(F,C)),v(this,P,K).call(this,n,O,e,p(F,C))):b.push(O));for(let J=0,Ut=p(F,et).length;J<Ut;J++){const te=p(F,et)[J],H=p(F,C)===$t?{}:{...p(F,C)};if(te==="*"){const it=p(F,D)["*"];it&&(v(this,P,K).call(this,n,it,e,p(F,C)),h(it,C,H),b.push(it));continue}const[Ne,ee,wt]=te;if(!f&&!(wt instanceof RegExp))continue;const L=p(F,D)[Ne];if(wt instanceof RegExp){if(c===null){c=new Array(s);let at=r[0]==="/"?1:0;for(let vt=0;vt<s;vt++)c[vt]=at,at+=a[vt].length+1}const it=r.substring(c[u]),Gt=wt.exec(it);if(Gt){if(H[ee]=Gt[0],v(this,P,K).call(this,n,L,e,p(F,C),H),$r(p(L,D))){h(L,C,H);const at=((d=Gt[0].match(/\//))==null?void 0:d.length)??0;(l[at]||(l[at]=[])).push(L)}continue}}(wt===!0||wt.test(f))&&(H[ee]=f,w?(v(this,P,K).call(this,n,L,e,H,p(F,C)),p(L,D)["*"]&&v(this,P,K).call(this,n,p(L,D)["*"],e,H,p(F,C))):(h(L,C,H),b.push(L)))}}const x=l.shift();i=x?b.concat(x):b}return n.length>1&&n.sort((u,f)=>u.score-f.score),[n.map(({handler:u,params:f})=>[u,f])]}},Y=new WeakMap,D=new WeakMap,et=new WeakMap,bt=new WeakMap,C=new WeakMap,P=new WeakSet,K=function(e,r,n,o,i){for(let a=0,l=p(r,Y).length;a<l;a++){const s=p(r,Y)[a],c=s[n]||s[E],d={};if(c!==void 0&&(c.params=Object.create(null),e.push(c),o!==$t||i&&i!==$t))for(let u=0,f=c.possibleKeys.length;u<f;u++){const w=c.possibleKeys[u],b=d[c.score];c.params[w]=i!=null&&i[w]&&!b?i[w]:o[w]??(i==null?void 0:i[w]),d[c.score]=!0}}},mt),rt,ve,kr=(ve=class{constructor(){g(this,"name","TrieRouter");m(this,rt);h(this,rt,new Er)}add(t,e,r){const n=Ee(e);if(n){for(let o=0,i=n.length;o<i;o++)p(this,rt).insert(t,n[o],r);return}p(this,rt).insert(t,e,r)}match(t,e){return p(this,rt).search(t,e)}},rt=new WeakMap,ve),Ie=class extends ur{constructor(t={}){super(t),this.router=t.router??new Fr({routers:[new vr,new kr]})}},_r=t=>{const r={...{origin:"*",allowMethods:["GET","HEAD","PUT","POST","DELETE","PATCH"],allowHeaders:[],exposeHeaders:[]},...t},n=(i=>typeof i=="string"?i==="*"?r.credentials?a=>a||null:()=>i:a=>i===a?a:null:typeof i=="function"?i:a=>i.includes(a)?a:null)(r.origin),o=(i=>typeof i=="function"?i:Array.isArray(i)?()=>i:()=>[])(r.allowMethods);return async function(a,l){var d;function s(u,f){a.res.headers.set(u,f)}const c=await n(a.req.header("origin")||"",a);if(c&&s("Access-Control-Allow-Origin",c),r.credentials&&s("Access-Control-Allow-Credentials","true"),(d=r.exposeHeaders)!=null&&d.length&&s("Access-Control-Expose-Headers",r.exposeHeaders.join(",")),a.req.method==="OPTIONS"){(r.origin!=="*"||r.credentials)&&s("Vary","Origin"),r.maxAge!=null&&s("Access-Control-Max-Age",r.maxAge.toString());const u=await o(a.req.header("origin")||"",a);u.length&&s("Access-Control-Allow-Methods",u.join(","));let f=r.allowHeaders;if(!(f!=null&&f.length)){const w=a.req.header("Access-Control-Request-Headers");w&&(f=w.split(/\s*,\s*/))}return f!=null&&f.length&&(s("Access-Control-Allow-Headers",f.join(",")),a.res.headers.append("Vary","Access-Control-Request-Headers")),a.res.headers.delete("Content-Length"),a.res.headers.delete("Content-Type"),new Response(null,{headers:a.res.headers,status:204,statusText:"No Content"})}await l(),(r.origin!=="*"||r.credentials)&&a.header("Vary","Origin",{append:!0})}},Cr={crossOriginEmbedderPolicy:["Cross-Origin-Embedder-Policy","require-corp"],crossOriginResourcePolicy:["Cross-Origin-Resource-Policy","same-origin"],crossOriginOpenerPolicy:["Cross-Origin-Opener-Policy","same-origin"],originAgentCluster:["Origin-Agent-Cluster","?1"],referrerPolicy:["Referrer-Policy","no-referrer"],strictTransportSecurity:["Strict-Transport-Security","max-age=15552000; includeSubDomains"],xContentTypeOptions:["X-Content-Type-Options","nosniff"],xDnsPrefetchControl:["X-DNS-Prefetch-Control","off"],xDownloadOptions:["X-Download-Options","noopen"],xFrameOptions:["X-Frame-Options","SAMEORIGIN"],xPermittedCrossDomainPolicies:["X-Permitted-Cross-Domain-Policies","none"],xXssProtection:["X-XSS-Protection","0"]},Dr={crossOriginEmbedderPolicy:!1,crossOriginResourcePolicy:!0,crossOriginOpenerPolicy:!0,originAgentCluster:!0,referrerPolicy:!0,strictTransportSecurity:!0,xContentTypeOptions:!0,xDnsPrefetchControl:!0,xDownloadOptions:!0,xFrameOptions:!0,xPermittedCrossDomainPolicies:!0,xXssProtection:!0,removePoweredBy:!0,permissionsPolicy:{}},Ar=t=>{const e={...Dr,...t},r=Sr(e),n=[];if(e.contentSecurityPolicy){const[o,i]=se(e.contentSecurityPolicy);o&&n.push(o),r.push(["Content-Security-Policy",i])}if(e.contentSecurityPolicyReportOnly){const[o,i]=se(e.contentSecurityPolicyReportOnly);o&&n.push(o),r.push(["Content-Security-Policy-Report-Only",i])}return e.permissionsPolicy&&Object.keys(e.permissionsPolicy).length>0&&r.push(["Permissions-Policy",Or(e.permissionsPolicy)]),e.reportingEndpoints&&r.push(["Reporting-Endpoints",Rr(e.reportingEndpoints)]),e.reportTo&&r.push(["Report-To",Tr(e.reportTo)]),async function(i,a){const l=n.length===0?r:n.reduce((s,c)=>c(i,s),r);await a(),Lr(i,l),e!=null&&e.removePoweredBy&&i.res.headers.delete("X-Powered-By")}};function Sr(t){return Object.entries(Cr).filter(([e])=>t[e]).map(([e,r])=>{const n=t[e];return typeof n=="string"?[r[0],n]:r})}function se(t){const e=[],r=[];for(const[n,o]of Object.entries(t)){const i=Array.isArray(o)?o:[o];i.forEach((a,l)=>{if(typeof a=="function"){const s=l*2+2+r.length;e.push((c,d)=>{d[s]=a(c,n)})}}),r.push(n.replace(/[A-Z]+(?![a-z])|[A-Z]/g,(a,l)=>l?"-"+a.toLowerCase():a.toLowerCase()),...i.flatMap(a=>[" ",a]),"; ")}return r.pop(),e.length===0?[void 0,r.join("")]:[(n,o)=>o.map(i=>{if(i[0]==="Content-Security-Policy"||i[0]==="Content-Security-Policy-Report-Only"){const a=i[1].slice();return e.forEach(l=>{l(n,a)}),[i[0],a.join("")]}else return i}),r]}function Or(t){return Object.entries(t).map(([e,r])=>{const n=Br(e);if(typeof r=="boolean")return`${n}=${r?"*":"none"}`;if(Array.isArray(r)){if(r.length===0)return`${n}=()`;if(r.length===1&&(r[0]==="*"||r[0]==="none"))return`${n}=${r[0]}`;const o=r.map(i=>["self","src"].includes(i)?i:`"${i}"`);return`${n}=(${o.join(" ")})`}return""}).filter(Boolean).join(", ")}function Br(t){return t.replace(/([a-z\d])([A-Z])/g,"$1-$2").toLowerCase()}function Rr(t=[]){return t.map(e=>`${e.name}="${e.url}"`).join(", ")}function Tr(t=[]){return t.map(e=>JSON.stringify(e)).join(", ")}function Lr(t,e){e.forEach(([r,n])=>{t.res.headers.set(r,n)})}function Ir(){const{process:t,Deno:e}=globalThis;return!(typeof(e==null?void 0:e.noColor)=="boolean"?e.noColor:t!==void 0?"NO_COLOR"in(t==null?void 0:t.env):!1)}async function jr(){const{navigator:t}=globalThis,e="cloudflare:workers";return!(t!==void 0&&t.userAgent==="Cloudflare-Workers"?await(async()=>{try{return"NO_COLOR"in((await import(e)).env??{})}catch{return!1}})():!Ir())}var zr=t=>{const[e,r]=[",","."];return t.map(o=>o.replace(/(\d)(?=(\d\d\d)+(?!\d))/g,"$1"+e)).join(r)},Pr=t=>{const e=Date.now()-t;return zr([e<1e3?e+"ms":Math.round(e/1e3)+"s"])},Mr=async t=>{if(await jr())switch(t/100|0){case 5:return`\x1B[31m${t}\x1B[0m`;case 4:return`\x1B[33m${t}\x1B[0m`;case 3:return`\x1B[36m${t}\x1B[0m`;case 2:return`\x1B[32m${t}\x1B[0m`}return`${t}`};async function le(t,e,r,n,o=0,i){const a=e==="<--"?`${e} ${r} ${n}`:`${e} ${r} ${n} ${await Mr(o)} ${i}`;t(a)}var Hr=(t=console.log)=>async function(r,n){const{method:o,url:i}=r.req,a=i.slice(i.indexOf("/",8));await le(t,"<--",o,a);const l=Date.now();await n(),await le(t,"-->",o,a,r.res.status,Pr(l))},je=/^[\w!#$%&'*.^`|~+-]+$/,Nr=/^[ !#-:<-[\]-~]*$/,ce=t=>{let e=0,r=t.length;for(;e<r;){const n=t.charCodeAt(e);if(n!==32&&n!==9)break;e++}for(;r>e;){const n=t.charCodeAt(r-1);if(n!==32&&n!==9)break;r--}return e===0&&r===t.length?t:t.slice(e,r)},Ur=(t,e)=>{if(t.indexOf(e)===-1)return{};const r=t.split(";"),n={};for(const o of r){const i=o.indexOf("=");if(i===-1)continue;const a=ce(o.substring(0,i));if(e!==a||!je.test(a))continue;let l=ce(o.substring(i+1));if(l.startsWith('"')&&l.endsWith('"')&&(l=l.slice(1,-1)),Nr.test(l)){n[a]=l.indexOf("%")!==-1?Mt(l,Xt):l;break}}return n},Gr=(t,e,r={})=>{if(!je.test(t))throw new Error("Invalid cookie name");let n=`${t}=${e}`;if(t.startsWith("__Secure-")&&!r.secure)throw new Error("__Secure- Cookie must have Secure attributes");if(t.startsWith("__Host-")){if(!r.secure)throw new Error("__Host- Cookie must have Secure attributes");if(r.path!=="/")throw new Error('__Host- Cookie must have Path attributes with "/"');if(r.domain)throw new Error("__Host- Cookie must not have Domain attributes")}for(const o of["domain","path"])if(r[o]&&/[;\r\n]/.test(r[o]))throw new Error(`${o} must not contain ";", "\\r", or "\\n"`);if(r&&typeof r.maxAge=="number"&&r.maxAge>=0){if(r.maxAge>3456e4)throw new Error("Cookies Max-Age SHOULD NOT be greater than 400 days (34560000 seconds) in duration.");n+=`; Max-Age=${r.maxAge|0}`}if(r.domain&&r.prefix!=="host"&&(n+=`; Domain=${r.domain}`),r.path&&(n+=`; Path=${r.path}`),r.expires){if(r.expires.getTime()-Date.now()>3456e7)throw new Error("Cookies Expires SHOULD NOT be greater than 400 days (34560000 seconds) in the future.");n+=`; Expires=${r.expires.toUTCString()}`}if(r.httpOnly&&(n+="; HttpOnly"),r.secure&&(n+="; Secure"),r.sameSite&&(n+=`; SameSite=${r.sameSite.charAt(0).toUpperCase()+r.sameSite.slice(1)}`),r.priority&&(n+=`; Priority=${r.priority.charAt(0).toUpperCase()+r.priority.slice(1)}`),r.partitioned){if(!r.secure)throw new Error("Partitioned Cookie must have Secure attributes");n+="; Partitioned"}return n},Jt=(t,e,r)=>(e=encodeURIComponent(e),Gr(t,e,r)),Kt=(t,e,r)=>{const n=t.req.raw.headers.get("Cookie");{if(!n)return;let o=e;return Ur(n,o)[o]}},qr=(t,e,r)=>{let n;return(r==null?void 0:r.prefix)==="secure"?n=Jt("__Secure-"+t,e,{path:"/",...r,secure:!0}):(r==null?void 0:r.prefix)==="host"?n=Jt("__Host-"+t,e,{...r,path:"/",secure:!0,domain:void 0}):n=Jt(t,e,{path:"/",...r}),n},Wr=(t,e,r,n)=>{const o=qr(e,r,n);t.header("Set-Cookie",o,{append:!0})};const Yr={joy:["嬉しい","うれしい","楽しい","たのしい","幸せ","しあわせ","喜び","よろこび","最高","さいこう","ハッピー","happy","笑","わら","ニコニコ","にこにこ","すごい","すげー","やったー","やった","わくわく","ワクワク","ウキウキ","うきうき","ご機嫌","満足","まんぞく","ラッキー","ありがとう","感謝","かんしゃ","大好き","だいすき","成功","せいこう","勝った","クリア","達成","たっせい","面白い","おもしろい","最高","かわいい","可愛い","綺麗","きれい","美味しい","おいしい"],sadness:["悲しい","かなしい","つらい","辛い","寂しい","さびしい","涙","なみだ","泣","な","切ない","sad","落ち込","おちこ","憂鬱","ゆううつ","虚しい","むなしい","孤独","こどく","失った","失敗","しっぱい","後悔","こうかい","残念","ざんねん","がっかり","ガッカリ","凹","へこ","疲れ","つかれ","しんどい","きつい","嫌","いや","だめ","ダメ","終わった","むり","無理","病んで"],anger:["怒","おこ","イライラ","いらいら","ムカつく","むかつく","腹立","はらだ","うざい","ウザい","angry","キレ","きれ","許せない","ゆるせない","最悪","さいあく","クソ","くそ","ふざけ","ぶちぎれ","ブチギレ","激怒","げきど","憎","にく","頭にきた","ありえない","クズ","ばか","バカ","うるさい"],fear:["怖い","こわい","不安","ふあん","心配","しんぱい","緊張","きんちょう","ドキドキ","どきどき","fear","scared","ビビ","びび","恐怖","きょうふ","焦","あせ","逃げ","にげ","震え","ふるえ","やばい","ヤバい","危ない","あぶない","嫌だ","どうしよう","どうしたら","失敗したら"],love:["好き","すき","大好き","だいすき","愛","あい","恋","こい","love","ラブ","ハート","胸キュン","ときめき","トキメキ","片想い","片思い","両思い","付き合","つきあ","彼氏","彼女","カップル","デート","プロポーズ","結婚","けっこん","大切","たいせつ","宝物","たからもの","一生","永遠"],surprise:["びっくり","ビックリ","驚","おどろ","まじ","マジ","え！","えっ","うそ","ウソ","嘘","まさか","ありえ","信じられ","しんじられ","surprise","wow","すごっ","ぎゃー","ギャー","どっひゃ","衝撃","しょうげき","予想外","よそうがい","ハッとした","ハッと"],calm:["落ち着","おちつ","穏やか","おだやか","静か","しずか","安心","あんしん","ゆったり","のんびり","まったり","癒","いや","リラックス","calm","peaceful","心地よい","ここちよい","幸福","こうふく","平和","へいわ","普通","ふつう","まあまあ","大丈夫","だいじょうぶ","okay","OK","いい感じ"]},Jr=["とても","すごく","超","めちゃ","めっちゃ","ものすごく","本当に","ほんとに","まじで","マジで","激","very","really","so","!","！"],Vr=["ない","じゃない","ではない","じゃなかった","not","no"];function Xr(t){const e=t.toLowerCase(),r={joy:0,sadness:0,anger:0,fear:0,love:0,surprise:0,calm:0};for(const[b,x]of Object.entries(Yr))for(const $ of x){let _=0,F=0;for(;(_=e.indexOf($,_))!==-1;)F++,_+=$.length;r[b]+=F}let n=.3;for(const b of Jr){const x=(e.match(new RegExp(b.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"g"))||[]).length;n+=x*.15}n=Math.min(1,n);const o=(t.match(/[!！]/g)||[]).length;n=Math.min(1,n+o*.1),Vr.reduce((b,x)=>b+(e.match(new RegExp(x,"g"))||[]).length,0)>0&&r.joy>0&&(r.sadness+=r.joy*.3,r.joy*=.5);let a="calm",l=0;for(const[b,x]of Object.entries(r))x>l&&(l=x,a=b);const s=t.length,c=Math.min(1,s/50);l===0&&(a="calm",n=.4);const d=Object.values(r).sort((b,x)=>x-b),u=d[0]-(d[1]||0),f=d.reduce((b,x)=>b+x,0),w=f>0?Math.min(1,.5+u/f*.5)*c+.2:.4;return{emotion:a,score:Math.min(1,w),scores:r,intensity:n}}const Kr={joy:{primary:["#FFD93D","#FFB84D","#FFA07A","#FFE066","#FFC857"],secondary:["#FF6B6B","#FF9F1C","#F4D35E","#FFEDB5"]},sadness:{primary:["#6B9DC2","#5B8DC4","#4A6FA5","#7BA7BC","#8DAFCC"],secondary:["#A8DADC","#B8E0D2","#9FC5E8","#CDD7D6"]},anger:{primary:["#E63946","#D62828","#FF4D4D","#C9302C","#E53E3E"],secondary:["#F77F00","#FCA311","#FF6B35","#FF8C42"]},fear:{primary:["#6A4C93","#7B2CBF","#5A189A","#9D4EDD","#7251B5"],secondary:["#3A0CA3","#480CA8","#560BAD","#B5179E"]},love:{primary:["#FF6B9D","#FF8FAB","#FFB3C6","#FFC2D1","#FF80AB"],secondary:["#FFCAD4","#F4ACB7","#E8909C","#F8AFA6"]},surprise:{primary:["#06D6A0","#1B9AAA","#00BBF9","#00F5D4","#3DDC97"],secondary:["#F15BB5","#FEE440","#9B5DE5","#00BBF9"]},calm:{primary:["#A8DADC","#B5EAEA","#CDFAD5","#E8F3F1","#C7F0DB"],secondary:["#F8F9FA","#E9ECEF","#DEE2E6","#F1F3F4"]}},pe=["nebula","marble","glow","sparkle","ripple"];function Zr(t){let e=2166136261;for(let r=0;r<t.length;r++)e^=t.charCodeAt(r),e=Math.imul(e,16777619);return Math.abs(e)}function Qr(t,e){const r=Zr(t+Date.now()),n=Kr[e.emotion],o=n.primary[r%n.primary.length],i=n.secondary[(r>>4)%n.secondary.length];let a;e.intensity>.85?a="sparkle":e.intensity>.65?a="nebula":e.intensity>.45?a="glow":e.intensity>.25?a="marble":a="ripple",r%17===0&&(a=pe[r%pe.length]);const l=Math.floor(60+e.intensity*30+r%10),s=r%1e3/1e3;let c;return s<.005?c="legendary":s<.05?c="epic":s<.2?c="rare":c="common",{color:o,color2:i,pattern:a,size:l,rarity:c}}const Bt={joy:"よろこび",sadness:"かなしみ",anger:"いかり",fear:"ふあん",love:"あい",surprise:"おどろき",calm:"やすらぎ"},ot={joy:"✨",sadness:"💧",anger:"🔥",fear:"🌀",love:"💖",surprise:"⭐",calm:"🌿"};function Ht(t=""){const e=Date.now().toString(36),r=Math.random().toString(36).slice(2,10);return t?`${t}_${e}${r}`:`${e}${r}`}function tn(){const t="abcdefghijklmnopqrstuvwxyz0123456789";let e="";for(let r=0;r<8;r++)e+=t[Math.floor(Math.random()*t.length)];return e}async function Zt(t){const e=new TextEncoder().encode(t),r=await crypto.subtle.digest("SHA-256",e);return Array.from(new Uint8Array(r)).map(n=>n.toString(16).padStart(2,"0")).join("")}function de(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function ue(t,e=2e3){return t.replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g,"").slice(0,e).trim()}function fe(t,e=1,r=2e3){if(!t||typeof t!="string")return{ok:!1,error:"テキストが入力されていません"};const n=t.trim();return n.length<e?{ok:!1,error:`${e}文字以上入力してください`}:n.length>r?{ok:!1,error:`${r}文字以内で入力してください`}:{ok:!0}}function Qt(t){var e;return t.headers.get("cf-connecting-ip")||((e=t.headers.get("x-forwarded-for"))==null?void 0:e.split(",")[0])||"unknown"}async function ze(t,e,r,n){const o=Math.floor(Date.now()/1e3),i=o+n,a=await t.prepare("SELECT count, reset_at FROM rate_limits WHERE key = ?").bind(e).first();return!a||a.reset_at<o?(await t.prepare("INSERT INTO rate_limits (key, count, reset_at) VALUES (?, 1, ?) ON CONFLICT(key) DO UPDATE SET count=1, reset_at=?").bind(e,i,i).run(),{ok:!0,remaining:r-1,resetAt:i}):a.count>=r?{ok:!1,remaining:0,resetAt:a.reset_at}:(await t.prepare("UPDATE rate_limits SET count = count + 1 WHERE key = ?").bind(e).run(),{ok:!0,remaining:r-a.count-1,resetAt:a.reset_at})}function en(t,e="ja-JP"){return new Date(t).toLocaleDateString(e,{year:"numeric",month:"long",day:"numeric"})}function Pe(t){const e=t.size??200,r=Math.random().toString(36).slice(2,8),n=e/2,o=e/2,i=e*.42,a={common:"0",rare:"6",epic:"12",legendary:"20"}[t.rarity??"common"];let l="",s="";switch(t.pattern){case"nebula":l=`
        <radialGradient id="g${r}" cx="35%" cy="30%">
          <stop offset="0%" stop-color="${t.color2}" stop-opacity="1"/>
          <stop offset="50%" stop-color="${t.color}" stop-opacity="1"/>
          <stop offset="100%" stop-color="${t.color}" stop-opacity="0.7"/>
        </radialGradient>
        <filter id="blur${r}"><feGaussianBlur stdDeviation="2"/></filter>`,s=`url(#g${r})`;break;case"marble":l=`
        <linearGradient id="g${r}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${t.color}"/>
          <stop offset="50%" stop-color="${t.color2}"/>
          <stop offset="100%" stop-color="${t.color}"/>
        </linearGradient>`,s=`url(#g${r})`;break;case"glow":l=`
        <radialGradient id="g${r}" cx="50%" cy="50%">
          <stop offset="0%" stop-color="${t.color2}" stop-opacity="0.9"/>
          <stop offset="60%" stop-color="${t.color}" stop-opacity="1"/>
          <stop offset="100%" stop-color="${t.color}" stop-opacity="0.6"/>
        </radialGradient>`,s=`url(#g${r})`;break;case"sparkle":l=`
        <radialGradient id="g${r}" cx="40%" cy="35%">
          <stop offset="0%" stop-color="white" stop-opacity="0.95"/>
          <stop offset="20%" stop-color="${t.color2}"/>
          <stop offset="100%" stop-color="${t.color}"/>
        </radialGradient>`,s=`url(#g${r})`;break;case"ripple":l=`
        <radialGradient id="g${r}" cx="50%" cy="50%">
          <stop offset="0%" stop-color="${t.color}"/>
          <stop offset="40%" stop-color="${t.color2}" stop-opacity="0.7"/>
          <stop offset="80%" stop-color="${t.color}"/>
          <stop offset="100%" stop-color="${t.color2}" stop-opacity="0.6"/>
        </radialGradient>`,s=`url(#g${r})`;break;default:s=t.color}const c=i*.35,d=n-i*.3,u=o-i*.35;let f="";if(t.pattern==="sparkle"||t.rarity==="legendary")for(let x=0;x<8;x++){const $=Math.PI*2*x/8,_=i*(.7+Math.random()*.4),F=n+Math.cos($)*_,O=o+Math.sin($)*_,J=2+Math.random()*3;f+=`<circle cx="${F}" cy="${O}" r="${J}" fill="white" opacity="${.6+Math.random()*.4}"/>`}const w=t.animated!==!1?`
    <animateTransform attributeName="transform" attributeType="XML" type="scale"
      values="1,1; 1.04,0.96; 0.97,1.03; 1,1" dur="3s" repeatCount="indefinite"
      additive="sum"/>`:"";let b="";return t.rarity==="legendary"?b=`
      <circle cx="${n}" cy="${o}" r="${i*1.15}" fill="none" stroke="gold" stroke-width="1.5" opacity="0.8">
        ${t.animated!==!1?`<animate attributeName="r" values="${i*1.15};${i*1.25};${i*1.15}" dur="2s" repeatCount="indefinite"/>`:""}
      </circle>`:t.rarity==="epic"&&(b=`<circle cx="${n}" cy="${o}" r="${i*1.1}" fill="none" stroke="${t.color2}" stroke-width="1" opacity="0.6"/>`),`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${e} ${e}" width="${e}" height="${e}">
    <defs>
      ${l}
      <filter id="shadow${r}" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="${a}"/>
        <feOffset dx="0" dy="2"/>
        <feFlood flood-color="${t.color2}" flood-opacity="0.7"/>
        <feComposite in2="SourceAlpha" operator="in"/>
        <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    ${b}
    <g filter="url(#shadow${r})" transform-origin="${n} ${o}">
      ${w?`<g>${w}`:""}
      <circle cx="${n}" cy="${o}" r="${i}" fill="${s}"/>
      <ellipse cx="${d}" cy="${u}" rx="${c}" ry="${c*.6}" fill="white" opacity="0.55"/>
      <ellipse cx="${d+3}" cy="${u+3}" rx="${c*.5}" ry="${c*.3}" fill="white" opacity="0.35"/>
      ${f}
      ${w?"</g>":""}
    </g>
  </svg>`}function rn(t){const{title:e,emotion:r,color:n,color2:o,pattern:i,rarity:a,date:l}=t,c=Pe({color:n,color2:o,pattern:i,size:360,rarity:a,animated:!1}).replace(/^<svg[^>]*>/,"").replace(/<\/svg>$/,""),d=de(e.length>30?e.slice(0,28)+"…":e),u=ot[r],f=Bt[r],w={common:"コモン",rare:"レア",epic:"エピック",legendary:"レジェンダリー"}[a]||"",b=de(l||"");return`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#FFE5F1"/>
        <stop offset="50%" stop-color="#E5F1FF"/>
        <stop offset="100%" stop-color="#F1E5FF"/>
      </linearGradient>
      <filter id="soft"><feGaussianBlur stdDeviation="40"/></filter>
    </defs>
    <rect width="1200" height="630" fill="url(#bg)"/>
    <circle cx="200" cy="100" r="180" fill="${n}" opacity="0.15" filter="url(#soft)"/>
    <circle cx="1050" cy="500" r="220" fill="${o}" opacity="0.18" filter="url(#soft)"/>
    
    <g transform="translate(120, 135)">
      ${c}
    </g>
    
    <g transform="translate(540, 180)">
      <text x="0" y="0" font-family="'Hiragino Sans','Yu Gothic',sans-serif" font-size="32" fill="#8B7AB8" font-weight="600">PuniMemory ぷにメモリー</text>
      <text x="0" y="80" font-family="'Hiragino Sans','Yu Gothic',sans-serif" font-size="56" fill="#3D2B5C" font-weight="800">${d}</text>
      <g transform="translate(0, 130)">
        <rect x="0" y="0" rx="28" ry="28" width="200" height="56" fill="${n}" opacity="0.85"/>
        <text x="100" y="38" text-anchor="middle" font-family="'Hiragino Sans',sans-serif" font-size="26" fill="white" font-weight="700">${u} ${f}</text>
        <rect x="220" y="0" rx="28" ry="28" width="220" height="56" fill="white" stroke="${o}" stroke-width="3"/>
        <text x="330" y="38" text-anchor="middle" font-family="'Hiragino Sans',sans-serif" font-size="24" fill="${o}" font-weight="700">${w}</text>
      </g>
      <text x="0" y="260" font-family="'Hiragino Sans',sans-serif" font-size="26" fill="#6B5B95">${b}</text>
      <text x="0" y="310" font-family="'Hiragino Sans',sans-serif" font-size="22" fill="#8B7AB8">あなたのオーブをコレクションしよう</text>
    </g>
  </svg>`}function Nt(t={}){const e=t.error?`
    <div id="error-banner" class="puni-error-banner">
      ${nn(t.error)}
    </div>`:"";return`<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"/>
<meta name="theme-color" content="#FFD6E8"/>
<title>ぷにメモリー - あなたの"今"をAIが永久保存するぷにぷに思い出カプセル</title>
<meta name="description" content="日々の気持ちをAIが解析して、世界に一つだけのぷにぷにオーブを生成。タイムカプセルとして未来の自分にメッセージも送れる、新感覚の感情記録サービス。"/>
<meta name="keywords" content="ぷにメモリー,日記,タイムカプセル,感情記録,AI,オーブ,コレクション"/>
<meta property="og:title" content="ぷにメモリー｜あなたの今をぷにぷにオーブに変える"/>
<meta property="og:description" content="日々の気持ちがAIでぷにぷにオーブに。コレクションして、過去の自分と再会しよう。"/>
<meta property="og:type" content="website"/>
<meta property="og:image" content="/og.svg"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="ぷにメモリー｜あなたの今をぷにぷにオーブに変える"/>
<meta name="twitter:description" content="日々の気持ちがAIでぷにぷにオーブに。コレクションして、過去の自分と再会しよう。"/>
<meta name="twitter:image" content="/og.svg"/>
<link rel="icon" href="/favicon.ico"/>
<link rel="apple-touch-icon" href="/favicon.ico"/>
<link rel="manifest" href="/manifest.json"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@500;700;900&family=M+PLUS+Rounded+1c:wght@500;700;900&display=swap" rel="stylesheet"/>
<link rel="manifest" href="/manifest.json"/>
<style>${on()}</style>
</head>
<body>
${e}

<div class="puni-bg">
  <div class="puni-blob puni-blob-1"></div>
  <div class="puni-blob puni-blob-2"></div>
  <div class="puni-blob puni-blob-3"></div>
</div>

<header class="puni-header">
  <div class="puni-header-inner">
    <a href="/" class="puni-logo">
      <span class="puni-logo-orb"></span>
      <span class="puni-logo-text">ぷにメモリー</span>
    </a>
    <nav class="puni-nav">
      <button data-tab="create" class="puni-nav-btn active">作る</button>
      <button data-tab="collection" class="puni-nav-btn">図鑑</button>
      <button data-tab="gallery" class="puni-nav-btn">広場</button>
      <button data-tab="stats" class="puni-nav-btn">記録</button>
    </nav>
  </div>
</header>

<main class="puni-main">

  <!-- CREATE TAB -->
  <section id="tab-create" class="puni-tab puni-tab-active">
    <div class="puni-hero">
      <div class="puni-hero-orbs" aria-hidden="true">
        <div class="puni-hero-orb puni-hero-orb-1"></div>
        <div class="puni-hero-orb puni-hero-orb-2"></div>
        <div class="puni-hero-orb puni-hero-orb-3"></div>
      </div>
      <h1 class="puni-hero-title">
        今日の気持ちを<br/>
        <span class="puni-grad-text">ぷにぷにオーブ</span>に。
      </h1>
      <p class="puni-hero-sub">AIがあなたの感情を読み取って、世界に一つだけのオーブを生成します。<br/>未来の自分への手紙としても使える、新感覚の"気持ち日記"です ✨</p>
    </div>

    <div class="puni-prompt-card" id="daily-prompt-card" style="display:none;">
      <span class="puni-prompt-label">🌟 今日のお題</span>
      <p class="puni-prompt-text" id="daily-prompt-text">読み込み中…</p>
      <button class="puni-prompt-use" id="use-prompt-btn">このお題で書く</button>
    </div>

    <div class="puni-card puni-form-card">
      <label class="puni-label">タイトル <span class="puni-label-hint">(必須)</span></label>
      <input id="capsule-title" type="text" maxlength="60" placeholder="今日のできごと…" class="puni-input" autocomplete="off"/>
      <div class="puni-counter" id="title-counter">0 / 60</div>

      <label class="puni-label">気持ち・できごと <span class="puni-label-hint">(必須・5〜2000文字)</span></label>
      <textarea id="capsule-content" maxlength="2000" placeholder="今日あったこと、感じたこと、なんでも書いてみて。&#10;例: 「テスト終わった〜！マジで疲れた…でも遊びにいけるの楽しみ✨」&#10;AIがそれを解析して、あなただけのオーブを作るよ🪄" class="puni-textarea"></textarea>
      <div class="puni-counter" id="content-counter">0 / 2000</div>

      <div class="puni-options">
        <label class="puni-toggle">
          <input type="checkbox" id="is-timecapsule"/>
          <span class="puni-toggle-track"><span class="puni-toggle-thumb"></span></span>
          <span class="puni-toggle-text">⏳ タイムカプセルにする</span>
        </label>
        <div id="timecapsule-options" class="puni-timecapsule-options" style="display:none;">
          <label class="puni-label-sm">いつ開封する？</label>
          <div class="puni-chip-row">
            <button type="button" class="puni-chip" data-days="7">1週間後</button>
            <button type="button" class="puni-chip" data-days="30">1ヶ月後</button>
            <button type="button" class="puni-chip" data-days="180">半年後</button>
            <button type="button" class="puni-chip" data-days="365">1年後</button>
            <button type="button" class="puni-chip" data-days="custom">日付指定</button>
          </div>
          <input type="datetime-local" id="open-at-input" class="puni-input puni-input-sm" style="display:none;"/>
        </div>

        <label class="puni-toggle">
          <input type="checkbox" id="is-public"/>
          <span class="puni-toggle-track"><span class="puni-toggle-thumb"></span></span>
          <span class="puni-toggle-text">🌐 シェアリンクを公開する</span>
        </label>
      </div>

      <button id="create-btn" class="puni-btn puni-btn-primary">
        <span class="puni-btn-text">オーブを生成する</span>
        <span class="puni-btn-spinner" style="display:none;"></span>
      </button>
      <p class="puni-form-note">※ 1時間に20個まで作れます。あなたのデータはあなただけのもの。</p>
    </div>

    <!-- 結果表示エリア -->
    <div id="result-area" style="display:none;"></div>
  </section>

  <!-- COLLECTION TAB -->
  <section id="tab-collection" class="puni-tab">
    <div class="puni-section-head">
      <h2 class="puni-section-title">🌟 あなたのオーブ図鑑</h2>
      <p class="puni-section-sub">これまでに作ったぷにオーブたち</p>
    </div>
    <div class="puni-filter-row">
      <button class="puni-filter-chip active" data-filter="all">すべて</button>
      <button class="puni-filter-chip" data-filter="legendary">レジェンダリー</button>
      <button class="puni-filter-chip" data-filter="epic">エピック</button>
      <button class="puni-filter-chip" data-filter="rare">レア</button>
      <button class="puni-filter-chip" data-filter="locked">未開封</button>
    </div>
    <div id="collection-grid" class="puni-collection-grid">
      <div class="puni-loading">読み込み中…</div>
    </div>

    <div class="puni-section-head" style="margin-top:48px;">
      <h2 class="puni-section-title">🌍 みんなのオーブ</h2>
      <p class="puni-section-sub">公開されているオーブを覗いてみよう</p>
    </div>
    <div id="feed-grid" class="puni-collection-grid">
      <div class="puni-loading">読み込み中…</div>
    </div>
  </section>

  <!-- GALLERY TAB -->
  <section id="tab-gallery" class="puni-tab">
    <div class="puni-section-head">
      <h2 class="puni-section-title">🌈 みんなの広場</h2>
      <p class="puni-section-sub">公開されたぷにオーブをのぞいてみよう</p>
    </div>
    <div class="puni-filter-row">
      <button class="puni-gallery-tab active" data-gallery="recent">🆕 新着</button>
      <button class="puni-gallery-tab" data-gallery="popular">🔥 人気</button>
      <button class="puni-gallery-tab" data-gallery="rare">💎 レア</button>
    </div>
    <div id="gallery-grid" class="puni-collection-grid">
      <div class="puni-loading">読み込み中…</div>
    </div>
  </section>

  <!-- STATS TAB -->
  <section id="tab-stats" class="puni-tab">
    <div class="puni-section-head">
      <h2 class="puni-section-title">📊 あなたの記録</h2>
      <p class="puni-section-sub">心の足あとを見てみよう</p>
    </div>
    <div id="stats-content" class="puni-stats">
      <div class="puni-loading">読み込み中…</div>
    </div>
  </section>

</main>

<!-- サポートCTA -->
<section class="puni-support-cta">
  <div class="puni-support-card">
    <div class="puni-support-emoji">☕</div>
    <h3 class="puni-support-title">ぷにメモリーが気に入ったら</h3>
    <p class="puni-support-text">完全無料で運営中。サーバー代の支援や応援メッセージはとても嬉しいです🌸</p>
    <div class="puni-support-actions">
      <button id="open-support" class="puni-btn-support">💖 開発者を応援する</button>
      <button id="open-share-app" class="puni-btn-support secondary">🐦 友達にシェア</button>
    </div>
  </div>
</section>

<footer class="puni-footer">
  <div class="puni-footer-inner">
    <p class="puni-footer-tag">ぷにメモリー © 2025</p>
    <p class="puni-footer-sub">あなたの"今"をAIが永久保存。</p>
    <div class="puni-footer-links">
      <a href="#" id="privacy-link">プライバシー</a>
      <a href="#" id="about-link">このサービスについて</a>
      <a href="#" id="support-link">支援する</a>
    </div>
  </div>
</footer>

<!-- モーダル: カプセル詳細 -->
<div id="modal-root" class="puni-modal-root" style="display:none;">
  <div class="puni-modal-backdrop"></div>
  <div class="puni-modal-content" id="modal-content"></div>
</div>

<!-- トースト -->
<div id="toast-root" class="puni-toast-root"></div>

<script>${an()}<\/script>
</body>
</html>`}function nn(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function on(){return`
:root {
  --puni-pink: #FFD6E8;
  --puni-pink-deep: #FF8FB1;
  --puni-purple: #E0CCFF;
  --puni-purple-deep: #B69BFF;
  --puni-blue: #C8E6FF;
  --puni-blue-deep: #8AB8FF;
  --puni-mint: #C7F0DB;
  --puni-yellow: #FFF1B8;
  --puni-text: #3D2B5C;
  --puni-text-soft: #6B5B95;
  --puni-text-mute: #9D90B8;
  --puni-bg: #FDF6FF;
  --puni-card: #ffffff;
  --puni-shadow: 0 8px 24px -8px rgba(180, 140, 220, 0.25), 0 2px 8px rgba(180, 140, 220, 0.1);
  --puni-shadow-strong: 0 16px 40px -12px rgba(180, 140, 220, 0.35), 0 4px 16px rgba(180, 140, 220, 0.15);
  --radius-sm: 14px;
  --radius: 22px;
  --radius-lg: 32px;
}

* { -webkit-tap-highlight-color: transparent; }

html, body {
  margin: 0; padding: 0;
  font-family: 'Zen Maru Gothic','M PLUS Rounded 1c','Hiragino Maru Gothic ProN','Hiragino Sans',-apple-system,sans-serif;
  background: var(--puni-bg);
  color: var(--puni-text);
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

button { font-family: inherit; cursor: pointer; }
input, textarea { font-family: inherit; }

/* 背景ぼやぼや */
.puni-bg {
  position: fixed; inset: 0; z-index: -1;
  background: linear-gradient(160deg, #FFE5F1 0%, #E5F1FF 50%, #F1E5FF 100%);
  overflow: hidden;
}
.puni-blob {
  position: absolute; border-radius: 50%;
  filter: blur(60px); opacity: 0.5;
  animation: blobFloat 20s ease-in-out infinite;
}
.puni-blob-1 { top: -10%; left: -10%; width: 400px; height: 400px; background: var(--puni-pink); }
.puni-blob-2 { top: 40%; right: -10%; width: 500px; height: 500px; background: var(--puni-purple); animation-delay: -7s; }
.puni-blob-3 { bottom: -10%; left: 30%; width: 450px; height: 450px; background: var(--puni-blue); animation-delay: -14s; }
@keyframes blobFloat {
  0%, 100% { transform: translate(0,0) scale(1); }
  33% { transform: translate(30px,-50px) scale(1.05); }
  66% { transform: translate(-20px,30px) scale(0.95); }
}
.puni-md-only { display: none; }
@media (min-width: 768px) { .puni-md-only { display: inline; } }

/* エラーバナー */
.puni-error-banner {
  position: fixed; top: 12px; left: 50%; transform: translateX(-50%);
  background: white; border: 2px solid #FFB3B3;
  color: #C0392B; padding: 10px 18px; border-radius: 999px;
  font-weight: 700; box-shadow: var(--puni-shadow);
  z-index: 200; font-size: 14px;
}

/* ヘッダー */
.puni-header {
  position: sticky; top: 0; z-index: 50;
  background: rgba(253, 246, 255, 0.85);
  backdrop-filter: blur(16px) saturate(1.2);
  -webkit-backdrop-filter: blur(16px) saturate(1.2);
  border-bottom: 1px solid rgba(180, 140, 220, 0.12);
}
.puni-header-inner {
  max-width: 1100px; margin: 0 auto;
  padding: 12px 20px;
  display: flex; justify-content: space-between; align-items: center;
  gap: 12px;
}
.puni-logo {
  display: flex; align-items: center; gap: 10px;
  text-decoration: none; color: var(--puni-text);
  font-weight: 900; font-size: 18px;
}
.puni-logo-orb {
  width: 32px; height: 32px; border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #FFD6E8, #FF8FB1 60%, #B69BFF);
  box-shadow: 0 4px 12px rgba(255,143,177,0.4), inset -2px -2px 4px rgba(255,255,255,0.6);
  animation: punyPuny 3s ease-in-out infinite;
}
@keyframes punyPuny {
  0%,100% { transform: scale(1) rotate(0deg); }
  25% { transform: scale(1.06,0.94) rotate(-1deg); }
  75% { transform: scale(0.97,1.03) rotate(1deg); }
}
.puni-logo-text { letter-spacing: -0.02em; }

.puni-nav { display: flex; gap: 4px; background: white; padding: 4px; border-radius: 999px; box-shadow: var(--puni-shadow); }
.puni-nav-btn {
  border: none; background: transparent;
  padding: 8px 16px; border-radius: 999px;
  font-weight: 700; color: var(--puni-text-soft);
  font-size: 14px; transition: all 0.2s;
}
.puni-nav-btn.active {
  background: linear-gradient(135deg, #FFB3D9, #B69BFF);
  color: white; box-shadow: 0 4px 12px rgba(182,155,255,0.4);
}
@media (max-width: 480px) {
  .puni-nav-btn { padding: 7px 12px; font-size: 13px; }
}

/* メイン */
.puni-main {
  max-width: 1100px; margin: 0 auto;
  padding: 24px 20px 80px;
}

.puni-tab { display: none; animation: fadeUp 0.4s ease; }
.puni-tab-active { display: block; }
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ヒーロー */
.puni-hero { text-align: center; padding: 32px 0 24px; position: relative; }
.puni-hero-orbs { display: flex; justify-content: center; gap: 18px; margin-bottom: 18px; pointer-events: none; }
.puni-hero-orb {
  width: 64px; height: 64px; border-radius: 50%;
  position: relative;
  box-shadow: 0 8px 20px -4px rgba(180,140,220,0.4), inset -4px -6px 10px rgba(0,0,0,0.05), inset 3px 4px 8px rgba(255,255,255,0.6);
  animation: heroFloat 4s ease-in-out infinite;
}
.puni-hero-orb::before {
  content: ''; position: absolute; top: 18%; left: 22%;
  width: 32%; height: 22%; border-radius: 50%;
  background: rgba(255,255,255,0.7); filter: blur(1px);
}
.puni-hero-orb-1 { background: radial-gradient(circle at 35% 30%, #FFD6E8, #FF8FB1 60%, #B69BFF); animation-delay: 0s; }
.puni-hero-orb-2 { background: radial-gradient(circle at 35% 30%, #FFF, #C8E6FF 30%, #8AB8FF 80%); animation-delay: -1.3s; transform: translateY(-8px); }
.puni-hero-orb-3 { background: radial-gradient(circle at 35% 30%, #FFF1B8, #FFD93D 50%, #FF8FB1); animation-delay: -2.6s; }
@keyframes heroFloat {
  0%,100% { transform: translateY(0) scale(1,1); }
  25% { transform: translateY(-6px) scale(1.04,0.96); }
  75% { transform: translateY(4px) scale(0.97,1.03); }
}
@media (max-width: 480px) {
  .puni-hero-orb { width: 52px; height: 52px; }
}
.puni-hero-title {
  font-size: clamp(28px, 6vw, 44px);
  font-weight: 900; line-height: 1.3;
  letter-spacing: -0.02em; margin: 0 0 16px;
}
.puni-grad-text {
  background: linear-gradient(135deg, #FF8FB1 0%, #B69BFF 50%, #8AB8FF 100%);
  -webkit-background-clip: text; background-clip: text;
  color: transparent; -webkit-text-fill-color: transparent;
}
.puni-hero-sub {
  font-size: clamp(14px, 2.5vw, 16px);
  color: var(--puni-text-soft); margin: 0;
  line-height: 1.7;
}

/* カード */
.puni-card {
  background: var(--puni-card);
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: var(--puni-shadow);
  border: 1px solid rgba(180,140,220,0.08);
}
@media (max-width: 480px) { .puni-card { padding: 18px; border-radius: var(--radius); } }

.puni-form-card { max-width: 640px; margin: 0 auto; }

.puni-prompt-card {
  max-width: 640px; margin: 0 auto 16px;
  background: linear-gradient(135deg, #FFF1B8, #FFD6E8);
  border-radius: var(--radius); padding: 16px 20px;
  display: flex; flex-direction: column; gap: 8px;
  box-shadow: var(--puni-shadow);
  border: 2px dashed rgba(180,140,220,0.25);
  position: relative;
}
.puni-prompt-label { font-size: 12px; font-weight: 700; color: #B68C5C; }
.puni-prompt-text { font-size: 16px; font-weight: 700; color: var(--puni-text); margin: 0; line-height: 1.5; }
.puni-prompt-use {
  align-self: flex-end;
  background: white; border: 2px solid #FFB3D9;
  padding: 6px 14px; border-radius: 999px;
  font-weight: 700; color: var(--puni-text); font-size: 13px;
}
.puni-prompt-use:hover { background: #FFE5F1; }

.puni-gallery-tab {
  flex-shrink: 0; border: 2px solid #E8DEF5; background: white;
  padding: 6px 14px; border-radius: 999px;
  font-size: 13px; font-weight: 700; color: var(--puni-text-soft);
}
.puni-gallery-tab.active { background: linear-gradient(135deg,#FFB3D9,#B69BFF); color: white; border-color: transparent; }

.puni-label { display: block; font-weight: 700; font-size: 14px; color: var(--puni-text); margin: 8px 0 6px; }
.puni-label-hint { color: var(--puni-text-mute); font-weight: 500; font-size: 12px; }
.puni-label-sm { display: block; font-size: 13px; font-weight: 600; color: var(--puni-text-soft); margin: 8px 0 6px; }

.puni-input, .puni-textarea {
  width: 100%; box-sizing: border-box;
  background: #FAFAFC;
  border: 2px solid transparent;
  border-radius: var(--radius-sm);
  padding: 12px 16px;
  font-size: 16px; color: var(--puni-text);
  transition: all 0.2s;
  outline: none;
}
.puni-input:focus, .puni-textarea:focus {
  background: white;
  border-color: var(--puni-pink-deep);
  box-shadow: 0 0 0 4px rgba(255,143,177,0.12);
}
.puni-textarea { min-height: 120px; resize: vertical; line-height: 1.6; }
.puni-input-sm { padding: 10px 14px; font-size: 14px; }

.puni-counter {
  text-align: right; font-size: 12px; color: var(--puni-text-mute);
  margin-top: 4px; margin-bottom: 8px;
}

/* オプション */
.puni-options { margin: 16px 0 8px; display: flex; flex-direction: column; gap: 10px; }
.puni-toggle {
  display: flex; align-items: center; gap: 12px;
  cursor: pointer; user-select: none;
  padding: 8px 4px;
}
.puni-toggle input { display: none; }
.puni-toggle-track {
  width: 44px; height: 26px; border-radius: 999px;
  background: #E8DEF5; position: relative;
  transition: background 0.2s;
  flex-shrink: 0;
}
.puni-toggle-thumb {
  position: absolute; top: 3px; left: 3px;
  width: 20px; height: 20px; border-radius: 50%;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.15);
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.puni-toggle input:checked + .puni-toggle-track { background: linear-gradient(135deg, #FFB3D9, #B69BFF); }
.puni-toggle input:checked + .puni-toggle-track .puni-toggle-thumb { transform: translateX(18px); }
.puni-toggle-text { font-weight: 600; color: var(--puni-text); font-size: 15px; }

.puni-timecapsule-options {
  background: linear-gradient(135deg, #FFF5FA, #F5F0FF);
  border-radius: var(--radius-sm);
  padding: 14px; margin: 4px 0 8px;
}
.puni-chip-row { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px; }
.puni-chip {
  border: 2px solid #E8DEF5; background: white;
  padding: 6px 14px; border-radius: 999px;
  font-size: 13px; font-weight: 600; color: var(--puni-text-soft);
  transition: all 0.15s;
}
.puni-chip.active {
  background: linear-gradient(135deg, #FFB3D9, #B69BFF);
  color: white; border-color: transparent;
}

/* ボタン */
.puni-btn {
  width: 100%; border: none;
  padding: 16px 24px;
  border-radius: var(--radius);
  font-weight: 800; font-size: 16px;
  display: flex; align-items: center; justify-content: center; gap: 10px;
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  margin-top: 8px;
  position: relative; overflow: hidden;
}
.puni-btn-primary {
  background: linear-gradient(135deg, #FF8FB1 0%, #B69BFF 50%, #8AB8FF 100%);
  color: white;
  box-shadow: 0 8px 20px -4px rgba(182,155,255,0.5), inset 0 -3px 6px rgba(0,0,0,0.08), inset 0 2px 4px rgba(255,255,255,0.4);
}
.puni-btn-primary:active { transform: scale(0.97); box-shadow: 0 4px 10px -2px rgba(182,155,255,0.4), inset 0 -1px 2px rgba(0,0,0,0.05); }
.puni-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 24px -4px rgba(182,155,255,0.6), inset 0 -3px 6px rgba(0,0,0,0.08), inset 0 2px 4px rgba(255,255,255,0.4); }
.puni-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.puni-btn-spinner {
  width: 18px; height: 18px;
  border: 3px solid rgba(255,255,255,0.4); border-top-color: white;
  border-radius: 50%; animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.puni-btn-secondary {
  background: white; color: var(--puni-text);
  border: 2px solid #E8DEF5;
  box-shadow: var(--puni-shadow);
}
.puni-btn-secondary:hover { border-color: #B69BFF; }

.puni-btn-icon {
  width: auto; padding: 10px 16px; font-size: 14px;
  background: white; color: var(--puni-text);
  border: 2px solid #E8DEF5;
}

.puni-form-note {
  font-size: 12px; color: var(--puni-text-mute);
  text-align: center; margin: 12px 0 0; line-height: 1.6;
}

/* 結果カード */
.puni-result-card {
  margin-top: 24px;
  background: white; border-radius: var(--radius-lg);
  padding: 32px 24px; text-align: center;
  box-shadow: var(--puni-shadow-strong);
  animation: popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative; overflow: hidden;
}
@keyframes popIn {
  from { opacity: 0; transform: scale(0.85); }
  to { opacity: 1; transform: scale(1); }
}
.puni-result-orb-wrap { display: flex; justify-content: center; margin: 8px 0 20px; }
.puni-result-orb { animation: orbFloat 4s ease-in-out infinite; }
@keyframes orbFloat {
  0%,100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
.puni-result-title { font-size: 22px; font-weight: 800; margin: 0 0 6px; }
.puni-result-sub { color: var(--puni-text-soft); font-size: 14px; margin: 0 0 18px; }
.puni-result-badges { display: flex; justify-content: center; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
.puni-badge {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 14px; border-radius: 999px;
  font-weight: 700; font-size: 13px;
}
.puni-badge-emotion { background: linear-gradient(135deg, #FFD6E8, #E0CCFF); color: var(--puni-text); }
.puni-badge-rarity { color: white; }
.puni-badge-rarity.common { background: #B0BEC5; }
.puni-badge-rarity.rare { background: linear-gradient(135deg, #4FC3F7, #7E57C2); }
.puni-badge-rarity.epic { background: linear-gradient(135deg, #BA68C8, #7E57C2); box-shadow: 0 0 16px rgba(186,104,200,0.4); }
.puni-badge-rarity.legendary {
  background: linear-gradient(135deg, #FFD700, #FFA500, #FF6347);
  box-shadow: 0 0 20px rgba(255,165,0,0.6);
  animation: legendShine 2s linear infinite;
}
@keyframes legendShine { 0%,100% { filter: brightness(1); } 50% { filter: brightness(1.2); } }

.puni-share-row { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; margin-top: 16px; }
.puni-share-btn {
  background: white; border: 2px solid #E8DEF5;
  padding: 10px 18px; border-radius: 999px;
  font-weight: 700; font-size: 14px; color: var(--puni-text);
  display: inline-flex; align-items: center; gap: 6px;
  transition: all 0.15s;
}
.puni-share-btn:hover { border-color: #B69BFF; transform: translateY(-2px); }
.puni-share-btn.tw { background: #1DA1F2; color: white; border-color: #1DA1F2; }
.puni-share-btn.line { background: #06C755; color: white; border-color: #06C755; }

/* セクションヘッド */
.puni-section-head { text-align: center; margin: 16px 0 24px; }
.puni-section-title { font-size: 24px; font-weight: 900; margin: 0 0 4px; }
.puni-section-sub { color: var(--puni-text-soft); font-size: 14px; margin: 0; }

/* フィルタ */
.puni-filter-row {
  display: flex; gap: 6px; margin-bottom: 16px;
  overflow-x: auto; -webkit-overflow-scrolling: touch;
  padding: 4px; scrollbar-width: none;
}
.puni-filter-row::-webkit-scrollbar { display: none; }
.puni-filter-chip {
  flex-shrink: 0; border: 2px solid #E8DEF5; background: white;
  padding: 6px 14px; border-radius: 999px;
  font-size: 13px; font-weight: 700; color: var(--puni-text-soft);
}
.puni-filter-chip.active { background: linear-gradient(135deg,#FFB3D9,#B69BFF); color: white; border-color: transparent; }

/* コレクション */
.puni-collection-grid {
  display: grid; gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
}
@media (min-width: 768px) {
  .puni-collection-grid { grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); }
}
.puni-orb-card {
  background: white; border-radius: var(--radius);
  padding: 16px 12px; text-align: center;
  box-shadow: var(--puni-shadow);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer; position: relative;
  border: 1px solid rgba(180,140,220,0.08);
}
.puni-orb-card:hover { transform: translateY(-4px); box-shadow: var(--puni-shadow-strong); }
.puni-orb-card .orb-img { width: 88px; height: 88px; margin: 4px auto 8px; }
.puni-orb-card .orb-title {
  font-size: 13px; font-weight: 700; margin: 0;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.puni-orb-card .orb-date { font-size: 11px; color: var(--puni-text-mute); margin: 2px 0 0; }
.puni-orb-card .orb-locked-overlay {
  position: absolute; inset: 0;
  background: rgba(255,255,255,0.7);
  backdrop-filter: blur(4px);
  border-radius: var(--radius);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 700; color: var(--puni-text-soft);
}
.puni-orb-card.legendary { border-color: #FFD700; }
.puni-orb-card.legendary::before {
  content: ''; position: absolute; inset: -1px;
  border-radius: var(--radius);
  padding: 2px;
  background: linear-gradient(135deg, #FFD700, #FF6347, #FFD700);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor; mask-composite: exclude;
  pointer-events: none;
}
.puni-orb-card.epic { border-color: #BA68C8; }

.puni-empty {
  text-align: center; padding: 60px 20px;
  color: var(--puni-text-soft); font-size: 14px;
}
.puni-empty-icon { font-size: 48px; margin-bottom: 12px; }

/* 統計 */
.puni-stats { display: grid; gap: 16px; }
.puni-stat-card {
  background: white; border-radius: var(--radius);
  padding: 20px; box-shadow: var(--puni-shadow);
}
.puni-stat-num {
  font-size: 36px; font-weight: 900;
  background: linear-gradient(135deg,#FF8FB1,#B69BFF);
  -webkit-background-clip: text; background-clip: text;
  color: transparent; -webkit-text-fill-color: transparent;
  line-height: 1;
}
.puni-stat-label { font-size: 13px; color: var(--puni-text-soft); font-weight: 600; margin-top: 4px; }
.puni-stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
@media (max-width: 480px) { .puni-stats-grid { grid-template-columns: repeat(2, 1fr); } }

.puni-bar-row { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
.puni-bar-label { width: 80px; font-size: 13px; font-weight: 600; color: var(--puni-text); }
.puni-bar-track { flex: 1; height: 12px; background: #F0E8FA; border-radius: 999px; overflow: hidden; }
.puni-bar-fill { height: 100%; border-radius: 999px; transition: width 0.6s ease; }
.puni-bar-num { width: 32px; text-align: right; font-size: 12px; color: var(--puni-text-mute); font-weight: 700; }

/* 図鑑系プログレス */
.puni-rarity-badges { display: flex; flex-wrap: wrap; gap: 8px; }
.puni-rarity-badge {
  background: white; border-radius: 999px;
  padding: 6px 12px; font-size: 12px; font-weight: 700;
  border: 2px solid #E8DEF5;
}

/* ローディング */
.puni-loading { text-align: center; padding: 40px; color: var(--puni-text-soft); font-size: 14px; }

/* サポートCTA */
.puni-support-cta {
  max-width: 720px; margin: 60px auto 0; padding: 0 20px;
}
.puni-support-card {
  background: linear-gradient(135deg, #FFF1F8, #F1EAFF);
  border-radius: var(--radius-lg);
  padding: 28px 24px; text-align: center;
  box-shadow: var(--puni-shadow);
  border: 1.5px solid rgba(255,255,255,0.8);
}
.puni-support-emoji { font-size: 38px; margin-bottom: 6px; }
.puni-support-title { font-size: 18px; font-weight: 900; margin: 0 0 6px; color: var(--puni-text); }
.puni-support-text { font-size: 13px; color: var(--puni-text-soft); margin: 0 0 16px; line-height: 1.6; }
.puni-support-actions { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; }
.puni-btn-support {
  background: linear-gradient(180deg, #FF9FC5, #FF6BA8);
  color: white; border: none; border-radius: 999px;
  padding: 12px 22px; font-weight: 800; font-size: 14px;
  box-shadow: 0 4px 0 rgba(220,80,140,0.25), 0 6px 14px rgba(255,107,168,0.3), inset 0 -2px 4px rgba(0,0,0,0.06);
  transition: transform .15s cubic-bezier(.34,1.56,.64,1);
}
.puni-btn-support:active { transform: translateY(2px); box-shadow: 0 1px 0 rgba(220,80,140,0.25), 0 2px 6px rgba(255,107,168,0.2); }
.puni-btn-support.secondary {
  background: linear-gradient(180deg, #B5EAEA, #6FCFCF);
  box-shadow: 0 4px 0 rgba(80,180,180,0.25), 0 6px 14px rgba(120,210,210,0.3), inset 0 -2px 4px rgba(0,0,0,0.06);
}

/* フッター */
.puni-footer {
  border-top: 1px solid rgba(180,140,220,0.12);
  background: rgba(255,255,255,0.5);
  margin-top: 40px;
}
.puni-footer-inner {
  max-width: 1100px; margin: 0 auto;
  padding: 24px 20px;
  text-align: center;
}
.puni-footer-tag { font-weight: 800; margin: 0 0 4px; color: var(--puni-text); }
.puni-footer-sub { color: var(--puni-text-soft); font-size: 13px; margin: 0 0 12px; }
.puni-footer-links { display: flex; justify-content: center; gap: 16px; }
.puni-footer-links a { color: var(--puni-text-mute); font-size: 12px; text-decoration: none; }
.puni-footer-links a:hover { color: var(--puni-text-soft); }

/* モーダル */
.puni-modal-root {
  position: fixed; inset: 0; z-index: 100;
  display: flex; align-items: center; justify-content: center;
  padding: 20px;
}
.puni-modal-backdrop {
  position: absolute; inset: 0;
  background: rgba(60,40,80,0.5);
  backdrop-filter: blur(8px);
  animation: fadeIn 0.2s;
}
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.puni-modal-content {
  position: relative; z-index: 1;
  background: white; border-radius: var(--radius-lg);
  padding: 28px 24px;
  width: 100%; max-width: 500px;
  max-height: 90vh; overflow-y: auto;
  box-shadow: var(--puni-shadow-strong);
  animation: popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.puni-modal-close {
  position: absolute; top: 14px; right: 14px;
  width: 32px; height: 32px; border-radius: 50%;
  border: none; background: #F0E8FA;
  font-size: 18px; color: var(--puni-text-soft);
}

/* トースト */
.puni-toast-root {
  position: fixed; bottom: 24px; left: 50%;
  transform: translateX(-50%);
  z-index: 200;
  display: flex; flex-direction: column; gap: 8px;
  pointer-events: none;
}
.puni-toast {
  background: rgba(60,40,80,0.92);
  color: white; padding: 12px 20px;
  border-radius: 999px;
  font-weight: 600; font-size: 14px;
  box-shadow: var(--puni-shadow-strong);
  animation: toastIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes toastIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.puni-toast.error { background: #C0392B; }
.puni-toast.success { background: linear-gradient(135deg,#FF8FB1,#B69BFF); }

/* タイムカプセルカウントダウン */
.puni-countdown {
  display: inline-flex; gap: 8px; align-items: baseline;
  background: linear-gradient(135deg, #FFF5FA, #F5F0FF);
  padding: 14px 18px; border-radius: var(--radius);
  margin: 12px 0;
}
.puni-countdown-num { font-size: 22px; font-weight: 900; color: var(--puni-text); }
.puni-countdown-label { font-size: 12px; color: var(--puni-text-soft); }
`}function an(){return`
(function() {
'use strict';

const $ = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => Array.from(p.querySelectorAll(s));

// アナリティクス送信
function track(event, payload) {
  try {
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, payload })
    }).catch(()=>{});
  } catch(e){}
}

// トースト
function toast(msg, type='') {
  const root = $('#toast-root');
  const el = document.createElement('div');
  el.className = 'puni-toast ' + type;
  el.textContent = msg;
  root.appendChild(el);
  setTimeout(() => { el.style.opacity = 0; el.style.transition='opacity 0.3s'; }, 2200);
  setTimeout(() => el.remove(), 2600);
}

// タブ切替
$$('.puni-nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    $$('.puni-nav-btn').forEach(b => b.classList.toggle('active', b === btn));
    $$('.puni-tab').forEach(t => t.classList.toggle('puni-tab-active', t.id === 'tab-' + tab));
    track('tab_change', { tab });
    if (tab === 'collection') loadCollection();
    if (tab === 'gallery') loadGallery();
    if (tab === 'stats') loadStats();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

// お題ロード
(async function loadPrompt() {
  try {
    const r = await fetch('/api/daily-prompt');
    const d = await r.json();
    const card = $('#daily-prompt-card');
    $('#daily-prompt-text').textContent = d.prompt;
    card.style.display = '';
    $('#use-prompt-btn').addEventListener('click', () => {
      titleInput.value = d.prompt.replace(/[？?]$/, '');
      titleInput.dispatchEvent(new Event('input'));
      contentInput.focus();
      track('prompt_used', { date: d.date });
    });
  } catch(e){}
})();

// ギャラリー
let galleryTab = 'recent';
async function loadGallery() {
  const grid = $('#gallery-grid');
  grid.innerHTML = '<div class="puni-loading">読み込み中…</div>';
  try {
    const r = await fetch('/api/gallery?tab=' + galleryTab);
    const d = await r.json();
    if (!d.items || !d.items.length) {
      grid.innerHTML = '<div class="puni-empty"><div class="puni-empty-icon">🌌</div>まだ公開オーブがないよ。<br>あなたが最初に公開してみない？</div>';
      return;
    }
    grid.innerHTML = d.items.map(item => \`
      <a class="puni-orb-card \${item.orb.rarity}" href="/c/\${item.shareId}" target="_blank" rel="noopener">
        <div class="orb-img">\${orbSvgInline(item.orb).replace('width="200" height="200"','width="88" height="88"')}</div>
        <p class="orb-title">\${escapeHtml(item.title)}</p>
        <p class="orb-date">\${item.emotionEmoji} 💗\${item.reactions || 0}</p>
      </a>
    \`).join('');
  } catch(e) {
    grid.innerHTML = '<div class="puni-empty">読み込みに失敗しました</div>';
  }
}
$$('.puni-gallery-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    galleryTab = btn.dataset.gallery;
    $$('.puni-gallery-tab').forEach(b => b.classList.toggle('active', b === btn));
    loadGallery();
    track('gallery_tab', { tab: galleryTab });
  });
});

// 入力カウンター
const titleInput = $('#capsule-title');
const contentInput = $('#capsule-content');
titleInput.addEventListener('input', () => {
  $('#title-counter').textContent = titleInput.value.length + ' / 60';
});
contentInput.addEventListener('input', () => {
  $('#content-counter').textContent = contentInput.value.length + ' / 2000';
});

// タイムカプセルトグル
const tcToggle = $('#is-timecapsule');
tcToggle.addEventListener('change', () => {
  $('#timecapsule-options').style.display = tcToggle.checked ? '' : 'none';
});

// チップ選択
let selectedDays = null;
let customOpenAt = null;
$$('.puni-chip[data-days]').forEach(chip => {
  chip.addEventListener('click', () => {
    $$('.puni-chip[data-days]').forEach(c => c.classList.toggle('active', c === chip));
    if (chip.dataset.days === 'custom') {
      $('#open-at-input').style.display = '';
      selectedDays = 'custom';
    } else {
      $('#open-at-input').style.display = 'none';
      selectedDays = parseInt(chip.dataset.days);
      customOpenAt = null;
    }
  });
});
$('#open-at-input').addEventListener('change', e => {
  customOpenAt = new Date(e.target.value).getTime();
});

// 作成ボタン
const createBtn = $('#create-btn');
createBtn.addEventListener('click', async () => {
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();
  if (title.length < 1) { toast('タイトルを入力してね', 'error'); return; }
  if (content.length < 5) { toast('5文字以上書いてね', 'error'); return; }

  let openAt = null;
  if (tcToggle.checked) {
    if (selectedDays === 'custom') {
      if (!customOpenAt || customOpenAt <= Date.now()) { toast('未来の日付を選んでね', 'error'); return; }
      openAt = customOpenAt;
    } else if (typeof selectedDays === 'number') {
      openAt = Date.now() + selectedDays * 24 * 60 * 60 * 1000;
    } else {
      toast('開封タイミングを選んでね', 'error'); return;
    }
  }

  setLoading(true);
  track('create_attempt', { hasOpenAt: !!openAt, isPublic: $('#is-public').checked, length: content.length });

  try {
    const res = await fetch('/api/capsules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title, content, openAt,
        isPublic: $('#is-public').checked
      })
    });
    const data = await res.json();
    if (!res.ok) {
      toast(data.error || '生成に失敗しました', 'error');
      track('create_error', { status: res.status });
      return;
    }
    track('create_success', { emotion: data.emotion, rarity: data.orb.rarity });
    showResult(data);
    titleInput.value = ''; contentInput.value = '';
    $('#title-counter').textContent = '0 / 60';
    $('#content-counter').textContent = '0 / 2000';
  } catch(e) {
    console.error(e);
    toast('通信エラー', 'error');
  } finally {
    setLoading(false);
  }
});

function setLoading(b) {
  createBtn.disabled = b;
  $('#create-btn .puni-btn-text').textContent = b ? '生成中…' : 'オーブを生成する';
  $('#create-btn .puni-btn-spinner').style.display = b ? '' : 'none';
}

// 結果表示
function showResult(d) {
  const area = $('#result-area');
  const isLocked = !d.opened && d.openAt;
  const orbHtml = isLocked ? lockedOrbHtml() : orbSvgInline(d.orb);
  const openAtStr = d.openAt ? new Date(d.openAt).toLocaleString('ja-JP', { year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' }) : '';
  const shareUrl = location.origin + '/c/' + d.shareId;
  const rarityLine = ({legendary:'🌟 LEGENDARY が出た！',epic:'💜 EPIC オーブ！',rare:'💎 RARE オーブ！',common:''})[d.orb.rarity] || '';
  const baseText = isLocked ? '未来のわたしへ手紙を書いた 💌' : 'わたしの今日のぷにオーブができた ✨';
  const shareText = encodeURIComponent((rarityLine ? rarityLine + '\\n' : '') + baseText + ' #ぷにメモリー');

  // レジェンダリー時は紙吹雪
  if (d.orb.rarity === 'legendary' || d.orb.rarity === 'epic') {
    confetti(d.orb.color, d.orb.color2);
  }

  area.innerHTML = \`
    <div class="puni-result-card">
      <div class="puni-result-orb-wrap"><div class="puni-result-orb">\${orbHtml}</div></div>
      <h3 class="puni-result-title">\${escapeHtml(d.title)}</h3>
      <p class="puni-result-sub">\${isLocked ? '🔒 タイムカプセルとして保存しました' : 'オーブが生成されました ✨'}</p>
      <div class="puni-result-badges">
        <span class="puni-badge puni-badge-emotion">\${d.emotionEmoji} \${escapeHtml(d.emotionLabel)}</span>
        <span class="puni-badge puni-badge-rarity \${d.orb.rarity}">\${rarityLabel(d.orb.rarity)}</span>
      </div>
      \${isLocked ? \`<div class="puni-countdown"><span class="puni-countdown-label">開封予定:</span><span class="puni-countdown-num">\${openAtStr}</span></div>\` : ''}
      <div class="puni-share-row">
        <button class="puni-share-btn" data-copy-url="\${escapeHtml(shareUrl)}">🔗 リンクをコピー</button>
        <a class="puni-share-btn tw" target="_blank" rel="noopener" href="https://twitter.com/intent/tweet?text=\${shareText}&url=\${encodeURIComponent(shareUrl)}">𝕏 でシェア</a>
        <a class="puni-share-btn line" target="_blank" rel="noopener" href="https://social-plugins.line.me/lineit/share?url=\${encodeURIComponent(shareUrl)}">LINEでシェア</a>
      </div>
    </div>
  \`;
  area.style.display = '';
  area.querySelector('[data-copy-url]').addEventListener('click', function(e) {
    const url = e.currentTarget.getAttribute('data-copy-url');
    navigator.clipboard.writeText(url).then(() => toast('リンクをコピーしたよ ✨','success'));
  });
  area.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

window.addEventListener('puni-toast', e => toast(e.detail, 'success'));

// シンプルなSVGオーブインライン
function orbSvgInline(orb) {
  const size = 200;
  const cx = size/2, cy = size/2, r = size*0.42;
  const id = Math.random().toString(36).slice(2,8);
  let grad;
  if (orb.pattern === 'sparkle') {
    grad = \`<radialGradient id="g\${id}" cx="40%" cy="35%"><stop offset="0%" stop-color="white" stop-opacity="0.95"/><stop offset="20%" stop-color="\${orb.color2}"/><stop offset="100%" stop-color="\${orb.color}"/></radialGradient>\`;
  } else if (orb.pattern === 'nebula') {
    grad = \`<radialGradient id="g\${id}" cx="35%" cy="30%"><stop offset="0%" stop-color="\${orb.color2}"/><stop offset="60%" stop-color="\${orb.color}"/><stop offset="100%" stop-color="\${orb.color}" stop-opacity="0.7"/></radialGradient>\`;
  } else if (orb.pattern === 'marble') {
    grad = \`<linearGradient id="g\${id}"><stop offset="0%" stop-color="\${orb.color}"/><stop offset="50%" stop-color="\${orb.color2}"/><stop offset="100%" stop-color="\${orb.color}"/></linearGradient>\`;
  } else if (orb.pattern === 'glow') {
    grad = \`<radialGradient id="g\${id}"><stop offset="0%" stop-color="\${orb.color2}" stop-opacity="0.9"/><stop offset="60%" stop-color="\${orb.color}"/><stop offset="100%" stop-color="\${orb.color}" stop-opacity="0.6"/></radialGradient>\`;
  } else {
    grad = \`<radialGradient id="g\${id}"><stop offset="0%" stop-color="\${orb.color}"/><stop offset="40%" stop-color="\${orb.color2}" stop-opacity="0.7"/><stop offset="80%" stop-color="\${orb.color}"/></radialGradient>\`;
  }
  let sparkles = '';
  if (orb.pattern === 'sparkle' || orb.rarity === 'legendary') {
    for (let i=0;i<6;i++) {
      const a = Math.PI*2*i/6;
      const d = r*(0.8+Math.random()*0.3);
      sparkles += \`<circle cx="\${cx+Math.cos(a)*d}" cy="\${cy+Math.sin(a)*d}" r="2" fill="white" opacity="0.85"/>\`;
    }
  }
  let ring = '';
  if (orb.rarity === 'legendary') {
    ring = \`<circle cx="\${cx}" cy="\${cy}" r="\${r*1.15}" fill="none" stroke="gold" stroke-width="1.5" opacity="0.8"><animate attributeName="r" values="\${r*1.15};\${r*1.25};\${r*1.15}" dur="2s" repeatCount="indefinite"/></circle>\`;
  }
  return \`<svg viewBox="0 0 \${size} \${size}" width="\${size}" height="\${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>\${grad}<filter id="sh\${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur in="SourceAlpha" stdDeviation="6"/><feOffset dx="0" dy="2"/><feFlood flood-color="\${orb.color2}" flood-opacity="0.6"/><feComposite in2="SourceAlpha" operator="in"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
    \${ring}
    <g filter="url(#sh\${id})"><g><animateTransform attributeName="transform" type="scale" values="1,1;1.04,0.96;0.97,1.03;1,1" dur="3s" repeatCount="indefinite" additive="sum"/>
    <circle cx="\${cx}" cy="\${cy}" r="\${r}" fill="url(#g\${id})"/>
    <ellipse cx="\${cx-r*0.3}" cy="\${cy-r*0.35}" rx="\${r*0.32}" ry="\${r*0.18}" fill="white" opacity="0.55"/>
    \${sparkles}</g></g>
  </svg>\`;
}
function lockedOrbHtml() {
  return \`<svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
    <defs><radialGradient id="lk"><stop offset="0%" stop-color="#E8DEF5"/><stop offset="100%" stop-color="#C5B5E0"/></radialGradient></defs>
    <circle cx="100" cy="100" r="84" fill="url(#lk)" opacity="0.85"/>
    <text x="100" y="120" text-anchor="middle" font-size="64">🔒</text>
  </svg>\`;
}

function rarityLabel(r) {
  return ({common:'コモン',rare:'レア',epic:'エピック',legendary:'レジェンダリー'})[r] || r;
}

function confetti(c1, c2) {
  const colors = [c1, c2, '#FFD93D', '#FF8FB1', '#B69BFF', '#8AB8FF'];
  const n = 80;
  const root = document.body;
  for (let i = 0; i < n; i++) {
    const el = document.createElement('div');
    const c = colors[i % colors.length];
    el.style.cssText = 'position:fixed;left:'+(50+(Math.random()-0.5)*60)+'%;top:30%;width:'+(6+Math.random()*8)+'px;height:'+(8+Math.random()*10)+'px;background:'+c+';border-radius:'+(Math.random()>0.5?'50%':'2px')+';pointer-events:none;z-index:300;';
    const dx = (Math.random()-0.5)*600;
    const dy = 400+Math.random()*400;
    const rot = Math.random()*720;
    el.animate([
      { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
      { transform: 'translate('+dx+'px,'+dy+'px) rotate('+rot+'deg)', opacity: 0 }
    ], { duration: 1500+Math.random()*1000, easing: 'cubic-bezier(0.2, 0.8, 0.4, 1)' });
    root.appendChild(el);
    setTimeout(() => el.remove(), 2700);
  }
}
function escapeHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

// === コレクション ===
let allItems = [];
let currentFilter = 'all';

async function loadCollection() {
  const grid = $('#collection-grid');
  grid.innerHTML = '<div class="puni-loading">読み込み中…</div>';
  try {
    const res = await fetch('/api/capsules');
    const data = await res.json();
    allItems = data.items || [];
    renderCollection();
  } catch(e) {
    grid.innerHTML = '<div class="puni-empty">読み込みに失敗しました</div>';
  }
  loadFeed();
}

async function loadFeed() {
  const grid = $('#feed-grid');
  if (!grid) return;
  grid.innerHTML = '<div class="puni-loading">読み込み中…</div>';
  try {
    const res = await fetch('/api/feed?limit=12');
    const data = await res.json();
    const items = data.items || [];
    if (!items.length) {
      grid.innerHTML = '<div class="puni-empty">まだ公開オーブがないよ。最初のひとつになろう！</div>';
      return;
    }
    grid.innerHTML = items.map(function(item) {
      return '<a href="/c/' + item.shareId + '" class="puni-orb-card ' + item.orb.rarity + '" style="text-decoration:none;color:inherit;display:block;">' +
        '<div class="orb-img">' + orbSvgInline(item.orb).replace('width="200" height="200"','width="88" height="88"') + '</div>' +
        '<p class="orb-title">' + escapeHtml(item.title) + '</p>' +
        '<p class="orb-date">' + item.emotionEmoji + ' ' + new Date(item.createdAt).toLocaleDateString('ja-JP',{month:'numeric',day:'numeric'}) + '</p>' +
      '</a>';
    }).join('');
  } catch(e) {
    grid.innerHTML = '<div class="puni-empty">読み込みに失敗しました</div>';
  }
}

$$('.puni-filter-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    currentFilter = chip.dataset.filter;
    $$('.puni-filter-chip').forEach(c => c.classList.toggle('active', c === chip));
    renderCollection();
  });
});

function renderCollection() {
  const grid = $('#collection-grid');
  let items = allItems;
  if (currentFilter === 'locked') items = items.filter(i => !i.opened);
  else if (currentFilter !== 'all') items = items.filter(i => i.orb.rarity === currentFilter);

  if (!items.length) {
    grid.innerHTML = '<div class="puni-empty"><div class="puni-empty-icon">🪄</div>まだオーブがないよ。<br>気持ちを書いて、最初のオーブを生成してみよう！</div>';
    return;
  }

  grid.innerHTML = items.map(item => {
    const isLocked = !item.opened;
    const orbHtml = isLocked ? lockedOrbHtml().replace('width="200" height="200"','width="88" height="88"') : orbSvgInline(item.orb).replace('width="200" height="200"','width="88" height="88"');
    return \`
      <div class="puni-orb-card \${item.orb.rarity}" data-id="\${item.id}">
        <div class="orb-img">\${orbHtml}</div>
        <p class="orb-title">\${escapeHtml(item.title)}</p>
        <p class="orb-date">\${new Date(item.createdAt).toLocaleDateString('ja-JP',{month:'numeric',day:'numeric'})}</p>
        \${isLocked ? \`<div class="orb-locked-overlay">🔒<br><small>\${item.openAt ? new Date(item.openAt).toLocaleDateString('ja-JP',{month:'short',day:'numeric'}) : ''} 開封</small></div>\` : ''}
      </div>
    \`;
  }).join('');

  $$('.puni-orb-card').forEach(card => {
    card.addEventListener('click', () => {
      const item = allItems.find(i => i.id === card.dataset.id);
      if (item) showItemModal(item);
    });
  });
}

function showItemModal(item) {
  const root = $('#modal-root');
  const content = $('#modal-content');
  const isLocked = !item.opened;
  const orbHtml = isLocked ? lockedOrbHtml() : orbSvgInline(item.orb);
  const shareUrl = location.origin + '/c/' + item.shareId;
  content.innerHTML = \`
    <button class="puni-modal-close" data-close>✕</button>
    <div class="puni-result-orb-wrap">\${orbHtml}</div>
    <h3 class="puni-result-title" style="text-align:center;">\${escapeHtml(item.title)}</h3>
    <p class="puni-result-sub" style="text-align:center;">\${new Date(item.createdAt).toLocaleString('ja-JP')}</p>
    <div class="puni-result-badges">
      <span class="puni-badge puni-badge-emotion">\${item.emotionEmoji} \${escapeHtml(item.emotionLabel)}</span>
      <span class="puni-badge puni-badge-rarity \${item.orb.rarity}">\${rarityLabel(item.orb.rarity)}</span>
    </div>
    \${isLocked ? \`<div class="puni-countdown"><span class="puni-countdown-label">開封日:</span><span class="puni-countdown-num">\${new Date(item.openAt).toLocaleString('ja-JP')}</span></div>\` : 
      \`<div style="background:#FAFAFC;border-radius:14px;padding:14px;margin:14px 0;white-space:pre-wrap;line-height:1.7;font-size:14px;color:#3D2B5C;">\${escapeHtml(item.content||'')}</div>\`}
    <div class="puni-share-row">
      <button class="puni-share-btn" data-copy-url="\${escapeHtml(shareUrl)}">🔗 コピー</button>
      <a class="puni-share-btn tw" target="_blank" rel="noopener" href="https://twitter.com/intent/tweet?text=\${encodeURIComponent('わたしのぷにオーブを見て ✨ #ぷにメモリー')}&url=\${encodeURIComponent(shareUrl)}">𝕏</a>
      <button class="puni-share-btn" data-delete style="color:#C0392B;border-color:#FFB3B3;">🗑 削除</button>
    </div>
  \`;
  root.style.display = '';
  root.querySelector('[data-close]').onclick = () => root.style.display = 'none';
  root.querySelector('.puni-modal-backdrop').onclick = () => root.style.display = 'none';
  root.querySelector('[data-copy-url]').addEventListener('click', e => {
    navigator.clipboard.writeText(e.currentTarget.getAttribute('data-copy-url')).then(()=>toast('リンクをコピーしたよ ✨','success'));
  });
  root.querySelector('[data-delete]').onclick = async () => {
    if (!confirm('このオーブを削除しますか？')) return;
    const r = await fetch('/api/capsules/' + item.id, { method: 'DELETE' });
    if (r.ok) { toast('削除しました'); root.style.display = 'none'; loadCollection(); track('delete', {}); }
  };
}

// === 統計 ===
async function loadStats() {
  const el = $('#stats-content');
  el.innerHTML = '<div class="puni-loading">読み込み中…</div>';
  try {
    const res = await fetch('/api/stats');
    const s = await res.json();

    const emoLabels = {joy:'よろこび ✨',sadness:'かなしみ 💧',anger:'いかり 🔥',fear:'ふあん 🌀',love:'あい 💖',surprise:'おどろき ⭐',calm:'やすらぎ 🌿'};
    const emoColors = {joy:'#FFD93D',sadness:'#6B9DC2',anger:'#E63946',fear:'#7B2CBF',love:'#FF6B9D',surprise:'#06D6A0',calm:'#A8DADC'};
    const total = s.total || 0;
    const maxByEmo = Math.max(1, ...Object.values(s.byEmotion || {}));

    let bars = '';
    for (const [k, label] of Object.entries(emoLabels)) {
      const n = s.byEmotion[k] || 0;
      const pct = (n / maxByEmo) * 100;
      bars += \`<div class="puni-bar-row">
        <span class="puni-bar-label">\${label}</span>
        <div class="puni-bar-track"><div class="puni-bar-fill" style="width:\${pct}%;background:\${emoColors[k]};"></div></div>
        <span class="puni-bar-num">\${n}</span>
      </div>\`;
    }

    const rarityCounts = s.byRarity || {};

    el.innerHTML = \`
      <div class="puni-stats-grid">
        <div class="puni-stat-card"><div class="puni-stat-num">\${total}</div><div class="puni-stat-label">オーブ総数</div></div>
        <div class="puni-stat-card"><div class="puni-stat-num">\${s.streak || 0}</div><div class="puni-stat-label">連続記録日数</div></div>
        <div class="puni-stat-card"><div class="puni-stat-num">\${rarityCounts.legendary || 0}</div><div class="puni-stat-label">✨ レジェンダリー</div></div>
      </div>
      <div class="puni-stat-card">
        <div style="font-weight:800;font-size:16px;margin-bottom:14px;">気持ちの内訳</div>
        \${bars}
      </div>
      <div class="puni-stat-card">
        <div style="font-weight:800;font-size:16px;margin-bottom:14px;">レアリティ図鑑</div>
        <div class="puni-rarity-badges">
          <span class="puni-rarity-badge">コモン × \${rarityCounts.common || 0}</span>
          <span class="puni-rarity-badge" style="border-color:#4FC3F7;">レア × \${rarityCounts.rare || 0}</span>
          <span class="puni-rarity-badge" style="border-color:#BA68C8;">エピック × \${rarityCounts.epic || 0}</span>
          <span class="puni-rarity-badge" style="border-color:#FFD700;background:linear-gradient(135deg,#FFF8E1,#FFE082);">レジェンダリー × \${rarityCounts.legendary || 0}</span>
        </div>
      </div>
      <div class="puni-stat-card" style="background:linear-gradient(135deg,#FFF5FA,#F5F0FF);border:2px dashed #E0CCFF;">
        <div style="font-weight:800;font-size:15px;margin-bottom:6px;">💎 プレミアム機能（近日公開）</div>
        <div style="font-size:13px;color:#6B5B95;line-height:1.7;">月額300円で無制限保存・限定スキン・5年タイムカプセル・図鑑エクスポートが解放されます。</div>
        <button class="puni-btn-icon" style="margin-top:10px;" onclick="window.dispatchEvent(new CustomEvent('puni-toast',{detail:'リリース通知を予約したよ ✨'}));window.__t&&window.__t('premium_interest',{})">通知を受け取る</button>
      </div>
    \`;
  } catch(e) {
    el.innerHTML = '<div class="puni-empty">読み込みに失敗しました</div>';
  }
}
window.__t = track;

// 初回オンボーディング
function showOnboarding() {
  if (localStorage.getItem('puni_onboarded')) return;
  $('#modal-content').innerHTML = \`
    <button class="puni-modal-close" data-close>✕</button>
    <div style="text-align:center;padding:8px 0;">
      <div style="font-size:60px;margin-bottom:8px;">🪄</div>
      <h3 style="margin:0 0 8px;font-size:22px;">ようこそ、ぷにメモリーへ</h3>
      <p style="line-height:1.8;color:#6B5B95;font-size:14px;margin:0 0 16px;">
        今日の気持ちを書くと、AIが <span style="font-weight:800;color:#FF8FB1;">ぷにぷにオーブ</span> に変えるよ。<br>
        集めて図鑑を埋めたり、未来の自分にタイムカプセルとして送ったり。<br><br>
        <span style="color:#9D90B8;font-size:12px;">レアなオーブが出たら…✨ お楽しみに！</span>
      </p>
      <button class="puni-btn puni-btn-primary" data-start>はじめる</button>
    </div>
  \`;
  $('#modal-root').style.display = '';
  const close = () => {
    $('#modal-root').style.display = 'none';
    localStorage.setItem('puni_onboarded', '1');
    track('onboarding_complete', {});
  };
  $('#modal-root [data-close]').onclick = close;
  $('#modal-root [data-start]').onclick = close;
  $('#modal-root .puni-modal-backdrop').onclick = close;
  track('onboarding_shown', {});
}
setTimeout(showOnboarding, 600);

// 初期表示
track('app_loaded', { ua: navigator.userAgent.slice(0,40) });

// PWA風: 追加ヘルプ
$('#about-link').addEventListener('click', e => {
  e.preventDefault();
  $('#modal-content').innerHTML = \`
    <button class="puni-modal-close" data-close>✕</button>
    <h3 style="margin:0 0 10px;">ぷにメモリーって？ 🪄</h3>
    <p style="line-height:1.8;color:#6B5B95;font-size:14px;">日々の気持ちをAIが解析して、あなただけのぷにぷにオーブを生成するサービスです。</p>
    <ul style="line-height:1.8;color:#6B5B95;font-size:14px;padding-left:20px;">
      <li>感情AIが文章から色・形・レアリティを決定</li>
      <li>未来の自分への手紙＝タイムカプセル機能</li>
      <li>図鑑コレクション・連続記録・レアリティ抽選</li>
      <li>シェア機能でSNSに共有可能</li>
      <li>あなたのデータはあなただけのもの</li>
    </ul>
  \`;
  $('#modal-root').style.display = '';
  $('#modal-root [data-close]').onclick = () => $('#modal-root').style.display='none';
  $('#modal-root .puni-modal-backdrop').onclick = () => $('#modal-root').style.display='none';
});
$('#privacy-link').addEventListener('click', e => {
  e.preventDefault();
  $('#modal-content').innerHTML = \`
    <button class="puni-modal-close" data-close>✕</button>
    <h3 style="margin:0 0 10px;">プライバシー 🛡</h3>
    <p style="line-height:1.8;color:#6B5B95;font-size:14px;">
      ・あなたが書いた内容は暗号化された Cloudflare D1 に保存されます。<br>
      ・公開設定をしない限り、誰にも見えません。<br>
      ・IPアドレスはハッシュ化のみ保存（個人特定なし）。<br>
      ・解析イベントは匿名で記録されます。<br>
      ・カプセルはいつでも削除できます。<br>
      ・第三者にデータを売却することはありません。
    </p>
  \`;
  $('#modal-root').style.display = '';
  $('#modal-root [data-close]').onclick = () => $('#modal-root').style.display='none';
  $('#modal-root .puni-modal-backdrop').onclick = () => $('#modal-root').style.display='none';
});

// === サポートモーダル ===
function openSupportModal() {
  $('#modal-content').innerHTML = \`
    <button class="puni-modal-close" data-close>✕</button>
    <div style="text-align:center;padding:8px 0 4px;">
      <div style="font-size:48px;margin-bottom:4px;">☕</div>
      <h3 style="margin:0 0 8px;font-size:20px;">開発者を応援する</h3>
      <p style="line-height:1.7;color:#6B5B95;font-size:14px;margin:0 0 18px;">
        サーバー代やオーブの拡充に充てられます。<br>
        どんな金額でもとても励みになります🌸
      </p>
    </div>
    <div style="display:flex;flex-direction:column;gap:10px;">
      <a href="https://www.buymeacoffee.com/punimemory" target="_blank" rel="noopener nofollow"
         class="puni-support-link"
         style="display:flex;align-items:center;gap:12px;padding:14px 16px;border-radius:18px;background:linear-gradient(180deg,#FFDD00,#FFB300);color:#3D2B5C;text-decoration:none;font-weight:800;box-shadow:0 4px 0 rgba(0,0,0,0.08);"
         data-track="support_bmac">
        <span style="font-size:22px;">☕</span>
        <span>Buy Me a Coffee で応援する</span>
      </a>
      <a href="https://ko-fi.com/punimemory" target="_blank" rel="noopener nofollow"
         class="puni-support-link"
         style="display:flex;align-items:center;gap:12px;padding:14px 16px;border-radius:18px;background:linear-gradient(180deg,#FF5E5B,#FF3D3D);color:white;text-decoration:none;font-weight:800;box-shadow:0 4px 0 rgba(0,0,0,0.1);"
         data-track="support_kofi">
        <span style="font-size:22px;">💖</span>
        <span>Ko-fi で応援する</span>
      </a>
      <button id="copy-support-share" class="puni-support-link"
              style="display:flex;align-items:center;gap:12px;padding:14px 16px;border-radius:18px;background:linear-gradient(180deg,#B5EAEA,#6FCFCF);color:white;border:none;font-family:inherit;font-weight:800;box-shadow:0 4px 0 rgba(80,180,180,0.25);cursor:pointer;font-size:14px;">
        <span style="font-size:22px;">🐦</span>
        <span>SNSでアプリをシェアする</span>
      </button>
    </div>
    <p style="text-align:center;color:#9D90B8;font-size:11px;margin:16px 0 0;">※ 外部リンクは新しいタブで開きます</p>
  \`;
  $('#modal-root').style.display = '';
  $('#modal-root [data-close]').onclick = () => $('#modal-root').style.display='none';
  $('#modal-root .puni-modal-backdrop').onclick = () => $('#modal-root').style.display='none';
  $$('#modal-content [data-track]').forEach(el => {
    el.addEventListener('click', () => track(el.dataset.track));
  });
  const cs = $('#copy-support-share');
  if (cs) {
    cs.onclick = () => {
      const url = location.origin;
      const text = 'AIが日記をぷにぷにオーブに変えてくれる「ぷにメモリー」面白い ✨ #ぷにメモリー';
      if (navigator.share) {
        navigator.share({ title:'ぷにメモリー', text, url }).catch(()=>{});
      } else {
        window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(text + '\\n' + url), '_blank', 'noopener');
      }
      track('support_share_app');
    };
  }
  track('support_modal_open');
}
$('#open-support').addEventListener('click', openSupportModal);
$('#support-link').addEventListener('click', e => { e.preventDefault(); openSupportModal(); });
$('#open-share-app').addEventListener('click', () => {
  const url = location.origin;
  const text = 'AIが日記をぷにぷにオーブに変える「ぷにメモリー」🪄 完全無料！ #ぷにメモリー';
  if (navigator.share) {
    navigator.share({ title:'ぷにメモリー', text, url }).catch(()=>{});
  } else {
    window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(text + '\\n' + url), '_blank', 'noopener');
  }
  track('share_app_btn');
});

})();
`}function sn(t){const e=V(t.title),r=V(t.content||""),n=Bt[t.emotion],o=ot[t.emotion],i=new Date(t.createdAt).toLocaleString("ja-JP",{year:"numeric",month:"long",day:"numeric"}),a=`/og/${t.shareId}.svg`,l=`${t.title} | ぷにメモリー`,s=t.opened?`${o} ${n} のオーブ（${he(t.rarity)}）。${i} の思い出。`:`🔒 タイムカプセル「${t.title}」が ${t.openAt?new Date(t.openAt).toLocaleDateString("ja-JP"):""} に開封されます。`,c=ln(t);return`<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"/>
<meta name="theme-color" content="${t.color}"/>
<title>${e} | ぷにメモリー</title>
<meta name="description" content="${V(s)}"/>
<meta property="og:title" content="${V(l)}"/>
<meta property="og:description" content="${V(s)}"/>
<meta property="og:type" content="article"/>
<meta property="og:image" content="${a}"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="${V(l)}"/>
<meta name="twitter:description" content="${V(s)}"/>
<meta name="twitter:image" content="${a}"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;500;700;900&family=M+PLUS+Rounded+1c:wght@400;500;700;900&display=swap" rel="stylesheet"/>
<style>${cn(t.color,t.color2)}</style>
</head>
<body>
<div class="puni-bg">
  <div class="puni-blob puni-blob-1"></div>
  <div class="puni-blob puni-blob-2"></div>
</div>

<header class="puni-header">
  <a href="/" class="puni-logo">
    <span class="puni-logo-orb"></span>
    <span class="puni-logo-text">ぷにメモリー</span>
  </a>
</header>

<main class="puni-share-main">
  <div class="puni-share-card">
    <div class="puni-share-orb-wrap">
      ${c}
    </div>
    <h1 class="puni-share-title">${e}</h1>
    <p class="puni-share-date">${i}</p>
    <div class="puni-share-badges">
      <span class="puni-badge puni-badge-emotion">${o} ${n}</span>
      <span class="puni-badge puni-badge-rarity ${t.rarity}">${he(t.rarity)}</span>
    </div>
    ${t.opened?`
      <div class="puni-share-content">${r.replace(/\n/g,"<br>")}</div>
    `:`
      <div class="puni-share-locked">
        <div style="font-size:48px;">🔒</div>
        <p style="font-weight:700;margin:8px 0 4px;">タイムカプセル</p>
        <p style="font-size:14px;color:#6B5B95;">${t.openAt?new Date(t.openAt).toLocaleString("ja-JP",{year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit"}):""} に開封されます</p>
      </div>
    `}

    <div class="puni-reactions" id="reactions">
      <button class="puni-react-btn" data-react="love">💖 <span data-count="love">0</span></button>
      <button class="puni-react-btn" data-react="sparkle">✨ <span data-count="sparkle">0</span></button>
      <button class="puni-react-btn" data-react="calm">🌿 <span data-count="calm">0</span></button>
      <button class="puni-react-btn" data-react="wow">😲 <span data-count="wow">0</span></button>
    </div>

    <div class="puni-share-actions">
      <a href="#" target="_blank" rel="noopener" class="puni-share-btn tw" id="tw-share">𝕏 でシェア</a>
      <a href="#" target="_blank" rel="noopener" class="puni-share-btn line" id="line-share">LINE</a>
      <button class="puni-share-btn" id="copy-share">🔗 コピー</button>
    </div>

    <a href="/" class="puni-cta">
      <span>あなたも作ってみる</span>
      <span class="puni-cta-arrow">→</span>
    </a>
  </div>
</main>

<div id="toast-root" class="puni-toast-root"></div>

<script>
(function() {
  const shareId = ${JSON.stringify(t.shareId)};
  const shareUrl = location.href;

  // シェアURL設定
  const tw = document.getElementById('tw-share');
  const line = document.getElementById('line-share');
  const tweetText = encodeURIComponent('わたしのぷにオーブを見て ✨ #ぷにメモリー');
  const u = encodeURIComponent(shareUrl);
  if (tw) tw.href = 'https://twitter.com/intent/tweet?text=' + tweetText + '&url=' + u;
  if (line) line.href = 'https://social-plugins.line.me/lineit/share?url=' + u;

  // コピー
  document.getElementById('copy-share').addEventListener('click', () => {
    navigator.clipboard.writeText(shareUrl).then(() => toast('リンクをコピーしました ✨'));
  });

  // リアクション
  let reacted = JSON.parse(localStorage.getItem('puni_reacted_' + shareId) || '{}');

  async function loadReactions() {
    try {
      const r = await fetch('/api/share/' + shareId + '/reactions');
      const data = await r.json();
      const reactions = data.reactions || {};
      ['love','sparkle','calm','wow'].forEach(k => {
        const el = document.querySelector('[data-count="' + k + '"]');
        if (el) el.textContent = reactions[k] || 0;
      });
    } catch(e){}
  }

  document.querySelectorAll('.puni-react-btn').forEach(btn => {
    const reaction = btn.dataset.react;
    if (reacted[reaction]) btn.classList.add('reacted');
    btn.addEventListener('click', async () => {
      if (btn.disabled) return;
      btn.disabled = true;
      btn.classList.add('reacted','popping');
      setTimeout(() => btn.classList.remove('popping'), 400);
      try {
        const r = await fetch('/api/share/' + shareId + '/react', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reaction })
        });
        if (r.ok) {
          reacted[reaction] = true;
          localStorage.setItem('puni_reacted_' + shareId, JSON.stringify(reacted));
          loadReactions();
        }
      } finally {
        setTimeout(() => btn.disabled = false, 1500);
      }
    });
  });

  loadReactions();

  function toast(msg) {
    const root = document.getElementById('toast-root');
    const el = document.createElement('div');
    el.className = 'puni-toast';
    el.textContent = msg;
    root.appendChild(el);
    setTimeout(() => el.style.opacity = 0, 2200);
    setTimeout(() => el.remove(), 2600);
  }

  // analytics
  fetch('/api/analytics', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ event:'share_page_view', payload:{ shareId } }) }).catch(()=>{});
})();
<\/script>
</body>
</html>`}function V(t){return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function he(t){return{common:"コモン",rare:"レア",epic:"エピック",legendary:"レジェンダリー"}[t]||t}function ln(t){const i="sh"+Math.random().toString(36).slice(2,6);let a="";switch(t.pattern){case"sparkle":a=`<radialGradient id="g${i}" cx="40%" cy="35%"><stop offset="0%" stop-color="white" stop-opacity="0.95"/><stop offset="20%" stop-color="${t.color2}"/><stop offset="100%" stop-color="${t.color}"/></radialGradient>`;break;case"nebula":a=`<radialGradient id="g${i}" cx="35%" cy="30%"><stop offset="0%" stop-color="${t.color2}"/><stop offset="60%" stop-color="${t.color}"/><stop offset="100%" stop-color="${t.color}" stop-opacity="0.7"/></radialGradient>`;break;case"marble":a=`<linearGradient id="g${i}"><stop offset="0%" stop-color="${t.color}"/><stop offset="50%" stop-color="${t.color2}"/><stop offset="100%" stop-color="${t.color}"/></linearGradient>`;break;case"glow":a=`<radialGradient id="g${i}"><stop offset="0%" stop-color="${t.color2}" stop-opacity="0.9"/><stop offset="60%" stop-color="${t.color}"/><stop offset="100%" stop-color="${t.color}" stop-opacity="0.6"/></radialGradient>`;break;default:a=`<radialGradient id="g${i}"><stop offset="0%" stop-color="${t.color}"/><stop offset="40%" stop-color="${t.color2}" stop-opacity="0.7"/><stop offset="80%" stop-color="${t.color}"/></radialGradient>`}let l="";if(t.pattern==="sparkle"||t.rarity==="legendary")for(let c=0;c<8;c++){const d=Math.PI*2*c/8,u=100.8*(.75+c%3*.1);l+=`<circle cx="${120+Math.cos(d)*u}" cy="${120+Math.sin(d)*u}" r="${2+c%2}" fill="white" opacity="0.85"/>`}let s="";return t.rarity==="legendary"?s=`<circle cx="120" cy="120" r="${100.8*1.15}" fill="none" stroke="gold" stroke-width="2" opacity="0.8"><animate attributeName="r" values="${100.8*1.15};${100.8*1.25};${100.8*1.15}" dur="2s" repeatCount="indefinite"/></circle>`:t.rarity==="epic"&&(s=`<circle cx="120" cy="120" r="${100.8*1.1}" fill="none" stroke="${t.color2}" stroke-width="1.5" opacity="0.6"/>`),t.opened?`<svg viewBox="0 0 240 240" width="240" height="240" xmlns="http://www.w3.org/2000/svg">
    <defs>
      ${a}
      <filter id="sh${i}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur in="SourceAlpha" stdDeviation="8"/><feOffset dx="0" dy="3"/><feFlood flood-color="${t.color2}" flood-opacity="0.6"/><feComposite in2="SourceAlpha" operator="in"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    ${s}
    <g filter="url(#sh${i})">
      <g transform-origin="120 120">
        <animateTransform attributeName="transform" type="scale" values="1,1;1.04,0.96;0.97,1.03;1,1" dur="3.5s" repeatCount="indefinite" additive="sum"/>
        <circle cx="120" cy="120" r="${100.8}" fill="url(#g${i})"/>
        <ellipse cx="${120-100.8*.3}" cy="${120-100.8*.35}" rx="${100.8*.32}" ry="${100.8*.18}" fill="white" opacity="0.55"/>
        <ellipse cx="${120-100.8*.25}" cy="${120-100.8*.3}" rx="${100.8*.16}" ry="${100.8*.09}" fill="white" opacity="0.4"/>
        ${l}
      </g>
    </g>
  </svg>`:`<svg viewBox="0 0 240 240" width="240" height="240" xmlns="http://www.w3.org/2000/svg">
      <defs><radialGradient id="lk${i}"><stop offset="0%" stop-color="#E8DEF5"/><stop offset="100%" stop-color="#C5B5E0"/></radialGradient></defs>
      <circle cx="120" cy="120" r="${100.8}" fill="url(#lk${i})" opacity="0.85"/>
      <text x="120" y="142" text-anchor="middle" font-size="72">🔒</text>
    </svg>`}function cn(t,e){return`
:root {
  --orb-color: ${t};
  --orb-color2: ${e};
  --puni-text: #3D2B5C;
  --puni-text-soft: #6B5B95;
  --puni-text-mute: #9D90B8;
  --puni-bg: #FDF6FF;
  --puni-shadow: 0 8px 24px -8px rgba(180, 140, 220, 0.25), 0 2px 8px rgba(180, 140, 220, 0.1);
  --puni-shadow-strong: 0 16px 40px -12px rgba(180, 140, 220, 0.35);
}
* { -webkit-tap-highlight-color: transparent; }
html,body { margin:0; padding:0; font-family:'Zen Maru Gothic','M PLUS Rounded 1c',sans-serif; background:var(--puni-bg); color:var(--puni-text); min-height:100vh; -webkit-font-smoothing:antialiased; overflow-x:hidden; }
button { font-family:inherit; cursor:pointer; }

.puni-bg { position:fixed; inset:0; z-index:-1; background:linear-gradient(160deg, ${t}33 0%, ${e}33 50%, #F1E5FF 100%); overflow:hidden; }
.puni-blob { position:absolute; border-radius:50%; filter:blur(60px); opacity:0.5; animation:blobFloat 22s ease-in-out infinite; }
.puni-blob-1 { top:-15%; left:-15%; width:500px; height:500px; background:${t}; }
.puni-blob-2 { bottom:-10%; right:-15%; width:550px; height:550px; background:${e}; animation-delay:-10s; }
@keyframes blobFloat {
  0%,100% { transform:translate(0,0) scale(1); }
  50% { transform:translate(30px,-40px) scale(1.05); }
}

.puni-header { display:flex; justify-content:center; padding:16px; background:rgba(253,246,255,0.6); backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); }
.puni-logo { display:flex; align-items:center; gap:10px; text-decoration:none; color:var(--puni-text); font-weight:900; }
.puni-logo-orb { width:32px; height:32px; border-radius:50%; background:radial-gradient(circle at 35% 30%, ${t}, ${e} 60%); box-shadow:0 4px 12px ${e}66, inset -2px -2px 4px rgba(255,255,255,0.6); animation:punyPuny 3s ease-in-out infinite; }
@keyframes punyPuny { 0%,100% { transform:scale(1); } 50% { transform:scale(1.05,0.95); } }

.puni-share-main { max-width:560px; margin:0 auto; padding:20px; }
.puni-share-card { background:white; border-radius:32px; padding:32px 24px 24px; box-shadow:var(--puni-shadow-strong); text-align:center; animation:popIn 0.5s cubic-bezier(0.34,1.56,0.64,1); border:1px solid rgba(180,140,220,0.08); }
@keyframes popIn { from { opacity:0; transform:scale(0.92); } to { opacity:1; transform:scale(1); } }

.puni-share-orb-wrap { display:flex; justify-content:center; margin-bottom:20px; }
.puni-share-orb-wrap > svg { animation:orbFloat 4s ease-in-out infinite; }
@keyframes orbFloat { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-10px); } }

.puni-share-title { font-size:24px; font-weight:900; margin:0 0 4px; line-height:1.4; word-break:break-word; }
.puni-share-date { color:var(--puni-text-soft); font-size:13px; margin:0 0 16px; }

.puni-share-badges { display:flex; justify-content:center; gap:8px; margin-bottom:20px; flex-wrap:wrap; }
.puni-badge { display:inline-flex; align-items:center; gap:6px; padding:6px 14px; border-radius:999px; font-weight:700; font-size:13px; }
.puni-badge-emotion { background:linear-gradient(135deg, ${t}, ${e}); color:white; }
.puni-badge-rarity { color:white; }
.puni-badge-rarity.common { background:#B0BEC5; }
.puni-badge-rarity.rare { background:linear-gradient(135deg,#4FC3F7,#7E57C2); }
.puni-badge-rarity.epic { background:linear-gradient(135deg,#BA68C8,#7E57C2); box-shadow:0 0 16px rgba(186,104,200,0.4); }
.puni-badge-rarity.legendary { background:linear-gradient(135deg,#FFD700,#FFA500,#FF6347); box-shadow:0 0 20px rgba(255,165,0,0.6); animation:shine 2s linear infinite; }
@keyframes shine { 0%,100% { filter:brightness(1); } 50% { filter:brightness(1.2); } }

.puni-share-content {
  background:linear-gradient(135deg, ${t}22, ${e}22);
  border-radius:22px; padding:18px 20px;
  text-align:left; line-height:1.85; font-size:15px;
  color:var(--puni-text); margin-bottom:20px;
  white-space:pre-wrap; word-wrap:break-word;
  border:1px solid ${t}33;
}
.puni-share-locked {
  background:linear-gradient(135deg,#F5F0FF,#FFF5FA);
  border:2px dashed #E0CCFF;
  border-radius:22px; padding:24px; margin-bottom:20px;
}

.puni-reactions { display:flex; gap:8px; justify-content:center; margin-bottom:20px; flex-wrap:wrap; }
.puni-react-btn {
  background:white; border:2px solid #E8DEF5;
  padding:8px 14px; border-radius:999px;
  font-weight:700; font-size:14px; color:var(--puni-text);
  display:inline-flex; align-items:center; gap:6px;
  transition:all 0.15s;
}
.puni-react-btn:hover { transform:translateY(-2px); border-color:${e}; }
.puni-react-btn.reacted { background:linear-gradient(135deg,${t}66,${e}66); border-color:transparent; }
.puni-react-btn.popping { animation:pop 0.4s cubic-bezier(0.34,1.56,0.64,1); }
@keyframes pop { 0% { transform:scale(1); } 50% { transform:scale(1.25); } 100% { transform:scale(1); } }

.puni-share-actions { display:flex; gap:8px; justify-content:center; flex-wrap:wrap; margin-bottom:20px; }
.puni-share-btn {
  background:white; border:2px solid #E8DEF5;
  padding:10px 18px; border-radius:999px;
  font-weight:700; font-size:14px; color:var(--puni-text);
  text-decoration:none; display:inline-flex; align-items:center; gap:6px;
  transition:all 0.15s;
}
.puni-share-btn:hover { transform:translateY(-2px); border-color:${e}; }
.puni-share-btn.tw { background:#1DA1F2; color:white; border-color:#1DA1F2; }

.puni-cta {
  display:flex; align-items:center; justify-content:center; gap:8px;
  background:linear-gradient(135deg, ${t}, ${e});
  color:white; text-decoration:none; font-weight:800; font-size:16px;
  padding:16px; border-radius:22px;
  box-shadow:0 8px 20px -4px ${e}99, inset 0 -3px 6px rgba(0,0,0,0.08), inset 0 2px 4px rgba(255,255,255,0.4);
  transition:transform 0.2s;
}
.puni-cta:hover { transform:translateY(-2px); }
.puni-cta:active { transform:scale(0.97); }
.puni-cta-arrow { transition:transform 0.2s; }
.puni-cta:hover .puni-cta-arrow { transform:translateX(4px); }

.puni-toast-root { position:fixed; bottom:24px; left:50%; transform:translateX(-50%); z-index:200; display:flex; flex-direction:column; gap:8px; pointer-events:none; }
.puni-toast { background:rgba(60,40,80,0.92); color:white; padding:12px 20px; border-radius:999px; font-weight:600; font-size:14px; box-shadow:var(--puni-shadow-strong); animation:toastIn 0.3s cubic-bezier(0.34,1.56,0.64,1); transition:opacity 0.3s; }
@keyframes toastIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }

@media (max-width:480px) {
  .puni-share-card { padding:24px 18px 20px; border-radius:24px; }
  .puni-share-title { font-size:20px; }
}
`}const y=new Ie;y.use("*",Ar({contentSecurityPolicy:{defaultSrc:["'self'"],scriptSrc:["'self'","'unsafe-inline'"],styleSrc:["'self'","'unsafe-inline'","https://fonts.googleapis.com"],fontSrc:["'self'","https://fonts.gstatic.com","data:"],imgSrc:["'self'","data:","https:"],connectSrc:["'self'"],frameAncestors:["'none'"],baseUri:["'self'"],formAction:["'self'"]},xFrameOptions:"DENY",xContentTypeOptions:"nosniff",referrerPolicy:"strict-origin-when-cross-origin",permissionsPolicy:{camera:[],microphone:[],geolocation:[],interestCohort:[]}}));y.use("/api/*",_r({origin:t=>t||"",credentials:!0,maxAge:600}));y.use("*",Hr());async function xt(t){let e=Kt(t,"puni_uid");if(e)await t.env.DB.prepare("UPDATE users SET last_active_at = ? WHERE id = ?").bind(Date.now(),e).run();else{e=Ht("u"),Wr(t,"puni_uid",e,{httpOnly:!0,secure:!0,sameSite:"Lax",maxAge:3600*24*390,path:"/"});const r=Date.now();await t.env.DB.prepare("INSERT OR IGNORE INTO users (id, created_at, last_active_at) VALUES (?, ?, ?)").bind(e,r,r).run()}return e}async function yt(t,e,r){try{const n=Qt(t.req.raw),o=t.req.header("user-agent")||"",i=t.req.header("referer")||"",a=await Zt(n+"puni-salt-2025"),l=Kt(t,"puni_uid")||null;await t.env.DB.prepare("INSERT INTO analytics_events (id, user_id, event_type, payload, ip_hash, user_agent, referrer, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").bind(Ht("e"),l,e,r?JSON.stringify(r).slice(0,1e3):null,a.slice(0,16),o.slice(0,200),i.slice(0,200),Date.now()).run()}catch(n){console.error("analytics error",n)}}y.get("/api/health",t=>t.json({ok:!0,ts:Date.now()}));y.post("/api/capsules",async t=>{try{const e=await xt(t),r=Qt(t.req.raw),n=await Zt(r+"rl-salt"),o=await ze(t.env.DB,`cap:${n.slice(0,16)}`,20,3600);if(!o.ok)return t.json({error:"たくさん作りすぎだよ！少し休もう🍵",resetAt:o.resetAt},429);const i=await t.req.json(),a=ue(i.title||"",60),l=ue(i.content||"",2e3),s=fe(a,1,60);if(!s.ok)return t.json({error:s.error},400);const c=fe(l,5,2e3);if(!c.ok)return t.json({error:c.error},400);const d=Xr(l),u=Qr(l,d),f=Ht("c"),w=tn(),b=Date.now(),x=i.openAt&&i.openAt>b?Math.min(i.openAt,b+1e3*60*60*24*365*5):null,$=i.isPublic?1:0;return await t.env.DB.prepare(`INSERT INTO capsules (id, user_id, title, content, emotion, emotion_score, orb_color, orb_color_2, orb_pattern, orb_size, rarity, share_id, is_public, open_at, opened, created_at)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).bind(f,e,a,l,d.emotion,d.score,u.color,u.color2,u.pattern,u.size,u.rarity,w,$,x,x?0:1,b).run(),await t.env.DB.prepare("UPDATE users SET total_capsules = total_capsules + 1, total_orbs = total_orbs + 1 WHERE id = ?").bind(e).run(),await yt(t,"capsule_created",{emotion:d.emotion,rarity:u.rarity,hasOpenAt:!!x,isPublic:!!$,length:l.length}),t.json({id:f,shareId:w,title:a,content:l,emotion:d.emotion,emotionLabel:Bt[d.emotion],emotionEmoji:ot[d.emotion],score:d.score,intensity:d.intensity,orb:u,openAt:x,opened:!x,isPublic:!!$,createdAt:b,shareUrl:`/c/${w}`})}catch(e){return console.error("create capsule error",e),t.json({error:"カプセル生成に失敗したよ。もう一度試してね。"},500)}});y.get("/api/capsules",async t=>{const e=await xt(t),r=Math.min(parseInt(t.req.query("limit")||"50"),100),n=Math.max(parseInt(t.req.query("offset")||"0"),0),{results:o}=await t.env.DB.prepare(`SELECT id, title, content, emotion, emotion_score, orb_color, orb_color_2, orb_pattern, orb_size, rarity, share_id, is_public, open_at, opened, created_at
     FROM capsules WHERE user_id = ?
     ORDER BY created_at DESC LIMIT ? OFFSET ?`).bind(e,r,n).all(),i=Date.now(),a=[],l=(o||[]).map(s=>{let c=!!s.opened;return!c&&s.open_at&&s.open_at<=i&&(c=!0,a.push(s.id)),{id:s.id,title:s.title,content:c?s.content:null,emotion:s.emotion,emotionLabel:Bt[s.emotion],emotionEmoji:ot[s.emotion],score:s.emotion_score,orb:{color:s.orb_color,color2:s.orb_color_2,pattern:s.orb_pattern,size:s.orb_size,rarity:s.rarity},shareId:s.share_id,isPublic:!!s.is_public,openAt:s.open_at,opened:c,createdAt:s.created_at}});if(a.length){const s=a.map(()=>"?").join(",");await t.env.DB.prepare(`UPDATE capsules SET opened = 1 WHERE id IN (${s})`).bind(...a).run()}return t.json({items:l,count:l.length})});y.get("/api/stats",async t=>{const e=await xt(t),r=await t.env.DB.prepare("SELECT COUNT(*) as n FROM capsules WHERE user_id = ?").bind(e).first(),n=await t.env.DB.prepare("SELECT emotion, COUNT(*) as n FROM capsules WHERE user_id = ? GROUP BY emotion").bind(e).all(),o=await t.env.DB.prepare("SELECT rarity, COUNT(*) as n FROM capsules WHERE user_id = ? GROUP BY rarity").bind(e).all(),i=await t.env.DB.prepare("SELECT created_at FROM capsules WHERE user_id = ? AND created_at > ? ORDER BY created_at DESC").bind(e,Date.now()-1e3*60*60*24*30).all(),a=new Set;for(const c of i.results||[])a.add(new Date(c.created_at).toISOString().slice(0,10));let l=0;const s=new Date;for(let c=0;c<90;c++){const d=new Date(s);d.setDate(d.getDate()-c);const u=d.toISOString().slice(0,10);if(a.has(u))l++;else if(c>0)break}return t.json({total:(r==null?void 0:r.n)||0,byEmotion:Object.fromEntries((n.results||[]).map(c=>[c.emotion,c.n])),byRarity:Object.fromEntries((o.results||[]).map(c=>[c.rarity,c.n])),streak:l})});y.delete("/api/capsules/:id",async t=>{const e=await xt(t),r=t.req.param("id");return(await t.env.DB.prepare("DELETE FROM capsules WHERE id = ? AND user_id = ?").bind(r,e).run()).meta.changes===0?t.json({error:"not found"},404):(await yt(t,"capsule_deleted",{id:r}),t.json({ok:!0}))});y.patch("/api/capsules/:id/public",async t=>{const e=await xt(t),r=t.req.param("id"),{isPublic:n}=await t.req.json();return await t.env.DB.prepare("UPDATE capsules SET is_public = ? WHERE id = ? AND user_id = ?").bind(n?1:0,r,e).run(),t.json({ok:!0})});y.get("/api/gallery",async t=>{const e=t.req.query("tab")||"recent",r=Math.min(parseInt(t.req.query("limit")||"24"),50);let n="";e==="popular"?n=`
      SELECT c.share_id, c.title, c.emotion, c.orb_color, c.orb_color_2, c.orb_pattern, c.orb_size, c.rarity, c.created_at,
             (SELECT COUNT(*) FROM reactions WHERE capsule_id = c.id) AS reactions
      FROM capsules c
      WHERE c.is_public = 1 AND (c.opened = 1 OR c.open_at IS NULL OR c.open_at <= ?)
      ORDER BY reactions DESC, c.created_at DESC
      LIMIT ?`:e==="rare"?n=`
      SELECT share_id, title, emotion, orb_color, orb_color_2, orb_pattern, orb_size, rarity, created_at,
             (SELECT COUNT(*) FROM reactions WHERE capsule_id = capsules.id) AS reactions
      FROM capsules
      WHERE is_public = 1 AND (rarity = 'epic' OR rarity = 'legendary') AND (opened = 1 OR open_at IS NULL OR open_at <= ?)
      ORDER BY created_at DESC LIMIT ?`:n=`
      SELECT share_id, title, emotion, orb_color, orb_color_2, orb_pattern, orb_size, rarity, created_at,
             (SELECT COUNT(*) FROM reactions WHERE capsule_id = capsules.id) AS reactions
      FROM capsules
      WHERE is_public = 1 AND (opened = 1 OR open_at IS NULL OR open_at <= ?)
      ORDER BY created_at DESC LIMIT ?`;const{results:o}=await t.env.DB.prepare(n).bind(Date.now(),r).all();return t.json({items:(o||[]).map(i=>({shareId:i.share_id,title:i.title,emotion:i.emotion,emotionEmoji:ot[i.emotion],orb:{color:i.orb_color,color2:i.orb_color_2,pattern:i.orb_pattern,size:i.orb_size,rarity:i.rarity},reactions:i.reactions||0,createdAt:i.created_at}))})});y.get("/api/daily-prompt",t=>{const e=["今日いちばんテンション上がった瞬間は？","最近のちっちゃい幸せを教えて 🌱","今、心がモヤモヤしてること、書き出してみよう","5年後の自分にメッセージを送るなら？",'今日出会った"いいもの"を記録しよう ✨',"明日への一言を未来の自分へ","今ハマっていることは？",'最近"ありがとう"を言いたい人は？',"心が落ち着くもの・場所は？","今日の自分を褒めてあげよう 💖","一番怖いものは？それでも頑張ってる？","最近笑ったこと、思い出してみよう 😂","今好きな人・物・推しを語って 🌟","今日の体調・気分を一言で","今この瞬間に感謝したいこと"],r=new Date,o=(r.getFullYear()*1e4+(r.getMonth()+1)*100+r.getDate())%e.length;return t.json({prompt:e[o],date:r.toISOString().slice(0,10)})});y.get("/api/share/:shareId",async t=>{const e=t.req.param("shareId"),r=await t.env.DB.prepare(`SELECT id, title, content, emotion, emotion_score, orb_color, orb_color_2, orb_pattern, orb_size, rarity, is_public, open_at, opened, created_at
     FROM capsules WHERE share_id = ?`).bind(e).first();if(!r)return t.json({error:"not found"},404);const n=Date.now(),o=!!r.opened||r.open_at&&r.open_at<=n;return t.json({title:r.title,content:o?r.content:null,emotion:r.emotion,emotionLabel:Bt[r.emotion],emotionEmoji:ot[r.emotion],score:r.emotion_score,orb:{color:r.orb_color,color2:r.orb_color_2,pattern:r.orb_pattern,size:r.orb_size,rarity:r.rarity},isPublic:!!r.is_public,openAt:r.open_at,opened:o,createdAt:r.created_at})});y.post("/api/share/:shareId/react",async t=>{const e=t.req.param("shareId"),{reaction:r}=await t.req.json();if(!["love","sparkle","calm","wow"].includes(r))return t.json({error:"invalid"},400);const o=Qt(t.req.raw),i=await Zt(o+"react");if(!(await ze(t.env.DB,`react:${i.slice(0,16)}:${e}`,10,3600)).ok)return t.json({error:"もう少し待ってね"},429);const l=await t.env.DB.prepare("SELECT id FROM capsules WHERE share_id = ?").bind(e).first();return l?(await t.env.DB.prepare("INSERT INTO reactions (id, capsule_id, user_id, reaction, created_at) VALUES (?, ?, ?, ?, ?)").bind(Ht("r"),l.id,Kt(t,"puni_uid")||null,r,Date.now()).run(),await yt(t,"reaction_added",{reaction:r,shareId:e}),t.json({ok:!0})):t.json({error:"not found"},404)});y.get("/api/share/:shareId/reactions",async t=>{const e=t.req.param("shareId"),r=await t.env.DB.prepare("SELECT id FROM capsules WHERE share_id = ?").bind(e).first();if(!r)return t.json({error:"not found"},404);const{results:n}=await t.env.DB.prepare("SELECT reaction, COUNT(*) as n FROM reactions WHERE capsule_id = ? GROUP BY reaction").bind(r.id).all();return t.json({reactions:Object.fromEntries((n||[]).map(o=>[o.reaction,o.n]))})});y.post("/api/analytics",async t=>{try{const e=await t.req.json();return!e.event||typeof e.event!="string"||e.event.length>50?t.json({ok:!1},400):(await yt(t,e.event,e.payload),t.json({ok:!0}))}catch{return t.json({ok:!1},400)}});y.get("/orb/:filename{.+\\.svg}",async t=>{const e=t.req.param("filename").replace(/\.svg$/,""),r=await t.env.DB.prepare("SELECT orb_color, orb_color_2, orb_pattern, orb_size, rarity, emotion FROM capsules WHERE share_id = ?").bind(e).first();if(!r)return t.text("not found",404);const n=Pe({color:r.orb_color,color2:r.orb_color_2,pattern:r.orb_pattern,size:400,rarity:r.rarity,emotion:r.emotion});return new Response(n,{headers:{"Content-Type":"image/svg+xml; charset=utf-8","Cache-Control":"public, max-age=3600"}})});y.get("/og/:filename{.+\\.svg}",async t=>{const e=t.req.param("filename").replace(/\.svg$/,""),r=await t.env.DB.prepare("SELECT title, emotion, orb_color, orb_color_2, orb_pattern, rarity, created_at FROM capsules WHERE share_id = ?").bind(e).first();if(!r)return t.text("not found",404);const n=rn({title:r.title,emotion:r.emotion,color:r.orb_color,color2:r.orb_color_2,pattern:r.orb_pattern,rarity:r.rarity,date:en(r.created_at)});return new Response(n,{headers:{"Content-Type":"image/svg+xml; charset=utf-8","Cache-Control":"public, max-age=3600"}})});y.get("/",async t=>(await xt(t),await yt(t,"page_view",{page:"home"}),t.html(Nt())));y.get("/c/:shareId",async t=>{const e=t.req.param("shareId"),r=await t.env.DB.prepare(`SELECT title, content, emotion, orb_color, orb_color_2, orb_pattern, orb_size, rarity, is_public, open_at, opened, created_at
     FROM capsules WHERE share_id = ?`).bind(e).first();return r?(await yt(t,"share_view",{shareId:e}),t.html(sn({shareId:e,title:r.title,content:r.content,emotion:r.emotion,color:r.orb_color,color2:r.orb_color_2,pattern:r.orb_pattern,rarity:r.rarity,openAt:r.open_at,opened:!!r.opened||r.open_at&&r.open_at<=Date.now(),isPublic:!!r.is_public,createdAt:r.created_at}))):t.html(Nt({error:"カプセルが見つかりませんでした"}),404)});y.get("/manifest.json",t=>t.json({name:"ぷにメモリー",short_name:"ぷにメモリー",description:'あなたの"今"をAIが永久保存するぷにぷに思い出カプセル',start_url:"/",display:"standalone",background_color:"#FDF6FF",theme_color:"#FFD6E8",orientation:"portrait",icons:[{src:"/icon-192.svg",sizes:"192x192",type:"image/svg+xml",purpose:"any maskable"},{src:"/icon-512.svg",sizes:"512x512",type:"image/svg+xml",purpose:"any maskable"}],categories:["lifestyle","productivity","social"]}));const Me=t=>{const r=new URL(t.req.url).pathname.match(/icon-(\d+)\.svg/),n=r?parseInt(r[1]):192,o=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n} ${n}">
    <defs>
      <radialGradient id="g" cx="35%" cy="30%">
        <stop offset="0%" stop-color="#FFD6E8"/>
        <stop offset="50%" stop-color="#FF8FB1"/>
        <stop offset="100%" stop-color="#B69BFF"/>
      </radialGradient>
    </defs>
    <rect width="${n}" height="${n}" rx="${n*.22}" fill="#FDF6FF"/>
    <circle cx="${n/2}" cy="${n/2}" r="${n*.36}" fill="url(#g)"/>
    <ellipse cx="${n*.4}" cy="${n*.38}" rx="${n*.12}" ry="${n*.07}" fill="white" opacity="0.6"/>
  </svg>`;return new Response(o,{headers:{"Content-Type":"image/svg+xml; charset=utf-8","Cache-Control":"public, max-age=86400"}})};y.get("/icon-192.svg",Me);y.get("/icon-512.svg",Me);y.get("/og.svg",t=>{const e=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#FFE5F1"/><stop offset="50%" stop-color="#E5F1FF"/><stop offset="100%" stop-color="#F1E5FF"/>
      </linearGradient>
      <radialGradient id="orb1" cx="35%" cy="30%"><stop offset="0%" stop-color="#FFD6E8"/><stop offset="60%" stop-color="#FF8FB1"/><stop offset="100%" stop-color="#B69BFF"/></radialGradient>
      <radialGradient id="orb2" cx="35%" cy="30%"><stop offset="0%" stop-color="#C8E6FF"/><stop offset="60%" stop-color="#8AB8FF"/><stop offset="100%" stop-color="#B69BFF"/></radialGradient>
      <radialGradient id="orb3" cx="35%" cy="30%"><stop offset="0%" stop-color="#FFF1B8"/><stop offset="60%" stop-color="#FFD93D"/><stop offset="100%" stop-color="#FF8FB1"/></radialGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#bg)"/>
    <circle cx="220" cy="315" r="120" fill="url(#orb1)"/>
    <ellipse cx="195" cy="280" rx="38" ry="20" fill="white" opacity="0.55"/>
    <circle cx="980" cy="220" r="90" fill="url(#orb2)"/>
    <ellipse cx="960" cy="195" rx="28" ry="15" fill="white" opacity="0.55"/>
    <circle cx="1020" cy="450" r="80" fill="url(#orb3)"/>
    <ellipse cx="1000" cy="425" rx="24" ry="13" fill="white" opacity="0.55"/>
    <text x="600" y="280" text-anchor="middle" font-family="'Hiragino Sans','Yu Gothic',sans-serif" font-size="68" fill="#3D2B5C" font-weight="900">ぷにメモリー</text>
    <text x="600" y="350" text-anchor="middle" font-family="'Hiragino Sans',sans-serif" font-size="32" fill="#6B5B95" font-weight="600">あなたの"今"をぷにぷにオーブに ✨</text>
    <text x="600" y="420" text-anchor="middle" font-family="'Hiragino Sans',sans-serif" font-size="22" fill="#8B7AB8">AI感情解析 × タイムカプセル × オーブ図鑑</text>
  </svg>`;return new Response(e,{headers:{"Content-Type":"image/svg+xml; charset=utf-8","Cache-Control":"public, max-age=3600"}})});y.get("/manifest.json",t=>t.json({name:"ぷにメモリー",short_name:"ぷにメモリー",description:"AIがあなたの気持ちをぷにぷにオーブに変える",start_url:"/",display:"standalone",theme_color:"#FFD6E8",background_color:"#FDF6FF",lang:"ja",icons:[{src:"/favicon.ico",sizes:"any",type:"image/svg+xml"}]}));y.get("/api/admin/stats",async t=>{const e=t.req.header("x-admin-key")||t.req.query("k")||"",r=t.env.ADMIN_KEY||"puni-admin-2025-changeme";if(e!==r)return t.json({error:"unauthorized"},401);const n=1e3*60*60*24,o=Date.now(),[i,a,l,s,c,d]=await Promise.all([t.env.DB.prepare("SELECT COUNT(*) as n FROM users").first(),t.env.DB.prepare("SELECT COUNT(*) as n FROM capsules").first(),t.env.DB.prepare("SELECT COUNT(*) as n FROM capsules WHERE created_at > ?").bind(o-n).first(),t.env.DB.prepare("SELECT COUNT(*) as n FROM capsules WHERE created_at > ?").bind(o-n*7).first(),t.env.DB.prepare("SELECT event_type, COUNT(*) as n FROM analytics_events WHERE created_at > ? GROUP BY event_type ORDER BY n DESC LIMIT 20").bind(o-n*7).all(),t.env.DB.prepare("SELECT emotion, COUNT(*) as n FROM capsules GROUP BY emotion").all()]);return t.json({users:(i==null?void 0:i.n)||0,capsules:(a==null?void 0:a.n)||0,capsules_today:(l==null?void 0:l.n)||0,capsules_week:(s==null?void 0:s.n)||0,events_week:Object.fromEntries((c.results||[]).map(u=>[u.event_type,u.n])),emotions:Object.fromEntries((d.results||[]).map(u=>[u.emotion,u.n]))})});y.get("/api/feed",async t=>{const e=Math.min(parseInt(t.req.query("limit")||"12"),50),{results:r}=await t.env.DB.prepare(`SELECT share_id, title, emotion, orb_color, orb_color_2, orb_pattern, orb_size, rarity, created_at
     FROM capsules WHERE is_public = 1 AND opened = 1
     ORDER BY created_at DESC LIMIT ?`).bind(e).all(),n=(r||[]).map(o=>({shareId:o.share_id,title:o.title,emotion:o.emotion,emotionEmoji:ot[o.emotion],orb:{color:o.orb_color,color2:o.orb_color_2,pattern:o.orb_pattern,size:o.orb_size,rarity:o.rarity},createdAt:o.created_at}));return t.json({items:n})});y.get("/favicon.ico",t=>{const e="<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><defs><radialGradient id='g' cx='35%' cy='30%'><stop offset='0%' stop-color='%23FFD6E8'/><stop offset='100%' stop-color='%23FF8FB1'/></radialGradient></defs><circle cx='32' cy='32' r='26' fill='url(%23g)'/><ellipse cx='24' cy='22' rx='8' ry='5' fill='white' opacity='0.6'/></svg>";return new Response(e,{headers:{"Content-Type":"image/svg+xml","Cache-Control":"public, max-age=86400"}})});y.get("/robots.txt",t=>t.text(`User-agent: *
Allow: /
Disallow: /api/
Sitemap: ${new URL(t.req.url).origin}/sitemap.xml
`));y.get("/sitemap.xml",t=>{const e=new URL(t.req.url).origin;return t.text(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>${e}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>
</urlset>`,200,{"Content-Type":"application/xml"})});y.notFound(t=>t.html(Nt({error:"ページが見つかりませんでした"}),404));y.onError((t,e)=>(console.error("app error",t),e.html(Nt({error:"エラーが発生しました"}),500)));const ge=new Ie,pn=Object.assign({"/src/index.tsx":y});let He=!1;for(const[,t]of Object.entries(pn))t&&(ge.all("*",e=>{let r;try{r=e.executionCtx}catch{}return t.fetch(e.req.raw,e.env,r)}),ge.notFound(e=>{let r;try{r=e.executionCtx}catch{}return t.fetch(e.req.raw,e.env,r)}),He=!0);if(!He)throw new Error("Can't import modules from ['/src/index.ts','/src/index.tsx','/app/server.ts']");export{ge as default};
