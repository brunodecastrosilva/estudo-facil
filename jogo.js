/* Estudo Fácil · níveis, medalhas (em 3D, que giram com o dedo) e a festa de fim de sessão.
   Quase tudo sai dos dados de estudo (que sincronizam): pontos, nível, sequência e medalhas. Medalha ganha fica
   guardada em `marcos`, então não se perde se a sequência quebrar. Nada aqui premia virar a noite: o que conta é
   constância, revisão e acerto. */
"use strict";

const jogoLigado = () => cfg().jogo !== false;
const vibrar = p => { if (cfg().vibra !== false) KitFacil.jogo.vibrar(p); };

/* ---------- níveis ---------- */
const NIVEIS = [
  { nome: 'Primeira página', xp: 0 },
  { nome: 'Caderno aberto', xp: 150 },
  { nome: 'Ritmo firme', xp: 500 },
  { nome: 'Mente afiada', xp: 1200 },
  { nome: 'Fera do edital', xp: 2500 },
  { nome: 'Acima da média', xp: 4500 },
  { nome: 'Nota de corte', xp: 7500 },
  { nome: 'Entre os classificados', xp: 12000 },
  { nome: 'Nome na lista', xp: 18000 },
  { nome: 'Lenda do concurso', xp: 26000 },
];

