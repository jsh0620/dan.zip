import React, { useState, useMemo } from 'react'
import {
  Search, X, MapPin, Clock, Phone, ExternalLink,
  ChevronLeft, Grid, Utensils, Coffee, Pill, Sparkles, Star,
} from 'lucide-react'
import { COLLEGES, CATEGORIES, STORES } from './data/mockData.js'

const ICON_MAP = { Grid, Utensils, Coffee, Pill, Sparkles }

// ══════════════════════════════════════════
//  StoreCard
// ══════════════════════════════════════════
function StoreCard({ store, onSelect }) {
  const catLabel = CATEGORIES.find(c => c.id === store.category)?.label ?? ''
  const Icon = ICON_MAP[CATEGORIES.find(c => c.id === store.category)?.icon] ?? Utensils

  return (
    <div
      className="bg-white rounded-2xl border border-orange-100 p-4 active:scale-[0.98] transition-transform cursor-pointer shadow-sm"
      onClick={() => onSelect(store)}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
          <Icon size={18} className="text-orange-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 text-base leading-tight truncate">{store.name}</p>
          <p className="text-xs text-orange-400 mt-0.5">{catLabel}</p>
        </div>
      </div>

      <div className="mt-3 bg-orange-50 rounded-xl px-3 py-2.5">
        <p className="text-sm font-semibold text-orange-700">🎁 {store.benefit}</p>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
        <span className="flex items-center gap-1"><MapPin size={11} />{store.address}</span>
        <span className="flex items-center gap-1"><Clock size={11} />{store.hours}</span>
      </div>

      {store.tags?.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {store.tags.map(tag => (
            <span key={tag} className="text-xs bg-orange-50 text-orange-400 px-2 py-0.5 rounded-full">#{tag}</span>
          ))}
        </div>
      )}
    </div>
  )
}

// ══════════════════════════════════════════
//  InfoRow
// ══════════════════════════════════════════
function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <span className="text-orange-400">{icon}</span>
      <span className="text-sm text-gray-400 w-16 shrink-0">{label}</span>
      <span className="text-sm text-gray-800 font-medium flex-1">{value}</span>
    </div>
  )
}

