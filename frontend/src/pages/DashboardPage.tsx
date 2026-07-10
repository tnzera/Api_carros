import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import type { Carro, Cliente, Paginated, Reserva } from '../api/types';
import { useAuth } from '../auth/AuthContext';

interface Stats {
  carros: number;
  clientes: number;
  reservas: number;
}

export function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // limit=1: só precisamos do campo `total` de cada listagem paginada
    Promise.all([
      api.get<Paginated<Carro>>('/carros?page=1&limit=1'),
      api.get<Paginated<Cliente>>('/clientes?page=1&limit=1'),
      api.get<Paginated<Reserva>>('/reservas?page=1&limit=1'),
    ])
      .then(([carros, clientes, reservas]) =>
        setStats({ carros: carros.total, clientes: clientes.total, reservas: reservas.total }),
      )
      .catch((err) => setError(err instanceof Error ? err.message : 'Erro ao carregar'));
  }, []);

  const cards = [
    { label: 'Total de Carros', value: stats?.carros, icon: '🚗', to: '/carros' },
    { label: 'Total de Clientes', value: stats?.clientes, icon: '👥', to: '/clientes' },
    { label: 'Total de Reservas', value: stats?.reservas, icon: '📅', to: '/reservas' },
  ];

  return (
    <>
      <header className="page-header">
        <div>
          <h1>Visão Geral</h1>
          <p>Bem-vindo(a), {user?.nome}.</p>
        </div>
      </header>

      {error && <div className="alert-error">{error}</div>}

      <div className="stat-grid">
        {cards.map((card) => (
          <Link to={card.to} key={card.label} className="stat-card">
            <div className="stat-top">
              <span className="stat-label">{card.label}</span>
              <span className="stat-icon">{card.icon}</span>
            </div>
            <span className="stat-value">{card.value ?? '—'}</span>
          </Link>
        ))}
      </div>

      <div className="card">
        <h2>Ações Rápidas</h2>
        <div className="quick-actions">
          <Link to="/reservas" className="btn-primary">
            + Nova Reserva
          </Link>
          <Link to="/carros" className="btn-secondary">
            Cadastrar Veículo
          </Link>
          <Link to="/clientes" className="btn-secondary">
            Cadastrar Cliente
          </Link>
        </div>
      </div>
    </>
  );
}
