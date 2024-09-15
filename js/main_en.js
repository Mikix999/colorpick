// reading locale file
const fn = "/EDA/json/en.json";
const locale = await (await fetch(fn)).json();
document.getElementById("btn_yes").textContent  = locale.ui[2]
document.getElementById("btn_no").textContent = locale.ui[3]
document.getElementById("btn_smt").textContent = locale.ui[4]
document.getElementById("es_btn_reset").textContent = locale.ui[5]
document.getElementById("ec_btn_reset").textContent = locale.ui[5]
document.getElementById("g_back_btn").textContent = locale.ui[6]
document.getElementById("em_back_btn").textContent = locale.ui[6]
document.getElementById("g_ok_btn").textContent = locale.ui[7]
document.getElementById("em_ok_btn").textContent = locale.ui[7]

document.getElementById("txt_save").textContent = locale.result[0]
document.getElementById("typo_save").textContent = locale.result[1]
document.getElementById("all_save").textContent = locale.result[2]
document.getElementById("ps_exit").textContent = locale.result[3]
document.getElementById("r_outro").innerHTML = locale.result[4]


for(const emoName of [...document.getElementsByClassName("emoIcon")].map(el=>el.id)){
  document.getElementById(emoName).lastElementChild.innerHTML = locale.emotion[emoName];
}


// initialize
var episode = "";
var emotion = [];
var emoXY = {};
/// window
const wg_div = document.getElementById("window_graph");
const we_div = document.getElementById("window_selEmo");

/// start logo
const sl_div = document.getElementById("start_logo");
const tt_p   = document.getElementById("tt_slogo");
const st_btn = document.getElementById("sb_slogo");
const s_canv = document.getElementById("c_slogo");
const s_ctx  = s_canv.getContext("2d");
const img = new Image();
const tr_time = 700;
  
/// emma
const emma_div = document.getElementById("emma_classic");
const ne_tarea = document.getElementById("nm_emma");
const nu_tarea = document.getElementById("nm_user");
const te_tarea = document.getElementById("ta_emma");
const tu_tarea = document.getElementById("ta_user");
const sbmt_set = document.getElementById("eb_submit");
const chek_set = document.getElementById("eb_check");
const rest_btn = document.getElementById("es_btn_reset");
const sbmt_btn = document.getElementById("btn_smt");
const yes_btn  = document.getElementById("btn_yes");
const no_btn  = document.getElementById("btn_no");
const maxTarea = 400;
const SUDTime = 50; //Screen Update Delay Time
ne_tarea.rows = 20;
te_tarea.rows = 20;
nu_tarea.rows = 7;
tu_tarea.rows = 7;
nu_tarea.value = "> ";
ne_tarea.disabled = true;
nu_tarea.disabled = true;
te_tarea.disabled = true;

//graph
// const wg_div = document.getElementById("w_graph");
const g_canv  = document.getElementById("c_graph");
const g_ctx   = g_canv.getContext("2d");
const g_title = document.getElementById("p_header_graph");
const g_footer= document.getElementById("footer_graph");
const gf_ok   = document.getElementById("g_ok_btn");
const gf_back = document.getElementById("g_back_btn");
g_canv.width  = 800;
g_canv.height = 600;
g_canv.backgroundColor = "black";
const DGTime = 4800;
var tmp_e = [];
var tmp_p = [null, null];
var mouse = [null, null];

//result
const r_canv = document.getElementsByClassName("r_canv");
const r_txts = document.getElementById("txt_save");
const r_typs = document.getElementById("typo_save");
const r_alls = document.getElementById("all_save");
const r_exit = document.getElementById("ps_exit");
// const r_ctx = r_canv.getContext("2d");

/// basic functions
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

eDraw();
await sleep(4000);
startLogo();
// counseling2();
// resultPaint();

// start logo
// tag:start_logo
async function startLogo(){
  const imgPath = "./img/title.png";
  
  img.src = imgPath;

  img.addEventListener("load", slInit);
  window.addEventListener("resize", slDraw);
  st_btn.addEventListener("click", closeSLogo);
}
// next:counseling1

function slInit(){
  slDraw();
  openSLogo();
  eDraw();
}

