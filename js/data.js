// Dados do curso "Boas Práticas na Receção" — Ribeira Palace
// Caminhos de assets relativos à página do curso, na raiz do projeto (pasta assets/ está ao lado)

const A = "assets/";

const ASSETS = {
  capaEntrada: A + "layout_capa_entrada/entrada/entrada.jpg",
  logoSymbol: A + "logotipo_tipografia_ribeira_palace/simbolo/logotipo_ribeira_palace.png",
  bandeira: {
    pt: A + "bandeiras_idiomas/portugal_16397715.svg",
    en: A + "bandeiras_idiomas/united-kingdom_555417.svg",
  },
  // Versões já redondas — só para o ícone da barra superior (ver btnLang em
  // main.js). As de cima (retangulares) continuam a ser usadas no ecrã de
  // escolha de idioma, que não mudou.
  bandeiraRound: {
    pt: A + "bandeiras_idiomas/round/pt_16022550.svg",
    en: A + "bandeiras_idiomas/round/flag_12360604.svg",
  },
  drone: A + "drone_topo_cidade_ate_fachada/final/drone_topo_cidade_ate_fachada_v2.mp4",
  // Versão leve para telemóvel (ver isTouchDevice() em main.js) — mesmo
  // plano, exportado com muito menos peso/qualidade para redes móveis
  // fracas. Se este ficheiro ainda não existir, o <video> em main.js cai
  // automaticamente para "drone" (ver <source> por ordem em renderVideo).
  droneMobile: A + "drone_topo_cidade_ate_fachada/final/drone_topo_cidade_ate_fachada_mobile.mp4",
  fachada: A + "fachada_hotel/final/fachada_v2.jpg",
  receção: A + "receção/final/rececao_v2.jpg",
  topbar: A + "layout_barra_superior/final/layout_barra_superior.png",
  resumoSituacao: A + "layout_resumo_situação_escolha_multipla/final/layout_resumo_situação_escolha_multipla.png",
  menuBg: A + "layout_menu/assets/layout_menu_background/layout_menu_background.jpg",
  menuPersonagens: A + "layout_menu/assets/personagens/layout_menu_personagens.png",
  menuCard: (n, estado) => `${A}layout_menu/cards/card_modulo_${n}_${estado}.png`,
  joana: (pose) => `${A}layout_fala_joana/final/guia_joana_receção_pose_${pose}.png`,
  cliente: (n) => `${A}layout_fala_cliente_modulo_${n}/final/layout_fala_cliente_modulo_${n}.png`,
  utilizador: (n) => (n === 2 || n === 4)
    ? A + "layout_fala_utilizador_modulo_2_e_4/final/layout_fala_utilizador_modulo_1_e_3.png"
    : A + "layout_fala_utilizador_modulo_1_e_3/final/layout_fala_utilizador_modulo_1_e_3.png",
  // Falas geradas por text-to-speech (ver guiao/Falas_TTS_Ribeira_Palace.docx
  // e guiao/build_falas_tts.js para a lista de referências) — cada ficheiro
  // vive em assets/sfx_falas/<pasta>/[REFERÊNCIA].mp3. Nem toda a referência
  // tem já ficheiro gravado; a falta de um só significa que essa fala ainda
  // toca sem áudio (ver playFala em main.js). Convertidos de .wav (gravação
  // original) para .mp3 (96kbps mono) para reduzir o peso do curso a
  // carregar — sem perda percetível numa gravação de voz a 24kHz.
  // Em inglês, os ficheiros vivem numa subpasta paralela "eng_version/" (mesma
  // estrutura de pastas) e o nome de cada ficheiro leva o prefixo "EN." (ver
  // guiao/build_falas_tts_en.js) — para nunca haver confusão com os áudios PT
  // mesmo lado a lado na mesma árvore de assets.
  fala: (folder, ref, lang) => {
    const dir = lang === "en" ? "eng_version/" : "";
    const prefix = lang === "en" ? "EN." : "";
    return `${A}sfx_falas/${dir}${folder}/[${prefix}${ref}].mp3`;
  },
  sfx: {
    tel1: A + "sfx_telefone_a_tocar_1/sfx_telefone_a_tocar_1.mp3",
    tel2: A + "sfx_telefone_a_tocar_2/sfx_telefone_a_tocar_2.mp3",
    email: A + "sfx_email_notificacao/sfx_email_notificacao.mp3",
    correta: A + "sfx_resposta_correta/sfx_resposta_correta.mp3",
    errada: A + "sfx_resposta_errada/sfx_resposta_errada.mp3",
    hover: A + "sfx_mouse_por_cima_de_algo_clicavel/sfx_mouse_por_cima_de_algo_clicavel.mp3",
    ambienteInterior: A + "sfx_ambiente_interior_hotel/sfx_ambiente_interior_hotel.mp3",
    ambienteExterior: A + "sfx_ambiente_exterior/sfx_ambiente_exterior.mp3",
    suspense: A + "sfx_suspense_perguntas/sfx_suspense_perguntas.mp3",
  },
  // Playlist de música de fundo (ver setAmbient/playCurrentTrack em main.js) —
  // toca em loop contínuo ao longo de todo o curso, capa e menu incluídos.
  musica: [
    A + "musica_ambiente/ES_Mixed Feelings - Magnus Ludvigsson.mp3",
    A + "musica_ambiente/ES_Rambla Principal - Vendla.mp3",
    A + "musica_ambiente/ES_Spring Evening - Vendla.mp3",
    A + "musica_ambiente/ES_Storvindeln - Bladverk Band.mp3",
  ],
};

// Posições dos círculos de destaque sobre o fundo da receção (percentagens, ajustáveis)
const HOTSPOTS = {
  "left-phone": { left: "17%", top: "83%", label: "Telefone (esquerda)" },
  "right-phone": { left: "82%", top: "89%", label: "Telefone (direita)" },
  "computer": { left: "50%", top: "69%", label: "Computador" },
};

