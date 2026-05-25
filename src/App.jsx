import React, { useState, useEffect, useMemo } from 'react'
import {
  Search, X, MapPin, Clock, Phone, ExternalLink,
  ChevronLeft, Grid, Utensils, Coffee, Pill, Sparkles, Star, Loader2,
} from 'lucide-react'
import { supabase } from './lib/supabase.js'

// ── 단과대 / 카테고리 (정적 — 코드만 바뀜) ──
const COLLEGES = [
  { id: 'all',    label: '전체' },
  { id: 'gria',   label: '가리아' },
  { id: 'biz',    label: '경영대' },
  { id: 'social', label: '사과대' },
  { id: 'ai',     label: 'AI인문대' },
  { id: 'law',    label: '법대' },
  { id: 'eng',    label: '공대' },
  { id: 'bio',    label: '바나대' },
  { id: 'semi',   label: '반도체대' },
  { id: 'it',     label: 'IT융합대' },
  { id: 'korean', label: '한의대' },
  { id: 'arts',   label: '예체대' },
]

const CATEGORIES = [
  { id: 'all',      label: '전체',     icon: 'Grid' },
  { id: 'food',     label: '식당',     icon: 'Utensils' },
  { id: 'cafe',     label: '카페',     icon: 'Coffee' },
  { id: 'pharmacy', label: '약국/의료', icon: 'Pill' },
  { id: 'beauty',   label: '뷰티/기타', icon: 'Sparkles' },
]

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
        <span className="flex items-center gap-1"><MapPin size={11} />{store.address_short}</span>
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
function InfoRow({ icon, label, value, href }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <span className="text-orange-400">{icon}</span>
      <span className="text-sm text-gray-400 w-16 shrink-0">{label}</span>
      {href
        ? <a href={href} className="text-sm text-orange-500 font-medium flex-1 underline underline-offset-2">{value}</a>
        : <span className="text-sm text-gray-800 font-medium flex-1">{value}</span>
      }
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
      <div className="bg-orange-400 px-4 pt-6 pb-6">
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
          <InfoRow icon={<MapPin size={16} />} label="위치" value={store.address_full} />
          <InfoRow icon={<Clock size={16} />} label="운영시간" value={store.hours} />
          <InfoRow icon={<Phone size={16} />} label="전화" value={store.phone} href={`tel:${store.phone}`} />
        </div>

        <a
          href={store.map_url}
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
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedColleges, setSelectedColleges] = useState(['all'])
  const [selectedCats, setSelectedCats] = useState(['all'])
  const [query, setQuery] = useState('')

  // Supabase fetch
  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .order('id', { ascending: true })
      if (error) {
        setError('데이터를 불러오지 못했어요.')
      } else {
        setStores(data)
      }
      setLoading(false)
    }
    fetchStores()

    // 실시간 반영 (Supabase Realtime)
    const channel = supabase
      .channel('stores-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'stores' }, () => {
        fetchStores()
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

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
    return stores.filter(s => {
      const matchCollege =
        selectedColleges.includes('all') ||
        s.colleges?.includes('all') ||
        selectedColleges.some(sc => s.colleges?.includes(sc))
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
  }, [stores, selectedColleges, selectedCats, query])

  return (
    <div className="flex flex-col h-full">
      {/* ── 고정 헤더 ── */}
      <div className="bg-white border-b border-orange-100 px-4 pt-4 pb-3 space-y-3">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">단대<span className="text-orange-400">.zip</span></h1>
            <p className="text-xs text-gray-400 mt-0.5">가천대학교 단과대 제휴 혜택</p>
          </div>
          <p className="text-xs text-orange-400 font-semibold pb-0.5">
            {loading ? '...' : `${filtered.length}개 업체`}
          </p>
        </div>

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
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-8 space-y-3 bg-orange-50/40">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-orange-300">
            <Loader2 size={32} className="animate-spin mb-3" />
            <p className="text-sm">불러오는 중...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-red-400">
            <p className="text-sm">{error}</p>
          </div>
        ) : filtered.length === 0 ? (
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