// ══════════════════════════════════════════
//  StoreDetail
// ══════════════════════════════════════════
function StoreDetail({ store, onBack }) {
  const catLabel = CATEGORIES.find(c => c.id === store.category)?.label ?? ''

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="bg-orange-400 px-4 pt-12 pb-6">
        <button
          className="flex items-center gap-1 text-orange-100 text-sm mb-4 active:opacity-70"
          onClick={onBack}
        >
          <ChevronLeft size={18} />
          목록으로
        </button>
        <p className="text-orange-100 text-xs mb-1">{catLabel}</p>
        <h1 className="text-2xl font-extrabold text-white">{store.name}</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 bg-orange-50/30">
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4">
          <p className="text-xs text-orange-400 font-medium mb-1">제휴 혜택</p>
          <p className="text-base font-bold text-orange-700">🎁 {store.benefit}</p>
        </div>

        <div className="bg-white rounded-2xl divide-y divide-orange-50 overflow-hidden border border-orange-100">
          <InfoRow icon={<MapPin size={16} />} label="위치" value={store.address} />
          <InfoRow icon={<Clock size={16} />} label="운영시간" value={store.hours} />
          <InfoRow icon={<Phone size={16} />} label="전화" value={store.phone} />
        </div>

        <a
          href={store.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-orange-400 text-white font-semibold text-sm active:scale-[0.98] transition-transform"
        >
          <MapPin size={16} />
          지도에서 위치 보기
          <ExternalLink size={13} />
        </a>

        {store.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {store.tags.map(tag => (
              <span key={tag} className="text-sm bg-orange-50 text-orange-500 px-3 py-1 rounded-full border border-orange-100">#{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════
//  MainScreen
// ══════════════════════════════════════════
function MainScreen({ onSelectStore }) {
  const [selectedColleges, setSelectedColleges] = useState(['all'])
  const [selectedCats, setSelectedCats] = useState(['all'])
  const [query, setQuery] = useState('')

  const toggleCollege = (id) => {
    if (id === 'all') { setSelectedColleges(['all']); return }
    setSelectedColleges(prev => {
      const without = prev.filter(c => c !== 'all')
      if (without.includes(id)) {
        const next = without.filter(c => c !== id)
        return next.length === 0 ? ['all'] : next
      }
      return [...without, id]
    })
  }

  const toggleCat = (id) => {
    if (id === 'all') { setSelectedCats(['all']); return }
    setSelectedCats(prev => {
      const without = prev.filter(c => c !== 'all')
      if (without.includes(id)) {
        const next = without.filter(c => c !== id)
        return next.length === 0 ? ['all'] : next
      }
      return [...without, id]
    })
  }

  const filtered = useMemo(() => {
    return STORES.filter(s => {
      const matchCollege =
        selectedColleges.includes('all') ||
        s.colleges.includes('all') ||
        selectedColleges.some(sc => s.colleges.includes(sc))
      const matchCat =
        selectedCats.includes('all') ||
        selectedCats.includes(s.category)
      const q = query.trim().toLowerCase()
      const matchQuery =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.benefit.toLowerCase().includes(q) ||
        s.tags?.some(t => t.includes(q))
      return matchCollege && matchCat && matchQuery
    })
  }, [selectedColleges, selectedCats, query])

  return (
    <div className="flex flex-col h-full">
      {/* ── 고정 헤더 ── */}
      <div className="bg-white border-b border-orange-100 px-4 pt-12 pb-3 space-y-3">
        {/* 타이틀 */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">단대<span className="text-orange-400">.zip</span></h1>
            <p className="text-xs text-gray-400 mt-0.5">가천대학교 단과대 제휴 혜택</p>
          </div>
          {/* 선택된 필터 뱃지 미리보기 */}
          <p className="text-xs text-orange-400 font-semibold pb-0.5">
            {filtered.length}개 업체
          </p>
        </div>

        {/* 검색창 */}
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-300" />
          <input
            type="search"
            placeholder="가게명 검색"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-orange-50 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-orange-200 border border-orange-100"
          />
          {query && (
            <button className="absolute right-3 top-1/2 -translate-y-1/2" onClick={() => setQuery('')}>
              <X size={13} className="text-gray-400" />
            </button>
          )}
        </div>

        {/* 단과대 필터 */}
        <div>
          <p className="text-xs font-semibold text-gray-400 mb-2">단과대</p>
          <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
            {COLLEGES.map(c => {
              const isActive = selectedColleges.includes(c.id)
              return (
                <button
                  key={c.id}
                  onClick={() => toggleCollege(c.id)}
                  className={`whitespace-nowrap text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all shrink-0
                    ${isActive
                      ? 'bg-orange-400 text-white border-orange-400'
                      : 'bg-white text-gray-500 border-gray-200'}`}
                >
                  {c.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* 카테고리 필터 */}
        <div>
          <p className="text-xs font-semibold text-gray-400 mb-2">카테고리</p>
          <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
            {CATEGORIES.map(c => {
              const Icon = ICON_MAP[c.icon]
              const isActive = selectedCats.includes(c.id)
              return (
                <button
                  key={c.id}
                  onClick={() => toggleCat(c.id)}
                  className={`flex items-center gap-1 whitespace-nowrap text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all shrink-0
                    ${isActive
                      ? 'bg-orange-100 text-orange-600 border-orange-200'
                      : 'bg-white text-gray-500 border-gray-200'}`}
                >
                  {Icon && <Icon size={12} />}{c.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── 결과 목록 ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-orange-50/40">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Star size={36} className="mb-3 opacity-20" />
            <p className="text-sm">해당하는 제휴 업체가 없어요</p>
          </div>
        ) : (
          filtered.map(store => (
            <StoreCard
              key={store.id}
              store={store}
              onSelect={onSelectStore}
            />
          ))
        )}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════
//  App
// ══════════════════════════════════════════
export default function App() {
  const [selectedStore, setSelectedStore] = useState(null)

  if (selectedStore) {
    return (
      <div className="flex flex-col h-screen max-w-md mx-auto overflow-hidden bg-white">
        <StoreDetail
          store={selectedStore}
          onBack={() => setSelectedStore(null)}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto overflow-hidden bg-white">
      <MainScreen onSelectStore={setSelectedStore} />
    </div>
  )
}