const MODULES = [
  {
    num: 1,
    title: "A Primeira Reserva",
    descricaoMenu: "Um hóspede em potencial liga a perguntar como reservar. Vais aprender a conduzir a chamada com naturalidade, da disponibilidade ao pagamento, para transformar uma simples pergunta numa reserva confirmada.",
    joanaPose: "conversa_01",
    sfxCursor: "tel1",
    hotspotKey: "left-phone",
    cursoHint: "Clica no círculo de destaque para atender",
    cenario: "Um cliente liga para a receção a perguntar como pode fazer uma reserva.",
    intro: [
      { speaker: "joana", bg: "fachada", text: "Bem-vindo ao Ribeira Palace! Sou a Joana e vou acompanhar-te ao longo desta formação. Aqui, cada chamada, cada email e cada cliente que passa pela receção é uma oportunidade de fazeres a diferença." },
      { speaker: "joana", bg: "fachada", text: "O curso está dividido em quatro módulos, cada um com uma situação diferente, entre chamadas, um email, um pedido simples e um imprevisto. Em cada uma, vais escolher como responder e eu ajudo-te a perceber o porquê de cada opção." },
      { speaker: "joana", bg: "fachada", text: "Ao longo do curso, vais assumir o papel do Miguel e da Marta, os nossos rececionistas, e as decisões e as falas em cada situação serão tuas." },
      { speaker: "joana", bg: "receção", text: "Este é o nosso balcão de receção, o coração do hotel. É aqui que tudo começa, das reservas aos check-ins e pedidos. Hoje vais treinar uma situação muito comum, a de um cliente que liga a perguntar como reservar." },
      { speaker: "joana", bg: "receção", text: "A partir de agora, o balcão é teu, vamos ver o teu desempenho." },
    ],
    curso: "O telefone está a tocar.",
    atendimento: "Ribeira Palace, boa tarde. Fala o Miguel, em que posso ajudar?",
    situacoes: [
      {
        cliente: "Boa tarde! Estive a ver o vosso hotel online e gostava de saber como posso fazer uma reserva.",
        resumo: "O cliente ligou a perguntar como pode fazer uma reserva. Como vais responder?",
        opcoes: [
          { letter: "A", text: "Boa tarde! Se me disser os seus dados, uma colega da reserva entra em contacto consigo ainda hoje.", correct: false, feedback: "Encaminhar sem necessidade atrasa o cliente e transmite que preferes não tratar do assunto tu mesmo. Sempre que conseguires ajudar de imediato fá-lo, mas só encaminhes quando for mesmo preciso." },
          { letter: "B", text: "Boa tarde! Claro, terei todo o gosto em ajudar. Para que datas gostaria de reservar e quantas pessoas serão?", correct: true, feedback: "Muito bem, mostras disponibilidade imediata para ajudar e já avanças para as perguntas essenciais (datas e número de pessoas), o que agiliza o pedido sem fazer o cliente esperar." },
          { letter: "C", text: "Boa tarde! Nesta altura do ano geralmente já não há muita disponibilidade, mas posso verificar.", correct: false, feedback: "Antecipar pouca disponibilidade antes de verificar cria uma expectativa negativa logo de início. Verifica sempre primeiro e só depois comunicas o que encontraste." },
        ],
        ponte: [
          { who: "cliente", text: "Obrigado! Então, para o dia 14, próximo fim de semana, para duas pessoas." },
          { who: "tu", text: "Perfeito, vou já confirmar a disponibilidade e as tarifas para essa data." },
        ],
      },
      {
        cliente: "Qual seria o valor da estadia?",
        resumo: "O cliente quer saber qual é o valor da estadia. Como vais responder?",
        opcoes: [
          { letter: "A", text: "Vou já confirmar consigo o valor exato, pode ser que demore só um bocadinho.", correct: false, feedback: "Dizer que vais confirmar sem dar nenhuma informação concreta faz o cliente esperar sem necessidade. Usa sempre os dados que já tens disponíveis." },
          { letter: "B", text: "Depende muito do quarto e das datas, mas ronda os 150 a 250 euros por noite.", correct: false, feedback: "Dar um intervalo tão largo transmite pouca confiança na informação. Como já sabes as datas e o quarto pretendido, dá sempre um valor concreto." },
          { letter: "C", text: "Temos um Quarto Duplo Superior disponível a partir de 180 euros por noite, com pequeno-almoço incluído. Gostaria que avançássemos com a reserva?", correct: true, feedback: "Boa! Dás uma informação concreta e completa (valor, tipo de quarto e o que está incluído) e ainda convidas o cliente a avançar, facilitando a decisão." },
        ],
        ponte: [
          { who: "cliente", text: "Parece-me bem, pode confirmar a reserva." },
          { who: "tu", text: "Ótimo! Vou confirmar a reserva em seu nome já de seguida." },
        ],
      },
      {
        cliente: "Como faço o pagamento?",
        resumo: "O cliente quer saber como pode efetuar o pagamento. Como vais responder?",
        opcoes: [
          { letter: "A", text: "Pode efetuar o pagamento agora com cartão ou preferir pagar na chegada ao hotel, o que for mais conveniente para si.", correct: true, feedback: "Parabéns, apresentas claramente as duas opções de pagamento e deixas a escolha ao critério do cliente, o que transmite flexibilidade e organização." },
          { letter: "B", text: "O pagamento é sempre feito só na chegada ao hotel, não se preocupe agora com isso.", correct: false, feedback: "Apresentar só uma opção como obrigatória tira a liberdade de escolha ao cliente e pode nem corresponder à política do hotel. Apresenta sempre as alternativas reais disponíveis." },
          { letter: "C", text: "Pode fazer já o pagamento por transferência bancária, envio-lhe os dados.", correct: false, feedback: "A transferência bancária é mais lenta e trabalhosa para o cliente do que as opções diretas. Prioriza sempre a forma mais simples antes de sugerir alternativas menos práticas." },
        ],
        ponte: [],
      },
    ],
    fecho: [
      { who: "cliente", text: "Muito obrigado pela ajuda, até breve!" },
      { who: "joana", text: "Viste como uma simples chamada pode fazer toda a diferença na experiência do cliente? Disponibilidade, clareza e simpatia, é isso que o Ribeira Palace representa." },
      { who: "joana", text: "Parabéns pela conclusão deste módulo! De seguida, tens um resumo rápido das boas práticas para atender chamadas de reserva, antes de avançarmos para o próximo módulo." },
    ],
    boasPraticas: {
      titulo: "Boas Práticas para uma Reserva Bem-Sucedida",
      fazer: [
        "Responder ao pedido do hóspede de imediato, fornecendo informação concreta sobre disponibilidade e condições.",
        "Apresentar as opções existentes com clareza, permitindo que o hóspede decida com confiança.",
        "Concluir sempre a chamada com um próximo passo definido, para que o hóspede saiba o que esperar a seguir.",
      ],
      evitar: [
        "Encaminhar o hóspede para outro canal ou colega sem antes tentar resolver o pedido diretamente.",
        "Colocar a chamada em espera sem explicar o motivo ou a duração previsível.",
        "Fornecer respostas vagas ou sem alternativas concretas, deixando o hóspede sem uma decisão clara a tomar.",
      ],
      citacao: "Disponibilidade, clareza e simpatia, é isso que o Ribeira Palace representa.",
    },
  },
  {
    num: 2,
    title: "Um Problema, Uma Solução",
    descricaoMenu: "O telefone toca com um pedido de assistência, porque falta água no quarto. Aqui treinas a arte de manter a calma sob pressão, comunicar prazos com confiança e transformar um contratempo em prova de excelência no atendimento.",
    joanaPose: "conversa_02",
    sfxCursor: "tel2",
    hotspotKey: "right-phone",
    cursoHint: "Clica no círculo de destaque para atender",
    cenario: "Uma hóspede liga do quarto a informar que não tem água.",
    intro: [
      { speaker: "joana", bg: "fachada", text: "Nem todos os dias na receção são pedidos simples. Às vezes surge um imprevisto, e a forma como reages nesse momento pode transformar a experiência do hóspede." },
      { speaker: "joana", bg: "receção", text: "Neste módulo vais lidar com uma situação inesperada, um pedido de assistência técnica. Mantém a calma, ouve a hóspede e mostra que estás a tratar do problema." },
      { speaker: "joana", bg: "receção", text: "Aqui, cada dia traz um desafio diferente. Vamos ver como resolves este." },
    ],
    curso: "O telefone da receção está a tocar. É o quarto 214.",
    atendimento: "Receção, boa tarde. Fala a Marta, em que posso ajudar?",
    situacoes: [
      {
        cliente: "Boa tarde, estou no quarto 214 e não tenho água nenhuma na torneira. Podem ajudar?",
        resumo: "A hóspede ligou a informar que não tem água no quarto. Como vais responder?",
        opcoes: [
          { letter: "A", text: "Lamento imenso o incómodo. Vou contactar de imediato a manutenção e confirmo consigo em poucos minutos.", correct: true, feedback: "Isso mesmo! Reconheces o incómodo, assumes a responsabilidade de agir de imediato e dás um prazo claro para dar retorno à hóspede." },
          { letter: "B", text: "Lamento o sucedido, vou pedir à manutenção para dar uma vista de olhos assim que possível.", correct: false, feedback: "Sem um prazo concreto e sem garantir que vais confirmar depois, a hóspede fica sem saber o que esperar. Compromete-te sempre com um prazo e um follow-up." },
          { letter: "C", text: "Isso é estranho, pode verificar se rodou bem a torneira? Vou entretanto avisar a manutenção.", correct: false, feedback: "Pedir à hóspede para verificar algo tão básico antes de agires pode soar a estares a duvidar dela. Regista o problema e age de imediato. A causa é depois a manutenção que averigua." },
        ],
        ponte: [
          { who: "cliente", text: "Está bem, fico a aguardar então." },
          { who: "tu", text: "Vou já ligar à manutenção e volto a contactá-la assim que houver novidades." },
        ],
      },
      {
        // Interrupção entre situações: a hóspede desliga e, mais tarde,
        // volta a ligar — reutiliza a mesma mensagem/áudio [M4.2.CURSO] do
        // Módulo 4 (mesma frase, não é preciso gerar uma fala nova).
        cursoAntes: { text: "Mais tarde, o telefone volta a tocar.", ref: "M4.2.CURSO" },
        cliente: "Já passaram 20 minutos e continuo sem água. Estou a ficar impaciente.",
        resumo: "Já passaram 20 minutos e a hóspede está impaciente à espera de uma solução. Como vais responder?",
        opcoes: [
          { letter: "A", text: "Compreendo a sua frustração, a manutenção já foi avisada e deve tratar disso em breve.", correct: false, feedback: "Repetir a mesma informação sem nada de novo não tranquiliza uma hóspede que já está impaciente. Depois de algum tempo, procura sempre ter uma atualização concreta." },
          { letter: "B", text: "Peço desculpa pela demora. Já confirmei com a manutenção, estão a caminho do seu quarto neste momento. Assim que for resolvido, ligo-lhe a confirmar.", correct: true, feedback: "Muito bem, pedes desculpa pela demora, dás uma atualização concreta do ponto de situação e garantes um contacto de confirmação, o que tranquiliza a hóspede." },
          { letter: "C", text: "Peço imensa desculpa, vou verificar agora mesmo o que se passa e depois ligo-lhe.", correct: false, feedback: "Só começares a verificar depois da reclamação mostra que não estavas a acompanhar o pedido. Depois de pedires um prazo, deves confirmar tu mesmo antes de a hóspede ter de reclamar." },
        ],
        ponte: [
          { who: "cliente", text: "Obrigada, fico à espera então." },
          { who: "tu", text: "Assim que a água for reposta, ligo-lhe de imediato a confirmar." },
        ],
      },
      {
        cliente: "Obrigada, já tenho água. Mas passei um mau bocado, esperava mais do hotel.",
        resumo: "O problema já foi resolvido, mas a hóspede ficou insatisfeita com o transtorno. Como vais responder?",
        opcoes: [
          { letter: "A", text: "Peço desculpa pelo sucedido, vamos ter atenção para que não volte a acontecer.", correct: false, feedback: "Reconhecer o erro é bom, mas sem nenhum gesto de compensação para esta estadia a hóspede fica só com a desculpa. Sempre que possível, soma um gesto concreto à desculpa." },
          { letter: "B", text: "Compreendo perfeitamente, para compensar posso já aplicar-lhe um desconto na fatura final.", correct: false, feedback: "Descontos na fatura costumam exigir autorização superior, e prometer isso sem confirmar pode criar um problema depois. Escolhe compensações simples que estejam dentro da tua autonomia, como um upgrade pontual ou uma cortesia do hotel." },
          { letter: "C", text: "Peço desculpa novamente pelo transtorno. Gostaria de lhe oferecer um pequeno-almoço cortesia amanhã, como forma de compensação.", correct: true, feedback: "Parabéns! Reconheces o transtorno causado e ofereces uma compensação concreta, o que ajuda a recuperar a confiança da hóspede." },
        ],
        ponte: [],
      },
    ],
    fecho: [
      { who: "cliente", text: "Agradeço a atenção, boa tarde." },
      { who: "joana", text: "Reparaste como reconhecer o incómodo e agir rapidamente transforma um problema num momento de confiança? É assim que fidelizamos os nossos hóspedes." },
      { who: "joana", text: "Parabéns pela conclusão deste módulo! De seguida, tens um resumo rápido das boas práticas para lidar com imprevistos e reclamações, antes de avançarmos para o próximo módulo." },
    ],
    boasPraticas: {
      titulo: "Boas Práticas para Resolver um Imprevisto com Confiança",
      fazer: [
        "Reconhecer de imediato o incómodo causado ao hóspede e assumir a responsabilidade de agir sem demora.",
        "Fornecer um prazo concreto ou um ponto de situação claro, mantendo o hóspede informado em cada etapa.",
        "Manter a calma e a empatia mesmo sob pressão, transmitindo confiança durante todo o contacto.",
      ],
      evitar: [
        "Assumir que o problema se resolverá por si só, sem acompanhamento ativo da situação.",
        "Comparar a situação do hóspede com experiências próprias, desvalorizando a sua perspetiva.",
        "Minimizar o incómodo causado depois de o problema estar resolvido, em vez de o reconhecer devidamente.",
      ],
      citacao: "Reconhecer o incómodo e agir rapidamente transforma um problema num momento de confiança.",
    },
  },
  {
    num: 3,
    title: "Um Email, Uma Oportunidade",
    descricaoMenu: "Chega um email da empresa Nortec Consultoria a pedir o auditório para um evento corporativo. Vais praticar respostas escritas claras, completas e persuasivas, que fecham negócio sem trocas de mensagens desnecessárias.",
    joanaPose: "conversa_03",
    sfxCursor: "email",
    hotspotKey: "computer",
    cursoHint: "Clica no círculo de destaque para abrir",
    emailMode: true,
    cenario: "Chega um email de uma empresa a pedir a reserva do auditório para um evento.",
    intro: [
      { speaker: "joana", bg: "fachada", text: "Já viste como uma chamada bem conduzida pode resolver praticamente tudo. Voltemos ao Ribeira Palace. Desta vez, não será o telefone a tocar." },
      { speaker: "joana", bg: "receção", text: "Nem toda a comunicação é feita ao telefone. Muitos pedidos chegam-nos por email, e a forma como respondes diz muito sobre o teu profissionalismo e o do hotel." },
      { speaker: "joana", bg: "receção", text: "Chegou a tua vez de responder. Vê o que temos na caixa de entrada." },
    ],
    curso: "Chegou um novo email à caixa de entrada da receção, da empresa “Nortec Consultoria”.",
    situacoes: [
      {
        cliente: "Bom dia, somos a empresa Nortec Consultoria e gostaríamos de saber se é possível reservar o vosso auditório para um evento corporativo no dia 20 de novembro, para cerca de 60 pessoas. Aguardamos informação sobre disponibilidade e valores.",
        resumo: "A empresa Nortec Consultoria pergunta se o auditório está disponível para um evento e quais os valores. Como vais responder?",
        opcoes: [
          { letter: "A", text: "Bom dia, obrigado pelo contacto. Vou verificar a disponibilidade e envio-lhe uma resposta detalhada ainda esta semana.", correct: false, feedback: "Prometer responder só mais tarde quando já tens a informação disponível faz perder tempo ao cliente e transmite falta de agilidade. Responde com o que já sabes." },
          { letter: "B", text: "Bom dia, temos o auditório disponível nessa data e o valor ronda os 800 a 1000 euros consoante os serviços escolhidos.", correct: false, feedback: "Um intervalo largo de preço sem indicar os próximos passos deixa o cliente sem saber como avançar. Sempre que possível, dá um valor concreto e sugere o passo seguinte." },
          { letter: "C", text: "Bom dia, obrigado pelo contacto. Confirmo que o nosso auditório tem capacidade até 80 pessoas e está disponível no dia 20 de novembro. Posso enviar-lhe a proposta de valores e os serviços incluídos?", correct: true, feedback: "Excelente! Confirmas logo a disponibilidade e a capacidade, e propões o próximo passo (enviar a proposta), o que transmite eficiência e profissionalismo." },
        ],
        ponte: [
          { who: "cliente", text: "Obrigado pela resposta rápida. Fico a aguardar então a proposta." },
          { who: "tu", text: "Com certeza, vou preparar a proposta com todos os detalhes e envio-lhe ainda hoje." },
        ],
      },
      {
        cliente: "Ótimo. Podem confirmar se o auditório tem equipamento audiovisual incluído e qual o valor total?",
        resumo: "A empresa quer saber se o auditório tem equipamento audiovisual incluído e qual é o valor total. Como vais responder?",
        opcoes: [
          { letter: "A", text: "Sim, o auditório inclui sistema de som, projetor e microfones sem fio. Para 60 pessoas, num dia completo, o valor é de 850 euros, podendo incluir coffee-break mediante pedido. Envio-lhe a proposta detalhada em anexo.", correct: true, feedback: "Muito bem! Respondes com precisão ao que foi pedido (equipamento e valor) e ainda acrescentas uma opção extra (coffee-break), mostrando cuidado com o pedido do cliente." },
          { letter: "B", text: "Sim, o auditório tem equipamento audiovisual incluído. Quanto ao valor total, envio-lhe a proposta detalhada já de seguida.", correct: false, feedback: "Confirmar o equipamento mas adiar o valor obriga o cliente a esperar por um anexo para saber o essencial. Sempre que possível, inclui logo os números principais na própria resposta." },
          { letter: "C", text: "Temos várias opções de equipamento consoante o orçamento disponível, posso enviar-lhe um catálogo de serviços extra.", correct: false, feedback: "O cliente já perguntou o que precisava de saber, por isso enviar um catálogo extra em vez de responder diretamente cria trabalho desnecessário. Responde primeiro ao que foi pedido." },
        ],
        ponte: [
          { who: "cliente", text: "Perfeito, ficamos a aguardar a proposta detalhada." },
          { who: "tu", text: "Vai receber a proposta ainda hoje, com todos os valores e condições." },
        ],
      },
      {
        cliente: "Perfeito, gostaríamos de avançar com a reserva. Que documentos ou confirmação precisam de nós?",
        resumo: "A empresa está pronta para avançar e pergunta que documentos são necessários para confirmar a reserva. Como vais responder?",
        opcoes: [
          { letter: "A", text: "Ótima notícia! Vou preparar o contrato e envio-lhe para assinatura ainda esta semana.", correct: false, feedback: "Avançar direto para o contrato sem esclarecer o que falta ao cliente pode confundir o processo. Responde sempre à pergunta concreta que foi feita." },
          { letter: "B", text: "Ótima notícia! Para confirmar a reserva, basta enviar-nos um email de confirmação e os dados de faturação da empresa. Assim que recebermos, enviamos a confirmação oficial e o contrato de utilização do espaço.", correct: true, feedback: "Isso mesmo! Explicas de forma clara e concreta os passos seguintes, o que evita dúvidas e agiliza o fecho da reserva." },
          { letter: "C", text: "Vamos precisar de alguns documentos da empresa, envio-lhe a lista completa brevemente.", correct: false, feedback: "Dizer que vais enviar a lista 'brevemente' sem nenhum detalhe agora atrasa desnecessariamente um cliente já pronto para avançar. Se sabes o que é preciso, diz logo." },
        ],
        ponte: [],
      },
    ],
    fecho: [
      { who: "cliente", text: "Combinado, obrigado pela disponibilidade e rapidez!" },
      { who: "joana", text: "Viste como um email bem estruturado e uma resposta rápida podem fechar uma reserva importante? O profissionalismo escrito conta tanto como o tom de voz ao telefone." },
      { who: "joana", text: "Parabéns, concluíste este módulo! De seguida, tens um resumo rápido das boas práticas para responder a emails, antes de avançarmos para o próximo módulo." },
    ],
    boasPraticas: {
      titulo: "Boas Práticas para uma Comunicação Escrita de Excelência",
      fazer: [
        "Tratar cada email com o mesmo nível de profissionalismo dedicado a uma chamada telefónica.",
        "Responder com precisão, incluindo disponibilidade, valores e condições relevantes para a decisão do cliente.",
        "Propor sempre um próximo passo concreto, facilitando o avanço do processo.",
      ],
      evitar: [
        "Fornecer respostas vagas ou evitar responder por escrito quando essa é a via de contacto escolhida pelo cliente.",
        "Encaminhar o pedido para terceiros sem antes tentar resolvê-lo diretamente.",
        "Adiar a confirmação de uma reserva quando o cliente já está pronto para avançar.",
      ],
      citacao: "O profissionalismo escrito conta tanto como o tom de voz ao telefone.",
    },
  },
  {
    num: 4,
    title: "Um Objeto Esquecido",
    descricaoMenu: "Um hóspede liga já longe do hotel, porque se esqueceu de um casaco no quarto. Este módulo mostra como resolver um pequeno imprevisto com rapidez e cuidado, transformando um esquecimento em mais um motivo para voltar.",
    joanaPose: "conversa_04",
    sfxCursor: "tel1",
    hotspotKey: "left-phone",
    cursoHint: "Clica no círculo de destaque para atender",
    cenario: "Um hóspede que já fez check-out liga a dizer que esqueceu um casaco no quarto.",
    intro: [
      { speaker: "joana", bg: "fachada", text: "Chegámos ao último módulo. Já viste uma chamada, um problema urgente e um email. Agora vais lidar com uma situação que só começa depois de o hóspede já ter saído do hotel." },
      { speaker: "joana", bg: "receção", text: "Este módulo é sobre uma situação que acontece com mais frequência do que imaginas, a de um hóspede que já partiu mas deixou alguma coisa para trás. A forma como resolves isto à distância diz muito sobre o cuidado do hotel." },
      { speaker: "joana", bg: "receção", text: "Mesmo depois do check-out, o cuidado com o hóspede não termina. Vamos ver esta chamada." },
    ],
    curso: "O telefone está a tocar. É um hóspede que fez check-out esta manhã.",
    atendimento: "Ribeira Palace, boa tarde. Fala a Marta, em que posso ajudar?",
    situacoes: [
      {
        cliente: "Boa tarde, fiz check-out esta manhã do quarto 305 e, já em casa, dei por falta do meu casaco preto. Deve ter ficado pendurado no closet. Podem confirmar se o encontraram?",
        resumo: "O hóspede liga a perguntar se o casaco que esqueceu no quarto foi encontrado. Como vais responder?",
        opcoes: [
          { letter: "A", text: "Boa tarde, vou verificar e ligo-lhe assim que tiver novidades, pode demorar um pouco.", correct: false, feedback: "Sem um prazo mais concreto, o hóspede fica sem saber quando esperar resposta. Sempre que a tarefa for simples, tenta comprometer-te com uma indicação de tempo mais precisa (por exemplo, \"ainda hoje\")." },
          { letter: "B", text: "Boa tarde, obrigado por nos contactar. Vou já pedir à governanta para verificar o quarto 305 e confirmo consigo assim que tivermos uma resposta.", correct: true, feedback: "Boa, agradeces o contacto e dás um próximo passo concreto e rápido, o que tranquiliza logo o hóspede sobre o objeto perdido." },
          { letter: "C", text: "Boa tarde, deixe-me só confirmar os seus dados da reserva antes de mais.", correct: false, feedback: "Pedir dados adicionais antes de sequer começar a tratar de um pedido simples cria fricção desnecessária. Começa por agir e só peças mais informação se for mesmo preciso." },
        ],
        ponte: [
          { who: "cliente", text: "Muito obrigado, fico a aguardar novidades." },
          { who: "tu", text: "Sem problema, vou confirmar com a governanta e escrevo-lhe ainda hoje." },
        ],
      },
      {
        // Interrupção entre situações: o hóspede desliga e, mais tarde, volta
        // a ligar — reaparece o [CURSO] do telefone a tocar antes de retomar
        // as falas (ver compileBeats em main.js).
        cursoAntes: { text: "Mais tarde, o telefone volta a tocar.", ref: "M4.2.CURSO" },
        cliente: "Boa tarde de novo, o casaco foi encontrado? E, se sim, como posso recebê-lo, visto que já não estou em Lisboa?",
        resumo: "O casaco foi encontrado e o hóspede quer saber como pode recebê-lo, visto já não estar em Lisboa. Como vais responder?",
        opcoes: [
          { letter: "A", text: "Boa tarde, sim, o casaco foi encontrado. Vou enviá-lo já por correio registado para a morada que temos na reserva.", correct: false, feedback: "Enviar sem confirmar a morada ou perguntar a preferência do hóspede arrisca um envio para o sítio errado. Confirma sempre os detalhes antes de agir." },
          { letter: "B", text: "Boa tarde, sim, o casaco foi encontrado. Terá de nos indicar uma transportadora da sua confiança para tratarmos do envio.", correct: false, feedback: "Pedir ao hóspede para escolher e tratar da transportadora dá-lhe trabalho extra que devia ser teu. Sempre que possível, simplifica o processo do lado do hotel." },
          { letter: "C", text: "Boa tarde, sim, o casaco foi encontrado e está guardado na receção em seu nome. Podemos enviá-lo por correio registado para a sua morada, com o custo do envio a cargo do hotel, ou pode indicar-nos outra forma de o fazer chegar até si.", correct: true, feedback: "Excelente, confirmas o essencial, assumes o custo do envio como gesto de boa vontade e ainda deixas espaço para o hóspede escolher a forma que lhe for mais conveniente." },
        ],
        ponte: [
          { who: "cliente", text: "Perfeito, agradeço imenso, pode enviar por correio registado para a morada que já vos dei na reserva." },
          { who: "tu", text: "Combinado, vou tratar do envio ainda esta semana e envio-lhe o número de rastreio assim que estiver disponível." },
        ],
      },
      {
        cliente: "Muito obrigado pela atenção. Só uma última questão, como vou saber que o casaco já foi enviado?",
        resumo: "O hóspede quer saber como vai ser avisado assim que o casaco for enviado. Como vais responder?",
        opcoes: [
          { letter: "A", text: "Assim que o pacote for entregue aos correios, envio-lhe um email de confirmação com o número de rastreio, para poder acompanhar a entrega até casa.", correct: true, feedback: "Parabéns! Dás ao hóspede uma forma concreta de acompanhar o processo, o que fecha o assunto com confiança e transparência." },
          { letter: "B", text: "Fique descansado, eu própria me encarrego de tudo e trato do envio ainda esta semana.", correct: false, feedback: "Garantir que vais tratar do envio é bom, mas não responde à pergunta sobre como o hóspede vai ficar a saber. Diz sempre concretamente como e quando vais informá-lo." },
          { letter: "C", text: "Assim que for enviado, deixamos essa informação registada no seu processo caso queira confirmar depois.", correct: false, feedback: "Deixar a informação só disponível se o hóspede perguntar outra vez transfere para ele o trabalho de se manter informado. Sê proativo e informa-o assim que houver novidades, sem ele ter de pedir." },
        ],
        ponte: [],
      },
    ],
    fecho: [
      { who: "cliente", text: "Perfeito, muito obrigado por toda a disponibilidade e simpatia!" },
      { who: "joana", text: "Viste como um objeto esquecido, resolvido com atenção e follow-up, pode transformar-se numa boa memória em vez de uma frustração? É esse cuidado extra que faz voltar os hóspedes." },
      { who: "joana", text: "Parabéns, concluíste o último módulo! De seguida, tens um resumo rápido das boas práticas para resolver pedidos à distância, antes de fecharmos esta formação." },
    ],
    boasPraticas: {
      titulo: "Boas Práticas no Acompanhamento de um Pedido à Distância",
      fazer: [
        "Acreditar no relato do hóspede e confirmar prontamente a situação junto da equipa responsável.",
        "Definir sempre um próximo passo concreto e célere, mantendo o hóspede informado.",
        "Assumir custos razoáveis como gesto de boa vontade, quando apropriado à situação.",
      ],
      evitar: [
        "Duvidar do relato do hóspede ou desencorajá-lo logo à partida.",
        "Cobrar custos ou adiar a resolução sem necessidade real para tal.",
        "Desvalorizar preocupações legítimas do hóspede relativamente ao sucedido.",
      ],
      citacao: "Um objeto esquecido, resolvido com atenção e follow-up, pode transformar-se numa boa memória em vez de uma frustração.",
    },
  },
];

