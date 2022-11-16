const ALERTS = {
  MESSAGES: {
    DATA: 'Переданы некорректные данные',
    PATH: 'Запрашиваемый пользователь не найден',
    // OTHER: 'На сервере произошла ошибка',
  },
  CODES: {
    DATA: '400',
    PATH: '404',
    // OTHER: '500',
  },
};

const REGEX = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;

const SECRET_JWT = 'new secret key';

module.exports = {
  ALERTS,
  SECRET_JWT,
  REGEX,
};
