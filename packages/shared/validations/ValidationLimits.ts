const VALIDATION_LIMITS = {
    PHONE: {
        XK: 8,
        AL: 9,
        MK: 8
    },
    USER_NAME: {
        MIN: 2,
        MAX: 64
    },
    USER_SURNAME: {
        MIN: 2,
        MAX: 64
    },
    POST_TITLE: {
        MIN: 12,
        MAX: 64
    },
    POST_DESCRIPTION: {
        MIN: 32,
        MAX: 512
    }
}

export default VALIDATION_LIMITS