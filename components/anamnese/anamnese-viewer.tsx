'use client'

import { AnamnesisFormBuilder, type AnamnesisTemplate } from './form-builder'

interface AnamneseViewerProps {
  template: AnamnesisTemplate
  initialValues: Record<string, unknown>
}

export function AnamneseViewer({ template, initialValues }: AnamneseViewerProps) {
  return (
    <AnamnesisFormBuilder
      template={template}
      onSubmit={async () => {}}
      readOnly
      initialValues={initialValues}
    />
  )
}
