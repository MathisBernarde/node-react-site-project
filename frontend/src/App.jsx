import { useState } from 'react'
import LoginForm from './views/security/login-form';
import Recipes from './views/Recipes';
import './App.css'

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('login'); // navigation ultra simple

  function onLogin(loggedInUser) {
    setUser(loggedInUser);
    setPage('recipes'); // Redirige vers recettes after login
  }

  return (
    <div>
        {/* Barre de navigation simple */}
        <nav style={{ padding: '10px', background: '#f0f0f0', marginBottom: '20px' }}>
            {!user ? (
                <span>Veuillez vous connecter</span>
            ) : (
                <>
                    <b>Bonjour {user.email}</b> | 
                    <button onClick={() => setPage('recipes')}>Recettes</button> |
                    <button onClick={() => setUser(null)}>Déconnexion</button>
                </>
            )}
        </nav>

        {/* Affichage conditionnel des pages */}
        {!user && <LoginForm onLogin={onLogin} />}
        
        {user && page === 'recipes' && <Recipes />}
    </div>
  )
}

export default App