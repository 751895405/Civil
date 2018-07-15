pragma solidity ^0.4.19;

import "../installed_contracts/Registry.sol";

contract ContractAddressRegistry is Registry {

  modifier onlyContract(bytes32 _contractAddress) {
    uint size;
    address contractAddress = address(_contractAddress);
    assembly { 
      size := extcodesize(contractAddress)
    }
    require(size > 0);
    _;
  }

  // --------------------
  // PUBLISHER INTERFACE:
  // --------------------

  /**
  @notice Allows a user to start an application. Takes tokens from user and sets apply stage end time.
  --------
  In order to apply:
  1) Listing must not currently be whitelisted
  2) Listing must not currently be in application pahse
  3) Tokens deposited must be greater than or equal to the minDeposit value from the parameterizer
  4) Listing Address must point to contract
  --------
  Emits `_Application` event if successful
  @param amount The number of ERC20 tokens a user is willing to potentially stake
  @param data Extra data relevant to the application. Think IPFS hashes.
  */
  function apply(bytes32 listingAddress, uint amount, string data) onlyContract(listingAddress) public {
    super.apply(listingAddress, amount, data);
  }
}
