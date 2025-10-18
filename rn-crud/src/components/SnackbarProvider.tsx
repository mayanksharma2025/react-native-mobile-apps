import React, { createContext, useContext, useState } from 'react'
import { Snackbar } from 'react-native-paper'

interface SnackbarOptions {
  message: string
  type?: 'success' | 'error'
}

const SnackbarContext = createContext<(options: SnackbarOptions) => void>(
  () => {}
)

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [visible, setVisible] = useState(false)
  const [message, setMessage] = useState('')
  const [type, setType] = useState<'success' | 'error'>('success')

  const showSnackbar = ({ message, type = 'success' }: SnackbarOptions) => {
    setMessage(message)
    setType(type)
    setVisible(true)
  }

  return (
    <SnackbarContext.Provider value={showSnackbar}>
      {children}
      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={3000}
        style={{ backgroundColor: type === 'success' ? 'green' : 'red' }}
      >
        {message}
      </Snackbar>
    </SnackbarContext.Provider>
  )
}

export const useSnackbar = () => useContext(SnackbarContext)