/* ---------- medalhas ---------- */
const METAIS = { bronze: ['#E2A26B', '#9A5A2B', '#5E3414'], prata: ['#E9EDF4', '#9AA4B8', '#5B657A'], ouro: ['#FFE08A', '#D9A21B', '#8A5F06'] };
const ESMALTES = { constancia: ['#4F6BFF', '#1B2E9C'], volume: ['#17A398', '#0B5F58'], edital: ['#8FB312', '#4C6606'], app: ['#8B5CF6', '#4C2A9E'] };
const FAMILIAS = { constancia: 'Constância', volume: 'Volume', edital: 'Edital', app: 'App' };
const MED_IC = {
  pagina: 'M7 3.5h7l4 4V19a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 19V5A1.5 1.5 0 0 1 7 3.5zM14 3.5V8h4M9 12h6M9 15.5h4',
  chama: 'M12 21a6.5 6.5 0 0 1-6.5-6.5c0-3 1.800-4.600 3-6.500.4 1.600 1.300 2.500 2.300 2.900C10.600 7.500 12 5 14 3c.3 2.600 1.600 4.200 2.800 5.800 1 1.400 1.700 3 1.700 5.700A6.500 6.500 0 0 1 12 21z',
  calendario: 'M5.5 6.5h13a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1zM8.5 4v4M15.5 4v4M4.500 10.500h15M9 15l2 2 4-4',
  relogio: 'M12 4.500a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM12 8.500V13l3 2',
  alvo: 'M12 3.500a8.500 8.500 0 1 0 0 17 8.500 8.500 0 0 0 0-17zM12 7.500a4.500 4.500 0 1 0 0 9 4.500 4.500 0 0 0 0-9zM12 12h.01',
  check: 'm6.500 12.500 3.500 3.500 7.500-8',
  marca: 'm14.500 4.500 5 5L11 18H6v-5zM4 21h9',
  livro: 'M5 5.500c2.300-.800 4.700-.600 7 .600 2.300-1.200 4.700-1.400 7-.600V18c-2.300-.800-4.700-.600-7 .600-2.300-1.200-4.700-1.400-7-.600zM12 6.100v12.500',
  revisar: 'M19.500 12a7.500 7.500 0 1 1-2.400-5.500M19.500 4.500v4h-4',
  trofeu: 'M8 4.500h8v5a4 4 0 0 1-8 0zM8 6H5.500v1.500A3 3 0 0 0 8 10.400M16 6h2.500v1.500a3 3 0 0 1-2.500 2.900M12 13.500V17M8.500 20h7M10 17h4v3h-4z',
  estrela: 'm12 4 2.500 5.100 5.600.800-4.100 3.900 1 5.600L12 16.700l-5 2.700 1-5.600-4.100-3.900 5.600-.800z',
  escudo: 'M12 3.500 5 6v5.500c0 4.300 2.900 7.300 7 9 4.100-1.700 7-4.700 7-9V6zM9 12l2.200 2.200 4-4.200',
  raio: 'M13 3 5.500 13.500H11L10 21l8-11h-5.500z',
  nuvem: 'M8.300 17.500a3.300 3.300 0 0 1-.4-6.600 4.300 4.300 0 0 1 8.300-.6 3.600 3.600 0 0 1-.5 7.200z',
  pessoa: 'M12 5.500a3.200 3.200 0 1 0 0 6.400 3.200 3.200 0 0 0 0-6.400zM6 19.500c.700-3 2.900-4.500 6-4.500s5.300 1.500 6 4.500',
  sol: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 3v2M12 19v2M3 12h2M19 12h2M5.600 5.600 7 7M17 17l1.400 1.400M5.600 18.400 7 17M17 7l1.400-1.400',
  questoes: 'M9.500 9.300a2.700 2.700 0 1 1 3.800 2.500c-.8.400-1.300 1-1.300 1.900M12 17h.01M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z',
  simulado: 'M7 3.500h10a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2zM9 9l1.300 1.300L13 7.700M9 15l1.300 1.300 2.700-2.600',
  montanha: 'M3 19.500 9.500 8l3.500 6 2.500-4 5.500 9.500zM9.500 8V4.500l3 1.200-3 1.300',
  cadeado: 'M7 11h10a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1zM8.500 11V8a3.500 3.500 0 0 1 7 0v3M12 15v2',
};
const seq = n => s => s.recorde >= n, prog = (k, n) => s => [Math.min(Math.floor(s[k]), n), n];
const MEDALHAS = [
  { id: 'nome', nome: 'Prazer em conhecer', como: 'Diga como chamam você.', fam: 'app', metal: 'bronze', ic: 'pessoa', ok: s => s.nome },
  { id: 'primeira', nome: 'Primeira página', como: 'Conclua a sua primeira sessão de estudo.', fam: 'constancia', metal: 'bronze', ic: 'pagina', ok: s => s.sessoes >= 1 },
  { id: 'dia1', nome: 'Meta batida', como: 'Bata a meta de estudo de um dia.', fam: 'constancia', metal: 'bronze', ic: 'check', ok: s => s.dias >= 1 },
  { id: 'seq3', nome: 'Três seguidos', como: 'Bata a meta 3 dias seguidos.', fam: 'constancia', metal: 'bronze', ic: 'chama', ok: seq(3), prog: prog('recorde', 3) },
  { id: 'seq7', nome: 'Semana cheia', como: 'Bata a meta 7 dias seguidos.', fam: 'constancia', metal: 'prata', ic: 'calendario', ok: seq(7), prog: prog('recorde', 7) },
  { id: 'seq14', nome: 'Duas semanas', como: 'Bata a meta 14 dias seguidos.', fam: 'constancia', metal: 'prata', ic: 'chama', ok: seq(14), prog: prog('recorde', 14) },
  { id: 'seq30', nome: 'Mês de ferro', como: 'Bata a meta 30 dias seguidos.', fam: 'constancia', metal: 'ouro', ic: 'escudo', ok: seq(30), prog: prog('recorde', 30) },
  { id: 'seq100', nome: 'Cem dias', como: 'Bata a meta 100 dias seguidos.', fam: 'constancia', metal: 'ouro', ic: 'trofeu', ok: seq(100), prog: prog('recorde', 100) },
  { id: 'perfeito', nome: 'Dia perfeito', como: 'Cumpra as três missões num mesmo dia.', fam: 'constancia', metal: 'prata', ic: 'estrela', ok: s => s.perfeitos >= 1 },
  { id: 'cedo', nome: 'Cedo no caderno', como: 'Comece uma sessão antes das 8 da manhã.', fam: 'constancia', metal: 'bronze', ic: 'sol', ok: s => s.cedo },
  { id: 'h10', nome: 'Dez horas', como: 'Some 10 horas de estudo.', fam: 'volume', metal: 'bronze', ic: 'relogio', ok: s => s.horas >= 10, prog: prog('horas', 10) },
  { id: 'h50', nome: 'Cinquenta horas', como: 'Some 50 horas de estudo.', fam: 'volume', metal: 'prata', ic: 'relogio', ok: s => s.horas >= 50, prog: prog('horas', 50) },
  { id: 'h100', nome: 'Cem horas', como: 'Some 100 horas de estudo.', fam: 'volume', metal: 'ouro', ic: 'montanha', ok: s => s.horas >= 100, prog: prog('horas', 100) },
  { id: 'q100', nome: 'Cem questões', como: 'Resolva 100 questões.', fam: 'volume', metal: 'bronze', ic: 'questoes', ok: s => s.questoes >= 100, prog: prog('questoes', 100) },
  { id: 'q500', nome: 'Quinhentas questões', como: 'Resolva 500 questões.', fam: 'volume', metal: 'prata', ic: 'questoes', ok: s => s.questoes >= 500, prog: prog('questoes', 500) },
  { id: 'q1000', nome: 'Mil questões', como: 'Resolva 1.000 questões.', fam: 'volume', metal: 'ouro', ic: 'raio', ok: s => s.questoes >= 1000, prog: prog('questoes', 1000) },
  { id: 'mira', nome: 'Mira boa', como: 'Acerte 80% ou mais numa sessão com 20 questões.', fam: 'volume', metal: 'prata', ic: 'alvo', ok: s => s.mira },
  { id: 'grifo', nome: 'Primeiro grifo', como: 'Conclua a teoria de um assunto.', fam: 'edital', metal: 'bronze', ic: 'marca', ok: s => s.assuntos >= 1 },
  { id: 'rev10', nome: 'Memória em dia', como: 'Faça 10 revisões.', fam: 'edital', metal: 'prata', ic: 'revisar', ok: s => s.revisoes >= 10, prog: prog('revisoes', 10) },
  { id: 'disc', nome: 'Disciplina fechada', como: 'Estude todos os assuntos de uma disciplina.', fam: 'edital', metal: 'prata', ic: 'livro', ok: s => s.discFechadas >= 1 },
  { id: 'ed25', nome: 'Um quarto grifado', como: 'Chegue a 25% de prontidão num concurso.', fam: 'edital', metal: 'bronze', ic: 'marca', ok: s => s.prontidao >= 25, prog: prog('prontidao', 25) },
  { id: 'ed50', nome: 'Metade do edital', como: 'Chegue a 50% de prontidão num concurso.', fam: 'edital', metal: 'prata', ic: 'marca', ok: s => s.prontidao >= 50, prog: prog('prontidao', 50) },
  { id: 'ed90', nome: 'Edital grifado', como: 'Chegue a 90% de prontidão num concurso.', fam: 'edital', metal: 'ouro', ic: 'trofeu', ok: s => s.prontidao >= 90, prog: prog('prontidao', 90) },
  { id: 'lgpd', nome: 'Guardião dos dados', como: 'Estude todos os assuntos da LGPD.', fam: 'edital', metal: 'ouro', ic: 'cadeado', ok: s => s.lgpd === 1, prog: s => [Math.round((s.lgpd || 0) * 19), 19], se: () => !!materia('anpd-lgpd') },
  { id: 'simulado', nome: 'Ensaio geral', como: 'Registre um simulado.', fam: 'edital', metal: 'bronze', ic: 'simulado', ok: s => s.simulados >= 1 },
  { id: 'guia', nome: 'Leu o manual', como: 'Veja o guia do app até o fim.', fam: 'app', metal: 'bronze', ic: 'livro', ok: s => s.guia },
  { id: 'nuvem', nome: 'Em todo lugar', como: 'Ligue a sincronização entre aparelhos.', fam: 'app', metal: 'bronze', ic: 'nuvem', ok: s => s.sync },
];
const medalhasDoApp = () => MEDALHAS.filter(m => !m.se || m.se());