function slDraw(){
  s_canv.setAttribute('width', window.innerWidth);
  s_canv.setAttribute('height', window.innerHeight);
  drawImageProp(s_ctx, img, 0, 0, s_canv.width, s_canv.height);
}

function openSLogo(){
  img.removeEventListener("load", slInit);
  setTimeout(() => {
    sl_div.style.opacity = 1;
    setTimeout(() => {
      tt_p.style.opacity = 1;
      setTimeout(() => {
        st_btn.style.opacity = 1;
        st_btn.style.pointerEvents = "auto";
      }, (tr_time*2));
    }, tr_time);
  },tr_time/2);
}

function closeSLogo(){
  window.removeEventListener("resize", slDraw);
  st_btn.removeEventListener("click", closeSLogo);
  st_btn.style.pointerEvents = "none";
  setTimeout(() => {
    st_btn.style.opacity = 0;
    tt_p.style.opacity = 0;
    setTimeout(async () => {
      sl_div.style.opacity = 0;
      await sleep(tr_time*2);
      await counseling1();
    }, tr_time*2);
  },tr_time);
}

// source: stack overflow "How to scale image in canvas?"
function drawImageProp(ctx, img, x, y, w, h, offsetX, offsetY) {

  if (arguments.length === 2) {
    x = y = 0;
    w = ctx.canvas.width;
    h = ctx.canvas.height;
  }

  /// default offset is center
  offsetX = offsetX ? offsetX : 0.5;
  offsetY = offsetY ? offsetY : 0.5;

  /// keep bounds [0.0, 1.0]
  if (offsetX < 0) offsetX = 0;
  if (offsetY < 0) offsetY = 0;
  if (offsetX > 1) offsetX = 1;
  if (offsetY > 1) offsetY = 1;

  var iw = img.width,
    ih = img.height,
    r = Math.min(w / iw, h / ih),
    nw = iw * r, /// new prop. width
    nh = ih * r, /// new prop. height
    cx, cy, cw, ch, ar = 1;

  /// decide which gap to fill    
  if (nw < w) ar = w / nw;
  if (nh < h) ar = h / nh;
  nw *= ar;
  nh *= ar;

  /// calc source rectangle
  cw = iw / (nw / w);
  ch = ih / (nh / h);

  cx = (iw - cw) * offsetX;
  cy = (ih - ch) * offsetY;

  /// make sure source rectangle is valid
  if (cx < 0) cx = 0;
  if (cy < 0) cy = 0;
  if (cw > iw) cw = iw;
  if (ch > ih) ch = ih;

  /// fill image in dest. rectangle
  ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);
}

// writing episode
// tag:counseling1

async function counseling1(){
  await sleep(tr_time*3);
  emma_div.style.pointerEvents = "auto";
  emma_div.style.opacity = 1;
  await sleep(SUDTime);
  document.getElementById("emma_tbox").style.opacity=1;
  await sleep(SUDTime);
  document.getElementById("user_tbox").style.opacity=1;
  await sleep(SUDTime);
  nu_tarea.style.opacity=1;
  await sleep(SUDTime);
  tu_tarea.addEventListener("input", maxUTALength);
  tu_tarea.focus();
  await sleep(tr_time);
  
  speechEmma(locale.counseling1[0]);
  await sleep(1600);
  speechEmma(locale.counseling1[1]);
  await sleep(1600);
  speechEmma(locale.counseling1[2]);
  await sleep(1600);
  speechEmma(locale.counseling1[3]);
  await sleep(1600);

  sbmt_set.style.height= "100%";
  tu_tarea.focus();
  emma_div.addEventListener("click", focusUTA);
  sbmt_btn.addEventListener("click", submitUTA);
  rest_btn.addEventListener("click", () => {location.reload()});
  tu_tarea.addEventListener("keydown", chkCtrlEnter);

}

// next counseling2

function focusUTA(){
  tu_tarea.focus();
}

