import { useState, useEffect, useRef, useCallback } from 'react'
import Peer from 'peerjs'

/* ── Icons ────────────────────────────────── */
const Icon = {
  Mic: ({ off } = {}) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {off
        ? <>
            <line x1="1" y1="1" x2="23" y2="23"/>
            <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/>
            <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/>
            <line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
          </>
        : <>
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            <line x1="12" y1="19" x2="12" y2="23"/>
          </>
      }
    </svg>
  ),
  Cam: ({ off } = {}) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {off
        ? <>
            <line x1="1" y1="1" x2="23" y2="23"/>
            <path d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h4a2 2 0 0 1 2 2v9.34m-7.72-2.06a4 4 0 1 1-5.56-5.56"/>
          </>
        : <>
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </>
      }
    </svg>
  ),
  Screen: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
      <line x1="8" y1="21" x2="16" y2="21"/>
      <line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  ),
  Phone: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07C6.69 17.55 4.45 15.31 3 12.69A19.73 19.73 0 0 1-.07 4.06 2 2 0 0 1 1.92 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L5.86 9.91"/>
    </svg>
  ),
  People: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  Info: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  Close: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  Copy: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  ),
  Plus: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  Video: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
    </svg>
  ),
  Sparkle: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z"/>
    </svg>
  ),
}

/* ── Clock component ──────────────────── */
function Clock() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return (
    <span className="clock">
      {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </span>
  )
}

