import {
  Apple, BarChart3, BookOpen, Box, Brain, Calendar, CalendarPlus, Crown, Dumbbell, Flame, Flower2, Gamepad2,
  Gift, Image, Moon, Rocket, Scale, Shield, Sparkles, Star, Sun, Target, TreePine, Trophy, UserRound, Users,
  Droplet, Ticket, Palette, BadgeCheck, Leaf, GraduationCap, Home, MoreHorizontal, type LucideProps,
} from 'lucide-react';
import type { ComponentType } from 'react';

/**
 * As telas do Figma usam ilustrações/ícones próprios para guildas, conquistas, desafios e recompensas.
 * Esses arquivos de imagem não foram fornecidos; o backend envia uma CHAVE (string) e aqui mapeamos
 * para um ícone genérico. Trocar por <img> quando os assets oficiais existirem.
 */
const MAPA: Record<string, ComponentType<LucideProps>> = {
  escudo: Shield, flor: Flower2, cerebro: Brain, foguete: Rocket, arvore: TreePine, grafico: BarChart3,
  livro: BookOpen, balanca: Scale, jogo: Gamepad2, halter: Dumbbell, trofeu: Trophy, agua: Droplet,
  meditar: Leaf, fruta: Apple, sol: Sun, lua: Moon, fogo: Flame, grupo: Users, estrela: Star, alvo: Target,
  coroa: Crown, avatar: UserRound, tema: Palette, moldura: Image, cupom: Ticket, calendario: CalendarPlus,
  badge: BadgeCheck, fundo: Image, caixa: Box, presente: Gift, agenda: Calendar, brilho: Sparkles,
  estudos: GraduationCap, casa: Home, outros: MoreHorizontal,
};

/** Categoria da tarefa (tela Criar tarefa, passo 2) → chave de ícone. */
export const ICONE_CATEGORIA: Record<string, string> = {
  Estudos: 'estudos', Saúde: 'halter', 'Bem-estar': 'meditar', Produtividade: 'grafico',
  Leitura: 'livro', 'Vida pessoal': 'casa', Outros: 'outros',
};

export function Icone({ nome, size = 24, ...rest }: { nome: string; size?: number } & LucideProps) {
  const C = MAPA[nome] ?? Star;
  return <C size={size} aria-hidden="true" {...rest} />;
}