async function submitUTA(){
  tu_tarea.disabled = true;
  sbmt_btn.disabled = true;
  sbmt_set.style.height= 0;
  let ep_tmp = tu_tarea.value;
  if(ep_tmp.length >= 3){
    emma_div.removeEventListener("click", focusUTA);
    sbmt_btn.removeEventListener("click", submitUTA);
    tu_tarea.removeEventListener("keydown", chkCtrlEnter);
    tu_tarea.removeEventListener("input", maxUTALength);

    let te_tmp = te_tarea.value + "\n\n"+ep_tmp+"\n";
    let num = te_tmp.match(/\r\n|\n/g);
    if (num.length >= (te_tarea.rows-3)){
      let di = num.length+3-te_tarea.rows;
      te_tarea.value = te_tarea.value.split('\n').slice(di).join('\n');
    }

    te_tarea.value += "\n\n"+ep_tmp+"\n";
    speechEmma(locale.counseling1[4]);
    await sleep(1600);
    chek_set.style.height = "100%";
    yes_btn.addEventListener("click", epChkYes);
    no_btn.addEventListener("click", epChkNo);
    document.body.addEventListener("keydown", epChkKey);
  }else{
    speechEmma(locale.counseling1[5]);
    await sleep(1600);
    tu_tarea.disabled = false;
    sbmt_btn.disabled = false;
    sbmt_set.style.height= "100%";
    tu_tarea.focus();
  }
}

function maxUTALength(){
  let num = tu_tarea.value.match(/\r\n|\n/g);
  let len = tu_tarea.value.length;
  if (len > maxTarea){
    tu_tarea.value = tu_tarea.value.substr(0, maxTarea);
  }else if(num != null){
    if(num.length >= tu_tarea.rows){
      tu_tarea.value = tu_tarea.value.substr(0, len-1);
    }
  }
}

// source: git "KacperKozak/ctrl-enter.js"
function chkCtrlEnter(e){
  if(e.key === "Enter" && (e.metaKey || e.ctrlKey)) {submitUTA();}
}

function epChkKey(e){
  if(e.key === "y"){epChkYes();}
  else if(e.key === "n"){epChkNo();}
}

async function epChkYes(){
  yes_btn.removeEventListener("click", epChkYes);
  no_btn.removeEventListener("click", epChkNo);
  document.body.removeEventListener("keydown", epChkKey);
  chek_set.style.height = 0;
  episode = tu_tarea.value;
  speechEmma(locale.counseling1[6]);
  await sleep(1600);
  speechEmma(locale.counseling1[7]);
  await sleep(1600);
  counseling2();
}

async function epChkNo(){
  yes_btn.removeEventListener("click", epChkYes);
  no_btn.removeEventListener("click", epChkNo);
  document.body.removeEventListener("keydown", epChkKey);
  chek_set.style.height = 0;
  speechEmma(locale.counseling1[8]);
  await sleep(1600);
  tu_tarea.disabled = false;
  sbmt_btn.disabled = false;
  chek_set.style.height = 0;
  sbmt_set.style.height = "100%";
  emma_div.addEventListener("click", focusUTA);
  sbmt_btn.addEventListener("click", submitUTA);
  tu_tarea.addEventListener("keydown", chkCtrlEnter);
  tu_tarea.focus();
}

function speechEmma(lines){
  let str = lines.split("");
  let l = lines.length;
  let i = 0;

  let num = te_tarea.value.match(/\r\n|\n/g);
  if (num != null){
    if (num.length >= (te_tarea.rows-3)){
      let di = num.length+3-te_tarea.rows;
      let del0Col = setInterval(() => {
        if(di==0){
          clearInterval(del0Col);
          return false;
        }
        te_tarea.value = te_tarea.value.split('\n').slice(1).join('\n');
        di--;
      }, SUDTime);
    }
  }
  let type = setInterval(() => {
    if(str[i] == undefined){
      clearInterval(type);
      return false;
    }
    te_tarea.value += str[i];
    i++;
  }, 25);
  te_tarea.value += "\n";
}

// selecting typology
// tag:counseling2
async function counseling2(){
  //仮
  emma_div.style.pointerEvents = "auto";
  emma_div.style.opacity = 1;
  await sleep(SUDTime);
  document.getElementById("emma_tbox").style.opacity=1;
  await sleep(SUDTime);
  document.getElementById("user_tbox").style.opacity=1;
  await sleep(SUDTime);
  nu_tarea.style.opacity=1;
  await sleep(SUDTime);

  speechEmma(locale.counseling2[0]);
  await sleep(1600);
  speechEmma(locale.counseling2[1]);
  await sleep(1600);
  speechEmma(locale.counseling2[2]);
  await sleep(3200);
  emotions();
}