// Versão inglesa do MODULES acima — mesma estrutura, mesmos hotspotKey/refs
// (ver guiao/build_guiao_en.js e guiao/build_falas_tts_en.js, fonte de todo
// este texto). Os áudios correspondentes vivem em
// assets/sfx_falas/eng_version/ com o mesmo esquema de nomes prefixado "EN."
// (ver ASSETS.fala acima).
const MODULES_EN = [
  {
    num: 1,
    title: "The First Booking",
    descricaoMenu: "A prospective guest calls to ask how to make a booking. You'll learn to handle the call naturally, from availability to payment, turning a simple question into a confirmed reservation.",
    joanaPose: "conversa_01",
    sfxCursor: "tel1",
    hotspotKey: "left-phone",
    cursoHint: "Click the highlighted circle to answer",
    cenario: "A customer calls the front desk to ask how they can make a booking.",
    intro: [
      { speaker: "joana", bg: "fachada", text: "Welcome to the Ribeira Palace! I'm Joana, and I'll be with you throughout this training. Here, every call, every email, and every customer who comes to the front desk is a chance for you to make a difference." },
      { speaker: "joana", bg: "fachada", text: "The course is divided into four modules, each covering a different situation: calls, an email, a simple request, and an unexpected problem. In each one, you'll choose how to respond, and I'll help you understand the reasoning behind each option." },
      { speaker: "joana", bg: "fachada", text: "Throughout the course, you'll step into the shoes of Miguel and Marta, our receptionists, and the decisions and lines in each situation will be yours." },
      { speaker: "joana", bg: "receção", text: "This is our front desk, the heart of the hotel. This is where everything begins, from bookings to check-ins and requests. Today you'll practise a very common situation: a customer calling to ask how to make a booking." },
      { speaker: "joana", bg: "receção", text: "From now on, the desk is yours. Let's see how you do." },
    ],
    curso: "The phone is ringing.",
    atendimento: "Ribeira Palace, good afternoon. This is Miguel speaking, how can I help you?",
    situacoes: [
      {
        cliente: "Good afternoon! I've been looking at your hotel online and I'd like to know how I can make a booking.",
        resumo: "The customer called to ask how they can make a booking. How will you respond?",
        opcoes: [
          { letter: "A", text: "Good afternoon! If you give me your details, a colleague from reservations will get in touch with you today.", correct: false, feedback: "Passing the customer on unnecessarily slows them down and suggests you'd rather not deal with it yourself. Whenever you can help right away, do it, and only pass things on when it's genuinely necessary." },
          { letter: "B", text: "Good afternoon! Of course, I'd be happy to help. What dates would you like to book, and how many guests will there be?", correct: true, feedback: "Well done! You show immediate willingness to help and move straight on to the essential questions (dates and number of guests), which speeds up the request without keeping the customer waiting." },
          { letter: "C", text: "Good afternoon! At this time of year we usually don't have much availability left, but I can check.", correct: false, feedback: "Setting the expectation of low availability before actually checking creates a negative impression right from the start. Always check first, and only then share what you found." },
        ],
        ponte: [
          { who: "cliente", text: "Thank you! So, for the 14th, next weekend, for two people." },
          { who: "tu", text: "Perfect, I'll check availability and rates for that date right away." },
        ],
      },
      {
        cliente: "What would the cost of the stay be?",
        resumo: "The customer wants to know the cost of the stay. How will you respond?",
        opcoes: [
          { letter: "A", text: "I'll confirm the exact price with you shortly, it might just take a moment.", correct: false, feedback: "Saying you'll confirm without giving any concrete information makes the customer wait unnecessarily. Always use the information you already have available." },
          { letter: "B", text: "It really depends on the room and the dates, but it's around 150 to 250 euros per night.", correct: false, feedback: "Giving such a wide range comes across as unsure of the information. Since you already know the dates and the room requested, always give a concrete figure." },
          { letter: "C", text: "We have a Superior Double Room available from 180 euros per night, breakfast included. Would you like us to go ahead with the booking?", correct: true, feedback: "Good! You give concrete, complete information (price, room type, and what's included) and also invite the customer to move forward, making the decision easier." },
        ],
        ponte: [
          { who: "cliente", text: "That sounds good, please go ahead and confirm the booking." },
          { who: "tu", text: "Great! I'll confirm the booking under your name right away." },
        ],
      },
      {
        cliente: "How do I make the payment?",
        resumo: "The customer wants to know how they can make the payment. How will you respond?",
        opcoes: [
          { letter: "A", text: "You can pay now by card, or if you prefer, you can pay on arrival at the hotel, whichever is more convenient for you.", correct: true, feedback: "Well done! You clearly present both payment options and leave the choice up to the customer, which conveys flexibility and organisation." },
          { letter: "B", text: "Payment is always made only on arrival at the hotel, don't worry about that now.", correct: false, feedback: "Presenting only one option as mandatory takes away the customer's freedom to choose and may not even match the hotel's actual policy. Always present the real alternatives available." },
          { letter: "C", text: "You can make the payment now by bank transfer, I'll send you the details.", correct: false, feedback: "A bank transfer is slower and more of a hassle for the customer than the direct options. Always prioritise the simplest method before suggesting less practical alternatives." },
        ],
        ponte: [],
      },
    ],
    fecho: [
      { who: "cliente", text: "Thank you so much for your help, see you soon!" },
      { who: "joana", text: "Did you see how a simple call can make all the difference to the customer's experience? Availability, clarity, and warmth are what the Ribeira Palace stands for." },
      { who: "joana", text: "Congratulations on completing this module! Next, you'll get a quick summary of best practices for handling booking calls, before we move on to the next module." },
    ],
    boasPraticas: {
      titulo: "Best Practices for a Successful Booking",
      fazer: [
        "Respond to the guest's request immediately, providing concrete information about availability and conditions.",
        "Present the available options clearly, allowing the guest to decide with confidence.",
        "Always close the call with a defined next step, so the guest knows what to expect next.",
      ],
      evitar: [
        "Passing the guest on to another channel or colleague without first trying to resolve the request directly.",
        "Putting the call on hold without explaining the reason or the expected duration.",
        "Giving vague answers with no concrete alternatives, leaving the guest without a clear decision to make.",
      ],
      citacao: "Availability, clarity, and warmth are what the Ribeira Palace stands for.",
    },
  },
  {
    num: 2,
    title: "A Problem, A Solution",
    descricaoMenu: "The phone rings with a request for assistance, because there's no water in the room. Here you'll practise the art of staying calm under pressure, communicating timelines with confidence, and turning a setback into proof of excellent service.",
    joanaPose: "conversa_02",
    sfxCursor: "tel2",
    hotspotKey: "right-phone",
    cursoHint: "Click the highlighted circle to answer",
    cenario: "A guest calls from their room to report that they have no water.",
    intro: [
      { speaker: "joana", bg: "fachada", text: "Not every day at the front desk brings simple requests. Sometimes something unexpected comes up, and how you react in that moment can transform the guest's experience." },
      { speaker: "joana", bg: "receção", text: "In this module you'll deal with an unexpected situation: a request for technical assistance. Stay calm, listen to the guest, and show that you're taking care of the problem." },
      { speaker: "joana", bg: "receção", text: "Here, every day brings a different challenge. Let's see how you handle this one." },
    ],
    curso: "The front desk phone is ringing. It's room 214.",
    atendimento: "Front desk, good afternoon. This is Marta speaking, how can I help you?",
    situacoes: [
      {
        cliente: "Good afternoon, I'm in room 214 and there's no water at all coming from the tap. Can you help?",
        resumo: "The guest called to report that there's no water in the room. How will you respond?",
        opcoes: [
          { letter: "A", text: "I'm so sorry for the inconvenience. I'll contact maintenance right away and get back to you within a few minutes.", correct: true, feedback: "Exactly right! You acknowledge the inconvenience, take responsibility for acting immediately, and give a clear timeframe for getting back to the guest." },
          { letter: "B", text: "Sorry about that, I'll ask maintenance to take a look as soon as possible.", correct: false, feedback: "Without a concrete timeframe and without promising a follow-up, the guest is left not knowing what to expect. Always commit to a timeframe and a follow-up." },
          { letter: "C", text: "That's odd, could you check if you turned the tap properly? I'll let maintenance know in the meantime.", correct: false, feedback: "Asking the guest to check something so basic before you act can come across as doubting them. Log the problem and act immediately. Working out the cause is what maintenance is for." },
        ],
        ponte: [
          { who: "cliente", text: "Alright, I'll wait then." },
          { who: "tu", text: "I'll call maintenance right away and get back to you as soon as there's news." },
        ],
      },
      {
        cursoAntes: { text: "Later, the phone rings again.", ref: "M4.2.CURSO" },
        cliente: "It's been 20 minutes and I still don't have water. I'm getting impatient.",
        resumo: "20 minutes have passed and the guest is getting impatient waiting for a solution. How will you respond?",
        opcoes: [
          { letter: "A", text: "I understand your frustration, maintenance has already been informed and should deal with it soon.", correct: false, feedback: "Repeating the same information with nothing new doesn't reassure a guest who's already impatient. After some time has passed, always try to have a concrete update." },
          { letter: "B", text: "I'm sorry for the delay. I've just confirmed with maintenance, they're on their way to your room right now. As soon as it's fixed, I'll call to confirm.", correct: true, feedback: "Well done! You apologise for the delay, give a concrete status update, and guarantee a follow-up call, which reassures the guest." },
          { letter: "C", text: "I'm terribly sorry, I'll check right now what's going on and call you back.", correct: false, feedback: "Only starting to check after the complaint shows you weren't keeping track of the request. Once you've given a timeframe, you should follow up yourself before the guest has to complain." },
        ],
        ponte: [
          { who: "cliente", text: "Thank you, I'll wait then." },
          { who: "tu", text: "As soon as the water is back on, I'll call you right away to confirm." },
        ],
      },
      {
        cliente: "Thank you, I have water now. But I had a rough time, I expected more from the hotel.",
        resumo: "The problem has been resolved, but the guest is unhappy about the inconvenience. How will you respond?",
        opcoes: [
          { letter: "A", text: "I'm sorry about what happened, we'll make sure it doesn't happen again.", correct: false, feedback: "Acknowledging the mistake is good, but without any gesture of compensation for this stay, the guest is left with just the apology. Whenever possible, back up the apology with a concrete gesture." },
          { letter: "B", text: "I completely understand, to make up for it I can apply a discount to your final bill right away.", correct: false, feedback: "Discounts on the bill usually require higher-level authorisation, and promising one without confirming it first can cause problems later. Choose simple compensations that are within your own authority, such as a one-off upgrade or a complimentary gesture from the hotel." },
          { letter: "C", text: "I apologise again for the inconvenience. I'd like to offer you a complimentary breakfast tomorrow, as a way of making up for it.", correct: true, feedback: "Congratulations! You acknowledge the inconvenience caused and offer concrete compensation, which helps rebuild the guest's trust." },
        ],
        ponte: [],
      },
    ],
    fecho: [
      { who: "cliente", text: "Thank you for your attention, good afternoon." },
      { who: "joana", text: "Did you notice how acknowledging the inconvenience and acting quickly turns a problem into a moment of trust? That's how we build guest loyalty." },
      { who: "joana", text: "Congratulations on completing this module! Next, you'll get a quick summary of best practices for handling problems and complaints, before we move on to the next module." },
    ],
    boasPraticas: {
      titulo: "Best Practices for Confidently Resolving a Problem",
      fazer: [
        "Immediately acknowledge the inconvenience caused to the guest and take responsibility for acting without delay.",
        "Provide a concrete timeframe or a clear status update, keeping the guest informed at every stage.",
        "Stay calm and empathetic even under pressure, conveying confidence throughout the interaction.",
      ],
      evitar: [
        "Assuming the problem will resolve itself, without actively following up on the situation.",
        "Comparing the guest's situation to your own experiences, dismissing their perspective.",
        "Downplaying the inconvenience caused once the problem is resolved, instead of properly acknowledging it.",
      ],
      citacao: "Acknowledging the inconvenience and acting quickly turns a problem into a moment of trust.",
    },
  },
  {
    num: 3,
    title: "An Email, An Opportunity",
    descricaoMenu: "An email arrives from Nortec Consultoria asking about the auditorium for a corporate event. You'll practise clear, complete, and persuasive written replies that close the deal without unnecessary back-and-forth.",
    joanaPose: "conversa_03",
    sfxCursor: "email",
    hotspotKey: "computer",
    cursoHint: "Click the highlighted circle to open it",
    emailMode: true,
    cenario: "An email arrives from a company asking to book the auditorium for an event.",
    intro: [
      { speaker: "joana", bg: "fachada", text: "You've already seen how a well-handled call can solve almost anything. Let's go back to the Ribeira Palace. This time, it won't be the phone ringing." },
      { speaker: "joana", bg: "receção", text: "Not all communication happens over the phone. Many requests come to us by email, and how you respond says a lot about your professionalism and the hotel's." },
      { speaker: "joana", bg: "receção", text: "It's your turn to reply. Take a look at what's in the inbox." },
    ],
    curso: "A new email has arrived in the front desk inbox, from the company “Nortec Consultoria”.",
    situacoes: [
      {
        cliente: "Good morning, we're Nortec Consultoria and we'd like to know if it's possible to book your auditorium for a corporate event on November 20th, for around 60 people. We look forward to information on availability and pricing.",
        resumo: "Nortec Consultoria is asking whether the auditorium is available for an event and what the pricing is. How will you respond?",
        opcoes: [
          { letter: "A", text: "Good morning, thank you for getting in touch. I'll check availability and send you a detailed reply later this week.", correct: false, feedback: "Promising to reply later when you already have the information available wastes the customer's time and comes across as slow. Reply with what you already know." },
          { letter: "B", text: "Good morning, the auditorium is available on that date, priced 800 to 1000 euros depending on the services chosen.", correct: false, feedback: "A wide price range with no indication of next steps leaves the customer unsure how to proceed. Whenever possible, give a concrete figure and suggest the next step." },
          { letter: "C", text: "Good morning, thank you for getting in touch. I can confirm our auditorium has capacity for up to 80 people and is available on November 20th. May I send you a proposal with pricing and included services?", correct: true, feedback: "Excellent! You immediately confirm availability and capacity, and propose the next step (sending the proposal), which conveys efficiency and professionalism." },
        ],
        ponte: [
          { who: "cliente", text: "Thank you for the quick reply. I'll look forward to the proposal, then." },
          { who: "tu", text: "Of course, I'll prepare the proposal with all the details and send it to you today." },
        ],
      },
      {
        cliente: "Great. Can you confirm whether the auditorium includes audiovisual equipment, and what the total price is?",
        resumo: "The company wants to know whether the auditorium includes audiovisual equipment and what the total price is. How will you respond?",
        // Frase de contexto um pouco mais comprida em inglês do que o
        // original — usa a variante de letra ligeiramente mais pequena (ver
        // .resumo-text-compact em style.css) para caber numa só linha.
        resumoCompact: true,
        opcoes: [
          { letter: "A", text: "Yes, the auditorium includes a sound system, projector, and wireless microphones. For 60 people, for a full day, the price is 850 euros, and a coffee break can be included on request. I'm attaching the detailed proposal.", correct: true, feedback: "Well done! You answer precisely what was asked (equipment and price) and even add an extra option (coffee break), showing care with the customer's request." },
          { letter: "B", text: "Yes, the auditorium includes audiovisual equipment. As for the price, I'll send the detailed proposal right after this.", correct: false, feedback: "Confirming the equipment but putting off the price forces the customer to wait for an attachment just to learn the essentials. Whenever possible, include the key figures directly in your reply." },
          { letter: "C", text: "We have several equipment options depending on the available budget, I can send you a catalogue of extra services.", correct: false, feedback: "The customer already asked exactly what they needed to know, so sending an extra catalogue instead of answering directly creates unnecessary work. Answer what was asked first." },
        ],
        ponte: [
          { who: "cliente", text: "Perfect, we'll look forward to the detailed proposal." },
          { who: "tu", text: "You'll receive the proposal today, with all the prices and conditions." },
        ],
      },
      {
        cliente: "Perfect, we'd like to go ahead with the booking. What documents or confirmation do you need from us?",
        resumo: "The company is ready to proceed and is asking what documents are needed to confirm the booking. How will you respond?",
        opcoes: [
          { letter: "A", text: "Great news! I'll prepare the contract and send it to you for signature later this week.", correct: false, feedback: "Jumping straight to the contract without clarifying what the customer still needs to do can confuse the process. Always answer the specific question that was asked." },
          { letter: "B", text: "Great news! To confirm the booking, all you need to do is send us a confirmation email along with the company's billing details. As soon as we receive it, we'll send the official confirmation and the venue usage agreement.", correct: true, feedback: "Exactly right! You explain the next steps clearly and concretely, which avoids confusion and speeds up closing the booking." },
          { letter: "C", text: "We'll need some documents from the company, I'll send you the full list shortly.", correct: false, feedback: "Saying you'll send the list \"shortly\" with no details now needlessly delays a customer who's already ready to proceed. If you know what's needed, say so right away." },
        ],
        ponte: [],
      },
    ],
    fecho: [
      { who: "cliente", text: "Agreed, thank you for your helpfulness and speed!" },
      { who: "joana", text: "Did you see how a well-structured email and a quick response can close an important booking? Professional writing counts just as much as your tone of voice on the phone." },
      { who: "joana", text: "Congratulations, you've completed this module! Next, you'll get a quick summary of best practices for replying to emails, before we move on to the next module." },
    ],
    boasPraticas: {
      titulo: "Best Practices for Excellent Written Communication",
      fazer: [
        "Treat every email with the same level of professionalism you'd give a phone call.",
        "Reply precisely, including availability, pricing, and conditions relevant to the customer's decision.",
        "Always propose a concrete next step, making it easier for the process to move forward.",
      ],
      evitar: [
        "Giving vague answers or avoiding a written reply when that's the contact method the customer chose.",
        "Passing the request on to someone else without first trying to resolve it directly.",
        "Delaying confirmation of a booking when the customer is already ready to proceed.",
      ],
      citacao: "Professional writing counts just as much as your tone of voice on the phone.",
    },
  },
  {
    num: 4,
    title: "A Forgotten Item",
    descricaoMenu: "A guest calls from far away, having forgotten a coat in their room. This module shows how to resolve a small mishap quickly and carefully, turning an oversight into one more reason to come back.",
    joanaPose: "conversa_04",
    sfxCursor: "tel1",
    hotspotKey: "left-phone",
    cursoHint: "Click the highlighted circle to answer",
    cenario: "A guest who has already checked out calls to say they left a coat behind in their room.",
    intro: [
      { speaker: "joana", bg: "fachada", text: "We've reached the final module. You've already seen a call, an urgent problem, and an email. Now you'll deal with a situation that only begins after the guest has already left the hotel." },
      { speaker: "joana", bg: "receção", text: "This module is about a situation that happens more often than you'd think: a guest who has already left but forgot something behind. How you handle this remotely says a lot about the hotel's level of care." },
      { speaker: "joana", bg: "receção", text: "Even after check-out, care for the guest doesn't end. Let's take this call." },
    ],
    curso: "The phone is ringing. It's a guest who checked out this morning.",
    atendimento: "Ribeira Palace, good afternoon. This is Marta speaking, how can I help you?",
    situacoes: [
      {
        cliente: "Good afternoon, I checked out this morning from room 305, and once I got home, I realised I'm missing my black coat. It must have been left hanging in the closet. Could you confirm whether you found it?",
        resumo: "The guest is calling to ask whether the coat they left in the room has been found. How will you respond?",
        opcoes: [
          { letter: "A", text: "Good afternoon, I'll check and call you back as soon as I have news, it might take a while.", correct: false, feedback: "Without a more concrete timeframe, the guest is left not knowing when to expect a reply. Whenever the task is simple, try to commit to a more precise time estimate (for example, \"later today\")." },
          { letter: "B", text: "Good afternoon, thank you for getting in touch. I'll ask housekeeping to check room 305 right away, and I'll get back to you as soon as we have an answer.", correct: true, feedback: "Good work! You thank the guest for reaching out and give a concrete, quick next step, which immediately reassures them about the lost item." },
          { letter: "C", text: "Good afternoon, let me just confirm your booking details first.", correct: false, feedback: "Asking for additional details before even starting to handle a simple request creates unnecessary friction. Start by taking action, and only ask for more information if it's genuinely needed." },
        ],
        ponte: [
          { who: "cliente", text: "Thank you very much, I'll wait to hear from you." },
          { who: "tu", text: "No problem, I'll check with housekeeping and message you later today." },
        ],
      },
      {
        cursoAntes: { text: "Later, the phone rings again.", ref: "M4.2.CURSO" },
        cliente: "Good afternoon again, was the coat found? And if so, how can I get it, since I'm no longer in Lisbon?",
        resumo: "The coat has been found and the guest wants to know how they can get it, since they're no longer in Lisbon. How will you respond?",
        // Frase de contexto um pouco mais comprida em inglês do que o
        // original — usa a variante de letra ligeiramente mais pequena (ver
        // .resumo-text-compact em style.css) para caber numa só linha.
        resumoCompact: true,
        opcoes: [
          { letter: "A", text: "Good afternoon, yes, the coat was found. I'll send it right away by registered post to the address we have on the booking.", correct: false, feedback: "Sending it without confirming the address or asking the guest's preference risks it going to the wrong place. Always confirm the details before taking action." },
          { letter: "B", text: "Good afternoon, yes, the coat was found. You'll need to tell us a courier you trust so we can arrange the shipping.", correct: false, feedback: "Asking the guest to choose and arrange the courier gives them extra work that should be yours. Whenever possible, keep the process simple on the hotel's end." },
          { letter: "C", text: "Good afternoon, yes, the coat was found and it's being kept at the front desk under your name. We can send it by registered post to your address, with the shipping cost covered by the hotel, or you can let us know another way you'd like to receive it.", correct: true, feedback: "Excellent! You confirm the essentials, cover the shipping cost as a goodwill gesture, and still leave room for the guest to choose whatever's most convenient for them." },
        ],
        ponte: [
          { who: "cliente", text: "Perfect, thank you so much, please send it by registered post to the address I already gave you on the booking." },
          { who: "tu", text: "Agreed, I'll arrange the shipping this week and send you the tracking number as soon as it's available." },
        ],
      },
      {
        cliente: "Thank you very much for your help. Just one last question, how will I know once the coat has been sent?",
        resumo: "The guest wants to know how they'll be notified once the coat is sent. How will you respond?",
        opcoes: [
          { letter: "A", text: "As soon as the parcel is handed over to the post office, I'll send you a confirmation email with the tracking number, so you can follow the delivery all the way home.", correct: true, feedback: "Congratulations! You give the guest a concrete way to track the process, which closes the matter with confidence and transparency." },
          { letter: "B", text: "Don't worry, I'll take care of everything myself and arrange the shipping this week.", correct: false, feedback: "Promising to handle the shipping is good, but it doesn't answer the question of how the guest will find out. Always say concretely how and when you'll let them know." },
          { letter: "C", text: "Once it's sent, we'll keep that information on file in case you'd like to check later.", correct: false, feedback: "Leaving the information available only if the guest asks again puts the burden of staying informed on them. Be proactive and let them know as soon as there's news, without them having to ask." },
        ],
        ponte: [],
      },
    ],
    fecho: [
      { who: "cliente", text: "Perfect, thank you so much for all your helpfulness and kindness!" },
      { who: "joana", text: "Did you see how a forgotten item, handled with care and follow-up, can become a good memory instead of a frustration? That extra care is what brings guests back." },
      { who: "joana", text: "Congratulations, you've completed the final module! Next, you'll get a quick summary of best practices for handling remote requests, before we wrap up this training." },
    ],
    boasPraticas: {
      titulo: "Best Practices for Following Up on a Remote Request",
      fazer: [
        "Trust the guest's account and promptly confirm the situation with the responsible team.",
        "Always set a concrete, prompt next step, keeping the guest informed.",
        "Cover reasonable costs as a goodwill gesture, when appropriate to the situation.",
      ],
      evitar: [
        "Doubting the guest's account or discouraging them from the outset.",
        "Charging costs or delaying the resolution without any real need to.",
        "Dismissing the guest's legitimate concerns about what happened.",
      ],
      citacao: "A forgotten item, handled with care and follow-up, can become a good memory instead of a frustration.",
    },
  },
];

