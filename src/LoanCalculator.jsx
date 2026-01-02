import React, { useState, useEffect } from 'react';

export default function LoanCalculator() {
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState('');
  const [months, setMonths] = useState('');
  const [results, setResults] = useState({
    flatEmi: '—',
    flatRate: '—',
    totalInterest: '—'
  });
  const [schedule, setSchedule] = useState([]);
  const [showSchedule, setShowSchedule] = useState(false);

  const formatNumber = (num) => {
    const s = String(num);
    const [intPart, decPart] = s.split('.');
    const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return decPart !== undefined ? `${formattedInt}.${decPart}` : formattedInt;
  };

  const removeCommas = (str) => String(str).replace(/,/g, '');

  const handleAmountChange = (e) => {
    let value = removeCommas(e.target.value);
    // allow digits only
    value = value.replace(/[^\d]/g, '');
    if (value) {
      setAmount(formatNumber(value));
    } else {
      setAmount('');
    }
  };

  const calculate = () => {
    const P = parseFloat(removeCommas(amount)) || 0;
    const annualReducingRate = parseFloat(rate);
    const n = parseInt(months, 10) || 0;

    // Principal and months are required; rate can be empty/0
    if (!P || !n) {
      setResults({ flatEmi: '—', flatRate: '—', totalInterest: '—' });
      setSchedule([]);
      return;
    }

    const r = (isNaN(annualReducingRate) ? 0 : annualReducingRate) / 12 / 100;

    let emi, totalPaid, totalInterest;
    if (r === 0) {
      emi = P / n;
      totalPaid = P;
      totalInterest = 0;
    } else {
      emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      totalPaid = emi * n;
      totalInterest = totalPaid - P;
    }

    const flatRateEq = P > 0 ? (totalInterest / P / (n / 12)) * 100 : 0;
    const flatEmi = totalPaid / n;

    setResults({
      flatEmi: '$' + formatNumber(Number(flatEmi).toFixed(2)),
      flatRate: flatRateEq.toFixed(2) + '%',
      totalInterest: '$' + formatNumber(Number(totalInterest).toFixed(0))
    });

    const scheduleData = [];
    for (let i = 1; i <= n; i++) {
      scheduleData.push({ month: i, payment: '$' + formatNumber(Number(flatEmi).toFixed(2)) });
    }
    setSchedule(scheduleData);
  };

  useEffect(() => {
    calculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, rate, months]);

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; background: radial-gradient(ellipse 800px 600px at 50% -20%, rgba(251, 191, 36, 0.15), transparent), #0a0e1a; min-height: 100vh; }
        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
        .schedule-container::-webkit-scrollbar { width: 6px; }
        .schedule-container::-webkit-scrollbar-track { background: transparent; }
        .schedule-container::-webkit-scrollbar-thumb { background: #fbbf24; border-radius: 10px; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div style={{ minHeight: '100vh', padding: '20px 16px 100px', maxWidth: '480px', margin: '0 auto', color: '#f9fafb', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px', paddingTop: '8px' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700', margin: '0 0 8px', background: 'linear-gradient(135deg, #fbbf24, #fcd34d)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>💰 AutoLoan Car Installments Plan</h1>
          <p style={{ fontSize: '0.875rem', color: '#9ca3af', margin: 0 }}>Calculate your monthly installments</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: '#111827', borderRadius: '20px', padding: '20px', border: '1px solid rgba(251, 191, 36, 0.15)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem', color: '#9ca3af', marginBottom: '12px', fontWeight: '500' }}>
              <span>Loan Amount</span>
              <span style={{ fontSize: '1.25rem' }}>💵</span>
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '1.25rem', color: '#fbbf24', fontWeight: '600', pointerEvents: 'none' }}>$</span>
              <input
                type="text"
                value={amount}
                onChange={handleAmountChange}
                onFocus={(e) => e.target.select()}
                inputMode="numeric"
                placeholder="e.g. 600000"
                style={{ width: '100%', padding: '16px 16px 16px 44px', borderRadius: '14px', border: '2px solid transparent', background: 'rgba(0, 0, 0, 0.3)', color: '#f9fafb', fontSize: '1.25rem', fontWeight: '600', transition: 'all 0.3s ease', outline: 'none' }}
                onFocusCapture={(e) => { e.target.style.borderColor = '#fbbf24'; e.target.style.background = 'rgba(0, 0, 0, 0.5)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'transparent'; e.target.style.background = 'rgba(0, 0, 0, 0.3)'; }}
              />
            </div>
          </div>

          <div style={{ background: '#111827', borderRadius: '20px', padding: '20px', border: '1px solid rgba(251, 191, 36, 0.15)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem', color: '#9ca3af', marginBottom: '12px', fontWeight: '500' }}>
              <span>Annual Rate</span>
              <span style={{ fontSize: '1.25rem' }}>📊</span>
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '1.25rem', color: '#fbbf24', fontWeight: '600', pointerEvents: 'none' }}>%</span>
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                onFocus={(e) => e.target.select()}
                step="0.01"
                placeholder="e.g. 22"
                inputMode="decimal"
                style={{ width: '100%', padding: '16px 16px 16px 44px', borderRadius: '14px', border: '2px solid transparent', background: 'rgba(0, 0, 0, 0.3)', color: '#f9fafb', fontSize: '1.25rem', fontWeight: '600', transition: 'all 0.3s ease', outline: 'none' }}
                onFocusCapture={(e) => { e.target.style.borderColor = '#fbbf24'; e.target.style.background = 'rgba(0, 0, 0, 0.5)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'transparent'; e.target.style.background = 'rgba(0, 0, 0, 0.3)'; }}
              />
            </div>
          </div>

          <div style={{ background: '#111827', borderRadius: '20px', padding: '20px', border: '1px solid rgba(251, 191, 36, 0.15)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem', color: '#9ca3af', marginBottom: '12px', fontWeight: '500' }}>
              <span>Months</span>
              <span style={{ fontSize: '1.25rem' }}>📅</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="number"
                min="1"
                value={months}
                onChange={(e) => setMonths(e.target.value)}
                onFocus={(e) => e.target.select()}
                inputMode="numeric"
                placeholder="e.g. 84"
                style={{ width: '100%', padding: '16px', borderRadius: '14px', border: '2px solid transparent', background: 'rgba(0, 0, 0, 0.3)', color: '#f9fafb', fontSize: '1.25rem', fontWeight: '600', transition: 'all 0.3s ease', outline: 'none' }}
                onFocusCapture={(e) => { e.target.style.borderColor = '#fbbf24'; e.target.style.background = 'rgba(0, 0, 0, 0.5)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'transparent'; e.target.style.background = 'rgba(0, 0, 0, 0.3)'; }}
              />
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.05))', border: '1px solid rgba(251, 191, 36, 0.15)', borderRadius: '24px', padding: '24px', marginBottom: '16px', backdropFilter: 'blur(10px)', animation: 'slideUp 0.4s ease-out' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>💳</div>
              <div style={{ fontSize: '0.875rem', color: '#9ca3af', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Monthly Payment</div>
            </div>
            <p style={{ fontSize: '2rem', fontWeight: '700', color: '#fcd34d', margin: 0, lineHeight: 1 }}>{results.flatEmi}</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' }}>
              <div style={{ background: 'rgba(0, 0, 0, 0.3)', borderRadius: '14px', padding: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Flat Rate</div>
                <div style={{ fontSize: '1.125rem', fontWeight: '700', color: '#f9fafb' }}>{results.flatRate}</div>
              </div>
              <div style={{ background: 'rgba(0, 0, 0, 0.3)', borderRadius: '14px', padding: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Interest</div>
                <div style={{ fontSize: '1.125rem', fontWeight: '700', color: '#f9fafb' }}>{results.totalInterest}</div>
              </div>
            </div>
          </div>
        </div>

        <button onClick={() => setShowSchedule(!showSchedule)} style={{ width: '100%', padding: '18px', borderRadius: '16px', background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', border: 'none', fontSize: '1rem', fontWeight: '700', color: '#000', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: '0 8px 24px rgba(251, 191, 36, 0.3)', marginBottom: '16px' }}>
          <span>{showSchedule ? 'Hide Payment Schedule' : 'View Payment Schedule'}</span>
          <span style={{ fontSize: '1.125rem', transition: 'transform 0.3s ease', transform: showSchedule ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
        </button>

        <div className="schedule-container" style={{ maxHeight: showSchedule ? '500px' : '0', overflow: showSchedule ? 'auto' : 'hidden', transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)', background: '#111827', borderRadius: '20px', border: '1px solid rgba(251, 191, 36, 0.15)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ position: 'sticky', top: 0, background: '#111827', zIndex: 1 }}>
              <tr>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.75rem', color: '#9ca3af', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid rgba(251, 191, 36, 0.15)' }}>Month</th>
                <th style={{ padding: '16px', textAlign: 'right', fontSize: '0.75rem', color: '#9ca3af', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid rgba(251, 191, 36, 0.15)' }}>Payment</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((item, index) => (
                <tr key={index}>
                  <td style={{ padding: '14px 16px', fontSize: '0.9rem', color: '#f9fafb', borderBottom: index === schedule.length - 1 ? 'none' : '1px solid rgba(255, 255, 255, 0.05)' }}>Month {item.month}</td>
                  <td style={{ padding: '14px 16px', fontSize: '0.9rem', color: '#f9fafb', textAlign: 'right', fontWeight: '600', borderBottom: index === schedule.length - 1 ? 'none' : '1px solid rgba(255, 255, 255, 0.05)' }}>{item.payment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
