// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract NFTSwap is ReentrancyGuard, AccessControl {
    bytes32 public constant BACKEND_ROLE = keccak256("BACKEND_ROLE");

    address[] private backendRoleMembers;

    event NFTSwapCompleted(address indexed user1, address indexed user2);
    event NFTSwapFailed(
        address indexed user1,
        address indexed user2,
        string reason
    );
    event BackendRoleGranted(address indexed account, address indexed sender);
    event BackendRoleRevoked(address indexed account, address indexed sender);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function executeNFTSwap(
        address[] calldata nftContractsGivenByA,
        uint256[] calldata tokenIdsGivenByA,
        address[] calldata nftContractsGivenByB,
        uint256[] calldata tokenIdsGivenByB,
        address userA,
        address userB
    ) external nonReentrant onlyRole(BACKEND_ROLE) {
        require(
            nftContractsGivenByA.length == tokenIdsGivenByA.length &&
                nftContractsGivenByB.length == tokenIdsGivenByB.length,
            "Array length mismatch"
        );

        bool successAGivesToB = _performNFTTransfers(
            nftContractsGivenByA,
            tokenIdsGivenByA,
            userA,
            userB
        );
        bool successBGivesToA = _performNFTTransfers(
            nftContractsGivenByB,
            tokenIdsGivenByB,
            userB,
            userA
        );

        if (successAGivesToB && successBGivesToA) {
            emit NFTSwapCompleted(userA, userB);
        } else {
            emit NFTSwapFailed(userA, userB, "NFT transfer failed");
            revert("NFT transfer failed");
        }
    }

    function _performNFTTransfers(
        address[] calldata nftContracts,
        uint256[] calldata tokenIds,
        address from,
        address to
    ) private returns (bool) {
        for (uint i = 0; i < nftContracts.length; i++) {
            IERC721 nft = IERC721(nftContracts[i]);
            try nft.transferFrom(from, to, tokenIds[i]) {
                if (nft.ownerOf(tokenIds[i]) != to) {
                    return false;
                }
            } catch {
                return false;
            }
        }
        return true;
    }

    function grantBackendRole(
        address account
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (!hasRole(BACKEND_ROLE, account)) {
            _grantRole(BACKEND_ROLE, account);
            backendRoleMembers.push(account);
            emit BackendRoleGranted(account, msg.sender);
        }
    }

    function revokeBackendRole(
        address account
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (hasRole(BACKEND_ROLE, account)) {
            _revokeRole(BACKEND_ROLE, account);
            for (uint i = 0; i < backendRoleMembers.length; i++) {
                if (backendRoleMembers[i] == account) {
                    backendRoleMembers[i] = backendRoleMembers[
                        backendRoleMembers.length - 1
                    ];
                    backendRoleMembers.pop();
                    break;
                }
            }
            emit BackendRoleRevoked(account, msg.sender);
        }
    }

    function getBackendRoleMembers() external view returns (address[] memory) {
        return backendRoleMembers;
    }

    function getBackendRoleMemberCount() external view returns (uint256) {
        return backendRoleMembers.length;
    }
}
