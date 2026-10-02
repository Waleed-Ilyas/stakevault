'use client';

import { useState } from 'react';
import { calculateStakeSummary, deriveRiskIndex, formatTokenAmount } from '@/lib/staking';

const initialStakeRows = [
  { wallet: 'DemoStakeA', amount: 1200, status: 'active', reward: 9.8 },
  { wallet: 'DemoStakeB', amount: 620, status: 'cooldown', reward: 10.1 },
  { wallet: 'DemoStakeC', amount: 940, status: 'ready', reward: 8.9 },
];

export default function Page() {
  const [stakeRows, setStakeRows] = useState(initialStakeRows);
  const [stakedAmount, setStakedAmount] = useState(2840);
  const [inputAmount, setInputAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [txSig, setTxSig] = useState('');

  const summary = calculateStakeSummary({
    principal: stakedAmount,
    apy: 9.8,
    days: 30,
    cooldownWindowHours: 72,
  });

  const utilization = deriveRiskIndex(stakedAmount, 8000);

  const handleStake = async () => {
    const amt = parseFloat(inputAmount);
    if (!amt || amt <= 0) return;
    
    setIsProcessing(true);
    setTxSig('');
    // Simulate transaction
    await new Promise(r => setTimeout(r, 1500));
    setStakedAmount(prev => prev + amt);
    setStakeRows([{ wallet: 'YourWallet', amount: amt, status: 'active', reward: 9.8 }, ...stakeRows]);
    setTxSig('3x' + Math.random().toString(36).substring(2, 15) + '...devnet');
    setInputAmount('');
    setIsProcessing(false);
  };

  const handleUnstake = async (wallet: string) => {
    setIsProcessing(true);
    // Simulate unstake to cooldown
    await new Promise(r => setTimeout(r, 1000));
    setStakeRows(rows => rows.map(r => r.wallet === wallet ? { ...r, status: 'cooldown' } : r));
    setIsProcessing(false);
  };

  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-dot" />
          <span>StakeVault</span>
        </div>

        <div className="mini-actions">
          <span style={{ fontSize: 12, color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)', padding: '4px 8px', borderRadius: 4 }}>Devnet Only</span>
          <button className="primary" onClick={() => document.getElementById('stake-panel')?.scrollIntoView({ behavior: 'smooth' })}>Stake tokens</button>
        </div>
      </header>

      <section className="hero">
        <div className="card">
          <div className="kicker">SPL staking flow</div>
          <h1>Earn yield without leaving the vault.</h1>
          <p className="subtitle">
            StakeVault is a devnet-only staking dashboard prototype for a SPL token pool. It models vault lifecycle states, reward projection, cooldown windows, and pool health for a realistic portfolio demo.
          </p>
          
          <div id="stake-panel" style={{ marginTop: 24, padding: 16, background: 'rgba(15, 23, 42, 0.5)', borderRadius: 12, border: '1px solid rgba(148, 163, 184, 0.2)' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: 14 }}>Stake to Devnet Pool</h3>
            <div style={{ display: 'flex', gap: 12 }}>
              <input type="number" value={inputAmount} onChange={e => setInputAmount(e.target.value)} placeholder="Amount to stake (SOL)" style={{ flex: 1, padding: '8px 12px', borderRadius: 8, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(148, 163, 184, 0.3)', color: '#fff' }} />
              <button className="primary" onClick={handleStake} disabled={isProcessing || !inputAmount}>
                {isProcessing ? 'Confirming...' : 'Deposit'}
              </button>
            </div>
            {txSig && (
              <div style={{ marginTop: 12, padding: 8, background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: 6, fontSize: 12, border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <strong>Success!</strong> Stake confirmed. Sig: {txSig}
              </div>
            )}
          </div>
        </div>

        <div className="card shrink">
          <div className="meta">Live vault snapshot</div>
          <div className="stat-value">{formatTokenAmount(summary.total)} SOL</div>
          <p className="note">Projected 30-day yield: {formatTokenAmount(summary.reward)} SOL at {summary.apy}% APR.</p>
          <div className="meter" aria-label="vault utilization meter">
            <div className="meter-fill" style={{ width: utilization + '%' }} />
          </div>
          <p className="note">Pool utilization: {utilization}% - cooldown window: {summary.cooldownWindowHours}h</p>
        </div>
      </section>

      <section className="stats">
        {[
          { label: 'Total staked', value: formatTokenAmount(stakedAmount) + ' SOL', meta: 'across ' + stakeRows.length + ' wallets' },
          { label: 'APY', value: summary.apy + '%', meta: 'variable rate' },
          { label: 'Rewards', value: formatTokenAmount(summary.reward), meta: 'this month' },
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
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {stakeRows.map((row) => (
                <tr key={row.wallet}>
                  <td>{row.wallet}</td>
                  <td>{formatTokenAmount(row.amount)} SOL</td>
                  <td>{row.reward}%</td>
                  <td>
                    <span className={'badge ' + row.status}>
                      {row.status === 'active' ? 'Active' : row.status === 'cooldown' ? 'Cooldown' : 'Ready'}
                    </span>
                  </td>
                  <td>
                    {row.status === 'active' ? (
                      <button className="pill" style={{ padding: '4px 8px', fontSize: 11 }} onClick={() => handleUnstake(row.wallet)} disabled={isProcessing}>Unstake</button>
                    ) : (
                      <span style={{ fontSize: 11, color: '#94a3b8' }}>{row.status === 'cooldown' ? 'Waiting' : 'Claimable'}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <aside className="panel">
          <div className="card">
            <h3 style={{ margin: '0 0 12px 0', fontSize: 16 }}>About this project</h3>
            <p className="note" style={{ lineHeight: 1.5, color: '#9db7c8' }}>
              StakeVault is a Devnet-only Solana staking dashboard prototype. It demonstrates realistic UI states for staking, unstaking, and cooldown periods. It avoids claiming a live smart contract deployment, showcasing honest prototyping.
            </p>
            <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
               <a href="https://github.com/Waleed-Ilyas/stakevault" target="_blank" rel="noreferrer" style={{ color: '#38bdf8', fontSize: 13, textDecoration: 'none' }}>View on GitHub</a>
               <a href="/work/stakevault" target="_blank" rel="noreferrer" style={{ color: '#38bdf8', fontSize: 13, textDecoration: 'none' }}>Read Case Study</a>
            </div>
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
