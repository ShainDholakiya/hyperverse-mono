// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import './hyperverse/CloneFactory.sol';
import './hyperverse/IHyperverseModule.sol';
import './utils/Counters.sol';
import './GENERC721.sol';

/**
 * @dev Clone Factory Implementation for ERC20 Token
 */

contract ERC721Factory is CloneFactory {
	using Counters for Counters.Counter;

	/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ S T A T E @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/
	struct Tenant {
		GENERC721 generc721;
		address owner;
	}

	Counters.Counter public tenantCounter;
	mapping(address => Tenant) public tenants;
	mapping(address => bool) public instance;

	address public immutable owner;
	address public immutable masterContract;

	/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ E V E N T S @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

	event TenantCreated(address _tenant, address _proxy);

	/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ E R R O R S @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

	error Unauthorized();
	error InstanceAlreadyInitialized();
	error InstanceDoesNotExist();
	error ZeroAddress();

	/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ M O D I F I E R S @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/
	modifier isAuthorized(address _tenant) {
		if (_tenant == address(0)) {
			revert ZeroAddress();
		}
		if (!(msg.sender == _tenant || msg.sender == owner)) {
			revert Unauthorized();
		}
		_;
	}

	modifier hasAnInstance(address _tenant) {
		if (instance[_tenant]) {
			revert InstanceAlreadyInitialized();
		}
		_;
	}

	/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ C O N S T R U C T O R @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/
	constructor(address _masterContract, address _owner) {
		masterContract = _masterContract;
		owner = _owner;
	}

	/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ F U N C T I O N S @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

	function createInstance(
		address _tenant,
		string memory _name,
		string memory _symbol
	) external isAuthorized(_tenant) hasAnInstance(_tenant) {
		GENERC721 generc721 = GENERC721(createClone(masterContract));

		//initializing tenant state of clone
		generc721.initialize(_name, _symbol, _tenant);

		//set Tenant data
		Tenant storage newTenant = tenants[_tenant];
		newTenant.generc721 = generc721;
		newTenant.owner = _tenant;
		instance[_tenant] = true;
		tenantCounter.increment();

		emit TenantCreated(_tenant, address(generc721));
	}

	function getProxy(address _tenant) public view returns (GENERC721) {
				if (!instance[_tenant]) {
			revert InstanceDoesNotExist();
		}
		return tenants[_tenant].generc721;
	}
}