/* ---------- o que os dados dizem ---------- */
let jogoMemo = { ver: -1 };
function jogoEstado() {
  const h = hojeISO(), sync = !!(SY && SY.ligada());
  if (jogoMemo.ver === VER && jogoMemo.h === h && jogoMemo.sync === sync) return jogoMemo.s;
  const T = totais(), S = sequencia();
  const s = { ...T, horas: T.min / 60, recorde: S.recorde, seq: S.n, nome: !!cfg().nome, sync, guia: temMarco('f:guia'),
    cedo: DB.sessoes.some(x => !x.manual && new Date(x.ini).getHours() < 8 && new Date(x.ini).getHours() >= 4),
    mira: DB.sessoes.some(x => (x.ac || 0) + (x.er || 0) >= 20 && x.ac / (x.ac + x.er) >= .8),
    perfeitos: DB.marcos.filter(m => String(m.id).startsWith('p:')).length, simulados: DB.simulados.length,
    prontidao: Math.max(0, ...DB.concursos.map(c => prontidao(c))),
    discFechadas: DB.materias.filter(m => { const L = topicosDe(m.id); return L.length >= 3 && L.every(t => t.teoria); }).length };
  const lg = topicosDe('anpd-lgpd'); s.lgpd = lg.length ? lg.filter(t => t.teoria).length / lg.length : 0;
  const L = medalhasDoApp();
  s.ganhas = L.filter(m => temMarco('m:' + m.id) || (() => { try { return !!m.ok(s); } catch { return false; } })()).map(m => m.id);
  s.total = L.length;
  s.xp = pontosBase() + s.ganhas.length * PONTOS.medalha;
  const nv = KitFacil.jogo.nivel(s.xp, NIVEIS); s.nivel = nv.nivel; s.nivelNome = nv.nome; s.prox = nv.prox;
  jogoMemo = { ver: VER, h, sync, s };
  return s;
}
// medalhas ganhas que a pessoa ainda não viu; ao conferir, ficam guardadas (e passam a valer para sempre)
function jogoConferir({ silencioso = false } = {}) {
  if (semSalvar) return [];
  const s = jogoEstado(), novas = medalhasDoApp().filter(m => s.ganhas.includes(m.id) && !temMarco('m:' + m.id));
  if (missoes().perfeito) marcar('p:' + hojeISO());
  if (!novas.length) { if (jogoMemo.ver !== VER) salvar({ quieto: true }); return []; }
  novas.forEach(m => marcar('m:' + m.id)); salvar({ quieto: true });
  if (silencioso || !jogoLigado()) return novas;
  if (festaAberta || KitFacil.dialogo.aberto() || (typeof guiaAtivo === 'function' && guiaAtivo()) || (typeof aberturaAtiva === 'function' && aberturaAtiva()) || (typeof focoAberto === 'function' && focoAberto())) { medalhaFila.push(...novas); return novas; }
  medalhaNova(novas);
  return novas;
}
let medalhaFila = [];
function medalhaFilaMostrar() { if (!medalhaFila.length || festaAberta || KitFacil.dialogo.aberto() || (typeof guiaAtivo === 'function' && guiaAtivo())) return; const l = medalhaFila; medalhaFila = []; medalhaNova(l); }
function jogoMarcar(flag) { if (marcar('f:' + flag)) { salvar({ quieto: true }); setTimeout(() => jogoConferir({ silencioso: typeof guiaAtivo === 'function' && guiaAtivo() }), 400); } }

