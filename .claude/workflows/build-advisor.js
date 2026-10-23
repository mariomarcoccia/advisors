// GENERATED FILE: do not edit by hand.
// Source: pipeline/engine.js + pipeline/specs/*.json. Regenerate with `npm run render` in pipeline/.
// Dossier build pipeline, run by Claude Code's Workflow tool.
//
// This file is a TEMPLATE. `npm run render` in pipeline/ validates every
// specs/<slug>.json and writes .claude/workflows/build-advisor.js with the specs
// embedded below. Specs are embedded rather than passed as args because large
// Workflow args are unreliable; the run only needs a small `args` object:
//
//   { slug: "paul-graham", mode: "rebuild" | "create", repoDir: "/abs/path/to/advisors",
//     notesDir?: "/abs/path/for/research/notes", date?: "YYYY-MM-DD" }
//
// Five phases, model split per reference/persona-template.md: Sonnet does the
// volume (enumerate, extract, draft, preliminary quote check); Opus does one
// consolidated pass for fidelity, corpus completeness, and depth.

export const meta = {
  name: 'build-advisor',
  description: 'Build or rebuild an advisor dossier to the gold standard: Sonnet enumerates, extracts, drafts, and pre-checks quotes; Opus makes one consolidated pass (fidelity + completeness + depth).',
  phases: [
    { title: 'Enumerate', detail: 'Sonnet: parallel sweeps of the corpus' },
    { title: 'Extract', detail: 'Sonnet: one agent per batch of sources' },
    { title: 'Synthesize', detail: 'Sonnet: full dossier draft' },
    { title: 'Pre-verify', detail: 'Sonnet: string-match load-bearing quotes against raw sources' },
    { title: 'Consolidate', detail: 'Opus: fidelity + completeness + depth, fixed in place' },
  ],
}

