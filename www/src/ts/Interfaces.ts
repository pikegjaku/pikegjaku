export interface ButtonProps {
    label: string
    type?: 'submit' | 'button'
    variant?: 'primary' | 'secondary'
    href?: string
    class?: string
}

export interface InputProps {
    placeholder: string
    type?: string
    name: string
    required?: boolean
    class?: string
}

export interface TagProps {
    label: string
    class?: string
}

export interface HeroProps {
    tag: string
    title: string
    subtitle: string
    inputPlaceholder: string
    buttonLabel: string
    backgroundImage: string
    subscribedLabel: string
    subscribeError: string
    subscribeRateLimited: string
}

export interface HeaderProps {
    variant?: 'dark' | 'light'
}

export interface IconProps {
    name: string
    size?: number
    weight?: 'regular' | 'bold' | 'light' | 'thin' | 'duotone' | 'fill'
    class?: string
}

export interface HeadProps {
    title: string
    description: string
    themeColor?: string
    noindex?: boolean
    schema?: object[]
}

export interface LegalSectionProps {
    title: string
    content: string
}

export interface LegalPageProps {
    title: string
    subtitle: string
    sections: LegalSectionProps[]
}

export interface NotFoundProps {
    title: string
    description: string
    backLabel: string
}

export interface LayoutProps {
    title: string
    description: string
    noindex?: boolean
}