/* ---------- medalha desenhada (lista e festa) ---------- */
let medSeq = 0;
function medalhaSVG(m, { apagada = false, rotulo = false } = {}) {
  const [m1, m2, m3] = apagada ? ['#D9DDE8', '#A9B0C2', '#7C8498'] : METAIS[m.metal] || METAIS.bronze, [e1, e2] = apagada ? ['#C6CBDA', '#959DB3'] : ESMALTES[m.fam] || ESMALTES.app, k = 'md' + (medSeq++);
  return `<svg class="med-svg${apagada ? ' apagada' : ''}" viewBox="0 0 100 100" ${rotulo ? `role="img" aria-label="${esc(m.nome)}"` : 'aria-hidden="true"'}>
    <defs><linearGradient id="${k}a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${m1}"/><stop offset=".5" stop-color="${m2}"/><stop offset="1" stop-color="${m3}"/></linearGradient>
    <radialGradient id="${k}b" cx="35%" cy="28%" r="85%"><stop offset="0" stop-color="${e1}"/><stop offset="1" stop-color="${e2}"/></radialGradient>
    <linearGradient id="${k}c" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
    <circle cx="50" cy="50" r="48" fill="url(#${k}a)"/><circle cx="50" cy="50" r="48" fill="none" stroke="${m3}" stroke-opacity=".55" stroke-width="1.500"/>
    <circle cx="50" cy="50" r="38.500" fill="url(#${k}b)" stroke="${m3}" stroke-width="1.500"/><circle cx="50" cy="50" r="38" fill="url(#${k}c)"/>
    <circle cx="50" cy="50" r="33" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="1" stroke-dasharray="1.500 3.500"/>
    <g transform="translate(21.200 21.200) scale(2.400)" fill="none" stroke="#fff" stroke-width="1.800" stroke-linecap="round" stroke-linejoin="round"><path d="${MED_IC[m.ic] || MED_IC.estrela}"/></g>
  </svg>`;
}

/* ---------- medalha em 3D: uma moeda de metal com o esmalte na frente e a marca do app no verso ----------
   Desenhada com WebGL (luz por pixel, brilho e reflexo). Gira com o dedo, com as setas do teclado e, parada, volta a
   girar devagar. Com movimento reduzido fica parada e só gira com o dedo. Sem WebGL, fica a medalha desenhada. */
