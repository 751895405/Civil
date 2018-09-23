import * as React from "react";
import { connect } from "react-redux";
import { State } from "../reducers";
import { getFormattedTokenBalance } from "@joincivil/utils";
import { Set } from "immutable";
import { EthAddress } from "@joincivil/core";
import {
  getChallengesStartedByUser,
  getChallengesVotedOnByUser,
  getUserChallengesWithUnrevealedVotes,
  getUserChallengesWithUnclaimedRewards,
} from "../selectors";
import { NavBar, NavErrorBar } from "@joincivil/components";

export interface NavBarProps {
  balance: string;
  votingBalance: string;
  network: string;
  userAccount: EthAddress;
  currentUserChallengesStarted: Set<string>;
  currentUserChallengesVotedOn: Set<string>;
  userChallengesWithUnrevealedVotes?: Set<string>;
  userChallengesWithUnclaimedRewards?: Set<string>;
}

const GlobalNavComponent: React.SFC<NavBarProps> = props => {
  const shouldRenderErrorBar = props.network !== "4";
  return (
    <>
      <NavBar
        balance={props.balance}
        votingBalance={props.votingBalance}
        userAccount={props.userAccount}
        buyCvlUrl="https://civil.co/cvl/"
        userRevealVotesCount={props.userChallengesWithUnrevealedVotes!.count()}
        userClaimRewardsCount={props.userChallengesWithUnclaimedRewards!.count()}
        userChallengesStartedCount={props.currentUserChallengesStarted.count()}
        userChallengesVotedOnCount={props.currentUserChallengesVotedOn.count()}
      />
      {shouldRenderErrorBar && <NavErrorBar />}
    </>
  );
};

const mapStateToProps = (state: State): NavBarProps => {
  const { network } = state;
  const { user } = state.networkDependent;
  const currentUserChallengesStarted = getChallengesStartedByUser(state);
  const currentUserChallengesVotedOn = getChallengesVotedOnByUser(state);
  const userChallengesWithUnrevealedVotes = getUserChallengesWithUnrevealedVotes(state);
  const userChallengesWithUnclaimedRewards = getUserChallengesWithUnclaimedRewards(state);

  let balance = "loading...";
  if (user.account && user.account.balance) {
    balance = getFormattedTokenBalance(user.account.balance);
  }

  let votingBalance = "";
  if (user.account && user.account.votingBalance) {
    votingBalance = getFormattedTokenBalance(user.account.votingBalance);
  }

  let userAccount = "";
  if (user.account && user.account.account) {
    userAccount = user.account.account;
  }

  return {
    network,
    balance,
    votingBalance,
    userAccount,
    currentUserChallengesStarted,
    currentUserChallengesVotedOn,
    userChallengesWithUnrevealedVotes,
    userChallengesWithUnclaimedRewards,
  };
};

export const GlobalNav = connect(mapStateToProps)(GlobalNavComponent);