async function emotions(){
  const emos = document.getElementsByClassName("emoIcon");
  const selE = document.getElementById("footer_selEmo");
  const em_OK = document.getElementById("em_ok_btn");
  const em_Back = document.getElementById("em_back_btn");
  we_div.style.opacity = 1;
  
  for(const emoName of [...emos].map(el=>el.id)){
    const e_div = document.getElementById(emoName);
    e_div.style.pointerEvents = "auto";
    e_div.style.opacity = 1;
    await sleep(SUDTime);
  }
  selE.style.opacity = 1;
  em_OK.addEventListener("click", emSelOK);
  em_Back.addEventListener("click", emSelBack);
  em_OK.style.pointerEvents = "auto";
  em_Back.style.pointerEvents = "auto";
}

async function emSelOK(){
  const emos = document.getElementsByClassName("emoIcon");
  const selE = document.getElementById("footer_selEmo");  
  const em_OK = document.getElementById("em_ok_btn");
  const em_Back = document.getElementById("em_back_btn");
  selE.style.opacity = 0;
  selE.style.disabled = true;
  if(emotion.length==0){
    we_div.style.opacity = 0;
    speechEmma("\n"+locale.counseling2[3]);
    await sleep(1600);
    speechEmma(locale.counseling2[4]);
    await sleep(1600);
    we_div.style.opacity = 1;
    selE.style.disabled = false;
    selE.style.opacity = 1;
  }else{
    for(const emoName of [...emos].map(el=>el.id)){
      const e_div = document.getElementById(emoName);
      e_div.style.pointerEvents = "none";
      e_div.style.opacity = 0;
    }
    await sleep(SUDTime);
    em_OK.style.pointerEvents = "none";
    em_OK.removeEventListener("click", emSelOK);
    em_Back.removeEventListener("click", emSelBack);
    we_div.style.opacity = 0;

    emma_div.style.pointerEvents = "none";
    sbmt_set.style.height= 0;
    tu_tarea.disabled = true;
    counseling3();
  }
}
//next counseling3

async function emSelBack(){
  const emos = document.getElementsByClassName("emoIcon");
  const selE = document.getElementById("footer_selEmo");  
  const em_OK = document.getElementById("em_ok_btn");
  for(const emoName of [...emos].map(el=>el.id)){
    const e_div = document.getElementById(emoName);
    e_div.style.pointerEvents = "none";
    e_div.style.opacity = 0;
  }
  selE.style.opacity = 0;
  we_div.style.opacity = 0;
  em_OK.style.pointerEvents = "none";
  speechEmma("\n"+locale.counseling1[5]);
  await sleep(1600);
  emma_div.style.pointerEvents = "auto";
  sbmt_set.style.height= "100%";
  sbmt_btn.disabled = false;
  tu_tarea.disabled = false;
  tu_tarea.focus();
  emma_div.addEventListener("click", focusUTA);
  sbmt_btn.addEventListener("click", submitUTA);
  tu_tarea.addEventListener("keydown", chkCtrlEnter);
}

function eDraw(){
  const emos = document.getElementsByClassName("emoIcon");
  emoXY = {"x":null,"y":null};
  for(const emoName of [...emos].map(el=>el.id)){
    const e_div = document.getElementById(emoName);
    const e_obj = e_div.firstElementChild;
    const e_txt = e_div.lastElementChild;
    e_obj.type= "image/svg+xml";
    e_obj.data = "/EDA/img/emotion/"+emoName+".svg";
    e_div.addEventListener("click", eAdd);
    
  }
}

function eAdd(e){
  if(emotion.length<4){
    if(emotion.includes(e.target.id)!=true){
      eSelected(e.target.id);
    }else{
      eUnselected(e.target.id);
    }
  }else if(emotion.includes(e.target.id)==true){
    eUnselected(e.target.id);
  }
}

