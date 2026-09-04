import {
  createPublicClient,
  createWalletClient,
  custom,
    http,
  parseEther,
  type EIP1193Provider,
} from 'viem'
import { sepolia } from 'viem/chains'

const contractAddress =
  '0x6ff4dc5f51a2f16c21b53844a1111ef69e4d316b' as const

const interactionAbi = [
  {
    type: 'function',
    name: 'sponsor',
    stateMutability: 'payable',
    inputs: [],
    outputs: [],
  },
  {
    type: 'function',
    name: 'payMembership',
    stateMutability: 'payable',
    inputs: [{ name: 'financialYear', type: 'uint256' }],
    outputs: [],
  },
  {
    type: 'function',
    name: 'myMembershipStatus',
    stateMutability: 'view',
    inputs: [{ name: 'financialYear', type: 'uint256' }],
    outputs: [
      { name: 'annualFee', type: 'uint256' },
      { name: 'paid', type: 'uint256' },
      { name: 'outstanding', type: 'uint256' },
      { name: 'credit', type: 'uint256' },
    ],
  },
  {
    type: 'function',
    name: 'setFinancialYear',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'financialYear', type: 'uint256' }],
    outputs: [],
  },
  {
    type: 'function',
    name: 'registerMember',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'account', type: 'address' },
      { name: 'category', type: 'uint8' },
    ],
    outputs: [],
  },
] as const

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(),
})
const formatNad = (amount: bigint) =>
  `N$${(Number(amount) / 100).toFixed(2)}`

const showStatus = (message: string, error = false) => {
  const status = document.querySelector<HTMLParagraphElement>('#status')!
  status.textContent = message
  status.classList.toggle('error', error)
}

async function getWallet() {
  const ethereum = (
    window as Window & { ethereum?: EIP1193Provider }
  ).ethereum

  if (!ethereum) {
    throw new Error('MetaMask was not detected.')
  }

  await ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: '0xaa36a7' }],
  })

  const client = createWalletClient({
    chain: sepolia,
    transport: custom(ethereum),
  })

  const [account] = await client.requestAddresses()

  return { client, account }
}

async function completeTransaction(
  message: string,
  action: () => Promise<`0x${string}`>,
) {
  try {
    showStatus(`${message} Confirm the transaction in MetaMask…`)
    const hash = await action()

    showStatus('Transaction submitted. Waiting for Sepolia confirmation…')
    await publicClient.waitForTransactionReceipt({ hash })

    showStatus('Transaction confirmed on Ethereum Sepolia.')
  } catch (error) {
    console.error(error)
    showStatus(
      error instanceof Error ? error.message : 'Transaction failed.',
      true,
    )
  }
}

