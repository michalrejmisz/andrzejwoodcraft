'use client'

import { useEffect } from 'react'
import { CubeIcon } from '@heroicons/react/24/outline'
import { useWoodCalcStore } from '@/lib/store'
import WoodElementForm from '@/components/WoodElementForm'
import WoodElementCard, { EmptyElementsList } from '@/components/WoodElementCard'
import ProjectSummary from '@/components/ProjectSummary'

export default function Home() {
  const currentProject = useWoodCalcStore((state) => state.currentProject)
  const createNewProject = useWoodCalcStore((state) => state.createNewProject)

  // Automatycznie utwórz nowy projekt jeśli nie istnieje
  useEffect(() => {
    if (!currentProject) {
      createNewProject('Mój projekt')
    }
  }, [currentProject, createNewProject])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <CubeIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary">Warsztat Andrzeja</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-6 pb-32">
        {/* Formularz dodawania */}
        <section className="mb-8">
          <WoodElementForm />
        </section>

        {/* Lista elementów */}
        <section className="mb-8">
          {currentProject && currentProject.elements.length > 0 ? (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-foreground mb-4">Elementy projektu</h2>
              {currentProject.elements.map((element) => (
                <WoodElementCard key={element.id} element={element} />
              ))}
            </div>
          ) : (
            <EmptyElementsList />
          )}
        </section>
      </main>

      {/* Sticky footer z podsumowaniem */}
      <ProjectSummary />
    </div>
  )
}
