import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import logoAsset from "@/assets/logo.asset.json";
import fundoAsset from "@/assets/fundo.asset.json";
import jumpscareAsset from "@/assets/jumpscare.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FNAF — Sobreviva às Noites" },
      { name: "description", content: "Five Nights at Freddy's: monitore câmeras, economize energia e sobreviva aos animatrônicos." },
      { property: "og:title", content: "FNAF — Sobreviva às Noites" },
      { property: "og:description", content: "Baixe agora e enfrente seus medos." },
      { property: "og:image", content: fundoAsset.url },
    ],
  }),
  component: Index,
});

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function playScream() {
  try {
    const Ctx = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext;
    const ctx = new Ctx();
    const dur = 2.6;
    const sr = ctx.sampleRate;
    const buf = ctx.createBuffer(1, sr * dur, sr);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) {
      const t = i / sr;
      const env = Math.min(1, t * 8) * Math.max(0, 1 - t / dur);
      d[i] = (Math.random() * 2 - 1) * env * 0.9;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 1200;
    filter.Q.value = 0.7;
    const gain = ctx.createGain();
    gain.gain.value = 1.0;
    src.connect(filter).connect(gain).connect(ctx.destination);
    src.start();
    src.stop(ctx.currentTime + dur);
    setTimeout(() => ctx.close(), (dur + 0.2) * 1000);
  } catch {}
}

function Index() {
  useReveal();
  const [scare, setScare] = useState(false);
  const timerRef = useRef<number | null>(null);

  const triggerJumpscare = () => {
    setScare(true);
    playScream();
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setScare(false), 3000);
  };

  useEffect(() => () => { if (timerRef.current) window.clearTimeout(timerRef.current); }, []);

  return (
    <div className="fnaf-root">
      <ParticleField />

      <header className="fnaf-header">
        <a href="#top" className="fnaf-logo">
          <img src={logoAsset.url} alt="Freddy Fazbear's Pizza" />
        </a>
        <nav className="fnaf-nav">
          <a href="#download">Download</a>
          <a href="#sobre">Saiba Mais</a>
          <a href="#ajuda">Ajuda</a>
        </nav>
      </header>

      <section id="top" className="fnaf-hero">
        <div
          className="fnaf-hero-bg"
          style={{ backgroundImage: `url(${fundoAsset.url})` }}
          aria-hidden
        />
        <div className="fnaf-hero-overlay" aria-hidden />
        <div className="fnaf-hero-content">
          <h1 className="fnaf-title glitch" data-text="FNAF">FNAF</h1>
          <p className="fnaf-sub">Sobreviva às noites mais aterrorizantes da história dos videogames.</p>
          <button className="fnaf-btn fnaf-btn-neon" onClick={triggerJumpscare}>
            DOWNLOAD AGORA
          </button>
        </div>
        <div className="fnaf-scanlines" aria-hidden />
      </section>

      <section id="sobre" className="fnaf-section" data-reveal>
        <h2 className="fnaf-h2">Sobre o Jogo</h2>
        <p className="fnaf-lead">
          Five Nights at Freddy's é uma experiência de terror e sobrevivência onde cada noite pode ser sua última.
          Monitore câmeras, economize energia e tente sobreviver aos animatrônicos.
        </p>
        <div className="fnaf-cards">
          {[
            { i: "🕹", t: "Gameplay Intensa" },
            { i: "👁", t: "Vigilância por Câmeras" },
            { i: "😱", t: "Jumpscares Inesquecíveis" },
            { i: "🎧", t: "Terror Imersivo" },
          ].map((c) => (
            <article key={c.t} className="fnaf-card" data-reveal>
              <div className="fnaf-card-ico">{c.i}</div>
              <h3>{c.t}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="fnaf-section" data-reveal>
        <h2 className="fnaf-h2">Recursos</h2>
        <div className="fnaf-grid">
          {[
            "Terror Psicológico",
            "Atmosfera Sombria",
            "Inteligência Artificial dos Animatrônicos",
            "Diversas Noites para Sobreviver",
            "Experiência Clássica de Horror",
          ].map((r) => (
            <div key={r} className="fnaf-feat" data-reveal>
              <span className="fnaf-feat-dot" />
              {r}
            </div>
          ))}
        </div>
      </section>

      <section id="download" className="fnaf-download" data-reveal>
        <div className="fnaf-download-inner">
          <h2 className="fnaf-h2">Pronto para sobreviver?</h2>
          <p className="fnaf-lead">Baixe agora e enfrente seus medos.</p>
          <button className="fnaf-btn fnaf-btn-neon" onClick={triggerJumpscare}>
            FAZER DOWNLOAD
          </button>
        </div>
      </section>

      <section id="ajuda" className="fnaf-section" data-reveal>
        <h2 className="fnaf-h2">Ajuda</h2>
        <div className="fnaf-faq">
          {[
            { q: "O jogo é gratuito?", a: "Existem versões gratuitas para experimentar e edições pagas com conteúdo completo." },
            { q: "Funciona no Windows?", a: "Sim. Compatível com Windows 10/11. Versões móveis também estão disponíveis." },
            { q: "Possui modo offline?", a: "Sim. A campanha principal pode ser jogada totalmente offline." },
            { q: "Qual a classificação indicativa?", a: "Recomendado para maiores de 12 anos. Contém terror e jumpscares." },
          ].map((f) => (
            <details key={f.q} className="fnaf-faq-item" data-reveal>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="fnaf-footer">
        <img src={logoAsset.url} alt="Freddy Fazbear's Pizza" className="fnaf-footer-logo" />
        <p>© 2025 Freddy Fazbear Entertainment.<br />Todos os direitos reservados.</p>
      </footer>

      {scare && (
        <div className="fnaf-jumpscare" role="alert" aria-label="Jumpscare">
          <img src={jumpscareAsset.url} alt="" />
        </div>
      )}
    </div>
  );
}

function ParticleField() {
  const dots = Array.from({ length: 28 });
  return (
    <div className="fnaf-particles" aria-hidden>
      {dots.map((_, i) => (
        <span
          key={i}
          style={{
            left: `${(i * 37) % 100}%`,
            animationDelay: `${(i % 10) * 0.8}s`,
            animationDuration: `${10 + (i % 7) * 2}s`,
          }}
        />
      ))}
    </div>
  );
}
