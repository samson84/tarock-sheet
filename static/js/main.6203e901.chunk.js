(this["webpackJsonptarock-sheet"]=this["webpackJsonptarock-sheet"]||[]).push([[0],{343:function(e,n,t){"use strict";t.r(n);var c,r,a,i,o=t(3),l=t(1),u=t.n(l),s=t(14),j=t.n(s),O=t(382),b=t(402),d=t(58),f=t(403),h=t(188),p=t(12),T=t(10),v=t(24),x=t(16);!function(e){e.PARTY="PARTY",e.TRULL="TRULL",e.FOUR_KING="FOUR_KING",e.CATCH_THE_MAYOR="CATCH_THE_MAYOR",e.CATCH_THE_PAGAT="CATCH_THE_PAGAT",e.ULTI="ULTI",e.UHU="UHU",e.DOUBLE_PARTY="DOUBLE_PARTY",e.VOLAT="VOLAT",e.PHEASANT="PHEASANT",e.PHEASANT_IN_2ND="PHEASANT_IN_2ND",e.EIGHT_TAROCK="EIGHT_TAROCK",e.NINE_TAROCK="NINE_TAROCK",e.FURRY="FURRY",e.CENTRUM="CENTRUM",e.SMALL_BIRD="SMALL_BIRD",e.LARGE_BIRD="LARGE_BIRD",e.CSUZIMA="CSUZIMA",e.KING_ULTI="KING_ULTI",e.KING_UHU="KING_UHU",e.KLOPICZKY="KLOPICZKY"}(r||(r={})),function(e){e.PAGAT="PAGAT",e.EAGLE="EAGLE"}(a||(a={})),function(e){e.HEART="HEART",e.SPADE="SPADE",e.CLUB="CLUB",e.DIAMOND="DIAMOND"}(i||(i={}));var E,C=[a.PAGAT,a.EAGLE],A=[i.CLUB,i.DIAMOND,i.HEART,i.SPADE],m=(c={},Object(T.a)(c,r.PARTY,{score:function(e){return e}}),Object(T.a)(c,r.TRULL,{score:2,silent:!0}),Object(T.a)(c,r.FOUR_KING,{score:2,silent:!0}),Object(T.a)(c,r.CATCH_THE_MAYOR,{score:42,silent:!0}),Object(T.a)(c,r.CATCH_THE_PAGAT,{score:4}),Object(T.a)(c,r.ULTI,{score:10,variants:[].concat(C),silent:!0}),Object(T.a)(c,r.UHU,{score:15,variants:[].concat(C)}),Object(T.a)(c,r.DOUBLE_PARTY,{score:function(e){return 4*e},silent:!0}),Object(T.a)(c,r.VOLAT,{score:function(e){return 6*e},silent:!0}),Object(T.a)(c,r.PHEASANT,{score:50,variants:[].concat(C)}),Object(T.a)(c,r.PHEASANT_IN_2ND,{score:50,variants:[].concat(C)}),Object(T.a)(c,r.EIGHT_TAROCK,{score:1}),Object(T.a)(c,r.NINE_TAROCK,{score:2}),Object(T.a)(c,r.FURRY,{score:25,variants:[].concat(A)}),Object(T.a)(c,r.CENTRUM,{score:10}),Object(T.a)(c,r.SMALL_BIRD,{score:15}),Object(T.a)(c,r.LARGE_BIRD,{score:20}),Object(T.a)(c,r.KING_ULTI,{score:15,variants:[].concat(A)}),Object(T.a)(c,r.KING_UHU,{score:20,variants:[].concat(A)}),Object(T.a)(c,r.CSUZIMA,{score:4}),Object(T.a)(c,r.KLOPICZKY,{score:3}),c),y=function(e){return Object(p.a)({type:e},m[e])},N=function(e){return!0===(null===e||void 0===e?void 0:e.silent)},R=function(e){return function(n){return"function"===typeof n.score?n.score(e):n.score}},I=function(e){return function(n){return((null===n||void 0===n?void 0:n.variants)||[]).includes(e)}},g=t(383),L=t(405),P=t(384),_=t(385),S=t(386),k=t(387),D=t(388),G=t(177),H=function(e){if(e.length<1)return e;var n=e.split(""),t=Object(G.a)(n),c=t[0],r=t.slice(1);return"".concat(c.toUpperCase()).concat(r.join("").toLowerCase())},U=function(e){return e.split("_").map(H).join(" ")};!function(e){e.DECLARER="DECLARER",e.OPPONENT="OPPONENT"}(E||(E={}));var K,w,B=function(e){return e===E.DECLARER?E.OPPONENT:E.DECLARER},V=function(e){return new Map([[E.DECLARER,"primary"],[E.OPPONENT,"secondary"],[null,"default"]]).get(e)||"default"},X=t(409),Y=t(380),M=t(406),F=function(e){var n=e.onChange,t=e.bidType,c=e.selected,r=void 0===c?null:c,a=y(t);return a.variants?Object(o.jsx)(X.a,{name:"variants",onChange:function(e){n(e.target.value)},value:r,children:a.variants.map((function(e){return Object(o.jsx)(Y.a,{control:Object(o.jsx)(M.a,{value:e}),label:e})}))}):null},Z=t(376),W=t(381),z=function(e){var n=e.bidType,t=e.onChange,c=e.value,r=e.label,a=y(n);return N(a)?Object(o.jsx)(Z.a,{children:Object(o.jsx)(Y.a,{control:Object(o.jsx)(W.a,{onChange:function(e){return t(e.target.checked)},checked:c}),label:r?"Silent":""})}):null},J=Object(O.a)((function(e){return{modal:{display:"flex",alignItems:"center",justifyContent:"center"},card:{backgroundColor:e.palette.background.default,padding:e.spacing(2,4,3)}}})),q=function(e){var n=Object(l.useState)(!1),t=Object(x.a)(n,2),c=t[0],r=t[1],a=Object(l.useState)(null),i=Object(x.a)(a,2),u=i[0],s=i[1],j=Object(l.useState)(void 0),O=Object(x.a)(j,2),b=O[0],d=O[1],f=J(),h=e.bid,p=e.onSubmit,T=function(){s(null),d(void 0)},v=function(e){r(!1),T(),p({bidType:h.type,taker:e,silent:b,bidVariant:u})},C=!h.variants||null!==u&&I(u)(h);return Object(o.jsxs)(o.Fragment,{children:[Object(o.jsx)(g.a,{variant:"outlined",color:"primary",onClick:function(){return r(!0)},children:U(h.type)}),Object(o.jsx)(L.a,{open:c,className:f.modal,onClose:function(){T(),r(!1)},children:Object(o.jsxs)(P.a,{className:f.card,children:[Object(o.jsx)(_.a,{title:U(h.type)}),Object(o.jsxs)(S.a,{children:[Object(o.jsx)(F,{bidType:h.type,onChange:s,selected:u}),Object(o.jsx)(z,{bidType:h.type,onChange:d,label:!0})]}),Object(o.jsxs)(k.a,{children:[Object(o.jsx)(g.a,{color:"primary",variant:"contained",onClick:v.bind(null,E.DECLARER),disabled:!C,children:"Declarer"}),Object(o.jsx)(g.a,{color:"secondary",variant:"contained",onClick:v.bind(null,E.OPPONENT),disabled:!C,children:"Opponent"}),Object(o.jsx)(g.a,{variant:"contained",onClick:function(){return r(!1)},children:"Cancel"})]})]})})]})},Q=function(e){var n=e.bids,t=e.onAddContract;return Object(o.jsx)(D.a,{container:!0,spacing:1,children:n.map((function(e){return Object(o.jsx)(D.a,{item:!0,children:Object(o.jsx)(q,{bid:e,onSubmit:t})},e.type)}))})},$=t(182),ee=t.n($),ne=t(45),te=t.n(ne),ce=(t(183),t(184),t(185),function(e){var n=e.silent,t=e.bidType,c=e.bidVariant,r=e.contra,a=y(t);if(n&&!N(a))throw new Error("".concat(a.type," can not be silent."));if(c&&!I(c)(a))throw new Error("".concat(a.type," does not have ").concat(c," variant."));if(!(Math.log2(r)%1===0))throw new Error("Contra must be power of two, but ".concat(r," given."));if(r<1)throw new Error("Contra must be greater than 1, but ".concat(r," given."))}),re=function(e){var n=e.bidType,t=e.taker,c=e.partyScore,r=void 0===c?null:c,a=e.silent,i=void 0!==a&&a,o=e.bidVariant,l=void 0===o?null:o,u=e.winByTaker,s={bidType:n,bidVariant:l,contra:1,silent:i,winByTaker:void 0===u?null:u,taker:t,bidBaseScore:null!==r?te()(y,R(r))(n):null};return ce(s),s},ae=function(e){var n=e.winByTaker,t=e.bidBaseScore,c=e.contra,r=e.silent;return null===n||null===t?null:(n?1:-1)*t*(r?.5:c)};r.PARTY,r.DOUBLE_PARTY,r.VOLAT;!function(e){e.KLOPICZKY="KLOPICZKY",e.TOOK_THREE="TOOK_THREE",e.TOOK_TWO="TOOK_TWO",e.TOOK_ONE="TOOK_ONE",e.SOLO="SOLO"}(w||(w={}));var ie,oe=(K={},Object(T.a)(K,w.TOOK_THREE,1),Object(T.a)(K,w.TOOK_TWO,2),Object(T.a)(K,w.TOOK_ONE,3),Object(T.a)(K,w.SOLO,4),Object(T.a)(K,w.KLOPICZKY,0),K),le=function(){var e,n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return{contracts:[],declarers:[],opponents:[],partyScoreType:n.partyScoreType||null,called_tarock:n.called_tarock||null,scores:(e={},Object(T.a)(e,E.DECLARER,null),Object(T.a)(e,E.OPPONENT,null),e)}},ue=function(e){var n=je(e);return Object(p.a)(Object(p.a)({},e),{},{scores:Object(p.a)({},n)})},se=function(e){return function(n){var t,c=void 0===e.partyScoreType?n.contracts:n.contracts.map((t=oe[e.partyScoreType],function(e){return Object(p.a)(Object(p.a)({},e),{},{bidBaseScore:te()(y,R(t))(e.bidType)})}));return ue(Object(p.a)(Object(p.a)({},n),{},{contracts:Object(v.a)(c)},e))}},je=function(e){var n;return e.contracts.reduce((function(e,n){var t,c=ae(n);if(null===c)return e;var r=function(e,n){return null===e?n:null===n?e:n+e},a=n.taker,i=B(a);return Object(p.a)(Object(p.a)({},e),{},(t={},Object(T.a)(t,a,r(e[a],c)),Object(T.a)(t,i,r(e[i],null===c?null:-1*c)),t))}),(n={},Object(T.a)(n,E.DECLARER,null),Object(T.a)(n,E.OPPONENT,null),n))},Oe=t(408),be=t(389),de=t(390),fe=t(344),he=t(407),pe=t(391),Te=t(392),ve=t(393),xe=t(394),Ee=t(395),Ce=t(396),Ae=t(90),me=t(126),ye=t.n(me),Ne=function(e){var n=e.contract,t=e.onChange,c=Object(l.useState)(!1),r=Object(x.a)(c,2),a=r[0],i=r[1],u=function(){return i(!1)};return Object(o.jsxs)(o.Fragment,{children:[Object(o.jsx)(g.a,{onClick:function(){return i(!0)},children:U(n.bidVariant||"")}),Object(o.jsxs)(Oe.a,{open:a,onClose:u,children:[Object(o.jsx)(be.a,{children:Object(o.jsx)(F,{onChange:function(e){t(e),u()},selected:n.bidVariant,bidType:n.bidType})}),Object(o.jsx)(de.a,{children:Object(o.jsx)(g.a,{onClick:u,children:"Cancel"})})]})]})};!function(e){e.DELETE="DELETE",e.CHANGE="CHANGE"}(ie||(ie={}));var Re=[{field:"bidType",headerName:"Bid",valueGetter:function(e){return U(e.bidType)}},{field:"bidVariant",headerName:"Variant",valueGetter:function(e,n){return Object(o.jsx)(Ne,{contract:e,onChange:function(e){return n&&n(ie.CHANGE,e)}})}},{field:"taker",headerName:"Taker",valueGetter:function(e,n){var t=B(e.taker),c=V(e.taker);return Object(o.jsx)(g.a,{color:c,onClick:function(){return n&&n(ie.CHANGE,t)},children:e.taker})}},{field:"silent",headerName:"Silent",valueGetter:function(e,n){return Object(o.jsx)(z,{bidType:e.bidType,onChange:function(e){return n&&n(ie.CHANGE,e)},value:e.silent})}},{field:"bidBaseScore",headerName:"Base Score"},{headerName:"Contra",field:"contra",valueGetter:function(e,n){var t=function(e){return n&&n(ie.CHANGE,e)};return Object(o.jsxs)(o.Fragment,{children:[Object(o.jsx)(d.a,{component:!0===e.silent?"s":"span",color:!0===e.silent?"textPrimary":"textSecondary",children:e.contra}),Object(o.jsx)(fe.a,{title:"Double",onClick:function(){return t(2*e.contra)},disabled:e.silent,children:Object(o.jsx)(Ae.b,{})}),Object(o.jsx)(fe.a,{title:"Divide by 2",onClick:function(){return e.contra>1&&t(e.contra/2)},disabled:1===e.contra||e.silent,children:Object(o.jsx)(Ae.a,{})})]})}},{field:"winByTaker",headerName:"Win by the Taker?",valueGetter:function(e,n){var t=e.winByTaker,c=e.taker,r=!0===t?"Won by the Taker!":!1===t?"Lose by the Taker!":"Still unknown / Not count in final score...";return Object(o.jsx)(he.a,{title:r,checked:!0===t,indeterminate:null===t,onClick:function(){var e=null===t||!0!==t&&null;n&&n(ie.CHANGE,e)},color:c===E.DECLARER?"primary":"secondary"})}},{field:"takerScore",headerName:"Taker score",valueGetter:function(e){return Object(o.jsx)(d.a,{variant:"button",color:e.taker===E.DECLARER?"primary":"secondary",children:ae(e)})}},{field:"actions",headerName:" ",valueGetter:function(e,n){return Object(o.jsx)(fe.a,{title:"Remove",onClick:function(){return n&&n(ie.DELETE,null)},children:Object(o.jsx)(Ae.c,{})})}}],Ie=function(e,n){return e in n},ge=function(e){var n=e.contracts,t=e.onChange,c=e.onDelete;function r(e,n,r,a){if(r===ie.DELETE)return c(e);if(r===ie.CHANGE&&null!==n)return t(e,n,a);throw new Error("Invalid if ACTION_TYPE (".concat(r,") is CHANGE the field can not be null."))}return Object(o.jsx)(pe.a,{children:Object(o.jsxs)(Te.a,{children:[Object(o.jsx)(ve.a,{children:Object(o.jsx)(xe.a,{children:Re.map((function(e,n){return Object(o.jsxs)(Ee.a,{children:[" ",e.headerName," "]},n)}))})}),Object(o.jsx)(Ce.a,{children:n.map((function(e,n){return Object(o.jsx)(xe.a,{children:Re.map((function(t,c){return Object(o.jsx)(Ee.a,{children:Ie(t.field,e)?t.valueGetter?t.valueGetter(e,ye()(r)(n)(t.field)):e[t.field]:t.valueGetter?t.valueGetter(e,ye()(r)(n)(null)):" "},c)}))},n)}))})]})})},Le=t(397),Pe=t(398),_e=t(404),Se=t(411),ke=t(345),De=["_None_"].concat(Object(v.a)(Object.keys({XX:"XX",XIX:"XIX",XVIII:"XVIII",XVII:"XVII",XVI:"XVI",XV:"XV",XIV:"XIV",XIII:"XIII",XII:"XII"}))),Ge=Object.keys(oe),He=function(e){var n=e.game,t=e.onChange;return Object(o.jsxs)(D.a,{container:!0,spacing:3,alignContent:"space-around",children:[Object(o.jsx)(D.a,{item:!0,children:Object(o.jsxs)(Le.a,{children:[Object(o.jsx)(Pe.a,{id:"called-tarock-selector",children:"Called"}),Object(o.jsx)(_e.a,{value:n.called_tarock||"_None_",onChange:function(e){t("called_tarock",e.target.value)},labelId:"called-tarock-selector",children:De.map((function(e){return Object(o.jsx)(Se.a,{value:e,children:"_None_"===e?"None":e},e)}))})]})}),Object(o.jsx)(D.a,{item:!0,children:Object(o.jsxs)(Le.a,{component:"fieldset",children:[Object(o.jsx)(ke.a,{component:"legend",children:"Party Score"}),Object(o.jsx)(X.a,{row:!0,value:n.partyScoreType,onChange:function(e){t("partyScoreType",e.target.value)},children:Ge.map((function(e){return Object(o.jsx)(Y.a,{value:e,control:Object(o.jsx)(M.a,{}),label:U(e)},e)}))})]})})]})},Ue=t(186),Ke=t.n(Ue),we=t(412),Be=function(e){var n=e.game.scores;return Object(o.jsxs)(D.a,{container:!0,direction:"column",children:[Object(o.jsxs)(D.a,{item:!0,container:!0,alignItems:"center",spacing:1,children:[Object(o.jsx)(D.a,{item:!0,children:Object(o.jsxs)(d.a,{color:"primary",display:"inline",variant:"h6",children:["Declarers:"," "]})}),Object(o.jsx)(D.a,{item:!0,children:null!==n[E.DECLARER]?Object(o.jsx)(we.a,{color:"primary",size:"small",variant:"outlined",label:n[E.DECLARER]}):null})]}),Object(o.jsxs)(D.a,{item:!0,container:!0,alignItems:"center",spacing:1,children:[Object(o.jsx)(D.a,{item:!0,children:Object(o.jsxs)(d.a,{color:"secondary",display:"inline",variant:"h6",children:["Opponents:"," "]})}),Object(o.jsx)(D.a,{item:!0,children:null!==n[E.OPPONENT]?Object(o.jsx)(we.a,{color:"secondary",size:"small",variant:"outlined",label:n[E.OPPONENT]}):null})]})]})},Ve=t(401),Xe=t(413),Ye=function(e){var n=e.player,t=e.playerType,c=e.onRemove,r=e.onChange,a=V(t);return Object(o.jsx)(o.Fragment,{children:Object(o.jsx)(we.a,{color:a,label:n,variant:"default",onDelete:function(){return c(n)},onClick:function(){return r(n,function(e){return new Map([[E.DECLARER,E.OPPONENT],[E.OPPONENT,null],[null,E.DECLARER]]).get(e)||null}(t))}})})},Me=function(e){var n=e.open,t=e.onAdd,c=e.onClose,r=Object(l.useState)(""),a=Object(x.a)(r,2),i=a[0],u=a[1];return Object(o.jsxs)(Oe.a,{open:n,onClose:function(){u(""),c()},children:[Object(o.jsx)(Ve.a,{children:"Add Player"}),Object(o.jsx)(be.a,{children:Object(o.jsx)("form",{onSubmit:function(e){e.preventDefault(),t(i),u("")},children:Object(o.jsx)(Xe.a,{autoFocus:!0,margin:"dense",label:"Player Name",value:i,onChange:function(e){u(e.target.value)}})})})]})},Fe=function(e){var n=e.players,t=e.onPlayerAdd,c=e.onPlayerChange,r=e.onPlayerRemove,a=e.game,i=Object(l.useState)(!1),u=Object(x.a)(i,2),s=u[0],j=u[1],O=function(e,n,t){return e.map((function(e){return{player:e,playerType:t.includes(e)?E.OPPONENT:n.includes(e)?E.DECLARER:null}}))}(n,a.declarers,a.opponents);return Object(o.jsxs)(D.a,{container:!0,spacing:3,children:[Object(o.jsx)(Me,{open:s,onAdd:function(e){j(!1),t(e)},onClose:function(){j(!1)}}),Object(o.jsx)(D.a,{item:!0,children:Object(o.jsx)(g.a,{variant:"contained",onClick:function(){return j(!0)},children:"Add Player"})}),Object(o.jsx)(D.a,{item:!0,children:O.map((function(e){var n=e.player,t=e.playerType;return Object(o.jsx)(Ye,{onChange:c,onRemove:r,player:n,playerType:t},n)}))})]})},Ze=t(127),We=t.n(Ze),ze=t(187),Je=t.n(ze),qe=function(e){var n=e.opponents.map((function(n){return[n,e.scores[E.OPPONENT]||null]})),t=e.declarers.map((function(n){return[n,e.scores[E.DECLARER]||null]}));return Object(p.a)(Object(p.a)({},We()(n)),We()(t))},Qe=function(e){return void 0!==e&&null!==e},$e=function(e,n){return(e=Qe(e)?e:0)+(n=Qe(n)?n:0)},en=function(e){var n=e.gameScoreList,t=function(e){var n=e.reduce((function(e,n){return Object.keys(n).forEach((function(n){return e.add(n)})),e}),new Set);return Object(v.a)(n.values())}(n),c=function(e){return Je.a.apply(void 0,[{}].concat(Object(v.a)(e),[$e]))}(n);return Object(o.jsx)(pe.a,{children:Object(o.jsxs)(Te.a,{children:[Object(o.jsx)(ve.a,{children:Object(o.jsxs)(xe.a,{children:[Object(o.jsx)(Ee.a,{children:"No."}),t.map((function(e){return Object(o.jsx)(Ee.a,{children:"".concat(e," (").concat(void 0===c[e]?"":c[e],")")},e)}))]})}),Object(o.jsx)(Ce.a,{children:n.map((function(e,n){return Object(o.jsxs)(xe.a,{children:[Object(o.jsx)(Ee.a,{children:n}),t.map((function(n){return Object(o.jsx)(Ee.a,{children:void 0===e[n]?" ":e[n]},n)}))]},n)}))})]})})},nn=ee()((function(e){return e.type}))(Object.keys(r).map((function(e){return y(e)}))),tn=function(){var e=Object(l.useState)(le()),n=Object(x.a)(e,2),t=n[0],c=n[1],r=Object(l.useState)([]),a=Object(x.a)(r,2),i=a[0],u=a[1],s=Object(l.useState)([]),j=Object(x.a)(s,2),O=j[0],b=j[1];return Object(o.jsxs)(D.a,{container:!0,spacing:3,direction:"column",children:[Object(o.jsx)(D.a,{item:!0,children:Object(o.jsxs)(D.a,{item:!0,container:!0,spacing:1,direction:"row",children:[Object(o.jsx)(D.a,{item:!0,children:Object(o.jsx)(g.a,{variant:"contained",onClick:function(){return c(le())},children:"Reset Game"})}),Object(o.jsx)(D.a,{item:!0,children:Object(o.jsx)(He,{game:t,onChange:function(e,n){c(se(Object(T.a)({},e,n))(t))}})})]})}),Object(o.jsx)(D.a,{item:!0,children:Object(o.jsx)(Fe,{players:i,game:t,onPlayerAdd:function(e){return u((function(n){return Ke()([].concat(Object(v.a)(n),[e]))}))},onPlayerRemove:function(e){return u((function(n){return n.filter((function(n){return n!==e}))}))},onPlayerChange:function(e,n){c(null===n?function(e){return function(n){return Object(p.a)(Object(p.a)({},n),{},{opponents:n.opponents.filter((function(n){return n!==e})),declarers:n.declarers.filter((function(n){return n!==e}))})}}(e)(t):function(e,n){return function(t){var c,r=n===E.DECLARER?"declarers":"opponents",a=n===E.OPPONENT?"declarers":"opponents";return t[r].includes(e)?Object(p.a)({},t):Object(p.a)(Object(p.a)({},t),{},(c={},Object(T.a)(c,r,[].concat(Object(v.a)(t[r]),[e])),Object(T.a)(c,a,t[a].filter((function(n){return n!==e}))),c))}}(e,n)(t))}})}),Object(o.jsxs)(D.a,{item:!0,container:!0,children:[Object(o.jsx)(D.a,{item:!0,children:Object(o.jsx)(Be,{game:t})}),Object(o.jsx)(D.a,{item:!0,children:Object(o.jsx)(g.a,{variant:"contained",onClick:function(){b([].concat(Object(v.a)(O),[qe(t)])),c(le())},children:"Save Scores"})})]}),Object(o.jsx)(D.a,{item:!0,children:Object(o.jsx)(Q,{bids:nn,onAddContract:function(e){var n=(null===t||void 0===t?void 0:t.partyScoreType)?oe[null===t||void 0===t?void 0:t.partyScoreType]:null;return c(te()(re,function(e){return function(n){return ue(Object(p.a)(Object(p.a)({},e),{},{contracts:[].concat(Object(v.a)(e.contracts),[n])}))}}(t))(Object(p.a)(Object(p.a)({},e),{},{partyScore:n})))}})}),Object(o.jsx)(D.a,{item:!0,children:Object(o.jsx)(ge,{contracts:null===t||void 0===t?void 0:t.contracts,onChange:function(e,n,r){var a;c(te()((a=Object(T.a)({},n,r),function(e){var n=Object(p.a)(Object(p.a)({},e),a);return ce(n),n}),function(e){return function(n){return function(t){return ue(Object(p.a)(Object(p.a)({},e),{},{contracts:e.contracts.map((function(e,c){return c===n?Object(p.a)({},t):e}))}))}}}(t)(e))(t.contracts[e]))},onDelete:function(e){return c(function(e){return function(n){return ue(Object(p.a)(Object(p.a)({},e),{},{contracts:e.contracts.filter((function(e,t){return t!==n}))}))}}(t)(e))}})}),Object(o.jsx)(D.a,{item:!0,children:Object(o.jsx)(en,{gameScoreList:O})})]})},cn=Object(O.a)((function(e){return{container:{padding:e.spacing(4)}}}));var rn=function(){var e=cn();return Object(o.jsxs)(o.Fragment,{children:[Object(o.jsx)(b.a,{position:"static",children:Object(o.jsxs)(d.a,{variant:"h2",children:[Object(o.jsx)(h.a,{color:"red"})," Tarock Sheet"]})}),Object(o.jsx)(f.a,{className:e.container,children:Object(o.jsx)(tn,{})})]})},an=function(e){e&&e instanceof Function&&t.e(3).then(t.bind(null,415)).then((function(n){var t=n.getCLS,c=n.getFID,r=n.getFCP,a=n.getLCP,i=n.getTTFB;t(e),c(e),r(e),a(e),i(e)}))};j.a.render(Object(o.jsx)(u.a.StrictMode,{children:Object(o.jsx)(rn,{})}),document.getElementById("root")),an()}},[[343,1,2]]]);
//# sourceMappingURL=main.6203e901.chunk.js.map