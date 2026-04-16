import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import CEHomePage from './pages/comprehension-ecrite/CEHomePage'
import CESeriesPage from './pages/comprehension-ecrite/CESeriesPage'
import CETipsPage from './pages/comprehension-ecrite/CETipsPage'
import CESimulatorPage from './pages/comprehension-ecrite/CESimulatorPage'
import CEResultsPage from './pages/comprehension-ecrite/CEResultsPage'
import ComprehensionOralePage from './pages/comprehension-orale/ComprehensionOralePage'
import ExpressionEcritePage from './pages/expression-ecrite/ExpressionEcritePage'
import ExpressionOralePage from './pages/expression-orale/ExpressionOralePage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import PricingPage from './pages/pricing/PricingPage'

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
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />

          {/* Compréhension Écrite */}
          <Route path="/epreuve/comprehension-ecrite" element={<CEHomePage />} />
          <Route path="/epreuve/comprehension-ecrite/series" element={<CESeriesPage />} />
          <Route path="/epreuve/comprehension-ecrite/astuces" element={<CETipsPage />} />
          <Route path="/epreuve/comprehension-ecrite/entrainement/:slug" element={<CESimulatorPage />} />
          <Route path="/epreuve/comprehension-ecrite/resultats/:resultId" element={<CEResultsPage />} />
          <Route path="/epreuve/comprehension-ecrite/tableau-de-bord" element={<ComingSoon title="Tableau de bord CE — bientôt disponible" />} />

          {/* Compréhension Orale */}
          <Route path="/epreuve/comprehension-orale/*" element={<ComprehensionOralePage />} />

          {/* Expression Écrite */}
          <Route path="/epreuve/expression-ecrite/*" element={<ExpressionEcritePage />} />

          {/* Expression Orale */}
          <Route path="/epreuve/expression-orale/*" element={<ExpressionOralePage />} />

          {/* Autres pages */}
          <Route path="/tarifs" element={<PricingPage />} />
          <Route path="/formations" element={<ComingSoon title="Formations Zoom — bientôt disponible" />} />
          <Route path="/calculateur-nclc" element={<ComingSoon title="Calculateur NCLC — bientôt disponible" />} />
          <Route path="/connexion" element={<LoginPage />} />
          <Route path="/inscription" element={<RegisterPage />} />
          <Route path="/mon-compte" element={<ComingSoon title="Mon Compte — bientôt disponible" />} />
          <Route path="/admin" element={<ComingSoon title="Admin — bientôt disponible" />} />

          <Route path="*" element={<ComingSoon title="Page introuvable (404)" />} />
        </Routes>
      </Layout>
    </AuthProvider>
  )
}