// Módulos por idioma — ver state.lang em main.js (mods()).
const MODULES_BY_LANG = { pt: MODULES, en: MODULES_EN };

// Textos fixos da interface (fora dos dados de cada módulo) — botões,
// cabeçalhos, rótulos da barra superior, etc. Ver t() em main.js.
const STRINGS = {
  pt: {
    docTitle: "Ribeira Palace · Formação e-learning",
    tagline: "Formação e-learning",
    fullscreen: "Ecrã inteiro",
    fullscreenAria: "Alternar ecrã inteiro",
    sound: "Som",
    soundAria: "Ligar/desligar som",
    music: "Música",
    musicAria: "Ligar/desligar música",
    lang: "Idioma",
    langAria: "Mudar idioma",
    exit: "Sair",
    exitAria: "Sair do curso",
    exitConfirm: "Sair do curso? O teu progresso fica guardado.",
    loading: "A carregar...",
    modulos: "Módulos",
    moduloPrefix: "Módulo",
    modulosAnteriores: "Módulos anteriores",
    modulosSeguintes: "Módulos seguintes",
    continuar: "Continuar",
    tentarNovamente: "Tentar Novamente",
    situacao: "Situação:",
    respostaCorreta: "Resposta correta",
    respostaErrada: "Resposta errada",
    // Palavra usada no NOME do ficheiro de áudio de feedback (ver
    // guiao/build_falas_tts.js/_en.js e showFeedback em main.js) — não é
    // texto mostrado no ecrã, por isso fica à parte de respostaCorreta/Errada.
    audioTagCorrect: "correta",
    audioTagWrong: "errada",
    boasPraticas: "Boas práticas",
    oQueEvitar: "O que evitar",
    parabens: "Parabéns!",
    formacaoConcluida: "Formação Concluída",
    terminar: "Terminar",
    creditLine1: "Idealizado · Desenhado · Desenvolvido",
    creditBy: "por",
    joana: "Joana",
    hospede: "Hóspede",
    cliente: "Cliente",
    recepcionista: "Rececionista",
  },
  en: {
    docTitle: "Ribeira Palace · e-learning Training",
    tagline: "e-learning Training",
    fullscreen: "Full screen",
    fullscreenAria: "Toggle full screen",
    sound: "Sound",
    soundAria: "Turn sound on/off",
    music: "Music",
    musicAria: "Turn music on/off",
    lang: "Language",
    langAria: "Change language",
    exit: "Exit",
    exitAria: "Exit the course",
    exitConfirm: "Exit the course? Your progress will be saved.",
    loading: "Loading...",
    modulos: "Modules",
    moduloPrefix: "Module",
    modulosAnteriores: "Previous modules",
    modulosSeguintes: "Next modules",
    continuar: "Continue",
    tentarNovamente: "Try Again",
    situacao: "Situation:",
    respostaCorreta: "Correct answer",
    respostaErrada: "Wrong answer",
    audioTagCorrect: "correct",
    audioTagWrong: "wrong",
    boasPraticas: "Best practices",
    oQueEvitar: "What to avoid",
    parabens: "Congratulations!",
    formacaoConcluida: "Training Completed",
    terminar: "Finish",
    creditLine1: "Conceived · Designed · Developed",
    creditBy: "by",
    joana: "Joana",
    hospede: "Guest",
    cliente: "Customer",
    recepcionista: "Receptionist",
  },
};
