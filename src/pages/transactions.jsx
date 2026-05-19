import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigateBack } from '../hooks/useNavigateBack.js';
import {
  ArrowLeft,
  DollarSign,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  Search,
  Filter,
} from 'lucide-react';

// [MOCK] Replace with GET /providers/:id/transactions?page={n}&status={}&type={}
const ALL_TRANSACTIONS = [
  { id: 1,  date: '2025-12-18', description: 'Payment from Kwame Asante',    amount:  380, status: 'completed', method: 'Mobile Money',  jobType: 'Carpentry Work'       },
  { id: 2,  date: '2025-12-17', description: 'Withdrawal to Bank',            amount: -1000,status: 'completed', method: 'Bank Transfer'                                    },
  { id: 3,  date: '2025-12-16', description: 'Payment from Ama Frimpong',    amount:  150, status: 'completed', method: 'Cash',          jobType: 'Plumbing Repair'      },
  { id: 4,  date: '2025-12-15', description: 'Payment from John Doe',        amount:  300, status: 'pending',   method: 'Mobile Money',  jobType: 'Electrical Work'      },
  { id: 5,  date: '2025-12-14', description: 'Payment from Mary Ansah',      amount:  550, status: 'completed', method: 'Bank Transfer', jobType: 'Installation Service' },
  { id: 6,  date: '2025-12-12', description: 'Payment from Kofi Mensah',     amount:  200, status: 'completed', method: 'Mobile Money',  jobType: 'Painting'             },
  { id: 7,  date: '2025-12-10', description: 'Withdrawal to Mobile Money',   amount: -500, status: 'completed', method: 'Mobile Money'                                    },
  { id: 8,  date: '2025-12-09', description: 'Payment from Abena Owusu',     amount:  420, status: 'completed', method: 'Cash',          jobType: 'Roofing'              },
  { id: 9,  date: '2025-12-07', description: 'Payment from Yaw Darko',       amount:  180, status: 'failed',    method: 'Mobile Money',  jobType: 'Cleaning Service'     },
  { id: 10, date: '2025-12-05', description: 'Payment from Akosua Boateng',  amount:  650, status: 'completed', method: 'Bank Transfer', jobType: 'Construction Work'    },
  { id: 11, date: '2025-12-03', description: 'Payment from Kwesi Acheampong',amount:  310, status: 'pending',   method: 'Mobile Money',  jobType: 'Tiling'               },
  { id: 12, date: '2025-12-01', description: 'Withdrawal to Bank',           amount: -800, status: 'completed', method: 'Bank Transfer'                                   },
  { id: 13, date: '2025-11-28', description: 'Payment from Efua Asante',     amount:  275, status: 'completed', method: 'Cash',          jobType: 'Welding'              },
  { id: 14, date: '2025-11-25', description: 'Payment from Nana Yeboah',     amount:  490, status: 'completed', method: 'Mobile Money',  jobType: 'Plumbing Repair'      },
  { id: 15, date: '2025-11-22', description: 'Payment from Adjoa Mensah',    amount:  120, status: 'failed',    method: 'Mobile Money',  jobType: 'Cleaning Service'     },
];

const STATUS_FILTERS = ['All', 'Completed', 'Pending', 'Failed'];
const TYPE_FILTERS   = ['All', 'Payments', 'Withdrawals'];