const SPECS = {
  "alexandre-birman": {
    "slug": "alexandre-birman",
    "name": "Alexandre Birman",
    "lang": "pt",
    "corpus": "thin",
    "person": "Alexandre Birman, CEO da Azzas 2154 (fusão Arezzo&Co + Grupo Soma, ago/2024), ex-CEO da Arezzo&Co, fundador da marca de luxo Alexandre Birman (2008). Filho de Anderson Birman, fundador da Arezzo. Sapateiro desde criança. NÃO é nenhum outro Alexandre Birman.",
    "enumPrompts": [
      {
        "label": "marca-craft",
        "prompt": "Enumere material sobre a MARCA PRÓPRIA e o lado \"designer/craft\" de {{PERSON}}, além do já conhecido (Esfera Brasil \"sapateiro desde criança\", SindiShopping \"chão de fábrica\").\n1. Cobertura de moda/calçados especificamente sobre a marca Alexandre Birman (2008-): WWD, Footwear News, Vogue Brasil, revistas de moda, filosofia de design, processo criativo, clientela de red carpet, prêmio FFANY Designer of the Year 2017.\n2. Qualquer entrevista sobre os anos de formação na Itália estudando sapataria, ou sobre aprender o ofício com o pai Anderson Birman.\n3. Material sobre a proposta de \"moda contemporânea sem pretensão de ser luxo\" para o grupo vs. a marca de luxo dele mesmo, qualquer entrevista que aprofunde essa tensão.\nRetorne URLs exatas, priorize itens com citações diretas dele (não só descrição de produto), 10-15 itens."
      },
      {
        "label": "negocios-ma",
        "prompt": "Enumere imprensa de NEGÓCIOS/M&A sobre {{PERSON}} além do já conhecido (NeoFeed pandemia 2020, Exame M&A, Brazil Journal Reserva 2020, Brazil Journal Insights/Bradesco, NeoFeed \"mudança de liga\", Estado de Minas \"rumo a 2154\").\n1. Entrevistas/perfis em Forbes BR, Época Negócios, Veja, Pequenas Empresas Grandes Negócios, Valor Econômico sobre a estratégia de M&A, o roll-up Arezzo&Co, ou a filosofia \"casa de marcas\".\n2. Cobertura do lançamento/tese da fusão Arezzo+Soma em Azzas 2154 (ago/2024), entrevistas dele especificamente sobre a lógica da fusão, não só nota de imprensa.\n3. Qualquer entrevista/podcast de negócios (Braincast, Market Makers, Sala de Investimento, etc.) onde ele fale sobre estratégia, sucessão ou governança.\nRetorne URLs exatas, 10-15 itens, priorize citações diretas dele."
      },
      {
        "label": "azzas-jatahy-atualizado",
        "prompt": "Enumere cobertura ATUALIZADA (2026, principalmente pós-junho/2026, já que hoje é 2026-07-10) da disputa societária entre {{PERSON}} e o co-CEO Roberto Jatahy na Azzas 2154, além do já conhecido (Seu Dinheiro, InfoMoney Kameyama, Portal Tela jun/2026 unificação de arbitragem, InvestNews \"risco de divórcio\").\n1. Desdobramentos mais recentes: resultado da arbitragem CAM-B3 nº 326/26, novas saídas de executivos, movimentação de ações, decisões judiciais.\n2. Qualquer entrevista ou declaração NOVA de Birman sobre o conflito (não apenas cobertura de terceiros), ele se pronunciou publicamente sobre isso além do que já está mapeado?\n3. Análises de mercado/investidores (JP Morgan, Morgan Stanley, XP, BTG) sobre o desfecho provável e o valuation da Azzas.\n4. Críticas ao estilo de gestão \"comando e controle\" dele, além do já citado, busque por mais fontes que caracterizem esse padrão.\nRetorne URLs exatas, tipo=critique quando aplicável, 10-15 itens, com datas o mais recentes possível."
      }
    ]
  },
  "alexandre-ostrowiecki": {
    "slug": "alexandre-ostrowiecki",
    "name": "Alexandre Ostrowiecki",
    "lang": "pt",
    "corpus": "thin",
    "person": "Alexandre Ostrowiecki, acionista controlador, ex-CEO (até abr/2025) e atual presidente do conselho do Grupo Multi (ex-Multilaser, B3: MLAS3), a maior fabricante-varejista de eletrônicos de consumo do Brasil. Assumiu a empresa aos 24 anos após o desaparecimento do pai. Coautor de dois livros político-econômicos sobre o Brasil: \"Carregando o Elefante\" (2008, com Renato Feder) e \"O Moedor de Pobres\" (2021). NÃO é nenhum outro Alexandre Ostrowiecki.",
    "enumPrompts": [
      {
        "label": "livros-a-fundo",
        "prompt": "Enumere conteúdo PRIMÁRIO dos dois livros de {{PERSON}}, prioridade alta, é o material mais denso e menos explorado no dossier atual.\n1. \"Carregando o Elefante, Como transformar o Brasil no país mais rico do mundo\" (2008, com Renato Feder, Leopardo Editora), busque resenhas longas, resumos de capítulo, trechos citados, ou qualquer entrevista de lançamento que cite o livro diretamente.\n2. \"O Moedor de Pobres\" (2021, LVM Editora), mesma coisa: resenhas, entrevistas de lançamento, trechos citados com página. Esse livro NÃO está nem sequer citado como fonte no dossier atual (só o primeiro está), priorize achá-lo.\nRetorne URLs exatas, prioridade alta para qualquer trecho verbatim dos livros (não só ficha técnica/sinopse)."
      },
      {
        "label": "negocios-turnaround-atualizado",
        "prompt": "Enumere imprensa de NEGÓCIOS sobre {{PERSON}} além do já conhecido (InfoMoney várias, Seu Dinheiro 2021, NeoFeed out/2024, Exame INSIGHT, Tecnoblog abr/2024, meuSucesso x2, Exame IN 2021, Poder360 jul/2025, Canaltech, XP mar/2025, Guia do Investidor, Times Brasil).\n1. Cobertura MAIS RECENTE (2026, já que hoje é {{DATE}}) do turnaround do Grupo Multi, resultados trimestrais recentes, novos produtos/verticais, declarações dele especificamente (não só do novo CEO André Poroger).\n2. Qualquer podcast ou entrevista em vídeo mais longa (Braincast, Market Makers, Sala de Investimento, canais de YouTube de negócios) onde ele fale mais extensamente sobre a trajetória da empresa.\n3. Perfis/entrevistas em Forbes BR, Época Negócios, Valor Econômico, Veja não ainda cobertos.\nRetorne URLs exatas, 10-15 itens, priorize citações diretas dele."
      },
      {
        "label": "criticas",
        "prompt": "Enumere CRÍTICAS e material adversarial sobre {{PERSON}} além do já conhecido (a queda de ~90% da ação MLAS3 pós-IPO, o prejuízo de R$836M em 2023, a percepção de marca/qualidade \"não compre TV da Multilaser\", e a nuvem de governança em torno do co-controlador Renato Feder nas vendas para redes de educação que ele supervisionava).\n1. Reportagens adicionais sobre a controvérsia Feder/educação (conflito de interesse, contratos públicos).\n2. Qualquer crítica de analistas de mercado (XP, BTG, Itaú BBA) sobre a governança ou a estratégia de longo prazo do Grupo Multi.\n3. Reclamações de consumidor sobre qualidade de produto (Reclame Aqui, Procon) que documentem o problema de percepção de marca de forma mais concreta.\n4. Cobertura trabalhista/sindical sobre as fábricas em Extrema/MG e Manaus/AM, se existir.\nRetorne URLs exatas, tipo=critique, 8-12 itens."
      }
    ]
  },
  "alice-walton": {
    "slug": "alice-walton",
    "name": "Alice Walton",
    "lang": "en",
    "corpus": "thin",
    "person": "Alice Walton, Walmart heiress (daughter of Sam Walton), philanthropist and art patron, founder of Crystal Bridges Museum of American Art, Art Bridges, and the Alice L. Walton School of Medicine. NOT any other Alice Walton. IMPORTANT: she is genuinely reclusive, very few interviews, no blog/essay habit, not a business theorist. Do NOT pad the corpus with weak secondary sources or inflate thin material to look like more than it is. If the honest count of primary/substantial sources is modest, report that honestly rather than force it toward this project's usual scale.",
    "enumPrompts": [
      {
        "label": "ensaios-talks",
        "prompt": "Enumerate PRIMARY content from {{PERSON}} beyond what's already known (W Magazine 2021 interview, Arkansas Business interview, Semafor 2025 healthcare interview, the Alice L. Walton School of Medicine grand-opening statement, a Thrive Global piece with Arianna Huffington).\n1. Search for any additional interview, op-ed, or written statement she's authored directly, Crystal Bridges annual reports, Art Bridges materials, or medical-school launch materials with her own first-person language.\n2. Look for any speech or remarks at a Crystal Bridges event, Art Bridges conference, or the medical school's opening ceremony beyond the grand-opening statement already cited.\n3. Any interview specifically about her own art-collecting philosophy or specific acquisition decisions (the Kindred Spirits/NYPL controversy is cited as critique, find her own account/defense if one exists).\nReturn exact URLs, priority=high for anything with substantial first-person content, one-line \"why\" per item. If you find fewer than 8 genuinely new items, that is an accurate result, report it as such rather than padding with low-value sources."
      },
      {
        "label": "entrevistas-recentes",
        "prompt": "Enumerate INTERVIEW/PODCAST appearances of {{PERSON}} beyond the ones already known (W Magazine, Arkansas Business, Semafor, PBS NewsHour, TIME100 Health, Thrive Global).\n1. Any 2024-2026 interview/podcast appearance beyond the ones cited, she gives very few, so be thorough but honest if the count is genuinely small.\n2. Any interview specifically about her relationship to Walmart itself (she's not an operator there), her own framing of her role vs. her siblings/family, and how Walmart wealth funds her philanthropy.\n3. Any interview about her personal art-collecting taste or specific acquisitions (beyond the \"everybody deserves access\" thesis already cited) with concrete named-artwork examples.\nReturn exact URLs, priority-marked. A short list (4-8 items) is an acceptable, honest result for this reclusive a figure."
      },
      {
        "label": "criticas",
        "prompt": "Enumerate CRITIQUES and adversarial material on {{PERSON}} beyond what's already known (the Forbes \"condescension\" quote controversy, the Kindred Spirits/NYPL sale backlash, Jobs With Justice and Arkansas Times tax-avoidance critiques).\n1. Named critics of Walmart labor practices who specifically target the Walton family's philanthropy as reputation-laundering, beyond the two already cited sources, find more direct/named critique.\n2. Any critique of the Alice L. Walton School of Medicine's funding model, admissions approach, or \"value-based care\" thesis from medical-education critics or health-policy researchers.\n3. Any critique of her art-world acquisitions/influence, museum-world critics of how Walton money has reshaped access to American art, beyond the Kindred Spirits case.\nReturn exact URLs, type=critique, 4-8 items, be honest if adversarial material specifically targeting her personally (vs. the Walton family generally) is thin."
      }
    ]
  },
  "ben-horowitz": {
    "slug": "ben-horowitz",
    "name": "Ben Horowitz",
    "lang": "en",
    "corpus": "large",
    "person": "Ben Horowitz, co-founder of Andreessen Horowitz (a16z); former CEO of Loudcloud/Opsware (sold to HP for ~$1.6B); author of \"The Hard Thing About Hard Things\" (2014) and \"What You Do Is Who You Are\" (2019). Writes/speaks on management, hard decisions, hiring, culture, and, since ~2024, AI/crypto policy and politics.",
    "notes": {
      "focus": "Book content is the highest-priority payload: represent \"The Hard Thing About Hard Things\" (2014) and \"What You Do Is Who You Are\" (2019) thoroughly, with real worked examples and verbatim passages woven through Core ideas, Mental models, and \"Books distilled\" (e.g. \"How to Fire a Friend\", \"The Case for the Fat Startup\", the Louverture, Genghis Khan, and Shaka Senghor material).",
      "attribution": "Some quotes may be a co-author's, an interviewer's, a journalist's description of the book, or someone he is quoting (Andy Grove, Cus D'Amato) rather than his own words."
    },
    "enumPrompts": [
      {
        "label": "livros-a-fundo",
        "prompt": "Enumerate PRIMARY BOOK content for {{PERSON}}, this is the highest-priority target for this rebuild.\n1. \"The Hard Thing About Hard Things\" (2014), find any accessible way to read MORE of the actual book text beyond what's already summarized: Google Books preview pages, archive.org borrow/full-text-search-inside results, publisher excerpt pages, \"the moment\" you can search inside, long-form book reviews that quote extended passages verbatim (not just chapter-summary blogs), and specific chapters that do NOT have a standalone a16z blog-post equivalent (e.g. \"Take Care of the People, the Products, and the Profits\", \"The Case for the Fat Startup\", \"How to Minimize Politics in Your Company\", \"When Employees Misbehave\", \"How to Fire a Friend\", \"Ben's Fifteen Rules of Corporate Warfare\", \"Old People\", \"This Time With Feeling\", checklist chapters that aren't just reprinted essays). Return exact URLs, priority=high, with a note on what NEW book content (not already-known blog essays) each source would surface.\n2. \"What You Do Is Who You Are\" (2019), same treatment: find excerpt pages, Google Books preview, long reviews quoting extended passages, any chapter on Toussaint Louverture / Genghis Khan / Shaka Senghor / samurai that goes beyond what's already summarized, and the book's own introduction/closing chapter framing if excerptable.\nPrioritize sources that let you quote MORE of the actual book prose verbatim, not just re-confirm what a blog essay already covers."
      },
      {
        "label": "ensaios-a16z",
        "prompt": "Enumerate additional a16z ESSAYS by {{PERSON}} beyond the 8 already known (Peacetime CEO/Wartime CEO, Lead Bullets, The Struggle, The Right Kind of Ambition, Making Yourself a CEO, Why Startups Should Train Their People, The Sad Truth About Developing Executives, Don't Follow Your Passion).\nWalk a16z.com's blog/essay archive or index for Ben Horowitz specifically and find 8-15 MORE of his classic essays: candidates to check for, \"Old People\", \"The Case for the Fat Startup\", \"How to Minimize Politics in Your Company\", \"Some Advice for Founders on Fundraising\", \"A Good Place to Work\", \"How to Rate Your CEO\", \"When Employees Misbehave\", \"Managing Your Own Board\", \"The Freaky Friday Management Technique\", \"Why We Prefer Founding CEOs\", \"Should You Fire an Executive When Reference Checks Are Bad?\", \"Ones and Zeroes\", \"The Case for a16z crypto/American Dynamism\". Return exact URLs, priority-marked, one-line \"why\" per item."
      },
      {
        "label": "podcasts-talks",
        "prompt": "Enumerate PODCAST/TALK/interview appearances of {{PERSON}} beyond the 6 already known (Tim Ferriss #392, Lenny's Podcast 2025, a16z Speedrun, Uncapped #38/Jack Altman, a16z Show \"RSI Crypto Classified Physics\" Feb 2026, a16z Podcast \"AI and Crypto\" 2025, Columbia SEAS 2015 talk).\nLook for: Lex Fridman podcast appearances, All-In Podcast appearances, any recent (2025-2026) interview on AI policy/politics specifically, university commencement/guest lectures beyond Columbia, and any joint interview with Marc Andreessen. Prefer sources with full transcripts. Return 8-15 items with exact URLs, priority-marked."
      },
      {
        "label": "criticas",
        "prompt": "Enumerate CRITIQUES and adversarial material on {{PERSON}} beyond what's already known (Jane Psmith/The PSmiths book review, Eric Nehrlich review, the John O'Farrell rebuke, TechCrunch on Trump-backing/lobbying/Las Vegas police donations, Futurism).\n1. Any additional serious book critique (management-theory academics or practitioners critiquing \"The Hard Thing\" or \"What You Do Is Who You Are\" specifically), Goodreads/critical long-form reviews that engage substantively, not just star ratings.\n2. Fresh 2025-2026 political/policy critiques of a16z or Horowitz specifically beyond what's cited (AI safety advocates, other departed a16z people, journalism on a16z's PAC \"Leading the Future\" spending).\n3. Critiques of the \"wartime CEO\" framework specifically, management writers who've argued it enables abusive behavior (check if there's a named critique beyond generic mentions).\nReturn exact URLs, type=critique, 8-12 items."
      }
    ]
  },
  "bernard-arnault": {
    "slug": "bernard-arnault",
    "name": "Bernard Arnault",
    "lang": "en",
    "corpus": "normal",
    "person": "Bernard Arnault, Chairman and CEO of LVMH (Moët Hennessy Louis Vuitton), the world's largest luxury conglomerate, built via decades of brand acquisitions (Dior, Louis Vuitton, Moët, and dozens more). French. NOT any other Bernard Arnault.",
    "enumPrompts": [
      {
        "label": "ensaios-talks",
        "prompt": "Enumerate PRIMARY content from {{PERSON}} beyond what's already known (the 2001 HBR interview, the 2016 Oxford Union Q&A, quotes from \"La Passion créative,\" the 2026 AGM \"two futures for luxury\" remarks).\n1. Walk for any additional long-form interview or speech transcript (French or English) where he lays out his business philosophy directly, LVMH investor days, AGM speeches, French business-press interviews (Les Echos, Le Figaro, Challenges) not yet cited.\n2. Find excerpts from \"La Passion créative\" (his book with Yves Messarovitch) beyond the Investment Masters Class secondary compilation, look for direct excerpts or reviews quoting substantial passages verbatim.\n3. Any recent (2024-2026) interview or speech specifically about succession planning among his five children (who now hold senior LVMH roles), his own framing of family governance and the transition plan.\nReturn exact URLs, priority=high for anything with substantial first-person content, one-line \"why\" per item."
      },
      {
        "label": "entrevistas-recentes",
        "prompt": "Enumerate INTERVIEW/PODCAST appearances of {{PERSON}} beyond the ones already known (2001 HBR, 2016 Oxford Union).\n1. Any 2023-2026 interview discussing the luxury slowdown, China demand, or LVMH's strategy amid slowing growth (the dossier cites secondary press on this but likely lacks direct Arnault interview quotes).\n2. Any interview about the Gucci Group hostile-takeover battle (LVMH vs. PPR/Pinault, 1999-2001) in his own words, strategy, regrets, lessons.\n3. Any interview about becoming the world's richest person (multiple times) and how he thinks about wealth, competition with other billionaires (Musk, Bezos), or his own ambition.\nReturn exact URLs, priority-marked, 6-10 items with transcripts preferred."
      },
      {
        "label": "criticas",
        "prompt": "Enumerate CRITIQUES and adversarial material on {{PERSON}} beyond what's already known (the Galliano firing, the Gucci hostile-takeover battle critique).\n1. Critiques of his acquisition/takeover tactics, named executives, founders, or rival conglomerates (Kering/Pinault) who've criticized his methods as predatory or aggressive.\n2. Critiques of LVMH's labor practices, supply chain, or environmental record, named labor unions, NGOs, or journalists with direct quotes.\n3. Critiques of his wealth/tax practices, the 2012 Belgian-citizenship bid controversy (widely reported, seek his own response too), or French political critiques of luxury-sector wealth concentration.\nReturn exact URLs, type=critique, 6-10 items."
      }
    ]
  },
  "caito-maia": {
    "slug": "caito-maia",
    "name": "Caito Maia",
    "lang": "pt",
    "corpus": "normal",
    "person": "Caito Maia (Antonio Caio Gomes Pereira Filho), fundador e CEO da Chilli Beans, a maior marca de óculos da América Latina (~1.200-1.400 lojas franqueadas). Ex-músico, virou \"gestor de marca\" puro (vendeu 100% das lojas próprias, fabrica 100% na China). Jurado histórico do Shark Tank Brasil. NÃO é nenhum outro Caito/Maia, é o fundador da Chilli Beans, nascido em São Paulo em 1969.",
    "enumPrompts": [
      {
        "label": "livros-site",
        "prompt": "Enumere o corpus PRIMÁRIO ESCRITO de {{PERSON}}\n1. Livro \"E se Colocar Pimenta?\" (2018, com Rodolfo Araújo), ache a página oficial da editora/Amazon/Skoob com resumo/trecho, e qualquer resenha longa que cite trechos verbatim.\n2. Livro \"Se Parar o Sangue Esfria\", mesma coisa: editora, Amazon, Skoob, resenhas com trechos.\n3. Site pessoal caitomaia.com, liste todas as páginas/posts substanciais (bio, blog, \"sobre\", artigos de opinião) se existirem.\n4. Qualquer coluna/artigo de opinião assinado por ele (não uma entrevista, texto escrito por ele mesmo) em veículos como Forbes BR, Exame, Época Negócios, LinkedIn.\nRetorne URLs exatas, com prioridade alta para os dois livros e qualquer texto autoral."
      },
      {
        "label": "podcasts-video",
        "prompt": "Enumere aparições em ÁUDIO/VÍDEO de {{PERSON}}\n1. Flow Podcast, episódio solo #457 e a participação #168 (com André Gaigher). Ache a página do episódio (Spotify/YouTube) e, se existir, transcrição ou pelo menos os melhores momentos cobertos pela imprensa.\n2. CEO Talks #250.\n3. Shark Tank Brasil, temporadas 2017-2022 como tubarão fixo + retorno como convidado em 2024/2025: ache clipes/trechos citados pela imprensa (ISTOÉ Dinheiro, outros) com falas dele sobre o que busca em fundadores.\n4. Outras aparições relevantes: Manual do Homem Moderno, Eu Tava Lá #173, The Noite (SBT), palestras em eventos (Franchising Summit/ABF, NEEX, Sicomércio se houver).\nPriorize fontes com transcrição ou cobertura jornalística detalhada com citações diretas (não apenas descrição de episódio). Retorne 10-20 itens com prioridade."
      },
      {
        "label": "imprensa-criticas",
        "prompt": "Enumere IMPRENSA e CRÍTICAS sobre {{PERSON}} e a Chilli Beans, além dos já conhecidos (Money Times, Seu Dinheiro, Consumidor Moderno, ISTOÉ Dinheiro, Agência Sebrae, Exame, Jornal do Comércio, Museu da Pessoa, ABF, não repita esses, busque NOVOS).\n1. Perfis/entrevistas adicionais em Forbes BR, Época Negócios, Pequenas Empresas Grandes Negócios, Mercado&Consumo, Veja, Estadão/Folha (retomar o item que deu 403 na Mercado&Consumo se conseguir outra via, ex: web.archive.org).\n2. Críticas sérias e sourced: reclamações de franqueados (Reclame Aqui já coberto, busque processos judiciais, disputas de franquia, reportagem sobre insatisfação de franqueados), críticas ao modelo \"100% fabricado na China\" sob ótica de trabalho/sustentabilidade, qualquer controvérsia de marketing ou campanha.\n3. Números financeiros mais recentes (2025/2026) sobre faturamento, expansão de óticas, eventual venda de participação.\nRetorne URLs exatas, tipo=critique para críticas, 10-15 itens."
      }
    ]
  },
  "carol-dweck": {
    "slug": "carol-dweck",
    "name": "Carol S. Dweck",
    "lang": "en",
    "corpus": "normal",
    "person": "Carol S. Dweck, Stanford psychologist, author of \"Mindset: The New Psychology of Success,\" creator of growth-mindset theory (fixed vs. growth mindset). NOT any other Carol Dweck.",
    "enumPrompts": [
      {
        "label": "ensaios-talks",
        "prompt": "Enumerate PRIMARY content from {{PERSON}} beyond what's already known (the Mindset book, TED talk, HBR articles 2014/2016, Education Week 2015 revisit essay, \"Even Geniuses Work Hard\" essay, several academic papers with Yeager/Mueller/Canning co-authors).\n1. Walk Stanford's own faculty pages, her lab site (mindsetscholarsnetwork.org if it exists, or Stanford SPARQ), and Google Scholar for any additional first-person essay, op-ed, or long-form written piece not yet cited, especially anything addressing the 2018-2023 replication-crisis controversy directly in her own words.\n2. Find any additional academic papers with substantial first-person theoretical framing (not just abstracts), particularly ones where she personally responds to critics (Sisk et al., Macnamara & Burgoyne) in her own voice.\n3. Any book excerpt, foreword, or updated-edition preface where she reflects on how \"growth mindset\" was popularized/commercialized beyond her original intent (the \"false growth mindset\" concern is already cited once, find more depth on this).\nReturn exact URLs, priority=high for anything with substantial first-person content, one-line \"why\" per item."
      },
      {
        "label": "entrevistas-recentes",
        "prompt": "Enumerate INTERVIEW/PODCAST appearances of {{PERSON}} beyond the ones already known (KQED MindShift \"false growth mindset\" interview, Tes Magazine interview on critics).\n1. Any long-form podcast/interview appearance (academic, business, or education-focused) where she discusses her own research career, how she arrived at mindset theory from earlier work on learned helplessness, her mentors/influences.\n2. Any interview specifically addressing the replication-crisis pushback on growth mindset research, her own point-by-point response to specific meta-analyses, not just general defenses.\n3. Any interview about how growth mindset got applied/misapplied in corporate and education settings, her own critique of the \"corporate mindset industry\" that grew around her work.\nReturn exact URLs, priority-marked, 6-10 items with transcripts preferred."
      },
      {
        "label": "criticas",
        "prompt": "Enumerate CRITIQUES and adversarial material on {{PERSON}} and growth-mindset theory beyond what's already known (Sisk et al. 2018 meta-analysis, Macnamara & Burgoyne 2023 meta-analysis, the KQED \"dueling meta-analyses\" piece).\n1. Named academic critics beyond Sisk/Macnamara/Burgoyne, any psychologist or education researcher who has published direct methodological critique of Dweck's original studies (small effect sizes, non-replication, the \"growth mindset industry\" critique).\n2. Critiques of the commercial/corporate application of growth mindset, consultants, HR critics, or journalists who've argued the theory got oversimplified or weaponized in ways she didn't intend.\n3. Any critique specifically of the 2019 Yeager/Dweck \"National Study of Learning Mindsets\", statisticians or education researchers who've challenged its methodology or interpretation.\nReturn exact URLs, type=critique, 6-10 items, this is an academic controversy, prioritize named researchers with published critique over journalistic hot-takes."
      }
    ]
  },
  "chris-olah": {
    "slug": "chris-olah",
    "name": "Chris Olah",
    "lang": "en",
    "corpus": "normal",
    "person": "Chris Olah, Co-founder of Anthropic and leader of its interpretability/mechanistic-interpretability research team. Previously at Google Brain and OpenAI. Co-founder of Distill.pub (an online journal, active ~2016-2021, for rigorous, visual, \"explorable\" explanations of machine learning research, distinct in style from traditional academic papers). Widely known in the ML community for foundational, personally-authored blog essays on colah.github.io (e.g. \"Understanding LSTM Networks,\" \"Neural Networks, Manifolds, and Topology,\" \"Visual Information Theory\") written years before Anthropic, in a distinctive first-person, intuition-building, heavily-diagrammed style. At Anthropic he leads and writes for the \"Transformer Circuits Thread\" (transformer-circuits.pub), a series of interpretability research publications written in an essayistic, first-person register rather than as anonymous multi-author papers. NOT any unrelated Chris/Christopher Olah.",
    "enumPrompts": [
      {
        "label": "ensaios-blog-pessoal",
        "prompt": "Enumerate PRIMARY WRITTEN material authored by {{PERSON}} in his own personal voice.\n1. Walk his personal blog at colah.github.io, find his classic essays (e.g. \"Understanding LSTM Networks,\" \"Neural Networks, Manifolds, and Topology,\" \"Visual Information Theory,\" \"Conv Nets: A Modular Perspective,\" and others), these are foundational, highly-cited, personally-written pieces predating Anthropic.\n2. Find pieces he wrote or co-wrote for Distill.pub (distill.pub) during his time co-founding/editing it, especially ones where his personal voice/framing is prominent (editorial pieces, \"Thread\" experiments, or his own research articles), not just any Distill paper.\n3. Find entries in Anthropic's \"Transformer Circuits Thread\" (transformer-circuits.pub) that he personally authored or led, and any of his X/Twitter threads laying out interpretability findings or opinions in his own words.\nReturn exact URLs, priority=high for anything with substantial first-person voice, one-line \"why\" per item."
      },
      {
        "label": "entrevistas-talks",
        "prompt": "Enumerate LONG-FORM INTERVIEWS, PODCASTS, and TALKS featuring {{PERSON}}.\n1. His appearance(s) on the 80,000 Hours Podcast, there are at least two distinct episodes (one from around 2021 on interpretability, one more recent, potentially 2025, about his unconventional career path), find both.\n2. His appearance on Lex Fridman's podcast (look for one specifically framed around \"mechanistic interpretability explained\" or similar).\n3. Any other substantial long-form interview or conference talk about interpretability research, why he left traditional academia/credentials path, or his research philosophy.\nPrioritize sources with full transcripts over short clips. Return exact URLs, priority-marked, one-line \"why\" per item."
      },
      {
        "label": "criticas",
        "prompt": "Enumerate CRITIQUES and adversarial material relevant to {{PERSON}} and his research program.\n1. Critiques from other ML researchers of mechanistic interpretability as a research agenda, e.g. skepticism that it will scale to frontier models, or that it's too slow/academic relative to the pace of capability advances.\n2. Any critique of Distill.pub's shutdown/discontinuation (~2021), reasons cited, and any reflection (his own or others') on why the format didn't sustain itself as a journal.\n3. Critiques of Anthropic's interpretability work being used for \"safety-washing\" (i.e. that it provides a veneer of safety rigor without actually constraining deployment decisions).\nReturn exact URLs, type=critique, 4-8 items, be honest about how substantial vs. thin the critical material is (he is a research figure, not a business executive, so adversarial coverage may be limited to technical-community discourse)."
      }
    ]
  },
  "dalton-caldwell": {
    "slug": "dalton-caldwell",
    "name": "Dalton Caldwell",
    "lang": "en",
    "corpus": "normal",
    "person": "Dalton Caldwell, co-founder and General Partner of Standard Capital (AI-native Series A firm), Partner Emeritus at Y Combinator (formerly Managing Director/Group Partner), co-hosts the \"Dalton & Michael\" YC podcast with Michael Seibel. Previously founded App.net (2012, shut down 2017) and imeem. NOT any other Dalton Caldwell.",
    "notes": {
      "attribution": "He co-hosts the \"Dalton & Michael\" YC series with Michael Seibel: distinguish his words from Michael's."
    },
    "enumPrompts": [
      {
        "label": "ensaios-talks",
        "prompt": "Enumerate PRIMARY content from {{PERSON}} beyond what's already known (the \"Dear Mark Zuckerberg\" 2012 open letter, Lenny's Podcast \"Lessons from 1,000+ YC startups,\" three \"Dalton & Michael\" YC Library talks, the Partner Emeritus announcement, Standard Capital's site).\n1. Walk the YC Startup Library and YC's YouTube channel for more \"Dalton & Michael\" episodes not yet cited, prioritize ones with substantial Caldwell-specific content (distinguish his words from Michael Seibel's, since they co-host).\n2. Find any blog posts he's authored on daltoncaldwell.com beyond the \"Dear Mark Zuckerberg\" letter, look for the full archive.\n3. Any 2025-2026 essay, interview, or talk specifically about founding Standard Capital and the thesis behind an \"AI-native Series A firm\", what changed for him going from YC partner to fund GP.\nReturn exact URLs, priority=high for anything with substantial first-person content, one-line \"why\" per item."
      },
      {
        "label": "entrevistas-recentes",
        "prompt": "Enumerate INTERVIEW/PODCAST appearances of {{PERSON}} beyond the ones already known (Lenny's Podcast \"Lessons from 1,000+ YC startups,\" Fortune 2024 on Requests for Startups).\n1. Any 2024-2026 interview/podcast where he's the primary guest discussing his YC tenure retrospectively, the transition to Partner Emeritus, or founding Standard Capital.\n2. Any interview specifically about the App.net story, founding it in 2012 as a paid Twitter alternative, the funding/pivot arc, and why it ultimately shut down in 2017, his own first-person retrospective on what he learned.\n3. Any interview about his working relationship/friendship with Michael Seibel, how the \"Dalton & Michael\" format came about, division of roles.\nReturn exact URLs, priority-marked, 6-10 items with transcripts preferred."
      },
      {
        "label": "criticas",
        "prompt": "Enumerate CRITIQUES and adversarial material on {{PERSON}} beyond what's already known.\n1. Any critique of App.net's business model or execution from former users, employees, or tech press at the time (2012-2017), named critics with direct quotes about why the paid-social-network bet failed.\n2. Any critique of his YC investment judgment/track record, named founders or peers who've pushed back on specific advice or calls he's made publicly (e.g., on the \"Dalton & Michael\" show).\n3. Any critique of Standard Capital's \"AI-native Series A\" thesis itself, skeptics of the fund's positioning or strategy.\nReturn exact URLs, type=critique, 4-8 items, be honest if adversarial material is thin (he's a lower-controversy figure than most of the roster)."
      }
    ]
  },
  "daniela-amodei": {
    "slug": "daniela-amodei",
    "name": "Daniela Amodei",
    "lang": "en",
    "corpus": "normal",
    "person": "Daniela Amodei, Co-founder & President of Anthropic (founded 2021), running operations, business, finance, legal, policy, and communications. Before Anthropic she worked at OpenAI in operations/safety roles, and before that spent several years at Stripe leading risk operations, and earlier in the humanitarian/human-rights sector (including at the US Department of the Treasury on human trafficking policy). Sister of Anthropic CEO Dario Amodei; co-founded the company with him and several ex-OpenAI colleagues. Known for a management/operations-focused public voice rather than technical research output, interviews on scaling a values-driven AI company, hiring philosophy, and the operational side of running a frontier AI lab. NOT her brother Dario Amodei (a separate advisor) or any unrelated Daniela Amodei.",
    "notes": {
      "attribution": "Do not confuse her with her brother, Dario Amodei (Anthropic CEO), who has a separate dossier."
    },
    "enumPrompts": [
      {
        "label": "entrevistas-primarias",
        "prompt": "Enumerate LONG-FORM INTERVIEWS and PANEL APPEARANCES featuring {{PERSON}}, President and co-founder of Anthropic.\nSpecifically look for and verify these known leads, plus find any others:\n1. Sixth Street podcast appearance (~May 2026).\n2. Future of Life Institute panel/interview alongside her brother Dario Amodei (~2023), possibly transcribed on LessWrong or the Future of Life Institute site.\n3. Notion \"First Block\" interview series (~2023).\n4. Stanford GSB \"View From the Top\" talk (~May 2026).\n5. Grit Podcast episode #177 (~Feb 2024).\n6. Fortune interview (~Feb 2026) about hiring/humanities backgrounds at Anthropic.\nReturn exact URLs (verify each lead actually exists and get the real URL, do not guess), priority=high for anything with substantial first-person content, one-line \"why\" per item."
      },
      {
        "label": "outras-fontes",
        "prompt": "Enumerate any OTHER primary material, essays, company blog posts, or additional interviews/podcasts, where {{PERSON}} speaks in her own voice about: Anthropic's founding story and the decision to leave OpenAI, operational/hiring philosophy at Anthropic, running a \"safety-focused\" company at commercial scale, or her views on AI policy/regulation from an operations (not research) angle. Also check for any co-authored Anthropic company statements or letters where she is a named voice. Return exact URLs, priority-marked, one-line \"why\" per item."
      },
      {
        "label": "criticas",
        "prompt": "Enumerate CRITIQUES and adversarial material about {{PERSON}} and Anthropic's operations/business strategy under her leadership.\n1. Critiques of Anthropic's fundraising and valuation trajectory (e.g. criticism of raising from sovereign wealth funds or defense-adjacent deals conflicting with a \"safety-first\" public stance).\n2. Critiques of Anthropic's business model (enterprise/API pricing, competitive positioning vs. OpenAI/Google) that specifically implicate operational/business leadership.\n3. Any specific public disagreement between her and other named tech/AI executives on business strategy or company culture.\nReturn exact URLs, type=critique, 4-8 items, be honest about how substantial vs. thin the critical material is (she has a much lower public profile than her brother; critical material specifically about her may be thin)."
      }
    ]
  },
  "dario-amodei": {
    "slug": "dario-amodei",
    "name": "Dario Amodei",
    "lang": "en",
    "corpus": "normal",
    "person": "Dario Amodei, Co-founder & CEO of Anthropic (founded 2021). Physicist by training (PhD Princeton, computational neuroscience/biophysics). Before Anthropic he was VP of Research at OpenAI (co-authored the GPT-2 and GPT-3 papers, drove the scaling-laws research direction), and before that worked at Google Brain and at Baidu under Andrew Ng. Left OpenAI in 2020/2021 along with his sister Daniela Amodei and several colleagues over disagreements about safety culture and commercialization pace, founding Anthropic to pursue AI safety research \"from the inside\" by building frontier models responsibly. Author of the essay \"Machines of Loving Grace\" (Oct 2024) on AI's potential positive impact, and of Anthropic's \"Responsible Scaling Policy\" framing. Frequent long-form interviewee (Dwarkesh Patel, Lex Fridman, Hard Fork/NYT, Big Technology) and has testified before the US Congress on AI policy/regulation. NOT his sister Daniela Amodei (Anthropic's President, a separate advisor) or any unrelated Dario Amodei.",
    "notes": {
      "attribution": "Do not confuse him with his sister, Daniela Amodei (Anthropic co-founder and President), who has a separate dossier."
    },
    "enumPrompts": [
      {
        "label": "ensaios-blog",
        "prompt": "Enumerate PRIMARY WRITTEN material authored by {{PERSON}}.\n1. Find his essay \"Machines of Loving Grace\" (darioamodei.com, Oct 2024), the full text, not summaries.\n2. Find any other essays, blog posts, or long-form letters he has personally written or is the named/primary author of on the Anthropic website (anthropic.com/news) or his personal site darioamodei.com, e.g. writing on Anthropic's Responsible Scaling Policy, AI safety, economic impact of AI, or company strategy.\n3. Find his written Congressional testimony (US Senate/House AI hearings), the submitted written statements, not just news coverage of the hearing.\nReturn exact URLs, priority=high for anything with substantial first-person authored content, one-line \"why\" per item."
      },
      {
        "label": "entrevistas-talks",
        "prompt": "Enumerate LONG-FORM INTERVIEWS, PODCASTS, and TALKS featuring {{PERSON}}.\n1. His appearance(s) on the Dwarkesh Patel podcast (check for more than one episode).\n2. His appearance(s) on Lex Fridman's podcast.\n3. His appearance(s) on Hard Fork (NYT podcast, hosts Kevin Roose/Casey Newton) and on Big Technology Podcast (Alex Kantrowitz).\n4. Any other substantial long-form interview (video or audio, ideally with transcript) about AI safety, scaling, Anthropic's founding story, or AGI timelines.\nPrioritize sources with full transcripts over short clips. Return exact URLs, priority-marked, one-line \"why\" per item."
      },
      {
        "label": "criticas",
        "prompt": "Enumerate CRITIQUES and adversarial material about {{PERSON}} and Anthropic's strategy under his leadership.\n1. Critiques of Anthropic's \"safety-focused\" positioning being used as marketing while still racing to build frontier models (the \"safety-washing\" or \"race to the bottom\" critique from AI safety researchers or competitors).\n2. Critiques of his AGI timeline predictions or economic predictions (e.g. claims about AI curing diseases, mass job displacement, or being \"a country of geniuses in a datacenter\") being overstated or unfalsifiable.\n3. Any specific public disagreement between him and other named AI figures (e.g. Yann LeCun, Sam Altman, Elon Musk, Gary Marcus) on regulation, safety approach, or timelines.\nReturn exact URLs, type=critique, 4-8 items, be honest about how substantial vs. thin the critical material is."
      }
    ]
  },
  "denis-minev": {
    "slug": "denis-minev",
    "name": "Denis Benchimol Minev",
    "lang": "pt",
    "corpus": "thin",
    "person": "Denis Benchimol Minev, CEO of Bemol (Brazilian retail chain based in Manaus, Amazonas state). Educated at Stanford and Wharton. Former Secretary of Planning of the State of Amazonas. Founder of multiple Amazon-region-focused NGOs/nonprofits. Named a special envoy for COP30 (the UN climate conference held in Belém, Brazil). Recurrent, substantive interviews (NeoFeed, O Globo, Jornal do Commercio) articulating an original economic thesis about the Amazon region (sustainable development, bioeconomy). NOT any other Denis Minev.",
    "enumPrompts": [
      {
        "label": "tese-amazonia",
        "prompt": "Enumerate PRIMARY interview/essay content on {{PERSON}}, focused on his economic thesis about the Amazon region and bioeconomy.\n1. Find the NeoFeed interview/profile, and any O Globo or Jornal do Commercio piece where he articulates his own economic framework for sustainable development in the Amazon.\n2. Find any op-ed, column, or long-form essay he has authored (Valor Econômico, Folha, or similar) about Amazon economic policy, bioeconomy, or regional development.\n3. Find content related to his COP30 special-envoy role, statements, interviews, or panel appearances where he speaks in his own words about climate/Amazon policy.\nReturn exact URLs, priority=high for anything with substantial first-person verbatim content, one-line \"why\" per item. Content will mostly be in Portuguese, that's expected and correct."
      },
      {
        "label": "carreira-bemol-governo",
        "prompt": "Enumerate INTERVIEWS and TALKS by {{PERSON}} about his business and government career.\n1. Find interviews about running Bemol (retail chain in Manaus), strategy, competitive positioning in the Amazon regional market, and how the family business background shaped his approach.\n2. Find interviews/press coverage of his tenure as Secretary of Planning of Amazonas state, specific policy decisions or initiatives he led.\n3. Find interviews about the NGOs/nonprofits he founded focused on the Amazon, his own account of why he started them and what they do.\nReturn exact URLs, priority-marked, prioritizing full transcripts or extensive direct quotation over short event-listing pages."
      },
      {
        "label": "criticas",
        "prompt": "Enumerate CRITIQUES and adversarial or complicating material on {{PERSON}}.\n1. Any critique of Bemol's business performance or competitive position in the Amazonas retail market.\n2. Any critique or skepticism of his Amazon economic/bioeconomy thesis, his tenure as Secretary of Planning, or his NGO work (effectiveness, conflicts of interest between his business and policy roles).\n3. Any controversy connected to his COP30 role, government relationships, or governance that names him specifically.\nReturn exact URLs, type=critique, 4-8 items, be honest if adversarial material specifically targeting him personally is thin (this is a less internationally-covered figure, say so if true rather than padding)."
      }
    ]
  },
  "elon-musk": {
    "slug": "elon-musk",
    "name": "Elon Musk",
    "lang": "en",
    "corpus": "normal",
    "person": "Elon Musk, CEO of Tesla and SpaceX, founder of xAI/X (formerly Twitter), co-founder of Neuralink, The Boring Company, and (early) PayPal/X.com and OpenAI. NOT a fictional or unrelated \"Elon Musk.\"",
    "enumPrompts": [
      {
        "label": "ensaios-talks",
        "prompt": "Enumerate PRIMARY content from {{PERSON}} beyond what's already known (Everyday Astronaut Starbase tour, TED2017, Lex Fridman #400, the \"5-step algorithm\" piece, YC AI Startup School 2025 talk, Tesla Master Plan + patents blog posts, 36Kr interviews).\n1. Walk his other TED/conference talks, All-In Podcast appearances, and any solo-monologue engineering explainer content (SpaceX Starship updates, Tesla product reveals) not yet cited, prioritize ones with substantial first-person technical reasoning (the \"algorithm,\" first-principles, manufacturing).\n2. Find excerpts, interviews, or reviews of Walter Isaacson's 2023 biography \"Elon Musk\" that quote him verbatim (not just Isaacson's narration), this is his most detailed primary-adjacent biographical source and the current dossier only cites a secondary Fox Business writeup of it.\n3. Any Tesla/SpaceX/xAI earnings-call or all-hands transcript with substantial first-person Musk commentary on strategy, hiring, or engineering philosophy.\nReturn exact URLs, priority=high for anything with substantial first-person content, one-line \"why\" per item."
      },
      {
        "label": "entrevistas-recentes",
        "prompt": "Enumerate INTERVIEW/PODCAST appearances of {{PERSON}} beyond the ones already known (Lex Fridman #400, 60 Minutes 2014, 36Kr x2).\n1. Any 2024-2026 long-form interview/podcast appearance (Joe Rogan, All-In, CNBC, Bloomberg, a16z) discussing Tesla FSD/robotics, SpaceX Starship/Mars timeline, xAI/Grok, or DOGE/government-efficiency work in depth.\n2. Any interview specifically about his childhood, South Africa upbringing, early Zip2/X.com/PayPal years, or the founding decisions at Tesla (2004 investment) and SpaceX (2002), origin-story detail with verbatim quotes, not just secondary paraphrase.\n3. Any recent (2025-2026) interview on AI safety/AGI risk, where he's discussed the tension between his own public AI-doom warnings and building xAI/Grok.\nReturn exact URLs, priority-marked, 8-12 items with transcripts preferred."
      },
      {
        "label": "criticas",
        "prompt": "Enumerate CRITIQUES and adversarial material on {{PERSON}} beyond what's already known (SEC fraud settlement, NLRB anti-union tweet case, X antisemitic-post advertiser exodus, Reuters FSD safety-stats investigation, \"demon mode\" Isaacson framing).\n1. Labor/workplace critiques, Tesla factory safety records, union-busting beyond the NLRB case, SpaceX workplace-culture lawsuits (sexual harassment, wrongful termination).\n2. Critiques of his political turn, DOGE efficacy critiques beyond the Axios \"somewhat successful\" self-assessment, conflict-of-interest critiques (government contracts vs. DOGE role), critiques of his 2024-2025 political statements/endorsements from former allies or employees.\n3. Critiques of specific broken promises/timelines, Full Self-Driving \"next year\" pattern, Hyperloop, Mars timeline slippage, Neuralink safety/animal-testing critiques, from named critics with direct quotes, not just aggregator roundups.\nReturn exact URLs, type=critique, 8-12 items, this is a high-controversy figure, prioritize primary-sourced critique (named critics, court filings, investigative journalism) over tabloid aggregation."
      }
    ]
  },
  "frederico-trajano": {
    "slug": "frederico-trajano",
    "name": "Frederico Trajano",
    "lang": "pt",
    "corpus": "normal",
    "person": "Frederico Trajano, CEO do Magazine Luiza (Magalu) desde 2016, terceira geração da família fundadora, filho de Luiza Helena Trajano (presidente do conselho). Liderou a transformação digital do Magalu (ecossistema 3P, fintech MagaluPay, Magalu Cloud) e desde 2026 lidera o \"ciclo de IA\" (AI-commerce, \"cérebro da Lu\"). NÃO é a mãe Luiza Helena Trajano nem nenhum outro Frederico Trajano.",
    "notes": {
      "attribution": "Do not confuse him with his mother, Luiza Helena Trajano (chair of the board), who has a separate dossier."
    },
    "enumPrompts": [
      {
        "label": "transformacao-ecossistema",
        "prompt": "Enumere material sobre a TRANSFORMAÇÃO DIGITAL e o ECOSSISTEMA do Magalu sob {{PERSON}}, além do já conhecido (InfoMoney perfil, Exame INSIGHT 7 anos, Seu Dinheiro 2020, NeoFeed várias, Experience Club, Brazil Journal x2, Exame \"vira-lata\", InvestNews x2, Mercado&Consumo, Meio&Mensagem).\n1. Entrevistas/perfis adicionais em Forbes BR, Época Negócios, Valor Econômico, Veja Negócios sobre a estratégia de plataforma 3P, fintech (MagaluPay/Magalu Bank), Magalu Cloud, ou a parceria com Amazon (jun/2026).\n2. Qualquer podcast de negócios (Braincast, Market Makers, Sala de Investimento, Os Sócios, G4 Educação) com participação dele mais longa e citável.\n3. Material sobre a origem da \"Lu\" (assistente virtual) e sua evolução para IA generativa/\"cérebro da Lu\", cobertura de lançamento, prêmios (Cannes), métricas de conversão.\nRetorne URLs exatas, priorize citações diretas dele, 10-15 itens."
      },
      {
        "label": "ia-atualizado",
        "prompt": "Enumere cobertura ATUALIZADA (2026, principalmente pós-jun/2026, já que hoje é {{DATE}}) sobre o \"ciclo de IA\"/AI-commerce de {{PERSON}} no Magalu, além do já conhecido (Seu Dinheiro 2026 \"resolve o que nem o ChatGPT\", NeoFeed \"cérebro da Lu\").\n1. Desdobramentos mais recentes do WhatsApp da Lu com a Meta (lançado dez/2025), métricas atualizadas de conversas/conversão, expansão de funcionalidades.\n2. Resultados trimestrais mais recentes do Magalu (2026) com comentários dele sobre a estratégia de IA, margem, ou a parceria com Amazon/AliExpress.\n3. Qualquer nova declaração dele sobre concorrência com Mercado Livre, Shopee, TikTok Shop, ou sobre a \"terceira revolução do varejo\".\nRetorne URLs exatas, 8-12 itens, com datas o mais recentes possível."
      },
      {
        "label": "criticas-governanca",
        "prompt": "Enumere CRÍTICAS e material adversarial sobre {{PERSON}} além do já conhecido (o colapso de ~R$170bi em valor de mercado/queda de ~97% da ação, a falha contábil de 2023, a diluição de minoritários no aumento de capital de 2024, o corte de ~10 mil empregos, a \"contradição\" entre defender isonomia tributária e depois fazer parceria com AliExpress/Amazon).\n1. Análises de mercado/analistas (XP, BTG, Itaú BBA, JP Morgan) sobre a governança do Magalu ou a sustentabilidade do turnaround.\n2. Cobertura trabalhista/sindical sobre os cortes de empregos e fechamento de lojas durante o turnaround.\n3. Qualquer crítica adicional à parceria com a Amazon (jun/2026), ela é vista como fraqueza estratégica por algum analista/jornalista?\n4. Reclamações de consumidor (Reclame Aqui, Procon) sobre o marketplace 3P, qualidade de sellers terceiros, prazo de entrega.\nRetorne URLs exatas, tipo=critique, 8-12 itens."
      }
    ]
  },
  "garry-tan": {
    "slug": "garry-tan",
    "name": "Garry Tan",
    "lang": "en",
    "corpus": "normal",
    "person": "Garry Tan, President & CEO of Y Combinator since 2022. Co-founder Posterous (YC S08), first Coinbase check, co-founder Initialized Capital. Designer-turned-founder-turned-investor. Also a divisive civic figure in SF/CA politics (Garry's List). NOT any other Garry Tan.",
    "notes": {
      "attribution": "Some quotes may be from another YC partner, an interviewer, or someone he is quoting rather than his own words."
    },
    "enumPrompts": [
      {
        "label": "lightcone-essays",
        "prompt": "Enumerate PRIMARY content from {{PERSON}} beyond what's already known (Co-founder Conflict essays x2, \"I Said the Wrong Thing\" essay, \"Roll your way to a billion dollar startup\" essay, Design for Startups transcript).\n1. YC's \"Lightcone\" podcast (co-hosted by Tan), find 5-10 of the most substantive episodes where HE specifically speaks at length (not just other partners), covering AI/startup trends, YC batch patterns, founder advice.\n2. Any other Medium/Initialized/YC blog essays by him not yet listed, check his full essay archive.\n3. Recent (2025-2026) X/Twitter posts beyond the 5 already cited, look for more on AI, YC batch trends, founder advice, or political statements.\nReturn exact URLs, priority=high for anything with substantial first-person content."
      },
      {
        "label": "entrevistas-recentes",
        "prompt": "Enumerate INTERVIEW/TALK appearances of {{PERSON}} beyond the 8 already known (Acquired ACQ2, TechCrunch Coinbase, Stanford SIER 2026, The Spindle/Turner Novak, Knowledge Project #226, Mixergy, Vanta, Punchbowl News).\n1. Any 2025-2026 podcast appearances (All-In, Lex Fridman, 20VC, other startup podcasts) discussing YC's current strategy, AI's effect on startups, or batch outcomes.\n2. Any YC Demo Day speech or YC Startup School talk beyond \"Design for Startups\" already cited.\n3. Any interview specifically about becoming YC president (2022) or his vision for YC's future.\nReturn exact URLs, priority-marked, 8-12 items with transcripts preferred."
      },
      {
        "label": "criticas-politica",
        "prompt": "Enumerate CRITIQUES and political material on {{PERSON}} beyond what's already known (the \"die slow\" tweet scandal, the Gil Duran \"parasite\" feud, Garry's List dark-money critique, The New Republic \"tech plutocrats\" piece).\n1. Any 2026 follow-up coverage on Garry's List expanding statewide, new critiques, funding disclosures, political outcomes.\n2. Critiques of YC itself under his leadership (batch quality, equity terms, competition from other accelerators, founder complaints).\n3. Any critique of his AI optimism or \"Little Tech\" antitrust positions from established voices (academics, other VCs, policy critics).\nReturn exact URLs, type=critique, 6-10 items."
      }
    ]
  },
  "guilherme-horn": {
    "slug": "guilherme-horn",
    "name": "Guilherme Horn",
    "lang": "pt",
    "corpus": "normal",
    "person": "Guilherme Horn, Brazilian serial entrepreneur and corporate-innovation specialist. Founded/co-founded ~6 startups over 25 years, including Ágora (sold to Bradesco in 2008, considered Brazil's first \"unicorn\"-scale exit) and Órama (named by Amazon in 2012 as one of the world's most innovative fintechs). Director of Innovation at Accenture Latin America (from 2014). Board member at Banco do Brasil. Executive director at Banco BV (Dec 2019-Mar 2022). Since Mar 2022, Head of WhatsApp for Brazil, India, and Indonesia at Meta. Author of the bestseller \"O Mindset da Inovação.\" LinkedIn Top Voice, angel investor, keynote speaker. Master's from PUC-RJ, doctorate from UMSA, MIT executive education. NOT any other Guilherme Horn.",
    "enumPrompts": [
      {
        "label": "livro-ensaios",
        "prompt": "Enumerate PRIMARY written content from {{PERSON}}.\n1. Find excerpts, reviews, or interviews about his bestselling book \"O Mindset da Inovação\", direct quotes from the book itself (via Google Books preview, publisher excerpts, or extensive book-review quotations), not just marketing copy.\n2. Walk his HSM Management author page (hsmmanagement.com.br/autor/guilherme-horn) and any other columns/articles he's authored for business publications (Forbes Brasil, Exame, Valor Econômico, etc.), find the full archive.\n3. Find his LinkedIn posts/articles directly, he's a LinkedIn Top Voice, so search for his profile's published articles and highly-engaged posts on innovation, leadership, AI, or entrepreneurship.\nReturn exact URLs, priority=high for anything with substantial first-person content (verbatim text he wrote), one-line \"why\" per item. Most content will be in Portuguese, that's expected and correct for a Brazilian executive."
      },
      {
        "label": "talks-entrevistas",
        "prompt": "Enumerate TALKS, KEYNOTES, and INTERVIEW appearances of {{PERSON}}.\n1. Find video/transcript of his talks at conferences (HSM Expo, South Summit, ENECE 2019, or others), look for full recordings or transcripts, not just event listings.\n2. Find podcast or video interviews about his entrepreneurial journey (Ágora/Órama founding and exits), his time at Accenture/Banco do Brasil/Banco BV, or his current role as Head of WhatsApp Brazil/India/Indonesia at Meta.\n3. Find any interview specifically about the transition from serial founder/banking executive to Big Tech (Meta), his own account of why he made that move in 2022.\nReturn exact URLs, priority-marked, prioritizing sources with full transcripts or extensive direct quotation over short event-listing pages."
      },
      {
        "label": "criticas",
        "prompt": "Enumerate CRITIQUES and adversarial material on {{PERSON}}, plus any additional biographical/track-record detail that could sharpen or complicate his public \"innovation guru\" narrative.\n1. Any critique of his specific business decisions, the Ágora or Órama sales (were they seen as good exits or leaving value on the table?), his tenure at Banco BV, or his transition to Meta.\n2. Any critique of the \"innovation mindset\" thought-leadership genre he represents, skeptics of corporate-innovation consulting, LinkedIn thought-leadership, or the specific frameworks in his book.\n3. Any controversy, lawsuit, or public criticism connected to WhatsApp's operations in Brazil/India/Indonesia during his tenure as regional head (content moderation, misinformation during elections, regulatory friction with Brazilian or Indian authorities) that names him specifically or that he's had to publicly address.\nReturn exact URLs, type=critique, 4-8 items, be honest if adversarial material specifically targeting him personally (vs. generic Meta/WhatsApp criticism) is thin."
      }
    ]
  },
  "harry-stebbings": {
    "slug": "harry-stebbings",
    "name": "Harry Stebbings",
    "lang": "en",
    "corpus": "normal",
    "person": "Harry Stebbings, British founder of 20VC (The Twenty Minute VC) podcast and venture fund, started the podcast as a teenager in 2015, grew it into a ~$400M fund. NOT any other Harry Stebbings.",
    "enumPrompts": [
      {
        "label": "ensaios-talks",
        "prompt": "Enumerate PRIMARY content from {{PERSON}} beyond what's already known (Talks at GS Goldman Sachs talk, ~10 X/LinkedIn posts on investing lessons, the Aleph \"Invested\" interview, The Gentleman's Journal interview).\n1. Walk his X (@HarryStebbings) and LinkedIn posts for more first-person investing-lesson threads not yet cited, he posts frequently about specific portfolio mistakes/wins with numbers.\n2. Look for any solo 20VC episodes (not guest interviews) where HE is the one being interviewed by a co-host, or year-end/reflection episodes where he talks about his own fund's performance and philosophy directly.\n3. Find any essay, blog post, or long-form written piece he's authored (not just social posts) about how he evaluates founders, pricing rounds, or building 20VC itself into a fund.\nReturn exact URLs, priority=high for anything with substantial first-person content, one-line \"why\" per item."
      },
      {
        "label": "entrevistas-recentes",
        "prompt": "Enumerate INTERVIEW/PODCAST appearances of {{PERSON}} beyond the ones already known (Aleph \"Invested\" E9, The Gentleman's Journal, Talks at GS, TechCrunch on the $400M fund close, a Deciphr 20VC-format episode).\n1. Any 2024-2026 interview/podcast where he's the GUEST (not host) being interviewed about his own career, starting 20VC at 19 with no money/network, being underestimated for his age/British accent in Silicon Valley, the transition from podcaster to fund manager.\n2. Any interview specifically about how he evaluates AI-era founders/deals differently from the SaaS era that built his reputation, his own framework for AI investing.\n3. Any interview or profile about the internal culture/operations of 20VC as a fund now (not just the podcast), how he built an investment team, LP relationships, the \"make Europe great again\" fund thesis.\nReturn exact URLs, priority-marked, 8-12 items with transcripts preferred."
      },
      {
        "label": "criticas",
        "prompt": "Enumerate CRITIQUES and adversarial material on {{PERSON}} beyond what's already known (the Peter Walker/Carta reply on 2021-market comparisons, the ElevenLabs \"biggest investing mistake\" self-critique).\n1. Critiques of 20VC's podcast-to-fund model itself, is being a media personality a conflict of interest for deal access/pricing? Any named VC peer or LP critique of \"podcaster-turned-investor\" fund managers generally, applied to him specifically.\n2. Critiques of specific 20VC fund investments or missed opportunities, any portfolio company blowup, down-round, or public miss with his name attached as an investor.\n3. Critiques of his public commentary style, bold market calls (froth, valuations) that didn't age well, or pushback from other investors on his takes (the Peter Walker exchange is one; find more).\nReturn exact URLs, type=critique, 5-8 items, be honest if adversarial material is thin (media-personality investors get less direct confrontation than operators/founders)."
      }
    ]
  },
  "jack-clark": {
    "slug": "jack-clark",
    "name": "Jack Clark",
    "lang": "en",
    "corpus": "normal",
    "person": "Jack Clark, Co-founder & Head of Policy at Anthropic. Former journalist (Bloomberg, covering AI), former Policy Director at OpenAI, co-founder of the Stanford HAI \"AI Index\" report. Since roughly 2016 he has written the weekly newsletter \"Import AI\" (importai.substack.com / jack-clark.net), which combines AI research summaries with his own policy analysis and, notably, original speculative-fiction vignettes about AI futures (\"Import AI fiction\"). Frequent speaker/witness on AI policy at bodies like the OECD and in congressional/parliamentary testimony. NOT any unrelated Jack Clark (e.g. sports figures or unrelated tech people of the same name).",
    "enumPrompts": [
      {
        "label": "import-ai-ensaios",
        "prompt": "Enumerate PRIMARY WRITTEN material authored by {{PERSON}}.\n1. Walk the archive of his newsletter \"Import AI\" (importai.substack.com, or its older home jack-clark.net), find as many individual issues as possible, prioritizing ones with substantial personal policy commentary or his original speculative-fiction pieces about AI futures, not just research-paper roundups.\n2. Find any essays or blog posts he has personally authored on the Anthropic website (anthropic.com/news) about AI policy, safety, or the \"Core Views on AI Safety\" type content.\n3. Find his written policy testimony/submissions to government bodies (US Congress, UK Parliament, OECD, etc.), the actual submitted text, not just news coverage.\nReturn exact URLs, priority=high for anything with substantial first-person authored content, one-line \"why\" per item."
      },
      {
        "label": "entrevistas-talks",
        "prompt": "Enumerate LONG-FORM INTERVIEWS, PODCASTS, and TALKS featuring {{PERSON}}.\n1. Any podcast appearances discussing AI policy, Import AI, or his path from journalist to OpenAI to Anthropic co-founder.\n2. Any recorded talks/panels at policy-focused conferences (OECD, Davos, AI safety summits, congressional hearings) where his own remarks (not just testimony text) are available as video/transcript.\n3. Any interview specifically about Anthropic's founding story or his role as Head of Policy.\nPrioritize sources with full transcripts over short clips. Return exact URLs, priority-marked, one-line \"why\" per item."
      },
      {
        "label": "criticas",
        "prompt": "Enumerate CRITIQUES and adversarial material about {{PERSON}} and his policy positions.\n1. Critiques of Anthropic's policy advocacy being self-serving (e.g. accusations that Anthropic lobbies for AI regulation that would entrench incumbents like itself, \"regulatory capture\" critique).\n2. Any specific public disagreement between him and other named AI policy figures (e.g. accelerationists like Marc Andreessen, or open-source AI advocates like Yann LeCun) on regulation or openness.\n3. Critiques of the \"AI Index\" methodology he co-founded, or of his framing of AI risk/capability trends in Import AI.\nReturn exact URLs, type=critique, 4-8 items, be honest about how substantial vs. thin the critical material is."
      }
    ]
  },
  "james-clear": {
    "slug": "james-clear",
    "name": "James Clear",
    "lang": "en",
    "corpus": "large",
    "person": "James Clear, author of Atomic Habits (~20M copies), writer of the twice-weekly essay archive and the 3-2-1 newsletter (3M+ readers) at jamesclear.com. Writes on habits, behavior change, systems, decision-making, and continuous improvement. NOT a founder/investor, a synthesizer-writer. Started publishing essays at jamesclear.com around 2012, well before the 2018 book.",
    "notes": {
      "focus": "Cover the full corpus: essays since 2012, the weekly newsletter archive, \"Atomic Habits\", and long podcast transcripts. A longer dossier is justified if the material earns it."
    },
    "enumPrompts": [
      {
        "label": "ensaios",
        "prompt": "Enumerate the ESSAY ARCHIVE of {{PERSON}}\nWalk the canonical article index at https://jamesclear.com/articles (or the sitemap/archive listing if that's more complete) and list HIGH-VALUE essays beyond the 5 already known (marginal-gains, identity-based-habits, goals-systems, habit-stacking, atomic-habits-summary). He has published twice-weekly since ~2012, do not try to list all several hundred; instead prioritize his most-referenced/canonical essays: on deliberate practice, motivation, focus, decision-making, \"the akrasia effect,\" \"how long to form a habit,\" procrastination, willpower, the \"Feynman technique,\" \"warren buffett\" essay if any, famous failures, \"how to stop being lazy,\" transformation, and any essay he himself flags as a favorite or most-read (check if he has a \"start here\" or \"best articles\" page). Also confirm the Atomic Habits book's official page and any author's-own chapter-by-chapter summary beyond what's already cited. Return 15-25 items with exact URLs, priority-marked (his most load-bearing frameworks = high)."
      },
      {
        "label": "newsletter-321",
        "prompt": "Enumerate the 3-2-1 NEWSLETTER archive of {{PERSON}}\nWalk the archive index at https://jamesclear.com/3-2-1 (it lists past issues) and select a SPREAD across years (not just recent ones already cited: Jan/Feb/Apr/May/Jun 2026, Jul/Sep/Dec 2025), go back further: 2022, 2023, 2024 issues, picking ones with distinctive, quotable ideas (not just any issue, skim titles/preview text for substance). Aim for 15-20 NEW issues spanning multiple years to show the newsletter's range over time, avoiding duplicates of the 8 already in the dossier. Return exact URLs with a one-line \"why\" (what idea each issue contributes), priority=high for issues with clearly novel/distinctive frameworks not already covered."
      },
      {
        "label": "podcasts-talks",
        "prompt": "Enumerate PODCAST/TALK appearances of {{PERSON}} beyond the 4 already known (The Knowledge Project #263, Diary of a CEO Dec 2025, Tim Ferriss #648, Adam Grant \"Rethinking\").\nLook for: Lex Fridman podcast, Impact Theory, Modern Wisdom, The School of Greatness (Lewis Howes), How I Built This, any TED talk, university commencement or guest-lecture appearances, and any interview specifically about \"3-2-1\" newsletter's origin or his writing process. Prefer sources with full transcripts (podscripts.co, tim.blog, official transcripts). Return 8-15 items with exact URLs, priority-marked."
      },
      {
        "label": "criticas",
        "prompt": "Enumerate CRITIQUES and third-party material for {{PERSON}} beyond Dr. Gina Cleo's critique and the Wikipedia reception section.\n1. Fetch the ACTUAL Guardian and New Yorker pieces referenced secondhand via Wikipedia's \"Atomic Habits\" critical-reception section, find their real URLs and read them directly (don't just cite Wikipedia citing them).\n2. Other serious critiques: behavioral-science researchers or psychologists who've critiqued the book's rigor, claims about the \"66 days\" habit-formation figure, criticism that the book is repackaged existing research, any critique of the newsletter/personal-brand business model, or criticism of over-simplification for people with executive-function/mental-health conditions.\n3. Any profile/long-form journalism about James Clear himself (not just the book), his background, how he built the newsletter business, revenue/business model reporting if it exists.\nReturn exact URLs, type=critique for critiques, 8-12 items."
      }
    ]
  },
  "james-hawkins": {
    "slug": "james-hawkins",
    "name": "James Hawkins",
    "lang": "en",
    "corpus": "normal",
    "person": "James Hawkins: Co-founder & (former) co-CEO, PostHog. Co-founder and (former) co-CEO of PostHog (open-source product analytics turned 16+ product developer suite, YC W20, ~$1.4B valuation, ~300k customers), an ex-enterprise-sales VP who built the anti-enterprise-sales company and documents every belief in public. NOT any other James Hawkins."
  },
  "jason-lemkin": {
    "slug": "jason-lemkin",
    "name": "Jason Lemkin",
    "lang": "en",
    "corpus": "large",
    "person": "Jason Lemkin: Founder, SaaStr; founder EchoSign (acq. Adobe); SaaS investor (SaaStr Fund). Jason Lemkin is the EchoSign-founder-turned-investor behind SaaStr, the largest B2B/SaaS founder community, and the operator who nearly died going $0→$100M ARR and turned the scar tissue into the canonical benchmark-driven playbook. NOT any other Jason Lemkin."
  },
  "jeff-bezos": {
    "slug": "jeff-bezos",
    "name": "Jeff Bezos",
    "lang": "en",
    "corpus": "large",
    "person": "Jeff Bezos, founder of Amazon (CEO 1994-2021, then Executive Chairman), founder of Blue Origin, owner of the Washington Post, co-CEO of Project Prometheus since Nov 2025. Wrote an annual shareholder letter every year 1997-2020 (his last as CEO); the compilation \"Invent and Wander: The Collected Writings of Jeff Bezos\" (2020, intro by Walter Isaacson) reprints all the letters plus additional speeches/interviews Isaacson selected.",
    "notes": {
      "focus": "The payload is the shareholder-letter corpus: dedup hard (he restates \"Day 1\" and customer obsession for decades), keep the sharpest verbatim instance of each idea with the letter year, and add every genuinely distinct year-specific lesson, bet, or mistake.",
      "attribution": "Some quotes may be Walter Isaacson's introduction text, an interviewer's question, a journalist's paraphrase, or a documented-practice description (\"working backwards\") rather than his own words."
    },
    "enumPrompts": [
      {
        "label": "cartas-completas",
        "prompt": "Enumerate ALL 24 Amazon annual shareholder letters by {{PERSON}}, 1997 through 2020 (his last as CEO; he stepped down in 2021). The canonical index is at aboutamazon.com/news/company-news (search \"letter to shareholders\" for each year) or the official investor-relations PDF archive (ir.aboutamazon.com or the s2.q4cdn.com PDF pattern already seen for 2015/2016). This dossier currently only has 1997, 2015, 2016, 2017, 2018, 2020, you need to find and list the MISSING years: 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2019. Prioritize ones known for distinct ideas: 2005 (the actual primary source for \"willing to be misunderstood for long periods\", this dossier only has it secondhand via GeekWire, find the real 2005 letter), 2008-2009 (financial-crisis-era discipline), 2011-2012 (Kindle/tablet era), 2013 (drone delivery announcement), 2014 (post-Fire-Phone-failure reflection, if any), 2019 (pre-pandemic, sustainability pledge). Return the complete list of what you find with exact URLs, priority=high for ones with genuinely new ideas per your read of the letter, medium for operationally-focused years. Completeness of this list matters, that's the job."
      },
      {
        "label": "invent-wander-talks",
        "prompt": "Enumerate content specific to \"Invent and Wander: The Collected Writings of Jeff Bezos\" (2020, Harvard Business Review Press, intro by Walter Isaacson) BEYOND the shareholder letters (which are covered separately), the book's value-add over the freely-available letters is Isaacson's introduction/framing AND additional non-letter material he selected: early interviews, speeches, and Bezos's own reflections written specifically for the book. Find:\n1. Any legitimate excerpt, Google Books preview, publisher excerpt, or extended book review that quotes Isaacson's introduction directly (his framing of what makes Bezos distinctive) or quotes the book's non-letter content.\n2. The original, non-letter material likely included: his 1999 Time \"Person of the Year\" era interviews, early Amazon-era press (mid-1990s), and any commencement/graduation speech beyond the already-known 2010 Princeton one.\n3. Reviews of the book itself (not just of Bezos) that assess what the compilation adds.\nReturn exact URLs, priority=high for genuinely NEW (non-letter) Bezos material, with a note on what's new."
      },
      {
        "label": "podcasts-talks",
        "prompt": "Enumerate PODCAST/TALK/interview appearances of {{PERSON}} beyond the 4 already known (Princeton Baccalaureate 2010, Economic Club of Washington w/ David Rubenstein 2018, Academy of Achievement 2001, Lex Fridman #405 2023).\nLook for: his 2025-2026 interviews on Project Prometheus and AI in more depth, any Blue Origin-specific talk/interview (space vision, New Glenn), the 2021 \"step down as CEO\" announcement/farewell letter to employees, any interview specifically about Amazon's early years (pre-2000) with useful founding-story detail, Italian Tech Week 2025 in fuller form if a transcript exists beyond what's cited, and any appearance discussing the Washington Post ownership in more depth. Prefer sources with full transcripts. Return 8-15 items with exact URLs, priority-marked."
      },
      {
        "label": "criticas",
        "prompt": "Enumerate CRITIQUES and adversarial material on {{PERSON}} beyond what's already known (Senate HELP Committee/Sanders warehouse report, FTC 2023 antitrust suit/NPR, Lina Khan's \"Amazon's Antitrust Paradox,\" Brad Stone's \"The Everything Store,\" Washington Post 2026 layoffs/NPR).\n1. Any additional labor/union critique (Amazon Labor Union organizing, warehouse conditions reporting beyond the Senate report, ProPublica, Reveal News, or similar investigative pieces).\n2. Climate/environmental critique of Amazon's logistics/AWS footprint vs. the Bezos Earth Fund's stated goals, any documented tension.\n3. Critique of Blue Origin specifically (safety record, competition with SpaceX, \"billionaire space race\" commentary).\n4. Fresh 2025-2026 critiques of the Project Prometheus venture or conflicts of interest with Amazon/Washington Post ownership.\n5. Any serious critique of \"Invent and Wander\" or the shareholder-letter genre as self-serving mythology (management scholars on survivorship bias in founder narratives).\nReturn exact URLs, type=critique, 8-12 items."
      }
    ]
  },
  "jensen-huang": {
    "slug": "jensen-huang",
    "name": "Jensen Huang",
    "lang": "en",
    "corpus": "normal",
    "person": "Jensen Huang, co-founder and CEO of Nvidia (founded 1993), Taiwanese-American, led Nvidia's pivot from graphics chips to the AI/accelerated-computing company now valued in the trillions. NOT any other Jensen Huang.",
    "enumPrompts": [
      {
        "label": "ensaios-talks",
        "prompt": "Enumerate PRIMARY content from {{PERSON}} beyond what's already known (Lex Fridman #494, Stanford GSB first-principles piece, Stanford \"pain and suffering\" talk, NTU 2023 and Carnegie Mellon 2026 commencement speeches, Dwarkesh Patel podcast, two Stratechery/Ben Thompson interviews, GTC 2026 keynote).\n1. Walk Nvidia's own GTC keynote transcripts across multiple years (2023-2026) for extended first-person Huang commentary on AI strategy, CUDA moat, or the \"AI factories\" framing not yet cited.\n2. Find any earnings-call transcripts with substantial first-person Huang commentary, especially 2025-2026 calls discussing the \"circular financing\" critique, China export controls, or Blackwell/Vera Rubin demand.\n3. Any additional commencement speech, university talk, or long-form essay where he discusses his own early career (the Denny's busboy story, founding Nvidia at 30, the near-death moments the company survived) in his own words beyond what's already cited.\nReturn exact URLs, priority=high for anything with substantial first-person content, one-line \"why\" per item."
      },
      {
        "label": "entrevistas-recentes",
        "prompt": "Enumerate INTERVIEW/PODCAST appearances of {{PERSON}} beyond the ones already known (Lex Fridman #494, Dwarkesh Patel, two Stratechery interviews, All-In Podcast at GTC 2026).\n1. Any 2025-2026 long-form interview discussing the AI bubble debate, the circular-financing critique from Wall Street analysts, or China chip-export policy in depth.\n2. Any interview specifically about his leadership style, the \"demanding boss\"/\"torture them into greatness\" characterization, flat organizational structure, or how he runs Nvidia's famously large span-of-control meetings.\n3. Any interview about his childhood/immigration story (sent to a Kentucky boarding school at age 9, Taiwanese-American identity) with first-person detail beyond what's cited.\nReturn exact URLs, priority-marked, 8-12 items with transcripts preferred."
      },
      {
        "label": "criticas",
        "prompt": "Enumerate CRITIQUES and adversarial material on {{PERSON}} beyond what's already known (the \"demanding boss\"/CNBC leadership critique, the Goldman/Wedbush/Mizuho \"circular financing\" critique of Nvidia's $90B deal spree, the AI-bubble skepticism).\n1. Named analyst or short-seller critiques of Nvidia's valuation/business model, specific numbers-based skepticism, not just general bubble talk.\n2. Critiques of Nvidia's market dominance/CUDA lock-in from competitors (AMD, Intel, custom-silicon efforts at Google/Amazon/Microsoft) or antitrust regulators, named critics with direct quotes.\n3. Critiques of his management style beyond the CNBC piece, any former-employee account of Nvidia's demanding culture, burnout concerns, or the flat-hierarchy structure's downsides.\nReturn exact URLs, type=critique, 6-10 items."
      }
    ]
  },
  "jonas-marques-neto": {
    "slug": "jonas-marques-neto",
    "name": "Jonas Marques Neto",
    "lang": "pt",
    "corpus": "normal",
    "person": "Jonas Marques Neto, CEO of Pague Menos (Brazilian pharmacy/drugstore retail chain, B3 ticker PGMN3), the first CEO from outside the founding family. Background as a clinical psychologist before moving into corporate leadership, nicknamed the \"CEO-psicólogo\" [psychologist CEO] in Brazilian business press (Brazil Journal). Known for unorthodox early decisions as CEO (reportedly one of his first actions as CEO was buying air conditioners/microwaves for store employees rather than a typical cost-cutting move). Multiple video interviews (Exame, Pause/O POVO). NOT any other Jonas Marques, must be specifically the CEO of Pague Menos drugstore chain.",
    "enumPrompts": [
      {
        "label": "perfil-psicologo-ceo",
        "prompt": "Enumerate PRIMARY interview/profile content on {{PERSON}}, especially anything covering his unusual path from clinical psychologist to CEO and his \"psychologist-CEO\" people-management philosophy.\n1. Find the Brazil Journal profile/interview (or similar) that coined or used the \"CEO-psicólogo\" framing, get the fullest version (article or podcast) with direct quotes.\n2. Find video interviews (Exame, Pause/O POVO, or similar) where he discusses his approach to people, culture, or leadership at length in his own words.\n3. Find any interview describing concrete early decisions he made as CEO of Pague Menos (the air-conditioners/microwaves story or similar) and his own account of the reasoning behind them.\nReturn exact URLs, priority=high for anything with substantial first-person verbatim content, one-line \"why\" per item. Content will mostly be in Portuguese, that's expected and correct."
      },
      {
        "label": "estrategia-farmacia",
        "prompt": "Enumerate INTERVIEWS and TALKS by {{PERSON}} about Pague Menos' business strategy.\n1. Find interviews/talks about competing in the Brazilian drugstore sector against Raia Drogasil/RD, Droga Raia, Panvel, and other pharmacy chains.\n2. Find any earnings-call transcripts, investor-day talks, or press interviews about financial turnaround, digital transformation, or store-network strategy at Pague Menos (B3: PGMN3).\n3. Find interviews about being the first CEO from outside the founding family, his own account of that transition and what changed.\nReturn exact URLs, priority-marked, prioritizing full transcripts or extensive direct quotation over short event-listing pages."
      },
      {
        "label": "criticas",
        "prompt": "Enumerate CRITIQUES and adversarial or complicating material on {{PERSON}}.\n1. Any critique of Pague Menos' financial performance, margins, or competitive position under his leadership.\n2. Any analyst or press skepticism about his unorthodox management style, or friction with the founding family/board during his tenure.\n3. Any controversy connected to labor practices, franchise disputes, or governance that names him specifically.\nReturn exact URLs, type=critique, 4-8 items, be honest if adversarial material specifically targeting him personally (vs. generic sector criticism) is thin."
      }
    ]
  },
  "larry-ellison": {
    "slug": "larry-ellison",
    "name": "Larry Ellison",
    "lang": "en",
    "corpus": "normal",
    "person": "Larry Ellison, co-founder, Chairman, and CTO of Oracle (founded 1977), one of the longest-tenured tech CEOs in history (CEO until 2014), now driving Oracle's cloud/AI-infrastructure strategy (OCI, Stargate). NOT any other Larry Ellison.",
    "enumPrompts": [
      {
        "label": "ensaios-talks",
        "prompt": "Enumerate PRIMARY content from {{PERSON}} beyond what's already known (2016 USC commencement address, Smithsonian oral history 1995, Academy of Achievement long-form interview, several OpenWorld conference statements 2011-2019).\n1. Walk Oracle OpenWorld / Oracle CloudWorld keynote transcripts across the years (2019-2026) for extended first-person Ellison keynotes on cloud/AI strategy not yet cited, he gives long, technical, competitive keynotes almost every year.\n2. Find any earnings-call transcripts with substantial first-person Ellison commentary (he still speaks on Oracle earnings calls despite not being CEO), especially 2024-2026 calls discussing Stargate, OCI growth, or AI infrastructure capex.\n3. Any biography excerpts (Mike Wilson's \"The Difference Between God and Larry Ellison\" is cited as a book reference but likely not quoted verbatim yet) or other long-form profile with extensive first-person Ellison quotes from early Oracle history (the near-bankruptcy 1990 restatement crisis, the sales-culture-building years).\nReturn exact URLs, priority=high for anything with substantial first-person content, one-line \"why\" per item."
      },
      {
        "label": "entrevistas-recentes",
        "prompt": "Enumerate INTERVIEW/PODCAST appearances of {{PERSON}} beyond the ones already known (60 Minutes \"World's Most Competitive Man\" profile, Academy of Achievement interview).\n1. Any 2024-2026 long-form interview/podcast appearance discussing the Stargate AI project, the TikTok deal, or Oracle's AI-infrastructure bet in depth.\n2. Any interview specifically about his early career, the multiple failed startups before Oracle, dropping out of college twice, the original 1977 founding with Bob Miner and Ed Oates, or the Oracle/CIA origin story (the company name itself comes from a CIA project).\n3. Any interview about his rivalries, with Bill Gates/Microsoft, with Salesforce's Marc Benioff (a former Oracle employee), or with SAP, first-person Ellison framing of these competitive relationships.\nReturn exact URLs, priority-marked, 8-12 items with transcripts preferred."
      },
      {
        "label": "criticas",
        "prompt": "Enumerate CRITIQUES and adversarial material on {{PERSON}} beyond what's already known (the securities class action over cloud sales, the Google v. Oracle Supreme Court case, the \"mass surveillance\" AI comments backlash, the \"roach motel\" Salesforce jab as evidence of his combative style).\n1. Critiques of Oracle's historically aggressive sales/licensing tactics (audit practices, licensing-fee lock-in), named customer or analyst critiques, not just general reputation.\n2. Critiques of his personal conduct/lifestyle choices that drew public scrutiny, property disputes, the Lanai (Hawaii island) ownership controversies, or governance critiques of his dual Chairman/CTO/major-shareholder role at Oracle.\n3. Critiques of the \"mass surveillance\" AI framing itself, named privacy advocates, journalists, or politicians who responded critically to his 2024 comments.\nReturn exact URLs, type=critique, 6-10 items."
      }
    ]
  },
  "larry-page": {
    "slug": "larry-page",
    "name": "Larry Page",
    "lang": "en",
    "corpus": "thin",
    "person": "Larry Page, co-founder of Google (1998, with Sergey Brin) and Alphabet, CEO 1998-2001 and 2011-2015 (Alphabet CEO through Dec 2019), now reclusive and reportedly building an AI-manufacturing startup (Dynatomics). NOT any other Larry Page. IMPORTANT: he is even more reclusive than Sergey Brin (co-founder counterpart already rebuilt in this project), near-zero public appearances since ~2015, sent written testimony instead of appearing at the 2018 Senate hearing. Do NOT pad the corpus with weak secondary sources or inflate thin material to look like more than it is. If the honest count of primary/substantial sources is modest, report that honestly rather than force it toward this project's usual scale.",
    "enumPrompts": [
      {
        "label": "ensaios-talks",
        "prompt": "Enumerate PRIMARY content from {{PERSON}} beyond what's already known (2004 IPO letter, 2013 and 2015 Founders' Letters, 2009 Michigan commencement, 2013 Wired interview, TED2014 with Charlie Rose, 2014 Khosla Ventures fireside, 2013 Google I/O fireside).\n1. Look for any other founders' letters he co-authored beyond 2004/2013/2015, check abc.xyz/investor/founders-letters/ for the full archive (2007, 2009, 2011, 2012 letters may exist and could carry his own authored voice in some years, similar to how the Brin dossier found year-by-year authorship variance).\n2. Search for any 2015-2026 appearance, interview, or statement, post-Alphabet-CEO he has been almost totally silent publicly; be honest if nothing substantial exists in this window beyond the 2018 Senate written-testimony episode and the 2025 Dynatomics reporting.\n3. Any Kitty Hawk (flying car venture, wound down 2022) statement, interview, or company communication with his own first-person voice about that project.\nReturn exact URLs, priority=high for anything with substantial first-person content, one-line \"why\" per item. If you find fewer than 8 genuinely new items, that is an accurate result, report it as such rather than padding with low-value sources."
      },
      {
        "label": "entrevistas-recentes",
        "prompt": "Enumerate INTERVIEW/PODCAST appearances of {{PERSON}} beyond the ones already known (2013 Wired, TED2014, 2014 Khosla fireside, 2013 Google I/O).\n1. Any interview/appearance from 2015 onward, be thorough but honest if the count is genuinely at or near zero, which is plausible for this subject.\n2. Any interview specifically about the 2001-2011 \"adult supervision\" era under Eric Schmidt and his own account of returning as CEO in 2011, first-person reflection on that period.\n3. Any interview or statement about Kitty Hawk, Dynatomics, or his post-Google technical interests (flying cars, AI-driven manufacturing) in his own words.\nReturn exact URLs, priority-marked. A very short list, or even confirming near-zero new material, is an acceptable, honest result for this reclusive a figure."
      },
      {
        "label": "criticas",
        "prompt": "Enumerate CRITIQUES and adversarial material on {{PERSON}} beyond what's already known (the 2018 Senate hearing no-show/written-testimony episode).\n1. Critiques of his reclusiveness/lack of public accountability specifically (vs. generic Google/Alphabet criticism), named critics, journalists, or governance advocates who've called out his absence from public accountability moments.\n2. Any critique of the Alphabet super-voting-share structure he and Brin maintained, this may overlap with material already found for the Brin dossier; check if a Page-specific angle exists.\n3. Any critique of specific \"Other Bets\" failures under his moonshot strategy (Google Glass, Loon, or others) attributed to his personal decision-making specifically, not just Google generally.\nReturn exact URLs, type=critique, 4-8 items, be honest if adversarial material specifically targeting Page personally (vs. Google/Alphabet generally) is thin."
      }
    ]
  },
  "luiz-seabra": {
    "slug": "luiz-seabra",
    "name": "Antônio Luiz Seabra",
    "lang": "pt",
    "corpus": "thin",
    "person": "Antônio Luiz Seabra, fundador e presidente (emérito) do conselho da Natura (Natura&Co), empresa de cosméticos brasileira, fundada em 1969. Filósofo autodidata (Plotino, Teilhard de Chardin), construiu a Natura em torno de relacionamento e propósito, não produto. Está na casa dos 80 anos e fora do palco operacional. NÃO é o filósofo Murilo Seabra nem nenhum outro Seabra.",
    "enumPrompts": [
      {
        "label": "entrevistas-filosoficas",
        "prompt": "Enumere entrevistas/palestras FILOSÓFICAS de {{PERSON}} além das já conhecidas (Cottidianos I e II, zelmar \"O verdadeiramente belo\", LinkedIn/ExpoGestão 2010, Exame crise, NeoFeed, somosij, Sebrae).\n1. Busque mais entrevistas de longa duração onde ele fale sobre filosofia, Plotino, Teilhard de Chardin, propósito, ou a fundação da Natura, em veículos como Época, Veja, Trip, revistas de negócios ou filosofia.\n2. Confirme/localize a fonte primária viva da frase-motto \"o impossível é apenas o começo de várias possibilidades\" (o artigo original da Endeavor redireciona pra home e o Sebrae não mostra mais o texto), tente web.archive.org ou outras réplicas.\n3. Confirme/localize a fonte primária da frase-tríade fundadora \"a verdade como compromisso, o amor como força e a beleza como potência\", hoje marcada como paráfrase não confirmada no dossier atual.\n4. Qualquer podcast ou vídeo longo (YouTube, Instituto CPFL, TEDx, Fronteiras do Pensamento) com ele falando sobre negócios com propósito.\nRetorne URLs exatas, prioridade alta pra qualquer trecho verbatim novo dele."
      },
      {
        "label": "natura-atual",
        "prompt": "Enumere cobertura ATUAL (2025-2026, já que hoje é {{DATE}}) sobre a Natura/Natura&Co e qualquer declaração recente de {{PERSON}}, além do já conhecido (InvestNews sobre o desmonte do império global e prejuízo de R$8,9bi).\n1. Resultados/estratégia recentes da Natura pós-\"volta às origens\", houve recuperação? Ele comentou publicamente?\n2. Qualquer homenagem, prêmio, ou perfil de aniversário/trajetória recente sobre ele (está na casa dos 80 anos, pode haver perfis de \"legado\").\n3. Cobertura da posição atual dele na empresa (ainda é presidente emérito do conselho? Afastou-se mais?).\nRetorne URLs exatas, 8-12 itens."
      },
      {
        "label": "criticas",
        "prompt": "Enumere CRÍTICAS e material adversarial sobre {{PERSON}}/Natura além do já conhecido (OTTS e Redalyc sobre precarização do trabalho de revendedoras, InvestNews sobre o colapso financeiro do Natura&Co).\n1. Críticas adicionais ao modelo de venda direta (SVD), reportagens sobre condições de revendedoras, pirâmide de vendas, ou comparação com outros modelos (Avon, Boticário).\n2. Qualquer crítica ao \"greenwashing\" ou à autenticidade do posicionamento de sustentabilidade da Natura, dado o tamanho da empresa.\n3. Análises críticas da era de expansão global (Aesop, The Body Shop, Avon) e de quem tomou essas decisões (ele pessoalmente ou o management profissional).\nRetorne URLs exatas, tipo=critique, 6-10 itens."
      }
    ]
  },
  "luiza-helena-trajano": {
    "slug": "luiza-helena-trajano",
    "name": "Luiza Helena Trajano",
    "lang": "pt",
    "corpus": "normal",
    "person": "Luiza Helena Trajano, presidente do conselho de administração do Magazine Luiza (Magalu), fundadora do Grupo Mulheres do Brasil, uma das empresárias mais influentes do Brasil. Assumiu a direção da Magalu em 1991, passou o cargo de CEO ao filho Frederico Trajano em 2016. Nasceu em 1948, Franca-SP. NÃO confundir com Luiza Trajano de outros contextos.",
    "notes": {
      "attribution": "Do not confuse her with her son, Frederico Trajano (CEO of Magalu), who has a separate dossier."
    },
    "enumPrompts": [
      {
        "label": "biografia-mulheres-brasil",
        "prompt": "Enumere o corpus PRIMÁRIO sobre {{PERSON}}\n1. A biografia \"Luiza Helena, Mulher do Brasil\" (Pedro Bial, Editora Gente, 2022), página da editora, Amazon, Skoob, qualquer resenha longa ou entrevista de lançamento com trechos/citações dela verbatim (não só do biógrafo).\n2. Grupo Mulheres do Brasil, site oficial, manifestos, publicações, entrevistas dela especificamente como fundadora/presidente (não material genérico do movimento sem ela citada).\n3. Perfil na Time 100 (2021), o texto oficial da Time sobre ela, e qualquer entrevista dela sobre a inclusão na lista.\n4. Qualquer carta/coluna/artigo de opinião assinado por ela mesma (LinkedIn, Exame, Valor Econômico, Folha, Estadão).\nRetorne URLs exatas com prioridade alta para a biografia, Mulheres do Brasil e Time 100."
      },
      {
        "label": "palestras-video",
        "prompt": "Enumere aparições em PALESTRA/ÁUDIO/VÍDEO de {{PERSON}}\n1. Fóruns internacionais: Fórum Econômico Mundial (Davos), se ela participou de algum painel, busque especificamente por nome dela + \"Davos\" ou \"World Economic Forum\".\n2. NRF (National Retail Federation), ela menciona ir há 20+ anos; busque cobertura de falas específicas dela em edições da NRF.\n3. Entrevistas em TV/vídeo longas: Fantástico, Roda Viva (TV Cultura, checar se ela já foi entrevistada lá, é o formato mais rico em citações), Globonews, podcasts de negócios BR (Flow Podcast, PrimoCast, G4 Educação).\n4. Palestras em eventos de varejo/liderança (ABF, Endeavor, eventos de diversidade corporativa).\nPriorize fontes com transcrição ou cobertura jornalística detalhada com citações diretas. Retorne 10-20 itens com prioridade."
      },
      {
        "label": "imprensa-criticas",
        "prompt": "Enumere IMPRENSA e CRÍTICAS sobre {{PERSON}}, além das já conhecidas (IDV, Exame x4, Jornal do Comércio, NeoFeed, InfoMoney x2, Museu da Pessoa, Wikipedia, InvestNews x2, Poder360, ConJur, Suno, CNN Brasil, não repita, busque NOVAS).\n1. Cobertura adicional sobre a queda do valor de mercado do Magalu (2021-2024) e a recuperação/estratégia recente (2025-2026).\n2. Perfis/entrevistas em Forbes BR, Veja, Época Negócios, Pequenas Empresas Grandes Negócios, Valor Econômico.\n3. Cobertura sobre o papel dela no Conselhão do Lula, discurso político, e qualquer controvérsia adicional além do episódio Bolsonaro já mapeado.\n4. Críticas sérias e sourced sobre governança corporativa do Magalu, ou sobre o programa de trainee exclusivo para negros (além das já mapeadas).\nRetorne URLs exatas, tipo=critique para críticas, 10-15 itens."
      }
    ]
  },
  "manoel-conde-neto": {
    "slug": "manoel-conde-neto",
    "name": "Manoel Conde Neto",
    "lang": "pt",
    "corpus": "thin",
    "person": "Manoel Conde Neto, founder and chairman/president of Farma Conde (Brazilian pharmacy retail chain founded in a garage in Ubatuba, São Paulo state, in 1993, grown into a chain with roughly R$1.7 billion in revenue). Gave a full video interview on the TALK+ show/podcast (episode #137). Profiled in Metrópole magazine. Classic founder-from-nothing narrative. NOT any other Manoel Conde.",
    "notes": {
      "exclude": "Legal proceedings, investigations, plea or collaboration agreements, court decisions, and tax or criminal allegations involving him, his family, or Farma Conde are out of scope for this dossier."
    },
    "enumPrompts": [
      {
        "label": "historia-fundacao",
        "prompt": "Enumerate PRIMARY interview/profile content on {{PERSON}}, focused on the founding story of Farma Conde.\n1. Find the full TALK+ video interview (episode #137 or the correct episode number, confirm via search), get the fullest transcript/description with direct quotes.\n2. Find the Metrópole magazine profile piece, and any other profile covering the garage-in-Ubatuba origin story and growth to ~R$1.7 billion revenue.\n3. Find any additional interview or podcast where he discusses founding decisions, near-failure moments, or how the business scaled from a single store.\nReturn exact URLs, priority=high for anything with substantial first-person verbatim content, one-line \"why\" per item. Content will mostly be in Portuguese, that's expected and correct."
      },
      {
        "label": "estrategia-farmacia",
        "prompt": "Enumerate INTERVIEWS and TALKS by {{PERSON}} about running/growing Farma Conde as a regional pharmacy chain.\n1. Find interviews about competing against national chains (Raia Drogasil, Pague Menos, Panvel) as a regional player based on the São Paulo coast.\n2. Find any interview about specific expansion decisions, private-label strategy, or store-format innovation at Farma Conde.\n3. Find any interview or press piece about succession planning or family involvement in the business.\nReturn exact URLs, priority-marked, prioritizing full transcripts or extensive direct quotation over short event-listing pages."
      },
      {
        "label": "criticas",
        "prompt": "Enumerate CRITIQUES and adversarial or complicating material on {{PERSON}}.\n1. Any critique of Farma Conde's business performance, expansion pace, or competitive position vs. national drugstore chains.\n2. Any press skepticism about regional pharmacy chains' long-term viability against national consolidation in Brazil.\n3. Any controversy connected to labor practices, supply chain, or store operations that names him specifically.\nReturn exact URLs, type=critique, 4-8 items, be honest if adversarial material specifically targeting him personally is thin (this is a regional, less-covered figure, say so if true rather than padding)."
      }
    ]
  },
  "mark-zuckerberg": {
    "slug": "mark-zuckerberg",
    "name": "Mark Zuckerberg",
    "lang": "en",
    "corpus": "normal",
    "person": "Mark Zuckerberg, co-founder and CEO of Meta (formerly Facebook), founded 2004 at Harvard with Eduardo Saverin, Dustin Moskovitz, Chris Hughes, Andrew McCollum. NOT any other Mark Zuckerberg.",
    "enumPrompts": [
      {
        "label": "ensaios-talks",
        "prompt": "Enumerate PRIMARY content from {{PERSON}} beyond what's already known (the S-1 \"Hacker Way\" letter, \"Personal Superintelligence\" letter/announcement, \"Open Source AI Is the Path Forward,\" the 2023 Year of Efficiency memo, the Meta Superintelligence Labs internal memo).\n1. Walk about.fb.com/news and meta.com for any Zuckerberg-authored letter, memo, or blog post not yet cited, especially annual \"personal challenge\" posts, Metaverse/Reality Labs vision letters, and any 2025-2026 AI strategy memos.\n2. Find any Facebook-era founder letters/memos (pre-2020) not yet cited, the original 2012 S-1 is there, but look for internal memos, Answers site posts, or SEC filings with substantial first-person Zuckerberg language on product philosophy.\n3. Any 2025-2026 earnings-call transcript with extended first-person Zuckerberg commentary on AI capex, the metaverse pivot's status, or Llama strategy, beyond the one Q1 2026 Fortune piece already cited.\nReturn exact URLs, priority=high for anything with substantial first-person content, one-line \"why\" per item."
      },
      {
        "label": "entrevistas-recentes",
        "prompt": "Enumerate INTERVIEW/PODCAST appearances of {{PERSON}} beyond the ones already known (Dwarkesh Apr 2024, Lex Fridman #398, Joe Rogan Jan 2025/Bloomberg coverage, Alex Heath's \"Access\" podcast, Rowan Cheung \"State of AI\").\n1. Any 2025-2026 long-form podcast/interview appearance discussing Meta Superintelligence Labs, the AI talent war with OpenAI, or the \"personal superintelligence\" vision in more depth.\n2. Any interview specifically about the Facebook founding story at Harvard (2004), the Winklevoss/ConnectU litigation, or the Eduardo Saverin equity-dilution episode, first-person Zuckerberg account, not just secondary/Social-Network-movie retellings.\n3. Any interview about the 2021 Metaverse pivot/rebrand decision, why he bet the company on it, how he now assesses that bet given the 2025-2026 AI pivot.\nReturn exact URLs, priority-marked, 8-12 items with transcripts preferred."
      },
      {
        "label": "criticas",
        "prompt": "Enumerate CRITIQUES and adversarial material on {{PERSON}} beyond what's already known (the Joe Rogan \"masculine energy\" controversy, the fact-checking-program end, the Sam Altman $100M-bonus poaching claim, Meta superintelligence hires leaving quickly).\n1. Congressional testimony critiques, any hearing where he was directly confronted (child safety, Cambridge Analytica follow-ups, antitrust) with named senators/representatives and his actual responses quoted.\n2. Critiques of the Metaverse pivot as a costly failure, Reality Labs cumulative losses, named analyst/employee critiques of the strategic reversal to AI.\n3. Critiques of his political repositioning (2024-2025 shift toward the Trump administration, ending fact-checking, Rogan appearance) from former Meta employees, civil-rights groups, or media-literacy researchers, named critics with direct quotes.\nReturn exact URLs, type=critique, 8-12 items, this is a high-controversy figure, prioritize primary-sourced critique (named critics, court/hearing transcripts, investigative journalism) over tabloid aggregation."
      }
    ]
  },
  "michael-seibel": {
    "slug": "michael-seibel",
    "name": "Michael Seibel",
    "lang": "en",
    "corpus": "normal",
    "person": "Michael Seibel, Group Partner at Y Combinator, former CEO of the core YC accelerator (2016-2024), co-founder/CEO of Justin.tv→Twitch and Socialcam. Blog at michaelseibel.com, co-hosts the \"Dalton & Michael\" YC podcast/video series with Dalton Caldwell. NOT any other Michael Seibel.",
    "notes": {
      "attribution": "He co-hosts the \"Dalton & Michael\" YC series with Dalton Caldwell: distinguish his words from Dalton's."
    },
    "enumPrompts": [
      {
        "label": "ensaios-talks",
        "prompt": "Enumerate PRIMARY content from {{PERSON}} beyond what's already known (9 michaelseibel.com essays, 3 YC Startup Library talks, the Building Product full transcript, 5 Dalton & Michael episodes, SaaStr 2025 pitch guide).\n1. Walk michaelseibel.com/blog for any essay not yet cited, check the full archive index.\n2. Walk the YC Startup Library (ycombinator.com/library) for more Michael Seibel talks not yet cited.\n3. Find more \"Dalton & Michael\" podcast/video episodes (YC's YouTube channel, Spotify) beyond the 5 already known, prioritize ones with substantial Seibel-specific content (not just Dalton).\nReturn exact URLs, priority=high for anything with substantial first-person content, one-line \"why\" per item."
      },
      {
        "label": "entrevistas-recentes",
        "prompt": "Enumerate INTERVIEW/PODCAST appearances of {{PERSON}} beyond the 5 already known (Invest Like the Best EP.190, Wharton FinTech \"Lessons from 5,000 Entrepreneurs\", Black Founders AMA, SaaStr 2025, the Justin.tv/Socialcam origin-story pieces).\n1. Any 2025-2026 podcast/interview appearances discussing YC's current strategy, AI's effect on startups, or his own founder journey in more depth.\n2. Any talk/interview specifically about his time as YC CEO (2016-2024) and the transition back to Group Partner in 2024, what changed, why he stepped down.\n3. Any interview about the Twitch/Justin.tv or Socialcam acquisitions with concrete detail not yet captured.\nReturn exact URLs, priority-marked, 8-12 items with transcripts preferred."
      },
      {
        "label": "criticas",
        "prompt": "Enumerate CRITIQUES and adversarial material on {{PERSON}} beyond the one already known (the \"negatives of YC\" Medium compilation).\n1. Any additional critique of YC's model/curriculum under his leadership as CEO (2016-2024), founder complaints, equity terms critique, batch-size/scale critique.\n2. Critiques of the \"launch fast, talk to users\" doctrine from founders in deep-tech/biotech/regulated industries where it doesn't apply.\n3. Any critique specifically of his \"access not talent\" / diversity framing, or push-back on his 2019 \"move to the Bay Area\" stance.\nReturn exact URLs, type=critique, 6-10 items."
      }
    ]
  },
  "miguel-krigsner": {
    "slug": "miguel-krigsner",
    "name": "Miguel Krigsner",
    "lang": "pt",
    "corpus": "normal",
    "person": "Miguel Krigsner, fundador e presidente do conselho do Grupo Boticário (O Boticário, Eudora, quem disse, berenice?, The Beauty Box). Fundou em 1977 em Curitiba. Autor do livro-memória \"A Essência de Empreender\" (2024, Portfolio-Penguin), vencedor do Prêmio Jabuti 2025 na categoria Negócios. NÃO é nenhum outro Miguel Krigsner.",
    "enumPrompts": [
      {
        "label": "livro-a-fundo",
        "prompt": "Enumere conteúdo PRIMÁRIO do livro-memória de {{PERSON}}, \"A Essência de Empreender\" (2024, Portfolio-Penguin, vencedor Prêmio Jabuti 2025 categoria Negócios), PRIORIDADE MÁXIMA desta rodada. O dossier atual confirma que o livro existe mas NÃO foi lido a fundo, só uma linha (\"tudo ou nada\") vem de cobertura de imprensa sobre o livro, não do texto em si.\n1. Busque trechos/excertos publicados do livro (Google Books, Amazon \"look inside\", resenhas longas que citam passagens extensas com página).\n2. Busque entrevistas de LANÇAMENTO do livro (2024) onde ele leia/cite trechos diretamente, e cobertura do prêmio Jabuti 2025 que cite o livro.\n3. Busque resenhas de crítica literária/de negócios sobre o livro (não só nota de prêmio), o que a resenha diz sobre o conteúdo, estrutura, tom.\nRetorne URLs exatas, prioridade alta para qualquer trecho verbatim do livro (não só ficha técnica/sinopse/nota de prêmio)."
      },
      {
        "label": "negocios-esg",
        "prompt": "Enumere imprensa de NEGÓCIOS/ESG sobre {{PERSON}} além do já conhecido (Brazil Journal perfil, Consumidor Moderno, Exame x3, Hospital INC, (o)eco, MAGG Portugal, Eu Quero Investir, Click Petróleo e Gás, Exame/Modé conflito de canal, CONIB museu, Reclame Aqui).\n1. Entrevistas/perfis adicionais em Forbes BR, Época Negócios, Veja, Valor Econômico sobre a trajetória do Grupo Boticário, sucessão, ou governança familiar.\n2. Cobertura mais recente (2025-2026) sobre resultados do Grupo Boticário, expansão internacional, ou novidades na Fundação Grupo Boticário de Proteção à Natureza.\n3. Qualquer podcast de negócios (Braincast, Market Makers, PrimoCast) com participação dele.\nRetorne URLs exatas, priorize citações diretas dele, 10-15 itens."
      },
      {
        "label": "criticas",
        "prompt": "Enumere CRÍTICAS e material adversarial sobre {{PERSON}} além do já conhecido (reclamações de revendedoras no Reclame Aqui sobre comissão baixa/\"mixaria\", frete, estoque, cobranças abusivas).\n1. Reportagens adicionais sobre disputas com revendedoras ou franqueados do Grupo Boticário.\n2. Qualquer crítica ao modelo de conflito de canal (loja própria vs. revenda direta vs. e-commerce) além da já mapeada.\n3. Cobertura trabalhista/sindical sobre fábricas do grupo, se existir.\n4. Crítica ao \"greenwashing\" ou à autenticidade do posicionamento ESG/conservação do grupo, se existir alguma.\nRetorne URLs exatas, tipo=critique, 6-10 itens."
      }
    ]
  },
  "naval-ravikant": {
    "slug": "naval-ravikant",
    "name": "Naval Ravikant",
    "lang": "en",
    "corpus": "large",
    "person": "Naval Ravikant: Co-founder, AngelList; angel investor. Naval Ravikant, AngelList co-founder, prolific angel (Twitter, Uber, Notion), and the most quotable aphorist on wealth and happiness, is the council's lens for **leverage, autonomy, judgment, and desire-management**: wealth is \"assets that earn while you sleep\" built on *specific knowledge + accountability + permissionless leverage* (code/media) multiplied by *judgment*, the whole stack reduced to two words, \"productize yourself\", and happiness is a learned skill whose engine is desire (\"a contract you make with yourself to be unhappy until you get what you want\"), whose real target is *peace*, and whose enemy is envy. NOT any other Naval Ravikant."
  },
  "nicolas-dessaigne": {
    "slug": "nicolas-dessaigne",
    "name": "Nicolas Dessaigne",
    "lang": "en",
    "corpus": "normal",
    "person": "Nicolas Dessaigne, co-founder and former CEO of Algolia (search/discovery API, 2012-2020, stepped down as CEO in 2020, remained board member), now Group Partner at Y Combinator. Co-founded Algolia with Julien Lemoine. NOT any other Nicolas Dessaigne.",
    "enumPrompts": [
      {
        "label": "ensaios-talks",
        "prompt": "Enumerate PRIMARY content from {{PERSON}} beyond what's already known (YC Startup School talk \"How To Start A Dev Tools Company\", SaaStr \"Culture That Scales\", SaaStr Podcast #015, YC profile page, a 2025 Substack piece on YC/AI).\n1. Walk the YC Startup Library (ycombinator.com/library) and YC's YouTube/blog for any Dessaigne talk or essay not yet cited.\n2. Look for any Algolia company blog posts, engineering blog posts, or \"Inside Algolia\" pieces authored by or featuring him directly (not just PR).\n3. Find any 2024-2026 talks/essays about his transition into YC Group Partner, what he looks for in dev-tools/infra founders now, patterns he sees across YC batches.\nReturn exact URLs, priority=high for anything with substantial first-person content, one-line \"why\" per item."
      },
      {
        "label": "entrevistas-recentes",
        "prompt": "Enumerate INTERVIEW/PODCAST appearances of {{PERSON}} beyond the ones already known (TechCrunch on stepping down as CEO, STATION F fireside chat, EU-Startups AI-search interview, 20VC, Lago pricing interview, VentureBeat devrel interview, AppSelekt \"14 Minutes of SaaS\", \"Understanding-as-a-Service\" conversational-interface piece, DEV Community advice piece).\n1. Any 2024-2026 podcast/interview appearances as a YC Group Partner discussing AI, dev tools, or founder advice.\n2. Any interview specifically about the Algolia founding story (2012, with Julien Lemoine), the early pivot from a mobile SDK idea to search-as-a-service, or the YC S14 batch experience.\n3. Any interview or talk about the decision to step down as CEO in 2020 and hand over to Bernadette Nixon, what prompted it, how the transition went, board dynamics.\nReturn exact URLs, priority-marked, 8-12 items with transcripts preferred."
      },
      {
        "label": "criticas",
        "prompt": "Enumerate CRITIQUES and adversarial material on {{PERSON}} and Algolia under his leadership (2012-2020).\n1. Glassdoor/employee-review critiques of Algolia culture under his tenure as CEO, the existing dossier cites the Glassdoor review page itself but may not have pulled specific quoted reviews.\n2. Any founder-community critique of Algolia's pricing model (usage-based search pricing) as confusing or misaligned, search Hacker News threads, dev-tools pricing critiques.\n3. Any critique of the CEO transition (2020), was it read as a forced step-down, board pressure, or a clean voluntary handoff? Any competitor (Elasticsearch, Typesense, Meilisearch) commentary contrasting Algolia's trajectory under him.\nReturn exact URLs, type=critique, 5-8 items, be honest if little adversarial material exists (he's a lower-controversy figure than most of the roster)."
      }
    ]
  },
  "paul-graham": {
    "slug": "paul-graham",
    "name": "Paul Graham",
    "lang": "en",
    "corpus": "large",
    "person": "Paul Graham: Co-founder, Y Combinator. Paul Graham is the essayist-investor who co-founded Y Combinator and, across ~225 plain-prose essays, wrote the operating system a generation of founders runs on. NOT any other Paul Graham."
  },
  "paulo-correa": {
    "slug": "paulo-correa",
    "name": "Paulo Corrêa",
    "lang": "pt",
    "corpus": "normal",
    "person": "Paulo Corrêa, CEO of C&A Brasil since 2004. Background: McKinsey, then Xerox, before joining C&A. Led C&A Brasil's transformation into a digitally-oriented, independent retailer (C&A Brasil became a standalone company from the global C&A/Cofra structure and went public via IPO on B3 in 2019, ticker CEAB3). Runs his own recurring video/interview series (referenced online as around episode #255) where he discusses retail strategy at length; recurring presence in Brazilian business media (NeoFeed, InfoMoney, Bloomberg Línea, XP Expert Talks) with a consistent thesis about reinventing the traditional fashion-retail logic (digital transformation, store-as-hub, data-driven merchandising). NOT any other Paulo Corrêa (common Brazilian name), must be specifically the CEO of C&A Brasil (moda/varejo, B3: CEAB3).",
    "enumPrompts": [
      {
        "label": "primeira-pessoa",
        "prompt": "Enumerate PRIMARY first-person content from {{PERSON}}.\n1. Find his own video/interview series (search for a YouTube channel or series where he appears as host/guest discussing retail strategy at length, reportedly numbered episodes, possibly referenced as around #255, confirm the real channel/series name via search rather than assuming).\n2. Find any columns, LinkedIn posts/articles, or bylined pieces he's authored for business publications (Valor Econômico, Exame, Forbes Brasil, NeoFeed) about retail strategy, digital transformation, or leadership.\n3. Find earnings-call transcripts or investor-day presentations where he speaks directly and extensively (Seeking Alpha, MZiQ, company IR site) since C&A Brasil is publicly traded.\nReturn exact URLs, priority=high for anything with substantial first-person verbatim content, one-line \"why\" per item. Content will mostly be in Portuguese, that's expected and correct."
      },
      {
        "label": "entrevistas-podcasts",
        "prompt": "Enumerate INTERVIEW and PODCAST appearances of {{PERSON}}.\n1. Find podcast/video interviews about the 2019 IPO and separation of C&A Brasil from the global C&A/Cofra group, his own account of that strategic decision.\n2. Find interviews/talks about the digital transformation strategy at C&A Brasil (omnichannel, store-as-fulfillment-hub, data/tech investment), NeoFeed, InfoMoney, Bloomberg Línea, XP Expert Talks, Google/Mercado&Consumo events are good places to search.\n3. Find any interview specifically about his career path (McKinsey → Xerox → C&A) and what shaped his leadership approach.\nReturn exact URLs, priority-marked, prioritizing full transcripts or extensive direct quotation over short event-listing pages."
      },
      {
        "label": "criticas",
        "prompt": "Enumerate CRITIQUES and adversarial or complicating material on {{PERSON}}.\n1. Any critique of C&A Brasil's financial performance, stock performance since the 2019 IPO, or specific strategic decisions under his leadership.\n2. Any analyst or press skepticism about the digital transformation thesis, margin pressure, or competitive position vs. Renner/Riachuelo/Marisa.\n3. Any controversy connected to labor practices, supply chain, or governance during his tenure that names him specifically.\nReturn exact URLs, type=critique, 4-8 items, be honest if adversarial material specifically targeting him personally (vs. generic industry criticism) is thin."
      }
    ]
  },
  "paulo-nassar": {
    "slug": "paulo-nassar",
    "name": "Paulo Nassar",
    "lang": "pt",
    "corpus": "normal",
    "person": "Paulo Nassar, CEO and co-founder of Cobasi (Brazilian pet-and-garden retail chain). Multiple long-form podcast appearances, including \"Do Zero ao Topo\" (InfoMoney) and \"De Frente com CEO\" (Exame). Led Cobasi through its 2024 merger with Petz, forming a combined pet-retail giant in Brazil. Classic founder-operator narrative. NOT any other Paulo Nassar.",
    "enumPrompts": [
      {
        "label": "podcasts-longform",
        "prompt": "Enumerate PRIMARY long-form podcast/interview content on {{PERSON}}.\n1. Find the full \"Do Zero ao Topo\" (InfoMoney) episode featuring him, get the fullest transcript or extensive write-up with direct quotes.\n2. Find the full \"De Frente com CEO\" (Exame) episode/interview featuring him, same, fullest version.\n3. Find any other long-form interview or podcast where he discusses founding and building Cobasi from the ground up.\nReturn exact URLs, priority=high for anything with substantial first-person verbatim content, one-line \"why\" per item. Content will mostly be in Portuguese, that's expected and correct."
      },
      {
        "label": "fusao-petz",
        "prompt": "Enumerate INTERVIEWS and PRESS COVERAGE by/about {{PERSON}} regarding the 2024 Cobasi-Petz merger.\n1. Find his own interviews/statements about the strategic logic of merging with Petz (market consolidation, competitive response, synergies), his own words on why and how.\n2. Find press coverage (Bloomberg Línea, NeoFeed, Exame, InfoMoney) of the merger process, governance structure post-merger, and his role in the combined company.\n3. Find any interview about competing against pet-retail rivals (Petlove, or others) before and after the merger.\nReturn exact URLs, priority-marked, prioritizing full transcripts or extensive direct quotation over short event-listing pages."
      },
      {
        "label": "criticas",
        "prompt": "Enumerate CRITIQUES and adversarial or complicating material on {{PERSON}}.\n1. Any critique of the Cobasi-Petz merger (antitrust/CADE scrutiny, market concentration concerns, integration execution risk).\n2. Any analyst or press skepticism about Cobasi's growth strategy, financial performance, or competitive position before the merger.\n3. Any controversy connected to labor practices, animal welfare (relevant given the pet-retail business), or governance that names him specifically.\nReturn exact URLs, type=critique, 4-8 items, be honest if adversarial material specifically targeting him personally (vs. generic merger-antitrust process coverage) is thin."
      }
    ]
  },
  "pedro-franceschi": {
    "slug": "pedro-franceschi",
    "name": "Pedro Franceschi",
    "lang": "en",
    "corpus": "normal",
    "person": "Pedro Franceschi, Brazilian co-founder and CEO of Brex (corporate cards/spend management, founded 2017 with Henrique Dubugras), previously co-founded Pagar.me and Escola Squad in Brazil as a teenager before YC. NOT any other Pedro Franceschi.",
    "enumPrompts": [
      {
        "label": "ensaios-talks",
        "prompt": "Enumerate PRIMARY content from {{PERSON}} beyond what's already known (Brex Journal posts on founder mode/Brex 3.0/the Capital One deal/the 2024 restructuring memo, two Medium essays on growth mindset and mental health, the YC \"CEO Must Be Chief AI Officer\" talk, several StartupArchive clips).\n1. Walk the Brex Journal (brex.com/journal) archive for any post authored by or quoting him at length not yet cited.\n2. Look for any Brazilian-press coverage or interviews (Exame, Folha, Pipeline, Startups Brasil) about his teenage-founder years (Pagar.me, Escola Squad) or his relationship to the BR startup scene, this angle is likely thin in English-language coverage.\n3. Find any 2024-2026 talk/interview specifically about AI-native company-building at Brex (headcount-vs-AI, the \"chief AI officer\" framing) beyond the one YC talk already cited.\nReturn exact URLs, priority=high for anything with substantial first-person content, one-line \"why\" per item."
      },
      {
        "label": "entrevistas-recentes",
        "prompt": "Enumerate INTERVIEW/PODCAST appearances of {{PERSON}} beyond the ones already known (20VC E1178 + summary, Grit/Kleiner Perkins \"Brex 3.0\", Core Memory EP63 + transcript, Sourcery on the Capital One acquisition, three StartupArchive clips).\n1. Any 2024-2026 long-form interview discussing the Brex turnaround, the Capital One acquisition (announced 2025/2026), or IPO plans in more depth.\n2. Any interview specifically about co-founding Brex with Henrique Dubugras at 19-20 years old, YC S17 batch experience, the early pivot from Brazilian teen-founder circuit to Silicon Valley, and their working co-founder dynamic (they're famously close, almost brothers).\n3. Any interview about his own mental-health journey (the dossier cites one Medium essay), deeper follow-up interviews, therapy/burnout specifics, how it shaped Brex's culture.\nReturn exact URLs, priority-marked, 8-12 items with transcripts preferred."
      },
      {
        "label": "criticas",
        "prompt": "Enumerate CRITIQUES and adversarial material on {{PERSON}} and Brex under his leadership.\n1. Critiques of the 2022-2023 Brex layoffs/restructuring, the SMB-to-enterprise pivot (many small-business customers were dropped/pushed out), named critic quotes, not just news roundups.\n2. Competitive critique vs. Ramp, direct comparisons, former-employee or customer commentary on why Brex fell behind Ramp in growth/valuation during the 2022-2024 period.\n3. Any critique of the Capital One deal itself, analyst skepticism, employee-morale concerns, customer-transition concerns.\nReturn exact URLs, type=critique, 5-8 items, be honest if adversarial material is thin (he's a lower-controversy, well-liked figure relative to most of the roster)."
      }
    ]
  },
  "reed-hastings": {
    "slug": "reed-hastings",
    "name": "Reed Hastings",
    "lang": "en",
    "corpus": "large",
    "person": "Reed Hastings, co-founder and former Executive Chairman of Netflix; author (with Erin Meyer) of \"No Rules Rules: Netflix and the Culture of Reinvention\" (2020). Left the Netflix board June 2026. Now on Anthropic's board, active in AI/humanities philanthropy (Bowdoin) and education reform philanthropy. Founded Pure Software before Netflix.",
    "notes": {
      "focus": "Book content is the highest-priority payload: do not leave \"No Rules Rules\" (2020, with Erin Meyer) underrepresented. Weave real book content, including Erin Meyer's cross-cultural commentary sections, through Core ideas, Mental models, and Positions (sunshining, Live 360 mechanics, the culture-map material, the closing argument).",
      "attribution": "\"No Rules Rules\" alternates Hastings' first-person narrative with Erin Meyer's research commentary: never conflate the two voices. Some quotes may be a Netflix executive's or an interviewer's."
    },
    "enumPrompts": [
      {
        "label": "livro-a-fundo",
        "prompt": "Enumerate PRIMARY BOOK content for {{PERSON}}'s \"No Rules Rules: Netflix and the Culture of Reinvention\" (with Erin Meyer, 2020), this is the HIGHEST-PRIORITY target for this rebuild; make sure the book is well covered, not just cited via a Goodreads quotes page (which is the current dossier's only book source).\nFind ways to read MORE of the actual book content: Google Books preview pages, publisher (Penguin Random House) excerpt pages, any legitimate book-summary site that quotes extended passages with page numbers (e.g. Blinkist-style summaries, Four Minute Books, Sam Thomas Davies notes, Derek Sivers' book notes if he has one), long-form reviews that quote extended passages verbatim, and especially content from Erin Meyer's own chapters/sections (the book alternates between Hastings' narrative and Meyer's cross-cultural research commentary, her material is often under-covered). Look specifically for content on: the 3-step model (talent density → candor → reduce controls, and its reverse order framing), the \"sunshining\" practice, Live 360s/written 360s specifics, the \"context not control\" chapter's Netflix-vs-traditional-company contrast, any chapter on international/cultural adaptation (Erin Meyer's culture-map framework applied to Netflix globally), and the book's own closing chapter/conclusion. Return exact URLs, priority=high, with a note on what NEW book content each source would surface beyond what a Goodreads quote page gives."
      },
      {
        "label": "deck-memo-video",
        "prompt": "Enumerate additional PRIMARY material beyond the book: the various versions of Netflix's \"Culture: Freedom & Responsibility\" deck (the original 2009 SlideShare version is known; find later official revisions, Netflix has re-published the culture memo/deck multiple times over the years, e.g. 2017 rewrite), the current jobs.netflix.com/culture page in full, and any Hastings-authored blog posts, LinkedIn posts, or shareholder letters (Netflix quarterly letters to shareholders, which Hastings co-signed for years) that contain his own words on strategy/culture/decisions, pick 5-8 shareholder letters spanning different eras (early streaming pivot ~2011-2013, content-spend ramp ~2018-2019, password-sharing crackdown/ads-tier pivot ~2022-2023) for genuinely new strategic-decision material. Return exact URLs, priority-marked."
      },
      {
        "label": "podcasts-talks",
        "prompt": "Enumerate PODCAST/TALK/interview appearances of {{PERSON}} beyond the 2 already known (Tim Ferriss Show #730, CNBC 2024 farming-for-dissent piece).\nLook for: Lex Fridman podcast, Stanford GSB/Y Combinator talks, Davos/WEF appearances, any interview specifically about the Anthropic board appointment or his AI views in more depth, interviews about Powder Mountain, and any older (pre-2020) interview about the book launch itself (2020 press tour). Prefer sources with full transcripts. Return 8-15 items with exact URLs, priority-marked."
      },
      {
        "label": "criticas",
        "prompt": "Enumerate CRITIQUES and adversarial material on {{PERSON}} beyond what's already known (2018 WSJ investigation via The Week, HBS Joly & Schlesinger case, Hollywood Reporter on layoffs, Quartz x2, Salt Lake Tribune/Hollywood Reporter on Powder Mountain).\n1. Any academic/management-theory critique of \"No Rules Rules\" specifically (not just the culture generally), does the book's own methodology or Erin Meyer's research get critiqued anywhere?\n2. Fresh critiques of Netflix under his post-2023 Executive Chairman role or since his June 2026 board exit, succession commentary, any retrospective assessment of his tenure.\n3. Critiques of the password-sharing crackdown and ads-tier pivot (2022-2023) as tests of the \"no rules\" philosophy under real business pressure, did it hold up?\n4. Any critique of the Bowdoin AI/humanities gift or his education-reform philanthropy (charter schools), is there pushback on his education politics?\nReturn exact URLs, type=critique, 8-12 items."
      }
    ]
  },
  "reid-hoffman": {
    "slug": "reid-hoffman",
    "name": "Reid Hoffman",
    "lang": "en",
    "corpus": "large",
    "person": "Reid Hoffman: Co-founder, LinkedIn; Partner, Greylock; co-founder, Manas AI; host, Masters of Scale. Reid Hoffman is the \"theory-of-the-firm\" venture capitalist, LinkedIn co-founder, PayPal exec (\"PayPal Mafia\"), Greylock partner, *Masters of Scale* host, and the most prolific framework-author among operators (Blitzscaling, The Start-Up of You, The Alliance, Masters of Scale, Impromptu, Superagency). NOT any other Reid Hoffman."
  },
  "roberto-jatahy": {
    "slug": "roberto-jatahy",
    "name": "Roberto Jatahy",
    "lang": "pt",
    "corpus": "normal",
    "person": "Roberto Jatahy, CEO of Grupo Soma (Brazilian fashion retail group, B3 ticker SOMA3, whose brands include Farm, Animale, NV, and Hering, among others). Named to the Business of Fashion 500/BoF list (2023) as one of very few Brazilians recognized. EY Entrepreneur of the Year Brazil (2020). Featured on the cover of Exame magazine (profile on \"estilo bilionário\" / billionaire style). Gives frequent interviews about multi-brand M&A/consolidation strategy in fashion retail, including investor talks (XP) and business press. NOT any other Roberto Jatahy.",
    "enumPrompts": [
      {
        "label": "perfil-fundador",
        "prompt": "Enumerate PRIMARY interview/profile content on {{PERSON}}.\n1. Find the Exame magazine cover profile (\"estilo bilionário\" or similar), get the fullest version with direct quotes.\n2. Find the EY Entrepreneur of the Year 2020 Brazil recognition content (interview, acceptance remarks, profile) and any Business of Fashion 500 (2023) feature/interview.\n3. Find any long-form interview or podcast where he discusses his own career path and the founding/scaling of Grupo Soma.\nReturn exact URLs, priority=high for anything with substantial first-person verbatim content, one-line \"why\" per item. Content will mostly be in Portuguese, that's expected and correct."
      },
      {
        "label": "estrategia-ma",
        "prompt": "Enumerate INTERVIEWS and TALKS by {{PERSON}} about Grupo Soma's M&A and multi-brand consolidation strategy.\n1. Find investor talks or interviews (XP Investimentos, InfoMoney, Bloomberg Línea, NeoFeed) about specific acquisitions (Hering, Animale/NV, or others) and the logic behind buying vs. building brands.\n2. Find interviews about how he manages a multi-brand portfolio (creative independence vs. shared back-office/logistics), his own framework if named.\n3. Find any interview specifically addressing succession, family involvement, or the transition from single-brand founder to multi-brand group CEO.\nReturn exact URLs, priority-marked, prioritizing full transcripts or extensive direct quotation over short event-listing pages."
      },
      {
        "label": "criticas",
        "prompt": "Enumerate CRITIQUES and adversarial or complicating material on {{PERSON}}.\n1. Any critique of Grupo Soma's stock performance, integration execution after acquisitions (especially Hering), or margin pressure.\n2. Any analyst or press skepticism about the roll-up/multi-brand consolidation strategy in Brazilian fashion retail.\n3. Any controversy connected to labor practices, supply chain, or governance during his tenure that names him specifically.\nReturn exact URLs, type=critique, 4-8 items, be honest if adversarial material specifically targeting him personally (vs. generic sector criticism) is thin."
      }
    ]
  },
  "rodrigo-vidigal": {
    "slug": "rodrigo-vidigal",
    "name": "Rodrigo Vidigal",
    "lang": "pt",
    "corpus": "thin",
    "person": "Rodrigo Vidigal, President of Motorola Mobility Brazil. Gives recurrent interviews (Forbes Brasil, Mobile Time, Tecnoblog, Bloomberg Línea) articulating a consistent, repeated thesis that Brazil functions as a \"global laboratory\" for Motorola's product/brand strategy, features and campaigns tested in Brazil before global rollout. NOT any other Rodrigo Vidigal.",
    "enumPrompts": [
      {
        "label": "tese-laboratorio-global",
        "prompt": "Enumerate PRIMARY interview content on {{PERSON}} where he articulates the \"Brazil as global laboratory\" thesis for Motorola.\n1. Find the Forbes Brasil, Mobile Time, and Tecnoblog interviews (or similar tech/business press) where he discusses Brazil's role in Motorola's global product strategy, get the fullest versions with direct quotes.\n2. Find any Bloomberg Línea interview or press piece where he discusses Motorola Brazil's market strategy, brand positioning vs. Samsung/Apple/Xiaomi, or specific product launches tested first in Brazil.\n3. Find any additional interview or talk where he discusses his own career path or leadership approach at Motorola Brazil.\nReturn exact URLs, priority=high for anything with substantial first-person verbatim content, one-line \"why\" per item. Content will mostly be in Portuguese, that's expected and correct."
      },
      {
        "label": "estrategia-mercado-br",
        "prompt": "Enumerate INTERVIEWS and TALKS by {{PERSON}} about Motorola's business strategy in the Brazilian smartphone market.\n1. Find interviews about specific product launches, market-share data, or competitive positioning in Brazil (vs. Samsung, Apple, Xiaomi).\n2. Find interviews about manufacturing/local production strategy (Motorola has a factory in the Manaus Free Trade Zone) and how that factors into pricing or market strategy.\n3. Find any interview about marketing/distribution strategy specific to the Brazilian market (retail partnerships, carrier deals, price segmentation).\nReturn exact URLs, priority-marked, prioritizing full transcripts or extensive direct quotation over short event-listing pages."
      },
      {
        "label": "criticas",
        "prompt": "Enumerate CRITIQUES and adversarial or complicating material on {{PERSON}}.\n1. Any critique of Motorola's market-share performance, product quality issues, or competitive position in Brazil under his leadership.\n2. Any analyst or press skepticism about the \"Brazil as global laboratory\" thesis or Motorola's broader strategy in Latin America.\n3. Any controversy connected to labor practices at the Manaus factory, supply chain, or governance that names him specifically.\nReturn exact URLs, type=critique, 4-8 items, be honest if adversarial material specifically targeting him personally (vs. generic industry/company criticism) is thin."
      }
    ]
  },
  "rony-meisler": {
    "slug": "rony-meisler",
    "name": "Rony Meisler",
    "lang": "pt",
    "corpus": "normal",
    "person": "Rony Meisler, cofundador e ex-CEO da Reserva (marca de moda masculina, vendida à Arezzo&Co em 2020 por ~R$715M) e da AR&Co (Reserva, Reserva Mini/Go/Ink, Eva, Oficina), saiu em dez/2024 num split turbulento com Alexandre Birman. Hoje comanda a Rebels Ventures. Presidente do movimento Capitalismo Consciente no Brasil. NÃO é nenhum outro Rony Meisler.",
    "enumPrompts": [
      {
        "label": "livro-blog",
        "prompt": "Enumere o corpus PRIMÁRIO ESCRITO de {{PERSON}}\n1. Livro \"Rebeldes Têm Asas\" (com Sérgio Pugliese, Editora Sextante/Gente), página da editora, Amazon, Skoob, qualquer resenha longa com trechos verbatim (o dossier atual só tem a página da editora, sem trecho do texto, busque resenhas/excertos).\n2. O blog completo em ronymeisler.com.br/blog, LISTE TODOS os posts do índice/arquivo do blog, não só os 7 já conhecidos (Seja a cola, Community is the new king, Déjà vu, A ordem dos fatores, O presente é o passado do futuro, Feliz Vida Nova, A grama do vizinho). Ache posts NOVOS que ainda não estão nessa lista.\n3. Qualquer artigo de opinião assinado por ele em veículos externos (LinkedIn, Forbes BR, Exame, Época Negócios).\n4. Material do movimento Capitalismo Consciente Brasil onde ele é citado como presidente/porta-voz, site oficial, publicações, entrevistas ligadas ao cargo.\nRetorne URLs exatas com prioridade alta para o livro, posts novos do blog e material do Capitalismo Consciente."
      },
      {
        "label": "podcasts-video",
        "prompt": "Enumere aparições em ÁUDIO/VÍDEO de {{PERSON}}\n1. Os Sócios #110, TalksbyLeo #238, 10&Faixa #09, É Negócio, Valuable Young Leaders, Papo de Gestão, Performance Líder, Sambatalks, Como Viver Até os 100, ache a página de cada episódio (Spotify/YouTube), e se existir transcrição ou cobertura jornalística com citações diretas daquele episódio específico.\n2. Sicomércio 2025 (já coberto via Portal do Comércio), busque cobertura ADICIONAL do mesmo evento ou de outras falas em eventos de varejo/franchising.\n3. Qualquer painel/palestra sobre a saída da Reserva/Azzas ou sobre a Rebels Ventures em 2025/2026.\nPriorize fontes com transcrição ou cobertura jornalística detalhada com citações diretas. Retorne 10-20 itens com prioridade."
      },
      {
        "label": "imprensa-criticas",
        "prompt": "Enumere IMPRENSA e CRÍTICAS sobre {{PERSON}}, além das já conhecidas (meusucesso x2, NeoFeed x4, Exame INSIGHT, Suno, Poder360, Portal do Comércio, não repita, busque NOVAS).\n1. Cobertura adicional da saída da Azzas/Arezzo em 2024-2025 (valores do acordo, disputas, entrevistas de despedida).\n2. Cobertura da Rebels Ventures (2025-2026): investimentos feitos, teses, entrevistas sobre o pivot para wellness/longevidade.\n3. Críticas sérias e sourced ADICIONAIS às já mapeadas (campanha \"Gemidão do WhatsApp\" 2018, campanha 2015 comparando mulheres/pessoas negras a animais, \"brincadeira inocente\" 2014): busque se há mais alguma controvérsia de marketing, disputa trabalhista, ou crítica ao modelo de franquia/expansão da Reserva.\n4. Números financeiros mais recentes da AR&Co/Azzas pós-saída dele, se disponíveis.\nRetorne URLs exatas, tipo=critique para críticas, 10-15 itens."
      }
    ]
  },
  "ryan-breslow": {
    "slug": "ryan-breslow",
    "name": "Ryan Breslow",
    "lang": "en",
    "corpus": "normal",
    "person": "Ryan Breslow, founder of Bolt (one-click checkout, founded 2014), stepped down as CEO in Jan 2022 amid controversy, returned as CEO in March 2025. Also founded/backed Love, Bolt Ventures, and various crypto/wellness ventures. NOT any other Ryan Breslow.",
    "enumPrompts": [
      {
        "label": "ensaios-talks",
        "prompt": "Enumerate PRIMARY content from {{PERSON}} beyond what's already known, the current dossier baseline is heavy on CRITIQUE/press coverage of the 2022 controversy, SEC probe, and 2025 comeback, but likely THIN on his own primary voice/essays/talks. Prioritize finding his own words.\n1. Walk his X/Twitter (@ryanbreslow) beyond the one known \"Mob Bosses\" thread, find other long-form threads where he lays out a business philosophy, founder advice, or his own account of the Bolt saga (departure, SEC probe resolution, 2025 return).\n2. Find any blog posts, Medium essays, or LinkedIn posts he's authored directly (not press coverage about him), on checkout/ecommerce, on crypto (he's been vocal on crypto/wellness ventures), or on his return-to-CEO thesis.\n3. Any podcast where HE is the guest doing extended first-person talking, beyond the two already cited (Logan Bartlett, My First Million), look for 2024-2026 appearances discussing the comeback specifically.\nReturn exact URLs, priority=high for anything with substantial first-person content, one-line \"why\" per item."
      },
      {
        "label": "entrevistas-recentes",
        "prompt": "Enumerate INTERVIEW/PODCAST appearances of {{PERSON}} beyond the ones already known (Logan Bartlett Show EP10, My First Million).\n1. Any 2025-2026 interview about his return as Bolt CEO, why he came back, what he'd do differently, his own account of the BlackRock lawsuit and the $14B fundraise controversy.\n2. Any interview specifically about the January 2022 departure, his own first-person account (not just TechCrunch's framing) of why he stepped down, whether it was voluntary, and how he processed the \"mob bosses\" fallout.\n3. Any interview about crypto/wellness ventures (Love, or others) that reveals his broader founder philosophy beyond Bolt specifically.\nReturn exact URLs, priority-marked, 8-12 items with transcripts preferred."
      },
      {
        "label": "criticas",
        "prompt": "Enumerate CRITIQUES and adversarial material on {{PERSON}} beyond what's already known (the NYT \"pumped up financials\" investigation, the SEC probe, the BlackRock lawsuit, the investor lawsuit over the $30M loan, the \"mob bosses\" backlash itself).\n1. Any named former Bolt employee, investor, or board member critique, on-record quotes about his leadership style, the metrics-inflation allegations, or the decision-making that led to the 2022 crisis.\n2. Critiques of the 2025 comeback itself, analyst/investor skepticism about installing him back as CEO given the unresolved legal issues, named skeptics.\n3. Any critique of his public communication style (the combative \"mob bosses\" thread, the NYT \"hit piece\" framing) from media critics or fellow founders/VCs.\nReturn exact URLs, type=critique, 8-12 items, this is a high-controversy figure with abundant primary-sourced critique (court filings, named on-record critics, investigative journalism), prioritize those over aggregator roundups."
      }
    ]
  },
  "sam-altman": {
    "slug": "sam-altman",
    "name": "Sam Altman",
    "lang": "en",
    "corpus": "normal",
    "person": "Sam Altman, CEO of OpenAI (since 2019 as CEO, briefly ousted and reinstated in Nov 2023). President of Y Combinator (2014-2019), succeeding Paul Graham; before that co-founder & CEO of Loopt (YC S05, location-based social app, acquired by Green Dot in 2012). Prolific personal blogger at blog.samaltman.com since ~2009 (essays like \"How to Be Successful,\" \"Moore's Law for Everything,\" \"The Merge,\" \"What I Wish Someone Had Told Me,\" \"Startup Playbook\"). Author of the essay series/blog \"The Intelligence Age.\" Frequent Congressional witness on AI regulation. Countless long-form interviews (Lex Fridman, various). Also known for OpenAI's rapid commercialization (ChatGPT launch Nov 2022) and public disputes with Elon Musk over OpenAI's nonprofit-to-for-profit transition. NOT the actor Sam Altman or any unrelated person of the same name.",
    "enumPrompts": [
      {
        "label": "ensaios-blog",
        "prompt": "Enumerate PRIMARY WRITTEN material authored by {{PERSON}}.\n1. Walk his personal blog archive at blog.samaltman.com, find as many of his own essays as possible (e.g. \"How to Be Successful,\" \"Startup Playbook,\" \"Moore's Law for Everything,\" \"What I Wish Someone Had Told Me,\" \"The Merge,\" \"Idea Generation,\" \"Productivity,\" and others). Enumerate the actual archive/index page, don't rely only on the most-famous ones surfacing via search.\n2. Find his essay series \"The Intelligence Age\" and any other essays published on openai.com or under his own byline about AGI/AI policy.\n3. Find his written Congressional testimony (US Senate/House AI hearings), the submitted written statements.\nReturn exact URLs, priority=high for anything with substantial first-person authored content, one-line \"why\" per item."
      },
      {
        "label": "entrevistas-talks",
        "prompt": "Enumerate LONG-FORM INTERVIEWS, PODCASTS, and TALKS featuring {{PERSON}}.\n1. His appearance(s) on Lex Fridman's podcast (check for more than one episode).\n2. His talks/interviews around the Nov 2023 OpenAI board ouster-and-reinstatement saga, his own account of what happened, in his own words (not just news coverage).\n3. Any other substantial long-form interview or fireside chat (e.g. Y Combinator events, Bloomberg, Stratechery/Ben Thompson, Cheeky Pint, or similar) about AGI timelines, startup advice, or OpenAI strategy.\nPrioritize sources with full transcripts over short clips. Return exact URLs, priority-marked, one-line \"why\" per item."
      },
      {
        "label": "criticas",
        "prompt": "Enumerate CRITIQUES and adversarial material about {{PERSON}}.\n1. The Nov 2023 OpenAI board crisis, the board's stated reasons for firing him (\"not consistently candid\"), and any credible reporting on what specifically triggered it.\n2. Elon Musk's public criticisms and lawsuit(s) against OpenAI/Altman over the nonprofit-to-for-profit transition and alleged departure from the founding mission.\n3. Other named critiques: e.g. former OpenAI safety researchers (Jan Leike, Ilya Sutskever, or others) who left citing concerns about safety culture under his leadership; critiques of his equity/compensation structure or of Worldcoin (his eyeball-scanning crypto venture).\nReturn exact URLs, type=critique, 4-8 items, be honest about how substantial vs. thin the critical material is."
      }
    ]
  },
  "sergey-brin": {
    "slug": "sergey-brin",
    "name": "Sergey Brin",
    "lang": "en",
    "corpus": "thin",
    "person": "Sergey Brin, co-founder of Google (1998, with Larry Page) and Alphabet, stepped back from day-to-day executive roles in Dec 2019, re-engaged hands-on with Gemini/AI around 2023-2024. NOT any other Sergey Brin. IMPORTANT: he is genuinely reclusive, gives very few interviews, has no blog/essay habit like most of this roster. Do NOT pad the corpus with weak secondary sources or inflate thin material to look like more than it is. If the honest count of primary/substantial sources is modest, report that honestly rather than force it toward this project's usual scale.",
    "enumPrompts": [
      {
        "label": "ensaios-talks",
        "prompt": "Enumerate PRIMARY content from {{PERSON}} beyond what's already known (the 2004 IPO \"Owner's Manual\" founders' letter, the All-In Miami 2024 interview transcript, the Google I/O 2025 fireside with Demis Hassabis, the Stanford centennial talk Dec 2025, a leaked internal Gemini memo Mar 2025).\n1. Search specifically for the full text or transcript of the leaked internal memo to Gemini staff (Mar 2025), the dossier references it but may not quote it directly; find the actual leaked text if it's been published anywhere.\n2. Look for any other founders' letters he co-authored with Larry Page beyond the 2004 IPO letter (annual founders' letters existed for several years after 2004), check abc.xyz/investor/founders-letters/ for the full archive.\n3. Any additional recorded talk, fireside chat, or internal all-hands appearance (Google I/O, TED, any conference) where he speaks at length in his own voice, be honest if very little exists beyond what's cited; do not stretch weak secondary write-ups into \"primary content.\"\nReturn exact URLs, priority=high for anything with substantial first-person content, one-line \"why\" per item. If you find fewer than 10 genuinely new items, that is an accurate result, report it as such rather than padding with low-value sources."
      },
      {
        "label": "entrevistas-recentes",
        "prompt": "Enumerate INTERVIEW/PODCAST appearances of {{PERSON}} beyond the ones already known (All-In Miami 2024, EducationNext interview, Google I/O 2025, Stanford Dec 2025 talk).\n1. Any 2024-2026 interview/podcast appearance beyond the ones cited, he gives very few, so be thorough but honest if the count is genuinely small.\n2. Any interview specifically about his Soviet emigre background and how it shapes his views on censorship/authoritarianism, the dossier has secondary coverage (Quartz, France24) but may lack a direct Brin interview quote on this.\n3. Any interview about his Parkinson's-research philanthropy or personal science interests (the dossier flags this as undocumented), find primary material if it exists, or confirm honestly that it doesn't.\nReturn exact URLs, priority-marked. A short list (4-8 items) is an acceptable, honest result for this reclusive a figure."
      },
      {
        "label": "criticas",
        "prompt": "Enumerate CRITIQUES and adversarial material on {{PERSON}} beyond what's already known (Street View Wi-Fi data-collection scandal, the \"threatening AI\" comments critique, EPIC's Street View investigations).\n1. Critiques of his post-2023 return to hands-on AI work, any named Google/DeepMind employee or industry critic who's pushed back on the 60-hour-week comments or his re-involvement style.\n2. Any critique of his and Page's continued super-voting-share control despite stepping back from executive roles, governance critics, shareholder advocates.\n3. Critiques of Google's AI strategy under his renewed influence (Gemini rollout stumbles, the image-generation controversy he already admitted to), named critics beyond what's cited.\nReturn exact URLs, type=critique, 4-8 items, be honest if adversarial material specifically targeting Brin (vs. Google generally) is thin."
      }
    ]
  },
  "stephane-maquaire": {
    "slug": "stephane-maquaire",
    "name": "Stéphane Maquaire",
    "lang": "pt",
    "corpus": "normal",
    "person": "Stéphane Maquaire, CEO of Carrefour Brasil (French national, B3 ticker CRFB3, the Brazilian arm of the French retail group Carrefour). Gives multiple video interviews (CNN Brasil, YouTube channels), featured in InfoMoney \"lições de liderança\" [leadership lessons] pieces, LIDE talks, and Mercado&Consumo interviews. Speaks recurrently and substantively about crisis leadership, corporate governance, and retail strategy in Brazil. NOT any other Stéphane Maquaire.",
    "enumPrompts": [
      {
        "label": "lideranca-crise",
        "prompt": "Enumerate PRIMARY interview/profile content on {{PERSON}}, especially around leadership philosophy and crisis management.\n1. Find the InfoMoney \"lições de liderança\" (or similarly-titled leadership-lessons) piece/interview, and any CNN Brasil video interview, get the fullest version with direct quotes.\n2. Find LIDE talks or events where he spoke, and any Mercado&Consumo interview about retail strategy in Brazil.\n3. Find any interview where he discusses a specific crisis he navigated at Carrefour Brasil (e.g., the 2020 Carrefour Osasco incident/store-death controversy, competitive pressure, integration of Grupo BIG/Walmart Brasil stores acquired in 2022) and his own account of how he handled it.\nReturn exact URLs, priority=high for anything with substantial first-person verbatim content, one-line \"why\" per item. Content may be in Portuguese or English, he is French but operates in Brazil, so expect both."
      },
      {
        "label": "estrategia-carrefour-br",
        "prompt": "Enumerate INTERVIEWS and TALKS by {{PERSON}} about Carrefour Brasil's business strategy.\n1. Find interviews/talks about the 2022 acquisition and integration of Grupo BIG (former Walmart Brasil stores), his own account of that decision and execution.\n2. Find earnings-call transcripts, investor-day talks, or press interviews about digital transformation, cash & carry (Atacadão) strategy, or competitive positioning vs. GPA/Pão de Açúcar and Assaí.\n3. Find any interview specifically about governance reforms or ESG/social-responsibility commitments made under his leadership (particularly any changes made in response to past controversies).\nReturn exact URLs, priority-marked, prioritizing full transcripts or extensive direct quotation over short event-listing pages."
      },
      {
        "label": "criticas",
        "prompt": "Enumerate CRITIQUES and adversarial or complicating material on {{PERSON}}.\n1. Find coverage of the 2020 Carrefour Osasco incident (death of a Black customer in a Carrefour store parking lot, a major public controversy in Brazil) and how his leadership responded, this is likely the single most important critical episode to cover honestly.\n2. Any critique of Carrefour Brasil's financial performance, stock performance (CRFB3), or integration execution after the Grupo BIG acquisition.\n3. Any analyst or press skepticism about strategy, labor practices, or supply-chain governance during his tenure that names him specifically.\nReturn exact URLs, type=critique, 4-8 items, this is a figure where genuine, serious critique exists (the Osasco case); do not soften or omit it."
      }
    ]
  },
  "tom-brown": {
    "slug": "tom-brown",
    "name": "Tom Brown",
    "lang": "en",
    "corpus": "normal",
    "person": "Tom Brown, Co-founder of Anthropic, leading work on pretraining/scaling of Claude models. Previously at OpenAI, where he was lead author of the landmark GPT-3 paper (\"Language Models are Few-Shot Learners,\" 2020) and a key engineer behind the GPT-3 training infrastructure. Earlier in his career worked at Google and at cybersecurity/ML startups. Left OpenAI in 2020/2021 with Dario and Daniela Amodei and others to found Anthropic. Known for engineering-and-scaling-focused public commentary (less policy-oriented than Jack Clark, less broad-strategy-oriented than Dario), talks and interviews specifically about what it takes to train frontier models, why scale matters, and his experience building GPT-3. NOT any unrelated Tom/Thomas Brown (e.g. the NFL quarterback).",
    "enumPrompts": [
      {
        "label": "papers-ensaios",
        "prompt": "Enumerate PRIMARY WRITTEN/AUTHORED material by {{PERSON}}.\n1. Find the GPT-3 paper \"Language Models are Few-Shot Learners\" (arxiv.org), he is lead author; look specifically for any parts of the paper or accompanying commentary (blog posts, Twitter/X threads at the time of release) where his personal framing/voice is identifiable, not just the anonymous multi-author technical text.\n2. Find any blog posts, technical write-ups, or company statements on the Anthropic website (anthropic.com/news) that he personally authored or is the named voice for, related to pretraining, scaling, or model training infrastructure.\n3. Find any of his personal website/blog posts or substantial X/Twitter threads about scaling laws, training infrastructure, or his engineering philosophy.\nReturn exact URLs, priority=high for anything with substantial first-person authored content, one-line \"why\" per item."
      },
      {
        "label": "entrevistas-talks",
        "prompt": "Enumerate LONG-FORM INTERVIEWS, PODCASTS, and TALKS featuring {{PERSON}}.\n1. His appearance on the Lightcone Podcast (~Aug 2025) discussing GPT-3, Claude Code, and scaling.\n2. His fireside chat with Salesforce Ventures (look for a blog post or video covering safety/AGI/LLM techniques).\n3. Video of his \"First Public Talk on GPT-3\" (look on YouTube) or any other early talk about the GPT-3 project specifically.\n4. Any other substantial interview about the decision to leave OpenAI and co-found Anthropic, or about what scaling frontier models actually requires operationally.\nPrioritize sources with full transcripts over short clips. Return exact URLs, priority-marked, one-line \"why\" per item."
      },
      {
        "label": "criticas",
        "prompt": "Enumerate CRITIQUES and adversarial material relevant to {{PERSON}} and his work.\n1. Critiques of the \"scale is all you need\" philosophy associated with GPT-3-style scaling, researchers (e.g. Gary Marcus, Yann LeCun, or others) who argue pure scaling has diminishing returns or that it's not the path to AGI.\n2. Any critique specifically of the GPT-3 paper's methodology, safety sections, or claims (e.g. concerns raised at release about bias, misuse potential, or overstated capability claims).\n3. Any public disagreement between him and other named AI researchers on the value of scale vs. architecture/algorithmic innovation.\nReturn exact URLs, type=critique, 4-8 items, be honest about how substantial vs. thin the critical material is (he is a more behind-the-scenes engineering figure with limited public profile relative to Dario or Sam Altman)."
      }
    ]
  },
  "warren-buffett": {
    "slug": "warren-buffett",
    "name": "Warren Buffett",
    "lang": "en",
    "corpus": "large",
    "person": "Warren Buffett, chairman/CEO of Berkshire Hathaway, the most documented investor alive. Primary corpus: Berkshire Hathaway shareholder letters (1977-2024, all at berkshirehathaway.com/letters/), Buffett Partnership letters (1957-1970), the Berkshire \"Owner's Manual\", annual meeting Q&A (CNBC Warren Buffett Archive has full transcripts/video since 1994), major interviews (CNBC, Charlie Rose, Salomon testimony 1991), \"The Essays of Warren Buffett\" (Cunningham), the 2006 giving pledge and philanthropy letters, and his op-eds (e.g. \"Buy American\" NYT 2008, \"Stop Coddling the Super-Rich\" NYT 2011).",
    "notes": {
      "focus": "The payload is worked examples with numbers: keep every distinct acquisition story, named mistake, and capital-allocation decision as situation, action, verbatim quote, source (letter year). Dedup the abstractions he restates for decades.",
      "attribution": "Distinguish Buffett's words from Munger's. Buffett is among the most misquoted people online: default to skepticism."
    },
    "enumPrompts": [
      {
        "label": "letters-brk",
        "prompt": "Enumerate the Berkshire Hathaway SHAREHOLDER LETTERS of {{PERSON}}\nWalk the canonical index at https://www.berkshirehathaway.com/letters/letters.html and list EVERY letter 1977-2024 with its exact URL (older ones are .html pages like berkshirehathaway.com/letters/1977.html, newer ones are PDFs). Every letter is priority=high EXCEPT: mark as medium the ones that are mostly operational recap years; the classics (1983 goodwill appendix, 1985 textile shutdown, 1988 Coca-Cola, 1989 \"mistakes of the first 25 years\", 1996 owner's manual era, 2001 9/11, 2008 crisis, 2014 50-year anniversary, 2023 Munger tribute, 2024 farewell-era) are all high. Also include the \"An Owner's Manual\" document. Return the complete list, completeness of this index is the whole job."
      },
      {
        "label": "partnership-docs",
        "prompt": "Enumerate OTHER PRIMARY WRITTEN documents of {{PERSON}}\n1. Buffett Partnership letters 1957-1970, find a reliable archive with exact URLs (e.g. the widely-mirrored PDF compilations; oldschoolvalue, rbcpa, or csinvesting mirrors). List them by year or as the compilation document(s).\n2. His op-eds: \"Buy American. I Am.\" (NYT 2008), \"Stop Coddling the Super-Rich\" (NYT 2011), the Giving Pledge letter (2006/2010), the 50th-anniversary \"Berkshire, Past, Present and Future\" (2014), his 2025 announcements if any.\n3. \"The Superinvestors of Graham-and-Doddsville\" (1984 Columbia talk, published text).\n4. Salomon Brothers congressional testimony (1991), transcript source.\n5. \"The Essays of Warren Buffett\" (Cunningham), as a book source for cross-reference.\nReturn exact URLs with priority (Superinvestors, Salomon testimony, partnership letters = high)."
      },
      {
        "label": "audio-video",
        "prompt": "Enumerate AUDIO/VIDEO material of {{PERSON}}\n1. CNBC Warren Buffett Archive (buffett.cnbc.com), annual meeting Q&A transcripts/videos since 1994: list the highest-value sessions (crisis years 2008-2009, 2020 pandemic solo meeting, 2023 post-Munger, 2024-2025 final meetings and CEO-transition announcement) rather than all ~30.\n2. Landmark interviews: CNBC Squawk Box multi-hour interviews, Charlie Rose interviews, the 2017 HBO documentary \"Becoming Warren Buffett\", his university talks (Florida 1998 MBA talk, transcript widely available, high priority).\n3. Podcast/long-form appearances if any.\nPrefer sources with full transcripts. Return exact URLs, 15-25 items, priority-marked."
      },
      {
        "label": "criticas-perfis",
        "prompt": "Enumerate CRITIQUES and third-party material for {{PERSON}}\n1. Serious, sourced critiques: hypocrisy critiques (taxes advocacy vs Berkshire's tax practices, ProPublica 2021), Kraft Heinz write-down, Wells Fargo/board-governance criticism, derivatives \"weapons of mass destruction\" vs his own derivatives book, missing tech/opportunity-cost critiques, succession-opacity criticism, the Sokol/Lubrizol affair, criticism of his silence on political issues. Each with a named outlet URL.\n2. The Snowball (Schroeder) and other biographies, as sources for verified anecdotes.\n3. Profiles with primary quotes not in the letters (Fortune pieces by Carol Loomis, \"Mr. Buffett on the Stock Market\" 1999/2001).\nReturn exact URLs, 15-25 items, critiques marked type=critique."
      }
    ]
  }
}