export function setupInteractions() {
  const details = document.querySelector('.details')!

  details.insertAdjacentHTML(
    'afterend',
    `
      <section class="section-heading action-heading">
        <div>
          <p class="eyebrow">INTERACTIVE WORKFLOW</p>
          <h2>Manage the fund</h2>
        </div>
      </section>

      <section class="action-grid">
        <article class="action-card">
          <span class="step">01 · MEMBER</span>
          <h3>Membership status</h3>
          <p>View your annual fee, payments, outstanding balance and credit.</p>

          <label>
            Financial year
            <input id="statusYear" type="number" value="2026" min="1" />
          </label>

          <button id="checkMembership" class="wide secondary">
            Check my status
          </button>

          <div class="member-results">
            <div><span>Annual fee</span><strong id="annualFee">—</strong></div>
            <div><span>Paid</span><strong id="memberPaid">—</strong></div>
            <div><span>Outstanding</span><strong id="outstanding">—</strong></div>
            <div><span>Credit</span><strong id="credit">—</strong></div>
          </div>
                 
            <label for="membershipAmount">Payment amount (NAD demo value)</label>
              <input
             id="membershipAmount"
             type="number"
             value="150"
             min="0.01"
             step="0.01"
              />
         
          <button id="payMembership" class="wide">Pay membership</button>
        </article>

        <article class="action-card sponsor-card">
          <span class="step">02 · SPONSOR</span>
          <h3>Support the club</h3>
          <p>
            Send a transparent sponsorship contribution directly to the
            Ubuntu Fund treasury.
          </p>

          <label>
            Sponsorship amount in Sepolia ETH
            <input
              id="sponsorAmount"
              type="number"
              value="0.00001"
              min="0"
              step="0.000001"
            />
          </label>

          <button id="sponsorFund" class="wide">Sponsor Ubuntu Fund</button>

          <div class="trust-note">
            <strong>Public and traceable</strong>
            <span>
              Every contribution is recorded on Ethereum Sepolia.
            </span>
          </div>
        </article>

        <article class="action-card">
          <span class="step">03 · ADMINISTRATOR</span>
          <h3>Set up membership</h3>
          <p>
            Administrator-only controls for the financial year and member
            registration.
          </p>

          <label>
            Current financial year
            <input id="adminYear" type="number" value="2026" min="1" />
          </label>

          <button id="setYear" class="wide secondary">
            Set financial year
          </button>

          <label>
            Membership category
            <select id="memberCategory">
              <option value="0">Student — Active</option>
              <option value="1">Student — Casual</option>
              <option value="2">Junior — Under 16</option>
              <option value="3">Alumni/Working Adult — Active</option>
              <option value="4">Alumni/Working Adult — Casual</option>
              <option value="5">Executive — Non-Playing</option>
              <option value="6">Executive — Active</option>
            </select>
          </label>

          <button id="registerMember" class="wide">
            Register connected wallet
          </button>
        </article>
      </section>
    `,
  )

  document
    .querySelector('#sponsorFund')!
    .addEventListener('click', async () => {
      const amount = (
        document.querySelector<HTMLInputElement>('#sponsorAmount')!
      ).value

      await completeTransaction('Preparing sponsorship.', async () => {
        const { client, account } = await getWallet()

        return client.writeContract({
          account,
          address: contractAddress,
          abi: interactionAbi,
          functionName: 'sponsor',
          value: parseEther(amount),
        })
      })
    })

  document
    .querySelector('#setYear')!
    .addEventListener('click', async () => {
      const year = BigInt(
        document.querySelector<HTMLInputElement>('#adminYear')!.value,
      )

      await completeTransaction('Updating financial year.', async () => {
        const { client, account } = await getWallet()

        return client.writeContract({
          account,
          address: contractAddress,
          abi: interactionAbi,
          functionName: 'setFinancialYear',
          args: [year],
        })
      })
    })

  document
    .querySelector('#registerMember')!
    .addEventListener('click', async () => {
      const category = Number(
        document.querySelector<HTMLSelectElement>('#memberCategory')!.value,
      )

      await completeTransaction('Registering member.', async () => {
        const { client, account } = await getWallet()

        return client.writeContract({
          account,
          address: contractAddress,
          abi: interactionAbi,
          functionName: 'registerMember',
          args: [account, category],
        })
      })
    })

  document
    .querySelector('#payMembership')!
    .addEventListener('click', async () => {
      const year = BigInt(
        document.querySelector<HTMLInputElement>('#statusYear')!.value,
      )
      const amountNad = Number(
      document.querySelector<HTMLInputElement>('#membershipAmount')!.value,
    )
const amountCents = BigInt(Math.round(amountNad * 100))

      await completeTransaction('Preparing membership payment.', async () => {
        const { client, account } = await getWallet()

        return client.writeContract({
          account,
          address: contractAddress,
          abi: interactionAbi,
          functionName: 'payMembership',
          args: [year],
         value: amountCents,
        })
      })
    })

  document
    .querySelector('#checkMembership')!
    .addEventListener('click', async () => {
      try {
        showStatus('Reading your membership status…')

        const { account } = await getWallet()
        const year = BigInt(
          document.querySelector<HTMLInputElement>('#statusYear')!.value,
        )

        const [annualFee, paid, outstanding, credit] =
          await publicClient.readContract({
            account,
            address: contractAddress,
            abi: interactionAbi,
            functionName: 'myMembershipStatus',
            args: [year],
          })

        document.querySelector('#annualFee')!.textContent =
        formatNad(annualFee)
        document.querySelector('#memberPaid')!.textContent =
        formatNad(paid)
        document.querySelector('#outstanding')!.textContent =
        formatNad(outstanding)
        document.querySelector('#credit')!.textContent =
        formatNad(credit)
        showStatus('Membership status loaded from Ethereum Sepolia.')
      } catch (error) {
        console.error(error)
        showStatus(
          'Status unavailable. The connected wallet may not be registered yet.',
          true,
        )
      }
    })
}
