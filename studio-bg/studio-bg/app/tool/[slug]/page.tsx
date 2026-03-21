import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getTool, getAllSlugs } from '@/lib/tools'
import type { ToolSlug } from '@/lib/types'
import Studio from '@/components/studio/Studio'

interface Props {
  params: { slug: string }
}

// Tell Next.js which pages to pre-render at build time
export function generateStaticParams() {
  return getAllSlugs().map(slug => ({ slug }))
}

// Unique SEO metadata per tool page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tool = getTool(params.slug as ToolSlug)
  if (!tool) return { title: 'Not Found' }

  const title = `${tool.name} Generator — Free Online Tool`
  const description = `Free ${tool.name} background generator. ${tool.description}. Download PNG, JPEG, WebP instantly. No signup required.`

  return {
    title,
    description,
    keywords: [...tool.tags, 'background generator', 'free', 'download', 'online'].join(', '),
    openGraph: {
      title,
      description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default function ToolPage({ params }: Props) {
  const tool = getTool(params.slug as ToolSlug)
  if (!tool) notFound()

  return <Studio initialTool={params.slug as ToolSlug} />
}