const SONNET = 'sonnet'
const OPUS = 'opus'
const SOURCE_CAP = 28

// ---------- inputs ----------

const spec = SPECS[args.slug]
if (!spec) throw new Error(`No spec for "${args.slug}". Add pipeline/specs/${args.slug}.json and run \`npm run render\` in pipeline/.`)
if (!args.repoDir || !args.repoDir.startsWith('/')) throw new Error('args.repoDir must be the absolute path of the advisors repo')
const mode = args.mode ?? 'rebuild'
if (mode !== 'create' && mode !== 'rebuild') throw new Error('args.mode must be "create" or "rebuild"')

const date = args.date ?? new Date().toISOString().slice(0, 10)
const repo = args.repoDir.replace(/\/+$/, '')
const notesDir = args.notesDir ?? `${repo}/.build/${spec.slug}`
const dossierPath = `${repo}/advisors/${spec.slug}.md`
const templatePath = `${repo}/reference/persona-template.md`
const voiceGuidePath = `${repo}/reference/voice-guide.md`
const exampleSlug = spec.example ?? (spec.lang === 'pt' ? 'caito-maia' : 'michael-seibel')
const examplePath = `${repo}/advisors/${exampleSlug}.md`
// Prompts append their own punctuation after PERSON, so drop a trailing period.
const PERSON = spec.person.replace(/\.+$/, '')
const fill = (text) => text.replaceAll('{{PERSON}}', PERSON).replaceAll('{{DATE}}', date)

