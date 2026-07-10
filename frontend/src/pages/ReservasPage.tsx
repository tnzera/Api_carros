import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { api } from '../api/client';
import type { Carro, Cliente, Paginated, Reserva } from '../api/types';
import { Modal } from '../components/Modal';
import { Pagination } from '../components/Pagination';

const emptyForm = { carroId: '', clienteId: '', dataInicio: '', dataFim: '' };

function formatData(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

/** Converte ISO -> valor aceito pelo input datetime-local (horário local, sem segundos) */
function toInputValue(iso: string): string {
  const d = new Date(iso);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

export function ReservasPage() {
  const [result, setResult] = useState<Paginated<Reserva> | null>(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');

  // Opções dos selects do formulário
  const [carros, setCarros] = useState<Carro[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Reserva | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      setResult(await api.get<Paginated<Reserva>>(`/reservas?page=${page}&limit=10`));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar');
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  async function openModal(reserva: Reserva | null) {
    setEditing(reserva);
    setForm(
      reserva
        ? {
            carroId: String(reserva.carro.id),
            clienteId: String(reserva.cliente.id),
            dataInicio: toInputValue(reserva.dataInicio),
            dataFim: toInputValue(reserva.dataFim),
          }
        : emptyForm,
    );
    setFormError('');
    setModalOpen(true);

    // Carrega as opções (o limite 100 é o máximo aceito pela API)
    try {
      const [c1, c2] = await Promise.all([
        api.get<Paginated<Carro>>('/carros?page=1&limit=100'),
        api.get<Paginated<Cliente>>('/clientes?page=1&limit=100'),
      ]);
      setCarros(c1.data);
      setClientes(c2.data);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao carregar opções');
    }
  }

  function set(field: keyof typeof emptyForm, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError('');
    setSaving(true);
    const body = {
      carroId: Number(form.carroId),
      clienteId: Number(form.clienteId),
      dataInicio: new Date(form.dataInicio).toISOString(),
      dataFim: new Date(form.dataFim).toISOString(),
    };
    try {
      if (editing) {
        await api.patch(`/reservas/${editing.id}`, body);
      } else {
        await api.post('/reservas', body);
      }
      setModalOpen(false);
      load();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(reserva: Reserva) {
    if (!confirm(`Cancelar a reserva #${reserva.id}?`)) return;
    try {
      await api.delete(`/reservas/${reserva.id}`);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover');
    }
  }

  return (
    <>
      <header className="page-header">
        <div>
          <h1>Reservas</h1>
          <p>Acompanhe e gerencie as locações.</p>
        </div>
        <button className="btn-primary" onClick={() => openModal(null)}>
          + Criar Reserva
        </button>
      </header>

      {error && <div className="alert-error">{error}</div>}

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Cliente</th>
              <th>Veículo</th>
              <th>Retirada</th>
              <th>Devolução</th>
              <th className="th-actions">Ações</th>
            </tr>
          </thead>
          <tbody>
            {result?.data.map((reserva) => (
              <tr key={reserva.id}>
                <td className="muted">RES-{reserva.id}</td>
                <td>
                  <strong>{reserva.cliente.nome}</strong>
                </td>
                <td>
                  {reserva.carro.marca} {reserva.carro.modelo}{' '}
                  <span className="badge badge-neutral">{reserva.carro.placa}</span>
                </td>
                <td>{formatData(reserva.dataInicio)}</td>
                <td>{formatData(reserva.dataFim)}</td>
                <td className="td-actions">
                  <button className="btn-icon" onClick={() => openModal(reserva)} title="Editar">
                    ✏️
                  </button>
                  <button
                    className="btn-icon"
                    onClick={() => handleDelete(reserva)}
                    title="Cancelar"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
            {result?.data.length === 0 && (
              <tr>
                <td colSpan={6} className="empty">
                  Nenhuma reserva registrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {result && (
          <Pagination
            page={result.page}
            lastPage={result.lastPage}
            total={result.total}
            onChange={setPage}
          />
        )}
      </div>

      <Modal
        title={editing ? `Editar Reserva RES-${editing.id}` : 'Criar Reserva'}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="form">
          {formError && <div className="alert-error">{formError}</div>}

          <label>
            Carro
            <select value={form.carroId} onChange={(e) => set('carroId', e.target.value)} required>
              <option value="">Selecione um carro...</option>
              {carros.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.marca} {c.modelo} — {c.placa} (R$ {c.diaria}/dia)
                </option>
              ))}
            </select>
          </label>

          <label>
            Cliente
            <select
              value={form.clienteId}
              onChange={(e) => set('clienteId', e.target.value)}
              required
            >
              <option value="">Selecione um cliente...</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome} — {c.email}
                </option>
              ))}
            </select>
          </label>

          <div className="form-row">
            <label>
              Retirada
              <input
                type="datetime-local"
                value={form.dataInicio}
                onChange={(e) => set('dataInicio', e.target.value)}
                required
              />
            </label>
            <label>
              Devolução
              <input
                type="datetime-local"
                value={form.dataFim}
                onChange={(e) => set('dataFim', e.target.value)}
                required
              />
            </label>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