function eSelected(id){
  const div = document.getElementById(id);
  const obj = div.firstElementChild;
  const txt = div.lastElementChild;
  const svg = obj.getSVGDocument();
  const sPath = svg.querySelector('path');

  emotion.push(id);
  div.style.backgroundColor = "#99ff9900";
  // sPath.style.fill = "#99ff9955";
  sPath.style.strokeWidth = "1em";
  sPath.style.stroke = "#99ff9955";
}

function eUnselected(id){
  const div = document.getElementById(id);
  const obj = div.firstElementChild;
  const txt = div.lastElementChild;
  const svg = obj.getSVGDocument();
  const sPath = svg.querySelector('path');

  emotion = emotion.filter(emo => !(emo == id));
  div.style.backgroundColor = "#99ff9955";
  // sPath.style.fill = "#99ff9955";
  sPath.style.strokeWidth = 0;
  sPath.style.stroke = "#99ff9900";
}

// selecting points
// tag:counseling3
async function counseling3(){
  tmp_e = emotion;
  speechEmma(locale.counseling3[0]);
  await sleep(1600);
  speechEmma(locale.counseling3[1]);
  await sleep(1600);
  speechEmma(locale.counseling3[2]);
  await sleep(DGTime);
  selectCoord();
}

async function selectCoord(){
  if(tmp_e.length!=0){
    g_title.innerHTML = locale.ui[0]+"<br />"+locale.ui[1]
    wg_div.style.opacity = 1;
    g_canv.style.pointerEvents = "auto";
    gRefresh(g_canv, g_ctx);
    g_canv.addEventListener("mouseup", gMouseUp);
    g_canv.addEventListener("mousemove", gMouseMove);
    gf_ok.addEventListener("click", getCoord);
    gf_back.addEventListener("click", BackEmotion);
    gf_ok.style.pointerEvents = "auto";
    gf_back.style.pointerEvents = "auto";
    await sleep(SUDTime);
    g_footer.style.opacity = 1;
  }
}

async function BackEmotion(){
  gf_ok.style.pointerEvents = "none";
  gf_back.style.pointerEvents = "none";
  g_footer.style.opacity = 0;
  wg_div.style.opacity = 0;
  g_canv.style.pointerEvents = "none";
  g_canv.removeEventListener("mouseup", gMouseUp);
  g_canv.removeEventListener("mousemove", gMouseMove);
  gf_ok.removeEventListener("click", getCoord);
  gf_back.removeEventListener("click", BackEmotion);
  speechEmma(locale.counseling3[5]);
  await sleep(1600);
  speechEmma(locale.counseling3[6]);
  await sleep(1600);
  emotion = [];
  emotions();
}

async function getCoord(){
  gf_ok.style.pointerEvents = "none";
  gf_back.style.pointerEvents = "none";  
  g_footer.style.opacity = 0;
  wg_div.style.opacity = 0;
  g_canv.style.pointerEvents = "none";
  g_canv.removeEventListener("mouseup", gMouseUp);
  g_canv.removeEventListener("mousemove", gMouseMove);
  gf_ok.removeEventListener("click", getCoord);
  if(tmp_p[0] == null){
    speechEmma(locale.counseling3[3]);
    await sleep(1600);
    speechEmma(locale.counseling3[4]);
    await sleep(1600);
    selectCoord();
    return -1;
  }else{
    emoXY = {
      "x":Math.round((tmp_p[0]*200)/g_canv.width )-100, 
      "y":Math.round((tmp_p[1]*200)/g_canv.height)-100
    };
    speechEmma(locale.counseling3[7]);
    await sleep(1600);
    speechEmma(locale.counseling3[8]);
    await sleep(1600);
    speechEmma(locale.counseling3[9]);
    await sleep(1600);
    speechEmma(locale.counseling3[10]);
    await sleep(1600);
    emma_div.style.pointerEvents = "none";
    nu_tarea.style.opacity=0;
    await sleep(SUDTime);
    document.getElementById("user_tbox").style.opacity=0;
    await sleep(SUDTime);
    document.getElementById("emma_tbox").style.opacity=0;
    await sleep(SUDTime);
    emma_div.style.opacity = 1;
    await sleep(SUDTime);
    await sleep(1600);
    resultPaint();
  }
}

