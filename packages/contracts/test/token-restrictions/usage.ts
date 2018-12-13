import { configureChai } from "@joincivil/dev-utils";
import * as chai from "chai";
import { configureProviders, setUpUserGroups } from "../utils/contractutils";

configureChai(chai);
const expect = chai.expect;

const ManagedWhitelistTokenController = artifacts.require("ManagedWhitelistTokenController");
const Token = artifacts.require("CVLToken");

contract("CVLToken", accounts => {
  let controller: any;
  let token: any;
  beforeEach(async () => {
    controller = await ManagedWhitelistTokenController.New();
    token = await Token.new(1000, "TestCoin", 18, "TEST", controller);
  });

  it("should have TokenWhitelist disabled by default", async () => {
    const result = await token.WHITELIST_ENABLED.call();
    expect(result).to.eql(false);
  });
  it("should allow you to turn on Whitelist", async () => {
    await token.enableWhitelist();
    const result = await token.WHITELIST_ENABLED.call();
    expect(result).to.eql(true);
  });
  it("should allow Owner to add Managers", async () => {
    await token.addManager(accounts[5]);
    const isManager = await token.checkManagerStatus.call(accounts[5]);

    expect(isManager).to.eql(true);
  });
  it("should allow Managers to add Managers", async () => {
    await token.addManager(accounts[5]);
    await token.addManager(accounts[6], { from: accounts[5] });
    const isManager = await token.checkManagerStatus.call(accounts[6]);

    expect(isManager).to.eql(true);
  });
  it("should allow Managers to whitelist accounts", async () => {
    await token.addManager(accounts[1]);
    await token.addToBothSendAndReceiveAllowed(accounts[6], { from: accounts[1] });
    const sendAllowed = await token.sendAllowed.call(accounts[6]);

    expect(sendAllowed).to.eql(true);
  });

  it("should prevent non-Managers from whitelisting accounts", async () => {
    let caught = false;
    try {
      await token.addToBothSendAndReceiveAllowed(accounts[6], { from: accounts[1] });
    } catch (e) {
      caught = true;
    }
    expect(caught).to.eql(true);

    const sendAllowed = await token.sendAllowed.call(accounts[6]);

    expect(sendAllowed).to.eql(false);
  });
  it("should allow transfers to whitelisted accounts", async () => {
    await token.transfer(accounts[6], 1000);
    await token.enableWhitelist();
    await token.addToBothSendAndReceiveAllowed(accounts[6]);
    await token.addToBothSendAndReceiveAllowed(accounts[7]);

    await token.transfer(accounts[7], 100, { from: accounts[6] });

    const account6Balance = await token.balanceOf.call(accounts[6]);
    const account7Balance = await token.balanceOf.call(accounts[7]);

    expect(account6Balance.toNumber()).to.eql(900);
    expect(account7Balance.toNumber()).to.eql(100);
  });
  it("should prevent transfers to non-whitelisted accounts", async () => {
    await token.transfer(accounts[6], 1000);
    await token.enableWhitelist();
    await token.addToBothSendAndReceiveAllowed(accounts[6]);

    let caught = false;
    try {
      await await token.transfer(accounts[7], 100, { from: accounts[6] });
    } catch (e) {
      caught = true;
    }
    expect(caught).to.eql(true);
  });
  it("should detect transfer restrictions between accounts", async () => {
    await token.enableWhitelist();
    await token.addToBothSendAndReceiveAllowed(accounts[1]);

    const result = await token.detectTransferRestriction.call(accounts[1], accounts[3], 1);
    const resultStr = await token.messageForTransferRestriction.call(result);

    expect(result.toNumber()).to.eql(2);
    expect(resultStr).to.eql("ILLEGAL_TRANSFER_RECEIVING_ACCOUNT_NOT_WHITELISTED");
  });

  it("should detect successful transfers between accounts", async () => {
    await token.enableWhitelist();
    await token.addToBothSendAndReceiveAllowed(accounts[1]);
    await token.addToBothSendAndReceiveAllowed(accounts[3]);

    const result = await token.detectTransferRestriction.call(accounts[1], accounts[3], 1);
    const resultStr = await token.messageForTransferRestriction.call(result);

    expect(result.toNumber()).to.eql(0);
    expect(resultStr).to.eql("SUCCESS");
  });
});