/* ── Video Tile ───────────────────────── */
function VideoTile({ id, stream, isSelf, micEnabled, isScreenSharing }) {
  const videoRef = useRef(null)
  useEffect(() => {
    if (videoRef.current && stream) videoRef.current.srcObject = stream
  }, [stream])

  const initials = isSelf ? 'ME' : id.slice(0, 2).toUpperCase()
  const hasVideo = stream && stream.getVideoTracks().length > 0

  return (
    <div className="video-tile">
      {hasVideo
        ? <video ref={videoRef} autoPlay playsInline muted={isSelf} />
        : <div className="cam-off-placeholder">
            <div className="avatar-circle">{initials}</div>
          </div>
      }
      <div className="tile-label">
        {!micEnabled && isSelf && <span className="tile-mic-off"><Icon.Mic off /></span>}
        {isSelf ? (isScreenSharing ? 'You (Screen)' : 'You') : id.slice(0, 8) + '…'}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════
   MAIN APP
═══════════════════════════════════════ */
export default function App() {
  /* State */
  const [myId, setMyId] = useState('')
  const [roomId, setRoomId] = useState('')
  const [inCall, setInCall] = useState(false)
  const [micEnabled, setMicEnabled] = useState(true)
  const [camEnabled, setCamEnabled] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [participants, setParticipants] = useState(new Map())
  const [toast, setToast] = useState({ msg: '', show: false })
  const [statusState, setStatusState] = useState('initializing')
  const [panelOpen, setPanelOpen] = useState(false)
  const [panelTab, setPanelTab] = useState('people')
  const [peerIdInput, setPeerIdInput] = useState('')
  const [roomInput, setRoomInput] = useState('')
  const [lobbyStream, setLobbyStream] = useState(null)
  const [lobbyMic, setLobbyMic] = useState(true)
  const [lobbyCam, setLobbyCam] = useState(true)

  /* Refs */
  const localStreamRef = useRef(null)
  const screenStreamRef = useRef(null)
  const peerInstanceRef = useRef(null)
  const connectionsRef = useRef(new Map())
  const roomIdRef = useRef('')
  const toastTimerRef = useRef(null)
  const lobbyVideoRef = useRef(null)

  /* Toast */
  const showToast = useCallback((msg) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    setToast({ msg, show: true })
    toastTimerRef.current = setTimeout(() => setToast(p => ({ ...p, show: false })), 3000)
  }, [])

  /* Media */
  const initLocalMedia = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        audio: { echoCancellation: true, noiseSuppression: true }
      })
      localStreamRef.current = stream
      return stream
    } catch (err) {
      showToast('Camera/mic permission required')
      return null
    }
  }, [showToast])

  /* Lobby preview */
  useEffect(() => {
    let stream
    const startPreview = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        setLobbyStream(stream)
        if (lobbyVideoRef.current) lobbyVideoRef.current.srcObject = stream
      } catch {}
    }
    if (!inCall) startPreview()
    return () => { if (stream) stream.getTracks().forEach(t => t.stop()) }
  }, [inCall])

  useEffect(() => {
    if (lobbyVideoRef.current && lobbyStream) lobbyVideoRef.current.srcObject = lobbyStream
  }, [lobbyStream])

  /* Call helpers */
  const setupCallListeners = useCallback((call) => {
    connectionsRef.current.set(call.peer, call)
    call.on('stream', remoteStream => {
      setParticipants(prev => {
        const m = new Map(prev)
        m.set(call.peer, { stream: remoteStream, isSelf: false })
        return m
      })
      showToast(`${call.peer.slice(0, 6)}… joined`)
    })
    call.on('close', () => {
      setParticipants(prev => { const m = new Map(prev); m.delete(call.peer); return m })
      connectionsRef.current.delete(call.peer)
      showToast('A participant left')
    })
  }, [showToast])

  const callParticipant = useCallback((peerId) => {
    if (!peerInstanceRef.current || !localStreamRef.current) return
    if (peerId === myId || connectionsRef.current.has(peerId)) return
    const call = peerInstanceRef.current.call(peerId, localStreamRef.current)
    setupCallListeners(call)
  }, [myId, setupCallListeners])

  const joinRoom = useCallback(async (code) => {
    const rc = code.trim().toUpperCase()
    if (!rc) { showToast('Enter a meeting code'); return }
    if (!peerInstanceRef.current) { showToast('Peer not ready'); return }
    if (lobbyStream) { lobbyStream.getTracks().forEach(t => t.stop()); setLobbyStream(null) }
    const stream = await initLocalMedia()
    if (!stream) return
    setParticipants(prev => {
      const m = new Map(prev)
      m.set('self', { stream, isSelf: true })
      return m
    })
    roomIdRef.current = rc
    setRoomId(rc)
    setInCall(true)
    setStatusState('in-call')
    showToast(`Joined: ${rc}`)
  }, [initLocalMedia, lobbyStream, showToast])

  const leaveCall = useCallback(() => {
    connectionsRef.current.forEach(c => c.close())
    connectionsRef.current.clear()
    if (localStreamRef.current) { localStreamRef.current.getTracks().forEach(t => t.stop()); localStreamRef.current = null }
    if (screenStreamRef.current) { screenStreamRef.current.getTracks().forEach(t => t.stop()); screenStreamRef.current = null }
    setParticipants(new Map())
    setInCall(false)
    setRoomId('')
    setIsScreenSharing(false)
    setPanelOpen(false)
    roomIdRef.current = ''
    setStatusState('connected')
    showToast('You left the meeting')
  }, [showToast])

  const toggleMic = useCallback(() => {
    if (!localStreamRef.current) return
    const t = localStreamRef.current.getAudioTracks()[0]
    if (t) { t.enabled = !t.enabled; setMicEnabled(t.enabled) }
  }, [])

  const toggleCam = useCallback(() => {
    if (!localStreamRef.current || isScreenSharing) return
    const t = localStreamRef.current.getVideoTracks()[0]
    if (t) { t.enabled = !t.enabled; setCamEnabled(t.enabled) }
  }, [isScreenSharing])

  const toggleScreenShare = useCallback(async () => {
    if (!localStreamRef.current) return
    if (isScreenSharing) {
      if (screenStreamRef.current) screenStreamRef.current.getTracks().forEach(t => t.stop())
      const orig = localStreamRef.current.getVideoTracks()[0]
      if (orig) connectionsRef.current.forEach(c => {
        const s = c.peerConnection?.getSenders().find(s => s.track?.kind === 'video')
        if (s) s.replaceTrack(orig)
      })
      setIsScreenSharing(false)
      showToast('Screen sharing stopped')
    } else {
      try {
        const ss = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
        screenStreamRef.current = ss
        const st = ss.getVideoTracks()[0]
        connectionsRef.current.forEach(c => {
          const s = c.peerConnection?.getSenders().find(s => s.track?.kind === 'video')
          if (s) s.replaceTrack(st)
        })
        setIsScreenSharing(true)
        showToast('Sharing screen')
        st.onended = toggleScreenShare
      } catch { showToast('Screen share cancelled') }
    }
  }, [isScreenSharing, showToast])

  /* PeerJS init */
  useEffect(() => {
    const peer = new Peer({
      config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:stun1.l.google.com:19302' }] }
    })
    peer.on('open', id => {
      setMyId(id)
      setStatusState('connected')
      showToast('Connected — share your ID to be called')
    })
    peer.on('call', call => {
      if (!localStreamRef.current) return
      call.answer(localStreamRef.current)
      setupCallListeners(call)
    })
    peer.on('error', err => { console.error(err); showToast('Connection error') })
    peerInstanceRef.current = peer
    return () => { peer.destroy() }
  }, [setupCallListeners, showToast])

  /* Deep link */
  useEffect(() => {
    if (peerInstanceRef.current && myId && window.deepLinkRoom) {
      const r = window.deepLinkRoom; window.deepLinkRoom = null
      joinRoom(r)
    }
  }, [myId, joinRoom])

  /* Grid class */
  const gridClass = () => {
    const n = participants.size
    if (n <= 1) return 'grid-1'
    if (n === 2) return 'grid-2'
    if (n <= 4) return 'grid-4'
    return 'grid-many'
  }

  const copyId = () => {
    navigator.clipboard.writeText(myId).then(() => showToast('ID copied!'))
  }

  const copyRoom = () => {
    const url = `${window.location.origin}/join/${roomId}`
    navigator.clipboard.writeText(url).then(() => showToast('Meeting link copied!'))
  }

  /* ── Lobby UI ─────────────────── */
  const LobbyView = (
    <div className="lobby">
      <div className="lobby-preview">
        <video ref={lobbyVideoRef} autoPlay playsInline muted style={{ transform: 'scaleX(-1)' }} />
        {!lobbyStream && (
          <div className="preview-overlay">Camera preview unavailable</div>
        )}
        <div className="preview-controls">
          <button
            className={`preview-btn ${!lobbyMic ? 'off' : ''}`}
            onClick={() => setLobbyMic(p => !p)}
            title={lobbyMic ? 'Mute' : 'Unmute'}
          >
            <Icon.Mic off={!lobbyMic} />
          </button>
          <button
            className={`preview-btn ${!lobbyCam ? 'off' : ''}`}
            onClick={() => {
              if (lobbyStream) {
                lobbyStream.getVideoTracks().forEach(t => t.enabled = !t.enabled)
              }
              setLobbyCam(p => !p)
            }}
            title={lobbyCam ? 'Camera off' : 'Camera on'}
          >
            <Icon.Cam off={!lobbyCam} />
          </button>
        </div>
      </div>

      <div className="lobby-panel">
        <div className="lobby-greeting">
          <h2>Ready to connect?</h2>
          <p>Start or join a peer-to-peer video meeting</p>
        </div>

        <div className="meeting-card">
          <span className="card-label">Join a meeting</span>
          <div className="meeting-input-row">
            <input
              className="meeting-input"
              type="text"
              placeholder="Enter meeting code"
              value={roomInput}
              onChange={e => setRoomInput(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && joinRoom(roomInput)}
              autoComplete="off"
              spellCheck="false"
            />
            <button className="btn-join" onClick={() => joinRoom(roomInput)}>Join</button>
          </div>

          <div className="divider">or</div>

          <button
            className="btn-create"
            onClick={() => {
              const code = Math.random().toString(36).slice(2, 8).toUpperCase()
              setRoomInput(code)
              joinRoom(code)
            }}
          >
            <Icon.Sparkle />
            Create instant meeting
          </button>
        </div>

        <div className="my-id-box">
          <div>
            <div className="id-label">Your Peer ID</div>
            <div className="id-value">{myId || '• • • • • •'}</div>
          </div>
          {myId && (
            <button className="btn-copy" onClick={copyId}>
              <Icon.Copy /> Copy
            </button>
          )}
        </div>

        <p style={{ fontSize: 11, color: 'var(--text-3)', lineHeight: 1.5 }}>
          Share your Peer ID so others can call you, or use a meeting code to join a room.{' '}
          <span style={{ color: 'var(--primary-light)' }}>Deep links</span>: {window.location.origin}/join/CODE
        </p>
      </div>
    </div>
  )

  /* ── Side Panel ───────────────── */
  const SidePanel = panelOpen && (
    <div className="side-panel">
      <div className="panel-header">
        <span className="panel-title">Meeting Info</span>
        <button className="panel-close" onClick={() => setPanelOpen(false)}><Icon.Close /></button>
      </div>
      <div className="panel-tabs">
        <button className={`panel-tab ${panelTab === 'people' ? 'active' : ''}`} onClick={() => setPanelTab('people')}>
          Participants ({participants.size})
        </button>
        <button className={`panel-tab ${panelTab === 'info' ? 'active' : ''}`} onClick={() => setPanelTab('info')}>
          Details
        </button>
      </div>
      <div className="panel-body">
        {panelTab === 'people' && (
          <>
            {Array.from(participants.entries()).map(([id, { isSelf }]) => (
              <div className="participant-item" key={id}>
                <div className="p-avatar">{isSelf ? 'ME' : id.slice(0, 2).toUpperCase()}</div>
                <div className="p-info">
                  <div className="p-name">{isSelf ? 'You' : 'Participant'}</div>
                  <div className="p-id">{isSelf ? myId.slice(0, 16) + '…' : id.slice(0, 16) + '…'}</div>
                </div>
                <div className="p-badges">
                  {isSelf && !micEnabled && <span className="p-badge-red"><Icon.Mic off /></span>}
                  {isSelf && isScreenSharing && <span className="p-badge-blue"><Icon.Screen /></span>}
                </div>
              </div>
            ))}
            <div className="add-peer-section">
              <span className="add-peer-label">Add by Peer ID</span>
              <div className="add-peer-row">
                <input
                  className="add-peer-input"
                  type="text"
                  placeholder="Paste peer ID…"
                  value={peerIdInput}
                  onChange={e => setPeerIdInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { callParticipant(peerIdInput); setPeerIdInput('') } }}
                />
                <button
                  className="add-peer-btn"
                  onClick={() => { callParticipant(peerIdInput); setPeerIdInput('') }}
                >
                  Call
                </button>
              </div>
            </div>
          </>
        )}
        {panelTab === 'info' && (
          <>
            <div className="room-chip">
              <span className="room-chip-label">Room</span>
              <span className="room-chip-value">{roomId}</span>
              <button className="btn-copy" onClick={copyRoom} style={{ flexShrink: 0 }}>
                <Icon.Copy /> Link
              </button>
            </div>
            <div className="room-chip" style={{ marginTop: 8 }}>
              <span className="room-chip-label">Your ID</span>
              <span className="room-chip-value" style={{ fontSize: 11 }}>{myId.slice(0, 20)}…</span>
              <button className="btn-copy" onClick={copyId} style={{ flexShrink: 0 }}>
                <Icon.Copy />
              </button>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 16, lineHeight: 1.7 }}>
              Share this meeting link so anyone can join:<br />
              <code style={{ wordBreak: 'break-all', color: 'var(--primary-light)', fontSize: 11 }}>
                {window.location.origin}/join/{roomId}
              </code>
            </p>
            <button
              className="btn-create"
              style={{ marginTop: 16 }}
              onClick={copyRoom}
            >
              <Icon.Copy /> Copy meeting link
            </button>
          </>
        )}
      </div>
    </div>
  )

  /* ── Call UI ──────────────────── */
  const CallView = (
    <div className="call-layout">
      <div className="video-area">
        {/* Meeting badge */}
        <div className="meeting-info-bar">
          <div className="meeting-badge">
            <span style={{ color: 'var(--text-3)' }}>Room</span>
            <strong>{roomId}</strong>
          </div>
          <div className="meeting-badge">
            <span style={{ color: 'var(--text-3)', fontSize: 11 }}>{participants.size} participant{participants.size !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Grid */}
        <div className={`video-grid ${gridClass()}`}>
          {Array.from(participants.entries()).map(([id, p]) => (
            <VideoTile
              key={id}
              id={id === 'self' ? myId : id}
              stream={p.stream}
              isSelf={p.isSelf}
              micEnabled={p.isSelf ? micEnabled : true}
              isScreenSharing={p.isSelf ? isScreenSharing : false}
            />
          ))}
          {participants.size === 0 && (
            <div className="video-tile waiting-tile">
              <Icon.People />
              <p>Waiting for others to join…</p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="controls-bar">
          <div className="controls-center">
            {/* Mic */}
            <button className={`ctrl-btn ${micEnabled ? 'on' : 'off'}`} onClick={toggleMic}>
              <Icon.Mic off={!micEnabled} />
              <span className="ctrl-btn-label">{micEnabled ? 'Mute' : 'Unmute'}</span>
            </button>

            {/* Camera */}
            <button className={`ctrl-btn ${camEnabled && !isScreenSharing ? 'on' : 'off'}`} onClick={toggleCam}>
              <Icon.Cam off={!camEnabled} />
              <span className="ctrl-btn-label">{camEnabled ? 'Stop video' : 'Start video'}</span>
            </button>

            <div className="ctrl-divider" />

            {/* Screen share */}
            <button className={`ctrl-btn ${isScreenSharing ? 'screen-on' : 'on'}`} onClick={toggleScreenShare}>
              <Icon.Screen />
              <span className="ctrl-btn-label">{isScreenSharing ? 'Stop sharing' : 'Share screen'}</span>
            </button>

            <div className="ctrl-divider" />

            {/* People */}
            <button
              className={`ctrl-btn ${panelOpen && panelTab === 'people' ? 'screen-on' : 'on'}`}
              onClick={() => { setPanelTab('people'); setPanelOpen(p => !(p && panelTab === 'people') ? true : !p) }}
            >
              <Icon.People />
              <span className="ctrl-btn-label">Participants</span>
            </button>

            {/* Info */}
            <button
              className={`ctrl-btn ${panelOpen && panelTab === 'info' ? 'screen-on' : 'on'}`}
              onClick={() => { setPanelTab('info'); setPanelOpen(p => !(p && panelTab === 'info') ? true : !p) }}
            >
              <Icon.Info />
              <span className="ctrl-btn-label">Info</span>
            </button>

            <div className="ctrl-divider" />

            {/* Hang up */}
            <button className="ctrl-btn hangup" onClick={leaveCall}>
              <Icon.Phone />
              <span className="ctrl-btn-label">Leave</span>
            </button>
          </div>
        </div>
      </div>

      {SidePanel}
    </div>
  )

  return (
    <div className="app">
      {/* Header */}
      <header>
        <div className="header-left">
          <div className="logo-mark">
            <Icon.Video />
          </div>
          <span className="logo-text">N2N <span>Meet</span></span>
        </div>
        <div className="header-right">
          <Clock />
          <div className={`status-pill ${statusState}`}>
            <span className="status-dot" />
            {statusState === 'initializing' && 'Connecting…'}
            {statusState === 'connected' && 'Ready'}
            {statusState === 'in-call' && `In call · ${roomId}`}
          </div>
        </div>
      </header>

      <main>
        {inCall ? CallView : LobbyView}
      </main>

      {/* Toast */}
      <div className={`toast ${toast.show ? 'show' : ''}`}>{toast.msg}</div>
    </div>
  )
}
