module.exports = {
    SUCCESS: { isSuccess: true, code: 1000, message: '성공' },
    //Request error
    SIGNUP_ID_ERROR_TYPE: {
        isSuccess: false,
        code: 2001,
        message: '아이디를 형식에 맞게 정확하게 입력해주세요.',
    },
    SIGNUP_PASSWORD_ERROR_TYPE_LENGTH: {
        isSuccess: false,
        code: 2002,
        message: '10자 이상 입력',
    },
    SIGNUP_PASSWORD_ERROR_TYPE_VAL: {
        isSuccess: false,
        code: 2003,
        message: '영문/숫자/특수문자(공백제외)만 허용하며, 2개 이상 조합',
    },
    SIGNUP_PASSWORD_ERROR_TYPE_CONTINUOUS: {
        isSuccess: false,
        code: 2004,
        message: '동일한 숫자 3개 이상 연속 사용 불가',
    },
    SIGNUP_EMAIL_ERROR_TYPE: {
        isSuccess: false,
        code: 2005,
        message: '이메일을 형식에 맞게 정확하게 입력해주세요.',
    },
    SIGNUP_ID_ERROR_EMPTY: {
        isSuccess: false,
        code: 2006,
        message: '아이디를 입력해주세요.',
    },
    SIGNUP_PASSWORD_ERROR_EMPTY: {
        isSuccess: false,
        code: 2007,
        message: '비밀번호를 입력해주세요.',
    },
    SIGNUP_EMAIL_ERROR_EMPTY: {
        isSuccess: false,
        code: 2008,
        message: '이메일을 입력해주세요.',
    },
    SIGNUP_PHONENUMBER_ERROR_EMPTY: {
        isSuccess: false,
        code: 2009,
        message: '휴대폰 번호를 입력해주세요.',
    },
    SIGNUP_LOCATION_ERROR_EMPTY: {
        isSuccess: false,
        code: 2010,
        message: '주소를 입력해주세요.',
    },
    SIGNUP_BIRTH_ERROR_EMPTY: {
        isSuccess: false,
        code: 2011,
        message: '생년월일을 입력해주세요.',
    },
    SIGNUP_SEX_ERROR_EMPTY: {
        isSuccess: false,
        code: 2012,
        message: '성별을 입력해주세요.',
    },
    SIGNUP_NAME_ERROR_EMPTY: {
        isSuccess: false,
        code: 2013,
        message: '이름을 입력해주세요.',
    },
    SIGNUP_ID_ERROR_CHECK: {
        isSuccess: false,
        code: 2014,
        message: '아이디 중복확인을 확인해 주세요.',
    },
    // Response error
    SIGNUP_REDUNDANT_ID: { isSuccess: false, code: 3000, message: '중복된 아이디 입니다.' },
    SIGNIN_WRONG: { isSuccess: false, code: 3001, message: '아이디 혹은 비밀번호가 틀렸습니다.' },
    SIGNIN_INACTIVE_ACCOUNT: {
        isSuccess: false,
        code: 3002,
        message: '탈퇴 된 계정입니다. 고객센터에 문의해주세요.',
    },
    //Connection, Transaction 등의 서버 오류
    DB_ERROR: { isSuccess: false, code: 4000, message: '데이터 베이스 에러' },
    SERVER_ERROR: { isSuccess: false, code: 4001, message: '서버 에러' },
};
