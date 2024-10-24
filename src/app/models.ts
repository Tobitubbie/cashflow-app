/**
 * Response data of an successfull user authorization.
 *
 * @see https://enablebanking.com/docs/api/reference/#startauthorizationresponse
*/
export type StartAuthorizationResponse = {
    url: string;
    authorization_id: string;
    psu_id_hash: string;
}

/**
* Response data of an authorized user session.
*
* @see https://enablebanking.com/docs/api/reference/#authorizesessionresponse
*/
export type AuthorizeSessionResponse = {
    session_id: string;
    accounts: AccountResource[];
    aspsp: ASPSP;
    psu_type: "business"|"personal";
    access: {valid_until: string};
}

/**
* Detailed account information.
*
* @see https://enablebanking.com/docs/api/reference/#accountresource
*
*/
export type AccountResource = {
    uid: string;
    account_id: {iban: string};
    account_servicer: {bic_fi: string };
    name: string;
    currency: "EUR";
}

/**
* Detailed bank information.
*
* ASPSP stands for Account Servicing Payment Service Provider.
*
* @see https://enablebanking.com/docs/api/reference/#aspsp
*/
export type ASPSP = {
    name: string;
    country: string;
}

/**
* Balances of an account.
*
* Returned from 'GET /accounts/{account_id}/balances'
*
* @see https://enablebanking.com/docs/api/reference/#halbalances
*/
export type HalBalances = {
    balances: BalanceResource[]
}

/**
* Detailed balance information.
*
* @see https://enablebanking.com/docs/api/reference/#get-account-balances
*/
export type BalanceResource = {
    name: string;
    balance_amount: {
        currency: "EUR";
        amount: string;
    };
    last_committed_transaction: string;
    last_change_date_time: string;
}

/**
* Transactions of an account.
*
* Returned from 'GET /accounts/{account_id}/transactions'
*
* @see https://enablebanking.com/docs/api/reference/#haltransactions
*/
export type HalTransactions = {
    transactions: [];
    continuation_key: string;
}

/**
* Detailed transaction information.
*
* @see https://enablebanking.com/docs/api/reference/#transaction
*/
export type Transaction = {
    creditor: any;
    deptor: any;
}