// ---------- per-spec wording ----------

const PT = spec.lang === 'pt'
const LANGUAGE_EXTRACT = PT
  ? 'Most sources are in Portuguese: extract in Portuguese, do not translate at this stage.'
  : 'Sources are expected to be in English.'
const LANGUAGE_QUOTES = PT
  ? 'in the original Portuguese if that is the source language'
  : 'exact wording'
const LANGUAGE_CONVENTION = PT
  ? 'Convention: dossier PROSE is English throughout, but QUOTES stay verbatim in Portuguese followed by a bracketed [translation], e.g. "citação original" [translation].'
  : 'All prose and quotes are in English (no translation-bracket convention needed).'
const LANGUAGE_MATCH = PT ? ' Quotes may be in Portuguese: match the original-language text, not a translation.' : ''

const CORPUS_CALIBRATION = {
  thin: `Read ${examplePath} for STRUCTURE only, not size: ${spec.name} has a genuinely thin public corpus. Do NOT pad sections, invent frameworks, or stretch weak paraphrase into "mental models". An honest, thinner dossier that reflects how little they have said publicly is the correct output; say so in Provenance notes.`,
  normal: `Read ${examplePath} as a calibration example for size and structure: don't inflate for its own sake.`,
  large: `Read ${examplePath} as a calibration example for structure. ${spec.name} has a large corpus (books, letters, or years of essays and long interviews), so a substantial dossier is earned here if the material supports it, but dedup restated abstractions hard.`,
}[spec.corpus]

