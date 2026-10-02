import { Container } from './Container';
import { LeadForm } from './LeadForm';

export function Hero() {
  return (
    <section id="parceirounica" className="scroll-mt-32 bg-white md:pt-[58px]">
      <Container className="px-0 sm:px-0 lg:px-0">
        <h1 className="pb-[80px] pt-[80px] px-[20px] text-center text-[45px] font-heading font-thin leading-[1.1] text-secondary md:px-0 md:pb-[100px] md:pr-[500px] md:pt-[80px] md:text-left md:text-[73px] md:leading-[75px]">
          Transformando vidas com <span className="font-bold text-secondary">Conexões Únicas</span>
        </h1>

        <div
          id="lead-form"
          className="flex w-full max-w-full scroll-mt-32 flex-col shadow-card md:mb-[100px] md:flex-row"
        >
          <div className="min-w-0 bg-secondary md:w-[67%]">
            <LeadForm />
          </div>
          <div className="flex min-w-0 items-center bg-secondary-700 md:w-[32%]">
            <p className="px-[20px] py-[32px] font-heading text-[40px] font-normal leading-[36px] text-white md:pb-[32px] md:pl-[65px] md:pr-[60px] md:pt-[35px] md:text-[34px] md:leading-[29px]">
              Faça parte
              <br />
              da <span className="font-bold">promotora que mais cresce no mercado!</span>
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