const MED_VS = `attribute vec3 aP,aN;attribute vec3 aU;uniform mat4 uMVP,uMV;varying vec3 vN,vV;varying vec3 vU;
void main(){vec4 q=uMV*vec4(aP,1.);vV=q.xyz;vN=mat3(uMV)*aN;vU=aU;gl_Position=uMVP*vec4(aP,1.);}`;
const MED_FS = `precision highp float;uniform sampler2D uT;uniform vec3 uM1,uM2;varying vec3 vN,vV;varying vec3 vU;
void main(){vec3 N=normalize(vN);vec3 V=normalize(-vV);
float metal=vU.z;vec3 tx=texture2D(uT,vU.xy).rgb;
vec3 R=reflect(-V,N);float ceu=smoothstep(-.4,.9,R.y);float faixa=smoothstep(.2,.5,R.y)*(1.-smoothstep(.6,.95,R.y));float lado=smoothstep(.3,.9,abs(R.x));
vec3 base=mix(tx,mix(uM2,uM1,ceu)*(.75+.5*faixa+.18*lado),metal);
vec3 L1=normalize(vec3(-.45,.7,.6)),L2=normalize(vec3(.7,.2,.6));
float d1=max(dot(N,L1),0.),d2=max(dot(N,L2),0.);
vec3 H=normalize(L1+V);float sp=pow(max(dot(N,H),0.),mix(38.,90.,metal))*mix(.5,.95,metal);
float fr=pow(1.-max(dot(N,V),0.),3.);
vec3 cor=base*(mix(.5,.42,metal)+d1*.62+d2*.2)+vec3(sp)+fr*.1;
gl_FragColor=vec4(clamp(cor,0.,1.),1.);}`;
const hexRGB = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255);
let MGL = null; // um contexto só, reaproveitado: só há uma medalha em 3D na tela por vez
function medGL() {
  if (MGL !== null) return MGL || null;
  try {
    const cv = document.createElement('canvas'), gl = cv.getContext('webgl', { antialias: true, alpha: true, premultipliedAlpha: true, preserveDrawingBuffer: true });
    if (!gl) { MGL = false; return null; }
    const sh = (tipo, src) => { const s = gl.createShader(tipo); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
    const pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, MED_VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, MED_FS)); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(pr));
    gl.useProgram(pr);
    const loc = {}; for (const a of ['aP', 'aN', 'aU']) loc[a] = gl.getAttribLocation(pr, a); for (const u of ['uMVP', 'uMV', 'uT', 'uM1', 'uM2']) loc[u] = gl.getUniformLocation(pr, u);
    // a moeda: um perfil (raio, altura) girado em torno do eixo; cada trecho do perfil tem a sua normal (quinas vivas)
    const P = [], N = [], U = [], Ix = [], SEG = 96, zf = 0.09;
    const perfil = [[0, zf - .028, 0], [.775, zf - .028, 0], [.815, zf, 1], [.955, zf, 1], [1, zf - .045, 1], [1, -zf + .045, 1], [.955, -zf, 1], [.815, -zf, 1], [.775, -zf + .028, 0], [0, -zf + .028, 0]];
    for (let k = 0; k < perfil.length - 1; k++) {
      const [r0, z0, m0] = perfil[k], [r1, z1, m1] = perfil[k + 1], dr = r1 - r0, dz = z1 - z0, len = Math.hypot(dr, dz) || 1, nr = -dz / len, nz = dr / len;
      const base = P.length / 3, met = (m0 && m1) || (k === 1 || k === 7) ? 1 : 0, verso = z0 < 0 && z1 < 0;
      for (let j = 0; j <= SEG; j++) {
        const a = 2 * Math.PI * j / SEG, c = Math.cos(a), s = Math.sin(a);
        for (const [r, z] of [[r0, z0], [r1, z1]]) {
          P.push(r * c, r * s, z); N.push(nr * c, nr * s, nz);
          // frente: metade esquerda da figura; verso: metade direita (espelhada, para a marca não sair invertida)
          const u = verso ? .75 - (r * c / .78) * .24 : .25 + (r * c / .78) * .24, v = .5 - (r * s / .78) * .48;
          U.push(u, v, met);
        }
      }
      for (let j = 0; j < SEG; j++) { const a = base + j * 2; Ix.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    }
    const buf = (l, d, n) => { const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(d), gl.STATIC_DRAW); gl.enableVertexAttribArray(l); gl.vertexAttribPointer(l, n, gl.FLOAT, false, 0, 0); };
    buf(loc.aP, P, 3); buf(loc.aN, N, 3); buf(loc.aU, U, 3);
    const ib = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(Ix), gl.STATIC_DRAW);
    const tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex); gl.uniform1i(loc.uT, 0);
    cv.setAttribute('aria-hidden', 'true');
    cv.addEventListener('webglcontextlost', e => { e.preventDefault(); MGL = null; });
    MGL = { cv, gl, loc, n: Ix.length, de: null };
    return MGL;
  } catch (x) { console.warn('3d', x); MGL = false; return null; }
}
// a figura das duas faces: à esquerda o esmalte com o ícone; à direita o verso, com a marca do app em relevo
function medTextura(m, apagada) {
  const cv = document.createElement('canvas'); cv.width = 1024; cv.height = 512; const g = cv.getContext('2d');
  const [e1, e2] = apagada ? ['#C6CBDA', '#8B93A9'] : ESMALTES[m.fam] || ESMALTES.app, [m1, m2, m3] = apagada ? ['#D9DDE8', '#A9B0C2', '#7C8498'] : METAIS[m.metal] || METAIS.bronze;
  let gr = g.createRadialGradient(256 - 80, 256 - 100, 20, 256, 256, 300); gr.addColorStop(0, e1); gr.addColorStop(1, e2); g.fillStyle = gr; g.fillRect(0, 0, 512, 512);
  g.strokeStyle = 'rgba(255,255,255,.42)'; g.lineWidth = 4; g.setLineDash([7, 15]); g.beginPath(); g.arc(256, 256, 212, 0, 7); g.stroke(); g.setLineDash([]);
  g.strokeStyle = 'rgba(0,0,0,.25)'; g.lineWidth = 10; g.beginPath(); g.arc(256, 256, 250, 0, 7); g.stroke();
  g.save(); g.translate(256 - 12 * 14.500, 256 - 12 * 14.500); g.scale(14.500, 14.500); g.lineCap = g.lineJoin = 'round';
  g.strokeStyle = 'rgba(0,0,0,.28)'; g.lineWidth = 2; g.translate(.25, .35); g.stroke(new Path2D(MED_IC[m.ic] || MED_IC.estrela)); g.translate(-.25, -.35);
  g.strokeStyle = '#FFFFFF'; g.lineWidth = 1.800; g.stroke(new Path2D(MED_IC[m.ic] || MED_IC.estrela)); g.restore();
  // verso
  gr = g.createLinearGradient(512, 0, 1024, 512); gr.addColorStop(0, m1); gr.addColorStop(.55, m2); gr.addColorStop(1, m3); g.fillStyle = gr; g.fillRect(512, 0, 512, 512);
  g.strokeStyle = 'rgba(0,0,0,.2)'; g.lineWidth = 6; g.beginPath(); g.arc(768, 256, 226, 0, 7); g.stroke();
  const barra = (x, y, w, h, cor) => { g.fillStyle = cor; g.beginPath(); if (g.roundRect) g.roundRect(x, y, w, h, h / 2); else g.rect(x, y, w, h); g.fill(); };
  // a marca "edital grifado": três linhas e a passada de marca-texto, em relevo
  barra(683, 172, 170, 30, 'rgba(0,0,0,.26)'); barra(680, 168, 170, 30, 'rgba(255,255,255,.5)');
  g.save(); g.translate(768, 258); g.rotate(-.06); g.fillStyle = 'rgba(0,0,0,.24)'; g.fillRect(-142, -34, 290, 76); g.fillStyle = apagada ? 'rgba(255,255,255,.5)' : '#DFF65C'; g.fillRect(-146, -38, 290, 76); barra(-102, -15, 204, 30, 'rgba(19,26,58,.85)'); g.restore();
  barra(703, 318, 130, 30, 'rgba(0,0,0,.26)'); barra(700, 314, 130, 30, 'rgba(255,255,255,.5)');
  g.fillStyle = 'rgba(0,0,0,.5)'; g.font = '700 30px "Atkinson Hyperlegible Next",system-ui,sans-serif'; g.textAlign = 'center'; g.fillText('ESTUDO FÁCIL', 768, 420);
  return cv;
}
const M4 = {
  mul(a, b) { const o = new Float32Array(16); for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) o[c * 4 + r] = a[r] * b[c * 4] + a[4 + r] * b[c * 4 + 1] + a[8 + r] * b[c * 4 + 2] + a[12 + r] * b[c * 4 + 3]; return o; },
  persp(fov, asp, n, f) { const t = 1 / Math.tan(fov / 2), o = new Float32Array(16); o[0] = t / asp; o[5] = t; o[10] = (f + n) / (n - f); o[11] = -1; o[14] = 2 * f * n / (n - f); return o; },
  mov(z) { return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, z, 1]); },
  rx(a) { const c = Math.cos(a), s = Math.sin(a); return new Float32Array([1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]); },
  ry(a) { const c = Math.cos(a), s = Math.sin(a); return new Float32Array([c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]); },
};
function medalha3dHTML(m, { apagada = false, D = 190 } = {}) {
  return `<div class="med3d" data-med="${esc(m.id)}" ${apagada ? 'data-apagada="1"' : ''} tabindex="0" role="img" aria-label="Medalha ${esc(m.nome)}. Deslize o dedo ou use as setas para girar." style="width:${D}px;height:${D}px"><span class="med3d-plana">${medalhaSVG(m, { apagada })}</span></div>`;
}
function girarMedalha(raiz, { inicio = -0.45, auto = true } = {}) {
  const o = raiz.matches && raiz.matches('.med3d') ? raiz : raiz.querySelector('.med3d'); if (!o || o.dataset.ligado) return null;
  const m = MEDALHAS.find(x => x.id === o.dataset.med), G = m && medGL(); if (!G) return null;
  o.dataset.ligado = '1';
  const { gl, loc, cv } = G, apagada = !!o.dataset.apagada, quieto = semMovimento();
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, medTextura(m, apagada)); gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  const [, c2, c3] = apagada ? ['', '#C9CEDB', '#6F778B'] : METAIS[m.metal] || METAIS.bronze, c1 = apagada ? '#F2F4F9' : (METAIS[m.metal] || METAIS.bronze)[0];
  gl.uniform3fv(loc.uM1, hexRGB(c1).map((v, i) => v * .55 + hexRGB(c2)[i] * .45)); gl.uniform3fv(loc.uM2, hexRGB(c3));
  o.appendChild(cv); o.classList.add('med3d-viva');
  const dpr = Math.min(3, window.devicePixelRatio || 1); cv.width = Math.round(o.clientWidth * dpr); cv.height = Math.round(o.clientHeight * dpr);
  const ATRITO = 0.9955; let ang = inicio, vel = 0, arr = null, raf = 0, sozinho = auto && !quieto, t0 = 0, mexeu = false, ocioso = 0, rampa = 1, sentido = 1;
  const pintar = () => {
    if (MGL !== G || !cv.isConnected || cv.parentNode !== o) return;
    gl.viewport(0, 0, cv.width, cv.height); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); gl.enable(gl.DEPTH_TEST); gl.disable(gl.CULL_FACE);
    const fov = 0.5, dist = 1.08 / Math.sin(fov / 2), mv = M4.mul(M4.mov(-dist), M4.mul(M4.rx(0.16), M4.ry(ang)));
    gl.uniformMatrix4fv(loc.uMV, false, mv); gl.uniformMatrix4fv(loc.uMVP, false, M4.mul(M4.persp(fov, 1, dist - 1.6, dist + 1.6), mv));
    gl.drawElements(gl.TRIANGLES, G.n, gl.UNSIGNED_SHORT, 0); o.dataset.ang = ang.toFixed(3);
  };
  const quadro = t => {
    raf = 0; const dt = Math.min(48, t - (t0 || t)); t0 = t; if (arr) return;
    if (Math.abs(vel) > 0.0004) { const f = Math.pow(ATRITO, dt); ang += vel * (1 - f) / -Math.log(ATRITO); vel *= f; if (mexeu) sentido = vel < 0 ? -1 : 1; ocioso = 0; }
    else if (sozinho) { rampa = Math.min(1, rampa + dt / 900); ang += sentido * 0.0008 * dt * rampa * (2 - rampa); }
    else if (mexeu && !quieto) { vel = 0; ocioso += dt; if (ocioso > 900) { sozinho = true; rampa = 0; } }
    else { vel = 0; pintar(); return; }
    pintar(); if (o.isConnected) raf = requestAnimationFrame(quadro);
  };
  const andar = () => { if (!raf && o.isConnected) { t0 = 0; raf = requestAnimationFrame(quadro); } };
  o.addEventListener('pointerdown', e => { if (e.button > 0) return; sozinho = false; mexeu = true; ocioso = 0; arr = { x: e.clientX, t: performance.now(), v: 0 }; vel = 0; o.classList.add('pegou'); try { o.setPointerCapture(e.pointerId); } catch {} });
  o.addEventListener('pointermove', e => { if (!arr) return; const ag = performance.now(), dx = e.clientX - arr.x, dt = Math.max(1, ag - arr.t); ang += dx * 0.0115; arr.v = arr.v * .6 + (dx * 0.0115 / dt) * .4; arr.x = e.clientX; arr.t = ag; pintar(); });
  const soltar = () => { if (!arr) return; vel = quieto ? 0 : clamp(arr.v, -0.02, 0.02); arr = null; o.classList.remove('pegou'); andar(); };
  o.addEventListener('pointerup', soltar); o.addEventListener('pointercancel', soltar);
  o.addEventListener('keydown', e => { if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return; e.preventDefault(); sozinho = false; mexeu = true; ocioso = 0; sentido = e.key === 'ArrowRight' ? 1 : -1; vel = 0; ang += 0.3 * sentido; pintar(); andar(); });
  pintar(); andar();
  return { peteleco: (voltas = 2, fim = -0.4) => { sozinho = false; const total = voltas * 2 * Math.PI + fim - ang; vel = (total + 0.0004 / -Math.log(ATRITO)) * -Math.log(ATRITO); andar(); }, angulo: () => ang };
}

