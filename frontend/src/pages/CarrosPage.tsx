import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { api } from '../api/client';
import type { Carro, Paginated } from '../api/types';
import { Modal } from '../components/Modal';
import { Pagination } from '../components/Pagination';

const emptyForm = { marca: '', modelo: '', placa: '', diaria: '' };

export function CarrosPage() {
  const [result, setResult] = useState<Paginated<Carro> | null>(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Carro | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      setResult(await api.get<Paginated<Carro>>(`/carros?page=${page}&limit=10`));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar');
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setFormError('');
    setModalOpen(true);
  }

  function openEdit(carro: Carro) {
    setEditing(carro);
    setForm({
      marca: carro.marca,
      modelo: carro.modelo,
      placa: carro.placa,
      diaria: String(carro.diaria),
    });
    setFormError('');
    setModalOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError('');
    setSaving(true);
    const body = { ...form, diaria: Number(form.diaria) };
    try {
      if (editing) {
        await api.patch(`/carros/${editing.id}`, body);
      } else {
        await api.post('/carros', body);
      }
      setModalOpen(false);
      load();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(carro: Carro) {
    if (!confirm(`Remover o carro ${carro.marca} ${carro.modelo} (${carro.placa})?`)) return;
    try {
      await api.delete(`/carros/${carro.id}`);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover');
    }
  }

  return (
    <>
      <header className="page-header">
        <div>
          <h1>Carros</h1>
          <p>Visualize e administre a frota de veículos.</p>
        </div>
        <button className="btn-primary" onClick={openCreate}>
          + Cadastrar Carro
        </button>
      </header>

      {error && <div className="alert-error">{error}</div>}

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Marca / Modelo</th>
              <th>Placa</th>
              <th>Diária</th>
              <th className="th-actions">Ações</th>
            </tr>
          </thead>
          <tbody>
            {result?.data.map((carro) => (
              <tr key={carro.id}>
                <td>
                  <strong>{carro.modelo}</strong>
                  <small className="muted"> {carro.marca}</small>
                </td>
                <td>
                  <span className="badge badge-neutral">{carro.placa}</span>
                </td>
                <td>
                  {carro.diaria.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  <small className="muted">/dia</small>
                </td>
                <td className="td-actions">
                  <button className="btn-icon" onClick={() => openEdit(carro)} title="Editar">
                    ✏️
                  </button>
                  <button className="btn-icon" onClick={() => handleDelete(carro)} title="Remover">
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
            {result?.data.length === 0 && (
              <tr>
                <td colSpan={4} className="empty">
                  Nenhum carro cadastrado.
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
        title={editing ? 'Editar Carro' : 'Cadastrar Carro'}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="form">
          {formError && <div className="alert-error">{formError}</div>}

          <div className="form-row">
            <label>
              Marca
              <input
                value={form.marca}
                onChange={(e) => setForm((f) => ({ ...f, marca: e.target.value }))}
                required
              />
            </label>
            <label>
              Modelo
              <input
                value={form.modelo}
                onChange={(e) => setForm((f) => ({ ...f, modelo: e.target.value }))}
                required
              />
            </label>
          </div>

          <div className="form-row">
            <label>
              Placa
              <input
                value={form.placa}
                onChange={(e) => setForm((f) => ({ ...f, placa: e.target.value }))}
                placeholder="ABC1D23"
                required
              />
            </label>
            <label>
              Diária (R$)
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={form.diaria}
                onChange={(e) => setForm((f) => ({ ...f, diaria: e.target.value }))}
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
