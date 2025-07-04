'use client'

import { CubeIcon } from '@heroicons/react/24/outline'
import { WoodElement } from '@/lib/store'

interface WoodElementCardProps {
  element: WoodElement
}

export default function WoodElementCard({ element }: WoodElementCardProps) {
  // Formatowanie liczb
  const formatVolume = (volume: number) => {
    return volume.toFixed(3).replace('.', ',')
  }

  const formatCost = (cost: number) => {
    return cost.toFixed(2).replace('.', ',')
  }

  const formatDimensions = (length: number, width: number, thickness: number) => {
    return `${length} × ${width} × ${thickness} cm`
  }

  return (
    <div className="bg-white border border-border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Nagłówek karty */}
      <div className="flex items-center gap-2 mb-3">
        <CubeIcon className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground text-lg">{element.name}</h3>
      </div>

      {/* Szczegóły elementu */}
      <div className="space-y-3">
        {/* Wymiary, ilość i cena w jednym wierszu - flex z fixed szerokościami */}
        <div className="flex gap-1 sm:gap-2 text-sm">
          <div className="flex-1 min-w-0 pr-1">
            <span className="text-muted block">Wymiary:</span>
            <div className="font-medium text-foreground truncate">
              {formatDimensions(element.length, element.width, element.thickness)}
            </div>
          </div>
          <div className="w-16 sm:w-20 min-w-0">
            <span className="text-muted block">Ilość:</span>
            <div className="font-medium text-foreground truncate">{element.quantity} szt.</div>
          </div>
          <div className="w-20 sm:w-24 min-w-0">
            <span className="text-muted block">Cena/m³:</span>
            <div className="font-medium text-foreground truncate">
              {formatCost(element.pricePerM3)} PLN
            </div>
          </div>
        </div>

        {/* Separator */}
        <hr className="border-border" />

        {/* Obliczenia */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-secondary rounded-lg">
            <div className="text-lg font-bold text-primary">{formatVolume(element.volume)} m³</div>
            <div className="text-sm text-muted">Objętość</div>
          </div>
          <div className="text-center p-3 bg-primary-light/10 rounded-lg">
            <div className="text-lg font-bold text-primary-dark">
              {formatCost(element.totalCost)} PLN
            </div>
            <div className="text-sm text-muted">Koszt</div>
          </div>
        </div>

        {/* Dodatkowe informacje */}
        <div className="text-xs text-muted bg-secondary/50 p-2 rounded">
          <div>Objętość jednostkowa: {formatVolume(element.volume / element.quantity)} m³/szt.</div>
          <div>Koszt jednostkowy: {formatCost(element.totalCost / element.quantity)} PLN/szt.</div>
        </div>
      </div>
    </div>
  )
}

// Komponent dla pustej listy
export function EmptyElementsList() {
  return (
    <div className="text-center py-12 px-4">
      <CubeIcon className="h-16 w-16 text-muted mx-auto mb-4" />
      <h3 className="text-lg font-medium text-foreground mb-2">Brak elementów w projekcie</h3>
      <p className="text-muted max-w-sm mx-auto">
        Dodaj pierwszy element drewniany, aby rozpocząć obliczenia objętości i kosztów.
      </p>
    </div>
  )
}