/* ---------- medalha nova e ficha da medalha ---------- */
function medalhaNova(lista, aoFechar) {
  const m = lista[0], resto = lista.slice(1);
  vibrar([18, 40, 18]);
  abrirJanela({ titulo: 'Medalha nova', aoFechar: () => { if (aoFechar) aoFechar(); else setTimeout(medalhaFilaMostrar, 500); },
    corpo: `<div class="mn"><div class="mn-cai">${medalha3dHTML(m)}</div><b class="mn-nome">${esc(m.nome)}</b><p class="apoio">${esc(m.como.replace(/\.$/, ''))}: feito. +${PONTOS.medalha} pontos.</p>
      ${resto.length ? `<p class="mn-mais">E mais ${plural(resto.length, 'medalha', 'medalhas')}: ${esc(resto.map(x => x.nome).join(', '))}.</p>` : ''}</div>`,
    pe: `<button type="button" class="kf-btn kf-sec" id="mn-ver">Ver a coleção</button><button type="button" class="kf-btn kf-pri" id="mn-ok">Continuar</button>`,
    aoMontar: d => { const g = girarMedalha(d, { auto: false, inicio: semMovimento() ? -0.4 : 0 }); if (g && !semMovimento()) g.peteleco(2); $('#mn-ok', d).onclick = () => fecharJanela(); $('#mn-ver', d).onclick = () => { fecharJanela(true); evoAba = 'medalhas'; irPara('evolucao'); }; } });
}
function medalhaFicha(m) {
  const s = jogoEstado(), tem = s.ganhas.includes(m.id), p = m.prog && !tem ? m.prog(s) : null, quando = (idx().marcos.get('m:' + m.id) || {}).em;
  abrirJanela({ titulo: m.nome, contexto: `${FAMILIAS[m.fam]} · ${m.metal}`,
    corpo: `<div class="mn">${medalha3dHTML(m, { apagada: !tem })}<p class="mn-dica" aria-hidden="true">Deslize o dedo para girar</p><p class="mn-como">${esc(m.como)}</p>
      ${tem ? `<p class="apoio">Na coleção${quando ? ' desde ' + fmtData(iso(new Date(quando))) : ''}.</p>` : p ? `<div class="barra" role="img" aria-label="${p[0]} de ${p[1]}"><i style="width:${Math.round(p[0] / p[1] * 100)}%"></i></div><p class="apoio">${p[0].toLocaleString('pt-BR')} de ${p[1].toLocaleString('pt-BR')}</p>` : '<p class="apoio">Ainda não está na coleção.</p>'}</div>`,
    aoMontar: d => { girarMedalha(d); } });
}

