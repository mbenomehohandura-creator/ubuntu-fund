import './style.css'
import { setupInteractions } from './interactions.ts'
import {
  createPublicClient,
  createWalletClient,
  custom,
  formatEther,
  http,
} from 'viem'
import { sepolia } from 'viem/chains'

const contractAddress =
  '0x6ff4dc5f51a2f16c21b53844a1111ef69e4d316b' as const

const ubuntuFundAbi = [
  {
    type: 'function',
    name: 'treasurySummary',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      { name: 'membershipIncome', type: 'uint256' },
      { name: 'sponsorshipIncome', type: 'uint256' },
      { name: 'expenses', type: 'uint256' },
      { name: 'availableBalance', type: 'uint256' },
    ],
  },
  {
    type: 'function',
    name: 'currentFinancialYear',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'administrator',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
  },
] as const

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(),
})

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <header class="topbar">
    <a class="brand" href="/">
      <span class="brand-mark">UF</span>
      <span>
        <strong>Ubuntu Fund</strong>
        <small>Shared treasury. Shared trust.</small>
      </span>
    </a>

    <div class="network-actions">
      <span class="network"><span class="dot"></span>Sepolia</span>
      <button id="connectWallet">Connect wallet</button>
    </div>
  </header>

  <main>
    <section class="intro">
      <div>
        <p class="eyebrow">COMMUNITY TREASURY</p>
        <h1>Every contribution.<br>Clearly accounted for.</h1>
        <p class="intro-copy">
          Transparent membership payments, sponsorships and club expenses,
          secured on Ethereum.
        </p>
      </div>

      <aside class="contract-card">
        <span>Live contract</span>
        <strong>Ethereum Sepolia</strong>
        <a
          href="https://sepolia.etherscan.io/address/${contractAddress}"
          target="_blank"
          rel="noreferrer"
        >
          View on Etherscan ↗
        </a>
      </aside>
    </section>

    <section class="section-heading">
      <div>
        <p class="eyebrow">LIVE ON-CHAIN DATA</p>
        <h2>Treasury overview</h2>
      </div>
      <button id="refreshTreasury" class="secondary">Refresh</button>
    </section>

    <section class="stats">
      <article>
        <span>Available balance</span>
        <strong id="availableBalance">—</strong>
        <small>Sepolia ETH</small>
      </article>
      <article>
        <span>Membership income</span>
        <strong id="membershipIncome">—</strong>
        <small>Sepolia ETH</small>
      </article>
      <article>
        <span>Sponsorship income</span>
        <strong id="sponsorshipIncome">—</strong>
        <small>Sepolia ETH</small>
      </article>
      <article>
        <span>Total expenses</span>
        <strong id="expenses">—</strong>
        <small>Sepolia ETH</small>
      </article>
    </section>

    <section class="details">
      <article>
        <span>Financial year</span>
        <strong id="financialYear">—</strong>
      </article>
      <article>
        <span>Connected wallet</span>
        <strong id="walletAddress">Not connected</strong>
      </article>
      <article>
        <span>Contract administrator</span>
        <strong id="administrator">Loading…</strong>
      </article>
    </section>

    <p id="status" class="status" role="status">
      Reading the Ubuntu Fund contract…
    </p>
  </main>

  <footer>
    <span>Ubuntu Fund · Certification proof of concept</span>
    <span>Testnet funds have no monetary value</span>
  </footer>
`

const shortAddress = (address: string) =>
  `${address.slice(0, 6)}…${address.slice(-4)}`

const showStatus = (message: string, error = false) => {
  const status = document.querySelector<HTMLParagraphElement>('#status')!
  status.textContent = message
  status.classList.toggle('error', error)
}

async function refreshTreasury() {
  showStatus('Refreshing live Sepolia data…')

  try {
    const [summary, financialYear, administrator] = await Promise.all([
      publicClient.readContract({
        address: contractAddress,
        abi: ubuntuFundAbi,
        functionName: 'treasurySummary',
      }),
      publicClient.readContract({
        address: contractAddress,
        abi: ubuntuFundAbi,
        functionName: 'currentFinancialYear',
      }),
      publicClient.readContract({
        address: contractAddress,
        abi: ubuntuFundAbi,
        functionName: 'administrator',
      }),
    ])

    const [
      membershipIncome,
      sponsorshipIncome,
      expenses,
      availableBalance,
    ] = summary

    document.querySelector('#membershipIncome')!.textContent =
      Number(formatEther(membershipIncome)).toFixed(6)
    document.querySelector('#sponsorshipIncome')!.textContent =
      Number(formatEther(sponsorshipIncome)).toFixed(6)
    document.querySelector('#expenses')!.textContent =
      Number(formatEther(expenses)).toFixed(6)
    document.querySelector('#availableBalance')!.textContent =
      Number(formatEther(availableBalance)).toFixed(6)
    document.querySelector('#financialYear')!.textContent =
      financialYear === 0n ? 'Not configured' : financialYear.toString()
    document.querySelector('#administrator')!.textContent =
      shortAddress(administrator)

    showStatus('Treasury data is live from Ethereum Sepolia.')
  } catch (error) {
    console.error(error)
    showStatus('Unable to read the Sepolia contract. Please try again.', true)
  }
}

async function connectWallet() {
  const ethereum = (
    window as Window & {
      ethereum?: {
        request: (request: {
          method: string
          params?: unknown[]
        }) => Promise<unknown>
      }
    }
  ).ethereum

  if (!ethereum) {
    showStatus('MetaMask was not detected. Install or enable MetaMask.', true)
    return
  }

  try {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0xaa36a7' }],
    })

    const walletClient = createWalletClient({
      chain: sepolia,
      transport: custom(ethereum),
    })

    const [account] = await walletClient.requestAddresses()

    document.querySelector('#walletAddress')!.textContent =
      shortAddress(account)
    document.querySelector<HTMLButtonElement>('#connectWallet')!.textContent =
      shortAddress(account)

    showStatus('Wallet connected to Ethereum Sepolia.')
  } catch (error) {
    console.error(error)
    showStatus('Wallet connection was cancelled or failed.', true)
  }
}

document
  .querySelector('#connectWallet')!
  .addEventListener('click', connectWallet)

document
  .querySelector('#refreshTreasury')!
  .addEventListener('click', refreshTreasury)

refreshTreasury()
setupInteractions()