const ATTRIBUTION = spec.notes?.attribution ? `\nATTRIBUTION CAUTION: ${spec.notes.attribution}` : ''
const FOCUS = spec.notes?.focus ? `\nEXPLICIT PRIORITY: ${spec.notes.focus}` : ''
// Topics a dossier must not cover (a maintainer decision or the subject's request).
// Every phase gets it, so excluded material is never searched for, extracted, or cited.
const EXCLUDE = spec.notes?.exclude
  ? `\nOUT OF SCOPE (hard rule): ${spec.notes.exclude} Do not search for it, extract it, cite it, or mention it, even as a blind spot or provenance note; skip any source whose main subject it is.`
  : ''
const STRAY_NOTES = `If the notes directory is empty or incomplete (known bug: agents sometimes write to "undefined/" relative to their own working directory), look for stray batch-*.md files in ${repo}/undefined/, ~/undefined/, and ~/.advisors/undefined/ before proceeding, and move them into ${notesDir}/.`
const BASELINE = mode === 'rebuild'
  ? `Read the CURRENT dossier at ${dossierPath} first: it is the baseline. This is an EXPANSION: nothing distinct and sourced in it may be lost.`
  : 'This is a from-scratch build: there is no prior dossier.'

const DEFAULT_ENUM_PROMPTS = [
  { label: 'own-writing', prompt: `Enumerate WRITTEN material authored by ${PERSON}: find the canonical index (blog or essay archive, newsletter archive, shareholder letters, books and their excerpts, op-eds) and walk it piece by piece rather than relying on the famous top slice. Return exact URLs, each marked high/medium/low priority by idea density.` },
  { label: 'long-form-spoken', prompt: `Enumerate LONG-FORM SPOKEN material by ${PERSON}: podcast episodes, long interviews, talks, and lectures, preferring pages with full transcripts. Cover different years and venues, not one famous appearance. Return exact URLs, each marked high/medium/low priority.` },
  { label: 'critiques', prompt: `Enumerate serious, sourced CRITIQUES of ${PERSON} and their ideas or decisions (named critics, analysts, journalists, academics), plus documented disagreements with other named thinkers. No gossip or private matters. Return exact URLs, each marked high/medium/low priority.` },
]
const enumPrompts = (spec.enumPrompts ?? DEFAULT_ENUM_PROMPTS).map((p) => ({ label: p.label, prompt: fill(p.prompt) + EXCLUDE }))

