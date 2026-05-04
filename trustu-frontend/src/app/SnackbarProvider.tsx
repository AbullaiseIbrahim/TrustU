import React, { createContext, useCallback, useContext, useState } from 'react'
import { Alert, Snackbar, type AlertColor } from '@mui/material'

interface SnackbarMsg { id: number; message: string; severity: AlertColor }
interface SnackbarCtx {
  showSuccess: (msg: string) => void
  showError: (msg: string) => void
  showInfo: (msg: string) => void
  showWarning: (msg: string) => void
}

const SnackbarContext = createContext<SnackbarCtx | null>(null)
let nextId = 0

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<SnackbarMsg[]>([])

  const push = useCallback((message: string, severity: AlertColor) => {
    const id = ++nextId
    setMessages(prev => [...prev, { id, message, severity }])
    setTimeout(() => setMessages(prev => prev.filter(m => m.id !== id)), 4500)
  }, [])

  const showSuccess = useCallback((msg: string) => push(msg, 'success'), [push])
  const showError   = useCallback((msg: string) => push(msg, 'error'),   [push])
  const showInfo    = useCallback((msg: string) => push(msg, 'info'),    [push])
  const showWarning = useCallback((msg: string) => push(msg, 'warning'), [push])

  return (
    <SnackbarContext.Provider value={{ showSuccess, showError, showInfo, showWarning }}>
      {children}
      {messages.map((msg, i) => (
        <Snackbar key={msg.id} open anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          style={{ bottom: 24 + i * 72 }} onClose={() => setMessages(p => p.filter(m => m.id !== msg.id))}>
          <Alert severity={msg.severity} variant="filled"
            onClose={() => setMessages(p => p.filter(m => m.id !== msg.id))}
            sx={{ minWidth: 280, boxShadow: 3 }}>
            {msg.message}
          </Alert>
        </Snackbar>
      ))}
    </SnackbarContext.Provider>
  )
}

export function useSnackbar(): SnackbarCtx {
  const ctx = useContext(SnackbarContext)
  if (!ctx) throw new Error('useSnackbar must be used inside <SnackbarProvider>')
  return ctx
}
