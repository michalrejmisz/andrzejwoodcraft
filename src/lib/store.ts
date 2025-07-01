import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Typ dla elementu drewnianego
export interface WoodElement {
  id: string
  name: string // nazwa elementu (opcjonalna)
  length: number // długość w cm
  width: number // szerokość w cm
  thickness: number // grubość w cm
  quantity: number // ilość sztuk
  pricePerM3: number // cena za m³ w PLN
  volume: number // obliczona objętość w m³
  totalCost: number // obliczony koszt całkowity w PLN
  createdAt: Date
}

// Typ dla projektu
export interface Project {
  id: string
  name: string
  elements: WoodElement[]
  totalVolume: number
  totalCost: number
  createdAt: Date
  updatedAt: Date
}

// Typ dla stanu aplikacji
interface WoodCalcStore {
  // Aktualny projekt
  currentProject: Project | null
  
  // Funkcje do zarządzania elementami
  addElement: (element: Omit<WoodElement, 'id' | 'volume' | 'totalCost' | 'createdAt'>) => void
  removeElement: (elementId: string) => void
  updateElement: (elementId: string, updates: Partial<WoodElement>) => void
  
  // Funkcje do zarządzania projektem
  createNewProject: (name?: string) => void
  saveProject: (projectId: string) => void
  loadProject: (projectId: string) => void
  
  // Funkcje pomocnicze
  calculateTotals: () => { totalVolume: number; totalCost: number }
  clearAllElements: () => void
}

// Funkcja do obliczania objętości i kosztu elementu
export const calculateElementValues = (element: Omit<WoodElement, 'id' | 'volume' | 'totalCost' | 'createdAt'>): { volume: number; totalCost: number } => {
  // Formuła z PRD: objętość [m³] = (długość × szerokość × grubość) / 1,000,000 × ilość_sztuk
  const volume = (element.length * element.width * element.thickness) / 1_000_000 * element.quantity
  const totalCost = volume * element.pricePerM3
  
  return {
    volume: Math.round(volume * 1000) / 1000, // zaokrąglenie do 3 miejsc po przecinku
    totalCost: Math.round(totalCost * 100) / 100 // zaokrąglenie do 2 miejsc po przecinku
  }
}

// Funkcja do przeliczania sum projektu
const recalculateProjectTotals = (elements: WoodElement[]): { totalVolume: number; totalCost: number } => {
  const totals = elements.reduce(
    (acc, el) => ({
      totalVolume: acc.totalVolume + el.volume,
      totalCost: acc.totalCost + el.totalCost,
    }),
    { totalVolume: 0, totalCost: 0 }
  )
  
  return {
    totalVolume: Math.round(totals.totalVolume * 1000) / 1000,
    totalCost: Math.round(totals.totalCost * 100) / 100
  }
}

// Tworzenie store z persystencją w localStorage
export const useWoodCalcStore = create<WoodCalcStore>()(
  persist(
    (set, get) => ({
      currentProject: null,
      
      addElement: (elementData) => {
        const calculated = calculateElementValues(elementData)
        const newElement: WoodElement = {
          ...elementData,
          id: crypto.randomUUID(),
          volume: calculated.volume,
          totalCost: calculated.totalCost,
          createdAt: new Date(),
        }
        
        set((state) => {
          const currentProject = state.currentProject
          if (!currentProject) {
            // Utwórz nowy projekt jeśli nie istnieje
            const newProject: Project = {
              id: crypto.randomUUID(),
              name: 'Nowy projekt',
              elements: [newElement],
              totalVolume: calculated.volume,
              totalCost: calculated.totalCost,
              createdAt: new Date(),
              updatedAt: new Date(),
            }
            return { currentProject: newProject }
          }
          
          const updatedElements = [...currentProject.elements, newElement]
          const totals = recalculateProjectTotals(updatedElements)
          
          return {
            currentProject: {
              ...currentProject,
              elements: updatedElements,
              totalVolume: totals.totalVolume,
              totalCost: totals.totalCost,
              updatedAt: new Date(),
            }
          }
        })
      },
      
      removeElement: (elementId) => {
        set((state) => {
          if (!state.currentProject) return state
          
          const updatedElements = state.currentProject.elements.filter(el => el.id !== elementId)
          const totals = recalculateProjectTotals(updatedElements)
          
          return {
            currentProject: {
              ...state.currentProject,
              elements: updatedElements,
              totalVolume: totals.totalVolume,
              totalCost: totals.totalCost,
              updatedAt: new Date(),
            }
          }
        })
      },
      
      updateElement: (elementId, updates) => {
        set((state) => {
          if (!state.currentProject) return state
          
          const updatedElements = state.currentProject.elements.map(el => {
            if (el.id === elementId) {
              const updatedElement = { ...el, ...updates }
              const calculated = calculateElementValues(updatedElement)
              return {
                ...updatedElement,
                volume: calculated.volume,
                totalCost: calculated.totalCost,
              }
            }
            return el
          })
          
          const totals = recalculateProjectTotals(updatedElements)
          
          return {
            currentProject: {
              ...state.currentProject,
              elements: updatedElements,
              totalVolume: totals.totalVolume,
              totalCost: totals.totalCost,
              updatedAt: new Date(),
            }
          }
        })
      },
      
      createNewProject: (name = 'Nowy projekt') => {
        const newProject: Project = {
          id: crypto.randomUUID(),
          name,
          elements: [],
          totalVolume: 0,
          totalCost: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        set({ currentProject: newProject })
      },
      
      saveProject: (projectId) => {
        // W MVP zapisujemy tylko aktualny projekt
        // W przyszłości można dodać zapisywanie wielu projektów
        console.log(projectId)
      },
    
      loadProject: (projectId) => {
        // W MVP tylko jeden projekt, więc nie implementujemy
        // W przyszłości można dodać ładowanie konkretnego projektu
        console.log(projectId)
    },
      
      calculateTotals: () => {
        const state = get()
        if (!state.currentProject) return { totalVolume: 0, totalCost: 0 }
        
        return recalculateProjectTotals(state.currentProject.elements)
      },
      
      clearAllElements: () => {
        set((state) => {
          if (!state.currentProject) return state
          
          return {
            currentProject: {
              ...state.currentProject,
              elements: [],
              totalVolume: 0,
              totalCost: 0,
              updatedAt: new Date(),
            }
          }
        })
      },
    }),
    {
      name: 'woodcalc-storage', // klucz w localStorage
    }
  )
) 