import { Selector, t, RequestLogger } from "testcafe";

export const logger = RequestLogger(
  "https://my.wonderbill.com/app_api/unauthenticated/session",
  {
    logRequestHeaders: true,
    logResponseHeaders: true,
  }
);

const email = "candidate+1@wonderbill.com";
const password = "kmdDPCFXmVPc_D8Vtpy4";

class Page {
  constructor() {
    this.emailField = Selector('[data-test="emailField"]');
    this.passwordField = Selector('[type="password"]');
    this.loginBtn = Selector('[type="submit"]');
    this.cookiesBanner = Selector('[id="_evidon_banner"]')
  }

  async login() {

    // Accept the cookies banner if shown 
    if (await this.cookiesBanner.exists) {
      await t.click("#_evidon-accept-button");
    }
    
    await t
      .click(this.emailField)
      .typeText(this.emailField, email, { replace: true })
      .click(this.passwordField)
      .typeText(this.passwordField, password, { replace: true })
      .click(this.loginBtn)
  }
}

export const page = new Page();
