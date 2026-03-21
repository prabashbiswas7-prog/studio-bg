'use client'

interface Props {
  placement: 'banner' | 'sidebar' | 'interstitial'
  style?: React.CSSProperties
}

export default function AdSlot({ placement, style }: Props) {
  const heights: Record<string, number> = {
    banner: 60,
    sidebar: 120,
    interstitial: 200,
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderTop: '1px solid var(--b1)',
        padding: '8px 12px',
        minHeight: heights[placement],
        ...style,
      }}
    >
      {/* AD PLACEMENT — replace this div with your actual ad tag */}
      {/* For Google AdSense: paste your <ins class="adsbygoogle"> tag here */}
      {/* For any other network: paste your ad script/tag here */}
      <div
        data-ad-placement={placement}
        style={{
          width: '100%',
          minHeight: heights[placement] - 16,
          border: '1px dashed var(--b2)',
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 10,
          color: 'var(--t3)',
          fontFamily: 'var(--font-mono)',
        }}
      />
      {/* END AD */}
    </div>
  )
}
