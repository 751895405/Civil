import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { compose } from "redux";
import { State } from "../../redux/reducers";
import { getListingPhaseState } from "../../selectors";
import { ListingWrapper, NewsroomWrapper } from "@joincivil/core";
import { ListingSummaryComponent, ListingSummaryRejectedComponent } from "@joincivil/components";
import { getFormattedTokenBalance } from "@joincivil/utils";
import { ListingContainerProps, connectLatestChallengeSucceededResults } from "../utility/HigherOrderComponents";
import WhitelistedListingItem from "./WhitelistedListingItem";
import { getContent } from "../../redux/actionCreators/newsrooms";

export interface ListingListItemOwnProps {
  listingAddress?: string;
  ListingItemComponent?: any;
  newsroom?: NewsroomWrapper;
  listing?: ListingWrapper;
  even: boolean;
  user?: string;
  queryData?: any;
}

export interface ListingListItemReduxProps {
  listingPhaseState?: any;
  charter?: any;
}

class ListingListItem extends React.Component<ListingListItemOwnProps & ListingListItemReduxProps & DispatchProp<any>> {
  public async componentDidMount(): Promise<void> {
    if (this.props.newsroom) {
      this.props.dispatch!(await getContent(this.props.newsroom.data.charterHeader!));
    }
  }
  public render(): JSX.Element {
    const { listing, newsroom, listingPhaseState } = this.props;
    const listingExists = listing && listing.data && newsroom && listingPhaseState;
    const isWhitelisted = listingExists && listingPhaseState.isWhitelisted;

    return (
      <>
        {isWhitelisted && <WhitelistedListingItem {...this.props} />}
        {listingExists && !isWhitelisted && !listingPhaseState.isRejected && this.renderListing()}
        {listingExists && listingPhaseState.isRejected && <RejectedListing {...this.props} />}
      </>
    );
  }

  private renderListing = (): JSX.Element => {
    const { listingAddress, listing, newsroom, listingPhaseState } = this.props;
    const listingData = listing!.data;
    let description = "";
    if (this.props.charter) {
      try {
        // TODO(jon): This is a temporary patch to handle the older charter format. It's needed while we're in transition to the newer schema and should be updated once the dapp is updated to properly handle the new charter
        description = (this.props.charter.content as any).desc;
      } catch (ex) {
        try {
          description = (this.props.charter as any).desc;
        } catch (ex1) {
          console.error("charter not formatted correctly. charter: ", this.props.charter);
        }
      }
    }
    const appExpiry = listingData.appExpiry && listingData.appExpiry.toNumber();
    const challenge = listingData.challenge;
    const pollData = challenge && challenge.poll;
    const commitEndDate = pollData && pollData.commitEndDate.toNumber();
    const revealEndDate = pollData && pollData.revealEndDate.toNumber();
    const requestAppealExpiry = challenge && challenge.requestAppealExpiry.toNumber();
    const unstakedDeposit = listing && getFormattedTokenBalance(listing.data.unstakedDeposit);
    const challengeStake = listingData.challenge && getFormattedTokenBalance(listingData.challenge.stake);
    const challengeID = challenge && listingData.challengeID.toString();
    const challengeStatementSummary =
      challenge && challenge.statement && JSON.parse(challenge.statement as string).summary;

    const appeal = challenge && challenge.appeal;
    const appealStatementSummary = appeal && appeal.statement && JSON.parse(appeal.statement as string).summary;
    const appealPhaseExpiry = appeal && appeal.appealPhaseExpiry;
    const appealOpenToChallengeExpiry = appeal && appeal.appealOpenToChallengeExpiry;

    const newsroomData = newsroom!.data;
    const listingDetailURL = `/listing/${listingAddress}`;

    const listingViewProps = {
      ...newsroomData,
      listingAddress,
      description,
      listingDetailURL,
      ...listingPhaseState,
      challengeID,
      challengeStatementSummary,
      appeal,
      appealStatementSummary,
      appExpiry,
      commitEndDate,
      revealEndDate,
      requestAppealExpiry,
      appealPhaseExpiry,
      appealOpenToChallengeExpiry,
      unstakedDeposit,
      challengeStake,
    };

    const ListingSummaryItem = this.props.ListingItemComponent || ListingSummaryComponent;

    return <ListingSummaryItem {...listingViewProps} />;
  };
}

const RejectedListing: React.StatelessComponent<ListingListItemOwnProps & ListingListItemReduxProps> = props => {
  const { listingAddress, newsroom, listingPhaseState } = props;
  const newsroomData = newsroom!.data;
  const listingDetailURL = `/listing/${listingAddress}`;
  let description = "";
  if (props.charter) {
    try {
      // TODO(jon): This is a temporary patch to handle the older charter format. It's needed while we're in transition to the newer schema and should be updated once the dapp is updated to properly handle the new charter
      description = (props.charter!.content as any).desc;
    } catch (ex) {
      try {
        description = (props.charter as any).desc;
      } catch (ex1) {
        console.error("charter not formatted correctly. charter: ", props.charter);
      }
    }
  }

  const listingViewProps = {
    ...newsroomData,
    description,
    listingAddress,
    listingDetailURL,
    ...listingPhaseState,
  };

  const ListingSummaryRejected = compose<React.ComponentClass<ListingContainerProps & {}>>(
    connectLatestChallengeSucceededResults,
  )(ListingSummaryRejectedComponent);

  return <ListingSummaryRejected {...listingViewProps} />;
};

const mapStateToProps = (
  state: State,
  ownProps: ListingListItemOwnProps,
): ListingListItemReduxProps & ListingListItemOwnProps => {
  const { content } = state.networkDependent;
  let charter;
  if (ownProps.newsroom && ownProps.newsroom.data.charterHeader) {
    charter = content.get(ownProps.newsroom.data.charterHeader.uri);
  }
  console.log("charter: ", charter);
  return {
    listingPhaseState: getListingPhaseState(ownProps.listing),
    charter,
    ...ownProps,
  };
};

export default connect(mapStateToProps)(ListingListItem);