const TransactionsPage = () => {
  const handleBackClick = useNavigateBack('/lucid/earnings', 600);
  const [search, setSearch]       = useState('');
  const [statusFilter, setStatus] = useState('All');
  const [typeFilter, setType]     = useState('All');

  const filtered = useMemo(() => {
    return ALL_TRANSACTIONS.filter(t => {
      const matchesSearch = !search ||
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.method.toLowerCase().includes(search.toLowerCase()) ||
        (t.jobType && t.jobType.toLowerCase().includes(search.toLowerCase()));

      const matchesStatus =
        statusFilter === 'All' || t.status === statusFilter.toLowerCase();

      const matchesType =
        typeFilter === 'All' ||
        (typeFilter === 'Payments'    && t.amount > 0) ||
        (typeFilter === 'Withdrawals' && t.amount < 0);

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [search, statusFilter, typeFilter]);

  const exportToCSV = () => {
    const headers = ['Date', 'Description', 'Amount (GH₵)', 'Type', 'Status', 'Method', 'Job Type'];
    const rows = filtered.map(t => [
      t.date,
      t.description,
      Math.abs(t.amount),
      t.amount < 0 ? 'Withdrawal' : 'Payment',
      t.status,
      t.method,
      t.jobType || '',
    ]);
    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const statusConfig = {
    completed: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' },
    pending:   { icon: Clock,        color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
    failed:    { icon: AlertCircle,  color: 'text-red-500',    bg: 'bg-red-100 dark:bg-red-900/30'   },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117]">
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white dark:bg-[#1a1f2e] shadow-sm sticky top-0 z-30"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBackClick}
                className="p-2 hover:bg-gray-100 dark:hover:bg-[#252b3b] rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-slate-300" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">All Transactions</h1>
                <p className="text-sm text-gray-500 dark:text-slate-400">{filtered.length} records</p>
              </div>
            </div>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#252b3b] border-2 border-gray-200 dark:border-[#2d3748] text-gray-700 dark:text-slate-300 rounded-lg hover:bg-gray-50 dark:hover:bg-[#1e293b] transition-colors font-medium text-sm"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </motion.header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, method, or job type..."
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-[#2d3748] bg-white dark:bg-[#1a1f2e] text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400 dark:text-slate-500" />
            <div className="flex gap-1">
              {TYPE_FILTERS.map(f => (
                <button
                  key={f}
                  onClick={() => setType(f)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                    typeFilter === f
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-[#1a1f2e] text-gray-600 dark:text-slate-400 border-2 border-gray-200 dark:border-[#2d3748] hover:border-blue-400'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-1">
            {STATUS_FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setStatus(f)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  statusFilter === f
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-[#1a1f2e] text-gray-600 dark:text-slate-400 border-2 border-gray-200 dark:border-[#2d3748] hover:border-blue-400'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Transaction list */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#1a1f2e] rounded-xl shadow-md overflow-hidden"
        >
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-slate-500">
              <DollarSign className="w-10 h-10 mb-3 opacity-40" />
              <p className="font-medium">No transactions found</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            filtered.map((t, i) => {
              const isWithdrawal = t.amount < 0;
              const cfg = statusConfig[t.status];
              const StatusIcon = cfg.icon;

              return (
                <div
                  key={t.id}
                  className={`flex items-center gap-4 px-6 py-4 ${
                    i !== filtered.length - 1 ? 'border-b border-gray-100 dark:border-[#1e293b]' : ''
                  }`}
                >
                  {/* Type icon */}
                  <div className={`p-2 rounded-lg flex-shrink-0 ${isWithdrawal ? 'bg-red-50 dark:bg-red-900/20' : 'bg-green-50 dark:bg-green-900/20'}`}>
                    <DollarSign className={`w-5 h-5 ${isWithdrawal ? 'text-red-500' : 'text-green-600'}`} />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-slate-100 truncate">{t.description}</p>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {t.date}
                      </span>
                      <span>{t.method}</span>
                      {t.jobType && <span>· {t.jobType}</span>}
                    </div>
                  </div>

                  {/* Status badge */}
                  <span className={`hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.color}`}>
                    <StatusIcon className="w-3 h-3" />
                    {t.status}
                  </span>

                  {/* Amount */}
                  <p className={`text-base font-bold flex-shrink-0 ${isWithdrawal ? 'text-red-500' : 'text-green-600'}`}>
                    {isWithdrawal ? '-' : '+'}GH₵{Math.abs(t.amount).toLocaleString()}
                  </p>
                </div>
              );
            })
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default TransactionsPage;
