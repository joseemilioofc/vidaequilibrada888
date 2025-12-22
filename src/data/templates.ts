import { ProfessionalTemplate } from '@/types/schedule';

export const professionalTemplates: ProfessionalTemplate[] = [
  {
    id: 'software-dev',
    name: 'Desenvolvimento de Software',
    description: 'Cronograma otimizado para desenvolvedores com foco em deep work e crescimento técnico contínuo.',
    icon: '💻',
    focus: ['Deep Work', 'Crescimento Técnico', 'Equilíbrio'],
    weeklySchedule: {
      days: [
        // Sunday
        {
          dayOfWeek: 0,
          dayName: 'Domingo',
          theme: 'Descanso ou Brainstorm',
          blocks: [
            { id: 'sun-1', startTime: '00:00', endTime: '08:00', title: 'Sono', category: 'sleep' },
            { id: 'sun-2', startTime: '08:00', endTime: '16:00', title: 'Tempo com família', description: 'Descanso, relaxamento, brainstorm de ideias', category: 'leisure' },
            { id: 'sun-3', startTime: '16:00', endTime: '00:00', title: 'Lazer e preparação', description: 'Atividades relaxantes, preparação para a semana', category: 'leisure' },
          ]
        },
        // Monday
        {
          dayOfWeek: 1,
          dayName: 'Segunda-feira',
          theme: 'Planejamento',
          blocks: [
            { id: 'mon-1', startTime: '00:00', endTime: '08:00', title: 'Sono', category: 'sleep' },
            { id: 'mon-2', startTime: '08:00', endTime: '09:00', title: 'Revisão da semana anterior', description: 'Análise do que funcionou e o que precisa melhorar', category: 'work' },
            { id: 'mon-3', startTime: '09:00', endTime: '10:30', title: 'Definir prioridades', description: 'Estabelecer as principais tarefas da semana', category: 'work' },
            { id: 'mon-4', startTime: '10:30', endTime: '11:30', title: 'Dividir tarefas', description: 'Organizar tarefas em blocos diários', category: 'work' },
            { id: 'mon-5', startTime: '11:30', endTime: '12:30', title: 'Preparar ambiente', description: 'Configurar ferramentas e ambiente de trabalho', category: 'work' },
            { id: 'mon-6', startTime: '12:30', endTime: '13:30', title: 'Almoço e pausa', category: 'leisure' },
            { id: 'mon-7', startTime: '13:30', endTime: '15:00', title: 'Oportunidades e inovação', description: 'Pesquisar novas tecnologias e tendências', category: 'work' },
            { id: 'mon-8', startTime: '15:00', endTime: '16:00', title: 'Fechamento do plano', description: 'Finalizar planejamento semanal', category: 'work' },
            { id: 'mon-9', startTime: '16:00', endTime: '17:00', title: 'Exercícios', description: 'Atividade física ou relaxamento', category: 'leisure' },
            { id: 'mon-10', startTime: '17:00', endTime: '19:00', title: 'Jantar e família', category: 'leisure' },
            { id: 'mon-11', startTime: '19:00', endTime: '21:00', title: 'Lazer', description: 'TV, leitura leve, hobbies', category: 'leisure' },
            { id: 'mon-12', startTime: '21:00', endTime: '00:00', title: 'Tempo pessoal', description: 'Relaxar, planejar dia seguinte', category: 'leisure' },
          ]
        },
        // Tuesday
        {
          dayOfWeek: 2,
          dayName: 'Terça-feira',
          theme: 'Execução Técnica',
          blocks: [
            { id: 'tue-1', startTime: '00:00', endTime: '08:00', title: 'Sono', category: 'sleep' },
            { id: 'tue-2', startTime: '08:00', endTime: '09:00', title: 'Preparação do dia', description: 'Revisão de tarefas e setup', category: 'work' },
            { id: 'tue-3', startTime: '09:00', endTime: '11:30', title: 'Deep Work', description: 'Codificação focada, testes', category: 'work' },
            { id: 'tue-4', startTime: '11:30', endTime: '12:00', title: 'Revisão rápida', description: 'Code review e commits', category: 'work' },
            { id: 'tue-5', startTime: '12:00', endTime: '13:30', title: 'Almoço e pausa', category: 'leisure' },
            { id: 'tue-6', startTime: '13:30', endTime: '15:30', title: 'Continuação técnica', description: 'Resolver tarefas, refatorar código', category: 'work' },
            { id: 'tue-7', startTime: '15:30', endTime: '16:00', title: 'Mini revisão', description: 'Commits e documentação', category: 'work' },
            { id: 'tue-8', startTime: '16:00', endTime: '17:00', title: 'Exercícios', category: 'leisure' },
            { id: 'tue-9', startTime: '17:00', endTime: '19:00', title: 'Jantar e família', category: 'leisure' },
            { id: 'tue-10', startTime: '19:00', endTime: '21:00', title: 'Lazer', category: 'leisure' },
            { id: 'tue-11', startTime: '21:00', endTime: '00:00', title: 'Tempo pessoal', category: 'leisure' },
          ]
        },
        // Wednesday
        {
          dayOfWeek: 3,
          dayName: 'Quarta-feira',
          theme: 'Execução Técnica',
          blocks: [
            { id: 'wed-1', startTime: '00:00', endTime: '08:00', title: 'Sono', category: 'sleep' },
            { id: 'wed-2', startTime: '08:00', endTime: '09:00', title: 'Preparação do dia', category: 'work' },
            { id: 'wed-3', startTime: '09:00', endTime: '11:30', title: 'Deep Work', description: 'Codificação focada', category: 'work' },
            { id: 'wed-4', startTime: '11:30', endTime: '12:00', title: 'Revisão rápida', category: 'work' },
            { id: 'wed-5', startTime: '12:00', endTime: '13:30', title: 'Almoço e pausa', category: 'leisure' },
            { id: 'wed-6', startTime: '13:30', endTime: '15:30', title: 'Continuação técnica', category: 'work' },
            { id: 'wed-7', startTime: '15:30', endTime: '16:00', title: 'Mini revisão', category: 'work' },
            { id: 'wed-8', startTime: '16:00', endTime: '17:00', title: 'Exercícios', category: 'leisure' },
            { id: 'wed-9', startTime: '17:00', endTime: '19:00', title: 'Jantar e família', category: 'leisure' },
            { id: 'wed-10', startTime: '19:00', endTime: '21:00', title: 'Lazer', category: 'leisure' },
            { id: 'wed-11', startTime: '21:00', endTime: '00:00', title: 'Tempo pessoal', category: 'leisure' },
          ]
        },
        // Thursday
        {
          dayOfWeek: 4,
          dayName: 'Quinta-feira',
          theme: 'Execução Técnica',
          blocks: [
            { id: 'thu-1', startTime: '00:00', endTime: '08:00', title: 'Sono', category: 'sleep' },
            { id: 'thu-2', startTime: '08:00', endTime: '09:00', title: 'Preparação do dia', category: 'work' },
            { id: 'thu-3', startTime: '09:00', endTime: '11:30', title: 'Deep Work', category: 'work' },
            { id: 'thu-4', startTime: '11:30', endTime: '12:00', title: 'Revisão rápida', category: 'work' },
            { id: 'thu-5', startTime: '12:00', endTime: '13:30', title: 'Almoço e pausa', category: 'leisure' },
            { id: 'thu-6', startTime: '13:30', endTime: '15:30', title: 'Continuação técnica', category: 'work' },
            { id: 'thu-7', startTime: '15:30', endTime: '16:00', title: 'Mini revisão', category: 'work' },
            { id: 'thu-8', startTime: '16:00', endTime: '17:00', title: 'Exercícios', category: 'leisure' },
            { id: 'thu-9', startTime: '17:00', endTime: '19:00', title: 'Jantar e família', category: 'leisure' },
            { id: 'thu-10', startTime: '19:00', endTime: '21:00', title: 'Lazer', category: 'leisure' },
            { id: 'thu-11', startTime: '21:00', endTime: '00:00', title: 'Tempo pessoal', category: 'leisure' },
          ]
        },
        // Friday
        {
          dayOfWeek: 5,
          dayName: 'Sexta-feira',
          theme: 'Clientes e Portfólio',
          blocks: [
            { id: 'fri-1', startTime: '00:00', endTime: '08:00', title: 'Sono', category: 'sleep' },
            { id: 'fri-2', startTime: '08:00', endTime: '09:00', title: 'Planejamento rápido', category: 'work' },
            { id: 'fri-3', startTime: '09:00', endTime: '10:30', title: 'Reuniões com clientes', category: 'work' },
            { id: 'fri-4', startTime: '10:30', endTime: '12:00', title: 'Atendimento e suporte', category: 'work' },
            { id: 'fri-5', startTime: '12:00', endTime: '13:30', title: 'Almoço e pausa', category: 'leisure' },
            { id: 'fri-6', startTime: '13:30', endTime: '15:00', title: 'Atualização de portfólio', description: 'GitHub, LinkedIn, site pessoal', category: 'work' },
            { id: 'fri-7', startTime: '15:00', endTime: '16:00', title: 'Organização interna', description: 'Preparação da próxima semana', category: 'work' },
            { id: 'fri-8', startTime: '16:00', endTime: '17:00', title: 'Exercícios', category: 'leisure' },
            { id: 'fri-9', startTime: '17:00', endTime: '19:00', title: 'Jantar e família', category: 'leisure' },
            { id: 'fri-10', startTime: '19:00', endTime: '21:00', title: 'Lazer', category: 'leisure' },
            { id: 'fri-11', startTime: '21:00', endTime: '00:00', title: 'Tempo pessoal', category: 'leisure' },
          ]
        },
        // Saturday
        {
          dayOfWeek: 6,
          dayName: 'Sábado',
          theme: 'Leitura Leve (Opcional)',
          blocks: [
            { id: 'sat-1', startTime: '00:00', endTime: '08:00', title: 'Sono', category: 'sleep' },
            { id: 'sat-2', startTime: '08:00', endTime: '09:00', title: 'Despertar tranquilo', category: 'leisure' },
            { id: 'sat-3', startTime: '09:00', endTime: '10:00', title: 'Leitura leve', description: 'Artigos, blogs, inspiração', category: 'leisure' },
            { id: 'sat-4', startTime: '10:00', endTime: '11:00', title: 'Estudo opcional', description: 'Mini-curso ou tutorial', category: 'leisure' },
            { id: 'sat-5', startTime: '11:00', endTime: '12:00', title: 'Projetos pessoais', description: 'Experimentos, side projects', category: 'leisure' },
            { id: 'sat-6', startTime: '12:00', endTime: '13:30', title: 'Almoço', category: 'leisure' },
            { id: 'sat-7', startTime: '13:30', endTime: '16:00', title: 'Tempo livre', description: 'Família, hobbies, descanso', category: 'leisure' },
            { id: 'sat-8', startTime: '16:00', endTime: '00:00', title: 'Lazer e família', category: 'leisure' },
          ]
        },
      ]
    },
    goals: {
      daily: [
        { id: 'd1', title: 'Completar as tarefas planejadas para o dia', completed: false, period: 'daily' },
        { id: 'd2', title: 'Fazer pelo menos 1 coisa para melhorar habilidades', completed: false, period: 'daily' },
        { id: 'd3', title: 'Manter foco e produtividade nas horas de trabalho', completed: false, period: 'daily' },
        { id: 'd4', title: 'Cuidar do equilíbrio trabalho-vida (pausas, exercícios)', completed: false, period: 'daily' },
        { id: 'd5', title: 'Revisar o dia e planejar o próximo', completed: false, period: 'daily' },
      ],
      weekly: [
        { id: 'w1', title: 'Segunda: Planejamento completo da semana', completed: false, period: 'weekly' },
        { id: 'w2', title: 'Terça-Quinta: Execução técnica focada', completed: false, period: 'weekly' },
        { id: 'w3', title: 'Sexta: Atendimento a clientes e portfólio', completed: false, period: 'weekly' },
        { id: 'w4', title: 'Fim de semana: Descanso e leitura leve', completed: false, period: 'weekly' },
      ],
      monthly: [
        { id: 'm1', title: 'Completar pelo menos 80% das tarefas planejadas', completed: false, period: 'monthly' },
        { id: 'm2', title: 'Aprender algo novo e aplicar no trabalho', completed: false, period: 'monthly' },
        { id: 'm3', title: 'Conectar-se com 2+ pessoas para networking', completed: false, period: 'monthly' },
        { id: 'm4', title: 'Revisar e ajustar plano para próximo mês', completed: false, period: 'monthly' },
        { id: 'm5', title: 'Manter equilíbrio trabalho-vida', completed: false, period: 'monthly' },
      ],
      quarterly: [
        { id: 'q1', title: 'Finalizar 1 projeto ou recurso importante', completed: false, period: 'quarterly' },
        { id: 'q2', title: 'Aprender nova stack ou tecnologia de IA', completed: false, period: 'quarterly' },
        { id: 'q3', title: 'Atualizar currículo, GitHub e LinkedIn', completed: false, period: 'quarterly' },
      ],
      biannual: [
        { id: 'b1', title: 'Lançar 1 produto, MVP ou serviço', completed: false, period: 'biannual' },
        { id: 'b2', title: 'Participar de networking, comunidade ou evento', completed: false, period: 'biannual' },
      ],
      yearly: [
        { id: 'y1', title: 'Aumentar nível técnico e financeiro', completed: false, period: 'yearly' },
        { id: 'y2', title: 'Fortalecer branding e posicionamento', completed: false, period: 'yearly' },
      ],
      fiveYear: [
        { id: 'f1', title: 'Lançar produto escalável, SaaS ou consultoria', completed: false, period: 'fiveYear' },
        { id: 'f2', title: 'Alcançar liberdade geográfica e influência regional', completed: false, period: 'fiveYear' },
      ],
    }
  },
  {
    id: 'entrepreneur',
    name: 'Empreendedor / Freelancer',
    description: 'Para quem busca autonomia, crescimento financeiro e escala de serviços ou produtos.',
    icon: '🚀',
    focus: ['Autonomia', 'Crescimento Financeiro', 'Escala'],
    weeklySchedule: {
      days: [
        {
          dayOfWeek: 0, dayName: 'Domingo', theme: 'Descanso',
          blocks: [
            { id: 'e-sun-1', startTime: '00:00', endTime: '08:00', title: 'Sono', category: 'sleep' },
            { id: 'e-sun-2', startTime: '08:00', endTime: '16:00', title: 'Família e descanso', category: 'leisure' },
            { id: 'e-sun-3', startTime: '16:00', endTime: '00:00', title: 'Autocuidado', category: 'leisure' },
          ]
        },
        {
          dayOfWeek: 1, dayName: 'Segunda-feira', theme: 'Planejamento e Estratégia',
          blocks: [
            { id: 'e-mon-1', startTime: '00:00', endTime: '08:00', title: 'Sono', category: 'sleep' },
            { id: 'e-mon-2', startTime: '08:00', endTime: '10:00', title: 'Planejamento diário', category: 'work' },
            { id: 'e-mon-3', startTime: '10:00', endTime: '12:00', title: 'Marketing e vendas', category: 'work' },
            { id: 'e-mon-4', startTime: '12:00', endTime: '13:30', title: 'Almoço', category: 'leisure' },
            { id: 'e-mon-5', startTime: '13:30', endTime: '15:30', title: 'Execução de projetos', category: 'work' },
            { id: 'e-mon-6', startTime: '15:30', endTime: '16:00', title: 'Organização financeira', category: 'work' },
            { id: 'e-mon-7', startTime: '16:00', endTime: '00:00', title: 'Lazer/Família', category: 'leisure' },
          ]
        },
        {
          dayOfWeek: 2, dayName: 'Terça-feira', theme: 'Execução',
          blocks: [
            { id: 'e-tue-1', startTime: '00:00', endTime: '08:00', title: 'Sono', category: 'sleep' },
            { id: 'e-tue-2', startTime: '08:00', endTime: '12:00', title: 'Execução de projetos', category: 'work' },
            { id: 'e-tue-3', startTime: '12:00', endTime: '13:30', title: 'Almoço', category: 'leisure' },
            { id: 'e-tue-4', startTime: '13:30', endTime: '16:00', title: 'Atendimento a clientes', category: 'work' },
            { id: 'e-tue-5', startTime: '16:00', endTime: '00:00', title: 'Lazer/Família', category: 'leisure' },
          ]
        },
        {
          dayOfWeek: 3, dayName: 'Quarta-feira', theme: 'Execução',
          blocks: [
            { id: 'e-wed-1', startTime: '00:00', endTime: '08:00', title: 'Sono', category: 'sleep' },
            { id: 'e-wed-2', startTime: '08:00', endTime: '12:00', title: 'Execução de projetos', category: 'work' },
            { id: 'e-wed-3', startTime: '12:00', endTime: '13:30', title: 'Almoço', category: 'leisure' },
            { id: 'e-wed-4', startTime: '13:30', endTime: '16:00', title: 'Atendimento a clientes', category: 'work' },
            { id: 'e-wed-5', startTime: '16:00', endTime: '00:00', title: 'Lazer/Família', category: 'leisure' },
          ]
        },
        {
          dayOfWeek: 4, dayName: 'Quinta-feira', theme: 'Networking',
          blocks: [
            { id: 'e-thu-1', startTime: '00:00', endTime: '08:00', title: 'Sono', category: 'sleep' },
            { id: 'e-thu-2', startTime: '08:00', endTime: '12:00', title: 'Execução de projetos', category: 'work' },
            { id: 'e-thu-3', startTime: '12:00', endTime: '13:30', title: 'Almoço', category: 'leisure' },
            { id: 'e-thu-4', startTime: '13:30', endTime: '16:00', title: 'Networking e parcerias', category: 'work' },
            { id: 'e-thu-5', startTime: '16:00', endTime: '00:00', title: 'Lazer/Família', category: 'leisure' },
          ]
        },
        {
          dayOfWeek: 5, dayName: 'Sexta-feira', theme: 'Fechamento',
          blocks: [
            { id: 'e-fri-1', startTime: '00:00', endTime: '08:00', title: 'Sono', category: 'sleep' },
            { id: 'e-fri-2', startTime: '08:00', endTime: '12:00', title: 'Entregas e follow-ups', category: 'work' },
            { id: 'e-fri-3', startTime: '12:00', endTime: '13:30', title: 'Almoço', category: 'leisure' },
            { id: 'e-fri-4', startTime: '13:30', endTime: '16:00', title: 'Revisão semanal', category: 'work' },
            { id: 'e-fri-5', startTime: '16:00', endTime: '00:00', title: 'Lazer/Família', category: 'leisure' },
          ]
        },
        {
          dayOfWeek: 6, dayName: 'Sábado', theme: 'Descanso',
          blocks: [
            { id: 'e-sat-1', startTime: '00:00', endTime: '08:00', title: 'Sono', category: 'sleep' },
            { id: 'e-sat-2', startTime: '08:00', endTime: '16:00', title: 'Família e hobbies', category: 'leisure' },
            { id: 'e-sat-3', startTime: '16:00', endTime: '00:00', title: 'Networking social', category: 'leisure' },
          ]
        },
      ]
    },
    goals: {
      daily: [{ id: 'ed1', title: 'Completar tarefas prioritárias', completed: false, period: 'daily' }],
      weekly: [{ id: 'ew1', title: 'Fechar ao menos 1 negócio ou avanço', completed: false, period: 'weekly' }],
      monthly: [{ id: 'em1', title: 'Aumentar receita em 10%', completed: false, period: 'monthly' }],
      quarterly: [{ id: 'eq1', title: 'Lançar nova oferta de serviço', completed: false, period: 'quarterly' }],
      biannual: [{ id: 'eb1', title: 'Expandir para novo mercado', completed: false, period: 'biannual' }],
      yearly: [{ id: 'ey1', title: 'Dobrar faturamento', completed: false, period: 'yearly' }],
      fiveYear: [{ id: 'ef1', title: 'Construir empresa com equipe', completed: false, period: 'fiveYear' }],
    }
  },
  {
    id: 'student',
    name: 'Estudante Universitário',
    description: 'Focado em aprendizado consistente, equilíbrio mental e desenvolvimento pessoal.',
    icon: '📚',
    focus: ['Aprendizado', 'Equilíbrio Mental', 'Desenvolvimento Pessoal'],
    weeklySchedule: {
      days: [
        {
          dayOfWeek: 0, dayName: 'Domingo', theme: 'Descanso',
          blocks: [
            { id: 's-sun-1', startTime: '00:00', endTime: '09:00', title: 'Sono', category: 'sleep' },
            { id: 's-sun-2', startTime: '09:00', endTime: '16:00', title: 'Tempo livre', category: 'leisure' },
            { id: 's-sun-3', startTime: '16:00', endTime: '23:00', title: 'Preparação da semana', category: 'leisure' },
            { id: 's-sun-4', startTime: '23:00', endTime: '00:00', title: 'Preparação para dormir', category: 'sleep' },
          ]
        },
        {
          dayOfWeek: 1, dayName: 'Segunda-feira', theme: 'Aulas',
          blocks: [
            { id: 's-mon-1', startTime: '00:00', endTime: '07:00', title: 'Sono', category: 'sleep' },
            { id: 's-mon-2', startTime: '07:00', endTime: '08:00', title: 'Preparação', category: 'leisure' },
            { id: 's-mon-3', startTime: '08:00', endTime: '12:00', title: 'Aulas', category: 'work' },
            { id: 's-mon-4', startTime: '12:00', endTime: '13:30', title: 'Almoço', category: 'leisure' },
            { id: 's-mon-5', startTime: '13:30', endTime: '16:00', title: 'Estudo focado', category: 'work' },
            { id: 's-mon-6', startTime: '16:00', endTime: '23:00', title: 'Lazer e amigos', category: 'leisure' },
            { id: 's-mon-7', startTime: '23:00', endTime: '00:00', title: 'Preparação para dormir', category: 'sleep' },
          ]
        },
        {
          dayOfWeek: 2, dayName: 'Terça-feira', theme: 'Aulas',
          blocks: [
            { id: 's-tue-1', startTime: '00:00', endTime: '07:00', title: 'Sono', category: 'sleep' },
            { id: 's-tue-2', startTime: '07:00', endTime: '08:00', title: 'Preparação', category: 'leisure' },
            { id: 's-tue-3', startTime: '08:00', endTime: '12:00', title: 'Aulas', category: 'work' },
            { id: 's-tue-4', startTime: '12:00', endTime: '13:30', title: 'Almoço', category: 'leisure' },
            { id: 's-tue-5', startTime: '13:30', endTime: '16:00', title: 'Trabalhos e projetos', category: 'work' },
            { id: 's-tue-6', startTime: '16:00', endTime: '23:00', title: 'Exercícios e lazer', category: 'leisure' },
            { id: 's-tue-7', startTime: '23:00', endTime: '00:00', title: 'Preparação para dormir', category: 'sleep' },
          ]
        },
        {
          dayOfWeek: 3, dayName: 'Quarta-feira', theme: 'Aulas',
          blocks: [
            { id: 's-wed-1', startTime: '00:00', endTime: '07:00', title: 'Sono', category: 'sleep' },
            { id: 's-wed-2', startTime: '07:00', endTime: '08:00', title: 'Preparação', category: 'leisure' },
            { id: 's-wed-3', startTime: '08:00', endTime: '12:00', title: 'Aulas', category: 'work' },
            { id: 's-wed-4', startTime: '12:00', endTime: '13:30', title: 'Almoço', category: 'leisure' },
            { id: 's-wed-5', startTime: '13:30', endTime: '16:00', title: 'Revisões', category: 'work' },
            { id: 's-wed-6', startTime: '16:00', endTime: '23:00', title: 'Lazer e amigos', category: 'leisure' },
            { id: 's-wed-7', startTime: '23:00', endTime: '00:00', title: 'Preparação para dormir', category: 'sleep' },
          ]
        },
        {
          dayOfWeek: 4, dayName: 'Quinta-feira', theme: 'Aulas',
          blocks: [
            { id: 's-thu-1', startTime: '00:00', endTime: '07:00', title: 'Sono', category: 'sleep' },
            { id: 's-thu-2', startTime: '07:00', endTime: '08:00', title: 'Preparação', category: 'leisure' },
            { id: 's-thu-3', startTime: '08:00', endTime: '12:00', title: 'Aulas', category: 'work' },
            { id: 's-thu-4', startTime: '12:00', endTime: '13:30', title: 'Almoço', category: 'leisure' },
            { id: 's-thu-5', startTime: '13:30', endTime: '16:00', title: 'Estudo focado', category: 'work' },
            { id: 's-thu-6', startTime: '16:00', endTime: '23:00', title: 'Leitura leve', category: 'leisure' },
            { id: 's-thu-7', startTime: '23:00', endTime: '00:00', title: 'Preparação para dormir', category: 'sleep' },
          ]
        },
        {
          dayOfWeek: 5, dayName: 'Sexta-feira', theme: 'Aulas',
          blocks: [
            { id: 's-fri-1', startTime: '00:00', endTime: '07:00', title: 'Sono', category: 'sleep' },
            { id: 's-fri-2', startTime: '07:00', endTime: '08:00', title: 'Preparação', category: 'leisure' },
            { id: 's-fri-3', startTime: '08:00', endTime: '12:00', title: 'Aulas', category: 'work' },
            { id: 's-fri-4', startTime: '12:00', endTime: '13:30', title: 'Almoço', category: 'leisure' },
            { id: 's-fri-5', startTime: '13:30', endTime: '16:00', title: 'Trabalhos e projetos', category: 'work' },
            { id: 's-fri-6', startTime: '16:00', endTime: '00:00', title: 'Vida social', category: 'leisure' },
          ]
        },
        {
          dayOfWeek: 6, dayName: 'Sábado', theme: 'Descanso',
          blocks: [
            { id: 's-sat-1', startTime: '00:00', endTime: '09:00', title: 'Sono', category: 'sleep' },
            { id: 's-sat-2', startTime: '09:00', endTime: '00:00', title: 'Lazer e amigos', category: 'leisure' },
          ]
        },
      ]
    },
    goals: {
      daily: [{ id: 'sd1', title: 'Revisar conteúdo das aulas', completed: false, period: 'daily' }],
      weekly: [{ id: 'sw1', title: 'Completar tarefas acadêmicas', completed: false, period: 'weekly' }],
      monthly: [{ id: 'sm1', title: 'Manter média acima de 7', completed: false, period: 'monthly' }],
      quarterly: [{ id: 'sq1', title: 'Iniciar projeto de pesquisa', completed: false, period: 'quarterly' }],
      biannual: [{ id: 'sb1', title: 'Fazer estágio ou iniciação científica', completed: false, period: 'biannual' }],
      yearly: [{ id: 'sy1', title: 'Avançar um período acadêmico', completed: false, period: 'yearly' }],
      fiveYear: [{ id: 'sf1', title: 'Concluir graduação com excelência', completed: false, period: 'fiveYear' }],
    }
  },
  {
    id: 'teacher',
    name: 'Professor / Educador',
    description: 'Voltado para qualidade de ensino, organização e saúde mental.',
    icon: '👨‍🏫',
    focus: ['Qualidade de Ensino', 'Organização', 'Saúde Mental'],
    weeklySchedule: {
      days: [
        {
          dayOfWeek: 0, dayName: 'Domingo', theme: 'Descanso',
          blocks: [
            { id: 't-sun-1', startTime: '00:00', endTime: '08:00', title: 'Sono', category: 'sleep' },
            { id: 't-sun-2', startTime: '08:00', endTime: '16:00', title: 'Família e descanso', category: 'leisure' },
            { id: 't-sun-3', startTime: '16:00', endTime: '00:00', title: 'Leitura e preparação leve', category: 'leisure' },
          ]
        },
        {
          dayOfWeek: 1, dayName: 'Segunda-feira', theme: 'Ensino',
          blocks: [
            { id: 't-mon-1', startTime: '00:00', endTime: '06:00', title: 'Sono', category: 'sleep' },
            { id: 't-mon-2', startTime: '06:00', endTime: '08:00', title: 'Preparação de aulas', category: 'work' },
            { id: 't-mon-3', startTime: '08:00', endTime: '12:00', title: 'Ensino', category: 'work' },
            { id: 't-mon-4', startTime: '12:00', endTime: '13:30', title: 'Almoço', category: 'leisure' },
            { id: 't-mon-5', startTime: '13:30', endTime: '16:00', title: 'Correções', category: 'work' },
            { id: 't-mon-6', startTime: '16:00', endTime: '22:00', title: 'Família e lazer', category: 'leisure' },
            { id: 't-mon-7', startTime: '22:00', endTime: '00:00', title: 'Descanso', category: 'sleep' },
          ]
        },
        {
          dayOfWeek: 2, dayName: 'Terça-feira', theme: 'Ensino',
          blocks: [
            { id: 't-tue-1', startTime: '00:00', endTime: '06:00', title: 'Sono', category: 'sleep' },
            { id: 't-tue-2', startTime: '06:00', endTime: '08:00', title: 'Preparação', category: 'work' },
            { id: 't-tue-3', startTime: '08:00', endTime: '12:00', title: 'Ensino', category: 'work' },
            { id: 't-tue-4', startTime: '12:00', endTime: '13:30', title: 'Almoço', category: 'leisure' },
            { id: 't-tue-5', startTime: '13:30', endTime: '16:00', title: 'Planejamento pedagógico', category: 'work' },
            { id: 't-tue-6', startTime: '16:00', endTime: '22:00', title: 'Família e lazer', category: 'leisure' },
            { id: 't-tue-7', startTime: '22:00', endTime: '00:00', title: 'Descanso', category: 'sleep' },
          ]
        },
        {
          dayOfWeek: 3, dayName: 'Quarta-feira', theme: 'Ensino',
          blocks: [
            { id: 't-wed-1', startTime: '00:00', endTime: '06:00', title: 'Sono', category: 'sleep' },
            { id: 't-wed-2', startTime: '06:00', endTime: '08:00', title: 'Preparação', category: 'work' },
            { id: 't-wed-3', startTime: '08:00', endTime: '12:00', title: 'Ensino', category: 'work' },
            { id: 't-wed-4', startTime: '12:00', endTime: '13:30', title: 'Almoço', category: 'leisure' },
            { id: 't-wed-5', startTime: '13:30', endTime: '16:00', title: 'Correções', category: 'work' },
            { id: 't-wed-6', startTime: '16:00', endTime: '22:00', title: 'Família e lazer', category: 'leisure' },
            { id: 't-wed-7', startTime: '22:00', endTime: '00:00', title: 'Descanso', category: 'sleep' },
          ]
        },
        {
          dayOfWeek: 4, dayName: 'Quinta-feira', theme: 'Ensino',
          blocks: [
            { id: 't-thu-1', startTime: '00:00', endTime: '06:00', title: 'Sono', category: 'sleep' },
            { id: 't-thu-2', startTime: '06:00', endTime: '08:00', title: 'Preparação', category: 'work' },
            { id: 't-thu-3', startTime: '08:00', endTime: '12:00', title: 'Ensino', category: 'work' },
            { id: 't-thu-4', startTime: '12:00', endTime: '13:30', title: 'Almoço', category: 'leisure' },
            { id: 't-thu-5', startTime: '13:30', endTime: '16:00', title: 'Atualização profissional', category: 'work' },
            { id: 't-thu-6', startTime: '16:00', endTime: '22:00', title: 'Família e lazer', category: 'leisure' },
            { id: 't-thu-7', startTime: '22:00', endTime: '00:00', title: 'Descanso', category: 'sleep' },
          ]
        },
        {
          dayOfWeek: 5, dayName: 'Sexta-feira', theme: 'Ensino',
          blocks: [
            { id: 't-fri-1', startTime: '00:00', endTime: '06:00', title: 'Sono', category: 'sleep' },
            { id: 't-fri-2', startTime: '06:00', endTime: '08:00', title: 'Preparação', category: 'work' },
            { id: 't-fri-3', startTime: '08:00', endTime: '12:00', title: 'Ensino', category: 'work' },
            { id: 't-fri-4', startTime: '12:00', endTime: '13:30', title: 'Almoço', category: 'leisure' },
            { id: 't-fri-5', startTime: '13:30', endTime: '16:00', title: 'Fechamento semanal', category: 'work' },
            { id: 't-fri-6', startTime: '16:00', endTime: '00:00', title: 'Lazer e descanso', category: 'leisure' },
          ]
        },
        {
          dayOfWeek: 6, dayName: 'Sábado', theme: 'Descanso',
          blocks: [
            { id: 't-sat-1', startTime: '00:00', endTime: '08:00', title: 'Sono', category: 'sleep' },
            { id: 't-sat-2', startTime: '08:00', endTime: '00:00', title: 'Família e lazer', category: 'leisure' },
          ]
        },
      ]
    },
    goals: {
      daily: [{ id: 'td1', title: 'Preparar aulas com qualidade', completed: false, period: 'daily' }],
      weekly: [{ id: 'tw1', title: 'Corrigir todas as avaliações pendentes', completed: false, period: 'weekly' }],
      monthly: [{ id: 'tm1', title: 'Implementar nova metodologia', completed: false, period: 'monthly' }],
      quarterly: [{ id: 'tq1', title: 'Fazer curso de atualização', completed: false, period: 'quarterly' }],
      biannual: [{ id: 'tb1', title: 'Publicar artigo ou material didático', completed: false, period: 'biannual' }],
      yearly: [{ id: 'ty1', title: 'Receber feedback positivo dos alunos', completed: false, period: 'yearly' }],
      fiveYear: [{ id: 'tf1', title: 'Tornar-se referência na área', completed: false, period: 'fiveYear' }],
    }
  },
  {
    id: 'health-professional',
    name: 'Profissional de Saúde',
    description: 'Foco em energia, bem-estar e prevenção de burnout.',
    icon: '⚕️',
    focus: ['Energia', 'Bem-estar', 'Prevenção de Burnout'],
    weeklySchedule: {
      days: [
        {
          dayOfWeek: 0, dayName: 'Domingo', theme: 'Recuperação',
          blocks: [
            { id: 'h-sun-1', startTime: '00:00', endTime: '09:00', title: 'Sono reparador', category: 'sleep' },
            { id: 'h-sun-2', startTime: '09:00', endTime: '16:00', title: 'Família e descanso', category: 'leisure' },
            { id: 'h-sun-3', startTime: '16:00', endTime: '21:00', title: 'Autocuidado', category: 'leisure' },
            { id: 'h-sun-4', startTime: '21:00', endTime: '00:00', title: 'Preparação para dormir', category: 'sleep' },
          ]
        },
        {
          dayOfWeek: 1, dayName: 'Segunda-feira', theme: 'Atendimento',
          blocks: [
            { id: 'h-mon-1', startTime: '00:00', endTime: '06:00', title: 'Sono', category: 'sleep' },
            { id: 'h-mon-2', startTime: '06:00', endTime: '07:00', title: 'Preparação', category: 'leisure' },
            { id: 'h-mon-3', startTime: '07:00', endTime: '12:00', title: 'Atendimento', category: 'work' },
            { id: 'h-mon-4', startTime: '12:00', endTime: '13:30', title: 'Almoço', category: 'leisure' },
            { id: 'h-mon-5', startTime: '13:30', endTime: '15:00', title: 'Registros', category: 'work' },
            { id: 'h-mon-6', startTime: '15:00', endTime: '16:00', title: 'Atualização técnica', category: 'work' },
            { id: 'h-mon-7', startTime: '16:00', endTime: '21:00', title: 'Descanso e família', category: 'leisure' },
            { id: 'h-mon-8', startTime: '21:00', endTime: '00:00', title: 'Sono', category: 'sleep' },
          ]
        },
        {
          dayOfWeek: 2, dayName: 'Terça-feira', theme: 'Atendimento',
          blocks: [
            { id: 'h-tue-1', startTime: '00:00', endTime: '06:00', title: 'Sono', category: 'sleep' },
            { id: 'h-tue-2', startTime: '06:00', endTime: '07:00', title: 'Preparação', category: 'leisure' },
            { id: 'h-tue-3', startTime: '07:00', endTime: '12:00', title: 'Atendimento', category: 'work' },
            { id: 'h-tue-4', startTime: '12:00', endTime: '13:30', title: 'Almoço', category: 'leisure' },
            { id: 'h-tue-5', startTime: '13:30', endTime: '16:00', title: 'Registros e atualização', category: 'work' },
            { id: 'h-tue-6', startTime: '16:00', endTime: '21:00', title: 'Descanso e família', category: 'leisure' },
            { id: 'h-tue-7', startTime: '21:00', endTime: '00:00', title: 'Sono', category: 'sleep' },
          ]
        },
        {
          dayOfWeek: 3, dayName: 'Quarta-feira', theme: 'Atendimento',
          blocks: [
            { id: 'h-wed-1', startTime: '00:00', endTime: '06:00', title: 'Sono', category: 'sleep' },
            { id: 'h-wed-2', startTime: '06:00', endTime: '07:00', title: 'Preparação', category: 'leisure' },
            { id: 'h-wed-3', startTime: '07:00', endTime: '12:00', title: 'Atendimento', category: 'work' },
            { id: 'h-wed-4', startTime: '12:00', endTime: '13:30', title: 'Almoço', category: 'leisure' },
            { id: 'h-wed-5', startTime: '13:30', endTime: '16:00', title: 'Registros e atualização', category: 'work' },
            { id: 'h-wed-6', startTime: '16:00', endTime: '21:00', title: 'Descanso e família', category: 'leisure' },
            { id: 'h-wed-7', startTime: '21:00', endTime: '00:00', title: 'Sono', category: 'sleep' },
          ]
        },
        {
          dayOfWeek: 4, dayName: 'Quinta-feira', theme: 'Atendimento',
          blocks: [
            { id: 'h-thu-1', startTime: '00:00', endTime: '06:00', title: 'Sono', category: 'sleep' },
            { id: 'h-thu-2', startTime: '06:00', endTime: '07:00', title: 'Preparação', category: 'leisure' },
            { id: 'h-thu-3', startTime: '07:00', endTime: '12:00', title: 'Atendimento', category: 'work' },
            { id: 'h-thu-4', startTime: '12:00', endTime: '13:30', title: 'Almoço', category: 'leisure' },
            { id: 'h-thu-5', startTime: '13:30', endTime: '16:00', title: 'Registros e atualização', category: 'work' },
            { id: 'h-thu-6', startTime: '16:00', endTime: '21:00', title: 'Descanso e família', category: 'leisure' },
            { id: 'h-thu-7', startTime: '21:00', endTime: '00:00', title: 'Sono', category: 'sleep' },
          ]
        },
        {
          dayOfWeek: 5, dayName: 'Sexta-feira', theme: 'Atendimento',
          blocks: [
            { id: 'h-fri-1', startTime: '00:00', endTime: '06:00', title: 'Sono', category: 'sleep' },
            { id: 'h-fri-2', startTime: '06:00', endTime: '07:00', title: 'Preparação', category: 'leisure' },
            { id: 'h-fri-3', startTime: '07:00', endTime: '12:00', title: 'Atendimento', category: 'work' },
            { id: 'h-fri-4', startTime: '12:00', endTime: '13:30', title: 'Almoço', category: 'leisure' },
            { id: 'h-fri-5', startTime: '13:30', endTime: '16:00', title: 'Fechamento semanal', category: 'work' },
            { id: 'h-fri-6', startTime: '16:00', endTime: '00:00', title: 'Lazer e recuperação', category: 'leisure' },
          ]
        },
        {
          dayOfWeek: 6, dayName: 'Sábado', theme: 'Recuperação',
          blocks: [
            { id: 'h-sat-1', startTime: '00:00', endTime: '09:00', title: 'Sono reparador', category: 'sleep' },
            { id: 'h-sat-2', startTime: '09:00', endTime: '00:00', title: 'Família e autocuidado', category: 'leisure' },
          ]
        },
      ]
    },
    goals: {
      daily: [{ id: 'hd1', title: 'Cuidar de si mesmo', completed: false, period: 'daily' }],
      weekly: [{ id: 'hw1', title: 'Manter equilíbrio emocional', completed: false, period: 'weekly' }],
      monthly: [{ id: 'hm1', title: 'Fazer atividade física regularmente', completed: false, period: 'monthly' }],
      quarterly: [{ id: 'hq1', title: 'Atualizar-se profissionalmente', completed: false, period: 'quarterly' }],
      biannual: [{ id: 'hb1', title: 'Fazer check-up completo', completed: false, period: 'biannual' }],
      yearly: [{ id: 'hy1', title: 'Prevenir burnout efetivamente', completed: false, period: 'yearly' }],
      fiveYear: [{ id: 'hf1', title: 'Equilibrar carreira e vida pessoal', completed: false, period: 'fiveYear' }],
    }
  },
  {
    id: 'content-creator',
    name: 'Criador de Conteúdo / Marketing',
    description: 'Para quem busca consistência, criatividade e crescimento de audiência.',
    icon: '🎬',
    focus: ['Consistência', 'Criatividade', 'Crescimento de Audiência'],
    weeklySchedule: {
      days: [
        {
          dayOfWeek: 0, dayName: 'Domingo', theme: 'Inspiração',
          blocks: [
            { id: 'c-sun-1', startTime: '00:00', endTime: '09:00', title: 'Sono', category: 'sleep' },
            { id: 'c-sun-2', startTime: '09:00', endTime: '12:00', title: 'Consumo criativo', description: 'Assistir, ler, inspirar-se', category: 'leisure' },
            { id: 'c-sun-3', startTime: '12:00', endTime: '00:00', title: 'Vida social e descanso', category: 'leisure' },
          ]
        },
        {
          dayOfWeek: 1, dayName: 'Segunda-feira', theme: 'Planejamento',
          blocks: [
            { id: 'c-mon-1', startTime: '00:00', endTime: '08:00', title: 'Sono', category: 'sleep' },
            { id: 'c-mon-2', startTime: '08:00', endTime: '10:00', title: 'Estratégia de conteúdo', category: 'work' },
            { id: 'c-mon-3', startTime: '10:00', endTime: '12:00', title: 'Análise de métricas', category: 'work' },
            { id: 'c-mon-4', startTime: '12:00', endTime: '13:30', title: 'Almoço', category: 'leisure' },
            { id: 'c-mon-5', startTime: '13:30', endTime: '16:00', title: 'Planejamento semanal', category: 'work' },
            { id: 'c-mon-6', startTime: '16:00', endTime: '00:00', title: 'Lazer e inspiração', category: 'leisure' },
          ]
        },
        {
          dayOfWeek: 2, dayName: 'Terça-feira', theme: 'Criação',
          blocks: [
            { id: 'c-tue-1', startTime: '00:00', endTime: '08:00', title: 'Sono', category: 'sleep' },
            { id: 'c-tue-2', startTime: '08:00', endTime: '12:00', title: 'Criação de conteúdo', category: 'work' },
            { id: 'c-tue-3', startTime: '12:00', endTime: '13:30', title: 'Almoço', category: 'leisure' },
            { id: 'c-tue-4', startTime: '13:30', endTime: '16:00', title: 'Edição', category: 'work' },
            { id: 'c-tue-5', startTime: '16:00', endTime: '00:00', title: 'Lazer', category: 'leisure' },
          ]
        },
        {
          dayOfWeek: 3, dayName: 'Quarta-feira', theme: 'Criação',
          blocks: [
            { id: 'c-wed-1', startTime: '00:00', endTime: '08:00', title: 'Sono', category: 'sleep' },
            { id: 'c-wed-2', startTime: '08:00', endTime: '12:00', title: 'Criação de conteúdo', category: 'work' },
            { id: 'c-wed-3', startTime: '12:00', endTime: '13:30', title: 'Almoço', category: 'leisure' },
            { id: 'c-wed-4', startTime: '13:30', endTime: '16:00', title: 'Edição', category: 'work' },
            { id: 'c-wed-5', startTime: '16:00', endTime: '00:00', title: 'Lazer', category: 'leisure' },
          ]
        },
        {
          dayOfWeek: 4, dayName: 'Quinta-feira', theme: 'Publicação',
          blocks: [
            { id: 'c-thu-1', startTime: '00:00', endTime: '08:00', title: 'Sono', category: 'sleep' },
            { id: 'c-thu-2', startTime: '08:00', endTime: '12:00', title: 'Finalização e publicação', category: 'work' },
            { id: 'c-thu-3', startTime: '12:00', endTime: '13:30', title: 'Almoço', category: 'leisure' },
            { id: 'c-thu-4', startTime: '13:30', endTime: '16:00', title: 'Engajamento com audiência', category: 'work' },
            { id: 'c-thu-5', startTime: '16:00', endTime: '00:00', title: 'Lazer', category: 'leisure' },
          ]
        },
        {
          dayOfWeek: 5, dayName: 'Sexta-feira', theme: 'Análise',
          blocks: [
            { id: 'c-fri-1', startTime: '00:00', endTime: '08:00', title: 'Sono', category: 'sleep' },
            { id: 'c-fri-2', startTime: '08:00', endTime: '12:00', title: 'Análise de performance', category: 'work' },
            { id: 'c-fri-3', startTime: '12:00', endTime: '13:30', title: 'Almoço', category: 'leisure' },
            { id: 'c-fri-4', startTime: '13:30', endTime: '16:00', title: 'Networking e parcerias', category: 'work' },
            { id: 'c-fri-5', startTime: '16:00', endTime: '00:00', title: 'Vida social', category: 'leisure' },
          ]
        },
        {
          dayOfWeek: 6, dayName: 'Sábado', theme: 'Descanso',
          blocks: [
            { id: 'c-sat-1', startTime: '00:00', endTime: '09:00', title: 'Sono', category: 'sleep' },
            { id: 'c-sat-2', startTime: '09:00', endTime: '00:00', title: 'Lazer e vida social', category: 'leisure' },
          ]
        },
      ]
    },
    goals: {
      daily: [{ id: 'cd1', title: 'Criar ou editar conteúdo', completed: false, period: 'daily' }],
      weekly: [{ id: 'cw1', title: 'Publicar ao menos 3 conteúdos', completed: false, period: 'weekly' }],
      monthly: [{ id: 'cm1', title: 'Crescer 10% em seguidores', completed: false, period: 'monthly' }],
      quarterly: [{ id: 'cq1', title: 'Lançar nova série ou formato', completed: false, period: 'quarterly' }],
      biannual: [{ id: 'cb1', title: 'Fechar parceria com marca', completed: false, period: 'biannual' }],
      yearly: [{ id: 'cy1', title: 'Monetizar conteúdo', completed: false, period: 'yearly' }],
      fiveYear: [{ id: 'cf1', title: 'Tornar-se referência no nicho', completed: false, period: 'fiveYear' }],
    }
  },
];

export const motivationalQuotes = [
  "Planeje seu dia, organize sua semana e construa sua vida com equilíbrio.",
  "Cada hora bem planejada é um passo em direção aos seus sonhos.",
  "O equilíbrio não é algo que você encontra, é algo que você cria.",
  "Pequenas mudanças diárias levam a grandes transformações.",
  "Seu tempo é seu recurso mais precioso. Use-o com sabedoria.",
  "O sucesso é a soma de pequenos esforços repetidos dia após dia.",
  "Viva com propósito, trabalhe com foco, descanse com intenção.",
  "A consistência é mais importante que a perfeição.",
];

export function getRandomQuote(): string {
  return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
}
