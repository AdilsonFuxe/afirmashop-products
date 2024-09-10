import AccountModel from '../models/Account-model.js';

export const addAccountRepository = async (params) => {
  const account = new AccountModel(params);
  await account.save();
  return account;
};

export const signoutRepository = async (accountId, accessToken) => {
  await AccountModel.findByIdAndUpdate(accountId, {
    $pull: { sessions: { accessToken } },
  });
};

export const updateAccessTokenRepository = async (id, token) => {
  await AccountModel.findByIdAndUpdate(id, {
    $push: {
      sessions: { accessToken: token },
    },
  });
};
