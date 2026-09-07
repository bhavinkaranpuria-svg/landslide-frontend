"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export type Lang = "en" | "hi" | "ne"

export const languages: { code: Lang; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "ne", label: "Nepali", native: "नेपाली" },
]

type Dict = Record<string, string>

const en: Dict = {
  appName: "BhuChetna",
  appTagline: "Landslide Early Warning — North East",
  nav_dashboard: "Dashboard",
  nav_map: "Map",
  nav_alerts: "Alerts",
  nav_report: "Report",
  online: "Online",
  offline: "Offline",
  synced: "All data synced",
  pendingSync: "pending sync",
  regionRisk: "Regional Risk Index",
  activeAlerts: "Active Alerts",
  roadsBlocked: "Roads Blocked",
  peopleAtRisk: "People at Risk",
  riskByDistrict: "Risk by District",
  forecastTitle: "Weather-linked Risk Forecast",
  responsePriority: "Emergency Response Priority",
  roadStatus: "Road Connectivity",
  dataSources: "Live Data Sources",
  viewMap: "View on map",
  low: "Low",
  moderate: "Moderate",
  high: "High",
  severe: "Severe",
  open: "Open",
  restricted: "Restricted",
  blocked: "Blocked",
  acknowledge: "Acknowledge",
  acknowledged: "Acknowledged",
  newReport: "New Report",
  submitReport: "Submit Report",
  offlineQueueNote: "Saved offline — will sync automatically when back online.",
}

const hi: Dict = {
  appName: "भूचेतना",
  appTagline: "भूस्खलन पूर्व चेतावनी — उत्तर पूर्व",
  nav_dashboard: "डैशबोर्ड",
  nav_map: "नक्शा",
  nav_alerts: "चेतावनी",
  nav_report: "रिपोर्ट",
  online: "ऑनलाइन",
  offline: "ऑफ़लाइन",
  synced: "सभी डेटा सिंक",
  pendingSync: "सिंक बाकी",
  regionRisk: "क्षेत्रीय जोखिम सूचकांक",
  activeAlerts: "सक्रिय चेतावनियाँ",
  roadsBlocked: "बंद सड़कें",
  peopleAtRisk: "जोखिम में लोग",
  riskByDistrict: "ज़िले अनुसार जोखिम",
  forecastTitle: "मौसम-आधारित जोखिम पूर्वानुमान",
  responsePriority: "आपातकालीन प्रतिक्रिया प्राथमिकता",
  roadStatus: "सड़क संपर्क स्थिति",
  dataSources: "लाइव डेटा स्रोत",
  viewMap: "नक्शे पर देखें",
  low: "कम",
  moderate: "मध्यम",
  high: "उच्च",
  severe: "गंभीर",
  open: "खुला",
  restricted: "प्रतिबंधित",
  blocked: "बंद",
  acknowledge: "स्वीकार करें",
  acknowledged: "स्वीकृत",
  newReport: "नई रिपोर्ट",
  submitReport: "रिपोर्ट भेजें",
  offlineQueueNote: "ऑफ़लाइन सहेजा गया — ऑनलाइन होने पर स्वतः सिंक होगा।",
}

const ne: Dict = {
  appName: "भूचेतना",
  appTagline: "पहिरो पूर्व चेतावनी — उत्तर पूर्व",
  nav_dashboard: "ड्यासबोर्ड",
  nav_map: "नक्सा",
  nav_alerts: "चेतावनी",
  nav_report: "रिपोर्ट",
  online: "अनलाइन",
  offline: "अफलाइन",
  synced: "सबै डाटा सिंक भयो",
  pendingSync: "सिंक बाँकी",
  regionRisk: "क्षेत्रीय जोखिम सूचकांक",
  activeAlerts: "सक्रिय चेतावनीहरू",
  roadsBlocked: "बन्द सडकहरू",
  peopleAtRisk: "जोखिममा रहेका मानिस",
  riskByDistrict: "जिल्ला अनुसार जोखिम",
  forecastTitle: "मौसम-सम्बन्धित जोखिम पूर्वानुमान",
  responsePriority: "आपत्कालीन प्रतिक्रिया प्राथमिकता",
  roadStatus: "सडक सम्पर्क अवस्था",
  dataSources: "प्रत्यक्ष डाटा स्रोत",
  viewMap: "नक्सामा हेर्नुहोस्",
  low: "कम",
  moderate: "मध्यम",
  high: "उच्च",
  severe: "गम्भीर",
  open: "खुला",
  restricted: "प्रतिबन्धित",
  blocked: "बन्द",
  acknowledge: "स्वीकार गर्नुहोस्",
  acknowledged: "स्वीकृत",
  newReport: "नयाँ रिपोर्ट",
  submitReport: "रिपोर्ट पठाउनुहोस्",
  offlineQueueNote: "अफलाइन सुरक्षित — अनलाइन हुँदा स्वतः सिंक हुनेछ।",
}

const dicts: Record<Lang, Dict> = { en, hi, ne }

interface LangCtx {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LangCtx | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en")

  useEffect(() => {
    const saved = typeof window !== "undefined" ? (localStorage.getItem("bhuchetna-lang") as Lang | null) : null
    if (saved && dicts[saved]) setLangState(saved)
  }, [])

  const setLang = (l: Lang) => {
    setLangState(l)
    try {
      localStorage.setItem("bhuchetna-lang", l)
    } catch {}
  }

  const t = (key: string) => dicts[lang][key] ?? en[key] ?? key

  return <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider")
  return ctx
}