//next resultPaint
function gRefresh(canvas, ctx){
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  const cc = "#99ff99";
  const font = "24px 'cp'";
  const ch = canvas.height;
  const cw = canvas.width;
  const x0 = Math.ceil(cw / 2);
  const y0 = Math.ceil(ch / 2);

  ctx.clearRect(0, 0, cw, ch);
  
  // x-line
  ctx.strokeStyle = cc;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, y0);
  ctx.lineTo(cw, y0);
  ctx.stroke();

  // y-line
  ctx.strokeStyle = cc;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x0, 0);
  ctx.lineTo(x0, ch);
  ctx.stroke();

  // Origin
  ctx.fillStyle = cc;
  ctx.beginPath();
  ctx.font = font;
  ctx.textAlign = 'right';
  ctx.fillText('0', x0-10, y0+30, 100);

  // Active
  ctx.fillStyle = cc;
  ctx.beginPath();
  ctx.font = font;
  ctx.textAlign = 'left';
  ctx.fillText('Active', x0+10, 30, 200);

  // Inactive
  ctx.fillStyle = cc;
  ctx.beginPath();
  ctx.font = font;
  ctx.textAlign = 'left';
  ctx.fillText('Inactive', x0+10, ch-20, 200);

  // Positive
  ctx.fillStyle = cc;
  ctx.beginPath();
  ctx.font = font;
  ctx.textAlign = 'right';
  ctx.fillText('Positive', cw-10, y0+30, 200);

  // Negative
  ctx.fillStyle = cc;
  ctx.beginPath();
  ctx.font = font;
  ctx.textAlign = 'left';
  ctx.fillText('Negative', 10, y0+30, 200);

}

function gMouseUp(e){
  gRefresh(g_canv, g_ctx);
  var rect = e.target.getBoundingClientRect();
  tmp_p = [(e.clientX - rect.left), (e.clientY - rect.top)];
  gDrawPoint(tmp_p, 10);
  gDrawPoint(mouse);
}

function gMouseMove(e){
  gRefresh(g_canv, g_ctx);
  var rect = e.target.getBoundingClientRect();
  mouse = [(e.clientX - rect.left), (e.clientY - rect.top)];
  gDrawPoint(tmp_p, 10);
  gDrawPoint(mouse);
}

function gDrawPoint(pnt, pt=5){
  if(pnt[0] != null && pnt[1] != null){
    g_ctx.fillStyle = document.getElementById("main_graph").style.borderColor;
    g_ctx.beginPath();
    g_ctx.arc(pnt[0], pnt[1], pt, 0, Math.PI * 2, false);
    g_ctx.fill();
  }
}

// result & paint
// tag:resultPaint
async function resultPaint(){
  document.getElementById("resultPaint").style.opacity = 1;
  await sleep(SUDTime);
  document.getElementById("paint").style.opacity = 1;
  await sleep(SUDTime);
  document.getElementById("result").style.opacity = 1;
  await sleep(SUDTime);
  document.getElementById("result_typo").style.opacity = 1;
  await sleep(SUDTime);
  document.getElementById("result_meta").style.opacity = 1;
  await sleep(SUDTime);
  document.getElementById("resultPaint").style.pointerEvents = "auto";
  rRefresh();
  r_txts.addEventListener("click", saveText);
  r_typs.addEventListener("click", saveTypo);
  r_alls.addEventListener("click", saveAll);
  r_exit.addEventListener("click", () => {location.reload()});
}
function rRefresh(){
  const cans = document.getElementsByClassName("r_canv");
  var ctxs = [];
  var meta = [];
  for(let i=0;i<emotion.length;i++){
    cans[i].width = cans[0].clientWidth;
    cans[i].height = cans[0].clientHeight;
    ctxs.push(cans[i].getContext("2d"));
  }
  const ch = cans[0].height;
  const cw = cans[0].width;
  const x0 = Math.ceil(cw / 2);
  const y0 = Math.ceil(ch / 2);

  let tmp_Rad = 0;
  for(let i=0;i<emotion.length;i++){
    let img = new Image();
    img.src = "/EDA/img/emotion/"+emotion[i]+".svg";
    img.onload = function(){
      const sRad = tmp_Rad * Math.PI * 2;
      const eRad = (tmp_Rad += 1/emotion.length) * Math.PI * 2;
      ctxs[i].beginPath();
      ctxs[i].moveTo(x0, y0);
      ctxs[i].arc(x0, y0, x0*2, sRad-2*Math.PI, eRad-2*Math.PI);
      ctxs[i].clip();
      ctxs[i].fillStyle = "#999";
      ctxs[i].drawImage(img, 0, 0, cw, ch);
    }
  }
  rCoord();
}

