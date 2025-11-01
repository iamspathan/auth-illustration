/**
 * Simple finite-state helper for OAuth flow steps
 */
export enum FlowStep {
  IDLE = 'idle',
  AUTH_REQUEST = 'auth_request',
  CONSENT_SHOWN = 'consent_shown',
  CODE_RECEIVED = 'code_received',
  TOKEN_EXCHANGE = 'token_exchange',
  TOKENS_RECEIVED = 'tokens_received',
  API_CALL = 'api_call',
}

export class FlowState {
  private step: FlowStep = FlowStep.IDLE

  get current(): FlowStep {
    return this.step
  }

  next(): FlowStep {
    switch (this.step) {
      case FlowStep.IDLE:
        this.step = FlowStep.AUTH_REQUEST
        break
      case FlowStep.AUTH_REQUEST:
        this.step = FlowStep.CONSENT_SHOWN
        break
      case FlowStep.CONSENT_SHOWN:
        this.step = FlowStep.CODE_RECEIVED
        break
      case FlowStep.CODE_RECEIVED:
        this.step = FlowStep.TOKEN_EXCHANGE
        break
      case FlowStep.TOKEN_EXCHANGE:
        this.step = FlowStep.TOKENS_RECEIVED
        break
      case FlowStep.TOKENS_RECEIVED:
        this.step = FlowStep.API_CALL
        break
      case FlowStep.API_CALL:
        // Terminal state
        break
    }
    return this.step
  }

  reset(): void {
    this.step = FlowStep.IDLE
  }

  set(step: FlowStep): void {
    this.step = step
  }
}
