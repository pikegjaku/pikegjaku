import { EmailValidation } from '@pikegjaku/shared/validations'

const form = document.getElementById('waitlist-form') as HTMLFormElement
const input = form.querySelector('input') as HTMLInputElement
const button = form.querySelector('button') as HTMLButtonElement
const message = document.getElementById('waitlist-message') as HTMLDivElement
const lockIcon = form.querySelector('.input-lock') as SVGElement

const API_URL = import.meta.env.PUBLIC_API_URL
const t = {
    subscribed: form.dataset.subscribed || '',
    error: form.dataset.error || '',
    rateLimited: form.dataset.rateLimited || ''
}

let state: 'idle' | 'loading' | 'subscribed' | 'error' = 'idle'
const originalLabel = button.textContent || ''

const idleWidth = button.offsetWidth
button.innerHTML = `${t.subscribed} <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256" fill="white"><path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"/></svg>`
const subscribedWidth = button.offsetWidth
button.textContent = originalLabel
button.style.minWidth = `${Math.max(idleWidth, subscribedWidth)}px`

const MIN_LOADING_MS = 500

const setState = (newState: typeof state, errorMessage?: string) => {
    state = newState

    message.textContent = ''
    message.className = 'hero-message'
    input.classList.remove('input-field-error', 'input-field-locked')
    lockIcon.classList.remove('input-lock-visible')
    input.readOnly = false

    if (state === 'loading') {
        button.disabled = true
        button.innerHTML = `${originalLabel} <span class="spinner"></span>`
        input.disabled = true
    }

    if (state === 'subscribed') {
        button.disabled = true
        button.innerHTML = `${t.subscribed} <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256" fill="white"><path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"/></svg>`
        input.disabled = false
        input.readOnly = true
        input.classList.add('input-field-locked')
        lockIcon.classList.add('input-lock-visible')
        input.blur()
    }

    if (state === 'error') {
        button.disabled = false
        button.textContent = originalLabel
        input.disabled = false
        input.classList.add('input-field-error')
        message.textContent = errorMessage || t.error
        message.classList.add('hero-message-visible', 'hero-message-error')
    }

    if (state === 'idle') {
        button.disabled = false
        button.textContent = originalLabel
        input.disabled = false
    }
}

input.addEventListener('input', () => {
    if (state === 'error') setState('idle')
})

const blockWhenLocked = (e: Event) => {
    if (state === 'subscribed') {
        e.preventDefault()
        e.stopPropagation()
    }
}

input.addEventListener('keydown', blockWhenLocked)
input.addEventListener('paste', blockWhenLocked)
input.addEventListener('cut', blockWhenLocked)
input.addEventListener('drop', blockWhenLocked)
input.addEventListener('beforeinput', blockWhenLocked)

form.addEventListener('submit', async (e) => {
    e.preventDefault()

    if (state === 'loading' || state === 'subscribed') return

    const email = input.value.trim()

    const validation = EmailValidation(email)
    if (validation.error) {
        setState('error', validation.message)
        return
    }

    setState('loading')
    const startedAt = Date.now()

    const finish = async (apply: () => void) => {
        const elapsed = Date.now() - startedAt
        if (elapsed < MIN_LOADING_MS) {
            await new Promise((resolve) =>
                setTimeout(resolve, MIN_LOADING_MS - elapsed)
            )
        }
        apply()
    }

    try {
        const response = await fetch(`${API_URL}/generals/join-waitlist`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        })

        const data = await response.json()

        await finish(() => {
            if (data.success) setState('subscribed')
            else if (response.status === 429) setState('error', t.rateLimited)
            else setState('error')
        })
    } catch {
        await finish(() => setState('error'))
    }
})