import { useEffect, useMemo, useState } from 'react'
import AppIcon from './AppIcon'
import {
  getMessageContactsRequest,
  getMessageThreadRequest,
  sendMessageRequest,
} from '../utils/api'
import { getAuthToken, getCurrentUser } from '../utils/storage'

const CONTACT_REFRESH_MS = 7000
const THREAD_REFRESH_MS = 3500

function MessagePopup() {
  const token = getAuthToken()
  const currentUser = getCurrentUser()
  const [isOpen, setIsOpen] = useState(false)
  const [contacts, setContacts] = useState([])
  const [selectedContactId, setSelectedContactId] = useState('')
  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState('')
  const [error, setError] = useState('')

  const selectedContact = useMemo(() => {
    if (!contacts.length) {
      return null
    }

    return (
      contacts.find((item) => String(item.id) === String(selectedContactId)) || contacts[0]
    )
  }, [contacts, selectedContactId])

  const unreadCount = useMemo(
    () => contacts.reduce((sum, item) => sum + Number(item.unreadCount || 0), 0),
    [contacts]
  )

  useEffect(() => {
    let isMounted = true

    const loadContacts = async () => {
      if (!token || !currentUser?.id) {
        return
      }

      try {
        const response = await getMessageContactsRequest(token)
        if (!isMounted) {
          return
        }

        const nextContacts = response.items || []
        setContacts(nextContacts)
        setSelectedContactId((prev) => {
          if (!nextContacts.length) {
            return ''
          }

          return nextContacts.some((item) => String(item.id) === String(prev))
            ? prev
            : String(nextContacts[0].id)
        })
      } catch (requestError) {
        if (!isMounted) {
          return
        }

        setError(requestError.message)
      }
    }

    loadContacts()
    const intervalId = window.setInterval(loadContacts, CONTACT_REFRESH_MS)

    return () => {
      isMounted = false
      window.clearInterval(intervalId)
    }
  }, [currentUser?.id, token])

  useEffect(() => {
    let isMounted = true

    const loadThread = async () => {
      if (!token || !selectedContact?.id || !isOpen) {
        if (isMounted && !isOpen) {
          setMessages([])
        }
        return
      }

      try {
        const response = await getMessageThreadRequest(token, selectedContact.id)
        if (!isMounted) {
          return
        }

        setMessages(response.items || [])
        setContacts((prev) =>
          prev.map((item) =>
            String(item.id) === String(selectedContact.id)
              ? { ...item, unreadCount: 0 }
              : item
          )
        )
      } catch (requestError) {
        if (!isMounted) {
          return
        }

        setError(requestError.message)
      }
    }

    loadThread()

    if (!isOpen) {
      return () => {
        isMounted = false
      }
    }

    const intervalId = window.setInterval(loadThread, THREAD_REFRESH_MS)

    return () => {
      isMounted = false
      window.clearInterval(intervalId)
    }
  }, [isOpen, selectedContact?.id, token])

  const handleSendMessage = async () => {
    if (!token || !selectedContact?.id || !draft.trim()) {
      setError('Poruka ne moze biti prazna.')
      return
    }

    try {
      setError('')
      const response = await sendMessageRequest(token, selectedContact.id, {
        message: draft.trim(),
      })

      setMessages((prev) => [...prev, response.item].filter(Boolean))
      setDraft('')
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  if (!token || !currentUser?.id) {
    return null
  }

  return (
    <div className="message-popup-root">
      {isOpen && (
        <div className="message-popup-window" role="dialog" aria-label="Chat poruke">
          <div className="message-popup-header">
            <div>
              <strong>Poruke</strong>
              <small>
                {selectedContact
                  ? `Razgovor: ${selectedContact.username}`
                  : 'Izaberi kontakt'}
              </small>
            </div>

            <button
              className="message-popup-close"
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Zatvori poruke"
            >
              <AppIcon name="close" size={16} />
            </button>
          </div>

          {contacts.length > 1 ? (
            <div className="message-popup-select-wrap">
              <label htmlFor="message-contact-select">Kontakt</label>
              <select
                id="message-contact-select"
                className="styled-select"
                value={selectedContact ? String(selectedContact.id) : ''}
                onChange={(event) => setSelectedContactId(event.target.value)}
              >
                {contacts.map((item) => (
                  <option key={`popup-contact-${item.id}`} value={item.id}>
                    {item.username}
                    {item.unreadCount > 0 ? ` (${item.unreadCount})` : ''}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          {selectedContact ? (
            <>
              <div className="message-popup-thread">
                {messages.length > 0 ? (
                  messages.map((item) => (
                    <div
                      key={`popup-message-${item.id}`}
                      className={`message-row ${item.isOwn ? 'own' : 'other'}`}
                    >
                      <div className={`message-bubble ${item.isOwn ? 'own' : 'other'}`}>
                        <strong>{item.isOwn ? 'Ti' : item.senderName}</strong>
                        <p>{item.message}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-admin-state">
                    Jos nema poruka. Posalji prvu poruku.
                  </div>
                )}
              </div>

              <div className="message-popup-compose">
                <textarea
                  className="message-textarea message-textarea-compact"
                  value={draft}
                  onChange={(event) => {
                    setDraft(event.target.value)
                    if (error) {
                      setError('')
                    }
                  }}
                  placeholder={
                    currentUser.role === 'admin'
                      ? 'Posalji poruku korisniku...'
                      : 'Posalji poruku administraciji...'
                  }
                />

                <button
                  className="primary-btn full-btn"
                  type="button"
                  onClick={handleSendMessage}
                  disabled={!selectedContact || !draft.trim()}
                >
                  Posalji
                </button>
              </div>
            </>
          ) : (
            <div className="empty-admin-state">Trenutno nema dostupnih razgovora.</div>
          )}

          {error ? <p className="error">{error}</p> : null}
        </div>
      )}

      <button
        className="message-popup-trigger"
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Otvori poruke"
      >
        <AppIcon name="message" size={22} />
        {unreadCount > 0 ? <span className="message-popup-badge">{unreadCount}</span> : null}
      </button>
    </div>
  )
}

export default MessagePopup
