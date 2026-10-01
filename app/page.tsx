import { calculateStakeSummary, deriveRiskIndex, formatTokenAmount } from '@/lib/staking';

const stakeRows = [
  { wallet: 'DemoStakeA', amount: 1200, status: 'active', reward: 9.8 },
  { wallet: 'DemoStakeB', amount: 620, status: 'cooldown', reward: 10.1 },
  { wallet: 'DemoStakeC', amount: 940, status: 'ready', reward: 8.9 },
];

const summary = calculateStakeSummary({
  principal: 2840,
  apy: 9.8,
  days: 30,
  cooldownWindowHours: 72,
});

export default function Page() {
  const utilization = deriveRiskIndex(2840, 8000);

  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-dot" />
          <span>StakeVault</span>
        </div>

        <div className="mini-actions">
          <button className="pill">Devnet only</button>
          <button className="primary">Stake tokens</button>
        </div>
      </header>

      <section className="hero">
        <div className="card">
          <div className="kicker">SPL staking flow</div>
          <h1>Earn yield without leaving the vault.</h1>
          <p className="subtitle">
            StakeVault is a devnet-only staking dashboard prototype for a SPL token pool. It models vault lifecycle states, reward projection, cooldown windows, and pool health for a realistic portfolio demo.
          </p>

          <div className="hero-actions">
            <button className="primary">Connect wallet</button>
            <button className="ghost">View rewards</button>
          </div>
        </div>

        <div className="card shrink">
          <div className="meta">Live vault snapshot</div>
          <div className="stat-value">{formatTokenAmount(summary.total)} SOL</div>
          <p className="note">Projected 30-day yield: {formatTokenAmount(summary.reward)} SOL at {summary.apy}% APR.</p>
          <div className="meter" aria-label="vault utilization meter">
            <div className="meter-fill" style={{ width: `${utilization}%` }} />
          </div>
          <p className="note">Pool utilization: {utilization}% · cooldown window: {summary.cooldownWindowHours}h</p>
        </div>
      </section>

      <section className="stats">
        {[
          { label: 'Total staked', value: `${formatTokenAmount(2840)} SOL`, meta: 'across 3 wallets' },
          { label: 'APY', value: `${summary.apy}%`, meta: 'variable rate' },
          { label: 'Rewards', value: `${formatTokenAmount(summary.reward)}`, meta: 'this month' },
          { label: 'Cooldown', value: '72 hrs', meta: 'before unstake' },
        ].map((stat) => (
          <div key={stat.label} className="card">
            <div className="meta">{stat.label}</div>
            <div className="stat-value">{stat.value}</div>
            <p className="note">{stat.meta}</p>
          </div>
        ))}
      </section>

      <section className="grid">
        <div className="card">
          <div className="meta">Stake positions</div>
          <table className="table">
            <thead>
              <tr>
                <th>Wallet</th>
                <th>Amount</th>
                <th>Yield</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stakeRows.map((row) => (
                <tr key={row.wallet}>
                  <td>{row.wallet}</td>
                  <td>{formatTokenAmount(row.amount)} SOL</td>
                  <td>{row.reward}%</td>
                  <td>
                    <span className={`badge ${row.status}`}>
                      {row.status === 'active' ? 'Active' : row.status === 'cooldown' ? 'Cooldown' : 'Ready'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <aside className="panel">
          <div className="card">
            <div className="meta">Reward logic</div>
            <p className="note">
              Rewards are applied as a proportional APR model over a fixed staking window. The UI simulates reward accrual, cooldown compliance, and pool health before any real on-chain claim is attempted.
            </p>
          </div>

          <div className="card">
            <div className="meta">Security notes</div>
            <p className="note">
              This demo intentionally warns that production settlement requires a verified Anchor program, wallet signing, and devnet-only testing before any real funds move.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
