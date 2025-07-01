'use client'

import { useState } from 'react'
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useWoodCalcStore } from '@/lib/store'

interface FormData {
  name: string
  length: number
  width: number
  thickness: number
  quantity: number
  pricePerM3: number
}

const initialFormData: FormData = {
  name: '',
  length: 0,
  width: 0,
  thickness: 0,
  quantity: 1,
  pricePerM3: 0,
}

export default function WoodElementForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isOpen, setIsOpen] = useState(false)
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [lastPricePerM3, setLastPricePerM3] = useState<number>(0)

  const addElement = useWoodCalcStore((state) => state.addElement)

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}

    if (formData.length <= 0) {
      newErrors.length = 1 // używamy liczby jako flag błędu
    }
    if (formData.width <= 0) {
      newErrors.width = 1
    }
    if (formData.thickness <= 0) {
      newErrors.thickness = 1
    }
    if (formData.quantity <= 0) {
      newErrors.quantity = 1
    }
    if (formData.pricePerM3 <= 0) {
      newErrors.pricePerM3 = 1
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Zapamietaj cenę za m³
    setLastPricePerM3(formData.pricePerM3)

    // Dodaj element do store
    addElement({
      name: formData.name || 'Element',
      length: formData.length,
      width: formData.width,
      thickness: formData.thickness,
      quantity: formData.quantity,
      pricePerM3: formData.pricePerM3,
    })

    // Reset formularza z zachowaniem ceny
    setFormData({
      ...initialFormData,
      pricePerM3: formData.pricePerM3, // zachowaj cenę z poprzedniego elementu
    })
    setErrors({})
    setIsOpen(false)
  }

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Usuń błąd dla tego pola jeśli użytkownik wprowadza dane
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }))
    }
  }

  const adjustQuantity = (delta: number) => {
    const newQuantity = Math.max(1, formData.quantity + delta)
    handleInputChange('quantity', newQuantity)
  }

  if (!isOpen) {
    return (
      <div className="p-4">
        <button
          onClick={() => {
            // Jeśli jest zapisana ostatnia cena, użyj jej
            if (lastPricePerM3 > 0 && formData.pricePerM3 === 0) {
              setFormData((prev) => ({ ...prev, pricePerM3: lastPricePerM3 }))
            }
            setIsOpen(true)
          }}
          className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-4 px-6 rounded-lg flex items-center justify-center gap-3 text-lg transition-colors shadow-lg"
          aria-label="Dodaj nowy element drewniany"
        >
          <PlusIcon className="h-6 w-6" />
          Dodaj element
        </button>
      </div>
    )
  }

  return (
    <div className="p-4 bg-secondary rounded-lg border border-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground">Nowy element</h2>
        <button
          onClick={() => {
            setIsOpen(false)
            // Zachowaj cenę przy anulowaniu
            setFormData({
              ...initialFormData,
              pricePerM3: lastPricePerM3 > 0 ? lastPricePerM3 : 0,
            })
            setErrors({})
          }}
          className="p-2 text-muted hover:text-foreground transition-colors"
          aria-label="Zamknij formularz"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nazwa elementu (opcjonalna) */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
            NAZWA ELEMENTU (OPCJONALNA)
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="np. Belka, Deska, Słupek..."
            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-base"
          />
        </div>

        {/* Wymiary - inline layout */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <label
              htmlFor="length"
              className="text-sm font-medium text-foreground w-16 sm:w-20 flex-shrink-0"
            >
              DŁUGOŚĆ:
            </label>
            <input
              id="length"
              type="number"
              step="0.1"
              min="0.1"
              value={formData.length || ''}
              onChange={(e) => handleInputChange('length', parseFloat(e.target.value) || 0)}
              className={`flex-1 px-2 sm:px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-base min-w-0 ${
                errors.length ? 'border-error' : 'border-border'
              }`}
              placeholder="cm"
            />
            {errors.length && <p className="text-error text-sm ml-1">!</p>}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <label
              htmlFor="width"
              className="text-sm font-medium text-foreground w-16 sm:w-20 flex-shrink-0"
            >
              SZEROKOŚĆ:
            </label>
            <input
              id="width"
              type="number"
              step="0.1"
              min="0.1"
              value={formData.width || ''}
              onChange={(e) => handleInputChange('width', parseFloat(e.target.value) || 0)}
              className={`flex-1 px-2 sm:px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-base min-w-0 ${
                errors.width ? 'border-error' : 'border-border'
              }`}
              placeholder="cm"
            />
            {errors.width && <p className="text-error text-sm ml-1">!</p>}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <label
              htmlFor="thickness"
              className="text-sm font-medium text-foreground w-16 sm:w-20 flex-shrink-0"
            >
              GRUBOŚĆ:
            </label>
            <input
              id="thickness"
              type="number"
              step="0.1"
              min="0.1"
              value={formData.thickness || ''}
              onChange={(e) => handleInputChange('thickness', parseFloat(e.target.value) || 0)}
              className={`flex-1 px-2 sm:px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-base min-w-0 ${
                errors.thickness ? 'border-error' : 'border-border'
              }`}
              placeholder="cm"
            />
            {errors.thickness && <p className="text-error text-sm ml-1">!</p>}
          </div>
        </div>

        {/* Ilość z przyciskami +/- */}
        <div className="flex items-center gap-2 sm:gap-3">
          <label
            htmlFor="quantity"
            className="text-sm font-medium text-foreground w-16 sm:w-20 flex-shrink-0"
          >
            ILOŚĆ:
          </label>
          <div className="flex items-stretch flex-1 border border-border rounded-lg overflow-hidden min-h-[44px]">
            <button
              type="button"
              onClick={() => adjustQuantity(-1)}
              className="bg-secondary-dark hover:bg-border text-foreground font-bold text-xl transition-colors w-12 sm:w-14 flex items-center justify-center border-r border-border"
              aria-label="Zmniejsz ilość"
            >
              −
            </button>
            <input
              id="quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
              className="flex-1 px-2 py-2 focus:ring-2 focus:ring-primary focus:outline-none text-base text-center border-0 min-w-0"
            />
            <button
              type="button"
              onClick={() => adjustQuantity(1)}
              className="bg-secondary-dark hover:bg-border text-foreground font-bold text-xl transition-colors w-12 sm:w-14 flex items-center justify-center border-l border-border"
              aria-label="Zwiększ ilość"
            >
              +
            </button>
          </div>
          {errors.quantity && <p className="text-error text-sm ml-1">!</p>}
        </div>

        {/* Cena za m³ */}
        <div className="flex items-center gap-2 sm:gap-3">
          <label
            htmlFor="pricePerM3"
            className="text-sm font-medium text-foreground w-16 sm:w-20 flex-shrink-0"
          >
            CENA/M³:
          </label>
          <input
            id="pricePerM3"
            type="number"
            step="0.01"
            min="0.01"
            value={formData.pricePerM3 || ''}
            onChange={(e) => handleInputChange('pricePerM3', parseFloat(e.target.value) || 0)}
            className={`flex-1 px-2 sm:px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-base min-w-0 ${
              errors.pricePerM3 ? 'border-error' : 'border-border'
            }`}
            placeholder="PLN"
          />
          {errors.pricePerM3 && <p className="text-error text-sm ml-1">!</p>}
        </div>

        {/* Przyciski akcji */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold py-4 px-6 rounded-lg transition-colors text-lg"
          >
            Dodaj element
          </button>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false)
              setFormData({
                ...initialFormData,
                pricePerM3: lastPricePerM3 > 0 ? lastPricePerM3 : 0,
              })
              setErrors({})
            }}
            className="bg-secondary-dark hover:bg-border text-foreground font-semibold py-4 px-6 rounded-lg transition-colors text-lg"
          >
            Anuluj
          </button>
        </div>
      </form>
    </div>
  )
}
