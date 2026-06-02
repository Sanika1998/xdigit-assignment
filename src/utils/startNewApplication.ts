import type { NavigateFunction } from 'react-router'
import { stepPath } from '../routing/steps'
import { clearProgress } from './storage'

/** Clears saved progress and opens the form at step 1. */
export function startNewApplication(navigate: NavigateFunction) {
  clearProgress()
  navigate(stepPath('personal'))
}
