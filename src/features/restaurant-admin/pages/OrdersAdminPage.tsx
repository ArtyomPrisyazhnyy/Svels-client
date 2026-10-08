'use client';

import '../styles/account-admin.scss';

export default function OrdersAdminPage() {
  return (
    <section className="account-admin">
      <header className="account-admin__header">
        <h2>Заказы</h2>
        <p className="account-admin__intro">
          Живая очередь предзаказов появится здесь. Пока раздел в разработке — роли уже
          разведены: зал и производство увидят только заказы, без меню и настроек.
        </p>
      </header>
    </section>
  );
}
