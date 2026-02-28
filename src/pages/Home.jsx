import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import './Home.css'

const IP_REGEX = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/

async function fetchGeo(ip) {
  const url = ip
    ? `https://ipinfo.io/${ip}/json`
    : 'https://ipinfo.io/json'
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch geolocation')
  return res.json()
}

export default function Home() {
  const { user, logout } = useAuth()
  const [geo, setGeo] = useState(null)
  const [searchIp, setSearchIp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('jlab_history') || '[]')
    } catch {
      return []
    }
  })

  const loadGeo = async (ip = null) => {
    setLoading(true)
    setError('')
    try {
      const data = await fetchGeo(ip)
      setGeo(data)
    } catch (err) {
      setError(err.message || 'Failed to load geolocation')
      setGeo(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadGeo()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    const ip = searchIp.trim()
    if (!ip) return

    if (!IP_REGEX.test(ip)) {
      setError('Please enter a valid IP address (e.g. 8.8.8.8)')
      return
    }

    setError('')
    loadGeo(ip)
    setHistory((prev) => {
      const next = [ip, ...prev.filter((h) => h !== ip)].slice(0, 10)
      localStorage.setItem('jlab_history', JSON.stringify(next))
      return next
    })
  }

  const handleClear = () => {
    setSearchIp('')
    setError('')
    loadGeo()
  }

  const handleHistoryClick = (ip) => {
    setSearchIp(ip)
    setError('')
    loadGeo(ip)
  }

  return (
    <div className="home-page">
      <header className="home-header">
        <div>
          <h1>IP Geolocation</h1>
          <p className="user-email">{user?.email}</p>
        </div>
        <button onClick={logout} className="btn-logout">
          Sign out
        </button>
      </header>

      <main className="home-main">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-row">
            <input
              type="text"
              value={searchIp}
              onChange={(e) => setSearchIp(e.target.value)}
              placeholder="Enter IP address (e.g. 8.8.8.8)"
              className="search-input"
            />
            <button type="submit" className="btn-search">
              Lookup
            </button>
            <button type="button" onClick={handleClear} className="btn-clear">
              Clear
            </button>
          </div>
        </form>

        {error && <div className="geo-error">{error}</div>}

        {loading ? (
          <div className="geo-loading">Loading geolocation...</div>
        ) : geo ? (
          <div className="geo-card">
            <h2>Location Details</h2>
            <dl className="geo-grid">
              <div className="geo-item">
                <dt>IP Address</dt>
                <dd className="mono">{geo.ip || '—'}</dd>
              </div>
              <div className="geo-item">
                <dt>City</dt>
                <dd>{geo.city || '—'}</dd>
              </div>
              <div className="geo-item">
                <dt>Region</dt>
                <dd>{geo.region || '—'}</dd>
              </div>
              <div className="geo-item">
                <dt>Country</dt>
                <dd>{geo.country || '—'}</dd>
              </div>
              <div className="geo-item">
                <dt>Location (lat, lng)</dt>
                <dd className="mono">{geo.loc || '—'}</dd>
              </div>
              <div className="geo-item">
                <dt>Postal Code</dt>
                <dd>{geo.postal || '—'}</dd>
              </div>
              <div className="geo-item">
                <dt>Timezone</dt>
                <dd>{geo.timezone || '—'}</dd>
              </div>
              <div className="geo-item">
                <dt>Organization</dt>
                <dd>{geo.org || '—'}</dd>
              </div>
            </dl>
          </div>
        ) : null}

        {history.length > 0 && (
          <div className="history-section">
            <h3>Search History</h3>
            <ul className="history-list">
              {history.map((ip) => (
                <li key={ip}>
                  <button
                    type="button"
                    onClick={() => handleHistoryClick(ip)}
                    className="history-item"
                  >
                    {ip}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  )
}
