(this["webpackJsonptarock-sheet"]=this["webpackJsonptarock-sheet"]||[]).push([[0],{345:function(e,n,t){"use strict";t.r(n);var c,r,a,i,o=t(3),l=t(1),u=t.n(l),s=t(14),j=t.n(s),O=t(384),b=t(404),d=t(58),f=t(405),h=t(190),p=t(10),T=t(24),E=t(16),v=t(11);!function(e){e.PARTY="PARTY",e.TRULL="TRULL",e.FOUR_KING="FOUR_KING",e.CATCH_THE_MAYOR="CATCH_THE_MAYOR",e.CATCH_THE_PAGAT="CATCH_THE_PAGAT",e.ULTI="ULTI",e.UHU="UHU",e.DOUBLE_PARTY="DOUBLE_PARTY",e.VOLAT="VOLAT",e.PHEASANT="PHEASANT",e.PHEASANT_IN_2ND="PHEASANT_IN_2ND",e.EIGHT_TAROCK="EIGHT_TAROCK",e.NINE_TAROCK="NINE_TAROCK",e.FURRY="FURRY",e.CENTRUM="CENTRUM",e.SMALL_BIRD="SMALL_BIRD",e.LARGE_BIRD="LARGE_BIRD",e.CSUZIMA="CSUZIMA",e.KING_ULTI="KING_ULTI",e.KING_UHU="KING_UHU",e.KLOPICZKY="KLOPICZKY"}(r||(r={})),function(e){e.PAGAT="PAGAT",e.EAGLE="EAGLE"}(a||(a={})),function(e){e.HEART="HEART",e.SPADE="SPADE",e.CLUB="CLUB",e.DIAMOND="DIAMOND"}(i||(i={}));var x,C=[a.PAGAT,a.EAGLE],A=[i.CLUB,i.DIAMOND,i.HEART,i.SPADE],y=(c={},Object(p.a)(c,r.PARTY,{score:function(e){return e}}),Object(p.a)(c,r.TRULL,{score:2,silent:!0}),Object(p.a)(c,r.FOUR_KING,{score:2,silent:!0}),Object(p.a)(c,r.CATCH_THE_MAYOR,{score:42,silent:!0}),Object(p.a)(c,r.CATCH_THE_PAGAT,{score:4}),Object(p.a)(c,r.ULTI,{score:10,variants:[].concat(C),silent:!0}),Object(p.a)(c,r.UHU,{score:15,variants:[].concat(C)}),Object(p.a)(c,r.DOUBLE_PARTY,{score:function(e){return 4*e},silent:!0}),Object(p.a)(c,r.VOLAT,{score:function(e){return 6*e},silent:!0}),Object(p.a)(c,r.PHEASANT,{score:50,variants:[].concat(C)}),Object(p.a)(c,r.PHEASANT_IN_2ND,{score:50,variants:[].concat(C)}),Object(p.a)(c,r.EIGHT_TAROCK,{score:1}),Object(p.a)(c,r.NINE_TAROCK,{score:2}),Object(p.a)(c,r.FURRY,{score:25,variants:[].concat(A)}),Object(p.a)(c,r.CENTRUM,{score:10}),Object(p.a)(c,r.SMALL_BIRD,{score:15}),Object(p.a)(c,r.LARGE_BIRD,{score:20}),Object(p.a)(c,r.KING_ULTI,{score:15,variants:[].concat(A)}),Object(p.a)(c,r.KING_UHU,{score:20,variants:[].concat(A)}),Object(p.a)(c,r.CSUZIMA,{score:4}),Object(p.a)(c,r.KLOPICZKY,{score:3}),c),m=function(e){return Object(v.a)({type:e},y[e])},N=function(e){return!0===(null===e||void 0===e?void 0:e.silent)},R=function(e){return function(n){return"function"===typeof n.score?n.score(e):n.score}},I=function(e){return function(n){return((null===n||void 0===n?void 0:n.variants)||[]).includes(e)}},L=t(385),P=t(407),g=t(386),_=t(387),S=t(388),k=t(389),D=t(390),G=t(178),H=function(e){if(e.length<1)return e;var n=e.split(""),t=Object(G.a)(n),c=t[0],r=t.slice(1);return"".concat(c.toUpperCase()).concat(r.join("").toLowerCase())},K=function(e){return e.split("_").map(H).join(" ")};!function(e){e.DECLARER="DECLARER",e.OPPONENT="OPPONENT"}(x||(x={}));var U,w,B=function(e){return e===x.DECLARER?x.OPPONENT:x.DECLARER},Y=function(e){return new Map([[x.DECLARER,"primary"],[x.OPPONENT,"secondary"],[null,"default"]]).get(e)||"default"},V=t(411),X=t(382),M=t(408),F=function(e){var n=e.onChange,t=e.bidType,c=e.selected,r=void 0===c?null:c,a=m(t);return a.variants?Object(o.jsx)(V.a,{name:"variants",onChange:function(e){n(e.target.value)},value:r,children:a.variants.map((function(e){return Object(o.jsx)(X.a,{control:Object(o.jsx)(M.a,{value:e}),label:e})}))}):null},Z=t(378),W=t(383),z=function(e){var n=e.bidType,t=e.onChange,c=e.value,r=e.label,a=m(n);return N(a)?Object(o.jsx)(Z.a,{children:Object(o.jsx)(X.a,{control:Object(o.jsx)(W.a,{onChange:function(e){return t(e.target.checked)},checked:c}),label:r?"Silent":""})}):null},J=Object(O.a)((function(e){return{modal:{display:"flex",alignItems:"center",justifyContent:"center"},card:{backgroundColor:e.palette.background.default,padding:e.spacing(2,4,3)}}})),q=function(e){var n=Object(l.useState)(!1),t=Object(E.a)(n,2),c=t[0],r=t[1],a=Object(l.useState)(null),i=Object(E.a)(a,2),u=i[0],s=i[1],j=Object(l.useState)(void 0),O=Object(E.a)(j,2),b=O[0],d=O[1],f=J(),h=e.bid,p=e.onSubmit,T=function(){s(null),d(void 0)},v=function(e){r(!1),T(),p({bidType:h.type,taker:e,silent:b,bidVariant:u})},C=!h.variants||null!==u&&I(u)(h);return Object(o.jsxs)(o.Fragment,{children:[Object(o.jsx)(L.a,{variant:"outlined",color:"primary",onClick:function(){return r(!0)},children:K(h.type)}),Object(o.jsx)(P.a,{open:c,className:f.modal,onClose:function(){T(),r(!1)},children:Object(o.jsxs)(g.a,{className:f.card,children:[Object(o.jsx)(_.a,{title:K(h.type)}),Object(o.jsxs)(S.a,{children:[Object(o.jsx)(F,{bidType:h.type,onChange:s,selected:u}),Object(o.jsx)(z,{bidType:h.type,onChange:d,label:!0})]}),Object(o.jsxs)(k.a,{children:[Object(o.jsx)(L.a,{color:"primary",variant:"contained",onClick:v.bind(null,x.DECLARER),disabled:!C,children:"Declarer"}),Object(o.jsx)(L.a,{color:"secondary",variant:"contained",onClick:v.bind(null,x.OPPONENT),disabled:!C,children:"Opponent"}),Object(o.jsx)(L.a,{variant:"contained",onClick:function(){return r(!1)},children:"Cancel"})]})]})})]})},Q=function(e){var n=e.bids,t=e.onAddContract;return Object(o.jsx)(D.a,{container:!0,spacing:1,children:n.map((function(e){return Object(o.jsx)(D.a,{item:!0,children:Object(o.jsx)(q,{bid:e,onSubmit:t})},e.type)}))})},$=t(183),ee=t.n($),ne=t(37),te=t.n(ne),ce=(t(184),t(185),t(186),function(e){var n=e.silent,t=e.bidType,c=e.bidVariant,r=e.contra,a=m(t);if(n&&!N(a))throw new Error("".concat(a.type," can not be silent."));if(c&&!I(c)(a))throw new Error("".concat(a.type," does not have ").concat(c," variant."));if(!(Math.log2(r)%1===0))throw new Error("Contra must be power of two, but ".concat(r," given."));if(r<1)throw new Error("Contra must be greater than 1, but ".concat(r," given."))}),re=function(e){var n=e.bidType,t=e.taker,c=e.partyScore,r=void 0===c?null:c,a=e.silent,i=void 0!==a&&a,o=e.bidVariant,l=void 0===o?null:o,u=e.winByTaker,s={bidType:n,bidVariant:l,contra:1,silent:i,winByTaker:void 0===u?null:u,taker:t,bidBaseScore:null!==r?te()(m,R(r))(n):null};return ce(s),s},ae=function(e){var n=e.winByTaker,t=e.bidBaseScore,c=e.contra,r=e.silent;return null===n||null===t?null:(n?1:-1)*t*(r?.5:c)};r.PARTY,r.DOUBLE_PARTY,r.VOLAT;!function(e){e.KLOPICZKY="KLOPICZKY",e.TOOK_THREE="TOOK_THREE",e.TOOK_TWO="TOOK_TWO",e.TOOK_ONE="TOOK_ONE",e.SOLO="SOLO"}(w||(w={}));var ie,oe=(U={},Object(p.a)(U,w.TOOK_THREE,1),Object(p.a)(U,w.TOOK_TWO,2),Object(p.a)(U,w.TOOK_ONE,3),Object(p.a)(U,w.SOLO,4),Object(p.a)(U,w.KLOPICZKY,0),U),le=function(){var e,n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return{contracts:[],declarers:[],opponents:[],partyScoreType:n.partyScoreType||null,called_tarock:n.called_tarock||null,scores:(e={},Object(p.a)(e,x.DECLARER,null),Object(p.a)(e,x.OPPONENT,null),e)}},ue=function(e){var n=be(e);return Object(v.a)(Object(v.a)({},e),{},{scores:Object(v.a)({},n)})},se=function(e){return function(n){var t,c=void 0===e.partyScoreType?n.contracts:n.contracts.map((t=oe[e.partyScoreType],function(e){return Object(v.a)(Object(v.a)({},e),{},{bidBaseScore:te()(m,R(t))(e.bidType)})}));return ue(Object(v.a)(Object(v.a)({},n),{},{contracts:Object(T.a)(c)},e))}},je=function(e){return function(n){var t=(null===e||void 0===e?void 0:e.partyScoreType)?oe[null===e||void 0===e?void 0:e.partyScoreType]:null,c=re(Object(v.a)(Object(v.a)({},n),{},{partyScore:t}));return ue(Object(v.a)(Object(v.a)({},e),{},{contracts:[].concat(Object(T.a)(e.contracts),[c])}))}},Oe=function(e){return Object(v.a)(Object(v.a)({},e),{},{contracts:[]})},be=function(e){var n;return e.contracts.reduce((function(e,n){var t,c=ae(n);if(null===c)return e;var r=function(e,n){return null===e?n:null===n?e:n+e},a=n.taker,i=B(a);return Object(v.a)(Object(v.a)({},e),{},(t={},Object(p.a)(t,a,r(e[a],c)),Object(p.a)(t,i,r(e[i],null===c?null:-1*c)),t))}),(n={},Object(p.a)(n,x.DECLARER,null),Object(p.a)(n,x.OPPONENT,null),n))},de=t(410),fe=t(391),he=t(392),pe=t(346),Te=t(409),Ee=t(393),ve=t(394),xe=t(395),Ce=t(396),Ae=t(397),ye=t(398),me=t(92),Ne=t(126),Re=t.n(Ne),Ie=function(e){var n=e.contract,t=e.onChange,c=Object(l.useState)(!1),r=Object(E.a)(c,2),a=r[0],i=r[1],u=function(){return i(!1)};return Object(o.jsxs)(o.Fragment,{children:[Object(o.jsx)(L.a,{onClick:function(){return i(!0)},children:K(n.bidVariant||"")}),Object(o.jsxs)(de.a,{open:a,onClose:u,children:[Object(o.jsx)(fe.a,{children:Object(o.jsx)(F,{onChange:function(e){t(e),u()},selected:n.bidVariant,bidType:n.bidType})}),Object(o.jsx)(he.a,{children:Object(o.jsx)(L.a,{onClick:u,children:"Cancel"})})]})]})};!function(e){e.DELETE="DELETE",e.CHANGE="CHANGE"}(ie||(ie={}));var Le=[{field:"bidType",headerName:"Bid",valueGetter:function(e){return K(e.bidType)}},{field:"bidVariant",headerName:"Variant",valueGetter:function(e,n){return Object(o.jsx)(Ie,{contract:e,onChange:function(e){return n&&n(ie.CHANGE,e)}})}},{field:"taker",headerName:"Taker",valueGetter:function(e,n){var t=B(e.taker),c=Y(e.taker);return Object(o.jsx)(L.a,{color:c,onClick:function(){return n&&n(ie.CHANGE,t)},children:e.taker})}},{field:"silent",headerName:"Silent",valueGetter:function(e,n){return Object(o.jsx)(z,{bidType:e.bidType,onChange:function(e){return n&&n(ie.CHANGE,e)},value:e.silent})}},{field:"bidBaseScore",headerName:"Base Score"},{headerName:"Contra",field:"contra",valueGetter:function(e,n){var t=function(e){return n&&n(ie.CHANGE,e)};return Object(o.jsxs)(o.Fragment,{children:[Object(o.jsx)(d.a,{component:!0===e.silent?"s":"span",color:!0===e.silent?"textPrimary":"textSecondary",children:e.contra}),Object(o.jsx)(pe.a,{title:"Double",onClick:function(){return t(2*e.contra)},disabled:e.silent,children:Object(o.jsx)(me.b,{})}),Object(o.jsx)(pe.a,{title:"Divide by 2",onClick:function(){return e.contra>1&&t(e.contra/2)},disabled:1===e.contra||e.silent,children:Object(o.jsx)(me.a,{})})]})}},{field:"winByTaker",headerName:"Win by the Taker?",valueGetter:function(e,n){var t=e.winByTaker,c=e.taker,r=!0===t?"Won by the Taker!":!1===t?"Lose by the Taker!":"Still unknown / Not count in final score...";return Object(o.jsx)(Te.a,{title:r,checked:!0===t,indeterminate:null===t,onClick:function(){var e=null===t||!0!==t&&null;n&&n(ie.CHANGE,e)},color:c===x.DECLARER?"primary":"secondary"})}},{field:"takerScore",headerName:"Taker score",valueGetter:function(e){return Object(o.jsx)(d.a,{variant:"button",color:e.taker===x.DECLARER?"primary":"secondary",children:ae(e)})}},{field:"actions",headerName:" ",valueGetter:function(e,n){return Object(o.jsx)(pe.a,{title:"Remove",onClick:function(){return n&&n(ie.DELETE,null)},children:Object(o.jsx)(me.c,{})})}}],Pe=function(e,n){return e in n},ge=function(e){var n=e.contracts,t=e.onChange,c=e.onDelete;function r(e,n,r,a){if(r===ie.DELETE)return c(e);if(r===ie.CHANGE&&null!==n)return t(e,n,a);throw new Error("Invalid if ACTION_TYPE (".concat(r,") is CHANGE the field can not be null."))}return Object(o.jsx)(Ee.a,{children:Object(o.jsxs)(ve.a,{children:[Object(o.jsx)(xe.a,{children:Object(o.jsx)(Ce.a,{children:Le.map((function(e,n){return Object(o.jsxs)(Ae.a,{children:[" ",e.headerName," "]},n)}))})}),Object(o.jsx)(ye.a,{children:n.map((function(e,n){return Object(o.jsx)(Ce.a,{children:Le.map((function(t,c){return Object(o.jsx)(Ae.a,{children:Pe(t.field,e)?t.valueGetter?t.valueGetter(e,Re()(r)(n)(t.field)):e[t.field]:t.valueGetter?t.valueGetter(e,Re()(r)(n)(null)):" "},c)}))},n)}))})]})})},_e=t(399),Se=t(400),ke=t(406),De=t(413),Ge=t(347),He=["_None_"].concat(Object(T.a)(Object.keys({XX:"XX",XIX:"XIX",XVIII:"XVIII",XVII:"XVII",XVI:"XVI",XV:"XV",XIV:"XIV",XIII:"XIII",XII:"XII"}))),Ke=Object.keys(oe),Ue=function(e){var n=e.game,t=e.onChange;return Object(o.jsxs)(D.a,{container:!0,spacing:3,alignContent:"space-around",children:[Object(o.jsx)(D.a,{item:!0,children:Object(o.jsxs)(_e.a,{children:[Object(o.jsx)(Se.a,{id:"called-tarock-selector",children:"Called"}),Object(o.jsx)(ke.a,{value:n.called_tarock||"_None_",onChange:function(e){t("called_tarock",e.target.value)},labelId:"called-tarock-selector",children:He.map((function(e){return Object(o.jsx)(De.a,{value:e,children:"_None_"===e?"None":e},e)}))})]})}),Object(o.jsx)(D.a,{item:!0,children:Object(o.jsxs)(_e.a,{component:"fieldset",children:[Object(o.jsx)(Ge.a,{component:"legend",children:"Party Score"}),Object(o.jsx)(V.a,{row:!0,value:n.partyScoreType,onChange:function(e){t("partyScoreType",e.target.value)},children:Ke.map((function(e){return Object(o.jsx)(X.a,{value:e,control:Object(o.jsx)(M.a,{}),label:K(e)},e)}))})]})})]})},we=t(187),Be=t.n(we),Ye=t(414),Ve=function(e){var n=e.game.scores;return Object(o.jsxs)(D.a,{container:!0,direction:"column",children:[Object(o.jsxs)(D.a,{item:!0,container:!0,alignItems:"center",spacing:1,children:[Object(o.jsx)(D.a,{item:!0,children:Object(o.jsxs)(d.a,{color:"primary",display:"inline",variant:"h6",children:["Declarers:"," "]})}),Object(o.jsx)(D.a,{item:!0,children:null!==n[x.DECLARER]?Object(o.jsx)(Ye.a,{color:"primary",size:"small",variant:"outlined",label:n[x.DECLARER]}):null})]}),Object(o.jsxs)(D.a,{item:!0,container:!0,alignItems:"center",spacing:1,children:[Object(o.jsx)(D.a,{item:!0,children:Object(o.jsxs)(d.a,{color:"secondary",display:"inline",variant:"h6",children:["Opponents:"," "]})}),Object(o.jsx)(D.a,{item:!0,children:null!==n[x.OPPONENT]?Object(o.jsx)(Ye.a,{color:"secondary",size:"small",variant:"outlined",label:n[x.OPPONENT]}):null})]})]})},Xe=t(403),Me=t(415),Fe=function(e){var n=e.player,t=e.playerType,c=e.onRemove,r=e.onChange,a=Y(t);return Object(o.jsx)(o.Fragment,{children:Object(o.jsx)(Ye.a,{color:a,label:n,variant:"default",onDelete:function(){return c(n)},onClick:function(){return r(n,function(e){return new Map([[x.DECLARER,x.OPPONENT],[x.OPPONENT,null],[null,x.DECLARER]]).get(e)||null}(t))}})})},Ze=function(e){var n=e.open,t=e.onAdd,c=e.onClose,r=Object(l.useState)(""),a=Object(E.a)(r,2),i=a[0],u=a[1];return Object(o.jsxs)(de.a,{open:n,onClose:function(){u(""),c()},children:[Object(o.jsx)(Xe.a,{children:"Add Player"}),Object(o.jsx)(fe.a,{children:Object(o.jsx)("form",{onSubmit:function(e){e.preventDefault(),t(i),u("")},children:Object(o.jsx)(Me.a,{autoFocus:!0,margin:"dense",label:"Player Name",value:i,onChange:function(e){u(e.target.value)}})})})]})},We=function(e){var n=e.players,t=e.onPlayerAdd,c=e.onPlayerChange,r=e.onPlayerRemove,a=e.game,i=Object(l.useState)(!1),u=Object(E.a)(i,2),s=u[0],j=u[1],O=function(e,n,t){return e.map((function(e){return{player:e,playerType:t.includes(e)?x.OPPONENT:n.includes(e)?x.DECLARER:null}}))}(n,a.declarers,a.opponents);return Object(o.jsxs)(D.a,{container:!0,spacing:3,children:[Object(o.jsx)(Ze,{open:s,onAdd:function(e){j(!1),t(e)},onClose:function(){j(!1)}}),Object(o.jsx)(D.a,{item:!0,children:Object(o.jsx)(L.a,{variant:"contained",onClick:function(){return j(!0)},children:"Add Player"})}),Object(o.jsx)(D.a,{item:!0,children:O.map((function(e){var n=e.player,t=e.playerType;return Object(o.jsx)(Fe,{onChange:c,onRemove:r,player:n,playerType:t},n)}))})]})},ze=t(127),Je=t.n(ze),qe=t(188),Qe=t.n(qe),$e=t(189),en=t.n($e),nn=function(e){var n=e.opponents.map((function(n){return[n,e.scores[x.OPPONENT]||null]})),t=e.declarers.map((function(n){return[n,e.scores[x.DECLARER]||null]}));return Object(v.a)(Object(v.a)({},Je()(n)),Je()(t))},tn=function(e){return void 0!==e&&null!==e},cn=function(e,n){return(e=tn(e)?e:0)+(n=tn(n)?n:0)},rn=function(e){return function(n){return en()(function(e){return function(n){return(n=tn(n)?n:0)+e}}(e))(n)}},an=function(e){var n=e.gameScoreList,t=function(e){var n=e.reduce((function(e,n){return Object.keys(n).forEach((function(n){return e.add(n)})),e}),new Set);return Object(T.a)(n.values())}(n),c=rn(100)(function(e){return Qe.a.apply(void 0,[{}].concat(Object(T.a)(e),[cn]))}(n));return Object(o.jsx)(Ee.a,{children:Object(o.jsxs)(ve.a,{children:[Object(o.jsx)(xe.a,{children:Object(o.jsxs)(Ce.a,{children:[Object(o.jsx)(Ae.a,{children:"Game"}),t.map((function(e){return Object(o.jsx)(Ae.a,{children:"".concat(e," (").concat(void 0===c[e]?"":c[e],")")},e)}))]})}),Object(o.jsx)(ye.a,{children:n.map((function(e,n){return Object(o.jsxs)(Ce.a,{children:[Object(o.jsx)(Ae.a,{children:n+1}),t.map((function(n){return Object(o.jsx)(Ae.a,{children:void 0===e[n]?" ":e[n]},n)}))]},n)}))})]})})},on=ee()((function(e){return e.type}))(Object.keys(r).map((function(e){return m(e)}))),ln=function(){var e=Object(l.useState)(le()),n=Object(E.a)(e,2),t=n[0],c=n[1],a=Object(l.useState)([]),i=Object(E.a)(a,2),u=i[0],s=i[1],j=Object(l.useState)([]),O=Object(E.a)(j,2),b=O[0],d=O[1];return Object(o.jsxs)(D.a,{container:!0,spacing:3,direction:"column",children:[Object(o.jsx)(D.a,{item:!0,children:Object(o.jsxs)(D.a,{item:!0,container:!0,spacing:1,direction:"row",children:[Object(o.jsx)(D.a,{item:!0,children:Object(o.jsx)(L.a,{variant:"contained",onClick:function(){return c(le())},children:"Reset Game"})}),Object(o.jsx)(D.a,{item:!0,children:Object(o.jsx)(Ue,{game:t,onChange:function(e,n){if("partyScoreType"===e){var a=(o=n,[w.TOOK_THREE,w.TOOK_TWO,w.TOOK_ONE,w.SOLO].includes(o)?re({bidType:r.PARTY,taker:x.DECLARER}):re({bidType:r.KLOPICZKY,taker:x.DECLARER})),i=te()(Oe,function(e){return function(n){return je(n)(e)}}(a),se(Object(p.a)({},e,n)))(t);c(i)}else c(se(Object(p.a)({},e,n))(t));var o}})})]})}),Object(o.jsx)(D.a,{item:!0,children:Object(o.jsx)(We,{players:u,game:t,onPlayerAdd:function(e){return s((function(n){return Be()([].concat(Object(T.a)(n),[e]))}))},onPlayerRemove:function(e){return s((function(n){return n.filter((function(n){return n!==e}))}))},onPlayerChange:function(e,n){c(null===n?function(e){return function(n){return Object(v.a)(Object(v.a)({},n),{},{opponents:n.opponents.filter((function(n){return n!==e})),declarers:n.declarers.filter((function(n){return n!==e}))})}}(e)(t):function(e,n){return function(t){var c,r=n===x.DECLARER?"declarers":"opponents",a=n===x.OPPONENT?"declarers":"opponents";return t[r].includes(e)?Object(v.a)({},t):Object(v.a)(Object(v.a)({},t),{},(c={},Object(p.a)(c,r,[].concat(Object(T.a)(t[r]),[e])),Object(p.a)(c,a,t[a].filter((function(n){return n!==e}))),c))}}(e,n)(t))}})}),Object(o.jsxs)(D.a,{item:!0,container:!0,children:[Object(o.jsx)(D.a,{item:!0,children:Object(o.jsx)(Ve,{game:t})}),Object(o.jsx)(D.a,{item:!0,children:Object(o.jsx)(L.a,{variant:"contained",onClick:function(){d([].concat(Object(T.a)(b),[nn(t)])),c(le())},children:"Save Scores"})})]}),Object(o.jsx)(D.a,{item:!0,children:Object(o.jsx)(Q,{bids:on,onAddContract:function(e){return c(te()(re,je(t))(e))}})}),Object(o.jsx)(D.a,{item:!0,children:Object(o.jsx)(ge,{contracts:null===t||void 0===t?void 0:t.contracts,onChange:function(e,n,r){var a;c(te()((a=Object(p.a)({},n,r),function(e){var n=Object(v.a)(Object(v.a)({},e),a);return ce(n),n}),function(e){return function(n){return function(t){return ue(Object(v.a)(Object(v.a)({},e),{},{contracts:e.contracts.map((function(e,c){return c===n?Object(v.a)({},t):e}))}))}}}(t)(e))(t.contracts[e]))},onDelete:function(e){return c(function(e){return function(n){return ue(Object(v.a)(Object(v.a)({},e),{},{contracts:e.contracts.filter((function(e,t){return t!==n}))}))}}(t)(e))}})}),Object(o.jsx)(D.a,{item:!0,children:Object(o.jsx)(an,{gameScoreList:b})})]})},un=Object(O.a)((function(e){return{container:{padding:e.spacing(4)}}}));var sn=function(){var e=un();return Object(o.jsxs)(o.Fragment,{children:[Object(o.jsx)(b.a,{position:"static",children:Object(o.jsxs)(d.a,{variant:"h2",children:[Object(o.jsx)(h.a,{color:"red"})," Tarock Sheet"]})}),Object(o.jsx)(f.a,{className:e.container,children:Object(o.jsx)(ln,{})})]})},jn=function(e){e&&e instanceof Function&&t.e(3).then(t.bind(null,417)).then((function(n){var t=n.getCLS,c=n.getFID,r=n.getFCP,a=n.getLCP,i=n.getTTFB;t(e),c(e),r(e),a(e),i(e)}))};j.a.render(Object(o.jsx)(u.a.StrictMode,{children:Object(o.jsx)(sn,{})}),document.getElementById("root")),jn()}},[[345,1,2]]]);
//# sourceMappingURL=main.c97ef1f4.chunk.js.map