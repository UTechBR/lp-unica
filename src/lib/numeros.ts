import { numerosEmpresa } from '../config/empresa';
import { listar } from './conteudo';

/**
 * Números da empresa prontos para exibir: o total de bancos calculado da lista (dezena
 * abaixo, como no hero: 22 vira "20+") seguido dos confirmados em config/empresa.ts.
 */
export async function numerosDaEmpresa(): Promise<{ valor: string; rotulo: string }[]> {
  const totalBancos = (await listar('bancos')).length;
  const bancos = Math.floor((totalBancos - 1) / 10) * 10;
  return [
    { valor: `${bancos}+`, rotulo: 'bancos e financeiras parceiros' },
    ...numerosEmpresa.filter((n) => n.confirmado).map(({ valor, rotulo }) => ({ valor, rotulo })),
  ];
}
