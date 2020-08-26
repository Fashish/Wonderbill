import { RequestLogger } from "testcafe";

import { monthsCount } from "./support/helper";
import { page } from "./support/pageModel";

/* 
The following assignment is used to return 
the response headers from the session call post-login
*/
const headerLogger = RequestLogger(
  "https://my.wonderbill.com/app_api/unauthenticated/session",
  {
    logRequestHeaders: true,
    logResponseHeaders: true,
  }
);

/*
The following assignment is used to return the response body 
after accessing th accounts page
*/
const url = "https://my.wonderbill.com/app_api/linked_accounts/";
const bodyLogger = RequestLogger(
  { url, method: "get" },
  {
    logResponseHeaders: true,
    logResponseBody: true,
  }
);

const loginPageUrl = "https://my.wonderbill.com/login";

fixture("Retrive Account Details")
  .page(loginPageUrl)
  .requestHooks(headerLogger, bodyLogger);

test("Get all account's details", async (t) => {
  await page.login();
  await t.expect(headerLogger.requests[0].response.statusCode).eql(200); // asserting login by checking request code

  /*
  The following block will produce the list of accounts from 
  the raw gzip reposne received 
  */
  const zlib = require("zlib");
  const body = bodyLogger.requests[0].response.body;
  const unzippedBody = zlib.unzipSync(body);
  const accountsBody = JSON.parse(unzippedBody.toLocaleString()).success;
  const accountsList = accountsBody.linked_accounts;

  let accounts = [];

  accountsList.forEach((account) => {
    accounts.push({
      name: account.provider_label,
      amount: "£" + account.total_amount_in_pence / 100,
      lastPaymentDate: account.billing_date,
      totalToPayInAYear: "£" + (account.total_amount_in_pence * 12) / 100,
      paidYearAmount:
        "£" +
        (account.total_amount_in_pence * monthsCount(account.billing_date)) /
          100,
      outstandingYearAmount:
        "£" +
        (account.total_amount_in_pence * 12 -
          account.total_amount_in_pence * monthsCount(account.billing_date)) /
          100,
    });
  });

  return JSON.stringify(accounts);
});