/* ---------- peças de nível ---------- */
const seloNivelHTML = (s, grande) => `<span class="selo-nivel ${grande ? 'grande' : ''}" aria-hidden="true"><span class="selo-n">${s.nivel}</span><span class="selo-t">nível</span></span>`;
function nivelHTML(s) {
  return `<span class="nivel-tx"><b>${esc(s.nivelNome)}</b>
    ${s.prox ? `<span class="barra" role="img" aria-label="${s.prox.pct}% do caminho até ${esc(s.prox.nome)}"><i style="width:${Math.max(4, s.prox.pct)}%"></i></span><small>Faltam ${s.prox.falta.toLocaleString('pt-BR')} pontos para ${esc(s.prox.nome)}</small>`
      : `<span class="barra cheia" role="img" aria-label="Nível máximo"><i style="width:100%"></i></span><small>Nível máximo · ${s.xp.toLocaleString('pt-BR')} pontos</small>`}</span>`;
}
// a chama da sequência: um desenho (não é ícone de traço), acesa quando o dia já foi cumprido
function chamaHTML(acesa, cls = '') {
  const k = 'ch' + (medSeq++);
  return `<svg class="chama ${acesa ? 'acesa' : 'apagada'} ${cls}" viewBox="0 0 64 80" aria-hidden="true"><defs><linearGradient id="${k}a" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${acesa ? '#2742D3' : '#B3BACF'}"/><stop offset="1" stop-color="${acesa ? '#6F8BFF' : '#D5D9E6'}"/></linearGradient><linearGradient id="${k}b" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${acesa ? '#DFF65C' : '#EEF0F6'}"/><stop offset="1" stop-color="${acesa ? '#F6FFB8' : '#F7F8FB'}"/></linearGradient></defs>
    <path class="chama-fora" d="M32 78C17 78 6 67 6 52c0-12 7-18 12-26 2 7 5 10 9 12C25 26 30 14 39 4c1 11 6 17 11 24 4 6 8 13 8 24 0 15-11 26-26 26z" fill="url(#${k}a)"/>
    <path class="chama-dentro" d="M32 70c-7 0-12-5-12-12 0-6 4-9 7-14 1 4 3 6 5 7 0-5 2-9 5-13 1 5 3 8 5 11 2 3 2 6 2 9 0 7-5 12-12 12z" fill="url(#${k}b)"/></svg>`;
}

