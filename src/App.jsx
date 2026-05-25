import { Navigate, Route, Routes } from 'react-router-dom'
import NativeAppShell from './components/NativeAppShell'
import ProtectedRoute from './components/ProtectedRoute'
import AdminPage from './pages/AdminPage'
import AssociationGamePage from './pages/AssociationGamePage'
import ExplorePage from './pages/ExplorePage'
import GuidePage from './pages/GuidePage'
import HistoryPage from './pages/HistoryPage'
import HomePage from './pages/HomePage'
import LeaderboardPage from './pages/LeaderboardPage'
import LogicChallengePage from './pages/LogicChallengePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import RegisterPage from './pages/RegisterPage'
import RelationGamePage from './pages/RelationGamePage'
import ResultsPage from './pages/ResultsPage'
import WordChainPage from './pages/WordChainPage'

function App() {
  return (
    <>
      <NativeAppShell />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/association-game"
          element={
            <ProtectedRoute>
              <AssociationGamePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/logic-challenge"
          element={
            <ProtectedRoute>
              <LogicChallengePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/relation-game"
          element={
            <ProtectedRoute>
              <RelationGamePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/word-chain"
          element={
            <ProtectedRoute>
              <WordChainPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/explore"
          element={
            <ProtectedRoute adminOnly>
              <ExplorePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/results"
          element={
            <ProtectedRoute>
              <ResultsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <HistoryPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/guide"
          element={
            <ProtectedRoute>
              <GuidePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <LeaderboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  )
}

export default App
