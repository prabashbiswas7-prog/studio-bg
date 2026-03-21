import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getTool, getAllSlugs } from '@/lib/tools'
import type { ToolSlug } from '@/lib/types'
import Studio from '@/components/studio/Studio'

interface Props {
  params: { slug: string }
}

export function generateStaticParams() {
  return getAllSlugs().map(slug => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tool = getTool(params.slug as ToolSlug)
  if (!tool) return { title: 'Not Found' }
  return {
    title: `${tool.name} Generator — Free Online Tool`,
    description: `Free ${tool.name} background generator. ${tool.description}. Download PNG, JPEG, WebP instantly. No signup required.`,
    keywords: [...tool.tags, 'background generator', 'free', 'download'].join(', '),
  }
}

export default function ToolPage({ params }: Props) {
  const tool = getTool(params.slug as ToolSlug)
  if (!tool) notFound()
  return <Studio initialTool={params.slug as ToolSlug} />
}