/* ---------- festa de fim de sessão: o momento de marca do app (tela cheia; Código, Art. 68, § 4º) ---------- */
let festaAberta = false;
// antes: jogoEstado() e sequencia() de antes de guardar a sessão; fez: o que registrarSessao devolveu
function festa(fez, antes, { aoFechar } = {}) {
  const raiz = $('#festa'); if (!raiz || !jogoLigado()) { aoFechar && aoFechar(); return false; }
  const s = jogoEstado(), S = sequencia(), novas = jogoConferir({ silencioso: true }), s2 = novas.length ? jogoEstado() : s;
  const ganho = s2.xp - antes.s.xp, subiu = s2.nivel > antes.s.nivel, ses = fez.sessao, top = ses.t && topico(ses.t), mat = materia(ses.m);
  const min = minutosDoDia(hojeISO()), meta = cfg().metaMin, mis = missoes();
  const de = antes.s.prox ? antes.s.prox.pct : 100, para = subiu ? 100 : (s2.prox ? s2.prox.pct : 100);
  const titulo = fez.dia ? (S.n > 1 ? `${S.n} dias seguidos!` : 'Meta do dia batida!') : subiu ? `Nível ${s2.nivel}!` : fez.teoria ? 'Assunto grifado!' : 'Sessão concluída';
  const linhas = [];
  linhas.push(['Estudo', `${fmtMin(Math.max(1, ses.seg / 60))}${top ? '' : ''}`]);
  if (ses.ac + ses.er) linhas.push(['Questões', `${ses.ac} de ${ses.ac + ses.er} certas (${pct(ses.ac, ses.ac + ses.er)}%)`]);
  if (fez.teoria) linhas.push(['Teoria', `concluída · ${plural(fez.revisoes, 'revisão marcada', 'revisões marcadas')}`]);
  if (fez.revisao) linhas.push(['Revisão', 'feita']);
  linhas.push(['Hoje', `${fmtMin(min)} de ${fmtMin(meta)}`]);
  festaAberta = true;
  raiz.innerHTML = `<div class="festa" data-kf-tela-cheia role="dialog" aria-modal="true" aria-labelledby="festa-t"><div class="festa-in">
      <div class="festa-arte" aria-hidden="true">${fez.dia ? chamaHTML(true, 'festa-chama') : `<span class="festa-check">${I.check}</span>`}</div>
      <h2 class="festa-t" id="festa-t" tabindex="-1">${esc(titulo)}</h2>
      <p class="festa-sub">${top ? esc(top.nome) : mat ? esc(mat.nome) : 'Estudo livre'}</p>
      <p class="festa-pts"><span class="festa-mais" id="festa-pts" data-de="0" data-para="${ganho}">+${ganho}</span> <span>pontos</span></p>
      <dl class="resumo festa-res">${linhas.map(([a, b]) => `<div><dt>${a}</dt><dd>${esc(b)}</dd></div>`).join('')}</dl>
      <div class="festa-nivel">${seloNivelHTML(s2)}<span class="nivel-tx"><b>${subiu ? `Nível ${s2.nivel}: ${esc(s2.nivelNome)}` : esc(s2.nivelNome)}</b><span class="barra"><i id="festa-barra" style="width:${Math.max(4, de)}%"></i></span><small>${s2.prox ? `Faltam ${s2.prox.falta.toLocaleString('pt-BR')} pontos para ${esc(s2.prox.nome)}` : 'Nível máximo'}</small></span></div>
      ${mis.perfeito && !antes.perfeito ? `<p class="festa-perfeito"><span class="grifo">Dia perfeito</span> As três missões de hoje estão cumpridas.</p>` : ''}
      ${novas.length ? `<div class="festa-meds">${novas.map((m, i) => `<span class="festa-med" style="--i:${i}">${medalhaSVG(m)}<small>${esc(m.nome)}</small></span>`).join('')}</div>` : ''}
      <div class="festa-acoes"><button type="button" class="kf-btn kf-comecar bloco" id="festa-ok">Continuar</button></div>
    </div></div>`;
  const cx = $('.festa', raiz), ant = document.activeElement;
  const fechar = () => { if (!festaAberta) return; festaAberta = false; document.removeEventListener('keydown', tecla, true); cx.classList.add('sai'); cx.style.pointerEvents = 'none'; setTimeout(() => { if (cx.isConnected && !festaAberta) raiz.innerHTML = ''; }, semMovimento() ? 0 : KitFacil.movimento.ms); try { ant && ant.focus && ant.focus({ preventScroll: true }); } catch {} aoFechar && aoFechar(); };
  const tecla = e => { if (e.key === 'Escape') { e.preventDefault(); fechar(); } if (e.key === 'Tab') { e.preventDefault(); $('#festa-ok', raiz).focus(); } };
  document.addEventListener('keydown', tecla, true);
  $('#festa-ok', raiz).onclick = fechar;
  requestAnimationFrame(() => {
    $('#festa-t', raiz)?.focus({ preventScroll: true });
    // os pontos contam de zero até o ganho e a barra do nível anda
    const el = $('#festa-pts', raiz), t0 = performance.now(), dur = semMovimento() ? 0 : 900;
    const passo = t => { if (!el.isConnected) return; const k = dur ? Math.min(1, (t - t0) / dur) : 1; el.textContent = '+' + Math.round(ganho * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(passo); };
    requestAnimationFrame(passo);
    setTimeout(() => { const b = $('#festa-barra', raiz); if (b) b.style.width = Math.max(4, para) + '%'; }, 700);
  });
  if (fez.dia || subiu || novas.length) { KitFacil.jogo.confete(cx, 40, ['#DFF65C', '#2742D3', '#6F8BFF', '#FFFFFF', '#17A398', '#F2B33D']); vibrar([20, 60, 20]); } else vibrar(20);
  return true;
}
