import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { AuthModalProvider } from './contexts/AuthModalContext'
import AuthModal from './components/auth/AuthModal'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'

// CE
import CEHomePage from './pages/comprehension-ecrite/CEHomePage'
import CESeriesPage from './pages/comprehension-ecrite/CESeriesPage'
import CETipsPage from './pages/comprehension-ecrite/CETipsPage'
import CESimulatorPage from './pages/comprehension-ecrite/CESimulatorPage'
import CEResultsPage from './pages/comprehension-ecrite/CEResultsPage'

// CO (NEW)
import COHomePage from './pages/comprehension-orale/COHomePage'
import COSeriesPage from './pages/comprehension-orale/COSeriesPage'
import COTipsPage from './pages/comprehension-orale/COTipsPage'
import COSimulatorPage from './pages/comprehension-orale/COSimulatorPage'
import COResultsPage from './pages/comprehension-orale/COResultsPage'

// EE (NEW)
import EEHomePage from './pages/expression-ecrite/EEHomePage'
import EESubjectsPage from './pages/expression-ecrite/EESubjectsPage'
import EETipsPage from './pages/expression-ecrite/EETipsPage'
import EESimulatorPage from './pages/expression-ecrite/EESimulatorPage'
import EEResultsPage from './pages/expression-ecrite/EEResultsPage'

// EO (NEW)
import EOHomePage from './pages/expression-orale/EOHomePage'
import EOTipsPage from './pages/expression-orale/EOTipsPage'
import EOSubjectsPage from './pages/expression-orale/EOSubjectsPage'
import EOSimulatorPage from './pages/expression-orale/EOSimulatorPage'

// Auth
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'

// Other
import PricingPage from './pages/pricing/PricingPage'
import FormationsPage from './pages/pricing/FormationsPage'
import AccountPage from './pages/account/AccountPage'
import NclcCalculatorPage from './pages/nclc/NclcCalculatorPage'
import AdminDashboard from './pages/admin/AdminDashboard'

function ComingSoon({ title }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="text-6xl mb-4">🚧</div>
      <h2 className="text-2xl font-bold text-gray-700 mb-2">{title || 'Page en construction'}</h2>
      <p className="text-gray-500">Cette section sera disponible très prochainement.</p>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AuthModalProvider>
        <AuthModal />
        <Layout>
          <Routes>
          <Route path="/" element={<HomePage />} />

          {/* CE */}
          <Route path="/epreuve/comprehension-ecrite" element={<CEHomePage />} />
          <Route path="/epreuve/comprehension-ecrite/series" element={<CESeriesPage />} />
          <Route path="/epreuve/comprehension-ecrite/astuces" element={<CETipsPage />} />
          <Route path="/epreuve/comprehension-ecrite/entrainement/:slug" element={<CESimulatorPage />} />
          <Route path="/epreuve/comprehension-ecrite/resultats/:resultId" element={<CEResultsPage />} />
          <Route path="/epreuve/comprehension-ecrite/tableau-de-bord" element={<ComingSoon title="Tableau de bord CE" />} />

          {/* CO */}
          <Route path="/epreuve/comprehension-orale" element={<COHomePage />} />
          <Route path="/epreuve/comprehension-orale/series" element={<COSeriesPage />} />
          <Route path="/epreuve/comprehension-orale/astuces" element={<COTipsPage />} />
          <Route path="/epreuve/comprehension-orale/entrainement/:slug" element={<COSimulatorPage />} />
          <Route path="/epreuve/comprehension-orale/resultats/:resultId" element={<COResultsPage />} />
          <Route path="/epreuve/comprehension-orale/tableau-de-bord" element={<ComingSoon title="Tableau de bord CO" />} />

          {/* EE */}
          <Route path="/epreuve/expression-ecrite" element={<EEHomePage />} />
          <Route path="/epreuve/expression-ecrite/sujets-actualites" element={<EESubjectsPage />} />
          <Route path="/epreuve/expression-ecrite/astuces" element={<EETipsPage />} />
          <Route path="/epreuve/expression-ecrite/simulateur" element={<EESimulatorPage />} />
          <Route path="/epreuve/expression-ecrite/simulateur/resultats/:id" element={<EEResultsPage />} />
          <Route path="/epreuve/expression-ecrite/tableau-de-bord" element={<ComingSoon title="Tableau de bord EE" />} />

          {/* EO */}
          <Route path="/epreuve/expression-orale" element={<EOHomePage />} />
          <Route path="/epreuve/expression-orale/astuces" element={<EOTipsPage />} />
          <Route path="/epreuve/expression-orale/sujets-actualites" element={<EOSubjectsPage />} />
          <Route path="/epreuve/expression-orale/simulateur" element={<EOSimulatorPage />} />
          <Route path="/epreuve/expression-orale/tableau-de-bord" element={<ComingSoon title="Tableau de bord EO" />} />

          {/* Autres */}
          <Route path="/tarifs" element={<PricingPage />} />
          <Route path="/formations" element={<FormationsPage />} />
          <Route path="/calculateur-nclc" element={<NclcCalculatorPage />} />
          <Route path="/connexion" element={<LoginPage />} />
          <Route path="/inscription" element={<RegisterPage />} />
          <Route path="/mon-compte" element={<AccountPage />} />
          <Route path="/admin" element={<AdminDashboard />} />

          <Route path="*" element={<ComingSoon title="Page introuvable (404)" />} />
          </Routes>
        </Layout>
      </AuthModalProvider>
    </AuthProvider>
  )
}
