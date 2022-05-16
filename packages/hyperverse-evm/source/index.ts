import { useEvm } from './useEVM';
import { Provider, ProviderProps, lightTheme, darkTheme } from './Provider'
import { Blockchain, makeHyperverseBlockchain, Network } from '@decentology/hyperverse';
import { getProvider } from './evmLibraryBase';
export { EvmLibraryBase } from './evmLibraryBase';


const Networks = {
	[Network.Mainnet]: {
		type: Network.Mainnet,
		name: 'mainnet',
		networkUrl: 'http://localhost:8545',
		chainId: -1,
	},
	[Network.Testnet]: {
		type: Network.Mainnet,
		name: 'testnet',
		networkUrl: 'http://localhost:8545',
		chainId: 1337
	},
}

const getNetwork = (network: Network) => {
	return Networks[network]
}

export const Ethereum = makeHyperverseBlockchain({
	name: Blockchain.Ethereum,
	Provider: Provider,
	getNetwork
});

export const Localhost = makeHyperverseBlockchain({
	name: Blockchain.Localhost,
	Provider: Provider,
	getNetwork
});

export type { ProviderProps }
export { Provider, useEvm, getProvider, lightTheme, darkTheme };
