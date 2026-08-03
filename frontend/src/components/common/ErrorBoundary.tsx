import { Component, type ErrorInfo, type ReactNode } from 'react'
import ErrorPage from '@/pages/ErrorPage'

type Props = {
  children: ReactNode
}

type State = {
  hasError: boolean
}

/**
 * Uygulama genelinde hata sınırı.
 * Beklenmeyen bir render hatasında beyaz ekran yerine 500 sayfası gösterilir.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Üretimde bu noktaya bir hata izleme servisi bağlanabilir.
    if (import.meta.env.DEV) {
      console.error('Yakalanan render hatası:', error, info.componentStack)
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false })
  }

  render() {
    if (this.state.hasError) {
      return <ErrorPage onRetry={this.handleRetry} />
    }
    return this.props.children
  }
}