// ---------- 1. enumerate ----------

const SOURCES_SCHEMA = {
  type: 'object', required: ['sources'],
  properties: { sources: { type: 'array', items: {
    type: 'object', required: ['title', 'url', 'type', 'priority'],
    properties: {
      title: { type: 'string' },
      url: { type: 'string' },
      type: { type: 'string', description: 'essay|talk|podcast|interview|post|profile|critique|statement|book|paper|letter' },
      priority: { type: 'string', enum: ['high', 'medium', 'low'] },
      why: { type: 'string' },
    } } } },
}

phase('Enumerate')
const enumerated = (await parallel(enumPrompts.map((p) => () =>
  agent(p.prompt, { label: `enumerate:${p.label}`, phase: 'Enumerate', schema: SOURCES_SCHEMA, model: SONNET })
))).filter(Boolean).flatMap((r) => r.sources)

// Same page, different spelling: ignore scheme, a leading www., query, fragment, trailing slash, case.
const normUrl = (u) => u.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/[?#].*$/, '').replace(/\/+$/, '')
const seen = new Set()
const all = []
for (const s of enumerated) {
  const key = normUrl(s.url)
  if (!seen.has(key)) { seen.add(key); all.push(s) }
}
// In a rebuild, sources the dossier already cites are not worth an extraction
// slot: without this, a large corpus spends the whole cap re-reading its own
// baseline and the rebuild adds almost nothing.
let cited = new Set()
if (mode === 'rebuild') {
  const baseline = await agent(`Read the frontmatter of ${dossierPath} and return every URL in its sources[] list, exactly as written. No commentary, no placeholder values.`,
    { label: 'enumerate:baseline-sources', phase: 'Enumerate', model: SONNET,
      schema: { type: 'object', required: ['urls'], properties: { urls: { type: 'array', items: { type: 'string' } } } } })
  cited = new Set(baseline.urls.map(normUrl))
}
const fresh = all.filter((s) => !cited.has(normUrl(s.url)))
const ordered = ['high', 'medium', 'low'].flatMap((p) => fresh.filter((s) => s.priority === p))
const sources = ordered.slice(0, SOURCE_CAP)
log(`${all.length} unique sources enumerated, ${all.length - fresh.length} already cited; processing ${sources.length} (${Math.max(0, fresh.length - SOURCE_CAP)} lowest-priority left out)`)

// ---------- 2. extract ----------

const NBATCH = Math.min(6, Math.max(1, Math.ceil(sources.length / 6)))
const batches = Array.from({ length: NBATCH }, () => [])
sources.forEach((s, i) => batches[i % NBATCH].push(s))

const EXTRACT_SCHEMA = {
  type: 'object', required: ['file', 'covered', 'failed'],
  properties: {
    file: { type: 'string' }, covered: { type: 'integer' },
    failed: { type: 'array', items: { type: 'string' } },
    highlights: { type: 'array', items: { type: 'string' } },
  },
}

phase('Extract')
const extractions = (await parallel(batches.map((batch, i) => () =>
  agent(`You are extracting raw material for a persona dossier of ${PERSON}.
${BASELINE}
Process EACH of these sources (curl -sL --compressed; try a browser user-agent for pages that block plain curl). ${LANGUAGE_EXTRACT}
${JSON.stringify(batch, null, 2)}

For each source extract, with the EXACT URL attached to every item:
(a) VERBATIM quotes: exact wording only inside quotation marks (${LANGUAGE_QUOTES}); otherwise clearly-marked paraphrase
(b) named frameworks/mental models + a worked example of each (the payload: a framework without an example is half-built)
(c) decision heuristics and positions on specific hard-call situations
(d) explicit or implicit disagreements with named thinkers
(e) critiques/blind spots with source${ATTRIBUTION}${FOCUS}${EXCLUDE}
Prioritize NOVELTY: new kinds of situations, not restatements.
IMPORTANT (known bug): write your notes to the FULL ABSOLUTE path ${notesDir}/batch-${i + 1}.md, never a relative path, even if it looks equivalent. Double-check the path is absolute before writing. Return file path, covered count, failed URLs, 3-5 highlights.`,
    { label: `extract:batch-${i + 1}`, phase: 'Extract', schema: EXTRACT_SCHEMA, model: SONNET })
))).filter(Boolean)

const covered = extractions.reduce((sum, e) => sum + e.covered, 0)
const failed = extractions.flatMap((e) => e.failed)
log(`Extraction: ${covered} sources covered, ${failed.length} failed`)

// ---------- 3. synthesize ----------

phase('Synthesize')
const draft = await agent(`Write ${mode === 'rebuild' ? 'a DRAFT rebuild of the' : 'the FIRST DRAFT of a brand-new'} persona dossier for ${PERSON}.
1. ${BASELINE}
2. Read the template at ${templatePath} and the voice guide at ${voiceGuidePath}; follow the section structure EXACTLY, including "Writing for the index (cards)" if present.
3. ${CORPUS_CALIBRATION} ${LANGUAGE_CONVENTION}
4. Read ALL research notes: every .md file in ${notesDir}/ (list the directory first). ${STRAY_NOTES}
5. ${mode === 'rebuild' ? 'OVERWRITE' : 'WRITE'} ${dossierPath} as a complete file: slug: ${spec.slug}, last_updated: ${date}; sources[] = every source actually cited; source_count matches exactly; quote any frontmatter value containing a colon.${mode === 'rebuild' ? ' Keep every existing mental model, heuristic, worked example, and "Where they disagree" row; add new ones.' : ''} Never quote anything the notes don't show verbatim with a URL. Where a section is thin, say so honestly in Provenance notes rather than padding. Write the Summary last.${FOCUS}${ATTRIBUTION}${EXCLUDE}
6. Return: final source_count, the enumerated source URLs NOT cited in the final draft (for the completeness audit downstream), and a 3-4 sentence report. Do NOT return placeholder or example values: every field must reflect this run's real output.`,
  { label: 'synthesize:draft', phase: 'Synthesize', model: SONNET, effort: 'high',
    schema: { type: 'object', required: ['sourceCount', 'unusedSources', 'report'], properties: {
      sourceCount: { type: 'integer' },
      unusedSources: { type: 'array', items: { type: 'string' } },
      report: { type: 'string' },
    } } })

log(`Draft (Sonnet): ${draft.sourceCount} sources cited, ${draft.unusedSources.length} enumerated but unused`)

// ---------- 4. pre-verify ----------

phase('Pre-verify')
const QUOTES_SCHEMA = { type: 'object', required: ['quotes'], properties: { quotes: { type: 'array', maxItems: 24, items: {
  type: 'object', required: ['quote', 'url'], properties: { quote: { type: 'string' }, url: { type: 'string' } },
} } } }
// The picker reads the file itself: relaying ~30 KB of dossier through another
// model's output is slow and can alter the very text being verified.
const quotesToCheck = await agent(`Read the dossier at ${dossierPath} and extract the 15-24 most LOAD-BEARING verbatim quotes (in quotation marks) with the source URL each is attributed to (check sources[] in the frontmatter and inline citations). Prioritize quotes used in Core ideas, Mental models, and Signature quotes. Return each quote in its ORIGINAL language exactly as it appears (do not translate) so it can be string-matched against the raw source. Do NOT return placeholder values.`,
  { label: 'pre-verify:pick-quotes', phase: 'Pre-verify', model: SONNET, schema: QUOTES_SCHEMA })

const VERDICTS_SCHEMA = { type: 'object', required: ['verdicts'], properties: { verdicts: { type: 'array', items: {
  type: 'object', required: ['quote', 'url', 'verdict'], properties: {
    quote: { type: 'string' }, url: { type: 'string' },
    verdict: { type: 'string', enum: ['verified', 'mismatch', 'not_found', 'unreachable'] },
    note: { type: 'string' },
  } } } } }
const chunks = []
for (let i = 0; i < quotesToCheck.quotes.length; i += 5) chunks.push(quotesToCheck.quotes.slice(i, i + 5))
const verdicts = (await parallel(chunks.map((chunk, i) => () =>
  agent(`Verify these quotes attributed to ${spec.name} by fetching the RAW source (\`curl -sL --compressed <url>\` via Bash, grep for a distinctive substring; try a browser user-agent for blocked pages) and string-matching.${LANGUAGE_MATCH} Do NOT trust reader-mode summaries.${ATTRIBUTION} Verdict per quote: verified / mismatch (actual wording and, if different, the actual speaker in note) / not_found / unreachable. This is a preliminary, mechanical check: flag anything uncertain rather than guessing.
${JSON.stringify(chunk, null, 2)}`,
    { label: `pre-verify:batch-${i + 1}`, phase: 'Pre-verify', model: SONNET, schema: VERDICTS_SCHEMA })
))).filter(Boolean).flatMap((r) => r.verdicts)

const flagged = verdicts.filter((v) => v.verdict !== 'verified')
log(`Pre-verify (Sonnet): ${verdicts.length - flagged.length}/${verdicts.length} confirmed; ${flagged.length} flagged for the Opus pass`)

// ---------- 5. consolidate ----------

phase('Consolidate')
const consolidated = await agent(`You are the FINAL, consolidated quality pass on the persona dossier for ${PERSON} at ${dossierPath}. A cheaper model (Sonnet) drafted it from research notes in ${notesDir}/. Your job is NOT just to check quotes: do all three of these and REWRITE THE FILE IN PLACE.

1. **Fidelity.** These quotes were flagged by the preliminary raw-source check:
${JSON.stringify(flagged, null, 2)}
For each: re-read the dossier text around it first (the preliminary check sometimes flags quotes already correctly attributed to a third party, such as an interviewer or co-host; don't "fix" what isn't broken). Then re-verify by fetching the EXACT URL cited (curl -sL --compressed; a different user-agent or web.archive.org if unreachable).${LANGUAGE_MATCH} If the person gave several talks or interviews at the same event or in the same year, try the obvious alternative source before accepting not_found. A WebSearch snippet is NOT verification: if you cite or re-attribute a quote to a URL, you must have fetched THAT URL and found the string there (pages can change content under the same URL). Fix genuine errors: wrong wording to correct wording; wrong attribution to correct attribution or a marked paraphrase; dead source to demote or remove.${ATTRIBUTION}

2. **Completeness audit.** These sources were enumerated but NOT cited in the draft:
${JSON.stringify(draft.unusedSources, null, 2)}
For each, check the research notes in ${notesDir}/ (${STRAY_NOTES}): did the draft skip genuinely novel material? If so, fold it in. Also judge independently whether enumeration walked the person's full canonical index or stopped at the famous top slice; if you spot an obvious gap (a known essay, talk, letter, or interview series), do one targeted search and fetch, and add it only if it is real and citable. ${spec.corpus === 'thin' ? 'This figure has a thin public corpus: an honest, modest source_count is correct; never pad with weak secondary sources.' : 'Do not pad with weak secondary sources just to look thicker.'}${FOCUS}

3. **Depth repair.** Read the whole dossier critically. Where synthesis went shallow (a mental model with no worked example, a generic "Where they disagree" row, a Core idea without a concrete situation), REWRITE that section in place with specific, sourced content from the notes. ${LANGUAGE_CONVENTION}

Rules: never invent a quote; anything in quotation marks must trace to a URL in the notes or one you verified yourself.${EXCLUDE ? ` If the dossier contains any out-of-scope material, remove it and its sources.${EXCLUDE}` : ''} Keep slug, last_updated, and source_count consistent. Edit ${dossierPath} in place (Edit/Write tools).

Return: # quotes fixed, # completeness gaps closed, # sections deepened, final source_count, and a short report. No placeholder values.`,
  { label: 'consolidate:opus', phase: 'Consolidate', model: OPUS, effort: 'high',
    schema: { type: 'object', required: ['quotesFixed', 'completenessGapsClosed', 'sectionsDeepened', 'finalSourceCount', 'report'], properties: {
      quotesFixed: { type: 'integer' }, completenessGapsClosed: { type: 'integer' },
      sectionsDeepened: { type: 'integer' }, finalSourceCount: { type: 'integer' }, report: { type: 'string' },
    } } })

log(`Consolidate (Opus): ${consolidated.quotesFixed} quotes fixed, ${consolidated.completenessGapsClosed} completeness gaps closed, ${consolidated.sectionsDeepened} sections deepened, final source_count ${consolidated.finalSourceCount}`)

return {
  slug: spec.slug,
  mode,
  sourcesEnumerated: all.length,
  sourcesProcessed: sources.length,
  sourcesCovered: covered,
  sourcesFailed: failed,
  draftSourceCount: draft.sourceCount,
  draftReport: draft.report,
  preVerifyFlagged: flagged,
  consolidationReport: consolidated.report,
  quotesFixed: consolidated.quotesFixed,
  completenessGapsClosed: consolidated.completenessGapsClosed,
  sectionsDeepened: consolidated.sectionsDeepened,
  finalSourceCount: consolidated.finalSourceCount,
  dossier: dossierPath,
  next: 'Spot-check 2-4 quotes against their URLs yourself, delete the notes directory, then run `council lint` and `council index` if the council CLI is installed.',
}
