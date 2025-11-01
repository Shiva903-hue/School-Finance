import React from 'react';
import VoucherForm from '../../All-Forms/User-Forms/VoucherForm';
import TransactionForm from '../../All-Forms/User-Forms/TransactionForm';
import StatusView from '../StatusView';

export default function DailyTransaction({ activeItem }) {
  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50 mt-16 md:mt-0 pb-24 md:pb-8">
      {activeItem === 'Transaction' && <TransactionForm />}
      {activeItem === 'status-view' && <StatusView />}
      {activeItem === 'VoucherForm' && <VoucherForm />}
    </main>
  );
}