function saveText(){
  const fName = getFileName()+".txt";
  const blob = new Blob([episode],{type:"text/plain"});
  if (window.navigator.msSaveBlob) {
    window.navigator.msSaveBlob(blob, fName);
    window.navigator.msSaveOrOpenBlob(blob, fName);
  } else {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fName;
    link.click();
    URL.revokeObjectURL(blob);
  }
  console.log(datetime, "saved text.");
}

function saveTypo(){
  const fName = getFileName()+".png";
  const can = document.getElementById("canv_sav");
  const ctx = can.getContext("2d");
  const cans = document.getElementsByClassName("r_canv");
  can.width  = cans[0].width;
  can.height = cans[0].height;

  for(let i=0;i<emotion.length;i++){
    ctx.drawImage(cans[i], 0, 0);
  }
  can.toBlob((blob)=>{
    if (window.navigator.msSaveBlob) {
      window.navigator.msSaveBlob(blob, fName);
      window.navigator.msSaveOrOpenBlob(blob, fName);
    } else {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fName;
      link.click();
      URL.revokeObjectURL(blob);
    }
  })
}

function saveAll(){
  const fName = getFileName()+".png";
  const can = document.getElementById("canv_sav");
  const ctx = can.getContext("2d");
  const cans = document.getElementsByClassName("r_canv");
  const cant = document.getElementById("r_meta");
  can.width  = cans[0].width+20;
  can.height = cans[0].height+cant.height+20;
  ctx.fillStyle = "rgb(255, 251, 233)";
  ctx.fillRect(0, 0, can.width, can.height);

  for(let i=0;i<emotion.length;i++){
    ctx.drawImage(cans[i], 10, 10);
  }
  ctx.drawImage(cant, 10, cans[0].height+10);

  can.toBlob((blob)=>{
    if (window.navigator.msSaveBlob) {
      window.navigator.msSaveBlob(blob, fName);
      window.navigator.msSaveOrOpenBlob(blob, fName);
    } else {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fName;
      link.click();
      URL.revokeObjectURL(blob);
    }
  })
}

var createImage = function(context){
  var image= new Image();
  image.src= context.canvas.toDataURL();
  return image;
}

function rCoord(){
  const can = document.getElementById("r_meta");
  const ctx = can.getContext("2d");
  can.height = 200;
  can.width = 640;
  const ch = can.height;
  const cw = can.width;
  const size = 30;
  const iOff = 2;

  ctx.textAlign = "start";
  ctx.textBaseline = "bottom";
  ctx.fillstyle = "#000";
  ctx.font = "bold 15px verdana, sans-serif ";
  var nText = episode.split('').flatMap((_, i, a) => i % size ? [] : [episode.slice(i, i + size)]);
  for(let i=iOff;i<(nText.length+iOff);i++){
    ctx.fillText(nText[i], 15, 50+(i*14));
  }
  ctx.textAlign = "end";
  ctx.fillText("x=\t"+emoXY.x, cw-15, 50+(nText.length+iOff+2)*14);
  ctx.fillText("y=\t"+emoXY.y, cw-15, 50+(nText.length+iOff+3)*14);
}

function getFileName(){
  const date = new Date();
  const Y = date.getFullYear().toString().padStart(4, '0');
  const M = (date.getMonth() + 1).toString().padStart(2, '0');
  const D = date.getDate().toString().padStart(2, '0');
  const h = date.getHours().toString().padStart(2, '0');
  const m = date.getMinutes().toString().padStart(2, '0');
  const datetime = Y+M+D+"_"+h+m;
  return datetime+"_EDA";
}

// document.getElementById("start_logo").style.pointerEvents = "none";