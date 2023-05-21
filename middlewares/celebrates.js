const { celebrate, Joi } = require('celebrate');

const regexImageLink = /^https?:\/\/(?:[a-z0-9\\-]+\.)+[a-z]{2,6}(?:\/[^/#?]+)+\.(?:jpe?g|gif|png|bmp|webp)$/im;
const regexLink = /^https?:\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\\/~+#-]*[\w@?^=%&\\/~+#-])/im;

module.exports.login = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(regexImageLink),
  }),
});
module.exports.getUsersId = celebrate({
  params: Joi.object().keys({
    userId: Joi.objectId(),
  }),
});
module.exports.createCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(regexLink),
  }),
});
module.exports.updateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(regexImageLink),
  }),
});
module.exports.updateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});
module.exports.checkIdCard = celebrate({
  params: Joi.object().keys({
    cardId: Joi.objectId(),
  }),
});
