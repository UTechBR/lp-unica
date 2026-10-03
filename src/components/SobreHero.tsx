import { Container } from './Container';
import { AnimatedSection } from './AnimatedSection';

const stats = [
  { label: 'Bancos parceiros', value: '25+' },
  { label: 'Estados atendidos', value: '27' },
  { label: 'Parceiros ativos', value: '500+' },
  { label: 'Anos de mercado', value: '10+' },
];

export function SobreHero() {
  return (
    <section className="bg-secondary py-16 md:py-20">
      <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <AnimatedSection direction="left">
          <span className="eyebrow text-primary-300">Nossa história</span>
          <h1 className="heading-xl text-balance text-white">Conexões que transformam vidas</h1>
          <p className="mt-6 body-lg text-white/75">
            A Única Promotora nasceu com o propósito de simplificar o acesso ao crédito e às melhores soluções
            financeiras do mercado. Ao longo dos anos, construímos uma rede sólida de parceiros — bancos e
            correspondentes — para entregar agilidade, transparência e confiança a cada cliente atendido.
          </p>
          <p className="mt-4 body-lg text-white/75">
            Hoje somos reconhecidos como uma das promotoras que mais crescem no país, unindo tecnologia e
            atendimento humano para transformar a vida financeira de milhares de brasileiros.
          </p>
        </AnimatedSection>
        <AnimatedSection direction="right" delay={0.15}>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-surface bg-white/5 p-6 text-center backdrop-blur">
                <p className="font-heading text-4xl font-extrabold text-primary-300">{stat.value}</p>
                <p className="mt-1 text-sm text-white/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </Container>
    </section>
  );
}
