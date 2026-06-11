const mediaModules = import.meta.glob<string>(
  '@/projetos/**/*.{jpeg,jpg,png,mp4}',
  { eager: true, query: '?url', import: 'default' },
)

export const homeLogo = new URL('../projetos/home_logo.png', import.meta.url).href
export const founderPhoto = new URL('../projetos/EulerProprietario2.png', import.meta.url).href

export interface PortfolioProject {
  id: string
  name: string
  category: string
  legend?: string
  cover: string
  media: { src: string; type: 'image' | 'video'; alt: string }[]
}

const projectMeta: Record<string, { name: string; category: string; legend?: string }> = {
  CasaReserva: {
    name: 'Casa Reserva',
    category: 'Residencial',
    legend:
      'Projeto de Iluminação de Fachada, Fornecimento e Acompanhamento Técnico Realizada em um imóvel localizado na Reserva Camboriú Golf Club.',
  },
  CiaMaritima: {
    name: 'Cia Marítima',
    category: 'Comercial',
    legend:
      'Projeto de Iluminação, Fornecimento e Acompanhamento Técnico Realizado à Loja de Moda: Cia Marítima.',
  },
  Joalheria: {
    name: 'Joalheria',
    category: 'Comercial',
    legend: 'Fornecimento de Soluções de Iluminação à Joalheira Boiko.',
  },
  Lotisa: {
    name: 'Lotisa',
    category: 'Comercial',
    legend:
      'Projeto de Iluminação de Fachada Realizada aos Prédios da Lotisa: Art Tower e Vista Mare.',
  },
  LustreSenna: {
    name: 'Lustre Senna Tower',
    category: 'Residencial',
    legend:
      'Acompanhamento de Projeto, Fornecimento de Iluminação e Montagem de Pendente exclusivo assinado por @lalalisenna.',
  },
  PlantaoDeVendas: { name: 'Plantão de Vendas', category: 'Comercial' },
  Ratimbum: { name: 'Ratimbum', category: 'Comercial' },
  YatchHouse: { name: 'Yacht House', category: 'Residencial' },
}

const skipPaths = ['home_logo', 'EulerProprietario', 'homestudiopdf']

function sortMedia(media: { src: string; type: 'image' | 'video'; alt: string }[]) {
  return [...media].sort((a, b) => {
    const score = (item: typeof a) => {
      if (/fachada/i.test(item.alt)) return 0
      if (/logo/i.test(item.alt)) return 1
      if (item.type === 'video') return 3
      return 2
    }
    return score(a) - score(b) || a.alt.localeCompare(b.alt, 'pt-BR')
  })
}

function pickCover(media: { src: string; type: 'image' | 'video'; alt: string }[]) {
  const images = media.filter((m) => m.type === 'image')
  return (
    images.find((m) => /fachada/i.test(m.alt))?.src ??
    images.find((m) => /logo/i.test(m.alt))?.src ??
    images[0]?.src ??
    media[0].src
  )
}

function buildProjects(): PortfolioProject[] {
  const grouped = new Map<string, { src: string; type: 'image' | 'video'; alt: string }[]>()

  for (const [path, src] of Object.entries(mediaModules)) {
    if (skipPaths.some((skip) => path.includes(skip))) continue

    const parts = path.split('/')
    const folder = parts[parts.length - 2]
    const filename = parts[parts.length - 1]
    const isVideo = filename.endsWith('.mp4')

    if (!grouped.has(folder)) grouped.set(folder, [])

    const meta = projectMeta[folder]
    grouped.get(folder)!.push({
      src,
      type: isVideo ? 'video' : 'image',
      alt: meta ? `${meta.name} — ${filename.replace(/\.[^.]+$/, '')}` : filename,
    })
  }

  const projects: PortfolioProject[] = []

  for (const [folder, media] of grouped) {
    const meta = projectMeta[folder]
    if (!meta || media.length === 0) continue

    const sortedMedia = sortMedia(media)

    projects.push({
      id: folder.toLowerCase(),
      name: meta.name,
      category: meta.category,
      legend: meta.legend,
      cover: pickCover(sortedMedia),
      media: sortedMedia,
    })
  }

  return projects.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
}

export const projects = buildProjects()
