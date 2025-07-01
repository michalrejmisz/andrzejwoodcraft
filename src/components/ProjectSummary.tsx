'use client'

import { useState } from 'react'
import {
  ShareIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  CubeIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import { toPng } from 'html-to-image'
import { useWoodCalcStore } from '@/lib/store'

export default function ProjectSummary() {
  const [isExporting, setIsExporting] = useState(false)
  const currentProject = useWoodCalcStore((state) => state.currentProject)
  const clearAllElements = useWoodCalcStore((state) => state.clearAllElements)

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

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return new Intl.DateTimeFormat('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(dateObj)
  }

  // Funkcja eksportu do PNG
  const handleExport = async () => {
    setIsExporting(true)

    try {
      // Znajdź element do eksportu (dodamy id dla tej sekcji)
      const summaryElement = document.getElementById('project-summary-export')

      if (!summaryElement) {
        throw new Error('Nie można znaleźć elementu do eksportu')
      }

      // Wygeneruj PNG
      const dataUrl = await toPng(summaryElement, {
        quality: 1.0,
        backgroundColor: '#ffffff',
        width: 400,
        height: 300,
        style: {
          padding: '20px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        },
      })

      // Pobierz plik
      const link = document.createElement('a')
      link.download = `woodcalc-${currentProject.name}-${new Date().toISOString().split('T')[0]}.png`
      link.href = dataUrl
      link.click()

      // Jeśli dostępne Web Share API, użyj go
      if (navigator.share && navigator.canShare) {
        // Konwertuj data URL na blob
        const response = await fetch(dataUrl)
        const blob = await response.blob()
        const file = new File([blob], `woodcalc-${currentProject.name}.png`, { type: 'image/png' })

        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'WoodCalc - Podsumowanie projektu',
            text: `Projekt: ${currentProject.name}`,
            files: [file],
          })
        }
      }
    } catch (error) {
      console.error('Błąd podczas eksportu:', error)
      alert('Nie udało się wyeksportować pliku. Spróbuj ponownie.')
    } finally {
      setIsExporting(false)
    }
  }

  const handleClearAll = () => {
    if (confirm('Czy na pewno chcesz usunąć wszystkie elementy z projektu?')) {
      clearAllElements()
    }
  }

  return (
    <div className="sticky bottom-0 bg-white border-t-2 border-primary shadow-lg">
      {/* Element do eksportu - ukryty podczas normalnego wyświetlania */}
      <div
        id="project-summary-export"
        className="absolute -top-[9999px] left-0 bg-white p-6 rounded-lg shadow-lg"
        style={{ width: '400px' }}
      >
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-primary mb-2">WoodCalc</h1>
          <h2 className="text-lg font-semibold text-gray-800">{currentProject.name}</h2>
          <p className="text-sm text-gray-600">{formatDate(currentProject.updatedAt)}</p>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <span className="font-medium">Elementy:</span>
            <span className="font-bold">{currentProject.elements.length} szt.</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
            <span className="font-medium">Łączna objętość:</span>
            <span className="font-bold text-blue-700">
              {formatVolume(currentProject.totalVolume)} m³
            </span>
          </div>

          <div className="flex justify-between items-center p-3 bg-green-50 rounded">
            <span className="font-medium">Łączny koszt:</span>
            <span className="font-bold text-green-700">
              {formatCost(currentProject.totalCost)} PLN
            </span>
          </div>
        </div>

        <div className="text-center mt-4 text-xs text-gray-500">Wygenerowano przez WoodCalc</div>
      </div>

      {/* Widoczne podsumowanie */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-muted" />
            <span className="text-sm text-muted">
              Zaktualizowano: {formatDate(currentProject.updatedAt)}
            </span>
          </div>
          <button
            onClick={handleClearAll}
            className="p-2 text-muted hover:text-error hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Usuń wszystkie elementy"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Główne statystyki */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 bg-secondary rounded-lg">
            <CubeIcon className="h-6 w-6 mx-auto mb-1 text-muted" />
            <div className="text-lg font-bold text-foreground">
              {currentProject.elements.length}
            </div>
            <div className="text-sm text-muted">Elementów</div>
          </div>

          <div className="text-center p-3 bg-primary/10 rounded-lg">
            <div className="text-lg font-bold text-primary">
              {formatVolume(currentProject.totalVolume)} m³
            </div>
            <div className="text-sm text-muted">Objętość</div>
          </div>

          <div className="text-center p-3 bg-success/10 rounded-lg">
            <CurrencyDollarIcon className="h-6 w-6 mx-auto mb-1 text-success" />
            <div className="text-lg font-bold text-success">
              {formatCost(currentProject.totalCost)} PLN
            </div>
            <div className="text-sm text-muted">Koszt</div>
          </div>
        </div>

        {/* Przycisk eksportu */}
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="w-full bg-primary hover:bg-primary-dark disabled:bg-muted text-white font-semibold py-4 px-6 rounded-lg flex items-center justify-center gap-3 text-lg transition-colors"
          aria-label="Wyeksportuj podsumowanie jako obraz"
        >
          <ShareIcon className="h-6 w-6" />
          {isExporting ? 'Eksportowanie...' : 'Eksportuj jako obraz'}
        </button>
      </div>
    </div>
  )
}
