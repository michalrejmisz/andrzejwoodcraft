'use client'

import { useWoodCalcStore } from '@/lib/store'

export default function ProjectSummary() {
  const currentProject = useWoodCalcStore((state) => state.currentProject)

  // Nie renderuj gdy brak elementów
  if (!currentProject || currentProject.elements.length === 0) {
    return null
  }

  // Formatowanie liczb
  const formatVolume = (volume: number) => {
    return volume.toFixed(3).replace('.', ',')
  }

  const formatCost = (cost: number) => {
    return cost.toFixed(2).replace('.', ',')
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-lg z-10">
      {/* Kompaktowe podsumowanie */}
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2 bg-secondary rounded">
            <div className="text-sm font-bold text-foreground">
              {currentProject.elements.length}
            </div>
            <div className="text-xs text-muted">Elementów</div>
          </div>

          <div className="text-center p-2 bg-primary/10 rounded">
            <div className="text-sm font-bold text-primary">
              {formatVolume(currentProject.totalVolume)} m³
            </div>
            <div className="text-xs text-muted">Objętość</div>
          </div>

          <div className="text-center p-2 bg-success/10 rounded">
            <div className="text-sm font-bold text-success">
              {formatCost(currentProject.totalCost)} PLN
            </div>
            <div className="text-xs text-muted">Koszt</div>
          </div>
        </div>
      </div>
    </div>
  )
}
